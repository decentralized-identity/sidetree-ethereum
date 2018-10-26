const blockchain = require("./blockchain");

/**
* https://github.com/decentralized-identity/sidetree-core/blob/master/docs/protocol.md#anchor-file-schema
*/
async function anchorNewHash(anchorHashCASAddress) {
  // Fetch the data from IPFS at anchorHashCASAddress
  let hashData = "T7xykxQiS3ES8L2u3hTFVGWEW6er5vcsLpV9RGvpcHL9oriypeNWiNSAbJUoymkDUD9vskc5uEfd3St2K4VDcGEPZsCRtkUq6bJ1SAm1DJyNSdkx";
  
  // Decode the retrieved Base58 encoded data into an object like:
  // {
  //   "batchFileHash": "Base58 encoded hash of the batch file.",
  //   "merkleRoot": "Base58 encoded root hash of the Merkle tree contructed using the batch file."
  // }

  let decoded = {
    "batchFileHash": "StV1DL6CwTryKyV",
    "merkleRoot": "9CiwA8tmydLojNKvt3"
  }

  // Call the Smart Contract service to persist the merkleRoot and the ipfsHash

  let receipt = blockchain.addAnchorHash(decoded.merkleRoot, anchorHashCASAddress);

  // Return the web3 transaction number
  return receipt;
}

module.exports = {anchorNewHash};