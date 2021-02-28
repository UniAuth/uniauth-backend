import * as config from 'config';

export const appData = {
  Name: config.get('api.name'),
  Description: config.get('api.description'),
  Version: config.get('api.version'),
};
