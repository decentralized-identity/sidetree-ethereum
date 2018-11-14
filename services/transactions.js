const db = require("../db");
const cas = require("./cas");
const blockchain = require("./blockchain");
const encoding = require("../lib/encoding");

/**
* https://github.com/decentralized-identity/sidetree-core/blob/master/docs/protocol.md#anchor-file-schema
*/
async function anchorNewHash(anchorFileHash) {
  return cas.fetchBufferAtAddress(anchorFileHash).then(async (hashData) => {
    // hashData is a buffer of a base58 encoded string.  It decodes into an object with the keys:
    //   "batchFileHash": "Base58 encoded hash of the batch file."
    //   "merkleRoot": "Base58 encoded root hash of the Merkle tree of the batch file."
    let decoded = JSON.parse(encoding.decodeBase58ToString(hashData.toString()));

    // Call the Smart Contract service to persist the merkleRoot and the ipfsHash
    // and return the ethereum transaction number
    return await blockchain.addAnchorHash(decoded.merkleRoot, anchorFileHash);
  })
}

function fetchTransactions(after = 0) {
  let transactions = [];
  // Transactions index begins at '1'

  const startIndex = after + 1;

  for (let i = startIndex; i < db.getNumberOfTransactions(); i++) {
    transactions.push({
      transactionNumber: i,
      anchorFileHash: db.getItemAtIndex(i).ipfsHash
    })
  }
  return transactions;
}

module.exports = {anchorNewHash, fetchTransactions};