// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HoleskyRbccCoin is ERC20, Ownable {
    // 1Rbcc = (10 ** 14)Wei
    uint256 private _totalSupplyWei = 3000000000 * (10 ** 14);

    constructor(
        address initialOwner
    ) ERC20("HoleskyRbccCoin", "Rbcc") Ownable(initialOwner) {
        _mint(
            address(initialOwner),
            _totalSupplyWei
        );
    }

    function decimals() override public view virtual returns (uint8) {
        return 14;
    }
}
