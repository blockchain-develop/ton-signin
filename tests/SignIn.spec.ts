import { Blockchain, SandboxContract, TreasuryContract } from '@ton/sandbox';
import { Cell, toNano } from '@ton/core';
import { SignIn } from '../wrappers/SignIn';
import '@ton/test-utils';
import { compile } from '@ton/blueprint';

describe('SignIn', () => {
    let code: Cell;

    beforeAll(async () => {
        code = await compile('SignIn');
    });

    let blockchain: Blockchain;
    let deployer: SandboxContract<TreasuryContract>;
    let signIn: SandboxContract<SignIn>;

    beforeEach(async () => {
        blockchain = await Blockchain.create();

        signIn = blockchain.openContract(SignIn.createFromConfig({}, code));

        deployer = await blockchain.treasury('deployer');

        const deployResult = await signIn.sendDeploy(deployer.getSender(), toNano('0.05'));

        expect(deployResult.transactions).toHaveTransaction({
            from: deployer.address,
            to: signIn.address,
            deploy: true,
            success: true,
        });
    });

    it('should deploy', async () => {
        // the check is done inside beforeEach
        // blockchain and signIn are ready to use
    });
});
