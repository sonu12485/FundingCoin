import web3 from "./web3";
import compiledContract from './build/CrowdFunding.json';

const ContractInstance = new web3.eth.Contract(
    JSON.parse(compiledContract.interface),
    "0xc99c6b0a2c3e7004b5a45c58443df5e9902d2077"
);

export default ContractInstance;
