import { network } from "hardhat";

type NetworkParams = {
  initialOwner: string;
  initialCount: bigint;
};

const NETWORK_PARAMS: Record<string, NetworkParams> = {
  hardhat: {
    initialOwner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    initialCount: 0n,
  },
  localhost: {
    initialOwner: "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
    initialCount: 0n,
  },
};

async function main() {
  const { ethers, networkName } = await network.connect();

  const params = NETWORK_PARAMS[networkName];
  if (params === undefined) {
    throw new Error(
      `No deployment parameters configured for network "${networkName}". ` +
        `Add an entry to NETWORK_PARAMS before deploying.`,
    );
  }

  const implementation = await ethers.deployContract("CounterUpgradeable");
  await implementation.waitForDeployment();
  const implAddress = await implementation.getAddress();
  console.log(`CounterUpgradeable implementation deployed at: ${implAddress}`);

  const initData = implementation.interface.encodeFunctionData("initialize", [
    params.initialOwner,
    params.initialCount,
  ]);

  const proxy = await ethers.deployContract("ERC1967Proxy", [implAddress, initData]);
  await proxy.waitForDeployment();
  const proxyAddress = await proxy.getAddress();
  console.log(`ERC1967Proxy deployed at: ${proxyAddress}`);

  const proxied = await ethers.getContractAt("CounterUpgradeable", proxyAddress);
  console.log(`Initialized owner: ${await proxied.owner()}`);
  console.log(`Initialized count: ${await proxied.count()}`);
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
