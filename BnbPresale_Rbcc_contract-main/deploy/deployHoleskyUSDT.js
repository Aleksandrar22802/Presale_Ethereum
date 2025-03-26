const { ethers, run, network } = require("hardhat");
const { sleep } = require("sleep-ts");

const verify = async (address, parameter = []) => {
    console.log(`Veryfing ${address} ...`);
    await run("verify:verify", {
        address: address,
        constructorArguments: parameter,
    });
    console.log("Success!");
};

const main = async () => {
    // Get network data from Hardhat config (see hardhat.config.ts).
    const networkName = network.name;
    // Check if the network is supported.
    console.log(`Deploying to ${networkName} network...`);

    console.log("Compiled contracts...");
    await run("compile");

    const [owner] = await ethers.getSigners();
    console.log("Signer Address = " + owner.address);

    console.log(owner.address);

    let HoleskyUSDTContract = await ethers.getContractFactory("contracts/HoleskyUSDTCoin.sol:HoleskyUSDTCoin");
    const HoleskyUSDT = await HoleskyUSDTContract.deploy("0xad5518188e17860f63112e995372D834519426eD");
    await HoleskyUSDT.deployed();
    console.log("HoleskyUSDT = ", HoleskyUSDT.address);

    await sleep(10000);

    let deployedAddress = "";
    deployedAddress = HoleskyUSDT.address.toString();
    await verify(deployedAddress, ["0xad5518188e17860f63112e995372D834519426eD"]);
};

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
