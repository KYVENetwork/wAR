import { readContract } from "smartweave";

const weightedRandom = (dict: Record<string, number>): string | undefined => {
  let sum = 0;
  const r = Math.random();

  for (const addr of Object.keys(dict)) {
    sum += dict[addr];
    if (r <= sum && dict[addr] > 0) {
      return addr;
    }
  }

  return;
};

export const selectTokenHolder = async (
  client: any,
  PSC_CONTRACT_ID: string
): Promise<string> => {
  const state = await readContract(client, PSC_CONTRACT_ID);
  const balances = state.balances;
  const vault = state.vault;

  let total = 0;
  for (const addr of Object.keys(balances)) {
    total += balances[addr];
  }

  for (const addr of Object.keys(vault)) {
    if (!vault[addr].length) continue;

    const vaultBalance = vault[addr]
      .map((a: { balance: number; start: number; end: number }) => a.balance)
      .reduce((a: number, b: number) => a + b, 0);

    total += vaultBalance;

    if (addr in balances) {
      balances[addr] += vaultBalance;
    } else {
      balances[addr] = vaultBalance;
    }
  }

  const weighted: { [addr: string]: number } = {};
  for (const addr of Object.keys(balances)) {
    weighted[addr] = balances[addr] / total;
  }

  return weightedRandom(weighted)!;
};

export const getFee = async (
  client: any,
  PSC_CONTRACT_ID: string
): Promise<number> => {
  const DEFAULT_FEE = 0.001;

  const contract = await readContract(client, PSC_CONTRACT_ID);

  const fee = contract.settings.find(
    (setting: (string | number)[]) =>
      setting[0].toString().toLowerCase() === "fee"
  );

  return fee ? fee[1] : DEFAULT_FEE;
};
