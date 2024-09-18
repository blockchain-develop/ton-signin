# signin

## Project structure

-   `contracts` - source code of all the smart contracts of the project and their dependencies.
-   `wrappers` - wrapper classes (implementing `Contract` from ton-core) for the contracts, including any [de]serialization primitives and compilation functions.
-   `tests` - tests for the contracts.
-   `scripts` - scripts used by the project, mainly the deployment scripts.

## How to use

### Build

`npx func-js contracts/sign_in.fc --boc build/sign_in.cell`

### Deploy or run another script

`npx ts-node ./scripts/deploySignin.ts`

### Use

`npx ts-node ./scripts/sendSignIn.ts`

`npx ts-node ./scripts/getUserSignIn.ts`

`npx ts-node ./scripts/checkUserSignIn.ts `
