import supertest from 'supertest';
import app from '../../../app';

import schemas from '../../../lib/schemas';

describe('Time Routes', () => {
  let server: any;
  let request: any;

  beforeAll(() => {
    server = app.listen();
    request = supertest(server);
  });

  test('GET /v1.0/time returns the latest blockchain time', async () => {
    try {
      const res = await request.get('/v1.0/time');
      expect(res.body.time).toBeDefined();
      expect(res.body.hash).toBeDefined();
      expect(schemas.isValid(res.body, schemas.BlockchainTime)).toBe(true);
    } catch (error) {
      throw error;
    }
  });

  afterAll(() => {
    server.close();
  });
});
