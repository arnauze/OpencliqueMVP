const apiConfig = {
  production: {
    api: 'https://36r2nq4vf2.execute-api.us-west-1.amazonaws.com',
  },
  preproduction: {
    api: 'https://36r2nq4vf2.execute-api.us-west-1.amazonaws.com',
  },
  staging: {
    api: 'https://36r2nq4vf2.execute-api.us-west-1.amazonaws.com',
  },
  local: {
    api: 'https://36r2nq4vf2.execute-api.us-west-1.amazonaws.com',
  },
};

const apiSetup = 'local';
// const apiSetup = 'production';

export const settings = {
  apiUrl: apiConfig[apiSetup].api,
  version: '1.0',
  build: '0',
  defaultPlace: {
    latitude: 48.7923487,
    longitude: 2.3371719,
  },
};

export default settings;
