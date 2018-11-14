const ipfsAPI = require("ipfs-api");
const config = require("../config");
 
const ipfs = ipfsAPI(config.ipfsOpts);

module.exports = ipfs;