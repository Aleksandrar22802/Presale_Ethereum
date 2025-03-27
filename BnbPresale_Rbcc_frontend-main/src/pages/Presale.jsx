import React, { useEffect, useRef, useState } from "react";
import { useAccount, useBalance, useChainId, useContractReads, useContractWrite/*, useWaitForTransaction*/ } from "wagmi";
import { toast } from "react-toastify";
// import { formatEther, parseEther } from "viem";
// import { Progress } from 'react-sweet-progress';
import { Web3 } from "web3"
import BigNumber from "bignumber.js";

import CountDown from "../components/chart/CountDown";
import { /*getContractResult, */getErrorMessage, getFormattedDisplayNumber, getFormattedUnits } from "../utils/constants";
import { getPresaleContract } from "../contracts";
import USDTAbi from "../assets/abi/usdtTokenABI.json"
import PresaleContract from "../contracts/presale"

import IconMint from "../assets/icons/icon-mint.png"
import IconEther from "../assets/icons/lp-CAL_ETH.png"
import IconUSDT from "../assets/icons/lp-caUSD_USDC.png"
import IconRbcc from "../assets/icons/token-LSDoge.png"

import "react-sweet-progress/lib/style.css";

function Presale() {
    const { address } = useAccount();
    let connectedWalletAddress = address;
    console.log("connectedWalletAddress = ", connectedWalletAddress);
    const isConnectedWallet = () => {
        if (connectedWalletAddress != undefined) 
        {
            // console.log("wallet connected");
            return true;
        }
        // console.log("wallet is'nt connected");
        return false;
    }

    const chainId = useChainId()
    console.log("chainId = ", chainId);

    // const { data: accountBalance } = useBalance({ connectedWalletAddress, watch: true })
    // const [startTime, setStartTime] = useState(0);
    // const [endTime, setEndTime] = useState(0);

    // const [softCap, setSoftCap] = useState(0);
    // const [hardCap, setHardCap] = useState(0);
    // const [minAmount, setMinAmount] = useState(0)
    // const [maxAmount, setMaxAmount] = useState(0)
    // const [presaleRate, setPresaleRate] = useState(0)
    // const [listingRate, setListingRate] = useState(0)
    // const [totalDepositedEthAmount, setTotalDepositedEthAmount] = useState(0);
    // const [totalSellingTokenAmount, setTotalSellingTokenAmount] = useState(0);
    // const [userDepositEthAmount, setUserDepositEthAmount] = useState(0);
    // const [totalSupply, setTotalSupply] = useState(0)
    // const refAmount = useRef(null)
    // const token_price = 0.0004

    const [counterDeadline, setCounterDeadline] = useState(0);

    const ethereumConstant = "Ethereum";
    const usdtConstant = "USDT";
    const currencies = ["Ethereum", "USDT"];
    // const currencies = ["Ethereum"];
    const [currencyState, setCurrencyState] = useState(0)

    const [remainingTime, setRemainingTime] = useState(0);
    const [drop, setDrop] = useState(false);
    const [usdtBalance, setUsdtBalance] = useState(0);
    const [ethereumBalance, setEthereumBalance] = useState(0); // New state for Ethereum balance

    const ETHER_DECIMAL = 1000000000000000000;
    // const ETHER_DECIMAL = 1000000000;
    const USDT_DECIMAL = 1000000;
    const RBCC_DECIMAL = 100000000;
    const USDT_PER_ETHER = 2000;
    const USDT_PER_RBCC = 10;

    const defaultWeb3 = new Web3(window.ethereum)
    const usdtToken = "0xFdf8062Ad4D57F1539D122231A2b189cfc58a955";
    const usdtContract = new defaultWeb3.eth.Contract(USDTAbi, usdtToken);

    const [saleCryptoAmount, setSaleCryptoAmount] = useState(0);
    const [buyRbccAmount, setBuyRbccAmount] = useState(0);

    useEffect(() => {
        console.log("saleCryptoAmount = " + saleCryptoAmount);
        let cryptoAmount = saleCryptoAmount;
        if (currencies[currencyState] == ethereumConstant) {
            // ETHER => USDT
            cryptoAmount = cryptoAmount * USDT_PER_ETHER;
            // USDT => RBCC
            cryptoAmount = cryptoAmount / USDT_PER_RBCC;
        }
        else {
            // USDT => RBCC
            cryptoAmount = cryptoAmount / USDT_PER_RBCC;
        }
        setBuyRbccAmount(cryptoAmount);
    }, [saleCryptoAmount])

    const PreSaleStateVal = {
        NotOpened: 0,
        Open: 1,
        End: 2,
        Fail: 3,
    }
    const [preSaleState, setPreSaleState] = useState(PreSaleStateVal.NotOpened);

    const preSaleStateText = [
        "Coming Soon",
        "Presale is alive",
        "Presale has ended",
        "Presale was failed"
    ];
    const preSaleActionText = [
        "Ready",
        "Buy",
        "Claim",
        "Failed"
    ];

    // const [txHash, setTxHash] = useState(null)
    const [pendingTx, setPendingTx] = useState(false);

    const [limitForPresale, setLimitForPresale] = useState(0);

    const { data: limitForPresaleResult } = useContractReads({
        contracts: [
            {
                ...getPresaleContract(chainId),
                functionName: "getLimitForPresale",
                args: [],
            },
        ]
    })

    useEffect(() => {
        if (isConnectedWallet() == false)
        {
            setLimitForPresale(0);
            return;
        }

        if (!limitForPresaleResult || limitForPresaleResult == undefined) 
        {
            setLimitForPresale(0);
            return;
        }

        console.log("limitForPresaleResult - ", limitForPresaleResult)
        if (limitForPresaleResult[0].result != undefined) {
            setLimitForPresale(getFormattedUnits(limitForPresaleResult[0].result));
        } else {
            setLimitForPresale(0);
        }
    }, [limitForPresaleResult])

    const { data: remainingTimeResult } = useContractReads({
        contracts: [
            {
                ...getPresaleContract(chainId),
                functionName: "getRemainingTime",
                args: [],
            },
        ]
    })

    useEffect(() => {
        if (isConnectedWallet() == false)
        {
            setRemainingTime(0);
            return;
        }

        if (!remainingTimeResult || remainingTimeResult == undefined) 
        {
            setRemainingTime(0);
            return;
        }

        console.log("remainingTimeResult - ", remainingTimeResult)
        if (remainingTimeResult[0].result != undefined) {
            setRemainingTime(getFormattedUnits(remainingTimeResult[0].result));
        } else {
            setRemainingTime(0);
        }
    }, [remainingTimeResult])

    useEffect(() => {
        if (isConnectedWallet() == false)
        {
            setCounterDeadline(0)
            setPreSaleState(PreSaleStateVal.End)
            return;
        }

        if (!remainingTimeResult || remainingTimeResult == undefined) 
        {
            setCounterDeadline(0)
            setPreSaleState(PreSaleStateVal.End)
            return;
        }

        console.log("remainingTime--", remainingTime)
        const timerId = setInterval(() => {
            if (parseInt(remainingTime) > 0) 
            {
                setCounterDeadline(remainingTime * 1000)
                setPreSaleState(PreSaleStateVal.Open)
            }
            else 
            {
                setCounterDeadline(0)
                setPreSaleState(PreSaleStateVal.End)
            }
        }, 1000);
        return () => {
            clearInterval(timerId);
        }
    }, [remainingTime])

    const [boughtAmount, setBoughtAmount] = useState(0);

    const { data: addressBoughtResult } = useContractReads({
        contracts: [
            {
                ...getPresaleContract(chainId),
                functionName: "getAddressBought",
                args: isConnectedWallet() == true ? [connectedWalletAddress] : [],
            },
        ]
    })

    useEffect(() => {
        if (isConnectedWallet() == false)
        {
            setBoughtAmount(0);
            return;
        }

        if (!addressBoughtResult || addressBoughtResult == undefined)
        {
            setBoughtAmount(0);
            return;
        }

        console.log("addressBoughtResult - ", addressBoughtResult)
        if (addressBoughtResult[0].result !== undefined) 
        {
            const rbccValue = BigNumber(addressBoughtResult[0].result).dividedBy(RBCC_DECIMAL).toNumber();
            setBoughtAmount(rbccValue);
        } 
        else 
        {
            setBoughtAmount(0);
        }
    }, [addressBoughtResult]);

    const { writeAsync: buyWithEther } = useContractWrite({
        ...getPresaleContract(chainId),
        functionName: "buyWithEther",
        onSuccess: (data) => {
            toast.success("Transaction Submitted!")
            // setTxHash(data.hash)
        },
        onError: (data) => {
            toast.error(getErrorMessage(data))
            // setTxHash(null)
            setPendingTx(false)
        }
    })

    const { writeAsync: buyTokensWithUSDT } = useContractWrite({
        ...getPresaleContract(chainId),
        functionName: "buyTokensWithUSDT",
        onSuccess: (data) => {
            toast.success("Transaction Submitted!")
            // setTxHash(data.hash)
        },
        onError: (data) => {
            toast.error(getErrorMessage(data))
            // setTxHash(null)
            setPendingTx(false)
        }
    })

    const { writeAsync: claimRbcc } = useContractWrite({
        ...getPresaleContract(chainId),
        functionName: "claimRbcc",
        onSuccess: (data) => {
            toast.success("Transaction Submitted!")
            // setTxHash(data.hash)
        },
        onError: (data) => {
            toast.error(getErrorMessage(data))
            // setTxHash(null)
            setPendingTx(false)
        }
    })

    const fetchUsdtBalance = async () => {
        if (connectedWalletAddress == undefined) return;
        try {
            let balance = await usdtContract.methods.balanceOf(connectedWalletAddress).call();
            // console.log("balance = " + balance);
            balance = Number(balance) / Number(USDT_DECIMAL);
            console.log("balance = " + balance);
            setUsdtBalance(balance);
            setSaleCryptoAmount(balance);
        } catch (error) {
            console.error("Error fetching USDT balance:", error);
            setUsdtBalance(0);
        }
    };

    const fetchEthereumBalance = async () => { // New function to fetch Ethereum balance
        if (connectedWalletAddress == undefined) return;
        try {
            // const web3 = new Web3(new Web3.providers.HttpProvider('https://ethereum-holesky-rpc.publicnode.com'));
            const web3 = new Web3(new Web3('https://ethereum-holesky-rpc.publicnode.com'));
            // const web3 = new Web3(window.ethereum)

            let balance = await web3.eth.getBalance(connectedWalletAddress);
            // console.log("balance = " + balance);
            balance = Number(balance) / Number(ETHER_DECIMAL);
            console.log("balance = " + balance);
            setEthereumBalance(balance);
            setSaleCryptoAmount(balance);
        } catch (error) {
            console.error("Error fetching Ethereum balance:", error);
            setEthereumBalance(0);
        }
    };

    useEffect(() => {
        if (connectedWalletAddress) {
            fetchEthereumBalance(); // Fetch Ethereum balance when connectedWalletAddress is available
        }
    }, [connectedWalletAddress]);

    const changeDropState = () => {
        setDrop(!drop);
    }

    const setCurrency = async (idx) => {
        setCurrencyState(idx);
        setDrop(false)
        if (currencies[idx] === usdtConstant) {
            await fetchUsdtBalance();
            setSaleCryptoAmount(usdtBalance)
        }
        if (currencies[idx] === ethereumConstant) {
            await fetchEthereumBalance();
            setSaleCryptoAmount(ethereumBalance)
        }
    }

    // useWaitForTransaction({
    //     hash: txHash,
    //     onSuccess: (data) => {
    //         toast.success("Transaction Success!")
    //         setTxHash(null)
    //         refetchTotalDepositedEther()
    //         setPendingTx(false)
    //     }
    // })

    const handleAction = async () => {
        if (connectedWalletAddress == undefined) return;
        if (preSaleState == PreSaleStateVal.Open) {
            /*
            if (currencies[currencyState] == usdtConstant) 
            {
                if (saleCryptoAmount < 50) {
                    toast.success("Minimum order amount is $50!");
                    return;
                }
            } 
            else 
            {
                if (saleCryptoAmount < (50 / 2057)) {
                    toast.success("Minimum order amount is $50!")
                    return;
                }
            }
            */
            let transferVal = parseFloat(saleCryptoAmount);
            if (!transferVal) return;

            setPendingTx(true);

            let presaleContractAddress = PresaleContract.address[chainId];
            if (currencies[currencyState] == ethereumConstant) {
                // const web3 = new Web3(new Web3.providers.HttpProvider('https://ethereum-holesky-rpc.publicnode.com'));
                const web3 = new Web3(new Web3('https://ethereum-holesky-rpc.publicnode.com'));
                // const web3 = new Web3(window.ethereum)

                const weiValue = BigNumber(saleCryptoAmount).multipliedBy(ETHER_DECIMAL).toNumber();
                // web3.eth.methods.transfer(presaleContractAddress, weiValue).send({
                // 	from: connectedWalletAddress
                // });

                try {
                    const PRIVATE_KEY = "8ba6782e95c3649e364e469fb57f96da4b90336141c63bd1f5e768679363223c";
                    const gasPrice = await web3.eth.getGasPrice();
                    const nonce = await web3.eth.getTransactionCount(connectedWalletAddress, 'latest');

                    const tx = {
                        from: connectedWalletAddress,
                        to: presaleContractAddress,
                        value: weiValue,
                        gas: 21000,  // Estimated gas limit for a simple transaction
                        gasPrice: gasPrice,
                        nonce: nonce,
                        chainId: 17000,
                    };

                    // Sign the transaction
                    const signedTx = await web3.eth.accounts.signTransaction(tx, PRIVATE_KEY);
                    await web3.eth.sendTransaction(signedTx.rawTransaction);

                    // await web3.eth.sendTransaction(tx);

                    // buyWithEther({
                    // 	args: [],
                    // 	from: connectedWalletAddress,
                    // 	value: weiValue
                    // });

                } catch (err) {
                    console.log(`error with ${err}`);
                }
            }
            else {
                try {
                    const weiValue = BigNumber(saleCryptoAmount).multipliedBy(USDT_DECIMAL).toNumber();
                    await usdtContract.methods.transfer(presaleContractAddress, weiValue).send({
                        from: connectedWalletAddress
                    });

                    buyTokensWithUSDT({
                        args: [],
                        from: connectedWalletAddress,
                        value: weiValue
                    });
                } catch (err) {
                    console.log(`error with ${err}`);
                }
            }

            setPendingTx(false);
        }
        else if (preSaleState == PreSaleStateVal.End) {
            setPendingTx(true);

            if (boughtResult[0].result > 0) {
                claimRbcc({
                    args: [],
                    from: connectedWalletAddress,
                });

                setClaimAmount(0);
            }

            setPendingTx(false);
        }
        else if (preSaleState == PreSaleStateVal.Fail) {
            /*
            setPendingTx(true);

            Refund({
                args: [],
                from: connectedWalletAddress
            });

            setPendingTx(false);
            */
        }
    }

    const setInputMax = () => {
        setSaleCryptoAmount(currencies[currencyState] == ethereumConstant ? ethereumBalance : usdtBalance)
    }

    const changeValue = (e) => {
        const val = e.target.value;

        if (currencies[currencyState] == ethereumConstant) {
            if (parseFloat(val) > ethereumBalance) {
                toast.error("Balance is " + ethereumBalance);
                return;
            }
        }
        else {
            if (parseFloat(val) > usdtBalance) {
                toast.error("Balance is " + usdtBalance);
                return;
            }
        }

        setSaleCryptoAmount(parseFloat(val));
    }

    const onClickCurrencyETH = () => {
        document.getElementById("mint_currency_button_usdt").classList.remove("selected");
        document.getElementById("mint_currency_button_eth").classList.add("selected");
    }

    const onClickCurrencyUSDT = () => {
        document.getElementById("mint_currency_button_usdt").classList.add("selected");
        document.getElementById("mint_currency_button_eth").classList.remove("selected");
    }

    const getPreSaleAbleAmount = () => {
        return (limitForPresale - boughtAmount);
    }

    return (
        <>
            <div className="mint_container">
                <div className="mint_dsc">
                    <div className="margin_top"></div>
                    <div className="dsc_title title-64 text-center">Welcome to Rbcc-PreSale</div>
                    <div className="dsc_content title-36 text-center">Rbcc coin plays a crucial role in our project ecosystem. By participating in our Rbcc coin presale, you can secure a portion of Robocopcoin at a discounted price. These tokens will grant you access to various features and benefits within our platform.</div>
                    <div className="margin_bottom"></div>
                </div>
                <div className="mint_pane">
                    <div className="mint_wrapper">
                        <div className="mint_content">
                            <div className="mint_title">
                                <span>Buy Now ...</span>
                                <img src={IconMint} />
                                </div>
                            {/* <div className="mint_state text-center">{remainingTimeResult ? preSaleStateText[preSaleState] : "Loading..."}</div> */}
                            <div className="mint_state text-center">
                                <span>
                                    {
                                        isConnectedWallet() == false ? 
                                            "Please connect wallet." 
                                            : 
                                            "Expected Tokens : " + getPreSaleAbleAmount()
                                    }
                                </span>
                            </div>
                            {
                                isConnectedWallet() == false ?
                                    ""
                                    :
                                    <CountDown end={counterDeadline} />
                            }
                            {
                                isConnectedWallet() == false ?
                                    ""
                                    :
                                    <div className="mint_currency_select">
                                        <button 
                                            id="mint_currency_button_eth"
                                            className="currency_type"
                                            onClick={onClickCurrencyETH}
                                        >
                                            <img src={IconEther} />
                                            <span>ETH</span>
                                        </button>
                                        <button 
                                            id="mint_currency_button_usdt"
                                            className="mint_currency_button currency_type"
                                            onClick={onClickCurrencyUSDT}
                                        >
                                            <img src={IconUSDT} />
                                            <span>USDT</span>
                                        </button>
                                    </div>
                            }
                            {
                                isConnectedWallet() == false ?
                                    ""
                                    :
                                    <div className="mint_currency_panel">
                                        <div className="mint_currency_pay">
                                            <span>
                                                USDT you pay
                                            </span>
                                            <input type="text">
                                            </input>
                                        </div>
                                        <div className="mint_currency_receive">
                                            <span className="title">
                                                Rbcc you receive
                                            </span>
                                            <div className="content">
                                                <span>10</span>
                                                <img src={IconRbcc} />
                                            </div>
                                        </div>
                                    </div>
                            }
                            {
                                isConnectedWallet() == false ?
                                    ""
                                    :
                                    <div className="mint_currency_action">
                                        <button 
                                            // onClick={onClickCurrencyUSDT}
                                        >
                                            <span>Buy</span>
                                        </button>
                                        <button 
                                            // onClick={onClickCurrencyUSDT}
                                        >
                                            <span>Claim</span>
                                        </button>
                                    </div>
                                }


                            {/* {preSaleState === PreSaleStateVal.Open && <div className="md:!mt-[50px] !mt-[30px]">
                                <section className="">
                                    <div className="border border-[#fff] rounded-[28px] text-[16px] md:text-[18px] p-[20px]">
                                        <div className="flex items-center justify-between">
                                            <div >Amount</div>
                                            <div className="flex items-center justify-center gap-3">
                                                <div >Balance: {currencyState === 1 ? usdtBalance : ethereumBalance}</div>
                                                <div className="font-bold text-[#d49c44] cursor-pointer" onClick={() => setInputMax()}>MAX</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between ">
                                            <input
                                                type="number"
                                                inputMode="decimal"
                                                placeholder="0.00"
                                                className="h-full w-full mt-[25px] md:mt-[20px] text-[30px] md:text-[26px] pr-[20px] bg-transparent"
                                                // ref={refAmount}
                                                value={saleCryptoAmount}
                                                onChange={changeValue}
                                                disabled={preSaleState != PreSaleStateVal.Open}
                                            />
                                            <div className="flex items-center justify-center gap-3 mt-[30px] relative">
                                                <div className="font-bold cursor-pointer" onClick={changeDropState}>{currencies[currencyState]}</div>
                                                {drop &&
                                                    <div className="flex flex-col right-[-1px] absolute top-[105%] w-[auto] z-5 block h-[auto] bg-[#212121] mt-2 border-[1px] rounded-b-xl overflow-hidden">
                                                        {currencies.map((currency, idx) => {
                                                            return (
                                                                <div className="flex cursor-pointer justify-end p-3 hover:bg-[#111111bb]" onClick={() => setCurrency(idx)} key={idx} >{currency}</div>
                                                            )
                                                        })}
                                                    </div>
                                                }
                                            </div>
                                        </div>
                                    </div>
                                </section>
                                {saleCryptoAmount !== 0 && !isNaN(saleCryptoAmount) && (
                                    <div className="flex items-center justify-center">
                                        <span className="mt-5">
                                            You will be able to claim {buyRbccAmount} Robocopcoin
                                        </span>
                                    </div>
                                )}
                            </div>}
                            <section className="flex flex-col items-center justify-center w-full top-padding">
                                {preSaleState === PreSaleStateVal.End && <div>
                                    <div className="pb-5">You can claim {getFormattedDisplayNumber(claimAmount)} Rbcd Token</div>
                                </div>}
                                <button
                                    className="!h-auto w-full max-w-[140px] primary-btn text-center !text-[18px] !py-[15px]"
                                    disabled={preSaleState == PreSaleStateVal.NotOpened || pendingTx}
                                    onClick={handleAction}
                                >
                                    {pendingTx && <div className="presale-loader"></div>}
                                    {preSaleActionText[preSaleState]}
                                </button>
                            </section> */}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Presale;
