pragma solidity ^0.4.21;

contract EthDIDAnchor {

    // Mapping anchor hash to the ipfs hash
    mapping (bytes32 => bytes32) anchors;

    // Mapping the txnNumber to anchorHash
    bytes32[] public transactions;
    uint public transactionNumber = 0;

    event AnchorHashCreated(bytes32 anchorHash, bytes32 ipfsHash);

    function newAnchorHash(bytes32 _anchorHash, bytes32 _ipfsHash) public {
        anchors[_anchorHash] = _ipfsHash;
        transactionNumber++;
        transactions[transactionNumber] = _anchorHash;
        emit AnchorHashCreated(_anchorHash, _ipfsHash);
    }

    function doesHashExist(bytes32 _anchorHash) public view returns(bytes32) {
        return anchors[_anchorHash];
    }

}
