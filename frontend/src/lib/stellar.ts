// Capa de Stellar TESTNET (Horizon).
// Este proyecto usa ÚNICAMENTE la red de pruebas (testnet).

import {
  Asset,
  BASE_FEE,
  Horizon,
  Keypair,
  Memo,
  Networks,
  Operation,
  StrKey,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

const HORIZON_URL =
  process.env.NEXT_PUBLIC_HORIZON_URL ?? "https://horizon-testnet.stellar.org";
const FRIENDBOT_URL =
  process.env.NEXT_PUBLIC_FRIENDBOT_URL ?? "https://friendbot.stellar.org";

export const server = new Horizon.Server(HORIZON_URL);

/** Límite de Stellar para memos de texto. */
const MEMO_TEXT_MAX_BYTES = 28;

export interface NetworkInfo {
  horizonVersion: string;
  coreVersion: string;
  latestLedger: number;
  network: string;
  baseFee: number;
}

/** Lee el estado de la red testnet (prueba de conexión en vivo). */
export async function getNetworkInfo(): Promise<NetworkInfo> {
  const [root, fee] = await Promise.all([server.root(), server.feeStats()]);
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

export function isValidAddress(address: string): boolean {
  return StrKey.isValidEd25519PublicKey(address.trim());
}

/** Dirección nueva para un colaborador de prueba; el pago crea la cuenta al llegar. */
export function randomTestAddress(): string {
  return Keypair.random().publicKey();
}

/** Consulta una cuenta en testnet. Devuelve null si la cuenta no existe. */
export async function getAccount(publicKey: string): Promise<AccountSummary | null> {
  try {
    const acc = await server.loadAccount(publicKey.trim());
    return {
      id: acc.account_id,
      subentryCount: acc.subentry_count,
      balances: acc.balances.map((b: any) => ({
        asset: b.asset_type === "native" ? "XLM" : b.asset_code ?? b.asset_type,
        balance: b.balance,
      })),
    };
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

export function xlmBalance(account: AccountSummary | null): number {
  const native = account?.balances.find((b) => b.asset === "XLM");
  return native ? Number(native.balance) : 0;
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

/** Consulta una transacción por su hash. Devuelve null si la red aún no la registra. */
export async function getTransaction(hash: string): Promise<TxSummary | null> {
  try {
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
  } catch (e) {
    if (isNotFound(e)) return null;
    throw e;
  }
}

async function friendbot(publicKey: string): Promise<void> {
  const res = await fetch(`${FRIENDBOT_URL}?addr=${encodeURIComponent(publicKey)}`);
  if (!res.ok) throw new Error("Friendbot no pudo financiar la cuenta. Intenta de nuevo.");
}

// ── Cuenta de la empresa (origen de los pagos) ──
// La llave secreta se guarda en este navegador: válido solo porque es testnet.

const COMPANY_KEY = "handlefi.company.v1";

export interface CompanyAccount {
  publicKey: string;
  secretKey: string;
}

export function getCompanyAccount(): CompanyAccount | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(COMPANY_KEY);
    return raw ? (JSON.parse(raw) as CompanyAccount) : null;
  } catch {
    return null;
  }
}

/** Crea la cuenta de la empresa y la financia con Friendbot (10,000 XLM de prueba). */
export async function createCompanyAccount(): Promise<CompanyAccount> {
  const kp = Keypair.random();
  await friendbot(kp.publicKey());
  const account = { publicKey: kp.publicKey(), secretKey: kp.secret() };
  window.localStorage.setItem(COMPANY_KEY, JSON.stringify(account));
  return account;
}

/**
 * Recarga la cuenta de la empresa: Friendbot solo financia cuentas nuevas, así que
 * se financia una cuenta temporal y se fusiona (accountMerge) con la de la empresa.
 */
export async function topUpCompanyAccount(company: CompanyAccount): Promise<void> {
  const temp = Keypair.random();
  await friendbot(temp.publicKey());
  const source = await server.loadAccount(temp.publicKey());
  const tx = new TransactionBuilder(source, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET })
    .addOperation(Operation.accountMerge({ destination: company.publicKey }))
    .setTimeout(60)
    .build();
  tx.sign(temp);
  await submit(tx);
}

// ── Ejecución del pago ──

export interface SendPaymentInput {
  company: CompanyAccount;
  destination: string;
  amountXLM: string;
  memo: string;
  /** Se llama con el hash antes de enviar, para poder verificarlo aunque se recargue la página. */
  onSigned?: (hash: string) => void;
}

/**
 * Envía el pago a testnet con la referencia en el memo. Si la cuenta destino aún no
 * existe, la crea con el monto del pago (createAccount) en la misma transacción.
 */
export async function sendPayment(input: SendPaymentInput): Promise<string> {
  const { company, destination, amountXLM, memo } = input;
  if (!isValidAddress(destination)) throw new Error("La cuenta del colaborador no es válida.");
  if (destination === company.publicKey) {
    throw new Error("La cuenta del colaborador no puede ser la de la empresa.");
  }
  if (new TextEncoder().encode(memo).length > MEMO_TEXT_MAX_BYTES) {
    throw new Error(`La referencia excede ${MEMO_TEXT_MAX_BYTES} bytes y no cabe en el memo.`);
  }

  const [source, destinationAccount] = await Promise.all([
    server.loadAccount(company.publicKey),
    getAccount(destination),
  ]);

  const operation = destinationAccount
    ? Operation.payment({ destination, asset: Asset.native(), amount: amountXLM })
    : Operation.createAccount({ destination, startingBalance: amountXLM });

  const tx = new TransactionBuilder(source, { fee: BASE_FEE, networkPassphrase: Networks.TESTNET })
    .addOperation(operation)
    .addMemo(Memo.text(memo))
    .setTimeout(120)
    .build();
  tx.sign(Keypair.fromSecret(company.secretKey));

  const hash = tx.hash().toString("hex");
  input.onSigned?.(hash);
  await submit(tx);
  return hash;
}

async function submit(tx: Parameters<Horizon.Server["submitTransaction"]>[0]) {
  try {
    return await server.submitTransaction(tx);
  } catch (e) {
    throw new Error(describeSubmitError(e));
  }
}

/** Errores que no significan que la transacción falló: la red puede seguir procesándola. */
export function isPendingSubmitError(message: string): boolean {
  return message.startsWith(PENDING_PREFIX);
}

const PENDING_PREFIX = "Sin respuesta de la red";

function describeSubmitError(e: any): string {
  const status = e?.response?.status;
  if (status === 504 || e?.code === "ECONNABORTED") {
    return `${PENDING_PREFIX}; la transacción puede seguir en proceso.`;
  }
  const codes = e?.response?.data?.extras?.result_codes;
  if (codes) {
    const ops: string[] = codes.operations ?? [];
    if (ops.includes("op_underfunded")) return "Saldo insuficiente en la cuenta de la empresa. Recárgala e intenta de nuevo.";
    if (ops.includes("op_low_reserve")) return "El monto no alcanza la reserva mínima de Stellar (1 XLM) para crear la cuenta destino.";
    if (codes.transaction === "tx_bad_seq") return "Conflicto de secuencia en la cuenta de la empresa. Intenta de nuevo.";
    return `La red rechazó la transacción (${[codes.transaction, ...ops].filter(Boolean).join(", ")}).`;
  }
  return e?.message ?? "No se pudo enviar la transacción.";
}

function isNotFound(e: any): boolean {
  return e?.response?.status === 404 || e?.name === "NotFoundError";
}

export function stellarExpertAccountUrl(publicKey: string): string {
  return `https://stellar.expert/explorer/testnet/account/${publicKey}`;
}
export function stellarExpertTxUrl(hash: string): string {
  return `https://stellar.expert/explorer/testnet/tx/${hash}`;
}
