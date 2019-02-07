import supertest from 'supertest';
import app from '../../../app';

import schemas from '../../../lib/schemas';

import fixtures from '../../../../test/__fixtures__';

const { anchorFileHash } = fixtures;

describe('Transactions Routes', () => {
  let server: any;
  let request: any;

  beforeAll(() => {
    server = app.listen();
    request = supertest(server);
  });

  describe('POST /v1.0/transactions', () => {
    it('should returns 400 when anchorFileHash is missing', async () => {
      const res = await request.post('/v1.0/transactions').send({});
      expect(res.status).toBe(400);
    });

    it('should returns 400 when anchorFileHash is invalid', async () => {
      const res = await request
        .post('/v1.0/transactions')
        .send({ anchorFileHash: '🦄' });
      expect(res.status).toBe(400);
    });

    it('should returns 200 when anchorFileHash is valid', async () => {
      const res = await request
        .post('/v1.0/transactions')
        .send({ anchorFileHash });
      expect(res.status).toBe(200);
    });
  });

  describe('GET /v1.0/transactions', () => {
    let lastTransaction;
    it('should return all transactions', async () => {
      const res = await request.get('/v1.0/transactions');
      expect(res.body.transactions).toBeDefined();
      expect(
        schemas.isValid(res.body.transactions[0], schemas.BlockchainTransaction)
      ).toBe(true);
      lastTransaction = res.body.transactions[res.body.transactions.length - 1];
      await request
      .post('/v1.0/transactions')
      .send({ anchorFileHash });
    });

    it('should support since & transactionTimeHash', async () => {
      const queryParams = {
        since: lastTransaction.transactionNumber,
        transactionTimeHash: lastTransaction.transactionTimeHash
      };

      const { since, transactionTimeHash } = queryParams;

      const res = await request.get(
        `/v1.0/transactions?since=${since}&transactionTimeHash=${transactionTimeHash}`
      );
      expect(res.body.transactions).toBeDefined();

      expect(
        schemas.isValid(res.body.transactions[0], schemas.BlockchainTransaction)
      ).toBe(true);
      expect(res.body.moreTransactions).toBe(false);
    });
  });

  afterAll(() => {
    server.close();
  });
});
