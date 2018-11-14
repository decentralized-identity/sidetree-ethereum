/**
 * Content addressable storage
 */

const ipfs = require("../lib/ipfs");

async function fetchBufferAtAddress(CASAddress) {
  const ipfsData = await ipfs.files.get(CASAddress);
  return ipfsData[0].content;
}

async function putBuffer(bufferData) {
  const address = await ipfs.files.add(bufferData);
  return address;
}

module.exports = { fetchBufferAtAddress, putBuffer }