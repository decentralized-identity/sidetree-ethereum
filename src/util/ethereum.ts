const bip39 = require('bip39');
const hdkey = require('hdkey');
const ethUtil = require('ethereumjs-util');

/**
 * genetate a hex encoded account from mnemonic and path
 * @function
 * @name mnemonicToAccount
 * @param {String} mnemonic for hd wallet
 * @param {String} hdPath path to keypair
 * @returns {Object} hex encoded account properties
 */
const mnemonicToAccount = (mnemonic: string, hdPath: string) => {
  const seed = bip39.mnemonicToSeed(mnemonic);
  const root = hdkey.fromMasterSeed(seed);
  const addrNode = root.derive(hdPath);
  const pubKey = ethUtil.privateToPublic(addrNode._privateKey);
  const addr = ethUtil.publicToAddress(pubKey).toString('hex');
  const address = ethUtil.toChecksumAddress(addr);
  return {
    address,
    publicKey: pubKey.toString('hex'),
    privateKey: addrNode._privateKey.toString('hex')
  };
};

export default {
  mnemonicToAccount
};
