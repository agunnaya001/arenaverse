// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";
import "./ArenaCoin.sol";
import "./ArenaFighterNFT.sol";

/// @title ArenaBattle - Core combat contract for Arena Battle game
/// @notice Players stake 10 ARENA tokens to fight. Winner receives 20 ARENA tokens.
contract ArenaBattle is Ownable, ReentrancyGuard {
    ArenaCoin public arenaCoin;
    ArenaFighterNFT public arenaFighterNFT;

    uint256 public constant STAKE_AMOUNT = 10 * 10 ** 18;   // 10 ARENA tokens
    uint256 public constant REWARD_AMOUNT = 20 * 10 ** 18;  // 20 ARENA tokens

    uint256 public battleCount;

    struct Battle {
        uint256 id;
        address player1;
        address player2;
        uint256 fighter1Id;
        uint256 fighter2Id;
        address winner;
        uint256 timestamp;
        bool resolved;
    }

    mapping(uint256 => Battle) public battles;

    /// @notice Player stats
    struct PlayerStats {
        uint256 wins;
        uint256 losses;
        uint256 totalTokensEarned;
    }

    mapping(address => PlayerStats) public playerStats;

    /// @notice Pending battle queue: player => fighterId (waiting for opponent)
    struct PendingBattle {
        address player;
        uint256 fighterId;
        uint256 stakedAmount;
        bool active;
    }

    PendingBattle public pendingBattle;

    event BattleQueued(address indexed player, uint256 indexed fighterId);
    event BattleResolved(
        uint256 indexed battleId,
        address indexed player1,
        address indexed player2,
        address winner,
        uint256 fighter1Id,
        uint256 fighter2Id
    );
    event BattleCancelled(address indexed player, uint256 indexed fighterId);

    constructor(
        address initialOwner,
        address _arenaCoin,
        address _arenaFighterNFT
    ) Ownable(initialOwner) {
        arenaCoin = ArenaCoin(_arenaCoin);
        arenaFighterNFT = ArenaFighterNFT(_arenaFighterNFT);
    }

    /// @notice Enter the battle queue or fight the pending player
    /// @param fighterId Token ID of the fighter to use
    function battle(uint256 fighterId) external nonReentrant {
        require(arenaFighterNFT.ownerOf(fighterId) == msg.sender, "ArenaBattle: not your fighter");
        require(
            arenaCoin.allowance(msg.sender, address(this)) >= STAKE_AMOUNT,
            "ArenaBattle: insufficient ARENA allowance"
        );
        require(
            arenaCoin.balanceOf(msg.sender) >= STAKE_AMOUNT,
            "ArenaBattle: insufficient ARENA balance"
        );

        // Collect stake from player
        arenaCoin.transferFrom(msg.sender, address(this), STAKE_AMOUNT);

        if (!pendingBattle.active) {
            // No opponent waiting — enter queue
            pendingBattle = PendingBattle({
                player: msg.sender,
                fighterId: fighterId,
                stakedAmount: STAKE_AMOUNT,
                active: true
            });
            emit BattleQueued(msg.sender, fighterId);
        } else {
            // Opponent is waiting — resolve battle
            require(pendingBattle.player != msg.sender, "ArenaBattle: cannot fight yourself");

            address player1 = pendingBattle.player;
            address player2 = msg.sender;
            uint256 fighter1Id = pendingBattle.fighterId;
            uint256 fighter2Id = fighterId;

            // Clear pending battle
            delete pendingBattle;

            // Determine winner using on-chain pseudo-randomness
            address winner = _resolveBattle(player1, player2, fighter1Id, fighter2Id);
            address loser = (winner == player1) ? player2 : player1;

            uint256 battleId = ++battleCount;
            battles[battleId] = Battle({
                id: battleId,
                player1: player1,
                player2: player2,
                fighter1Id: fighter1Id,
                fighter2Id: fighter2Id,
                winner: winner,
                timestamp: block.timestamp,
                resolved: true
            });

            // Update player stats
            playerStats[winner].wins++;
            playerStats[winner].totalTokensEarned += REWARD_AMOUNT;
            playerStats[loser].losses++;

            // Update fighter NFT stats
            arenaFighterNFT.recordBattleResult(winner == player1 ? fighter1Id : fighter2Id, true);
            arenaFighterNFT.recordBattleResult(loser == player1 ? fighter1Id : fighter2Id, false);

            // Mint reward tokens to winner (or transfer from contract if enough balance)
            uint256 contractBalance = arenaCoin.balanceOf(address(this));
            if (contractBalance >= REWARD_AMOUNT) {
                // Use staked tokens + any contract reserves
                arenaCoin.transfer(winner, REWARD_AMOUNT);
            } else {
                // Mint new tokens for reward
                arenaCoin.transfer(winner, contractBalance);
                arenaCoin.mint(winner, REWARD_AMOUNT - contractBalance);
            }

            emit BattleResolved(battleId, player1, player2, winner, fighter1Id, fighter2Id);
        }
    }

    /// @notice Cancel pending battle and get stake back
    function cancelBattle() external nonReentrant {
        require(pendingBattle.active, "ArenaBattle: no pending battle");
        require(pendingBattle.player == msg.sender, "ArenaBattle: not your battle");

        uint256 fighterId = pendingBattle.fighterId;
        delete pendingBattle;

        arenaCoin.transfer(msg.sender, STAKE_AMOUNT);
        emit BattleCancelled(msg.sender, fighterId);
    }

    /// @notice Simulate a battle between two players for frontend (view only)
    function simulateBattle(
        address player1,
        address player2,
        uint256 fighter1Id,
        uint256 fighter2Id
    ) external view returns (address winner) {
        return _resolveBattle(player1, player2, fighter1Id, fighter2Id);
    }

    /// @notice Internal battle resolution using fighter stats
    function _resolveBattle(
        address player1,
        address player2,
        uint256 fighter1Id,
        uint256 fighter2Id
    ) internal view returns (address) {
        ArenaFighterNFT.FighterStats memory stats1 = arenaFighterNFT.getFighterStats(fighter1Id);
        ArenaFighterNFT.FighterStats memory stats2 = arenaFighterNFT.getFighterStats(fighter2Id);

        // Combat score = attack * 2 + defense + speed + level * 5
        uint256 score1 = uint256(stats1.attack) * 2 + stats1.defense + stats1.speed + stats1.level * 5;
        uint256 score2 = uint256(stats2.attack) * 2 + stats2.defense + stats2.speed + stats2.level * 5;

        // Add randomness: ±20% of combined score
        uint256 totalScore = score1 + score2;
        bytes32 rand = keccak256(abi.encodePacked(block.timestamp, block.prevrandao, player1, player2, fighter1Id, fighter2Id));
        uint256 randFactor = uint256(rand) % (totalScore / 5 + 1); // up to 20% variance

        // Random factor favors player1 or player2
        if (uint256(rand) % 2 == 0) {
            score1 += randFactor;
        } else {
            score2 += randFactor;
        }

        return score1 >= score2 ? player1 : player2;
    }

    /// @notice Get player stats
    function getPlayerStats(address player) external view returns (PlayerStats memory) {
        return playerStats[player];
    }

    /// @notice Get battle details
    function getBattle(uint256 battleId) external view returns (Battle memory) {
        return battles[battleId];
    }

    /// @notice Get pending battle info
    function getPendingBattle() external view returns (PendingBattle memory) {
        return pendingBattle;
    }

    /// @notice Owner can withdraw excess tokens
    function withdrawTokens(uint256 amount) external onlyOwner {
        arenaCoin.transfer(owner(), amount);
    }

    /// @notice Update contract references
    function setContracts(address _arenaCoin, address _arenaFighterNFT) external onlyOwner {
        arenaCoin = ArenaCoin(_arenaCoin);
        arenaFighterNFT = ArenaFighterNFT(_arenaFighterNFT);
    }
}
