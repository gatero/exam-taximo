import {Entity, model, property} from '@loopback/repository';

/**
 * @class Shop
 * @description Model definition for shop model
 * */
@model()
export class Shop extends Entity {
  @property({
    id: true,
    generated: true,
  })
  id: number;

  @property({
    type: 'string',
  })
  parameters?: string;

  @property({
    type: 'string',
  })
  shopping_centers?: string;

  @property({
    type: 'string',
  })
  roads?: string;

  @property({
    type: 'number',
  })
  minimum_time?: number;

  constructor(data?: Partial<Shop>) {
    super(data);
  }
}

export interface ShopRelations {
  // describe navigational properties here
}

export type ShopWithRelations = Shop & ShopRelations;
