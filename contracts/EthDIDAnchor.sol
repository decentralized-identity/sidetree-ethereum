pragma solidity ^0.4.21;

contract EthDIDAnchor {

    mapping (bytes32 => bool) anchors;

    event AnchorHashCreated(bytes32 anchorHash);

    function newAnchorHash(bytes32 _anchorHash) public {
        anchors[_anchorHash] = true;
        emit AnchorHashCreated(_anchorHash);
    }

    function doesHashExist(bytes32 _anchorHash) public view returns(bool) {
        return anchors[_anchorHash];
    }

}
