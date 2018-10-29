const Web3 = require("web3");

const DEFAULT_HTTP_PROVIDER = "http://localhost:8545";

let config = {};

config.web3 = new Web3(new Web3.providers.HttpProvider(DEFAULT_HTTP_PROVIDER));
config.gasLimit = "0x30000";

// This account is account[0] when running a local blockchain with the seed mnemonic `excite observe group device struggle fruit refuse birth earth better junk bind`
config.account = {
  address: "0x8603b24f0f511c084ec34fbf631792890a0a1dbc",
  privateKey: "43321939fdfa64cd3f9cf8e05fabf86600c8f349e7cb444f6d23b31f60d4095c"
}

config.WEB_PORT = 3000; // APIs

if (process.env.NODE_ENV == "production") {
  // TODO: read account information from the environment
}

module.exports = config;