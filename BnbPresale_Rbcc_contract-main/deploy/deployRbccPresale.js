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

  console.log("deploying...");
  // console.log("hardhat init...");
  // const retVal = await hreconfig.hreInit(hre);
  // console.log('retVal', retVal)
  // if (!retVal) {
  //   console.log("hardhat init error!");
  //   return false;
  // }
  await run("clean");
  await run("compile");
  console.log("hardhat init OK");

  //await run("compile");
  console.log("Compiled contracts...");
  const [owner] = await ethers.getSigners();

  console.log(owner.address);

  let RbccPresaleContract = await ethers.getContractFactory("RbccPresale");
  // let RbccContract = await ethers.getContractFactory("contracts/RbccPresale.sol:Robocopcoin");

  // const RbccPresale = await RbccPresaleContract.deploy(
  //   "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684", // BSC USDT ADDRESS
  //   "0x98AEdA7aC821D8d9D77dBf482e44FB05837a88Be" // Robocopcoin ADDRESS
  // );
  const RbccPresale = await RbccPresaleContract.deploy(
    "0x9547105772feFA88EA98F70c828E27c8CecD22da", // Holesky USDT ADDRESS
    "0x56D8818F71Ae3A14Ca655a8250186C44C13E9b41" // Robocopcoin ADDRESS
  );

  await RbccPresale.deployed();
  console.log("RbccPresale:", RbccPresale.address);

  await sleep(10000);

  let deployedAddress = "";
  deployedAddress = RbccPresale.address.toString();
  // await verify(deployedAddress, [
  //   "0x7ef95a0FEE0Dd31b22626fA2e10Ee6A223F8a684",
  //   "0x98AEdA7aC821D8d9D77dBf482e44FB05837a88Be",
  // ]);
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
