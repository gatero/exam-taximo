import {Client} from '@loopback/testlab';
import {expect, assert} from 'chai';
import {Application} from '../..';
import {setupApplication} from './test-helper';

describe('ShoppingSynchronous', () => {
  let app: Application;
  let client: Client;

  const testCases = [
    {
      input: {
        username: 'taximo_api_user',
        checksum: 'cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796',
        parameters: '5,5,5',
        shopping_centers: '1,1-1,2-1,3-1,4-1,5',
        roads: '1,2,10-1,3,10-2,4,10-3,5,10-4,5,10',
      },
      want: {
        minimum_time: 30,
      },
      type: 'include',
    },
    {
      input: {
        username: 'taximo_api_user',
        checksum: 'cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796',
        parameters: '6,10,3',
        shopping_centers: '2,1,2-1,3-0-2,1,3-1,2-1,3',
        roads: '1,2,572-4,2,913-2,6,220-1,3,579-2,3,808-5,3,298-6,1,927-4,5,171-1,5,671-2,5,463',
      },
      want: {
        minimum_time: 792,
      },
      type: 'include',
    },
    {
      input: {
        username: 'otro_usuario',
        checksum: 'wertyuio23456789',
        parameters: '6,10,3',
        shopping_centers: '2,1,2-1,3-0-2,1,3-1,2-1,3',
        roads: '1,2,572-4,2,913-2,6,220-1,3,579-2,3,808-5,3,298-6,1,927-4,5,171-1,5,671-2,5,463',
      },
      want: "User doesn't exist",
      type: 'equal',
    },
    {
      input: {
        checksum: 'cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796',
        parameters: '6,10,3',
        shopping_centers: '2,1,2-1,3-0-2,1,3-1,2-1,3',
        roads: '1,2,572-4,2,913-2,6,220-1,3,579-2,3,808-5,3,298-6,1,927-4,5,171-1,5,671-2,5,463',
      },
      want: "The username can not be empty",
      type: 'equal',
    },
    {
      input: {
        username: 'taximo_api_user',
        parameters: '6,10,3',
        shopping_centers: '2,1,2-1,3-0-2,1,3-1,2-1,3',
        roads: '1,2,572-4,2,913-2,6,220-1,3,579-2,3,808-5,3,298-6,1,927-4,5,171-1,5,671-2,5,463',
      },
      want: "The checksum can not be empty",
      type: 'equal',
    },
    {
      input: {
        username: 'taximo_api_user',
        checksum: 'cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796',
        shopping_centers: '2,1,2-1,3-0-2,1,3-1,2-1,3',
        roads: '1,2,572-4,2,913-2,6,220-1,3,579-2,3,808-5,3,298-6,1,927-4,5,171-1,5,671-2,5,463',
      },
      want: "The parameters can not be empty",
      type: 'equal',
    },
    {
      input: {
        username: 'taximo_api_user',
        checksum: 'cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796',
        parameters: '6,10,3',
        roads: '1,2,572-4,2,913-2,6,220-1,3,579-2,3,808-5,3,298-6,1,927-4,5,171-1,5,671-2,5,463',
      },
      want: "The shopping_centers can not be empty",
      type: 'equal',
    },
    {
      input: {
        username: 'taximo_api_user',
        checksum: 'cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796',
        parameters: '6,10,3',
        shopping_centers: '2,1,2-1,3-0-2,1,3-1,2-1,3',
      },
      want: "The roads can not be empty",
      type: 'equal',
    },
    {
      input: {
        username: 'taximo_api_user',
        checksum: 'cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796',
        parameters: '3,10,3',
        shopping_centers: '2,1,2-1,3-0-2,1,3-1,2-1,3',
        roads: '1,2,572-4,2,913-2,6,220-1,3,579-2,3,808-5,3,298-6,1,927-4,5,171-1,5,671-2,5,463',
      },
      want: "The number of shopping centers must be equal to the amount of shopping_centers",
      type: 'equal',
    },
    {
      input: {
        username: 'taximo_api_user',
        checksum: 'cd7ced88fb72ee862940d5664555251f9ba044d8478a71a7b70b04bd708c2796',
        parameters: '6,9,3',
        shopping_centers: '2,1,2-1,3-0-2,1,3-1,2-1,3',
        roads: '1,2,572-4,2,913-2,6,220-1,3,579-2,3,808-5,3,298-6,1,927-4,5,171-1,5,671-2,5,463',
      },
      want: "The number of fish types must be equal to the amount of roads",
      type: 'equal',
    },
  ];

  before('setupApplication', async () => {
    ({app, client} = await setupApplication());
  });

  after(async () => { 
    await app.stop();
  });

  testCases.forEach((test) => {
    it('invokes POST /shopping_synchronous', async () => {
        const res = await client.post('/shopping_synchronous')
                                .set('Content-Type', 'application/x-www-form-urlencoded')
                                .send(test.input)
                                .expect(200);

      const expected = res.body.minimum_time ? res.body : res.text;

      if (test.type == 'equal') {
        expect(expected).to.equal(test.want);
      } else if ( test.type == 'include' ) {
        expect(expected).to.include(test.want);
      }
    });
  });
});
