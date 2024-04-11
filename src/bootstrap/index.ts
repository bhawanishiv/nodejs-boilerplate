import { Express } from 'express';

import sync from './sync';
import rest from './rest';

const bootstrap = async (app: Express) => {
  sync();
  rest(app);
  return new Promise((resolve) => {
    resolve(app);
  });
};

export default bootstrap;
