// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ArenaCoin - ERC20 token for the Arena Battle game
/// @notice Players use ARENA tokens to stake in battles and earn rewards
contract ArenaCoin is ERC20, Ownable {
    uint256 public constant INITIAL_SUPPLY = 1_000_000 * 10 ** 18;

    /// @dev Addresses authorized to mint/burn tokens (battle contract)
    mapping(address => bool) public minters;

    event MinterAdded(address indexed minter);
    event MinterRemoved(address indexed minter);

    modifier onlyMinter() {
        require(minters[msg.sender] || msg.sender == owner(), "ArenaCoin: not authorized");
        _;
    }

    constructor(address initialOwner) ERC20("ArenaCoin", "ARENA") Ownable(initialOwner) {
        _mint(initialOwner, INITIAL_SUPPLY);
    }

    /// @notice Add a minter (e.g. the ArenaBattle contract)
    function addMinter(address minter) external onlyOwner {
        minters[minter] = true;
        emit MinterAdded(minter);
    }

    /// @notice Remove a minter
    function removeMinter(address minter) external onlyOwner {
        minters[minter] = false;
        emit MinterRemoved(minter);
    }

    /// @notice Mint new tokens — only authorized minters
    function mint(address to, uint256 amount) external onlyMinter {
        _mint(to, amount);
    }

    /// @notice Burn tokens from an address — only authorized minters
    function burn(address from, uint256 amount) external onlyMinter {
        _burn(from, amount);
    }
}
