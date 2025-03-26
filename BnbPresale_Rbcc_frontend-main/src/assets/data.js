import IconStable from "../assets/icons/icon-stable.png";
import IconBearing from "../assets/icons/icon-bearing.png";
import IconMint from "../assets/icons/icon-mint.png";
import IconBoost from "../assets/icons/icon-boost.png";
import IconRatio from "../assets/icons/icon-ratio.png";
import IconCensor from "../assets/icons/icon-censorship.png";

import TokencaUSD from "../assets/icons/token-caUSD.png";
import TokenCAL from "../assets/icons/token-CAL.png";
import TokenETH from "../assets/icons/token-ETH.png"
import TokenwstETH from "../assets/icons/token-wstETH.png"
import LpCAL_ETH from "../assets/icons/lp-CAL_ETH.png";
import LpcaUSD_USDC from "../assets/icons/lp-caUSD_USDC.png";
import TokenVeCAL from "../assets/icons/token-ankrETH.png"

export const ethLogo = TokenETH
export const stEthLogo = TokenwstETH
export const caUsdLogo = TokencaUSD
export const calLogo = TokenCAL
export const calEthLpLogo = LpCAL_ETH
export const causdUsdtLpLogo = LpcaUSD_USDC
export const veCalLogo = TokenVeCAL

export const HOME_ITEMS = [
  {
    image: IconStable,
    title: "Stable & Safe",
    content: "caUSD stability is maintained through a combination of overcollateralization, liquidation mechanisms, and arbitrage opportunities. These factors work together to ensure that the value of caUSD remains close to its 1 USD peg.",
  },
  {
    image: IconBearing,
    title: "Interest Bearing",
    content: "Holders of caUSD can expect to earn a base annual percentage yield (APY) of approximately 7.2%. This stable yield is attractive for investors seeking a steady income stream while maintaining exposure to the cryptocurrency market. Moreover, as the price of ETH increases, the yield generated by caUSD holders may also rise.",
  },
  {
    image: IconMint,
    title: "0 Mint/Loan Cost",
    content: "Caelum Finance stands out from other stablecoin protocols by offering 0 minting fee and 0 loan interest for users. This feature allows users to leverage their ETH holdings and mint caUSD stablecoins without incurring any additional costs.",
  },
  {
    image: IconBoost,
    title: "Yield Boost",
    content: "Caelum will integrate with other DeFi aggregators to boost yield in V2 if required by the community DAO.",
  },
  {
    image: IconRatio,
    title: "150% Collateral Ratio",
    content: "Each 1 caUSD is backed by at least $1.5 worth of ETH/stETH as collateral, ensuring stability.",
  },
  {
    image: IconCensor,
    title: "Censorship Resistance",
    content: "caUSD is a censorship-resistant, 100% decentralized, fair and transparent stablecoin built on the Caelum Finance protocol.",
  },
]

export const FAQS = [
  {
    question: "1. How can holders of stablecoins like USDT, USDC, and FRAX earn interest?",
    answer: "It's very simple. All you need to do is exchange your USDT for caUSD on a DEX. As long as you hold caUSD, Caelum will automatically calculate interest for you."
  },
  {
    question: "2. How is caUSD 1:1 hard pegged to 1 USD?",
    answer: "When caUSD price above 1 USD: If the caUSD price exceeds 1 USD, users can mint new caUSD by depositing ETH as collateral and then sell the newly minted caUSD on DEX. As more caUSD is sold, the market supply increases, pushing the price back down to 1 USD. Users can then buy back caUSD at a lower price or use it to repay their loans, realizing a profit from the price difference.<br/>When caUSD price below 1 USD: If the caUSD price falls below 1 USD, users can purchase caUSD at a discounted rate on the market and then redeem it within the Caelum Protocol for $1 worth of ETH/stETH. As users buy up the undervalued caUSD, demand increases, driving the price back up to 1 USD. Users can either hold the redeemed ETH/stETH or sell it, profiting from the price difference."
  },
]

export const BONDS = [
  {
    quoteAsset: "ETH",
    getUrl: null,
    payoutAsset: "CAL",
    discount: "-",
    bondPrice: "-",
    marketPrice: "-",
    purchased: "82.7",
    bondType: 1
  },
  {
    quoteAsset: "stETH",
    getUrl: "https://app.camelot.exchange/?token2=0x5979d7b546e38e414f7e9822514be443a4800529",
    payoutAsset: "CAL",
    discount: "-",
    bondPrice: "-",
    marketPrice: "-",
    purchased: "82.7",
    bondType: 0
  },
]

export const TOOLTIPS = {
  discount: "A positive discount bond rate means you get more tokens for the same amount of capital; ata negative rate, or premium, you get fewer.Bonds will sometimes be priced at a premium when demand is high, but purchasing a bond at a premium is not typically recommended.",
  purchased: "Total Bonded Value is the total amount of payout assets sold to the bonders. It also represents the liquidity accrued by the protocol. A high bonded value implies that the payout asset is actively sought after by the bonders."
}