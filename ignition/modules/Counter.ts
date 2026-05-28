import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("CounterModule", (m) => {
  const oracle = m.getParameter(
    "oracle",
    "0x694AA1769357215DE4FAC081bf1f309aDC325306",
  );

  const counter = m.contract("Counter", [oracle]);

  return { counter };
});
