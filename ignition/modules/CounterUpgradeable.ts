import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CounterUpgradeableModule", (m) => {
  const initialOwner = m.getParameter(
    "initialOwner",
    "0x0000000000000000000000000000000000000000",
  );
  const initialCount = m.getParameter("initialCount", 0n);

  const implementation = m.contract("CounterUpgradeable", []);

  const proxy = m.contract("ERC1967Proxy", [implementation, "0x"]);

  const counter = m.contractAt("CounterUpgradeable", proxy, {
    id: "CounterUpgradeableProxied",
  });

  m.call(counter, "initialize", [initialOwner, initialCount]);

  return { implementation, proxy, counter };
});
