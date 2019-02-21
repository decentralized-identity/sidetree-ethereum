import * as Koa from 'koa';
import { Logger } from 'pino';

declare module 'koa' {
  interface Context {
    log: Logger;
  }
}

declare module 'swagger-ui-koa';
