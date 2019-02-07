import { Response, ResponseStatus } from './Response';

import Web3Service from './Web3Service';

import encoding from '../util/encoding';

/**
 * Sidetree Ethereum request handler class
 * @link https://github.com/decentralized-identity/sidetree-bitcoin/blob/master/src/RequestHandler.ts
 */
export default class RequestHandler {
  private web3Svc: Web3Service;
  /**
   * @param web3ProviderUrl URI for the blockchain service
   */
  public constructor () {
    this.web3Svc = new Web3Service();
  }

  /**
   * Returns the blockhash of the last block in the blockchain
   */
  public async handleLastBlockRequest (): Promise<Response> {
    try {
      const { time, hash } = await this.web3Svc.getLatestBlockchainTime();
      return {
        status: ResponseStatus.Succeeded,
        body: {
          time,
          hash
        }
      };
    } catch (e) {
      return {
        status: ResponseStatus.ServerError,
        body: {
          message: 'failed to getLatestBlockchainTime from web3Svc.'
        }
      };
    }
  }

  /**
   * Returns the blockNumber for a given hash
   */
  public async handleBlockNumberFromBlockHash (
    blockNumber: number
  ): Promise<Response> {
    try {
      const { time, hash } = await this.web3Svc.getBlockchainTime(blockNumber);
      return {
        status: ResponseStatus.Succeeded,
        body: {
          time,
          hash
        }
      };
    } catch (e) {
      return {
        status: ResponseStatus.ServerError,
        body: {
          message: 'failed to getBlockchainTime from web3Svc.'
        }
      };
    }
  }

  /**
   * Handles sidetree transaction anchor request
   * @param requestBody Request body containing the anchor file hash.
   */
  public async handleAnchorRequest (requestBody: Buffer): Promise<any> {
    const jsonBody = JSON.parse(requestBody.toString());
    const anchorFileHash = jsonBody.anchorFileHash;

    // Respond with '400' if no anchor file hash was given.
    if (!anchorFileHash) {
      return {
        status: ResponseStatus.BadRequest
      };
    }

    // Respond with '400' if no anchor file hash is not lower case hex string
    if (!encoding.isMultihash(anchorFileHash)) {
      return {
        status: ResponseStatus.BadRequest
      };
    }

    let anchorFileHashAsBytes32 = encoding.base58EncodedMultihashToBytes32(
      anchorFileHash
    );

    this.web3Svc
      .anchorHash(anchorFileHashAsBytes32)
      .then(receipt => {
        // console.log(receipt);
      })
      .catch(e => {
        // console.error(e);
      });

    return {
      status: ResponseStatus.Succeeded
    };
  }

  /**
   * Handles sidetree transaction anchor request
   * @param requestBody Request body containing the anchor file hash.
   */
  public async handleReadTransactions (
    since: number,
    transactionTimeHash: string
  ): Promise<any> {
    const currentTime = await this.web3Svc.getLatestBlockchainTime();
    let transactions;

    if (!since || !transactionTimeHash) {
      transactions = await this.web3Svc.getTransactions(0);
    } else {
      transactions = await this.web3Svc.getTransactionsSince(
        since,
        transactionTimeHash
      );
    }

    return {
      status: ResponseStatus.Succeeded,
      body: {
        moreTransactions:
          transactions[transactions.length - 1].transactionNumber ===
          currentTime.time,
        transactions
      }
    };
  }
}
