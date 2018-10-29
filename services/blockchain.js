const contract = require("truffle-contract");
const ethereumTx = require('ethereumjs-tx');
const abi = require('ethereumjs-abi');

const config = require("../config");
const web3 = config.web3;

// Get a JS object representing the deployed smart contract
async function _getContractInstance() {
  return new Promise((resolve, reject) => {
    if (this.contractInstance) {
      return resolve(this.contractInstance);
    }

    let EthDIDAnchor = contract(require('../build/contracts/EthDIDAnchor.json'));
    EthDIDAnchor.setProvider(web3.currentProvider);

    return EthDIDAnchor.deployed().then(_contractInstance => {
      this.contractInstance = _contractInstance;
      return resolve(this.contractInstance);
    }).catch(reject);
  })
}

async function _buildTransaction(contractInstance, merkleRoot, ipfsHash, account) {

  // return web3.eth.getTransactionCount(account.address, (count) => {
  // TODO determine how to get the transaction count
  if (!this.count) {
    this.count = 16;
  } else {
    this.count ++;
  }

  const methodEncoded = web3.sha3("newAnchorHash(bytes32,bytes32)").substr(0,10);
  const paramTypes = ["bytes32", "bytes32"];
  const paramValues = [web3.fromAscii(merkleRoot), web3.fromAscii(ipfsHash)];
  const paramEncoded = abi.rawEncode(paramTypes, paramValues);
  const dataEncoded = methodEncoded + paramEncoded.toString("hex");

  const txParams = {
    nonce: "0x" + this.count.toString(16),
    //gasPrice: '0x09184e72a000'  TODO: determine if we need to set gasPrice
    gasLimit: config.gasLimit,
    to: contractInstance.address,
    from: account.address,
    data: dataEncoded
  }

  const tx = new ethereumTx(txParams);
  const keyBuffer = Buffer.from(account.privateKey, "hex");
  tx.sign(keyBuffer);
  const serializedTx = tx.serialize();
  const rawTx = "0x" + serializedTx.toString("hex");
  return web3.eth.sendRawTransaction(rawTx)
  // })
}

async function addAnchorHash(merkleRoot, ipfsHash) {
  return _getContractInstance().then(async contractInstance => {
    return await _buildTransaction(contractInstance, merkleRoot, ipfsHash, config.account);
  })
}

module.exports = {addAnchorHash}