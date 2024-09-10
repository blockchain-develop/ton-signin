import { getHttpEndpoint } from "@orbs-network/ton-access";
import { TonClient, Address } from "@ton/ton";
import { SignIn } from "../wrappers/SignIn";

export async function run() {
    const endpoint = await getHttpEndpoint({ network: "testnet" });
    const client = new TonClient({ endpoint });

    const signinAddress = Address.parse("EQBoxUtva6QgYGfksrrJEECQ_bZ1ZwOLSzyLR1K4shmMfxIX");
    const signin = new SignIn(signinAddress);
    const signinContract = client.open(signin);

    const signinValue = await signinContract.getUserSignIn(10000n);
    console.log("value: ", signinValue.toString());
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
run().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});