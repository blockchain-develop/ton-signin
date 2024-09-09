import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export class SignIn implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: "0.01",
            bounce: false,
        });
    }

    static createForDeploy(code: Cell, iniitalCounterValue: number): SignIn {
        const data = beginCell().storeUint(iniitalCounterValue, 64).endCell();
        const workchain = 0;
        const address = contractAddress(workchain, { code, data });
        return new SignIn(address, { code, data });
    }

    async getCounter(provider: ContractProvider) {
        const { stack } = await provider.get("counter", []);
        return stack.readBigNumber();
    }

    async sendIncrement(provider: ContractProvider, via: Sender) {
        const messageBoby = beginCell().storeUint(1, 32).storeUint(0, 64).endCell();
        await provider.internal(via, {
            value: "0.002",
            body: messageBoby
        });
    }
}
