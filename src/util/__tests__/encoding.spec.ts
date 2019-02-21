import encoding from '../encoding';

import fixtures from '../../../test/__fixtures__';

const multihash = require('multihashes');

const { anchorFileHash } = fixtures;
describe('encoding', () => {
  describe('sanity', () => {
    test('can convert anchorFileHash to bytes32 and back', async () => {
      const hexEncodedMultihash = multihash.toHexString(
        multihash.fromB58String(anchorFileHash)
      );
      const bytes32EncodedMultihash = hexEncodedMultihash.substring(4);
      const recoveredHexEncodedMultihash = '1220' + bytes32EncodedMultihash;
      const recoveredBase58Multihash = multihash.fromHexString(
        recoveredHexEncodedMultihash
      );
      const recoveredAnchorFileHash = multihash.toB58String(
        recoveredBase58Multihash
      );
      expect(recoveredAnchorFileHash).toBe(anchorFileHash);
    });
  });

  test('base58EncodedMultihashToBytes32', async () => {
    const bytes32Encoded = await encoding.base58EncodedMultihashToBytes32(
      anchorFileHash
    );
    expect(bytes32Encoded).toBe(
      '0xd04f49bc8589da99d9f3c4c1a38960f6da89660d53a25874a73a04993c06ac61'
    );
  });

  test('bytes32EnodedMultihashToBase58EncodedMultihash', async () => {
    const recoveredAnchorFileHash = await encoding.bytes32EnodedMultihashToBase58EncodedMultihash(
      '0xd04f49bc8589da99d9f3c4c1a38960f6da89660d53a25874a73a04993c06ac61'
    );
    expect(recoveredAnchorFileHash).toBe(anchorFileHash);
  });
});
