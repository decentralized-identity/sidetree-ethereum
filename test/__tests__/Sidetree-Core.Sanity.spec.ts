import fixtures from '../__fixtures__';

const MerkleTools = require('merkle-tools');

let treeOptions = {
  hashType: 'sha256' // optional, defaults to 'sha256'
};

describe('Sidetree-Core Sanity', () => {
  test('create operation contains did document', async () => {
    expect(fixtures.didDocument).toEqual(
      JSON.parse(
        Buffer.from(fixtures.createOperation.createPayload, 'base64').toString(
          'utf8'
        )
      )
    );
  });
  test('batch contains create operation', async () => {
    expect(fixtures.createOperation).toEqual(
      JSON.parse(
        Buffer.from(fixtures.batch.operations[0], 'base64').toString('utf8')
      )
    );
  });

  test('can create anchorFileJson from batch', async () => {

    try {

      let operations = ['a', 'b', 'c', 'd'];

      let tree = new MerkleTools(treeOptions);
      tree.addLeaves(operations, true);
      const root = tree.getMerkleRoot();
      let proof = tree.getProof(0);
      console.log('after', root);

    } catch (e) {
      throw e;
    }

    // expect(fixtures.createOperation).toEqual(
    //   JSON.parse(
    //     Buffer.from(fixtures.batch.operations[0], 'base64').toString('utf8')
    //   )
    // );
  });
});
