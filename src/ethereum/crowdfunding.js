import web3 from "./web3";
import compiledContract from './build/CrowdFunding.json';

const ContractInstance = new web3.eth.Contract(
    JSON.parse(compiledContract.interface),
    "0x69b175f2b5620f11709b1821b168cdda49795975"
);

export default ContractInstance;
