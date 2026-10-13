"use client";

import { useEffect, useState } from "react";
import {
  getNetworkInfo,
  getAccount,
  createTestAccount,
  stellarExpertAccountUrl,
  type NetworkInfo,
  type AccountSummary,
} from "@/lib/stellar";
import { Loader2, Wifi, Sparkles, ExternalLink, Search } from "lucide-react";

export function StellarPanel({ reference }: { reference: string }) {
  const [net, setNet] = useState<NetworkInfo | null>(null);
  const [netErr, setNetErr] = useState<string | null>(null);

  const [address, setAddress] = useState("");
  const [account, setAccount] = useState<AccountSummary | null>(null);
  const [accErr, setAccErr] = useState<string | null>(null);
  const [loadingAcc, setLoadingAcc] = useState(false);

  const [creating, setCreating] = useState(false);

  // Lectura en vivo del estado de la red testnet
  useEffect(() => {
    getNetworkInfo()
      .then(setNet)
      .catch((e) => setNetErr(e?.message ?? "No se pudo conectar a Horizon."));
  }, []);

  async function lookup(addr?: string) {
    const target = (addr ?? address).trim();
    if (!target) return;
    setLoadingAcc(true);
    setAccErr(null);
    setAccount(null);
    try {
      const a = await getAccount(target);
      setAccount(a);
      setAddress(target);
    } catch {
      setAccErr("No se encontró la cuenta en testnet (verifica la clave pública).");
    } finally {
      setLoadingAcc(false);
    }
  }

  async function createAndFund() {
    setCreating(true);
    setAccErr(null);
    try {
      const res = await createTestAccount();
      setAddress(res.publicKey);
      setAccount(res.summary);
    } catch (e: any) {
      setAccErr(e?.message ?? "Friendbot falló. Intenta de nuevo.");
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="card">
      <div className="flex items-center gap-2">
        <Wifi size={18} style={{ color: "var(--accent-hover)" }} />
        <h3 className="font-semibold">Verificación on-chain · Stellar testnet</h3>
      </div>
      <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
        Lectura en vivo de la red de pruebas. El memo <b>{reference}</b> es la
        referencia única que viajaría en la transacción del pago.
      </p>

      {/* Estado de la red */}
      <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: "var(--bg-2)" }}>
        {netErr ? (
          <span style={{ color: "var(--error)" }}>⚠ {netErr}</span>
        ) : !net ? (
          <span className="flex items-center gap-2" style={{ color: "var(--text-2)" }}>
            <Loader2 size={14} className="animate-spin" /> Conectando a Horizon testnet…
          </span>
        ) : (
          <div className="grid grid-cols-2 gap-y-1 sm:grid-cols-3">
            <Info label="Red" value="TESTNET" ok />
            <Info label="Último ledger" value={net.latestLedger.toLocaleString()} />
            <Info label="Horizon" value={net.horizonVersion?.split("-")[0] ?? "—"} />
          </div>
        )}
      </div>

      {/* Buscar cuenta / crear con Friendbot */}
      <div className="mt-4 flex flex-col gap-2 sm:flex-row">
        <input
          className="input"
          placeholder="Clave pública (G...) para consultar en testnet"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && lookup()}
        />
        <button onClick={() => lookup()} className="btn btn-ghost whitespace-nowrap" disabled={loadingAcc}>
          {loadingAcc ? <Loader2 size={15} className="animate-spin" /> : <Search size={15} />} Consultar
        </button>
      </div>
      <button onClick={createAndFund} className="btn btn-primary mt-2 w-full" disabled={creating}>
        {creating ? <Loader2 size={15} className="animate-spin" /> : <Sparkles size={15} />}
        Crear cuenta de prueba (Friendbot)
      </button>

      {accErr && (
        <p className="mt-2 text-sm" style={{ color: "var(--error)" }}>
          {accErr}
        </p>
      )}

      {account && (
        <div className="mt-4 rounded-xl border p-3" style={{ borderColor: "var(--border)" }}>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
              Cuenta on-chain
            </span>
            <a
              href={stellarExpertAccountUrl(account.id)}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1 text-xs underline-offset-2 hover:underline"
              style={{ color: "var(--accent-hover)" }}
            >
              Ver en Stellar.Expert <ExternalLink size={12} />
            </a>
          </div>
          <code className="block break-all text-xs" style={{ color: "var(--text-2)" }}>
            {account.id}
          </code>
          <div className="mt-2 space-y-1">
            {account.balances.map((b, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span style={{ color: "var(--text-2)" }}>{b.asset}</span>
                <span className="font-semibold">{Number(b.balance).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Info({ label, value, ok }: { label: string; value: string; ok?: boolean }) {
  return (
    <div>
      <div className="text-xs" style={{ color: "var(--text-3)" }}>
        {label}
      </div>
      <div className="font-semibold" style={ok ? { color: "var(--success)" } : undefined}>
        {value}
      </div>
    </div>
  );
}
