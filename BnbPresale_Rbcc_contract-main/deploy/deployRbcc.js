const { ethers, run, network } = require("hardhat");
// import config from "../config";
const { sleep } = require("sleep-ts");
// const hreconfig = require("@nomicfoundations/hardhat-config");

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

  // console.log("deploying...");
  // console.log("hardhat init...");
  // const retVal = await hreconfig.hreInit(hre);
  // if (!retVal) {
  //   console.log("hardhat init error!");
  //   return false;
  // }

  await run("compile");
  console.log("Compiled contracts...");
  const [owner] = await ethers.getSigners();

  console.log(owner.address);

  let RbccContract = await ethers.getContractFactory("contracts/Robocopcoin.sol:Robocopcoin");
  const Rbcc = await RbccContract.deploy(
    "0xA6a01706Cf76D95C38695923525fD5F29dB4b6E4"
  );
  await Rbcc.deployed();
  console.log("Rbcc:", Rbcc.address);

  await sleep(10000);

  let deployedAddress = "";
  deployedAddress = Rbcc.address.toString();
  await verify(deployedAddress, ["0xA6a01706Cf76D95C38695923525fD5F29dB4b6E4"]);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
