"use client";

import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { attachReceipt, authorize, usePayment } from "@/lib/store";
import { COUNTRIES, fmtMXN, fmtLocal } from "@/lib/pricing";
import {
  createCompanyAccount,
  getCompanyAccount,
  type CompanyAccount,
} from "@/lib/stellar";
import { StatusBadge, STATUS_STEPS } from "@/components/StatusBadge";
import { CompanyWallet } from "@/components/CompanyWallet";
import { PaymentChain } from "@/components/PaymentChain";
import {
  ArrowLeft,
  Paperclip,
  Check,
  FileCheck2,
} from "lucide-react";

export default function DetallePage() {
  return (
    <Suspense fallback={<div className="container-app">Cargando…</div>}>
      <Detalle />
    </Suspense>
  );
}

function Detalle() {
  const params = useSearchParams();
  const id = params.get("id") ?? "";
  const { payment: p, loaded } = usePayment(id);
  const fileRef = useRef<HTMLInputElement>(null);

  const [company, setCompany] = useState<CompanyAccount | null>(null);
  const [balanceKey, setBalanceKey] = useState(0);
  useEffect(() => setCompany(getCompanyAccount()), []);

  const ensureCompany = useCallback(async () => {
    const existing = getCompanyAccount();
    if (existing) return existing;
    const created = await createCompanyAccount();
    setCompany(created);
    return created;
  }, []);
  const onBalanceChange = useCallback(() => setBalanceKey((k) => k + 1), []);

  if (!loaded) {
    return <div className="container-app">Cargando…</div>;
  }

  if (!p) {
    return (
      <div className="container-app">
        <p style={{ color: "var(--text-3)" }}>Pago no encontrado.</p>
        <Link href="/dashboard" className="btn btn-ghost mt-3">
          <ArrowLeft size={16} /> Volver al tablero
        </Link>
      </div>
    );
  }

  const stepIdx = STATUS_STEPS.indexOf(p.status);

  function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) attachReceipt(p!.id, f.name);
  }

  return (
    <div className="container-app">
      <Link href="/dashboard" className="flex items-center gap-1.5 text-sm" style={{ color: "var(--text-2)" }}>
        <ArrowLeft size={15} /> Volver al tablero
      </Link>

      <div className="mt-3 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs" style={{ color: "var(--text-3)" }}>
            {p.reference}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">{p.beneficiary}</h1>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            {p.concept} · {COUNTRIES[p.country].flag} {COUNTRIES[p.country].name}
          </p>
        </div>
        <StatusBadge status={p.status} />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-5">
        {/* Columna izquierda */}
        <div className="space-y-6 lg:col-span-3">
          {/* Línea de estado */}
          <div className="card">
            <h3 className="font-semibold">Estado del pago</h3>
            {p.status === "pendiente_autorizacion" ? (
              <div className="mt-3">
                <p className="text-sm" style={{ color: "var(--text-2)" }}>
                  Este pago aún no ha sido autorizado por el administrador.
                </p>
                <button onClick={() => authorize(p.id)} className="btn btn-primary mt-3">
                  <Check size={16} /> Autorizar ahora
                </button>
              </div>
            ) : p.status === "rechazado" ? (
              <p className="mt-3 text-sm" style={{ color: "var(--error)" }}>
                El pago fue rechazado por el administrador.
              </p>
            ) : (
              <>
                {p.status === "fallido" ? (
                  <p className="mt-3 text-sm" style={{ color: "var(--error)" }}>
                    La red rechazó la transacción. Revisa el motivo y reintenta desde
                    «Ejecución en Stellar testnet».
                  </p>
                ) : (
                  <Timeline current={stepIdx} />
                )}
              </>
            )}
          </div>

          {/* Costo */}
          <div className="card">
            <h3 className="font-semibold">Desglose de costo</h3>
            <div className="mt-3 space-y-2 text-sm">
              <Line label="Monto" value={fmtMXN(p.cost.amountMXN)} />
              <Line label="Comisión de servicio" value={fmtMXN(p.cost.serviceFeeMXN)} />
              <Line label="Comisión de red (Stellar)" value={fmtMXN(p.cost.networkFeeMXN)} />
              <div className="my-1 h-px" style={{ background: "var(--border)" }} />
              <Line label="Costo total" value={fmtMXN(p.cost.totalCostMXN)} bold />
              <Line
                label="Tipo de cambio"
                value={`1 MXN ≈ ${p.cost.fxRate} ${p.cost.localCurrency}`}
              />
              <Line
                label="El colaborador recibe"
                value={fmtLocal(p.cost.amountReceivedLocal, p.cost.localCurrency)}
                accent
              />
              <Line label="Se liquida en testnet" value={`${p.cost.amountXLM} XLM`} />
            </div>
          </div>

          {/* Comprobante */}
          <div className="card">
            <h3 className="font-semibold">Comprobante</h3>
            {p.receiptName ? (
              <div
                className="mt-3 flex items-center gap-2 rounded-xl p-3 text-sm"
                style={{ background: "var(--bg-2)" }}
              >
                <FileCheck2 size={18} style={{ color: "var(--success)" }} />
                <span className="font-medium">{p.receiptName}</span>
                <span style={{ color: "var(--text-3)" }}>· conciliado con {p.reference}</span>
              </div>
            ) : (
              <p className="mt-2 text-sm" style={{ color: "var(--text-2)" }}>
                Aún no hay comprobante adjunto.
              </p>
            )}
            <input ref={fileRef} type="file" className="hidden" onChange={onFile} />
            <button onClick={() => fileRef.current?.click()} className="btn btn-ghost mt-3">
              <Paperclip size={15} /> {p.receiptName ? "Reemplazar" : "Adjuntar"} comprobante
            </button>
          </div>
        </div>

        {/* Columna derecha */}
        <div className="space-y-6 lg:col-span-2">
          <div className="card">
            <h3 className="font-semibold">Referencia única</h3>
            <p className="mt-1 text-sm" style={{ color: "var(--text-2)" }}>
              Identificador compartido que permite conciliar el pago entre
              intermediarios. Viaja en el memo de la transacción de Stellar.
            </p>
            <code
              className="mt-3 block rounded-xl p-3 text-center text-lg font-bold tracking-wider"
              style={{ background: "var(--bg-2)" }}
            >
              {p.reference}
            </code>
            {p.authorizedBy && (
              <p className="mt-3 text-xs" style={{ color: "var(--text-3)" }}>
                Autorizado por {p.authorizedBy}
              </p>
            )}
          </div>

          <PaymentChain payment={p} ensureCompany={ensureCompany} onBalanceChange={onBalanceChange} />
          <CompanyWallet company={company} onCreate={ensureCompany} refreshKey={balanceKey} />
        </div>
      </div>
    </div>
  );
}

