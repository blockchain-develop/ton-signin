import { Address, beginCell, Cell, Contract, contractAddress, ContractProvider, Sender, SendMode } from '@ton/core';

export class SignIn implements Contract {
    constructor(readonly address: Address, readonly init?: { code: Cell; data: Cell }) { }

    async sendDeploy(provider: ContractProvider, via: Sender) {
        await provider.internal(via, {
            value: "0.01",
            bounce: false,
        });
    }

    static createForDeploy(code: Cell): SignIn {
        const data = beginCell().endCell();
        const workchain = 0;
        const address = contractAddress(workchain, { code, data });
        return new SignIn(address, { code, data });
    }

    async getUserSignInState(provider: ContractProvider, key: bigint) {
        const { stack } = await provider.get("get_user_signin", [{ type: "int", value: key }]);
        return [stack.readBigNumber(), stack.readBigNumber()];
    }

    async getUserSignInHistory(provider: ContractProvider, key: bigint, day: bigint) {
        const { stack } = await provider.get("check_user_signin", [{ type: "int", value: key }, { type: "int", value: day }]);
        return [stack.readBigNumber()];
    }

    async sendSignIn(provider: ContractProvider, via: Sender, query_id: bigint, key: bigint) {
        const messageBoby = beginCell().storeUint(1, 32).storeUint(query_id, 64).storeUint(key, 256).endCell();
        await provider.internal(via, {
            value: "0.004",
            sendMode: SendMode.PAY_GAS_SEPARATELY,
            body: messageBoby
        });
    }
}
