let memoryStore = {};

function addHash(anchorHash, ipfsHash, transactionNumber) {
  memoryStore[transactionNumber] = {anchorHash, ipfsHash};
}

function getCache() {
  return memoryStore;
}

module.exports = { addHash, getCache }