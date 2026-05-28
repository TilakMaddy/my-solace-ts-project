# my-solace-ts-project

A minimal Solidity + TypeScript scaffold structured to be **analyzable by [solace](https://github.com/) under `--chain evm`**, exercising both supported TypeScript roles for deployment.

## Why this layout

Solace's `--chain evm` mode only audits TypeScript that lands in one of two partitions:

| Partition          | Glob                                                | Audited by         |
|--------------------|-----------------------------------------------------|--------------------|
| `cre`              | `**/cre/**/*.{ts,js,go}`                            | Chainlink CRE agent |
| `evm_deployment`   | `**/deploy/**/*.{ts,js}`, `**/ignition/**/*.{ts,js}`, `**/*[Dd]eploy*.{sol,ts,js}` | Deployment agent    |
| `other_offchain`   | everything else                                     | *(dropped, no analysis)* |

A pure-TS project — or a frontend, indexer, generic backend — is silently dropped. So this repo:

1. **Has Solidity sources** under `src/` so `discover_scope.py` actually finds files for `--chain evm`.
2. **Puts TS into the deployment partition** under both `deploy/` and `ignition/modules/`.
3. **Has both `foundry.toml` and `hardhat.config.ts`** so pre-criteria check 3b (Hardhat-style detected) passes.

## Layout

```
.
├── foundry.toml                         # Foundry config — src = "src"
├── hardhat.config.ts                    # Hardhat 3 — paths.sources = "./src"
├── package.json
├── tsconfig.json
├── remappings.txt
├── src/
│   ├── Counter.sol                      # simple non-upgradeable
│   └── upgradeable/
│       ├── CounterUpgradeable.sol       # UUPS implementation
│       └── Proxy.sol                    # import-shim so ERC1967Proxy compiles
├── deploy/                              # classic Hardhat scripts (evm_deployment)
│   ├── 01_deploy_counter.ts
│   └── 02_deploy_counter_upgradeable.ts # atomic proxy init
├── ignition/modules/                    # Ignition modules (evm_deployment)
│   ├── Counter.ts
│   └── CounterUpgradeable.ts            # atomic proxy init
└── test/
    └── Counter.t.sol                    # Foundry test (excluded from solace scope)
```

## Safe-by-design patterns

The deploy/Ignition code is structured to *not* trip any of the deployment agent's findings:

- **Atomic proxy initialization** — `ERC1967Proxy` is deployed with the `initialize(...)` calldata passed into its constructor. There is no separate `.initialize()` call after the proxy is up, so there's no front-running window.
- **No plaintext keys** — `hardhat.config.ts` resolves all RPC URLs and accounts via `configVariable(...)` backed by `@nomicfoundation/hardhat-keystore`. There is no `process.env.PRIVATE_KEY` anywhere.
- **Per-network parameters** — addresses and constructor args are looked up in a `NETWORK_PARAMS` map (classic scripts) or via `m.getParameter` (Ignition). The deploy fails loudly if the current network isn't configured.

## Setup

```bash
npm install
```

Store secrets in the keystore (Hardhat 3):

```bash
npx hardhat keystore set SEPOLIA_RPC_URL
npx hardhat keystore set SEPOLIA_PRIVATE_KEY
```

## Build & test

```bash
forge build
forge test -vvv
npx hardhat compile
```

## Deploy

```bash
# classic scripts
npx hardhat run deploy/01_deploy_counter.ts --network hardhat
npx hardhat run deploy/02_deploy_counter_upgradeable.ts --network hardhat

# ignition
npx hardhat ignition deploy ignition/modules/Counter.ts --network hardhat
npx hardhat ignition deploy ignition/modules/CounterUpgradeable.ts --network hardhat
```

## Solace pre-criteria check

```bash
# 1. Solidity present
find . -name '*.sol' -not -path '*/node_modules/*' -not -path '*/lib/*' | head

# 2. TS in deployment partition
find . -type d \( -name deploy -o -name ignition \)

# 3b. Hardhat-style detected
ls hardhat.config.ts foundry.toml
```

All three should return non-empty results.
