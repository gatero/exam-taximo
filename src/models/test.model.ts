import {Entity, model, property} from '@loopback/repository';

@model()
export class Test extends Entity {
  @property({
    id: true,
    generated: true,
  })
  id: number;

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
  solution?: string;

  constructor(data?: Partial<Test>) {
    super(data);
  }
}

export interface TestRelations {
  // describe navigational properties here
}

export type TestWithRelations = Test & TestRelations;
