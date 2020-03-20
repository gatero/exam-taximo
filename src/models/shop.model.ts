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
  username?: string;

  @property({
    type: 'string',
  })
  checksum?: string;

  @property({
    type: 'number',
  })
  totalShops?: number;

  @property({
    type: 'number',
  })
  fishTypes?: number;

  @property({
    type: 'string',
  })
  centers?: string;

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
