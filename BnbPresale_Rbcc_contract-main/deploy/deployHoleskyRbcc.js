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

    let HoleskyRbccContract = await ethers.getContractFactory("contracts/HoleskyRbccCoin.sol:HoleskyRbccCoin");
    const HoleskyRbcc = await HoleskyRbccContract.deploy("0xA6a01706Cf76D95C38695923525fD5F29dB4b6E4");
    await HoleskyRbcc.deployed();
    console.log("HoleskyRbcc = ", HoleskyRbcc.address);

    await sleep(10000);

    let deployedAddress = "";
    deployedAddress = HoleskyRbcc.address.toString();
    await verify(deployedAddress, ["0xA6a01706Cf76D95C38695923525fD5F29dB4b6E4"]);
};

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
