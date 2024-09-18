import * as fs from "fs";
import { SignIn } from '../wrappers/SignIn';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient, Cell, WalletContractV4 } from '@ton/ton';
import { mnemonicToWalletKey } from "ton-crypto";

export async function run() {
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    console.log("endpoint: ", endpoint);
    const client = new TonClient({ endpoint });

    const counterCode = Cell.fromBoc(fs.readFileSync("build/sign_in.cell"))[0];
    const sign_in = SignIn.createForDeploy(counterCode);

    console.log("contract address: ", sign_in.address.toString());
    if (await client.isContractDeployed(sign_in.address)) {
        return console.log("sign in alread deployed");
    }

    const mnemonic = "best wild client roof marble core current property surface zebra have fortune neutral away wolf tag prize flavor garment tip era auction miss nothing";
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    if (!await client.isContractDeployed(wallet.address)) {
        return console.log("wallet is not deployed");
    }

    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);
    const seqno = await walletContract.getSeqno();

    const signInContract = client.open(sign_in);
    await signInContract.sendDeploy(walletSender);

    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("waiting for deploy transaction to confirm......");
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("deploy transaction confirmed!");
}

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
