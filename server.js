const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const config = require("./config");
const transactionService = require("./services/transactions");
const blockchainService = require("./services/blockchain");

const router = new Router();

router.post('/:apiVersion/transactions', async (ctx, next) => {
  try { 
    const anchorFileHash = ctx.request.body.anchorFileHash;
    if (!anchorFileHash) {
      ctx.response.status = 400;
      return next();
    }

    let receipt = await transactionService.anchorNewHash(ctx.request.body.anchorFileHash);
    ctx.response.status = 200;
    return next(receipt);
  } catch (err) {
    console.log(err);
    ctx.response.status = 500;
    return next(err);
  }
});

const app = new Koa();
app
  .use(bodyParser())
  .use(router.routes())
  .use(router.allowedMethods());

blockchainService.listenForNewHashes();

const server = app.listen(config.WEB_PORT).on("error", err => {
  console.error(err);
});

module.exports = server;