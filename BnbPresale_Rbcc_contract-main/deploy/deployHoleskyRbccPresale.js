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

    console.log("Clean contracts...");
    await run("clean");
    console.log("Compiled contracts...");
    await run("compile");

    const [owner] = await ethers.getSigners();
    console.log("Signer Address = " + owner.address);

    let RbccPresaleContract = await ethers.getContractFactory("HoleskyRbccPresale");

    let wallet2Address = "0xA6a01706Cf76D95C38695923525fD5F29dB4b6E4";
    let usdtTokenAddress = "0xFdf8062Ad4D57F1539D122231A2b189cfc58a955";
    let rbccTokenAddress = "0x45f3A831cf3B4b45941546807B061699124b1e51";
    let rbccTokenOwner = wallet2Address;
    const RbccPresale = await RbccPresaleContract.deploy(
        wallet2Address,
        usdtTokenAddress,
        rbccTokenAddress,
        rbccTokenOwner,
    );

    await RbccPresale.deployed();
    console.log("RbccPresale = ", RbccPresale.address);

    /*
    await sleep(10000);

    let deployedAddress = "";
    deployedAddress = RbccPresale.address.toString();
    await verify(deployedAddress, [
        wallet2Address,
        usdtTokenAddress,
        rbccTokenAddress,
        rbccTokenOwner,
    ]);
    */
};

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
