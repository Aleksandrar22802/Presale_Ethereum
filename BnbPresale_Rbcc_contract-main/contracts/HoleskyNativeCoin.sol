// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract HoleskyNativeCoin is ERC20, Ownable {
    uint256 private _totalSupply = 2000000000 * (10 ** 18);

    constructor(
        address initialOwner
    ) ERC20("HoleskyNativeCoin", "HoleskyNative") Ownable(initialOwner) {
        _mint(
            address(0xad5518188e17860f63112e995372D834519426eD),
            _totalSupply
        );
    }
}
