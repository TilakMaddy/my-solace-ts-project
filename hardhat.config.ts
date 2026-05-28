import { defineConfig } from "hardhat/config";
import hardhatToolboxMochaEthers from "@nomicfoundation/hardhat-toolbox-mocha-ethers";
import hardhatIgnition from "@nomicfoundation/hardhat-ignition";
import hardhatIgnitionEthers from "@nomicfoundation/hardhat-ignition-ethers";

export default defineConfig({
  plugins: [
    hardhatToolboxMochaEthers,
    hardhatIgnition,
    hardhatIgnitionEthers,
  ],
  solidity: {
    version: "0.8.24",
    settings: {
      optimizer: { enabled: true, runs: 200 },
    },
  },
  paths: {
    sources: "./src",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
  networks: {
    hardhat: {
      type: "edr-simulated",
      chainType: "l1",
    },
    sepolia: {
      type: "http",
      chainType: "l1",
      url: process.env.SEPOLIA_RPC_URL ?? "",
      accounts: [process.env.SEPOLIA_PRIVATE_KEY ?? ""],
    },
    mainnet: {
      type: "http",
      chainType: "l1",
      url: process.env.MAINNET_RPC_URL ?? "",
      accounts: [process.env.MAINNET_PRIVATE_KEY ?? ""],
    },
  },
});
