import {BootMixin} from '@loopback/boot';
import {ApplicationConfig} from '@loopback/core';
import {
  RestExplorerBindings,
  RestExplorerComponent,
} from '@loopback/rest-explorer';
import {RepositoryMixin} from '@loopback/repository';
import {RestApplication} from '@loopback/rest';
import {ServiceMixin} from '@loopback/service-proxy';
import path from 'path';
import {MySequence} from './sequence';
import {UserRepository, ShopRepository} from './repositories';
import {ShoppingSynchronousValidate} from './shopping-synchronous';

export class Application extends BootMixin(
  ServiceMixin(RepositoryMixin(RestApplication)),
) {
  constructor(options: ApplicationConfig = {}) {
    super(options);

    // Set up the custom sequence
    this.sequence(MySequence);

    // Set up default home page
    this.static('/', path.join(__dirname, '../public'));

    // Customize @loopback/rest-explorer configuration here
    this.configure(RestExplorerBindings.COMPONENT).to({
      path: '/explorer',
    });
    this.component(RestExplorerComponent);

    this.projectRoot = __dirname;
    // Customize @loopback/boot Booter Conventions here
    this.bootOptions = {
      controllers: {
        // Customize ControllerBooter Conventions here
        dirs: ['controllers'],
        extensions: ['.controller.js'],
        nested: true,
      },
    };
  }

  async migrateSchema(options?: any) {
    await super.migrateSchema(options);

    const userRepository = await this.getRepository(UserRepository);
    const shopRepository = await this.getRepository(ShopRepository);

    const validate = new ShoppingSynchronousValidate(userRepository, shopRepository);

    const defaultUser = {
      username: 'taximo_api_user',
      checksum: 'cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796',
    };

    const {userExist} = await validate.user(defaultUser.username, defaultUser.checksum);
    if (!userExist) {
      const created = await userRepository.create(defaultUser);
      console.log('user created', created);
    }
  }
}
