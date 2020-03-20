import {
  ResponseObject,
} from '@loopback/rest';
import {model, property} from '@loopback/repository';

/**
 * OpenAPI response for shopping_synchronous()
 */
export const SHOPPING_SYNCHRONOUS_RESPONSE: ResponseObject = {
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
 * OpenAPI request for shopping_synchronous()
 */
export const SHOPPING_SYNCHRONOUS_REQUEST = {
  description: 'shopping_synchronous Request',
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
 * OpenAPI body definition for shopping_synchronous()
 */
@model()
export class ShoppingSynchronousSchema {
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
