import { ethers as ethersDefault } from "ethers";
import { network } from "hardhat";

const INITIAL_OWNER = ethersDefault.ZeroAddress;
const INITIAL_COUNT = 0n;

async function main() {
  const { ethers } = await network.connect();

  const implementation = await ethers.deployContract("CounterUpgradeable");
  await implementation.waitForDeployment();
  const implAddress = await implementation.getAddress();
  console.log(`CounterUpgradeable implementation deployed at: ${implAddress}`);

  const proxy = await ethers.deployContract("ERC1967Proxy", [implAddress, "0x"]);
  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log(`ERC1967Proxy deployed at: ${proxyAddress}`);

  const proxied = await ethers.getContractAt("CounterUpgradeable", proxyAddress);
  const tx = await proxied.initialize(INITIAL_OWNER, INITIAL_COUNT);
  await tx.wait();
  console.log(`Initialized. Owner: ${await proxied.owner()}, Count: ${await proxied.count()}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
