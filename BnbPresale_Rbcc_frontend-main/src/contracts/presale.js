const CALPresaleContract = {
	address: {
		// 5: "0x38996d2a0f3b773764fd562a5909e380cbeac095",
		// 1: "0x318ceec1819e0d2a0eb922b3d510f923005fd2a9",
		56: '0x799de9896C3DC074F8b05F3B610178D06E1f90B0',
		97: '0x02e09ECFc5e3Aa7dA3F3b5bABBb363b2713e6211',
		17000: '0xfCDF36a605ef7c1116EB54F51dEe19caA486dD3c',
	},
	abi: [
		{
			"inputs": [
			  {
				"internalType": "address",
				"name": "initialOwner",
				"type": "address"
			  },
			  {
				"internalType": "address",
				"name": "stableToken",
				"type": "address"
			  },
			  {
				"internalType": "address",
				"name": "mintToken",
				"type": "address"
			  },
			  {
				"internalType": "address",
				"name": "mintTokenOwner",
				"type": "address"
			  }
			],
			"stateMutability": "nonpayable",
			"type": "constructor"
		  },
		  {
			"anonymous": false,
			"inputs": [
			  {
				"indexed": false,
				"internalType": "uint256",
				"name": "etherAmount",
				"type": "uint256"
			  },
			  {
				"indexed": false,
				"internalType": "uint256",
				"name": "usdtAmount",
				"type": "uint256"
			  },
			  {
				"indexed": false,
				"internalType": "uint256",
				"name": "rbccAmount",
				"type": "uint256"
			  },
			  {
				"indexed": false,
				"internalType": "uint256",
				"name": "pricePerRbcc",
				"type": "uint256"
			  }
			],
			"name": "SoldRbcc",
			"type": "event"
		  },
		  {
			"anonymous": false,
			"inputs": [],
			"name": "StateChange",
			"type": "event"
		  },
		  {
			"inputs": [],
			"name": "_totalClaimed",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [
			  {
				"internalType": "bool",
				"name": "checkTime",
				"type": "bool"
			  }
			],
			"name": "buyTokensWithUSDT",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		  },
		  {
			"inputs": [
			  {
				"internalType": "bool",
				"name": "checkTime",
				"type": "bool"
			  }
			],
			"name": "buyWithEther",
			"outputs": [],
			"stateMutability": "payable",
			"type": "function"
		  },
		  {
			"inputs": [
			  {
				"internalType": "bool",
				"name": "checkTime",
				"type": "bool"
			  }
			],
			"name": "claimRbcc",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		  },
		  {
			"inputs": [
			  {
				"internalType": "address",
				"name": "addr",
				"type": "address"
			  }
			],
			"name": "getAddressBought",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [
			  {
				"internalType": "address",
				"name": "addr",
				"type": "address"
			  }
			],
			"name": "getAddressInvestmentEther",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [
			  {
				"internalType": "address",
				"name": "addr",
				"type": "address"
			  }
			],
			"name": "getAddressInvestmentUSDT",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [],
			"name": "getEtherPrice",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [],
			"name": "getLimitForPresale",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [],
			"name": "getMaxRbccPerWallet",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [],
			"name": "getMinRbccPerWallet",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [],
			"name": "getRemainingTime",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [],
			"name": "getTotalEther",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [],
			"name": "getTotalSold",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [],
			"name": "getTotalUSDT",
			"outputs": [
			  {
				"internalType": "uint256",
				"name": "",
				"type": "uint256"
			  }
			],
			"stateMutability": "view",
			"type": "function"
		  },
		  {
			"inputs": [
			  {
				"internalType": "uint256",
				"name": "price",
				"type": "uint256"
			  }
			],
			"name": "setEtherPrice",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		  },
		  {
			"inputs": [
			  {
				"internalType": "uint256",
				"name": "startTime",
				"type": "uint256"
			  },
			  {
				"internalType": "uint256",
				"name": "endTime",
				"type": "uint256"
			  }
			],
			"name": "setTime",
			"outputs": [],
			"stateMutability": "nonpayable",
			"type": "function"
		  }
	],
};

export default CALPresaleContract;
