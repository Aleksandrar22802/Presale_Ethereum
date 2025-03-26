// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Robocopcoin is ERC20, Ownable {
    uint256 private _totalSupply = 3000000000 * (10 ** 18);

    constructor(
        address initialOwner
    ) ERC20("Robocopcoin", "Rbcc") Ownable(initialOwner) {
        _mint(
            address(initialOwner),
            _totalSupply
        );
    }
}
