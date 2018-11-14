var EthDIDAnchor = artifacts.require("./EthDIDAnchor.sol");

module.exports = function(deployer) {
  deployer.deploy(EthDIDAnchor);
};
