import dotenv from 'dotenv';
dotenv.config({ path: process.env.DOTENV_PATH });

import ethereumUtils from '../util/ethereum';

// tslint:disable-next-line
const AnchorContractArtifact = require("../contracts/SimpleSidetreeAnchor.json");

export const app = {
  env: process.env.NODE_ENV || 'development',
  port: process.env.APP_PORT || '3002'
};

let mnemonic = '';
if (!process.env.MNEMONIC) {
  throw new Error('MNEMONIC is required environment variable.');
} else {
  mnemonic = process.env.MNEMONIC;
}

let web3Provider = '';
if (!process.env.WEB3_PROVIDER) {
  throw new Error('WEB3_PROVIDER is required environment variable.');
} else {
  web3Provider = process.env.WEB3_PROVIDER;
}

export default {
  app,
  AnchorContractArtifact,
  mnemonic,
  web3Provider,
  sidetreeEthereumNodeAccount: ethereumUtils.mnemonicToAccount(
    mnemonic,
    "m/44'/60'/0'/0 /0"
  )
};
