const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const transactionService = require("./services/transactions");

const router = new Router();

router.post('/:apiVersion/transactions', async (ctx, next) => {
  // TODO validate the ctx.params.apiVersion
  let receipt = await transactionService.anchorNewHash(ctx.request.body);
  console.log("receipt is ", receipt);
  return next(receipt);
});

const app = new Koa();
app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

const PORT = 3000; // TODO move this to config
const server = app.listen(PORT).on("error", err => {
  console.error(err);
});

module.exports = server;