const request = require("supertest");
const server = require("../../server");

describe('POST /v1.0/transactions', () => {
  test('should return the ethereum transaction number', async () => {
    const postBody = {anchorFileHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"};
    const response = await request(server).post("/v1.0/transactions").send(postBody).set('Accept', 'application/json');
    console.log("response is ", response);
    expect(response.statusCode).toBe(200);
  });
});
