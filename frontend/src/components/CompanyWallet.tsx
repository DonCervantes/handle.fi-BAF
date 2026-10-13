"use client";

import { useEffect, useState } from "react";
import {
  getAccount,
  getNetworkInfo,
  stellarExpertAccountUrl,
  topUpCompanyAccount,
  xlmBalance,
  type CompanyAccount,
  type NetworkInfo,
} from "@/lib/stellar";
import { ExternalLink, Loader2, RefreshCw, Sparkles, Wallet, Wifi } from "lucide-react";

export function CompanyWallet({
  company,
  onCreate,
  refreshKey,
}: {
  company: CompanyAccount | null;
  onCreate: () => Promise<unknown>;
  refreshKey: number;
}) {
  const [net, setNet] = useState<NetworkInfo | null>(null);
  const [netErr, setNetErr] = useState<string | null>(null);
  const [balance, setBalance] = useState<number | null>(null);
  const [busy, setBusy] = useState<"create" | "topup" | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    getNetworkInfo()
      .then(setNet)
      .catch((e) => setNetErr(e?.message ?? "No se pudo conectar a Horizon."));
  }, []);

  useEffect(() => {
    if (!company) return;
    let cancelled = false;
    setBalance(null);
    getAccount(company.publicKey)
      .then((acc) => !cancelled && setBalance(xlmBalance(acc)))
      .catch(() => !cancelled && setError("No se pudo leer el saldo de la cuenta."));
    return () => {
      cancelled = true;
    };
  }, [company, refreshKey, nonce]);

  async function run(kind: "create" | "topup", fn: () => Promise<unknown>) {
    setBusy(kind);
    setError(null);
    try {
      await fn();
      setNonce((n) => n + 1);
    } catch (e: any) {
      setError(e?.message ?? "La operación falló. Intenta de nuevo.");
    } finally {
      setBusy(null);
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2">
        <Wallet size={18} style={{ color: "var(--accent-hover)" }} />
        <h3 className="font-semibold">Cuenta de la empresa · testnet</h3>
      </div>
      <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
        Origen de los pagos. Es una cuenta de prueba: su llave se guarda en este navegador.
      </p>

      <div className="mt-3 flex items-center gap-2 text-xs" style={{ color: "var(--text-3)" }}>
        <Wifi size={13} />
        {netErr ? (
          <span style={{ color: "var(--error)" }}>{netErr}</span>
        ) : net ? (
          <span>
            Horizon testnet conectado · ledger {net.latestLedger.toLocaleString()}
          </span>
        ) : (
          <span>Conectando a Horizon testnet…</span>
        )}
      </div>

      {!company ? (
        <button
          onClick={() => run("create", onCreate)}
          className="btn btn-primary mt-4 w-full"
          disabled={busy !== null}
        >
          {busy === "create" ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
          Crear cuenta de la empresa (Friendbot)
        </button>
      ) : (
        <div className="mt-4 rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
              Saldo
            </span>
            <a
              href={stellarExpertAccountUrl(company.publicKey)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs underline-offset-2 hover:underline"
              style={{ color: "var(--accent-hover)" }}
            >
              Ver en Stellar.Expert <ExternalLink size={12} />
            </a>
          </div>
          <div className="mt-1 text-2xl font-bold">
            {balance === null ? "…" : `${balance.toLocaleString("es-MX", { maximumFractionDigits: 2 })} XLM`}
          </div>
          <code className="mt-1 block break-all text-xs" style={{ color: "var(--text-2)" }}>
            {company.publicKey}
          </code>
          <button
            onClick={() => run("topup", () => topUpCompanyAccount(company))}
            className="btn btn-ghost mt-3 w-full"
            disabled={busy !== null}
          >
            {busy === "topup" ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            Recargar 10,000 XLM de prueba
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}
    </div>
  );
}
