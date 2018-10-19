pragma solidity ^0.4.21;

contract EthDIDAnchor {
    
    mapping (string => bool) anchors;
    
    event AnchorHashCreated(string anchorHash);
    
    function newAnchorHash(string _anchorHash) public {
        anchors[_anchorHash] = true;
        emit AnchorHashCreated(_anchorHash);
    }
    
    function doesHashExist(string _anchorHash) public view returns(bool) {
        return anchors[_anchorHash];
    }
    
}
