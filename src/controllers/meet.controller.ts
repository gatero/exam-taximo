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
export class MeetController {
  constructor(
    @inject(RestBindings.Http.REQUEST) private req: Request
  ) {}

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
      centers: this.parseStringToArray(shopping_centers),
      roads: this.parseStringToArray(roads),
    };

    const shop = new Shop(shopConfig);
    shop.getTime();

    return 30;
  }

  getFishTypes(parameters: string): number {
    const [,,fishTypes] = parameters.split(',');

    return parseInt(fishTypes);
  }

  getTotalShops(parameters: string): number {
    const [totalShops] = parameters.split(',');

    return parseInt(totalShops);
  }

  parseStringToArray(input: string) {
    return input.split('-').map((item: any) => (
      item.split(',').map((value: any) => parseInt(value))
    ));
  }
}
