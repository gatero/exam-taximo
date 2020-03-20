import {
  Request, 
  RestBindings,
  post,
  requestBody,
  ResponseObject,
} from '@loopback/rest';
import {Entity, model, property} from '@loopback/repository';
import {inject} from '@loopback/context';

import Shop from '../shop';

import {Shop as ShopModel} from '../models/shop.model';

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

@model()
class ShoppingSynchronousRequest {
  @property()
  username: string;

  @property()
  checksum: string;

  @property()
  parameters: string;

  @property()
  shopping_centers: string;

  @property()
  roads: string;
}

const SHOPPING_SYNCHRONOUS_REQUEST = {
  content: {
    'application/x-www-form-urlencoded': {
      schema: {
        type: 'object',
        properties: {
          username: {type: 'string'},
          checksum: {type: 'string'},
          shopping_centers: {type: 'string'},
          parameters: {type: 'string'},
          roads: {type: 'string'},
        },
      },
    },
  },
}

/**
 * A simple controller to bounce back http requests
 */
export class ShoppingSynchronousController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  // Map to `GET /shopping_synchronous`
  @post('/shopping_synchronous', {
    responses: {
      '200': SHOPPING_SYNCHRONOUS_RESPONSE,
    },
  })
  async shopping_synchronous(
    @requestBody(SHOPPING_SYNCHRONOUS_REQUEST) body: ShoppingSynchronousRequest,
  ): Promise<any>{
    const {username, checksum, parameters, shopping_centers, roads} = body;

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
