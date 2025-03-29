const { ethers, run, network } = require("hardhat");
const { sleep } = require("sleep-ts");
const { isAddress } = require("ethers/lib/utils");

const rbccABI = require("./artifacts/contracts/HoleskyRbccCoin.sol/HoleskyRbccCoin.json");

const main = async () => {
    let wallet2Address = "0xA6a01706Cf76D95C38695923525fD5F29dB4b6E4";
    let rbccWalletAddress = wallet2Address;

    let presaleContractAddress = "0x6D894D58bE5d2C005399626b868fb4382f0BCAd8";

    if (isAddress(wallet2Address) == false)
    {
        console.log("invalid address");
        return;
    }

    const provider = new ethers.providers.JsonRpcProvider("https://ethereum-holesky-rpc.publicnode.com", 17000);
    const BSC_KEY = process.env.BSC_KEY.toString();
    const signer = new ethers.Wallet(BSC_KEY, provider);
    // const [signer] = await ethers.getSigners();
    console.log("Signer Address = " + signer.address);

    console.log("create rbcc token contract ....");
    let rbccContractAddress = "0x45f3A831cf3B4b45941546807B061699124b1e51";
    let rbccTokenContract = (await ethers.getContractAt(rbccABI.abi, rbccContractAddress)).connect(signer);
    
    console.log("valance Of wallet2 = ", await rbccTokenContract.balanceOf(wallet2Address));

    console.log("approve to presale contract ...");
    const RBCC_DECIMAL = 1e8;
    const limitRbccForPresale = 10000;
    await rbccTokenContract.connect(rbccWalletAddress);
    await rbccTokenContract.approve(presaleContractAddress, limitRbccForPresale * RBCC_DECIMAL);

    console.log("get allowance of ...");
    console.log("allowance = ", await rbccTokenContract.allowance(rbccWalletAddress, presaleContractAddress));
};

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
