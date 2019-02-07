import config from "../index";

describe("Config", () => {
  describe("sidetreeEthereumNodeAccount", () => {
    test("uses mneumonic to create sidetreeEthereumNodeAccount", async () => {
      const { mnemonic, sidetreeEthereumNodeAccount } = config;

      expect(mnemonic).toBe(
        "weird ensure parent humor crawl doctor machine narrow subway bleak panel worth"
      );
      expect(sidetreeEthereumNodeAccount.address).toBe(
        "0x6BB093d7bbe83E19AE8173eE29E8830521e1BBb3"
      );
      expect(sidetreeEthereumNodeAccount.publicKey).toBeDefined();
      expect(sidetreeEthereumNodeAccount.privateKey).toBeDefined();
    });
  });
});
