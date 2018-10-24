const SimpleAnchor = artifacts.require("./SimpleAnchor.sol");

contract("SimpleAnchor", accounts => {
  let sa;

  before(async () => {
    sa = await SimpleAnchor.deployed();
  });

  describe("writeAnchorFileHash", () => {
    let receipt;
    const contentHash =
      "0x3fd54831f488a22b28398de0c567a3b064b937f54f81739ae9bd545967f3abab";

    before(async () => {
      receipt = await sa.writeAnchorFileHash(contentHash, {
        from: accounts[1]
      });
    });

    it("should emit an event", async () => {
      assert.equal(receipt.logs.length, 1);
      assert.equal(receipt.logs[0].event, "EmittedAnchorFileHash");
    });
  });
});
