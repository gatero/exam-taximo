export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';
export const TEST = 'test';

export const environment = (() => {
  switch (process.env.NODE_ENV) {
    case PRODUCTION:
      return PRODUCTION;
      break;
    case TEST:
      return TEST;
      break;
    default:
      return DEVELOPMENT;
  }
})()


