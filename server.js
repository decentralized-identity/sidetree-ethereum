const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const config = require("./config");
const transactionService = require("./services/transactions");

const router = new Router();

router.post('/:apiVersion/transactions', async (ctx, next) => {
  try {
    return next();
    // TODO validate the ctx.params.apiVersion
    // TODO validate the anchorFileHash is in the body
    console.log("in the route, ctx is ", ctx);
    let receipt = await transactionService.anchorNewHash(ctx.request.body.anchorFileHash);
    console.log("receipt is ", receipt);
    return next(receipt);
  } catch (err) {
    next(err);
  }
});

const app = new Koa();
app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

const server = app.listen(config.WEB_PORT).on("error", err => {
  console.error(err);
});

module.exports = server;