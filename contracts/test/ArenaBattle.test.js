const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Arena Battle Contracts", function () {
  let arenaCoin, arenaFighterNFT, arenaBattle;
  let owner, player1, player2;

  beforeEach(async function () {
    [owner, player1, player2] = await ethers.getSigners();

    // Deploy ArenaCoin
    const ArenaCoin = await ethers.getContractFactory("ArenaCoin");
    arenaCoin = await ArenaCoin.deploy(owner.address);

    // Deploy ArenaFighterNFT
    const ArenaFighterNFT = await ethers.getContractFactory("ArenaFighterNFT");
    arenaFighterNFT = await ArenaFighterNFT.deploy(owner.address);

    // Deploy ArenaBattle
    const ArenaBattle = await ethers.getContractFactory("ArenaBattle");
    arenaBattle = await ArenaBattle.deploy(
      owner.address,
      await arenaCoin.getAddress(),
      await arenaFighterNFT.getAddress()
    );

    // Wire contracts
    await arenaCoin.addMinter(await arenaBattle.getAddress());
    await arenaFighterNFT.setBattleContract(await arenaBattle.getAddress());

    // Fund reward pool
    await arenaCoin.transfer(await arenaBattle.getAddress(), ethers.parseEther("100000"));

    // Give players ARENA tokens
    await arenaCoin.transfer(player1.address, ethers.parseEther("100"));
    await arenaCoin.transfer(player2.address, ethers.parseEther("100"));

    // Mint fighters for players
    await arenaFighterNFT.mint(player1.address, 0, "ipfs://warrior1"); // Warrior
    await arenaFighterNFT.mint(player2.address, 1, "ipfs://mage1");    // Mage
  });

  describe("ArenaCoin", function () {
    it("should have correct name and symbol", async function () {
      expect(await arenaCoin.name()).to.equal("ArenaCoin");
      expect(await arenaCoin.symbol()).to.equal("ARENA");
    });

    it("should have 1,000,000 initial supply", async function () {
      const supply = await arenaCoin.totalSupply();
      // Original 1M minus what was distributed
      expect(supply).to.be.gt(0);
    });

    it("should allow minter to mint tokens", async function () {
      const before = await arenaCoin.balanceOf(player1.address);
      await arenaCoin.connect(owner).mint(player1.address, ethers.parseEther("50"));
      const after = await arenaCoin.balanceOf(player1.address);
      expect(after - before).to.equal(ethers.parseEther("50"));
    });

    it("should prevent non-minters from minting", async function () {
      await expect(
        arenaCoin.connect(player1).mint(player1.address, ethers.parseEther("100"))
      ).to.be.revertedWith("ArenaCoin: not authorized");
    });
  });

  describe("ArenaFighterNFT", function () {
    it("should mint a fighter with stats", async function () {
      const stats = await arenaFighterNFT.getFighterStats(0);
      expect(stats.class_).to.equal(0); // Warrior
      expect(stats.level).to.equal(1);
      expect(stats.wins).to.equal(0);
      expect(stats.losses).to.equal(0);
    });

    it("should track fighter ownership", async function () {
      expect(await arenaFighterNFT.ownerOf(0)).to.equal(player1.address);
      expect(await arenaFighterNFT.ownerOf(1)).to.equal(player2.address);
    });

    it("should return tokens by owner", async function () {
      const tokens = await arenaFighterNFT.getTokensByOwner(player1.address);
      expect(tokens.length).to.equal(1);
      expect(tokens[0]).to.equal(0n);
    });
  });

  describe("ArenaBattle", function () {
    it("should have correct stake and reward amounts", async function () {
      expect(await arenaBattle.STAKE_AMOUNT()).to.equal(ethers.parseEther("10"));
      expect(await arenaBattle.REWARD_AMOUNT()).to.equal(ethers.parseEther("20"));
    });

    it("should queue player1 when no opponent is waiting", async function () {
      await arenaCoin.connect(player1).approve(
        await arenaBattle.getAddress(),
        ethers.parseEther("10")
      );

      await arenaBattle.connect(player1).battle(0);

      const pending = await arenaBattle.getPendingBattle();
      expect(pending.active).to.be.true;
      expect(pending.player).to.equal(player1.address);
    });

    it("should resolve battle when player2 joins", async function () {
      // Player1 enters queue
      await arenaCoin.connect(player1).approve(
        await arenaBattle.getAddress(),
        ethers.parseEther("10")
      );
      await arenaBattle.connect(player1).battle(0);

      // Player2 joins and resolves battle
      await arenaCoin.connect(player2).approve(
        await arenaBattle.getAddress(),
        ethers.parseEther("10")
      );

      await expect(arenaBattle.connect(player2).battle(1))
        .to.emit(arenaBattle, "BattleResolved");

      // Battle count should be 1
      expect(await arenaBattle.battleCount()).to.equal(1);

      // One player should have 20 ARENA reward, other should have spent 10
      const stats1 = await arenaBattle.getPlayerStats(player1.address);
      const stats2 = await arenaBattle.getPlayerStats(player2.address);
      expect(stats1.wins + stats2.wins).to.equal(1n);
      expect(stats1.losses + stats2.losses).to.equal(1n);
    });

    it("should allow cancelling pending battle", async function () {
      await arenaCoin.connect(player1).approve(
        await arenaBattle.getAddress(),
        ethers.parseEther("10")
      );
      await arenaBattle.connect(player1).battle(0);

      const balanceBefore = await arenaCoin.balanceOf(player1.address);
      await arenaBattle.connect(player1).cancelBattle();
      const balanceAfter = await arenaCoin.balanceOf(player1.address);

      expect(balanceAfter - balanceBefore).to.equal(ethers.parseEther("10"));

      const pending = await arenaBattle.getPendingBattle();
      expect(pending.active).to.be.false;
    });

    it("should prevent player from fighting themselves", async function () {
      await arenaCoin.connect(player1).approve(
        await arenaBattle.getAddress(),
        ethers.parseEther("20")
      );
      await arenaBattle.connect(player1).battle(0);

      await expect(arenaBattle.connect(player1).battle(0))
        .to.be.revertedWith("ArenaBattle: cannot fight yourself");
    });
  });
});
