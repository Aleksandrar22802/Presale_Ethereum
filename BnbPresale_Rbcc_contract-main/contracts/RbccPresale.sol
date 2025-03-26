// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RbccPresale {
    // this type or function is not used in this file
    using SafeERC20 for IERC20;

    /*
    1 vs 1(for price)
    warning _rbccToken.price = _usdtToken.prince.
    pls ref HoleskyNativeCoin.sol/HoleskyNativeCoin, Robocopcoin.sol/Robocopcoin
    */
    IERC20 private _rbccToken; // Holesky Mint Token
    IERC20 private _usdtToken; // Rbcc Stable Token

    mapping(address => uint256) private _walletsInvestmentEther;
    mapping(address => uint256) private _walletsInvestmentUSDT;
    mapping(address => uint256) private _walletsRbccAmount;

    // owner
    address private _owner;

    // Claim Time Range
    uint256 private _startTime;
    uint256 private _endTime;

    // Ether vs USDT(Ethereum vs HoleskyStable(ex:HoleskyNative))
    uint256 private _pricePerEther;

    // current this value is 1
    uint256 private _pricePerRbcc; // usdt per token, unit is $

    // limit amount for presale
    uint256 private _limitForPresale; // amount of Rbcc token

    // min, max range for wallet's presale
    uint256 private _maxRbccPerWallet;
    uint256 private _minRbccPerWallet;

    // presale state before withdraw(must be valid in claim time range)
    uint256 private _totalEther; // total amount of Ether
    uint256 private _totalUSDT; // total amount of USDT
    uint256 private _totalSold; // soled amount of Rbcc

    // total claimed rbccToken count
    uint256 public _totalClaimed; // Total RBCC amount of claimed by users

    uint256 private constant TOKEN_DECIMAL = 1e18;
    uint256 private constant USDT_DECIMAL = 1e6;

    event SoldRbcc(
        uint256 etherAmount,
        uint256 usdtAmount,
        uint256 rbccAmount,
        uint256 pricePerRbcc
    );
    event StateChange();

    /**
     * @dev Constructing the contract basic informations, containing the RBCC token addr, the ratio price eth:elo
     * and the max authorized eth amount per wallet
     */
     /*
     stableToken : Holesky Native(Stable Coin)
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
        // _pricePerEther = 600 * USDT_DECIMAL; // 1ether = 600$
        _pricePerEther = 600; // 1ether = 600$

        // set total info
        _totalEther = 0;
        _totalUSDT = 0;
        _totalSold = 0;
        _totalClaimed = 0;

        // _pricePerRbcc = 400; // 0.0004 * USDT_DECIMAL = 0.0004 $
        // _pricePerRbcc = 400 / USDT_DECIMAL; // = 0.0004 $
        // pls ref HoleskyNativeCoin.sol/HoleskyNativeCoin, Robocopcoin.sol/Robocopcoin
        _pricePerRbcc = 1.0; // = 1.0 $

        // _limitForPresale = (10 ** 9) * TOKEN_DECIMAL; // 1,000,000,000 Rbcc
        _limitForPresale = (10 ** 9); // 1,000,000,000 Rbcc

        // _maxRbccPerWallet = 10000 * USDT_DECIMAL; // 10000 $
        // _minRbccPerWallet = 50 * USDT_DECIMAL; // 50 $
        _maxRbccPerWallet = 10000 / _pricePerRbcc; // amount for 10000 $
        _minRbccPerWallet = 50 / _pricePerRbcc; // amount for 50 $
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
        // _pricePerEther = price * USDT_DECIMAL;
        _pricePerEther = price; // 1ether = price$
    }

    /**
     * @dev Receive ether payment for the presale raise
     */
    function buyWithEther() external payable {
        // Check buy time in Claim Time Range
        require(
            block.timestamp >= _startTime && block.timestamp <= _endTime,
            "RbccPresale: Not presale period"
        );

        require(msg.value > 0, "Insufficient Ether amount");

        uint256 etherAmount = msg.value;

        // uint256 currentInvestment = (_walletsInvestmentEther[msg.sender] *
        //     _pricePerEther) /
        //     TOKEN_DECIMAL +
        //     _walletsInvestmentUSDT[msg.sender];
        // uint256 calcInvestment = currentInvestment +
        //     (etherAmount * _pricePerEther) /
        //     TOKEN_DECIMAL;
        // require(
        //     calcInvestment >= _minRbccPerWallet && calcInvestment <= _maxRbccPerWallet,
        //     "RbccPresale: The price is not allowed for presale."
        // );
        uint256 currentInvestment = (_walletsInvestmentEther[msg.sender] * _pricePerEther) + _walletsInvestmentUSDT[msg.sender];
        uint256 calcInvestment = currentInvestment + (etherAmount * _pricePerEther);
        uint256 calcInvestmentRbcc = calcInvestment * _pricePerRbcc;
        require(
            calcInvestmentRbcc >= _minRbccPerWallet && calcInvestmentRbcc <= _maxRbccPerWallet,
            "RbccPresale: The Ether is overflow for min-max range."
        );

        // uint256 tokenAmount = (etherAmount * _pricePerEther) /
        //     (_pricePerRbcc * TOKEN_DECIMAL);
        uint256 tokenAmount = (etherAmount * _pricePerEther) / _pricePerRbcc;

        _allocateRbcc(etherAmount, 0, tokenAmount);
    }

    /**
     * @dev Receive usdt payment for the presale raise
     */
    function buyTokensWithUSDT(uint256 usdtAmount) external {
        // Check buy time in Claim Time Range
        require(
            block.timestamp >= _startTime && block.timestamp <= _endTime,
            "RbccPresale: Not presale period"
        );

        require(usdtAmount > 0, "Insufficient USDT amount");

        // uint256 currentInvestment = (_walletsInvestmentEther[msg.sender] *
        //     _pricePerEther) /
        //     TOKEN_DECIMAL +
        //     _walletsInvestmentUSDT[msg.sender];
        // uint256 calcInvestment = currentInvestment + usdtAmount;
        // require(
        //     calcInvestment >= _minRbccPerWallet && calcInvestment <= _maxRbccPerWallet,
        //     "RbccPresale: The price is not allowed for presale."
        // );
        uint256 currentInvestment = (_walletsInvestmentEther[msg.sender] * _pricePerEther)  + _walletsInvestmentUSDT[msg.sender];
        uint256 calcInvestment = currentInvestment + usdtAmount;
        uint256 calcInvestmentRbcc = calcInvestment * _pricePerRbcc;
        require(
            calcInvestmentRbcc >= _minRbccPerWallet && calcInvestmentRbcc <= _maxRbccPerWallet,
            "RbccPresale: The USDT is overflow for min~max range."
        );

        uint256 tokenAmount = usdtAmount / _pricePerRbcc;

        _usdtToken.safeTransferFrom(msg.sender, address(this), usdtAmount);

        _allocateRbcc(0, usdtAmount, tokenAmount);
    }

    /**
     * @dev Claim the RBCC once the presale is done
     */
    function claimRbcc() public {
        // Check buy time in Claim Time Range
        require(block.timestamp > _endTime, "Presale is not finished.");

        uint256 srcAmount = (_walletsInvestmentEther[msg.sender] * _pricePerEther) /
            TOKEN_DECIMAL +
            _walletsInvestmentUSDT[msg.sender];
        require(srcAmount > 0, "You dont have any RBCC to claim");

        uint256 rbccAmount = _walletsRbccAmount[msg.sender];
        require(
            _rbccToken.balanceOf(address(this)) >= rbccAmount,
            "The RBCC amount on the contract is insufficient."
        );

        _rbccToken.transfer(msg.sender, rbccAmount * TOKEN_DECIMAL);

        _totalClaimed += rbccAmount;

        _walletsInvestmentEther[msg.sender] = 0;
        _walletsInvestmentUSDT[msg.sender] = 0;
        _walletsRbccAmount[msg.sender] = 0;
    }

    function getEtherPrice() public view returns (uint256) {
        return _pricePerEther;
    }
    /**
     * @dev Return the rate of Rbcc/USDT from the Presale in Round
     */
    function getPricePerToken() public view returns (uint256) {
        return _pricePerRbcc;
    }

    /**
     * @dev Return the limited amount from the Presale (as Rbcc) in Round
     */
    function getLimitForPresale() public view returns (uint256) {
        return _limitForPresale;
    }

    /**
     * @dev Return the max buy value per wallet (as Rbcc) in Round
     */
    function getMaxRbccPerWallet() public view returns (uint256) {
        return _maxRbccPerWallet;
    }

    /**
     * @dev Return the min buy value per wallet (as Rbcc) in Round
     */
    function getMinRbccPerWallet() public view returns (uint256) {
        return _minRbccPerWallet;
    }

    /**
     * @dev Return the amount Ether raised from the Presale (as ether) in Round
     */
    function getTotalEther() public view returns (uint256) {
        return _totalEther;
    }

    /**
     * @dev Return the amount USDT raised from the Presale (as usdt) in Round
     */
    function getTotalUSDT() public view returns (uint256) {
        return _totalUSDT;
    }

    /**
     * @dev Return the amount soled from the Presale (as Rbcc) in Round
     */
    function getTotalSold() public view returns (uint256) {
        // return _totalSold * TOKEN_DECIMAL;
        return _totalSold;
    }

    /**
     * @dev Return the total amount Ether invested from a specific address
     */
    function getAddressInvestmentEther(
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
        return _walletsInvestmentUSDT[addr];
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
        uint256 etherAmount,
        uint256 usdtAmount,
        uint256 rbccAmount
    ) private {
        require(
            _rbccToken.balanceOf(address(this)) >= rbccAmount + _totalSold,
            "The Rbcc amount on the contract is insufficient."
        );

        emit SoldRbcc(etherAmount, usdtAmount, rbccAmount, _pricePerRbcc);

        _walletsInvestmentEther[msg.sender] += etherAmount;
        _walletsInvestmentUSDT[msg.sender] += usdtAmount;
        _walletsRbccAmount[msg.sender] += rbccAmount;

        _totalEther += etherAmount;
        _totalUSDT += usdtAmount;
        _totalSold += rbccAmount;
    }

    /**
     * @dev Authorize the contract owner to withdraw the raised funds from the presale
     */
    function withdrawEther() public onlyOwner {
        Address.sendValue(payable(msg.sender), _totalEther);
        _totalEther = 0;
    }

    /**
     * @dev Authorize the contract owner to withdraw the raised funds from the presale
     */
    function withdrawUSDT() public onlyOwner {
        _usdtToken.transfer(msg.sender, _totalUSDT);
        _totalUSDT = 0;
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
        uint256 _totalForUsers = _totalSold - _totalClaimed;

        require(
            _rbccToken.balanceOf(address(this)) >= _amount + _totalForUsers,
            "RBCC amount asked exceed the amount for users"
        );
        _rbccToken.transfer(msg.sender, _amount);
    }
}
