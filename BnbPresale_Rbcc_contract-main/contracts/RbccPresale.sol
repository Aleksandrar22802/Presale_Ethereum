// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RbccPresale {
    // this type or function is not used in this file
    using SafeERC20 for IERC20;

    IERC20 private _rbccToken; // Holesky Mint Token
    IERC20 private _usdtToken; // Rbcc Stable Token

    mapping(address => uint256) private _walletsInvestmentEther;
    mapping(address => uint256) private _walletsInvestmentUsdt;
    mapping(address => uint256) private _walletsRbccAmount;

    // owner
    address private _owner;

    // Claim Time Range
    uint256 private _startTime;
    uint256 private _endTime;

    // Ether vs USDT(Ethereum vs HoleskyStable(ex:HoleskyBNB))
    uint256 private _etherPrice;

    uint256 private _price; // usdt per token
    uint256 private _TotalValue; // max amount of price
    uint256 private _MaxPerWallet;
    uint256 private _MinPerWallet;
    uint256 private _TotalBNB; // total amount of BNB
    uint256 private _TotalUSDT; // total amount of USDT
    uint256 private _TotalSold; // total amount of sold

    uint256 public _TotalClaimed; // Total RBCC amount of claimed by users

    uint256 private constant TOKEN_DECIMAL = 1e18;
    uint256 private constant USDT_DECIMAL = 1e6;

    event SoldRbcc(
        uint256 bnbAmount,
        uint256 usdtAmount,
        uint256 price,
        uint256 rbccAmount
    );
    event StateChange();

    /**
     * @dev Constructing the contract basic informations, containing the RBCC token addr, the ratio price eth:elo
     * and the max authorized eth amount per wallet
     */
     /*
     stableToken : Holesky BNB(Stable Coin)
     mintToken : Holesky Rbcc(Mint Coin)
     */
    constructor(address stableToken, address mintToken) {
        // check deploying wallet address is being null
        require(msg.sender != address(0), "Deploy from the zero address");
        
        // Create Token Variables
        _usdtToken = IERC20(stableToken);
        _rbccToken = IERC20(mintToken);
        
        // Set owner
        // owner must be address of deploying wallet
        _owner = msg.sender;

        // Init Claim Time Range
        _startTime = 1742958000; // 2025.3.26:12.0.0
        _endTime = 1743044400; // 2025.3.27:12.0.0

        // set Ether price
        _etherPrice = 600 * USDT_DECIMAL; // 1bnb = 600$

        _price = 400; // 0.0004 * USDT_DECIMAL = 0.0004 $
        _TotalValue = (10 ** 9) * TOKEN_DECIMAL; // 1,000,000,000 Rbcc
        _MaxPerWallet = 10000 * USDT_DECIMAL; // 10000 $
        _MinPerWallet = 50 * USDT_DECIMAL; // 50 $
        _TotalSold = 0;
        _TotalClaimed = 0;
        _TotalBNB = 0;
        _TotalUSDT = 0;
    }

    /**
     * @dev Check that the transaction sender is the RBCC owner
     */
    modifier onlyOwner() {
        require(msg.sender == _owner, "Only the owner can do this action");
        _;
    }

    // This function is able called by Deploying Wallet
    function setTime(uint256 startTime, uint256 endTime) external onlyOwner {
        _startTime = startTime;
        _endTime = endTime;
    }

    // This function is able called by Deploying Wallet
    function setEtherPrice(uint256 price) external onlyOwner {
        _etherPrice = price * USDT_DECIMAL;
    }

    /**
     * @dev Receive bnb payment for the presale raise
     */
    function buyWithEther() external payable {
        // Check buy time in Claim Time Range
        require(
            block.timestamp >= _startTime && block.timestamp <= _endTime,
            "RbccPresale: Not presale period"
        );

        require(msg.value > 0, "Insufficient Ether amount");

        uint256 bnbAmount = msg.value;

        uint256 currentInvestment = (_walletsInvestmentEther[msg.sender] *
            _etherPrice) /
            TOKEN_DECIMAL +
            _walletsInvestmentUsdt[msg.sender];

        uint256 calcInvestment = currentInvestment +
            (bnbAmount * _etherPrice) /
            TOKEN_DECIMAL;
        require(
            calcInvestment >= _MinPerWallet && calcInvestment <= _MaxPerWallet,
            "RbccPresale: The price is not allowed for presale."
        );
        uint256 tokenAmount = (bnbAmount * _etherPrice) /
            (_price * TOKEN_DECIMAL);
        _allocateRbcc(bnbAmount, 0, tokenAmount);
    }

    /**
     * @dev Receive usdt payment for the presale raise
     */
    function buyTokensWithUSDT(uint256 _usdtAmount) external {
        // Check buy time in Claim Time Range
        require(
            block.timestamp >= _startTime && block.timestamp <= _endTime,
            "RbccPresale: Not presale period"
        );

        require(_usdtAmount > 0, "Insufficient USDT amount");

        uint256 currentInvestment = (_walletsInvestmentEther[msg.sender] *
            _etherPrice) /
            TOKEN_DECIMAL +
            _walletsInvestmentUsdt[msg.sender];

        uint256 calcInvestment = currentInvestment + _usdtAmount;

        require(
            calcInvestment >= _MinPerWallet && calcInvestment <= _MaxPerWallet,
            "RbccPresale: The price is not allowed for presale."
        );

        uint256 tokenAmount = _usdtAmount / _price;
        _usdtToken.safeTransferFrom(msg.sender, address(this), _usdtAmount);

        _allocateRbcc(0, _usdtAmount, tokenAmount);
    }

    /**
     * @dev Claim the RBCC once the presale is done
     */
    function claimRbcc() public {
        // Check buy time in Claim Time Range
        require(block.timestamp > _endTime, "Presale is not finished.");

        uint256 srcAmount = (_walletsInvestmentEther[msg.sender] * _etherPrice) /
            TOKEN_DECIMAL +
            _walletsInvestmentUsdt[msg.sender];
        require(srcAmount > 0, "You dont have any RBCC to claim");

        uint256 rbccAmount = _walletsRbccAmount[msg.sender];
        require(
            _rbccToken.balanceOf(address(this)) >= rbccAmount,
            "The RBCC amount on the contract is insufficient."
        );

        _rbccToken.transfer(msg.sender, rbccAmount * TOKEN_DECIMAL);

        _TotalClaimed += rbccAmount;
        _walletsInvestmentEther[msg.sender] = 0;
        _walletsInvestmentUsdt[msg.sender] = 0;
        _walletsRbccAmount[msg.sender] = 0;
    }

    function getEtherPrice() public view returns (uint256) {
        return _etherPrice;
    }
    /**
     * @dev Return the rate of Elo/Eth from the Presale in Round
     */
    function getPricePerToken() public view returns (uint256) {
        return _price;
    }

    /**
     * @dev Return the limited amount from the Presale (as usdt) in Round
     */
    function getTotalValue() public view returns (uint256) {
        return _TotalValue;
    }

    /**
     * @dev Return the max buy value per wallet (as usdt) in Round
     */
    function getMaxPerWallet() public view returns (uint256) {
        return _MaxPerWallet;
    }

    /**
     * @dev Return the min buy value per wallet (as usdt) in Round
     */
    function getMinPerWallet() public view returns (uint256) {
        return _MinPerWallet;
    }

    /**
     * @dev Return the amount BNB raised from the Presale (as usdt) in Round
     */
    function getTotalBNB() public view returns (uint256) {
        return _TotalBNB;
    }

    /**
     * @dev Return the amount USDT raised from the Presale (as usdt) in Round
     */
    function getTotalUSDT() public view returns (uint256) {
        return _TotalUSDT;
    }

    /**
     * @dev Return the amount soled from the Presale (as RBCC) in Round
     */
    function getTotalSold() public view returns (uint256) {
        return _TotalSold * TOKEN_DECIMAL;
    }

    /**
     * @dev Return the total amount BNB invested from a specific address
     */
    function getAddressInvestmentBNB(
        address addr
    ) public view returns (uint256) {
        return _walletsInvestmentEther[addr];
    }

    /**
     * @dev Return the total amount USDT invested from a specific address
     */
    function getAddressInvestmentUSDT(
        address addr
    ) public view returns (uint256) {
        return _walletsInvestmentUsdt[addr];
    }

    /**
     * @dev Return the total amount of RBCC bought for a specific address
     */
    function getAddressBought(address addr) public view returns (uint256) {
        return _walletsRbccAmount[addr];
    }

    /**
     * @dev Return the total amount of RBCC bought for a specific address
     */
    function getRemainingTime() public view returns (uint256) {
        // Check buy time in Claim Time Range
        require(block.timestamp > _startTime, "Presale is not started.");
        require(block.timestamp < _endTime, "Presale was alreay finished.");

        return _endTime - block.timestamp;
    }

    /**
     * @dev Allocate the specific RBCC amount to the payer address
     */
    function _allocateRbcc(
        uint256 _bnbAmount,
        uint256 _usdtAmount,
        uint256 rbccAmount
    ) private {
        require(
            _rbccToken.balanceOf(address(this)) >= rbccAmount + _TotalSold,
            "The Rbcc amount on the contract is insufficient."
        );

        emit SoldRbcc(_bnbAmount, _usdtAmount, _price, rbccAmount);

        _TotalSold += rbccAmount;

        _walletsInvestmentEther[msg.sender] += _bnbAmount;
        _walletsInvestmentUsdt[msg.sender] += _usdtAmount;
        _walletsRbccAmount[msg.sender] += rbccAmount;

        _TotalBNB += _bnbAmount;
        _TotalUSDT += _usdtAmount;
    }

    /**
     * @dev Authorize the contract owner to withdraw the raised funds from the presale
     */
    function withdrawBNB() public onlyOwner {
        Address.sendValue(payable(msg.sender), _TotalBNB);
        _TotalBNB = 0;
    }

    /**
     * @dev Authorize the contract owner to withdraw the raised funds from the presale
     */
    function withdrawUSDT() public onlyOwner {
        _usdtToken.transfer(msg.sender, _TotalUSDT);
        _TotalUSDT = 0;
    }

    /**
     * @dev Authorize the contract owner to withdraw the remaining RBCC from the presale
     */
    function withdrawRemainingRBCC(uint256 _amount) public onlyOwner {
        require(
            _rbccToken.balanceOf(address(this)) >= _amount,
            "RBCC amount asked exceed the contract amount"
        );

        // Calculate how many $RBCC should be in this contract.
        // The $RBCCs are for the users who haven't claimed yet.
        uint256 _totalForUsers = _TotalSold - _TotalClaimed;

        require(
            _rbccToken.balanceOf(address(this)) >= _amount + _totalForUsers,
            "RBCC amount asked exceed the amount for users"
        );
        _rbccToken.transfer(msg.sender, _amount);
    }
}
