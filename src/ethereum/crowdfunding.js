import web3 from "./web3";
import compiledContract from './build/CrowdFunding.json';

const ContractInstance = new web3.eth.Contract(
    JSON.parse(compiledContract.interface),
    "0xe74bd2362d572aac488573e97b688f3d6bda357e"
);

export default ContractInstance;
