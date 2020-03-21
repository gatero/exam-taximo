import {environment} from '../constants';

const dataSource = {
  development: {
    "name": "postgres",
    "connector": "postgresql",
    "url": "",
    "host": "postgres",
    "port": 5432,
    "user": "admin",
    "password": "root",
    "database": "taximo"
  },
  production: {
    "name": "postgres",
    "connector": "postgresql",
    "url": "postgres://qfccqiuktxpwhw:29ad5341cf8580a8bf11d2922a7a5b3d4921a7c3310c4fce3216b9c117b5c3db@ec2-35-174-88-65.compute-1.amazonaws.com:5432/dcosfi31m8k7a1",
    "host": "ec2-35-174-88-65.compute-1.amazonaws.com",
    "port": 5432,
    "user": "qfccqiuktxpwhw",
    "password": "29ad5341cf8580a8bf11d2922a7a5b3d4921a7c3310c4fce3216b9c117b5c3db",
    "database": "dcosfi31m8k7a1"
  }
}

export default dataSource[environment];
