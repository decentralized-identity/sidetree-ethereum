var EthDIDAnchor = artifacts.require("./EthDIDAnchor.sol");

const SimpleSidetreeAnchor = artifacts.require("./SimpleSidetreeAnchor.sol");

module.exports = function(deployer) {
  deployer.deploy(EthDIDAnchor);
  deployer.deploy(SimpleSidetreeAnchor);
};
