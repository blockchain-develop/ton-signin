import { getHttpEndpoint } from "@orbs-network/ton-access";
import { mnemonicToWalletKey } from "ton-crypto";
import { TonClient, WalletContractV4, Address } from "@ton/ton";
import { SignIn } from "../wrappers/SignIn";


export async function run() {
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    const mnemonic = "best wild client roof marble core current property surface zebra have fortune neutral away wolf tag prize flavor garment tip era auction miss nothing";
    const key = await mnemonicToWalletKey(mnemonic.split(" "));
    const wallet = WalletContractV4.create({ publicKey: key.publicKey, workchain: 0 });
    if (!await client.isContractDeployed(wallet.address)) {
        return console.log("wallet is not deployed");
    }

    const walletContract = client.open(wallet);
    const walletSender = walletContract.sender(key.secretKey);
    const seqno = await walletContract.getSeqno();

    const signinAddress = Address.parse("EQCrqKdmgCc_XS-AxuNJWlh1oZKVkE1OVJqvv1qKlP2w2-Rz");
    const signin = new SignIn(signinAddress);
    const signinContract = client.open(signin);

    await signinContract.sendSignIn(walletSender, 123n, 1000000n);

    let currentSeqno = seqno;
    while (currentSeqno == seqno) {
        console.log("waiting for transaction to confirm...");
        await sleep(1500);
        currentSeqno = await walletContract.getSeqno();
    }
    console.log("transaction confirmed!");
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