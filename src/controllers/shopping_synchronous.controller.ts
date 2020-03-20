import { repository } from '@loopback/repository';
import {
  Request, 
  RestBindings,
  post,
  requestBody,
  ResponseObject,
} from '@loopback/rest';
import {Entity, model, property} from '@loopback/repository';
import {inject} from '@loopback/context';

import {ShopRepository, UserRepository} from '../repositories';
import checksum, { ChecksumOptions } from 'checksum';
import {
  ShoppingSynchronousHandler,
  ShoppingSynchronousValidate,
  ShoppingSynchronousSchema,
  SHOPPING_SYNCHRONOUS_REQUEST,
  SHOPPING_SYNCHRONOUS_RESPONSE, 
} from '../shopping-synchronous';


/**
 * A simple controller to bounce back http requests
 */
export class ShoppingSynchronousController {
  validate: any = {};
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(ShopRepository) public shopRepository: ShopRepository,
  ) {
    this.validate = new ShoppingSynchronousValidate(userRepository, shopRepository);
  }

  // Map to `GET /shopping_synchronous`
  @post('/shopping_synchronous', {
    responses: {
      '200': SHOPPING_SYNCHRONOUS_RESPONSE,
    },
  })
  async shopping_synchronous(
    @requestBody(SHOPPING_SYNCHRONOUS_REQUEST) body: ShoppingSynchronousSchema,
  ): Promise<any>{
    try {
      const {userExist, userValidationMessage} = await this.validate.user(body.username, body.checksum);
      if (!userExist) {
        return userValidationMessage;
      }
      const {bodyIsValid, bodyValidationMessage} = await this.validate.body(body);
      if (!bodyIsValid) {
        return bodyValidationMessage;
      }

      const shopExist = await this.validate.shop(body);
      const shopConfig = this.getShopConfig(body);
      const shop = new ShoppingSynchronousHandler(shopConfig);
      const minimum_time = shop.getTime();

      if (userExist && !shopExist && !minimum_time) {
        const created = await this.shopRepository.create({
          parameters: body.parameters,
          shopping_centers: body.shopping_centers,
          roads: body.roads,
          minimum_time,
        });
      }

      return { minimum_time };
    } catch(error) {
      return new Error(error);
    }
  }

  getShopConfig(body: any) {
    const {username, checksum, parameters, shopping_centers, roads} = body;

    return {
      totalShops: this.getTotalShops(parameters),
      fishTypes: this.getFishTypes(parameters),
      centers: this.getCenters(shopping_centers),
      roads: this.getRoads(roads),
    };
  }

  getTotalShops(parameters: string): number {
    const [totalShops] = parameters.split(',');

    return parseInt(totalShops);
  }

  getCenters(shoping_centers: string): any {
    const parsedCenters = shoping_centers.split('-').map((center: any) => {
      center = center.split(',').slice(1);
      center = center.map((value: any) => parseInt(value));

      return center;
  });

    return parsedCenters;
  }

  getFishTypes(parameters: string): number {
    const [,,fishTypes] = parameters.split(',');

    return parseInt(fishTypes);
  }

  getRoads(roads: string): any {
    const parsedRoads = roads.split('-').map((road: any) => {
      road = road.split(',');
      road = road.map((value: any) => parseInt(value));

      return road;
    });

    return parsedRoads;
  }
}

