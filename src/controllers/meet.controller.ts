import {Request, RestBindings, get, param, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';

import Shop from '../shop';

/**
 * OpenAPI response for shopping_synchronous()
 */
const SHOPPING_SYNCHRONOUS_RESPONSE: ResponseObject = {
  description: 'shopping_synchronous Response',
  content: {
    'application/x-www-form-urlencoded': {
      schema: {
        type: 'number',
      },
    },
  },
};

/**
 * A simple controller to bounce back http requests
 */
export class ShoppingSynchronousController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  // Map to `GET /shopping_synchronous`
  @get('/shopping_synchronous', {
    responses: {
      '200': SHOPPING_SYNCHRONOUS_RESPONSE,
    },
  })
  shopping_synchronous(
    @param.query.string('username') username: string,
    @param.query.string('parameters') parameters: string,
    @param.query.string('shopping_centers') shopping_centers: string,
    @param.query.string('roads') roads: string,
    @param.query.string('checksum') checksum: string,
  ): any {

    const shopConfig = {
      totalShops: this.getTotalShops(parameters),
      fishTypes: this.getFishTypes(parameters),
      centers: this.getCenters(shopping_centers),
      roads: this.getRoads(roads),
    };

    const shop = new Shop(shopConfig);

    return {
      minimum_time: shop.getTime(),
    }
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

