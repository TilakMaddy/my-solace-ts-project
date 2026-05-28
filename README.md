# my-solace-ts-project

A minimal Solidity + TypeScript scaffold (Hardhat 3 + Foundry + Ignition) used as **training material** for developers learning about deployment-time security mistakes.

## Layout

```
.
├── foundry.toml
├── hardhat.config.ts
├── package.json
├── tsconfig.json
├── remappings.txt
├── src/
│   ├── Counter.sol
│   └── upgradeable/
│       ├── CounterUpgradeable.sol
│       └── Proxy.sol
├── deploy/
│   ├── 01_deploy_counter.ts
│   └── 02_deploy_counter_upgradeable.ts
├── ignition/modules/
│   ├── Counter.ts
│   └── CounterUpgradeable.ts
└── test/
    └── Counter.t.sol
```

## Setup

```bash
npm install
```

## Build & test

```bash
forge build
forge test -vvv
npx hardhat compile
```

## Deploy

```bash
npx hardhat run deploy/01_deploy_counter.ts --network hardhat
npx hardhat run deploy/02_deploy_counter_upgradeable.ts --network hardhat
npx hardhat ignition deploy ignition/modules/Counter.ts --network hardhat
npx hardhat ignition deploy ignition/modules/CounterUpgradeable.ts --network hardhat
```
