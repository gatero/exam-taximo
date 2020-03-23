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
 * @class ShoppingSynchronousController
 * @description A simple controller to bounce back http requests,
 * this contains all the necessary methods to validate the request body.
 */
export class ShoppingSynchronousController {
  validate: any = {};
  shopConfig: any = {};
  requestBody: any = {};

  /**
   * @constructs
   * */
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request,
    @repository(UserRepository) public userRepository: UserRepository,
    @repository(ShopRepository) public shopRepository: ShopRepository,
  ) {
    this.validate = new ShoppingSynchronousValidate(userRepository, shopRepository);
  }

  /** 
   * @function shopping_synchronous
   * @param {request} incoming data
   * @description Map to `GET /shopping_synchronous`, this function
   * contains the mixed logic for synchronous endpoint.
   * @returns {response} An object which contains the minimum_time
   * */
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

      const {isValidShopConfig, shopConfigValidationMessage} = this.setShopConfig();
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

  /**
   * @function setShopConfig
   * @description process the request body and set the configuration for request handling
   * it always returns an object with the operation result.
   * @returns {object}
   * */
  setShopConfig(): any {
    Object.assign(this.shopConfig, {
      totalShops: this.getTotalShops(this.requestBody.parameters),
      fishTypes: this.getFishTypes(this.requestBody.parameters),
      centers: this.getCenters(this.requestBody.shopping_centers),
      roads: this.getRoads(this.requestBody.roads),
    });
    const {totalShops, centers, roads} = this.shopConfig;
    const [,fishTypes] = this.requestBody.parameters.split(',');

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

  /**
   * @function getTotalShops
   * @param {string} parameters
   * @description takes the param called params and takes the first position
   * which contains the total of shopping centers.
   * @returns {number} totalShops
   * */
  getTotalShops(parameters: string): number {
    const [totalShops] = parameters.split(',');

    return parseInt(totalShops);
  }

  /**
   * @function getFishTypes
   * @param {string} parameters
   * @description takes the param called params and takes the third position
   * which contains the total of fishTypes.
   * @returns {number} fishTypes
   * */
  getFishTypes(parameters: string): number {
    const [,,fishTypes] = parameters.split(',');

    return parseInt(fishTypes);
  }

  /**
   * @function getCenters
   * @param {string} shopping_centers
   * @description split the shopping_centers of type string fist by '-' and
   * then by ',' and then slicing the first element of each center.
   * @returns {array} parsedCenters
   * */
  getCenters(shoping_centers: string): any {
    const parsedCenters = shoping_centers.split('-').map((center: any) => {
      center = center.split(',').slice(1);
      center = center.map((value: any) => parseInt(value));

      return center;
  });

    return parsedCenters;
  }

  /**
   * @function getRoads
   * @param {string} roads
   * @description split the roads string fist by '-' and then by ','.
   * @returns {Array<Array<number>>} parsedCenters
   * */
  getRoads(roads: string): any {
    const parsedRoads = roads.split('-').map((road: any) => {
      road = road.split(',');
      road = road.map((value: any) => parseInt(value));

      return road;
    });

    return parsedRoads;
  }
}

