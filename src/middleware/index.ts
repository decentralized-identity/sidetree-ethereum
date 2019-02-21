import compose from 'koa-compose';
import bodyParser from 'koa-bodyparser';
import compress from 'koa-compress';
import logger from 'koa-pino-logger';
import helmet from 'koa-helmet';
import cors from '@koa/cors';

import { app } from '../config';

export default () => {
  const middlewares = [bodyParser()];

  if (app.env !== 'test') {
    middlewares.push(logger(), helmet(), compress(), cors());
  }

  return compose(middlewares);
};
