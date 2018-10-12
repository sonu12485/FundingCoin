import web3 from "./web3";
import compiledContract from './build/CrowdFunding.json';

const ContractInstance = new web3.eth.Contract(
    JSON.parse(compiledContract.interface),
    "0x0367a14e8bd7326aadbb592ab0f2306a0053fd3e"
);

export default ContractInstance;
