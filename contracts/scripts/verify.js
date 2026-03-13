/**
 * Arena Battle Contract Verification Script
 * 
 * Verifies all contracts on BaseScan after deployment.
 * Run: npm run verify (on base network)
 * 
 * Requires:
 *  - BASESCAN_API_KEY env var
 *  - deployments/base.json to exist (created by deploy.js)
 */

const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function verifyContract(address, constructorArgs, contractName) {
  console.log(`\nVerifying ${contractName} at ${address}...`);
  try {
    await hre.run("verify:verify", {
      address,
      constructorArguments: constructorArgs,
    });
    console.log(`✅ ${contractName} verified!`);
  } catch (err) {
    if (err.message.includes("Already Verified") || err.message.includes("already verified")) {
      console.log(`ℹ️  ${contractName} already verified`);
    } else {
      console.error(`❌ ${contractName} verification failed:`, err.message);
    }
  }
}

async function main() {
  const network = hre.network.name;
  const deploymentFile = path.join(__dirname, "..", "deployments", `${network}.json`);

  if (!fs.existsSync(deploymentFile)) {
    throw new Error(
      `Deployment file not found: ${deploymentFile}\nPlease run 'npm run deploy' first.`
    );
  }

  const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
  const { contracts, deployer } = deployment;

  console.log("=================================================");
  console.log("  Arena Battle Contract Verification");
  console.log("=================================================");
  console.log(`Network:  ${network}`);
  console.log(`Deployer: ${deployer}`);
  console.log("");
  console.log("Waiting 30 seconds for BaseScan to index contracts...");
  await sleep(30000);

  // Verify ArenaCoin
  await verifyContract(
    contracts.ArenaCoin,
    [deployer], // constructor args: initialOwner
    "ArenaCoin"
  );

  await sleep(5000);

  // Verify ArenaFighterNFT
  await verifyContract(
    contracts.ArenaFighterNFT,
    [deployer], // constructor args: initialOwner
    "ArenaFighterNFT"
  );

  await sleep(5000);

  // Verify ArenaBattle
  await verifyContract(
    contracts.ArenaBattle,
    [deployer, contracts.ArenaCoin, contracts.ArenaFighterNFT], // constructor args
    "ArenaBattle"
  );

  console.log("\n=================================================");
  console.log("  Verification Complete!");
  console.log("=================================================");
  console.log(`View on BaseScan:`);
  console.log(`  ArenaCoin:       https://basescan.org/address/${contracts.ArenaCoin}`);
  console.log(`  ArenaFighterNFT: https://basescan.org/address/${contracts.ArenaFighterNFT}`);
  console.log(`  ArenaBattle:     https://basescan.org/address/${contracts.ArenaBattle}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
