const request = require("supertest");
const multihash = require("multihashes");

const EthDIDAnchor = artifacts.require("./EthDIDAnchor.sol");
let db = require("../../db");
let encoding = require("../../lib/encoding");
let config = require("../../config");
let cas = require("../../services/cas");

let server, anchorInstance;

const batchFileHash = "ECEF166788B0C1A8FDE4D513BFD73210A06F3ED4B214E68F0EEB970273652720";
const merkleRoot = "0FC24F5DC74EABA666652F07097BB803151A5462E3EE3211D9C435DAA776278F";
let ipfsHash, anchorFileHash, batchFileBase58, merkleRootBase58;

function createAnchorFileHash() {
  const batchFileMultihash = multihash.encode(Buffer.from(batchFileHash, "hex"), "sha2-256");
  const merkleRootMultihash = multihash.encode(Buffer.from(merkleRoot, "hex"), "sha2-256");
  batchFileBase58 = encoding.encodeBase58FromBuffer(batchFileMultihash);
  merkleRootBase58 = encoding.encodeBase58FromBuffer(merkleRootMultihash);

  let data = {
    batchFileHash: batchFileBase58,
    merkleRoot: merkleRootBase58
  }

  return encoding.encodeBase58FromString(JSON.stringify(data));
}

contract('POST /v1.0/transactions', accounts => {

  after(() => {
    server.close();
  });

  before(async () => {
    anchorFileHash = createAnchorFileHash();
    const bufferData = Buffer.from(anchorFileHash);
    const putResults = await cas.putBuffer(bufferData);
    ipfsHash = putResults[0].hash;

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
    const postBody = {anchorFileHash: ipfsHash};
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

    const postBody = {anchorFileHash: ipfsHash};
    await request(server).post("/v1.0/transactions").send(postBody).set('Accept', 'application/json');

    return eventPromise.then(async result => {
      const dbCache = db.getCache()[1];

      assert.equal(dbCache.ipfsHash, ipfsHash);
      assert.equal(dbCache.anchorHash, merkleRootBase58);
    });
  });
});
