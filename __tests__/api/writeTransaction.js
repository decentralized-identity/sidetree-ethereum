const request = require("supertest");
const server = require("../../server");

describe('POST /v1.0/transactions', () => {

  afterAll(() => {
    server.close();
  });

  test('should return the ethereum transaction number', async () => {
    const postBody = {anchorFileHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"};
    const response = await request(server).post("/v1.0/transactions").send(postBody).set('Accept', 'application/json');
    expect(response.statusCode).toBe(200);
  });
});
