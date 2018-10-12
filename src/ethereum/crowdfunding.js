import web3 from "./web3";
import compiledContract from './build/CrowdFunding.json';

const ContractInstance = new web3.eth.Contract(
    JSON.parse(compiledContract.interface),
    "0x4268a503dc9e981a1f856b790c364fa350e77c3e"
);

export default ContractInstance;
