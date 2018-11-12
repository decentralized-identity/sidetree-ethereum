const request = require("supertest");
const EthDIDAnchor = artifacts.require("./EthDIDAnchor.sol");
let db = require("../../db");
let config = require("../../config");

let server, anchorInstance;

contract('POST /v1.0/transactions', accounts => {

  after(() => {
    server.close();
  });

  before(async () => {
    anchorInstance = await EthDIDAnchor.new({from: accounts[0]});
    config.EthDIDAnchorContractAddress = anchorInstance.address;
    server = require("../../server");
  })

  it('should return a 400 if anchorFileHash is missing', async () => {
    const postBody = {};
    const response = await request(server).post("/v1.0/transactions").send(postBody).set('Accept', 'application/json');
    assert.equal(response.statusCode, 400);
  });

  it('should return the ethereum transaction number', async () => {
    const postBody = {anchorFileHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"};
    const response = await request(server).post("/v1.0/transactions").send(postBody).set('Accept', 'application/json');
    assert.equal(response.statusCode, 200);
  });

  it('should add the transaction to the local db cache', async () => {

    // Helper function: listen for the AnchorHashCreated event and trigger the passed in callback
    function anchorHashCreatedEvent(instance, cb) {
      const event = instance.AnchorHashCreated();
      event.watch(cb);
    }

    const eventPromise = new Promise(function(resolve, reject) {
      return anchorHashCreatedEvent(anchorInstance, function(error, result) {
        if (error) {
          return reject(error);
        } else {
          return setTimeout(function() {
            resolve(result.args);
          }, 500);
        }
      })
    });

    const postBody = {anchorFileHash: "QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG"};
    await request(server).post("/v1.0/transactions").send(postBody).set('Accept', 'application/json');

    return eventPromise.then(async result => {
      const dbCache = db.getCache()[1];
      assert.equal(dbCache.anchorHash, "0x394369774138746d79644c6f6a4e4b7674330000000000000000000000000000");
      assert.equal(dbCache.ipfsHash, "0x516d597741504a7a7635435a736e4136323573335866326e656d745967507048");
    });
  });
});
