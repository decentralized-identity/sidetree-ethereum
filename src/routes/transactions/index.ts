import Router from 'koa-router';
import api from 'koa-router-version';
import * as v1 from './v1';

const router = new Router();

/**
 * @swagger
 *
 * paths:
 *   "/transactions":
 *     post:
 *       tags: [Blockchain]
 *       produces:
 *       - application/json
 *       parameters:
 *       - in: body
 *         name: anchorFile
 *         required: true
 *         type: string
 *         example: QmcModh3cTgSpr8A6m7jNHnwVZRGZsepWv3uaFtD5KhL2U
 *         schema:
 *           "$ref": "#/definitions/CreateTransaction"
 *       responses:
 *         '400':
 *           description: 'anchorFileHash is missing or invalid.'
 *         '200':
 *           description: 'A list transactions representing a batch of Sidetree operations.'
 *           type: object
 *           schema:
 *           "$ref": "#/definitions/BlockchainTransaction"
 */
router.post(
  'blockchain.transactions',
  '/:version(v\\d.\\d)?/transactions',
  v1.createTransaction
);

/**
 * @swagger
 *
 * paths:
 *   "/transactions":
 *     get:
 *       tags: [Blockchain]
 *       produces:
 *       - application/json
 *       responses:
 *         '200':
 *           description: 'A list transactions representing a batch of Sidetree operations.'
 *           type: object
 *           schema:
 *           "$ref": "#/definitions/BlockchainTransaction"
 */
router.get(
  'blockchain.transactions',
  '/:version(v\\d.\\d)?/transactions',
  api.version({
    '1.0.0': v1.readTransactions
  })
);

export default router;
