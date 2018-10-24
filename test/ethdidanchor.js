const EthDIDAnchor = artifacts.require("./EthDIDAnchor.sol");


contract("EthDIDAnchor", accounts => {
  it("...should verify hash exist.", async () => {

    const ethDIDAnchorInstance = await EthDIDAnchor.deployed();

    var testHash = "test hash";

    await ethDIDAnchorInstance.newAnchorHash(testHash, { from: accounts[0] });

    const doesHashExist = await ethDIDAnchorInstance.doesHashExist(testHash.valueOf());

    assert.equal(doesHashExist, true, "The anchor hash does exits");
  });

  it("...should verify hash does not exist.", async () => {

    const ethDIDAnchorInstance = await EthDIDAnchor.deployed();

    var testFakeHash = "test fake hash";

    const doesHashExist = await ethDIDAnchorInstance.doesHashExist(testFakeHash.valueOf());

    assert.equal(doesHashExist, false, "The anchor hash does exits");
  });

})
