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

import IconRemit from "../assets/remittix/logo.svg"
import IconMint from "../assets/icons/icon-mint.png"
import IconBoost from "../assets/icons/icon-boost.png"
import IconEther1 from "../assets/remittix/eth.png"
import IconEther from "../assets/remittix/eth-eth.png"
import IconUSDT from "../assets/remittix/usdt-eth.png"
import IconCARD from "../assets/remittix/card.png"

import "react-sweet-progress/lib/style.css";

function Presale() {
    const { address } = useAccount();
    let connectedWalletAddress = address;
    // console.log("connectedWalletAddress = ", connectedWalletAddress);
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
    // console.log("chainId = ", chainId);

    const [checkTime, setCheckTime] = useState(false);

    const [counterDeadline, setCounterDeadline] = useState(0);

    const roundNumberBy1000 = (number) => {
        return parseFloat(parseInt(number * 1000) / 1000);
    }

    const CRYPTO_TYPE = {
        ETH : 0,
        USDT : 1,
        CARD : 2,
    };
    const [saleCryptoType, setSaleCryptoType] = useState(CRYPTO_TYPE.USDT);

    useEffect(() => {
        setDrop(false)
        setSaleCryptoAmount(0);
        setSaleCryptoBalance(0);
        if (saleCryptoType == CRYPTO_TYPE.ETH)
        {
            fetchEthereumBalance();
        }
        else if (saleCryptoType == CRYPTO_TYPE.USDT)
        {            
            fetchUsdtBalance();
        }
        else
        {            
        }
    }, [saleCryptoType])

    const [saleCryptoBalance, setSaleCryptoBalance] = useState(0);
    const [saleCryptoAmount, setSaleCryptoAmount] = useState(0);

    const [drop, setDrop] = useState(false);

    const ETHER_DECIMAL = 1000000000000000000;
    // const ETHER_DECIMAL = 1000000000;
    const USDT_DECIMAL = 1000000;
    const RBCC_DECIMAL = 100000000;
    const USDT_PER_ETHER = 2000;
    const USDT_PER_RBCC = 10;

    const defaultWeb3 = new Web3(window.ethereum)
    const usdtToken = "0xFdf8062Ad4D57F1539D122231A2b189cfc58a955";
    const usdtContract = new defaultWeb3.eth.Contract(USDTAbi, usdtToken);

    const [buyRbccAmount, setBuyRbccAmount] = useState(0);

    useEffect(() => {
        // console.log("saleCryptoAmount = " + saleCryptoAmount);
        let cryptoAmount = saleCryptoAmount;
        if (saleCryptoType == CRYPTO_TYPE.ETH) 
        {
            // ETHER => USDT
            cryptoAmount = cryptoAmount * USDT_PER_ETHER;
            // USDT => RBCC
            cryptoAmount = cryptoAmount / USDT_PER_RBCC;
        }
        else if (saleCryptoType == CRYPTO_TYPE.USDT)
        {
            // USDT => RBCC
            cryptoAmount = cryptoAmount / USDT_PER_RBCC;
        }
        else
        {
        }
        cryptoAmount = roundNumberBy1000(cryptoAmount);
        setBuyRbccAmount(cryptoAmount);
    }, [saleCryptoAmount])

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

    const [remainingTime, setRemainingTime] = useState(0);

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
        if (remainingTimeResult[0].result != undefined) 
            {
            setRemainingTime(getFormattedUnits(remainingTimeResult[0].result));
        } 
        else 
        {
            if (checkTime == true) {
                setRemainingTime(0);
            } else {
                setRemainingTime(60);
            }
        }
    }, [remainingTimeResult])

    useEffect(() => {
        if (isConnectedWallet() == false)
        {
            setCounterDeadline(0)
            // setPreSaleState(PreSaleStateVal.End)
            return;
        }

        if (!remainingTimeResult || remainingTimeResult == undefined) 
        {
            setCounterDeadline(0)
            // setPreSaleState(PreSaleStateVal.End)
            return;
        }

        console.log("remainingTime--", remainingTime)
        const timerId = setInterval(() => {
            if (parseInt(remainingTime) > 0) 
            {
                setCounterDeadline(remainingTime * 1000)
                // setPreSaleState(PreSaleStateVal.Open)
            }
            else 
            {
                if (checkTime == true) {
                    setCounterDeadline(0)
                } else {
                    setCounterDeadline(3600 * 1000)
                }
                // setPreSaleState(PreSaleStateVal.End)
            }
        }, 1000);
        return () => {
            clearInterval(timerId);
        }
    }, [remainingTime])

    const [myBoughtAmount, setMyBoughtAmount] = useState(0);

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
            setMyBoughtAmount(0);
            return;
        }

        if (!addressBoughtResult || addressBoughtResult == undefined)
        {
            setMyBoughtAmount(0);
            return;
        }

        console.log("addressBoughtResult - ", addressBoughtResult)
        if (addressBoughtResult[0].result !== undefined) 
        {
            const rbccValue = BigNumber(addressBoughtResult[0].result).dividedBy(RBCC_DECIMAL).toNumber();
            setMyBoughtAmount(rbccValue);
        } 
        else 
        {
            setMyBoughtAmount(0);
        }
    }, [addressBoughtResult]);

    const [totalBoughtAmount, setTotalBoughtAmount] = useState(0);

    const { data: totalBoughtResult } = useContractReads({
        contracts: [
            {
                ...getPresaleContract(chainId),
                functionName: "getTotalSold",
                args: [],
            },
        ]
    })

    useEffect(() => {
        if (isConnectedWallet() == false)
        {
            setTotalBoughtAmount(0);
            return;
        }

        if (!totalBoughtResult || totalBoughtResult == undefined)
        {
            setTotalBoughtAmount(0);
            return;
        }

        console.log("totalBoughtResult - ", totalBoughtResult)
        if (totalBoughtResult[0].result !== undefined) 
        {
            const rbccValue = BigNumber(totalBoughtResult[0].result).dividedBy(RBCC_DECIMAL).toNumber();
            setTotalBoughtAmount(rbccValue);
        } 
        else 
        {
            setTotalBoughtAmount(0);
        }
    }, [totalBoughtResult]);

    const [maxRbccPerWallet, setMaxRbccPerWallet] = useState(0);

    const { data: maxRbccPerWalletResult } = useContractReads({
        contracts: [
            {
                ...getPresaleContract(chainId),
                functionName: "getMaxRbccPerWallet",
                args: [],
            },
        ]
    })

    useEffect(() => {
        if (isConnectedWallet() == false)
        {
            setMaxRbccPerWallet(0);
            return;
        }

        if (!maxRbccPerWalletResult || maxRbccPerWalletResult == undefined)
        {
            setMaxRbccPerWallet(0);
            return;
        }

        console.log("maxRbccPerWalletResult - ", maxRbccPerWalletResult)
        if (maxRbccPerWalletResult[0].result !== undefined) 
        {
            const rbccValue = BigNumber(maxRbccPerWalletResult[0].result).toNumber();
            setMaxRbccPerWallet(rbccValue);
        } 
        else 
        {
            setMaxRbccPerWallet(0);
        }
    }, [maxRbccPerWalletResult]);

    const [minRbccPerWallet, setMinRbccPerWallet] = useState(0);

    const { data: minRbccPerWalletResult } = useContractReads({
        contracts: [
            {
                ...getPresaleContract(chainId),
                functionName: "getMinRbccPerWallet",
                args: [],
            },
        ]
    })

    useEffect(() => {
        if (isConnectedWallet() == false)
        {
            setMinRbccPerWallet(0);
            return;
        }

        if (!minRbccPerWalletResult || minRbccPerWalletResult == undefined)
        {
            setMinRbccPerWallet(0);
            return;
        }

        console.log("minRbccPerWalletResult - ", minRbccPerWalletResult)
        if (minRbccPerWalletResult[0].result !== undefined) 
        {
            const rbccValue = BigNumber(minRbccPerWalletResult[0].result).toNumber();
            setMinRbccPerWallet(rbccValue);
        } 
        else 
        {
            setMinRbccPerWallet(0);
        }
    }, [minRbccPerWalletResult]);

    const { writeAsync: buyWithEther } = useContractWrite({
        ...getPresaleContract(chainId),
        functionName: "buyWithEther",
        onSuccess: (data) => {
            toast.success("Transaction Submitted!")
            // setTxHash(data.hash)
            setSaleCryptoAmount(0);
            setSaleCryptoBalance(0);
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
            setSaleCryptoAmount(0);
            setSaleCryptoBalance(0);
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
            setSaleCryptoAmount(0);
            setSaleCryptoBalance(0);
        },
        onError: (data) => {
            toast.error(getErrorMessage(data))
            // setTxHash(null)
            setPendingTx(false)
        }
    })

    const fetchUsdtBalance = async () => {
        if (isConnectedWallet() == false) 
        {
            setSaleCryptoAmount(0);
            setSaleCryptoBalance(0);
            return;
        }

        try {
            let balance = await usdtContract.methods.balanceOf(connectedWalletAddress).call();
            balance = BigNumber(balance).dividedBy(BigNumber(USDT_DECIMAL)).toNumber();
            balance = roundNumberBy1000(balance);
            console.log("fetchUsdtBalance = " + balance);
            setSaleCryptoAmount(balance);
            setSaleCryptoBalance(balance);
        } catch (error) {
            console.error("Error fetching USDT balance:", error);
            setSaleCryptoAmount(0);
            setSaleCryptoBalance(0);
        }
    };

    const fetchEthereumBalance = async () => {
        if (isConnectedWallet() == false) 
        {
            setSaleCryptoAmount(0);
            setSaleCryptoBalance(0);
            return;
        }

        try {
            // const web3 = new Web3(new Web3.providers.HttpProvider('https://ethereum-holesky-rpc.publicnode.com'));
            const web3 = new Web3(new Web3('https://ethereum-holesky-rpc.publicnode.com'));
            // const web3 = new Web3(window.ethereum)

            let balance = await web3.eth.getBalance(connectedWalletAddress);
            balance = BigNumber(balance).dividedBy(BigNumber(ETHER_DECIMAL)).toNumber();
            balance = roundNumberBy1000(balance);
            console.log("fetchEthereumBalance = " + balance);
            setSaleCryptoAmount(balance);
            setSaleCryptoBalance(balance);
        } catch (error) {
            console.error("Error fetching Ethereum balance:", error);
            setSaleCryptoAmount(0);
            setSaleCryptoBalance(0);
        }
    };

    const changeDropState = () => {
        setDrop(!drop);
    }

    const onChangeSaleCryptoAmount = (event) => {
        let amount = parseFloat(event.target.value);
        if (isNaN(amount) == true) {
            amount = 0;
        }
        if (amount < 0) {
            amount = 0;
        }
        if (amount > saleCryptoBalance) {
            amount = saleCryptoBalance;
        }
        amount = roundNumberBy1000(amount);
        setSaleCryptoAmount(amount);
    }

    const onClickCurrencyETH = () => {
        document.getElementById("mint_currency_button_eth").classList.add("selected");
        document.getElementById("mint_currency_button_usdt").classList.remove("selected");
        document.getElementById("mint_currency_button_card").classList.remove("selected");
        setSaleCryptoType(CRYPTO_TYPE.ETH);
    }

    const onClickCurrencyUSDT = () => {
        document.getElementById("mint_currency_button_usdt").classList.add("selected");
        document.getElementById("mint_currency_button_eth").classList.remove("selected");
        document.getElementById("mint_currency_button_card").classList.remove("selected");
        setSaleCryptoType(CRYPTO_TYPE.USDT);
    }

    const onClickCurrencyCARD = () => {
        document.getElementById("mint_currency_button_card").classList.add("selected");
        document.getElementById("mint_currency_button_eth").classList.remove("selected");
        document.getElementById("mint_currency_button_usdt").classList.remove("selected");
        setSaleCryptoType(CRYPTO_TYPE.CARD);
    }

    const getPreSaleAbleAmount = () => {
        return (limitForPresale - totalBoughtAmount);
    }

    const getMyTokensInfo = () => {
        return myBoughtAmount + "(" + minRbccPerWallet + "~" + maxRbccPerWallet + ")";
    }

    const getPayMethodInfo = () => {
        if (saleCryptoType == CRYPTO_TYPE.ETH) return "ETH you pay";
        else if (saleCryptoType == CRYPTO_TYPE.USDT) return "USDT you pay";
        return "CARD you pay";
    }

    const onClickBuy = async () => {
        if (isConnectedWallet() == false) return;
        if (counterDeadline <= 0) {
            return;
        }

        setPendingTx(true);

        let presaleContractAddress = PresaleContract.address[chainId];
        if (saleCryptoType == CRYPTO_TYPE.ETH) {
            const weiValue = BigNumber(saleCryptoAmount).multipliedBy(ETHER_DECIMAL).toNumber();

            try {

                /*
                // const web3 = new Web3(new Web3.providers.HttpProvider('https://ethereum-holesky-rpc.publicnode.com'));
                const web3 = new Web3(new Web3('https://ethereum-holesky-rpc.publicnode.com'));
                // const web3 = new Web3(window.ethereum)

                // ---------------- old method ----------------
                // web3.eth.methods.transfer(presaleContractAddress, weiValue).send({
                //     from: connectedWalletAddress
                // });

                /% ---------------------------  Send to ETH Holesky ---------------------------------- %/
                // ---------------- new method ----------------
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
                */

                /% ---------------------------  Send to PreSale Contract ---------------------------------- %/
                buyWithEther({
                	args: [checkTime],
                	from: connectedWalletAddress,
                	value: weiValue,
                });

            } catch (err) {
                console.log(`error with ${err}`);
            }
        }
        else if (saleCryptoType == CRYPTO_TYPE.USDT)
        {
            try {
                const weiValue = BigNumber(saleCryptoAmount).multipliedBy(USDT_DECIMAL).toNumber();

                /*
                /% ---------------------------  Send to ETH Holesky ---------------------------------- %/
                await usdtContract.methods.transfer(presaleContractAddress, weiValue).send({
                    from: connectedWalletAddress
                });
                */

                /% ---------------------------  Send to PreSale Contract ---------------------------------- %/
                buyTokensWithUSDT({
                	args: [checkTime],
                    from: connectedWalletAddress,
                    value: weiValue,
                });
            } catch (err) {
                console.log(`error with ${err}`);
            }
        }
        else
        {

        }

        setPendingTx(false);
    }

    const onClickClaim = async () => {
        if (isConnectedWallet() == false) return;
        if (counterDeadline > 0) {
            return;
        }

        setPendingTx(true);

        try {
            claimRbcc({
                args: [checkTime],
                from: connectedWalletAddress,
            });
        } catch (err) {
            console.log(`error with ${err}`);
        }

        setPendingTx(false);
    }

    return (
        <>
            <div className="mint_container">
                <div className="mint_dsc">
                    <div className="dsc_title">Cross-border</div>
                    <div className="dsc_title">Payments</div>
                    <div className="dsc_title_v1">Reinvented</div>
                    <div className="dsc_content">
                        Remittix enables users to pay fiat into any bank account around the world using crypto, by just simply connecting your wallet.
                    </div>
                    <div className="dsc_content_v1">
                        Welcome to the PayFi revolution!
                    </div>
                    <div class="dsc_link_list">
                        <div className="link_item">
                            <a className="" target="_blank" href="https://x.com/remittix">
                                <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><g clip-path="url(#clip0_1546_4323)"><path d="M25.3763 1.54688H30.3171L19.5226 13.8853L32.2222 30.6717H22.279L14.4919 20.4895L5.57981 30.6717H0.636389L12.1827 17.4741L0 1.54822H10.1956L17.2349 10.8551L25.3763 1.54688ZM23.6431 27.7153H26.3806L8.70806 4.34887H5.77046L23.6431 27.7153Z" fill="currentColor"></path></g><defs><clipPath id="clip0_1546_4323"><rect width="32.2222" height="32.2222" fill="white"></rect></clipPath></defs></svg>                        
                            </a>
                        </div>
                        <div className="link_item">
                            <a className="" target="_blank" href="https://t.me/remittix_Portal">
                                <svg width="33" height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M27.7621 4.99584L3.95792 14.1751C2.33338 14.8277 2.34278 15.7339 3.65987 16.138L9.77135 18.0445L23.9115 9.12297C24.5801 8.71617 25.191 8.93501 24.6889 9.38075L13.2326 19.7201H13.2299L13.2326 19.7214L12.811 26.0208C13.4286 26.0208 13.7011 25.7376 14.0475 25.4033L17.016 22.5167L23.1906 27.0775C24.3291 27.7045 25.1467 27.3822 25.43 26.0235L29.4833 6.92112C29.8982 5.25765 28.8482 4.50446 27.7621 4.99584Z" fill="currentColor"></path></svg>                        
                            </a>
                        </div>
                        <div className="link_item">
                            <a className="" target="_blank" href="https://medium.com/@remittix">
                                <svg width="41" height="41" viewBox="0 0 41 41" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M23.1262 20.4999C23.1262 26.9299 17.9493 32.1424 11.5631 32.1424C5.17697 32.1424 0 26.9299 0 20.4999C0 14.0699 5.17697 8.85742 11.5631 8.85742C17.9492 8.85742 23.1262 14.0699 23.1262 20.4999Z" fill="currentColor"></path><path d="M35.8112 20.4999C35.8112 26.5526 33.2226 31.4592 30.0296 31.4592C26.8366 31.4592 24.248 26.5526 24.248 20.4999C24.248 14.4472 26.8366 9.54053 30.0296 9.54053C33.2227 9.54053 35.8112 14.4472 35.8112 20.4999Z" fill="currentColor"></path><path d="M40.9999 20.4998C40.9999 25.9227 40.0895 30.3189 38.9664 30.3189C37.8434 30.3189 36.9331 25.9227 36.9331 20.4998C36.9331 15.0768 37.8434 10.6807 38.9664 10.6807C40.0895 10.6807 40.9999 15.0768 40.9999 20.4998Z" fill="currentColor"></path></svg>                        
                            </a>
                        </div>
                        <div className="link_item">
                            <a className="" target="_blank" href="https://linktr.ee/remittix">
                                <svg width="33" height="33" xmlns="http://www.w3.org/2000/svg" shape-rendering="geometricPrecision" text-rendering="geometricPrecision" image-rendering="optimizeQuality" fill-rule="evenodd" clip-rule="evenodd" viewBox="0 0 417 512.238"><path fill="currentColor" fill-rule="nonzero" d="M171.274 344.942h74.09v167.296h-74.09V344.942zM0 173.468h126.068l-89.622-85.44 49.591-50.985 85.439 87.829V0h74.086v124.872L331 37.243l49.552 50.785-89.58 85.24H417v70.502H290.252l90.183 87.629L331 381.192 208.519 258.11 86.037 381.192l-49.591-49.591 90.218-87.631H0v-70.502z"></path></svg>                        
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mint_pane">
                    <div className="mint_wrapper">
                        <div className="mint_content">
                            <div className="mint_title">
                                {
                                    (counterDeadline > 0 || myBoughtAmount > 0) ? 
                                        <span>Buy Now ...</span>
                                        :
                                        <span>Presale Ended ...</span>
                                }
                                {
                                    (counterDeadline > 0 || myBoughtAmount > 0) ? 
                                        <img src={IconMint} />
                                        :
                                        <img src={IconBoost} />
                                }
                            </div>
                            <div className="mint_state text-center">
                                <span>
                                    {
                                        isConnectedWallet() == true ? 
                                            "Pool Tokens : " + getPreSaleAbleAmount()
                                            : 
                                            "Please connect wallet." 
                                        }
                                </span>
                            </div>
                            {
                                isConnectedWallet() == true ?
                                    <div className="mint_state text-center">
                                        <span>
                                            My Tokens : {getMyTokensInfo()}
                                        </span>
                                    </div>
                                    :
                                    ""
                            }
                            {
                                (isConnectedWallet() == true && counterDeadline > 0) ?
                                    <CountDown end={counterDeadline} />
                                    :
                                    ""
                                }
                            {
                                isConnectedWallet() == true ?
                                    <div className="mint_currency_select">
                                        <button 
                                            id="mint_currency_button_eth"
                                            className={saleCryptoType == CRYPTO_TYPE.ETH ? "currency_type selected" : "currency_type"}
                                            onClick={onClickCurrencyETH}
                                        >
                                            <img src={IconEther} />
                                            <span>ETH</span>
                                        </button>
                                        <button 
                                            id="mint_currency_button_usdt"
                                            className={saleCryptoType == CRYPTO_TYPE.USDT ? "currency_type selected" : "currency_type"}
                                            onClick={onClickCurrencyUSDT}
                                        >
                                            <img src={IconUSDT} />
                                            <span>USDT</span>
                                        </button>
                                        <button 
                                            id="mint_currency_button_card"
                                            className={saleCryptoType == CRYPTO_TYPE.CARD ? "currency_type selected" : "currency_type"}
                                            onClick={onClickCurrencyCARD}
                                        >
                                            <img src={IconCARD} />
                                            <span>CARD</span>
                                        </button>
                                    </div>
                                    :
                                    ""
                            }
                            {
                                isConnectedWallet() == true ?
                                    <div className="mint_currency_panel">
                                        <div className="mint_currency_pay">
                                            <span>
                                                {getPayMethodInfo()}
                                            </span>
                                            <input 
                                                type="number"
                                                inputMode="decimal"
                                                placeholder="0.00"
                                                value={saleCryptoAmount}
                                                onChange={onChangeSaleCryptoAmount}
                                            >
                                            </input>
                                            <div id="mint_currency_pay_icon">
                                                <img src={IconEther1} />
                                            </div>
                                        </div>
                                        <div className="mint_currency_receive">
                                            <span className="title">
                                                Rbcc you receive
                                            </span>
                                            <div className="content">
                                                <span>{buyRbccAmount}</span>
                                                <img src={IconRemit} />
                                            </div>
                                            <img id="mint_currency_receive_icon" src={IconEther1} />
                                        </div>
                                    </div>
                                    :
                                    ""
                            }
                            {
                                (isConnectedWallet() == true && (counterDeadline > 0 || myBoughtAmount > 0)) ?
                                    <div className="mint_currency_action">
                                        {
                                            counterDeadline > 0 ? 
                                                <button 
                                                    onClick={onClickBuy}
                                                >
                                                    <span>Buy</span>
                                                </button>
                                                :
                                                ""
                                        }
                                        {
                                            (counterDeadline <= 0 && myBoughtAmount > 0) ? 
                                                <button 
                                                    onClick={onClickClaim}
                                                >
                                                    <span>Claim</span>
                                                </button>
                                                :
                                                ""
                                        }
                                    </div>
                                    :
                                    ""
                                }
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Presale;
