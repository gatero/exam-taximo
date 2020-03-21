import {expect} from '@loopback/testlab';

describe('hola mundo', () => {
  it('hello world !', () => {
    var expect = require('chai').expect;
    var numbers = [1, 2, 3, 4, 5];

    expect(numbers).to.be.an('array').that.includes(2);
    expect(numbers).to.have.lengthOf(5);
    expect('hola').to.eql('adios');
  });
});
