import web3 from "./web3";
import compiledContract from './build/CrowdFunding.json';

const ContractInstance = new web3.eth.Contract(
    JSON.parse(compiledContract.interface),
    "0x77e7431e4d0e1bbea56a530f6dd39f4b85f4b490"
);

export default ContractInstance;
