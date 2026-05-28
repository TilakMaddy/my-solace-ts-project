import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CounterUpgradeableModule", (m) => {
  const initialOwner = m.getParameter<string>(
    "initialOwner",
    "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
  );
  const initialCount = m.getParameter<bigint>("initialCount", 0n);

  const implementation = m.contract("CounterUpgradeable", []);

  const initData = m.encodeFunctionCall(implementation, "initialize", [
    initialOwner,
    initialCount,
  ]);

  const proxy = m.contract("ERC1967Proxy", [implementation, initData]);

  const counter = m.contractAt("CounterUpgradeable", proxy, {
    id: "CounterUpgradeableProxied",
  });

  return { implementation, proxy, counter };
});
