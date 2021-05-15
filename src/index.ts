import ArDB from "ardb";
import { GQLEdgeTransactionInterface } from "ardb/lib/faces/gql";
import Arweave from "arweave";
import { JWKInterface } from "arweave/node/lib/wallet";
import contract from "./wAR.json";
import Web3 from "web3";
import { getFee, selectTokenHolder } from "./helpers";

require("dotenv").config();

const wallet: JWKInterface = JSON.parse(process.env.ARWEAVE!);

const client = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});
const gql = new ArDB(client);
const ethClient = new Web3(process.env.PROVIDER!);
const account = ethClient.eth.accounts.privateKeyToAccount(
  process.env.ETHEREUM!
);

const wAR = new ethClient.eth.Contract(
  // @ts-ignore
  contract.abi,
  process.env.CONTRACT!
);

const sendTip = async (winstonAmount: string) => {
  const PSC_CONTRACT_ID = "KJ3m8ldGqZwo1wnJuKGasnWQlLTqDdJoH0Ell224grs";

  const FEE = await getFee(client, PSC_CONTRACT_ID);
  const target = await selectTokenHolder(client, PSC_CONTRACT_ID);

  const tipAmount = Math.floor(parseInt(winstonAmount) * FEE);

  const transaction = await client.createTransaction({
    quantity: tipAmount.toString(),
    target,
  });

  transaction.addTag("Application", "wAR - DEV");
  transaction.addTag("Action", "Fee");

  await client.transactions.sign(transaction, wallet);
  await client.transactions.post(transaction);
  return transaction.id;
};

const arweaveServer = async (height?: number) => {
  const address = await client.wallets.getAddress(wallet);

  const latestHeight = (await client.network.getInfo()).height;
  if (!height) height = latestHeight;

  // Check if there are new blocks.
  if (height !== latestHeight) {
    // Fetch all new mined deposits sent to the bridge.
    const txs = (await gql
      .search()
      .to(address)
      .min(height + 1)
      .max(latestHeight)
      .tag("Application", "wAR - DEV")
      .only(["id", "quantity", "quantity.winston", "tags"])
      .findAll()) as GQLEdgeTransactionInterface[];

    if (txs.length) console.log(`\nFetched ${txs.length} new deposits ...`);

    // For each transaction received, get the ETH wallet and
    // mint new $wAR tokens on the ERC20 contract.
    for (const { node } of txs) {
      const id = node.id;
      const userWallet = node.tags.find((tag) => tag.name === "Wallet");

      if (userWallet) {
        const amount = node.quantity.winston;
        sendTip(amount).then((txID) => {
          console.log(`\nTipped the community:\n  ${txID}.`);
        });

        const func = wAR.methods.mint(userWallet.value, amount);
        const gas = await func.estimateGas({ from: account.address });
        const data = func.encodeABI();

        const res = await account.signTransaction({
          to: process.env.CONTRACT!,
          data,
          gas,
        });

        ethClient.eth
          .sendSignedTransaction(res.rawTransaction!)
          .on("transactionHash", (hash: string) =>
            console.log(`\nParsed deposit:\n  ${id}.\nSent tokens:\n  ${hash}.`)
          );
      }
    }
  }

  setTimeout(arweaveServer, 120000, latestHeight);
};

const ethereumServer = () => {
  // Watch for a burn event to be emitted, and create an Arweave transaction
  // that sends the amount of $wAR burned in $AR to the specified address.
  wAR.events.Burn().on("data", async (res: any) => {
    const values = res.returnValues;

    const transaction = await client.createTransaction({
      quantity: values.amount,
      target: values.wallet,
    });

    transaction.addTag("Application", "wAR - DEV");
    transaction.addTag("Transaction", res.transactionHash);
    transaction.addTag("Wallet", values.sender);

    await client.transactions.sign(transaction, wallet);
    await client.transactions.post(transaction);

    console.log(
      `\nParsed burn:\n  ${res.transactionHash}.\nSent tokens:\n  ${transaction.id}.`
    );
  });
};

arweaveServer();
ethereumServer();
