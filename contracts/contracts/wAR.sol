// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract wAR is ERC20, Ownable {

  event Burn(address sender, string wallet, uint256 amount);

  constructor() ERC20("Wrapped AR", "wAR") {}

  function decimals() public view virtual override returns (uint8) {
    return 12;
  }

  function mint(address to, uint256 amount) public onlyOwner {
    _mint(to, amount);
  }

  function burn(uint256 amount, string memory wallet) public {
    _burn(msg.sender, amount);
    emit Burn(msg.sender, string(wallet), amount);
  }

}
