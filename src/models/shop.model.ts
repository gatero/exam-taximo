import {Entity, model, property} from '@loopback/repository';

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
  minimum_time?: string;

  constructor(data?: Partial<Shop>) {
    super(data);
  }
}

export interface ShopRelations {
  // describe navigational properties here
}

export type ShopWithRelations = Shop & ShopRelations;
