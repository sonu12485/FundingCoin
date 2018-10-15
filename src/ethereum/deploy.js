const HDWalletProvider = require("truffle-hdwallet-provider");

const Web3 = require("web3");

const compiledContract = require("./build/CrowdFunding.json");

const provider = new HDWalletProvider(
    "brain trend profit cereal lucky detect laptop between blue electric flee transfer",
    "https://rinkeby.infura.io/v3/aee593831c8d4a7f8e01c3afe05cc284"
);

const web3 = new Web3(provider);

const deploy = async () =>
{
    const accounts = await web3.eth.getAccounts();

    const contract = await new web3.eth.Contract(JSON.parse(compiledContract.interface))
                        .deploy({
                            data: compiledContract.bytecode,
                        })
                        .send({
                            from: accounts[0],
                            gas: "1000000"
                        });
    console.log(contract.options.address);
}

deploy();

//0xc248e2e2b52558352311e263744f08cde66d6748
