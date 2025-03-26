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

  let HoleskyNativeContract = await ethers.getContractFactory("contracts/HoleskyNativeCoin.sol:HoleskyNativeCoin");
  const HoleskyNative = await HoleskyNativeContract.deploy(
    "0xad5518188e17860f63112e995372D834519426eD"
  );
  await HoleskyNative.deployed();
  console.log("HoleskyNative:", HoleskyNative.address);

  await sleep(10000);

  let deployedAddress = "";
  deployedAddress = HoleskyNative.address.toString();
  await verify(deployedAddress, ["0xad5518188e17860f63112e995372D834519426eD"]);
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
