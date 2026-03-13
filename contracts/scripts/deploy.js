/**
 * Arena Battle Deployment Script
 * 
 * Deploys contracts in order:
 *  1. ArenaCoin (ERC20)
 *  2. ArenaFighterNFT (ERC721)
 *  3. ArenaBattle (combat)
 * 
 * Then wires them together:
 *  - Adds ArenaBattle as an authorized minter on ArenaCoin
 *  - Sets ArenaBattle as the battle contract on ArenaFighterNFT
 *  - Transfers some ARENA tokens to ArenaBattle as initial reward pool
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  const [deployer] = await hre.ethers.getSigners();
  const network = hre.network.name;

  console.log("=================================================");
  console.log("  Arena Battle Deployment");
  console.log("=================================================");
  console.log(`Network:    ${network}`);
  console.log(`Deployer:   ${deployer.address}`);

  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log(`Balance:    ${hre.ethers.formatEther(balance)} ETH`);
  console.log("");

  // ----------------------------------------
  // 1. Deploy ArenaCoin
  // ----------------------------------------
  console.log("1. Deploying ArenaCoin...");
  const ArenaCoin = await hre.ethers.getContractFactory("ArenaCoin");
  const arenaCoin = await ArenaCoin.deploy(deployer.address);
  await arenaCoin.waitForDeployment();
  const arenaCoinAddress = await arenaCoin.getAddress();
  console.log(`   ✅ ArenaCoin deployed to: ${arenaCoinAddress}`);

  const totalSupply = await arenaCoin.totalSupply();
  console.log(`   Total supply: ${hre.ethers.formatEther(totalSupply)} ARENA`);

  // ----------------------------------------
  // 2. Deploy ArenaFighterNFT
  // ----------------------------------------
  console.log("\n2. Deploying ArenaFighterNFT...");
  const ArenaFighterNFT = await hre.ethers.getContractFactory("ArenaFighterNFT");
  const arenaFighterNFT = await ArenaFighterNFT.deploy(deployer.address);
  await arenaFighterNFT.waitForDeployment();
  const arenaFighterNFTAddress = await arenaFighterNFT.getAddress();
  console.log(`   ✅ ArenaFighterNFT deployed to: ${arenaFighterNFTAddress}`);

  // ----------------------------------------
  // 3. Deploy ArenaBattle
  // ----------------------------------------
  console.log("\n3. Deploying ArenaBattle...");
  const ArenaBattle = await hre.ethers.getContractFactory("ArenaBattle");
  const arenaBattle = await ArenaBattle.deploy(
    deployer.address,
    arenaCoinAddress,
    arenaFighterNFTAddress
  );
  await arenaBattle.waitForDeployment();
  const arenaBattleAddress = await arenaBattle.getAddress();
  console.log(`   ✅ ArenaBattle deployed to: ${arenaBattleAddress}`);

  // ----------------------------------------
  // 4. Wire contracts together
  // ----------------------------------------
  console.log("\n4. Configuring contracts...");

  // Add ArenaBattle as authorized minter on ArenaCoin
  console.log("   Adding ArenaBattle as ArenaCoin minter...");
  const addMinterTx = await arenaCoin.addMinter(arenaBattleAddress);
  await addMinterTx.wait();
  console.log("   ✅ Minter added");

  // Set ArenaBattle as the battle contract on ArenaFighterNFT
  console.log("   Setting ArenaBattle as ArenaFighterNFT battle contract...");
  const setBattleTx = await arenaFighterNFT.setBattleContract(arenaBattleAddress);
  await setBattleTx.wait();
  console.log("   ✅ Battle contract set");

  // Transfer initial reward pool (100,000 ARENA) to ArenaBattle
  const rewardPool = hre.ethers.parseEther("100000");
  console.log(`   Transferring 100,000 ARENA to ArenaBattle reward pool...`);
  const transferTx = await arenaCoin.transfer(arenaBattleAddress, rewardPool);
  await transferTx.wait();
  console.log("   ✅ Reward pool funded");

  // ----------------------------------------
  // 5. Save deployment info
  // ----------------------------------------
  const deployment = {
    network,
    chainId: (await hre.ethers.provider.getNetwork()).chainId.toString(),
    deployer: deployer.address,
    timestamp: new Date().toISOString(),
    contracts: {
      ArenaCoin: arenaCoinAddress,
      ArenaFighterNFT: arenaFighterNFTAddress,
      ArenaBattle: arenaBattleAddress,
    },
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir, { recursive: true });
  }

  const deploymentFile = path.join(deploymentsDir, `${network}.json`);
  fs.writeFileSync(deploymentFile, JSON.stringify(deployment, null, 2));
  console.log(`\n   Deployment info saved to: deployments/${network}.json`);

  // ----------------------------------------
  // Summary
  // ----------------------------------------
  console.log("\n=================================================");
  console.log("  Deployment Complete!");
  console.log("=================================================");
  console.log(`ArenaCoin:       ${arenaCoinAddress}`);
  console.log(`ArenaFighterNFT: ${arenaFighterNFTAddress}`);
  console.log(`ArenaBattle:     ${arenaBattleAddress}`);
  console.log("");
  console.log("Next steps:");
  console.log(`  1. Run: npm run verify`);
  console.log(`  2. Set these in your .env:`);
  console.log(`     VITE_ARENA_COIN_ADDRESS=${arenaCoinAddress}`);
  console.log(`     VITE_ARENA_FIGHTER_NFT_ADDRESS=${arenaFighterNFTAddress}`);
  console.log(`     VITE_ARENA_BATTLE_ADDRESS=${arenaBattleAddress}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
