const Web3 = require("web3");

let web3;

if(typeof window.web3 === "undefined")
{
    web3 = 0;
}
else
{
    web3 = new Web3( window.web3.currentProvider );
}

export default web3;
