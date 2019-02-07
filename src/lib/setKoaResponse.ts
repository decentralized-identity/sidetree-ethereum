import * as Koa from 'koa';
import { toHttpStatus, Response } from './Response';

/**
 * Sets the koa response according to the Sidetree response object given.
 * @param response Response object fetched from request handler.
 * @param koaResponse Koa Response object to be filled
 * @param contentType Content type to be set for response, defaults to application/json
 */
const setKoaResponse = (
  response: Response,
  koaResponse: Koa.Response,
  contentType?: string
) => {
  koaResponse.status = toHttpStatus(response.status);
  if (contentType) {
    koaResponse.set('Content-Type', contentType);
  } else {
    koaResponse.set('Content-Type', 'application/json');
  }
  if (response.body) {
    koaResponse.body = response.body;
  } else {
    // Need to set the body explicitly, otherwise Koa will return HTTP 204
    koaResponse.body = '';
  }
};

export default setKoaResponse;
