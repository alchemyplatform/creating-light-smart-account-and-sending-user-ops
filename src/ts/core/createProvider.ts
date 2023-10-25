import {
  LightSmartContractAccount,
  getDefaultLightAccountFactory,
} from "@alchemy/aa-accounts";
import { AlchemyProvider } from "@alchemy/aa-alchemy";
import { WalletClientSigner } from "@alchemy/aa-core";
import * as dotenv from "dotenv";
import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
dotenv.config();

const PRIV_KEY = process.env.PRIV_KEY!;
const ALCHEMY_API_URL = process.env.ALCHEMY_API_URL!;

const ENTRYPOINT_ADDRESS = "0x5FF137D4b0FDCD49DcA30c7CF57E578a026d2789";

export default async function createProvider() {
  const chain = sepolia;
  const PRIVATE_KEY = PRIV_KEY; // Replace with the private key of your EOA that will be the owner of Light Account

  const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

  // This client can now be used to do things like `eth_requestAccounts`
  const client = createWalletClient({
    account,
    chain: sepolia,
    transport: http(),
  });

  // this can now be used as an owner for a Smart Contract Account
  const eoaSigner = new WalletClientSigner(
    client,
    "local" // signerType
  );

  // Create a provider with your EOA as the smart account owner, this provider is used to send user operations from your smart account and interact with the blockchain
  const provider = new AlchemyProvider({
    rpcUrl: ALCHEMY_API_URL, // or replace with your Alchemy API key, you can get one at https://dashboard.alchemy.com/
    chain,
    // Entrypoint address, you can use a different entrypoint if needed, check out https://docs.alchemy.com/reference/eth-supportedentrypoints for all the supported entrypoints
    entryPointAddress: ENTRYPOINT_ADDRESS,
  }).connect(
    (rpcClient) =>
      new LightSmartContractAccount({
        entryPointAddress: ENTRYPOINT_ADDRESS,
        chain: rpcClient.chain,
        owner: eoaSigner,
        factoryAddress: getDefaultLightAccountFactory(rpcClient.chain), // Default address for Light Account on Sepolia, you can replace it with your own.
        rpcClient,
      })
  );

  console.log(await provider.getAddress());

  return provider;
}
