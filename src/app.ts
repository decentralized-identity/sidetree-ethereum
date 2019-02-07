import Koa from 'koa';

import middleware from './middleware';
import router from './routes';
import swagger from './routes/swagger';

const app = new Koa();

app.use(middleware());

swagger(app);

app.use(router.routes());
app.use(router.allowedMethods());

export default app;
