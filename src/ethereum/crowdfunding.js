import web3 from "./web3";
import compiledContract from './build/CrowdFunding.json';

const ContractInstance = new web3.eth.Contract(
    JSON.parse(compiledContract.interface),
    "0x3711c906Ba96a64AA5e4a7a270E8342e96Ca8261"
);

export default ContractInstance;
