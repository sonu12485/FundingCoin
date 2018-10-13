import web3 from "./web3";
import compiledContract from './build/CrowdFunding.json';

const ContractInstance = new web3.eth.Contract(
    JSON.parse(compiledContract.interface),
    "0x8d558e76b5e300bfbcf842ab2da84d2ff8610785"
);

export default ContractInstance;
