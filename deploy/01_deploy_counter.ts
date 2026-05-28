import { network } from "hardhat";

const ORACLE_ADDRESS = "0x694AA1769357215DE4FAC081bf1f309aDC325306";

async function main() {
  const { ethers } = await network.connect();

  const counter = await ethers.deployContract("Counter", [ORACLE_ADDRESS]);
  await counter.waitForDeployment();

  const address = await counter.getAddress();
  console.log(`Counter deployed at: ${address}`);
  console.log(`Oracle wired: ${ORACLE_ADDRESS}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
