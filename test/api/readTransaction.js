const request = require("supertest");
const multihash = require("multihashes");

let config = require("../../config");
let cas = require("../../services/cas");
let encoding = require("../../lib/encoding");
const EthDIDAnchor = artifacts.require("./EthDIDAnchor.sol");

const anchorData = [
  {batchFileHash: "ECEF166788B0C1A8FDE4D513BFD73210A06F3ED4B214E68F0EEB970273652720", merkleRoot: "0FC24F5DC74EABA666652F07097BB803151A5462E3EE3211D9C435DAA776278F"},
  {batchFileHash: "13B1F7EC5BEAEFC781E43A3B344371CD49923A8A05EDD71844B92F56F6A08D38", merkleRoot: "50B59DE16220BB7CA747633055914FC357C8301F2EB444936BBDA8CBFB9F0D3E"},
  {batchFileHash: "E5E5AF6D14125B2FF44E7CFE7FAE50E3BF3E9428FD0D41484D336CE06AA5594B", merkleRoot: "4D3B4512033948D875E118AC6AC26B606A7E764F62660D91F300D8A292DAF14F"}
];

let server, anchorInstance, anchorFileHash1, anchorFileHash2, anchorFileHash3;

function createAnchorHash(batchFileHash, merkleRoot) {
  const batchFileMultihash = multihash.encode(Buffer.from(batchFileHash, "hex"), "sha2-256");
  const merkleRootMultihash = multihash.encode(Buffer.from(merkleRoot, "hex"), "sha2-256");
  const batchFileBase58 = encoding.encodeBase58FromBuffer(batchFileMultihash);
  const merkleRootBase58 = encoding.encodeBase58FromBuffer(merkleRootMultihash);

  const data = {
    batchFileHash: batchFileBase58,
    merkleRoot: merkleRootBase58
  }

  return encoding.encodeBase58FromString(JSON.stringify(data));
}

async function putAnchorFileOnIPFS(anchorFileHash) {
  const bufferData = Buffer.from(anchorFileHash);
  const putResults = await cas.putBuffer(bufferData);
  return putResults[0].hash;
}

async function createAnchorFileHashes() {
  anchorFileHash1 = await putAnchorFileOnIPFS(createAnchorHash(anchorData[0].batchFileHash, anchorData[0].merkleRoot));
  anchorFileHash2 = await putAnchorFileOnIPFS(createAnchorHash(anchorData[1].batchFileHash, anchorData[1].merkleRoot));
  anchorFileHash3 = await putAnchorFileOnIPFS(createAnchorHash(anchorData[2].batchFileHash, anchorData[2].merkleRoot));
}

// Helper function: listen for the AnchorHashCreated event and trigger the passed in callback
function anchorHashesCreatedEvent(contractInstance, numAnchorHashes, cb) {

  function isCompleted() {
    let completed = true;
    for (let i = 0; i<numAnchorHashes; i++) {
      if (processedHashes[i] === undefined) completed = false;
    }
    return completed;
  }

  let processedHashes = [numAnchorHashes];

  const event = contractInstance.AnchorHashCreated({}, {fromBlock: 0, toBlock: 'latest'});
  event.watch((error, result) => {
    if (!error) {
      processedHashes[result.args.transactionNumber.toNumber()] = true;
      if (isCompleted()) setTimeout(cb, 2000);
    }
  });
}

async function waitForEventsCreated(numEvents) {
  return new Promise((resolve, reject) => {
    return anchorHashesCreatedEvent(anchorInstance, numEvents, function(error) {
      if (error) {
        return reject(error);
      } else {
        return resolve();
      }
    })
  });
}

async function postAnchorFileHashes() {
  await request(server).post("/v1.0/transactions").send({anchorFileHash: anchorFileHash1}).set('Accept', 'application/json');
  await request(server).post("/v1.0/transactions").send({anchorFileHash: anchorFileHash2}).set('Accept', 'application/json');
  await request(server).post("/v1.0/transactions").send({anchorFileHash: anchorFileHash3}).set('Accept', 'application/json');
}

contract('GET /v1.0/transactions', accounts => {

  after(() => {
    server.close();
  });

  before(async () => {
    anchorInstance = await EthDIDAnchor.new({from: accounts[0]});
    config.EthDIDAnchorContractAddress = anchorInstance.address;
    server = require("../../server");

    await createAnchorFileHashes();
    await postAnchorFileHashes();
    await waitForEventsCreated(anchorData.length);
  })

  it('should fetch multiple transactions', async () => {

    const response = await request(server).get("/v1.0/transactions").send();
    let body = response.body;

    assert.equal(body.moreTransactions, false);
    assert.equal(body.transactions.length, 3);
    assert.equal(body.transactions[0].transactionNumber, 1);
    assert.equal(body.transactions[0].anchorFileHash, anchorFileHash1);
    assert.equal(body.transactions[1].transactionNumber, 2);
    assert.equal(body.transactions[1].anchorFileHash, anchorFileHash2);
    assert.equal(body.transactions[2].transactionNumber, 3);
    assert.equal(body.transactions[2].anchorFileHash, anchorFileHash3);
  });

  it('should paginate with `after` parameter', async () => {

    let response = await request(server).get("/v1.0/transactions?after=1").send();
    let body = response.body;

    assert.equal(body.moreTransactions, false);
    assert.equal(body.transactions.length, 2);
    assert.equal(body.transactions[0].transactionNumber, 2);
    assert.equal(body.transactions[0].anchorFileHash, anchorFileHash2);
    assert.equal(body.transactions[1].transactionNumber, 3);
    assert.equal(body.transactions[1].anchorFileHash, anchorFileHash3);

  });  
});
