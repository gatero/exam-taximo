export const DEVELOPMENT = 'development';
export const PRODUCTION = 'production';
export const TEST = 'test';

/**
 * @global {string} environment
 * @description this closure returns the environment based on the environment
 * */
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


