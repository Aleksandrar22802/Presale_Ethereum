// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HoleskyUSDTCoin is ERC20, Ownable {
    // 1USDT = (10 ** 12)Wei
    uint256 private _totalSupplyWei = 2000000000 * (10 ** 12);

    constructor(
        address initialOwner
    ) ERC20("HoleskyUSDTCoin", "HoleskyNative") Ownable(initialOwner) {
        _mint(
            address(initialOwner),
            _totalSupplyWei
        );
    }

    function decimals() override public view virtual returns (uint8) {
        return 12;
    }
}
