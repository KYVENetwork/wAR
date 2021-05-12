import ArDB from "ardb";
import { GQLEdgeTransactionInterface } from "ardb/lib/faces/gql";
import Arweave from "arweave";
import { JWKInterface } from "arweave/node/lib/wallet";
import contract from "./wAR.json";
import Web3 from "web3";

require("dotenv").config();

const wallet: JWKInterface = JSON.parse(process.env.ARWEAVE!);

const client = new Arweave({
  host: "arweave.net",
  port: 443,
  protocol: "https",
});
const gql = new ArDB(client);
const ethClient = new Web3(process.env.PROVIDER!);

const wAR = new ethClient.eth.Contract(
  // @ts-ignore
  contract.abi,
  process.env.CONTRACT!
);

const arweaveServer = async (height?: number) => {
  const address = await client.wallets.getAddress(wallet);

  const latestHeight = (await client.network.getInfo()).height;
  if (!height) height = latestHeight;

  if (height !== latestHeight) {
    const txs = (await gql
      .search()
      .to(address)
      .min(height + 1)
      .max(latestHeight)
      .tag("Application", "wAR - DEV")
      .only(["id", "quantity", "quantity.winston", "tags"])
      .findAll()) as GQLEdgeTransactionInterface[];

    for (const { node } of txs) {
      const id = node.id;
      const userWallet = node.tags.find((tag) => tag.name === "Wallet");

      if (userWallet) {
        wAR.methods
          .mint(userWallet.value, node.quantity.winston)
          .send({
            from: ethClient.eth.accounts.privateKeyToAccount(
              process.env.ETHEREUM!
            ).address,
          })
          .on("transactionHash", (hash: string) =>
            console.log(`\nParsed deposit:\n  ${id}.\nSent tokens:\n  ${hash}.`)
          );
      }
    }
  }

  setTimeout(arweaveServer, 120000, latestHeight);
};

const ethereumServer = () => {
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
