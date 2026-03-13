// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/// @title ArenaFighterNFT - ERC721 NFT representing fighters in the Arena Battle game
contract ArenaFighterNFT is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;

    /// @notice Fighter classes
    enum FighterClass { Warrior, Mage, Rogue }

    /// @notice Fighter attributes stored on-chain
    struct FighterStats {
        FighterClass class_;
        uint8 attack;
        uint8 defense;
        uint8 speed;
        uint8 level;
        uint256 wins;
        uint256 losses;
    }

    mapping(uint256 => FighterStats) public fighterStats;

    /// @notice Address authorized to update fighter stats (battle contract)
    address public battleContract;

    event FighterMinted(address indexed owner, uint256 indexed tokenId, FighterClass class_);
    event FighterStatsUpdated(uint256 indexed tokenId, uint256 wins, uint256 losses);
    event BattleContractSet(address indexed battleContract);

    modifier onlyBattleContract() {
        require(msg.sender == battleContract || msg.sender == owner(), "ArenaFighterNFT: not authorized");
        _;
    }

    constructor(address initialOwner) ERC721("ArenaFighter", "AFIGHTER") Ownable(initialOwner) {}

    /// @notice Set the battle contract address
    function setBattleContract(address _battleContract) external onlyOwner {
        battleContract = _battleContract;
        emit BattleContractSet(_battleContract);
    }

    /// @notice Mint a new fighter NFT with randomized stats
    /// @param to Recipient address
    /// @param class_ Fighter class (0=Warrior, 1=Mage, 2=Rogue)
    /// @param tokenURI_ Metadata URI for the NFT
    function mint(address to, FighterClass class_, string memory tokenURI_) external returns (uint256) {
        uint256 tokenId = _nextTokenId++;

        // Generate pseudo-random stats based on class and block data
        bytes32 rand = keccak256(abi.encodePacked(block.timestamp, block.prevrandao, to, tokenId));

        uint8 baseAttack;
        uint8 baseDefense;
        uint8 baseSpeed;

        if (class_ == FighterClass.Warrior) {
            baseAttack = 75;
            baseDefense = 80;
            baseSpeed = 60;
        } else if (class_ == FighterClass.Mage) {
            baseAttack = 90;
            baseDefense = 55;
            baseSpeed = 70;
        } else {
            // Rogue
            baseAttack = 80;
            baseDefense = 60;
            baseSpeed = 90;
        }

        // Add ±15 randomness to each stat, capped at 100
        uint8 attack = uint8(bound(uint256(uint8(rand[0])) % 31 + baseAttack - 15, 10, 100));
        uint8 defense = uint8(bound(uint256(uint8(rand[1])) % 31 + baseDefense - 15, 10, 100));
        uint8 speed = uint8(bound(uint256(uint8(rand[2])) % 31 + baseSpeed - 15, 10, 100));

        fighterStats[tokenId] = FighterStats({
            class_: class_,
            attack: attack,
            defense: defense,
            speed: speed,
            level: 1,
            wins: 0,
            losses: 0
        });

        _safeMint(to, tokenId);
        _setTokenURI(tokenId, tokenURI_);

        emit FighterMinted(to, tokenId, class_);
        return tokenId;
    }

    /// @notice Record win/loss for a fighter after a battle
    function recordBattleResult(uint256 tokenId, bool won) external onlyBattleContract {
        require(_ownerOf(tokenId) != address(0), "ArenaFighterNFT: token does not exist");

        if (won) {
            fighterStats[tokenId].wins++;
            // Level up every 5 wins, max level 10
            if (fighterStats[tokenId].wins % 5 == 0 && fighterStats[tokenId].level < 10) {
                fighterStats[tokenId].level++;
            }
        } else {
            fighterStats[tokenId].losses++;
        }

        emit FighterStatsUpdated(tokenId, fighterStats[tokenId].wins, fighterStats[tokenId].losses);
    }

    /// @notice Get all fighter stats for a token
    function getFighterStats(uint256 tokenId) external view returns (FighterStats memory) {
        require(_ownerOf(tokenId) != address(0), "ArenaFighterNFT: token does not exist");
        return fighterStats[tokenId];
    }

    /// @notice Get all token IDs owned by an address
    function getTokensByOwner(address owner_) external view returns (uint256[] memory) {
        uint256 count = balanceOf(owner_);
        uint256[] memory tokens = new uint256[](count);
        for (uint256 i = 0; i < count; i++) {
            tokens[i] = tokenOfOwnerByIndex(owner_, i);
        }
        return tokens;
    }

    // ---- Utility ----

    function bound(uint256 value, uint256 min, uint256 max) internal pure returns (uint256) {
        if (value < min) return min;
        if (value > max) return max;
        return value;
    }

    // ---- Required overrides ----

    function _update(address to, uint256 tokenId, address auth)
        internal
        override(ERC721, ERC721Enumerable)
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
