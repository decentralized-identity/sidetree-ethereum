const EthDIDAnchor = artifacts.require("./EthDIDAnchor.sol");

contract("EthDIDAnchor", accounts => {
  it("...should verify hash exists.", async () => {

    const ethDIDAnchorInstance = await EthDIDAnchor.deployed();

    const anchorHash = "0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab";
    const ipfsHash = "0x4fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab";

    let receipt = await ethDIDAnchorInstance.newAnchorHash(anchorHash, ipfsHash,  { from: accounts[0] });
    const getIPFSHashForAnchor = await ethDIDAnchorInstance.getIPFSHashForAnchor(anchorHash);

    assert.equal(getIPFSHashForAnchor, ipfsHash, "The anchor hash exists");
    assert.equal(receipt.logs[0].event, "AnchorHashCreated");
    assert.equal(receipt.logs[0].args.anchorHash, anchorHash);
    assert.equal(receipt.logs[0].args.ipfsHash, ipfsHash);
    assert.equal(receipt.logs[0].args.transactionNumber.toNumber(), 1);
  });

  it("...should verify hash does not exist.", async () => {

    const ethDIDAnchorInstance = await EthDIDAnchor.deployed();
    const anchorHash = "0x9fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab";

    const getIPFSHashForAnchor = await ethDIDAnchorInstance.getIPFSHashForAnchor(anchorHash);

    assert.equal(getIPFSHashForAnchor, '0x0000000000000000000000000000000000000000000000000000000000000000', "The anchor hash does not exist");
  });

})
