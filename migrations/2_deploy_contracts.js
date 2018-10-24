const SimpleAnchor = artifacts.require("./SimpleAnchor.sol");

module.exports = deployer => {
  deployer.deploy(SimpleAnchor);
};
