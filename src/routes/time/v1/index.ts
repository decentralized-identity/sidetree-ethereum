import { requestHandler, setKoaResponse } from '../../../lib';

export default async (ctx: any, _next: any) => {
  const response = await requestHandler.handleLastBlockRequest();
  setKoaResponse(response, ctx.response);
};
