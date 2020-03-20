import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getFilterSchemaFor,
  getModelSchemaRef,
  getWhereSchemaFor,
  patch,
  put,
  del,
  requestBody,
} from '@loopback/rest';
import {Shop} from '../models';
import {ShopRepository} from '../repositories';

export class ShopController {
  constructor(
    @repository(ShopRepository)
    public shopRepository : ShopRepository,
  ) {}

  @post('/shop', {
    responses: {
      '200': {
        description: 'Shop model instance',
        content: {'application/json': {schema: getModelSchemaRef(Shop)}},
      },
    },
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shop, {
            title: 'NewShop',
            
          }),
        },
      },
    })
    shop: Shop,
  ): Promise<Shop> {
    return this.shopRepository.create(shop);
  }

  @get('/shop/count', {
    responses: {
      '200': {
        description: 'Shop model count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async count(
    @param.where(Shop) where?: Where<Shop>,
  ): Promise<Count> {
    return this.shopRepository.count(where);
  }

  @get('/shop', {
    responses: {
      '200': {
        description: 'Array of Shop model instances',
        content: {
          'application/json': {
            schema: {
              type: 'array',
              items: getModelSchemaRef(Shop, {includeRelations: true}),
            },
          },
        },
      },
    },
  })
  async find(
    @param.filter(Shop) filter?: Filter<Shop>,
  ): Promise<Shop[]> {
    return this.shopRepository.find(filter);
  }

  @patch('/shop', {
    responses: {
      '200': {
        description: 'Shop PATCH success count',
        content: {'application/json': {schema: CountSchema}},
      },
    },
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shop, {partial: true}),
        },
      },
    })
    shop: Shop,
    @param.where(Shop) where?: Where<Shop>,
  ): Promise<Count> {
    return this.shopRepository.updateAll(shop, where);
  }

  @get('/shop/{id}', {
    responses: {
      '200': {
        description: 'Shop model instance',
        content: {
          'application/json': {
            schema: getModelSchemaRef(Shop, {includeRelations: true}),
          },
        },
      },
    },
  })
  async findById(
    @param.path.number('id') id: number,
    @param.filter(Shop, {exclude: 'where'}) filter?: FilterExcludingWhere<Shop>
  ): Promise<Shop> {
    return this.shopRepository.findById(id, filter);
  }

  @patch('/shop/{id}', {
    responses: {
      '204': {
        description: 'Shop PATCH success',
      },
    },
  })
  async updateById(
    @param.path.number('id') id: number,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Shop, {partial: true}),
        },
      },
    })
    shop: Shop,
  ): Promise<void> {
    await this.shopRepository.updateById(id, shop);
  }

  @put('/shop/{id}', {
    responses: {
      '204': {
        description: 'Shop PUT success',
      },
    },
  })
  async replaceById(
    @param.path.number('id') id: number,
    @requestBody() shop: Shop,
  ): Promise<void> {
    await this.shopRepository.replaceById(id, shop);
  }

  @del('/shop/{id}', {
    responses: {
      '204': {
        description: 'Shop DELETE success',
      },
    },
  })
  async deleteById(@param.path.number('id') id: number): Promise<void> {
    await this.shopRepository.deleteById(id);
  }
}
