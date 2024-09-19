import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import { CheckIn } from "../wrappers/CheckIn";

export async function run() {
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    const checinAddress = Address.parse("EQAs_EadsWk2-giRLkOkQwy5uO9GXVBLO3xfxuuo1QCRScEW");
    const checkin = new CheckIn(checinAddress);
    const checkinContract = client.open(checkin);

    const checkinValue = await checkinContract.getUserCheckInState(1000000n);
    console.log("value: ", checkinValue.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});