import app from '../app';
import config from '../config';

const start = async () => {
  app.listen(config.app.port, () => {
    console.log(`Sidetree Ethereum Server listening on ${config.app.port}`);

  });
};

start().catch(error => {
  console.error(error);
  process.exit(1);
});
