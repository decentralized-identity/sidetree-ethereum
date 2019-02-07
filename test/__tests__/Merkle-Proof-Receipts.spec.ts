import fixtures from '../__fixtures__';

// tslint:disable-next-line
const MerkleTools = require("merkle-tools");

const crypto = require('crypto');

const sha256 = data => {
  const h = crypto.createHash('sha256');
  h.update(data);
  return h.digest('hex');
};

let treeOptions = {
  hashType: 'sha256' // optional, defaults to 'sha256'
};

describe('Merkle-Proof-Receipts', () => {
  test('can create receipts for each operation', async () => {
    let treeOptions = {
      hashType: 'sha256' // optional, defaults to 'sha256'
    };

    let operations = ['create:did:123', 'update:did:456', 'delete:did:789'];

    let merkleTools = new MerkleTools(treeOptions);
    merkleTools.addLeaves(operations, true);

    merkleTools.makeTree();

    const merkleRoot = merkleTools.getMerkleRoot();

    const receipts = operations.map(operation => {
      return {
        operationHash: sha256(operation),
        operationProof: merkleTools.getProof(operations.indexOf(operation))
      };
    });

    const validatedReceipts = receipts.map(r => {
      return merkleTools.validateProof(
        r.operationProof,
        r.operationHash,
        merkleRoot
      );
    });
    validatedReceipts.map(isValid => {
      expect(isValid);
    });
    merkleTools.resetTree();
  });
});
