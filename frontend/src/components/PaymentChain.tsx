"use client";

import { useEffect, useState } from "react";
import {
  getTransaction,
  isPendingSubmitError,
  isValidAddress,
  randomTestAddress,
  sendPayment,
  stellarExpertAccountUrl,
  stellarExpertTxUrl,
  type CompanyAccount,
  type TxSummary,
} from "@/lib/stellar";
import { getById, markConfirmed, markFailed, markSent, setDestination } from "@/lib/store";
import type { Payment } from "@/lib/types";
import { CheckCircle2, ExternalLink, Loader2, RefreshCw, Send, Shuffle, XCircle } from "lucide-react";

const POLL_INTERVAL_MS = 3000;
const POLL_MAX_ATTEMPTS = 20;

export function PaymentChain({
  payment,
  ensureCompany,
  onBalanceChange,
}: {
  payment: Payment;
  ensureCompany: () => Promise<CompanyAccount>;
  onBalanceChange: () => void;
}) {
  const [destination, setDest] = useState(payment.destination ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [waitingTimedOut, setWaitingTimedOut] = useState(false);
  const [pollNonce, setPollNonce] = useState(0);
  const [onchain, setOnchain] = useState<TxSummary | null>(null);

  const hash = payment.stellarTxHash;

  // Mientras el pago está "enviado", se consulta Horizon hasta que la red lo registre.
  useEffect(() => {
    if (payment.status !== "enviado" || !hash) return;
    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;
    let attempts = 0;
    setWaitingTimedOut(false);

    const tick = async () => {
      attempts++;
      try {
        const tx = await getTransaction(hash);
        if (cancelled) return;
        if (tx) {
          if (tx.successful) markConfirmed(payment.id, tx.ledger, tx.createdAt);
          else markFailed(payment.id, "La transacción quedó registrada como no exitosa en la red.");
          onBalanceChange();
          return;
        }
      } catch {
        /* error temporal de red: se reintenta */
      }
      if (cancelled) return;
      if (attempts >= POLL_MAX_ATTEMPTS) {
        setWaitingTimedOut(true);
        return;
      }
      timer = setTimeout(tick, POLL_INTERVAL_MS);
    };

    tick();
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [payment.id, payment.status, hash, pollNonce, onBalanceChange]);

  // Una vez confirmado, se lee la transacción de la red para verificar el memo.
  useEffect(() => {
    if (payment.status !== "confirmado" || !hash) return;
    let cancelled = false;
    getTransaction(hash)
      .then((tx) => !cancelled && setOnchain(tx))
      .catch(() => !cancelled && setOnchain(null));
    return () => {
      cancelled = true;
    };
  }, [payment.status, hash]);

  async function execute() {
    const target = destination.trim();
    setBusy(true);
    setError(null);
    try {
      const company = await ensureCompany();
      setDestination(payment.id, target);
      const sentHash = await sendPayment({
        company,
        destination: target,
        amountXLM: payment.cost.amountXLM,
        memo: payment.reference,
        onSigned: (h) => markSent(payment.id, h),
      });
      const tx = await getTransaction(sentHash);
      if (tx?.successful) markConfirmed(payment.id, tx.ledger, tx.createdAt);
      onBalanceChange();
    } catch (e: any) {
      const message: string = e?.message ?? "No se pudo ejecutar el pago.";
      if (isPendingSubmitError(message)) {
        setError(message);
      } else if (getById(payment.id)?.status === "enviado") {
        markFailed(payment.id, message);
      } else {
        setError(message);
      }
    } finally {
      setBusy(false);
    }
  }

  if (payment.status === "pendiente_autorizacion" || payment.status === "rechazado") {
    return (
      <div className="card">
        <h3 className="font-semibold">Ejecución en Stellar testnet</h3>
        <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
          {payment.status === "rechazado"
            ? "El pago fue rechazado; no se enviará a la red."
            : "El pago se podrá enviar a la red cuando el administrador lo autorice."}
        </p>
      </div>
    );
  }

  const canExecute = payment.status === "autorizado" || payment.status === "fallido";
  const validDest = isValidAddress(destination);

  return (
    <div className="card">
      <h3 className="font-semibold">Ejecución en Stellar testnet</h3>
      <div className="mt-3 space-y-1 text-sm">
        <Row label="Monto en la red" value={`${payment.cost.amountXLM} XLM`} />
        <Row label="Memo" value={payment.reference} mono />
      </div>

      {canExecute && (
        <div className="mt-4">
          {payment.status === "fallido" && payment.txError && (
            <div
              className="mb-3 flex items-start gap-2 rounded-xl p-3 text-sm"
              style={{ background: "#fbeaea", color: "#8f2f2f" }}
            >
              <XCircle size={16} className="mt-0.5 shrink-0" />
              <span>{payment.txError}</span>
            </div>
          )}
          <label className="label">Cuenta Stellar del colaborador</label>
          <input
            className="input"
            placeholder="G..."
            value={destination}
            onChange={(e) => setDest(e.target.value)}
            disabled={busy}
          />
          {destination.trim() !== "" && !validDest && (
            <p className="mt-1 text-xs" style={{ color: "var(--error)" }}>
              No es una clave pública de Stellar válida.
            </p>
          )}
          <button
            onClick={() => setDest(randomTestAddress())}
            className="mt-2 flex items-center gap-1.5 text-xs underline-offset-2 hover:underline"
            style={{ color: "var(--accent-hover)" }}
            disabled={busy}
          >
            <Shuffle size={12} /> Generar dirección de prueba (la cuenta se crea con el pago)
          </button>
          <button
            onClick={execute}
            className="btn btn-primary mt-4 w-full"
            disabled={busy || !validDest}
            style={busy || !validDest ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
          >
            {busy ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
            {payment.status === "fallido" ? "Reintentar pago en testnet" : "Ejecutar pago en testnet"}
          </button>
        </div>
      )}

      {payment.status === "enviado" && (
        <div className="mt-4 rounded-xl p-3 text-sm" style={{ background: "var(--bg-2)" }}>
          {waitingTimedOut ? (
            <div>
              <p style={{ color: "var(--text-2)" }}>
                La red todavía no registra la transacción. Puede tardar o haber expirado.
              </p>
              <button onClick={() => setPollNonce((n) => n + 1)} className="btn btn-ghost mt-2">
                <RefreshCw size={14} /> Verificar de nuevo
              </button>
            </div>
          ) : (
            <span className="flex items-center gap-2" style={{ color: "var(--text-2)" }}>
              <Loader2 size={14} className="animate-spin" /> Esperando confirmación de la red…
            </span>
          )}
        </div>
      )}

      {payment.status === "confirmado" && (
        <div className="mt-4 rounded-xl border p-3 text-sm" style={{ borderColor: "var(--border)" }}>
          <div className="flex items-center gap-2 font-semibold" style={{ color: "var(--success)" }}>
            <CheckCircle2 size={16} /> Confirmado en el ledger {payment.ledger?.toLocaleString()}
          </div>
          {onchain && (
            <p className="mt-2 text-xs" style={{ color: onchain.memo === payment.reference ? "var(--success)" : "var(--error)" }}>
              {onchain.memo === payment.reference
                ? `El memo leído de la red coincide con la referencia ${payment.reference}.`
                : `El memo en la red (${onchain.memo ?? "vacío"}) no coincide con la referencia.`}
            </p>
          )}
          {payment.destination && (
            <a
              href={stellarExpertAccountUrl(payment.destination)}
              target="_blank"
              rel="noreferrer"
              className="mt-2 flex items-center gap-1 text-xs underline-offset-2 hover:underline"
              style={{ color: "var(--accent-hover)" }}
            >
              Cuenta del colaborador <ExternalLink size={12} />
            </a>
          )}
        </div>
      )}

      {hash && (
        <div className="mt-3">
          <div className="text-xs" style={{ color: "var(--text-3)" }}>
            Hash de la transacción
          </div>
          <a
            href={stellarExpertTxUrl(hash)}
            target="_blank"
            rel="noreferrer"
            className="mt-0.5 flex items-start gap-1 break-all text-xs underline-offset-2 hover:underline"
            style={{ color: "var(--accent-hover)" }}
          >
            <span>{hash}</span> <ExternalLink size={12} className="mt-0.5 shrink-0" />
          </a>
        </div>
      )}

      {error && (
        <p className="mt-3 text-sm" style={{ color: "var(--error)" }}>
          {error}
        </p>
      )}
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span style={{ color: "var(--text-2)" }}>{label}</span>
      <span className={mono ? "font-mono font-semibold" : "font-semibold"}>{value}</span>
    </div>
  );
}
