import * as fs from "fs";
import { CheckIn } from '../wrappers/CheckIn';
import { getHttpEndpoint } from '@orbs-network/ton-access';
import { TonClient, Cell, WalletContractV4 } from '@ton/ton';
import { mnemonicToWalletKey } from "ton-crypto";

export async function run() {
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    console.log("endpoint: ", endpoint);
    const client = new TonClient({ endpoint });

    const counterCode = Cell.fromBoc(fs.readFileSync("build/check_in.cell"))[0];
    const checkin = CheckIn.createForDeploy(counterCode);

    console.log("check in contract address: ", checkin.address.toString());
    if (await client.isContractDeployed(checkin.address)) {
        return console.log("check in alread deployed");
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

    const checkInContract = client.open(checkin);
    await checkInContract.sendDeploy(walletSender);

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
