import { toNano } from '@ton/core';
import { SignIn } from '../wrappers/SignIn';
import { compile, NetworkProvider } from '@ton/blueprint';

export async function run(provider: NetworkProvider) {
    const signIn = provider.open(SignIn.createFromConfig({}, await compile('SignIn')));

    await signIn.sendDeploy(provider.sender(), toNano('0.05'));

    await provider.waitForDeploy(signIn.address);

    // run methods on `signIn`
}
