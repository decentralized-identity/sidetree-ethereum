import Router from 'koa-router';

import time from './time';
import transactions from './transactions';

const router = new Router();

router.use(time.routes(), time.allowedMethods());
router.use(transactions.routes(), transactions.allowedMethods());

export default router;
