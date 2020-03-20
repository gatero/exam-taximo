import {DefaultCrudRepository} from '@loopback/repository';
import {Shop, ShopRelations} from '../models';
import {PostgresDataSource} from '../datasources';
import {inject} from '@loopback/core';

export class ShopRepository extends DefaultCrudRepository<
  Shop,
  typeof Shop.prototype.id,
  ShopRelations
> {
  constructor(
    @inject('datasources.postgres') dataSource: PostgresDataSource,
  ) {
    super(Shop, dataSource);
  }
}
