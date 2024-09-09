import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export type SignInConfig = {};

export function signInConfigToCell(config: SignInConfig): Cell {
    return beginCell().endCell();
}

export class SignIn implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) {}

    static createFromAddress(address: Address) {
        return new SignIn(address);
    }

    static createFromConfig(config: SignInConfig, code: Cell, workchain = 0) {
        const data = signInConfigToCell(config);
        const init = { code, data };
        return new SignIn(contractAddress(workchain, init), init);
    }

    async sendDeploy(provider: ContractProvider, via: Sender, value: bigint) {
        await provider.internal(via, {
            value,
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: beginCell().endCell(),
        });
    }
}
