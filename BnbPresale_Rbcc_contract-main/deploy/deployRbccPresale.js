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

    let RbccPresaleContract = await ethers.getContractFactory("RbccPresale");
    // let RbccContract = await ethers.getContractFactory("contracts/RbccPresale.sol:Robocopcoin");

    let wallet2Address = "0xA6a01706Cf76D95C38695923525fD5F29dB4b6E4";
    const RbccPresale = await RbccPresaleContract.deploy(
        wallet2Address, // Owner ADDRESS
        "0x9547105772feFA88EA98F70c828E27c8CecD22da", // Holesky USDT ADDRESS
        "0x56D8818F71Ae3A14Ca655a8250186C44C13E9b41" // Robocopcoin ADDRESS
    );

    await RbccPresale.deployed();
    console.log("RbccPresale:", RbccPresale.address);

    await sleep(10000);

    let deployedAddress = "";
    deployedAddress = RbccPresale.address.toString();
    await verify(deployedAddress, [
        "0x9547105772feFA88EA98F70c828E27c8CecD22da",
        "0x56D8818F71Ae3A14Ca655a8250186C44C13E9b41",
    ]);
};

main()
.then(() => process.exit(0))
.catch((error) => {
    console.error(error);
    process.exit(1);
});