function Timeline({ current }: { current: number }) {
  const labels = ["Autorizado", "Enviado a la red", "Confirmado en la red"];
  return (
    <div className="mt-4 space-y-3">
      {labels.map((l, i) => {
        const done = i <= current;
        return (
          <div key={l} className="flex items-center gap-3">
            <div
              className="flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold"
              style={
                done
                  ? { background: "var(--success)", color: "#fff" }
                  : { background: "var(--bg-2)", color: "var(--text-3)" }
              }
            >
              {done ? <Check size={14} /> : i + 1}
            </div>
            <span
              className="text-sm"
              style={{ color: done ? "var(--text)" : "var(--text-3)", fontWeight: i === current ? 700 : 400 }}
            >
              {l}
            </span>
          </div>
        );
      })}
      <div className="flex items-center gap-3">
        <div
          className="flex h-7 w-7 items-center justify-center rounded-full border border-dashed text-xs font-bold"
          style={{ borderColor: "var(--border-2)", color: "var(--text-3)" }}
        >
          {labels.length + 1}
        </div>
        <span className="text-sm" style={{ color: "var(--text-3)" }}>
          Abonado en el banco del colaborador · fase posterior (off-ramp)
        </span>
      </div>
    </div>
  );
}

function Line({
  label,
  value,
  bold,
  accent,
}: {
  label: string;
  value: string;
  bold?: boolean;
  accent?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ color: "var(--text-2)" }}>{label}</span>
      <span
        className={bold ? "text-base font-bold" : "font-medium"}
        style={accent ? { color: "var(--accent-hover)" } : undefined}
      >
        {value}
      </span>
    </div>
  );
}
