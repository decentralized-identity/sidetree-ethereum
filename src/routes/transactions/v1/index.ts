import { requestHandler, setKoaResponse } from '../../../lib';

export const createTransaction = async (ctx: any, _next: any) => {
  const { body } = ctx.request;
  // bitcoin request handler seems to confuse requestHandler with service logic...
  // imo, request handler should only take a context, so params parsing is not happening here...
  // but body parsing is also handled differently...
  const response = await requestHandler.handleAnchorRequest(
    Buffer.from(JSON.stringify(body))
  );
  setKoaResponse(response, ctx.response);
};

export const readTransactions = async (ctx: any, _next: any) => {
  const { since, transactionTimeHash } = ctx.query;
  const response = await requestHandler.handleReadTransactions(
    since,
    transactionTimeHash
  );
  setKoaResponse(response, ctx.response);
};
