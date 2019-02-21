pragma solidity 0.5.0;

contract EthDIDAnchor {

    // Mapping anchor hash to the ipfs hash
    mapping (bytes32 => bytes32) anchors;

    // Mapping the txnNumber to anchorHash
    bytes32[] public transactions;
    uint256 public transactionNumber = 0;

    event AnchorHashCreated(bytes32 anchorHash, bytes32 ipfsHash, uint256 transactionNumber);

    function newAnchorHash(bytes32 _anchorHash, bytes32 _ipfsHash) public {
        anchors[_anchorHash] = _ipfsHash;
        transactions.push(_anchorHash);
        transactionNumber++;

        emit AnchorHashCreated(_anchorHash, _ipfsHash, transactionNumber);
    }

    function getIPFSHashForAnchor(bytes32 _anchorHash) public view returns(bytes32) {
        return anchors[_anchorHash];
    }

}
