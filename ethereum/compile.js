const path = require("path");
const solc = require("solc");
const fs = require("fs-extra");

const buildPath = path.resolve(__dirname, "build");

// Removed build folder
fs.removeSync(buildPath);

// Read & Compile Contracts
const contractPath = path.resolve(__dirname, "contracts", "CrowdFunding.sol");
const source = fs.readFileSync(contractPath, "utf8");
const compiledContract = solc.compile(source, 1).contracts;

// Make build folder
fs.ensureDirSync(buildPath);

// Make json files for each contract
for(let contract in compiledContract)
{
    fs.outputJsonSync(
        path.resolve(buildPath, `${contract.replace(":","")}.json`),
        compiledContract[contract]
    );
}
