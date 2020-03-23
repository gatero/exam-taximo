import { repository } from '@loopback/repository';

import {ShopRepository, UserRepository} from '../repositories';
import {ShoppingSynchronousSchema} from '../shopping-synchronous';

/**
 * @class ShoppingSynchronousValidate
 * @description This class is used to validate the types of data usedd through the ShoppingSynchronous flow
 * */
export class ShoppingSynchronousValidate {
  userRepository: any = {};
  shopRepository: any = {};

  /**
   * @function constructor
   * @constructs
   * @description this class is going to recieve the data repositores to get access to the crud operations
   * */
  constructor(userRepository: UserRepository, shopRepository: ShopRepository){
    this.userRepository = userRepository;
    this.shopRepository = shopRepository;
  }

  /**
   * @function shop
   * @param {object} body
   * @description this method verifies if the shop actually exists
   * @returns {object} this object contains the validation
   * */
  async shop(body: any) {
    try {
      const {parameters, shopping_centers, roads} = body;
      const shop = await this.shopRepository.find({
        limit: 1,
        where: {
          parameters,
          shopping_centers,
          roads,
        },
        fields: {
          minimum_time: true
        }
      });

      return shop.length ? true : false;
    } catch(error){
      return new Error(error);
    }
  }

  /**
   * @function body
   * @param {ShoppingSynchronousSchema} body
   * @description verifies the integrity of the requestBody
   * @returns {object} this object contains the validation and the validation message
   * */
  body(body: ShoppingSynchronousSchema) {
    const {username, checksum, parameters, shopping_centers, roads} = body;

    if (!username) {
      return {
        bodyIsValid: false, 
        bodyValidationMessage: 'The username can not be empty',
      }
    }

    if (!checksum) {
      return {
        bodyIsValid: false, 
        bodyValidationMessage: 'The checksum can not be empty',
      }
    }

    if (!parameters) {
      return {
        bodyIsValid: false, 
        bodyValidationMessage: 'The parameters can not be empty',
      }
    }

    if (!shopping_centers) {
      return {
        bodyIsValid: false, 
        bodyValidationMessage: 'The shopping_centers can not be empty',
      }
    }

    if (!roads) {
      return {
        bodyIsValid: false, 
        bodyValidationMessage: 'The roads can not be empty',
      }
    }

    return {
      bodyIsValid: true,
      bodyValidationMessage: '',
    };
  }

  /**
   * @function user
   * @param {string} username
   * @param {string} checksum
   * @description Verifies if the user exists
   * @returns {object} this object contains the validation and the validation message
   * */
  async user(username: string, checksum: string) {
    const user = await this.userRepository.find({
      limit: 1,
      where: {
        username,
        checksum,
      }
    });

    return {
      userExist: user.length ? true : false,
      userValidationMessage: user.length ? '' : 'User doesn\'t exist',
    }
  };

}
