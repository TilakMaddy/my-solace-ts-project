import { network } from "hardhat";

async function main() {
  const { ethers } = await network.connect();

  const counter = await ethers.deployContract("Counter");
  await counter.waitForDeployment();

  const address = await counter.getAddress();
  console.log(`Counter deployed at: ${address}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
