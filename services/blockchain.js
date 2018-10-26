const contract = require("truffle-contract");
const config = require("../config");
const web3 = config.web3;

async function addAnchorHash(merkleRoot, ipfsHash) {
  let EthDIDAnchor = contract(require('../build/contracts/EthDIDAnchor.json'));
  EthDIDAnchor.setProvider(web3.currentProvider);
  
  return EthDIDAnchor.deployed()
  .then(contractInstance => {
    return contractInstance.newAnchorHash(web3.fromAscii(merkleRoot), web3.fromAscii(ipfsHash), {from: "0x4a198f2d9b1809860bfd299d594624b88a264cac"});
   })
}

module.exports = {addAnchorHash}