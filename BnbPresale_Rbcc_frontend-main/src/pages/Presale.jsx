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

import "react-sweet-progress/lib/style.css";

function Presale() 
{
    const { address } = useAccount();
    console.log("address = ", address);

    const chainId = useChainId()
    console.log("chainId = ", chainId);

    // const { data: accountBalance } = useBalance({ address, watch: true })
    // const [startTime, setStartTime] = useState(0);
    // const [endTime, setEndTime] = useState(0);
    const [softCap, setSoftCap] = useState(0);
    const [hardCap, setHardCap] = useState(0);
    const [minAmount, setMinAmount] = useState(0)
    const [maxAmount, setMaxAmount] = useState(0)
    const [presaleRate, setPresaleRate] = useState(0)
    const [listingRate, setListingRate] = useState(0)
    const [totalDepositedEthAmount, setTotalDepositedEthAmount] = useState(0);
    const [totalSellingTokenAmount, setTotalSellingTokenAmount] = useState(0);
    const [userDepositEthAmount, setUserDepositEthAmount] = useState(0);
    const [counterDeadline, setCounterDeadline] = useState(0);
    const [totalSupply, setTotalSupply] = useState(0)
    const refAmount = useRef(null)
    const token_price = 0.0004

    const ethereumConstant = "Ethereum";
    const usdtConstant = "USDT";
    const currencies = ["Ethereum", "USDT"];
    // const currencies = ["Ethereum"];
    const [currencyState, setCurrencyState] = useState(0)
    
    const [remainingTime, setRemainingTime] = useState(0);
    const [claimAmount, setClaimAmount] = useState(0);
    const [drop, setDrop] = useState(false);
    const [usdtBalance, setUsdtBalance] = useState(0);
    const [ethereumBalance, setEthereumBalance] = useState(0); // New state for Ethereum balance
    
    const ETHER_DECIMAL = 1000000000000000000;
    const USDT_DECIMAL = 1000000;
    const RBCC_DECIMAL = 100000000;
	const USDT_PER_ETHER = 2000;
	const USDT_PER_RBCC = 10;

    const web3 = new Web3(window.ethereum)

    const usdtToken = "0xFdf8062Ad4D57F1539D122231A2b189cfc58a955";
    const usdtContract = new web3.eth.Contract(USDTAbi, usdtToken);
    
    const [saleCryptoAmount, setSaleCryptoAmount] = useState(0);
    const [buyRbccAmount, setBuyRbccAmount] = useState(0);

    useEffect(() => {
		let cryptoAmount = saleCryptoAmount;
		if (currencies[currencyState] == ethereumConstant) 
		{
			// ETHER => USDT
			cryptoAmount = cryptoAmount * USDT_PER_ETHER;
			// USDT => RBCC
			cryptoAmount = cryptoAmount / USDT_PER_RBCC;
		}
		else
		{
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

    const { data: remainingTimeResult/*, refetch: refetchContracts*/ } = useContractReads({
        contracts: [
            {
                ...getPresaleContract(chainId),
                functionName: "getRemainingTime",
                args: [],
            },
        ]
    })

	const { data: boughtResult } = useContractReads({
		contracts: [
			{
				...getPresaleContract(chainId),
				functionName: "getAddressBought",
				args: address != undefined ? [address] : [],
			},
		]
	})

    useEffect(() => {
        if (!remainingTimeResult) return

        console.log("remainingTimeResult - ", remainingTimeResult)
        if (remainingTimeResult[0].result != undefined) {
            setRemainingTime(getFormattedUnits(remainingTimeResult[0].result));
        } else {
            setRemainingTime(0);
        }
    }, [remainingTimeResult])

    useEffect(() => {
        if (remainingTimeResult) 
        {
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
        }
    }, [remainingTime/*, startTime, endTime*/])

    useEffect(() => {
        if (!boughtResult) return

        console.log("boughtResult - ", boughtResult)
        if (boughtResult !== undefined) {
            setClaimAmount(boughtResult[0].result);
        } else {
            setClaimAmount(0);
		}
    }, [boughtResult]);

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
		if (address == undefined) return;
        try {
            let balance = await usdtContract.methods.balanceOf(address).call();
			console.log("balance = " + balance);
			balance = Number(balance) / Number(USDT_DECIMAL);
			console.log("balance = " + balance);
            setUsdtBalance(balance);
        } catch (error) {
            console.error("Error fetching USDT balance:", error);
            setUsdtBalance(0);
        }
    };

    const fetchEthereumBalance = async () => { // New function to fetch Ethereum balance
		if (address == undefined) return;
        try {
            let balance = await web3.eth.getBalance(address);
			console.log("balance = " + balance);
			balance = Number(balance) / Number(ETHER_DECIMAL);
			console.log("balance = " + balance);
            setEthereumBalance(balance);
        } catch (error) {
            console.error("Error fetching Ethereum balance:", error);
            setEthereumBalance(0);
        }
    };

    useEffect(() => {
        if (address) {
            fetchEthereumBalance(); // Fetch Ethereum balance when address is available
        }
    }, [address]);

    const changeDropState = () => {
        setDrop(!drop);
    }

    const setCurrency = async (idx) => {
        setCurrencyState(idx);
        setDrop(false)
        if (currencies[idx] === usdtConstant) 
        {
            await fetchUsdtBalance();
            setSaleCryptoAmount(usdtBalance)
        }
        if (currencies[idx] === ethereumConstant) 
        {
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
		if (address == undefined) return;
        if (preSaleState == PreSaleStateVal.Open) 
        {
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
            if (currencies[currencyState] == ethereumConstant) 
            {
                const weiValue = BigNumber(saleCryptoAmount).multipliedBy(ETHER_DECIMAL);
                web3.eth.methods.transfer(presaleContractAddress, weiValue);                
                buyWithEther({
                    args: [],
                    from: address,
                    value: weiValue
                });
            }
            else 
            {
                const weiValue = BigNumber(saleCryptoAmount).multipliedBy(USDT_DECIMAL);
                await usdtContract.methods.transfer(presaleContractAddress, weiValue);
                buyTokensWithUSDT({
                    args: [],
                    from: address,
                    value: weiValue
                });
            }

            setPendingTx(false);
        } 
        else if (preSaleState == PreSaleStateVal.End) 
        {
            setPendingTx(true);

			if (boughtResult[0].result > 0) 
            {
                claimRbcc({
                    args: [],
                    from: address,
                });

				setClaimAmount(0);
            }

			setPendingTx(false);
        } 
        else if (preSaleState == PreSaleStateVal.Fail) 
        {
			/*
			setPendingTx(true);

			Refund({
				args: [],
				from: address
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

		if (currencies[currencyState] == ethereumConstant) 
        {
			if (parseFloat(val) > ethereumBalance) {
				toast.error("Balance is " + ethereumBalance);
				return;
			}
        } 
        else 
        {
            if (parseFloat(val) > usdtBalance) {
                toast.error("Balance is " + usdtBalance);
                return;
            }
        }

		setSaleCryptoAmount(parseFloat(val));
    }

    return (
      <>
        <div className="flex flex-col items-center mint__container">
          <section className="flex flex-col gap-5 mx-auto top-padding">
			<div className="text-center title-64 caelum-text1">Welcome to Robocopcoin Presale</div>
			<div className="title-20 text-center text-[#add8e6]">Robocopcoin plays a crucial role in our project ecosystem. By participating in our Robocopcoin presale, you can secure a portion of Robocopcoin at a discounted price. These tokens will grant you access to various features and benefits within our platform.</div>
          </section>
          <section className="w-full top-padding md:flex items-center justify-center gap-[1vw] md:gap-[10vw] md:!mt-[60px] !mt-[60px] flex flex-wrap">
            <div className="caelum-paper py-[20px] px-[50px] mb-[30px] !border-[#fff] w-[530px]">
              <div className="flex items-center justify-between w-full mb-3">
                <div className="text-center title-20 caelum-text1">Presale Rate</div>
                <div className="title-20"> 0.0004 USDT / Rbcc</div>
              </div>
              <div className="flex items-center justify-between w-full mb-3">
                <div className="text-center title-20 caelum-text1">Listing Rate</div>
                <div className="title-20"> 0.0008 USDT / Rbcc</div>
              </div>
              <div className="flex items-center justify-between w-full mb-3">
                <div className="text-center title-20 caelum-text1">Min Contribution</div>
                <div className="title-20">50 USDT</div>
              </div>
              <div className="flex items-center justify-between w-full mb-3">
                <div className="text-center title-20 caelum-text1">Max Contribution</div>
                <div className="title-20">10000 USDT</div>
              </div>
              <div className="flex items-center justify-between w-full mb-3">
                <div className="text-center title-20 caelum-text1">Initial Supply</div>
                <div className="title-20">3,000,000,000 Rbcc</div>
              </div>
              <div className="flex items-center justify-between w-full mb-3">
                <div className="text-center title-20 caelum-text1">Tokens For Presale</div>
                <div className="title-20">1,000,000,000 Rbcc</div>
              </div>
            </div>
          </section>
          <section className="w-full top-padding md:flex items-center justify-center gap-[1vw] md:gap-[10vw] md:!mt-[60px] !mt-[60px] flex flex-wrap">
            <div className="caelum-paper py-[20px] px-[50px] mb-[30px] !border-[#fff] w-[530px]">
              <section className="w-full">
                <div className="mb-8 text-center title-36">{remainingTimeResult ? preSaleStateText[preSaleState] : "Loading..."}</div>
                <CountDown end={counterDeadline} />
              </section>
              {preSaleState === PreSaleStateVal.Open && <div className="md:!mt-[50px] !mt-[30px]">
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
              </section>
            </div>
          </section>
        </div>
      </>
    );
}

export default Presale;
