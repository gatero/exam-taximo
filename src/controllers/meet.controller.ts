import {Request, RestBindings, get, param, ResponseObject} from '@loopback/rest';
import {inject} from '@loopback/context';

import Shop from '../shop';

/**
 * OpenAPI response for meet()
 */
const MEET_RESPONSE: ResponseObject = {
  description: 'Meet Response',
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
export class meetController {
  constructor(@inject(RestBindings.Http.REQUEST) private req: Request) {}

  // Map to `GET /meet`
  @get('/meet', {
    responses: {
      '200': MEET_RESPONSE,
    },
  })
  meet(
    @param.query.string('username') username: string,
    @param.query.string('parameters') parameters: string,
    @param.query.string('shopping_centers') shopping_centers: string,
    @param.query.string('roads') roads: string,
    @param.query.string('checksum') checksum: string,
  ): number {

    const shopConfig = {
      totalShops: this.getTotalShops(parameters),
      fishTypes: this.getFishTypes(parameters),
      centers: this.getCenters(shopping_centers),
      roads: this.getRoads(roads),
    };

    const shop = new Shop(shopConfig);

    return shop.getTime();
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

