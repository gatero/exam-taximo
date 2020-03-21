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
  shopConfig: any = {};
  requestBody: any = {};

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
      this.requestBody = body;
      const {userExist, userValidationMessage} = await this.validate.user(this.requestBody.username, this.requestBody.checksum);
      if (!userExist) {
        return userValidationMessage;
      }
      const {bodyIsValid, bodyValidationMessage} = await this.validate.body(this.requestBody);
      if (!bodyIsValid) {
        return bodyValidationMessage;
      }

      const shopExist = await this.validate.shop(this.requestBody);

      const {isValidShopConfig, shopConfigValidationMessage} = this.getShopConfig(this.requestBody);
      if (!isValidShopConfig) {
        return shopConfigValidationMessage;
      }

      const shop = new ShoppingSynchronousHandler(this.shopConfig);
      const minimum_time = shop.getTime();

      if (userExist && !shopExist && !minimum_time) {
        const created = await this.shopRepository.create({
          parameters: this.requestBody.parameters,
          shopping_centers: this.requestBody.shopping_centers,
          roads: this.requestBody.roads,
          minimum_time,
        });
      }

      return { minimum_time };
    } catch(error) {
      return new Error(error);
    }
  }

  getShopConfig(body: any): any {
    Object.assign(this.shopConfig, {
      totalShops: this.getTotalShops(body.parameters),
      fishTypes: this.getFishTypes(body.parameters),
      centers: this.getCenters(body.shopping_centers),
      roads: this.getRoads(body.roads),
    });
    const {totalShops, centers, roads} = this.shopConfig;
    const [,fishTypes] = body.parameters.split(',');

    if (totalShops !== centers.length) {
      return {
        isValidShopConfig: false,
        shopConfigValidationMessage: 'The number of shopping centers must be equal to the amount of shopping_centers',
      }
    }

    if (parseInt(fishTypes) !== roads.length) {
      return {
        isValidShopConfig: false,
        shopConfigValidationMessage: 'The number of fish types must be equal to the amount of roads',
      }
    }

    return {
      isValidShopConfig: true,
      shopConfigValidationMessage: undefined,
    }
  }

  getTotalShops(parameters: string): number {
    const [totalShops] = parameters.split(',');

    return parseInt(totalShops);
  }

  getFishTypes(parameters: string): number {
    const [,,fishTypes] = parameters.split(',');

    return parseInt(fishTypes);
  }

  getCenters(shoping_centers: string): any {
    const parsedCenters = shoping_centers.split('-').map((center: any) => {
      center = center.split(',').slice(1);
      center = center.map((value: any) => parseInt(value));

      return center;
  });

    return parsedCenters;
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

