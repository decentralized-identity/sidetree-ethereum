// tslint:disable-next-line
const Web3 = require("web3");
const contract = require('truffle-contract');
// tslint:disable-next-line
const HDWalletProvider = require("truffle-hdwallet-provider");
// const WebSocketProvider = require('web3-provider-engine/subproviders/websocket');

import config from '../config';

import encoding from '../util/encoding';

/**
 * Web3Service Service for communicating with ethereum using HDWallet Provider and WebSockets
 */
export default class Web3Service {
  /**
   * @property Web3 instance for communicating with ethereum
   */
  private web3: any;
  private anchorContractArtifact: any;

  private anchorContract: any;

  private provider: any;

  constructor () {
    if (
      config.web3Provider === 'http://localhost:8545' ||
      config.web3Provider === 'http://ganache:8545'
    ) {
      this.provider = new Web3.providers.WebsocketProvider(config.web3Provider);
    } else {
      this.provider = new HDWalletProvider(
        config.mnemonic,
        config.web3Provider
      );
    }

    this.web3 = new Web3(this.provider);
    this.anchorContractArtifact = config.AnchorContractArtifact;
    this.anchorContract = contract(this.anchorContractArtifact);
    this.anchorContract.setProvider(this.web3.currentProvider);
  }

  /**
   * Get latest block number and block hash
   * @link https://github.com/decentralized-identity/sidetree-core/blob/master/docs/implementation.md#get-latest-blockchain-time
   */
  public getLatestBlockchainTime = async () => {
    const blockNumber = await this.web3.eth.getBlockNumber();
    return this.getBlockchainTime(blockNumber);
  }

  /**
   * Get block number and block hash from block number or block hash
   * @link https://github.com/decentralized-identity/sidetree-core/blob/master/docs/implementation.md#get-blockchain-time-by-hash
   */
  public getBlockchainTime = async (
    blockHashOrBlockNumber: number | string
  ) => {
    const block = await this.web3.eth.getBlock(blockHashOrBlockNumber);

    const unPrefixedBlockhash = block.hash.replace('0x', '');
    return {
      time: block.number,
      hash: unPrefixedBlockhash
    };
  }

  /**
   * Anchor a hex encoded anchorFileHash as bytes32
   * @link https://github.com/decentralized-identity/sidetree-core/blob/master/docs/implementation.md#write-a-sidetree-transaction
   */
  public anchorHash = async (bytes32EncodedHash: string) => {
    const instance = await this.anchorContract.deployed();
    return instance.anchorHash(bytes32EncodedHash, {
      from: config.sidetreeEthereumNodeAccount.address
    });
  }

  /**
   * Get all sidetree transactions from a given block
   * @link https://github.com/decentralized-identity/sidetree-core/blob/master/docs/implementation.md#request-query-parameters
   */
  public getTransactions = async (fromBlock: number = 0) => {
    const instance = await this.anchorContract.deployed();
    const logs = await instance.getPastEvents('Anchor', {
      // TODO: add indexing here... https://ethereum.stackexchange.com/questions/8658/what-does-the-indexed-keyword-do
      fromBlock,
      toBlock: 'latest'
    });
    return logs.map((log: any) => {
      return {
        transactionTime: log.blockNumber,
        transactionTimeHash: log.blockHash,
        transactionNumber: log.args.transactionNumber.toNumber(),
        anchorFileHash: encoding.bytes32EnodedMultihashToBase58EncodedMultihash(
          log.args.anchorFileHash
        )
      };
    });
  }

  /**
   * Get all sidetree transactions from a transactionNumber and transactionTimeHash
   * @link https://github.com/decentralized-identity/sidetree-core/blob/master/docs/implementation.md#request-query-parameters
   */
  public getTransactionsSince = async (
    transactionNumber: number,
    transactionTimeHash: string
  ) => {
    const { time, hash } = await this.getBlockchainTime(transactionTimeHash);
    const transactions = await this.getTransactions(time);
    return transactions.filter((t: any) => {
      return t.transactionNumber > transactionNumber;
    });
  }

  /**
   * Subscribe to sidetree events
   */
  public subscribeToAnchorEvents = async (callback: Function) => {
    const instance = await this.anchorContract.deployed();
    const subscription = instance.Anchor(callback);
    return subscription;
  }

  /**
   * Gracefully close web3 connection
   */
  public stop = () => {
    this.provider.engine.stop();
    this.web3.currentProvider.engine.stop();
    this.web3.setProvider(null);
    this.web3 = null;
    return true;
  }
}
