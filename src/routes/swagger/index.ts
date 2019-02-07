import fs from 'fs';
import path from 'path';
import swaggerUi from 'swagger-ui-koa';
import swaggerJSDoc from 'swagger-jsdoc';
import convert from 'koa-convert';
import mount from 'koa-mount';

const swaggerDoc = swaggerJSDoc({
  definition: {
    info: {
      title: 'Sidetree Ethereum',
      version: '1.0.0',
      description: 'Sidetree API for Ethereum'
    },
    basePath: '/v1.0/'
  },
  // Path to the API docs
  apis: [path.resolve(__dirname, '../**/*.js')]
});

const schemaDirName = path.resolve(__dirname, '../../schemas');
// eslint-disable-next-line
fs.readdirSync(schemaDirName)
  .filter(fileName => /.*.json$/.test(fileName))
  // eslint-disable-next-line
  .map(jsonFileName =>
    JSON.parse(fs.readFileSync(`${schemaDirName}/${jsonFileName}`).toString())
  )
  .forEach(jsonSchema => {
    const { id } = jsonSchema;
    if (id) {
      swaggerDoc.definitions[jsonSchema.id] = jsonSchema;
    }
  });

export default (app: any) => {
  app.use(swaggerUi.serve); // serve swagger static files
  app.use(convert(mount('/swagger', swaggerUi.setup(swaggerDoc)))); // mount endpoint for access
};
