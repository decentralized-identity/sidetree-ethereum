import Web3Service from '../Web3Service';

let anchorFileHash =
  '0x3ddbe2be8cfc5313f6160bfa263651f000fb70e5a6af72f3de798fa58933f3d9';

describe('Web3 Service', () => {
  let web3Svc;

  beforeAll(() => {
    web3Svc = new Web3Service('http://localhost:8545');
  });

  test('getLatestBlockchainTime', async () => {
    const { time, hash } = await web3Svc.getLatestBlockchainTime();
    expect(time).toBeDefined();
    expect(hash).toBeDefined();
  });

  test('getBlockchainTime', async () => {
    const { time, hash } = await web3Svc.getBlockchainTime(2);
    expect(time).toBeDefined();
    expect(hash).toBeDefined();
  });

  describe('anchorHash', () => {
    test('can await write anchor', async () => {
      let receipt = await web3Svc.anchorHash(anchorFileHash);
      expect(receipt.logs.length).toBe(1);
      expect(receipt.logs[0].args.anchorFileHash).toBe(anchorFileHash);
      expect(receipt.logs[0].args.transactionNumber).toBeDefined();
    });

    test('can fire and forget write anchor', async () => {
      let receipt = web3Svc.anchorHash(anchorFileHash);
      expect(receipt.then).toBeDefined();
    });

    test('can listen for events', async () => {
      let receipt = web3Svc.anchorHash(anchorFileHash);
      expect(receipt.then).toBeDefined();
    });
  });

  test('can listen for events', done => {
    let subscription = web3Svc.subscribeToAnchorEvents(async (err, log) => {
      if (err) {
        throw err;
      }
      expect(log.args.anchorFileHash).toBe(anchorFileHash);
      expect(log.args.transactionNumber).toBeDefined();
      (await subscription).unsubscribe();
      done();
    });
    web3Svc.anchorHash(anchorFileHash);
  });

  describe('getTransactions', () => {
    let lastTransaction;

    it('should return all transactions', async () => {
      await web3Svc.anchorHash(anchorFileHash);
      let transactions = await web3Svc.getTransactions();
      expect(transactions[0].anchorFileHash).toBeDefined();
      lastTransaction = transactions[transactions.length - 1];
      await web3Svc.anchorHash(anchorFileHash);
    });

    it('should return all transactions since transactionTime, transactionTimeHash', async () => {
      const { transactionNumber, transactionTimeHash } = lastTransaction;
      const transactionsSince = await web3Svc.getTransactionsSince(
        transactionNumber,
        transactionTimeHash
      );
      expect(lastTransaction.transactionNumber).toBeLessThan(
        transactionsSince[0].transactionNumber
      );
    });
  });

  afterAll(() => {
    web3Svc.stop();
    web3Svc = null;
  });
});
