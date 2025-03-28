// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HoleskyUSDTCoin is ERC20, Ownable {
    // 1USDT = (10 ** 6)Wei
    uint256 private _totalSupplyWei = 20000 * (10 ** 6);

    constructor(
        address initialOwner
    ) ERC20("HoleskyUSDTCoin", "HoleskyUSDT") Ownable(initialOwner) {
        _mint(
            address(initialOwner),
            _totalSupplyWei
        );
    }

    function decimals() override public view virtual returns (uint8) {
        return 6;
    }
}
