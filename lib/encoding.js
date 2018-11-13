const bs58 = require("bs58");

// https://ethereum.stackexchange.com/a/39961/37119
// Fits the ipfs hash into 32 bytes
function getBytes32FromSHA256Hash(hash) {
  return "0x"+bs58.decode(hash).slice(2).toString('hex');
}

// Reconstructs a multihash from bytes32
function getMultiHashFromBytes32(bytes32Hex) {
  // Add our default ipfs values for first 2 bytes:
  // function:0x12=sha2, size:0x20=256 bits
  // and cut off leading "0x"
  const hashHex = "1220" + bytes32Hex.slice(2)
  const hashBytes = Buffer.from(hashHex, 'hex');
  const hashStr = bs58.encode(hashBytes)
  return hashStr;
}
 
function encodeBase58FromString(data) {
  const bytes = Buffer.from(data, "utf8");
  return bs58.encode(bytes);
}

function decodeBase58ToString(data) {
  const bytes = bs58.decode(data);
  return bytes.toString("utf8");
}

function encodeBase58FromBuffer(bytes) {
  return bs58.encode(bytes);
}

module.exports = {encodeBase58FromString, decodeBase58ToString, getBytes32FromSHA256Hash, getMultiHashFromBytes32, encodeBase58FromBuffer}