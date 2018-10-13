import web3 from "./web3";
import compiledContract from './build/CrowdFunding.json';

const ContractInstance = new web3.eth.Contract(
    JSON.parse(compiledContract.interface),
    "0x2f293efd4f7638a98da48d5019a919c03b9b49e1"
);

export default ContractInstance;
