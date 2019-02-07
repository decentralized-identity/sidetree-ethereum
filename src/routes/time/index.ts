import Router from 'koa-router';
import api from 'koa-router-version';
import v1 from './v1';

const router = new Router();

// https://github.com/decentralized-identity/sidetree-core/blob/master/docs/implementation.md#get-latest-blockchain-time

/**
 * @swagger
 *
 * paths:
 *   "/time":
 *     get:
 *       tags: [Blockchain]
 *       produces:
 *       - application/json
 *       responses:
 *         '200':
 *           description: 'Everything went well.'
 *           type: object
 *           schema:
 *           "$ref": "#/definitions/BlockchainTime"
 */
router.get(
  'blockchain.time',
  '/:version(v\\d.\\d)?/time',
  api.version({
    '1.0.0': v1
  })
);

export default router;
