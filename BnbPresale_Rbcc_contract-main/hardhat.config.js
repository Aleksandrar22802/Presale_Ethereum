require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-verify");

const bscscanApiKey = "TYMHTBYRHGD173T5WU3S5CN1218AS6QYKK";
const etherscanApiKey = "Y23I732R89R59JBZC9E1TFFTCTAD85CCW3"

const BSC_KEY = process.env.BSC_KEY.toString();

const config = {
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {},
    bscMainnet: {
      // url: `https://bsc-dataseed1.ninicoin.io`,
      url: `https://bscrpc.com`,
      chainId: 56,
      accounts: [BSC_KEY],
    },
    bscTestnet: {
      url: `https://bsc-testnet-rpc.publicnode.com`,
      // url: `https://endpoints.omniatech.io/v1/bsc/testnet/public`,
      chainId: 97,
      accounts: [BSC_KEY],
      gas: 2100000,
      gasPrice: 8000000000,
    },
    holeskyTestnet: {
      url: `https://ethereum-holesky-rpc.publicnode.com`,
      chainId: 17000,
      accounts: [BSC_KEY],
      gas: 2100000,
      gasPrice: 8000000000,
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://bscscan.com/
    // apiKey: bscscanApiKey,
    apiKey: etherscanApiKey,
  },
  sourcify: {
    enabled: true
  },  
  solidity: {
    compilers: [
      {
        version: "0.8.20",
        settings: {
          optimizer: {
            enabled: true,
            runs: 99999,
          },
        },
      },
    ],
  },
};

module.exports = config;
