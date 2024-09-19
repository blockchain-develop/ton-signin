# checkin

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx func-js contracts/check_in.fc --boc build/check_in.cell`

### Deploy

`npx ts-node ./scripts/deployCheckIn.ts`

### Use

`npx ts-node ./scripts/sendCheckIn.ts`

`npx ts-node ./scripts/getUserCheckIn.ts`

`npx ts-node ./scripts/checkUserCheckIn.ts`
