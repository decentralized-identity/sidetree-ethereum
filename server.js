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
    ctx.response.body = receipt;
    return next();
  } catch (err) {
    console.log(err);
    ctx.response.status = 500;
    return next(err);
  }
});

//https://github.com/decentralized-identity/sidetree-core/blob/master/docs/implementation.md#fetch-sidetree-transactions
router.get('/:apiVersion/transactions', async (ctx, next) => {
  try {
    const after = ctx.request.query.after ? Number(ctx.request.query.after) : 0;
    const transactions = transactionService.fetchTransactions(Number(after));

    const result = {
      moreTransactions: false,
      transactions
    }

    ctx.response.status = 200;
    ctx.response.set('Content-Type', 'application/json');
    ctx.response.body = result;

    return next();
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