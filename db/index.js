let memoryStore = [];

// The anchorHash is the merkle root hash
function addHash(anchorHash, ipfsHash, transactionNumber) {
  memoryStore[transactionNumber] = {anchorHash, ipfsHash};
}

function getNumberOfTransactions() {
  return memoryStore.length;
}

function getItemAtIndex(i) {
  return memoryStore[i];
}

module.exports = { addHash, getNumberOfTransactions, getItemAtIndex }