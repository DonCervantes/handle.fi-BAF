// Capa de lectura de Stellar TESTNET (Horizon).
// Este proyecto usa ÚNICAMENTE la red de pruebas (testnet).

import { Horizon, Keypair } from "@stellar/stellar-sdk";

const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ?? "https://horizon-testnet.stellar.org";
const FRIENDBOT_URL =
  process.env.NEXT_PUBLIC_FRIENDBOT_URL ?? "https://friendbot.stellar.org";

export const server = new Horizon.Server(HORIZON_URL);

export interface NetworkInfo {
  horizonVersion: string;
  coreVersion: string;
  latestLedger: number;
  network: string;
  baseFee: number;
}

/** Lee el estado de la red testnet (prueba de conexión en vivo). */
export async function getNetworkInfo(): Promise<NetworkInfo> {
  const [root, fee] = await Promise.all([
    server.root(),
    server.feeStats(),
  ]);
  return {
    horizonVersion: (root as any).horizon_version,
    coreVersion: (root as any).core_version,
    latestLedger: (root as any).history_latest_ledger,
    network: (root as any).network_passphrase,
    baseFee: Number(fee.last_ledger_base_fee),
  };
}

export interface AccountSummary {
  id: string;
  balances: { asset: string; balance: string }[];
  subentryCount: number;
}

/** Consulta una cuenta en testnet (Historia: verificación on-chain). */
export async function getAccount(publicKey: string): Promise<AccountSummary> {
  const acc = await server.loadAccount(publicKey.trim());
  return {
    id: acc.account_id,
    subentryCount: acc.subentry_count,
    balances: acc.balances.map((b: any) => ({
      asset: b.asset_type === "native" ? "XLM" : b.asset_code ?? b.asset_type,
      balance: b.balance,
    })),
  };
}

export interface TxSummary {
  hash: string;
  ledger: number;
  createdAt: string;
  successful: boolean;
  memo?: string;
  sourceAccount: string;
  feeCharged: string;
}

/** Consulta una transacción en testnet por su hash (verifica estado + memo). */
export async function getTransaction(hash: string): Promise<TxSummary> {
  const tx = await server.transactions().transaction(hash.trim()).call();
  return {
    hash: tx.hash,
    ledger: tx.ledger_attr,
    createdAt: tx.created_at,
    successful: tx.successful,
    memo: (tx as any).memo,
    sourceAccount: tx.source_account,
    feeCharged: String(tx.fee_charged),
  };
}

export interface NewTestAccount {
  publicKey: string;
  secretKey: string;
  summary: AccountSummary;
}

/**
 * Crea y FINANCIA una cuenta de prueba en testnet usando Friendbot,
 * luego lee su saldo on-chain. Demuestra lectura/escritura en testnet.
 */
export async function createTestAccount(): Promise<NewTestAccount> {
  const kp = Keypair.random();
  const res = await fetch(
    `${FRIENDBOT_URL}?addr=${encodeURIComponent(kp.publicKey())}`
  );
  if (!res.ok) {
    throw new Error("Friendbot no pudo financiar la cuenta.");
  }
  const summary = await getAccount(kp.publicKey());
  return {
    publicKey: kp.publicKey(),
    secretKey: kp.secret(),
    summary,
  };
}

export function stellarExpertAccountUrl(publicKey: string): string {
  return `https://stellar.expert/explorer/testnet/account/${publicKey}`;
}
export function stellarExpertTxUrl(hash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}
