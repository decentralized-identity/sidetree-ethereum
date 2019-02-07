const multihash = require('multihashes');
const base58 = require('bs58');

const isMultihash = (hash: string) => {
  try {
    const buffer = Buffer.from(base58.decode(hash));
    multihash.decode(buffer);
    return true;
  } catch (e) {
    return false;
  }
};

const base58EncodedMultihashToBytes32 = (base58EncodedMultihash: string) => {
  return (
    '0x' +
    multihash
      .toHexString(multihash.fromB58String(base58EncodedMultihash))
      .substring(4)
  );
};

const bytes32EnodedMultihashToBase58EncodedMultihash = (
  bytes32EncodedMultihash: string
) => {
  return multihash.toB58String(
    multihash.fromHexString('1220' + bytes32EncodedMultihash.replace('0x', ''))
  );
};

export default {
  isMultihash,
  base58EncodedMultihashToBytes32,
  bytes32EnodedMultihashToBase58EncodedMultihash
};
