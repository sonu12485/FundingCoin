import web3 from "./web3";
import compiledContract from './build/CrowdFunding.json';

let ContractInstance;

if(web3 !== 0)
{
    ContractInstance = new web3.eth.Contract(
        JSON.parse(compiledContract.interface),
        "0xc248e2e2b52558352311e263744f08cde66d6748"
    );
}

export default ContractInstance;
