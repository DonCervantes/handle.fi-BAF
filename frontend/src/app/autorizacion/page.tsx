"use client";

import Link from "next/link";
import { usePayments, authorize, reject } from "@/lib/store";
import { COUNTRIES, fmtMXN, fmtLocal } from "@/lib/pricing";
import { Check, X, ShieldCheck } from "lucide-react";

export default function Autorizacion() {
  const payments = usePayments();
  const pendientes = payments.filter((p) => p.status === "pendiente_autorizacion");

  return (
    <div className="container-app max-w-3xl">
      <div className="flex items-center gap-2">
        <ShieldCheck size={22} style={{ color: "var(--accent-hover)" }} />
        <h1 className="text-2xl font-bold tracking-tight">Autorización de pagos</h1>
      </div>
      <p className="text-sm" style={{ color: "var(--text-2)" }}>
        Como administrador, revisa el costo total y autoriza antes de que se ejecute
        cualquier pago. Ningún pago sale sin tu aprobación.
      </p>

      <div className="mt-6 space-y-4">
        {pendientes.length === 0 && (
          <div className="card text-center" style={{ color: "var(--text-3)" }}>
            No hay pagos pendientes de autorización. 🎉
          </div>
        )}

        {pendientes.map((p) => (
          <div key={p.id} className="card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs" style={{ color: "var(--text-3)" }}>
                  {p.reference}
                </div>
                <div className="text-lg font-semibold">{p.beneficiary}</div>
                <div className="text-sm" style={{ color: "var(--text-2)" }}>
                  {p.concept} · {COUNTRIES[p.country].flag} {COUNTRIES[p.country].name}
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs" style={{ color: "var(--text-3)" }}>
                  Costo total
                </div>
                <div className="text-2xl font-bold">{fmtMXN(p.cost.totalCostMXN)}</div>
                <div className="text-xs" style={{ color: "var(--text-2)" }}>
                  Recibe {fmtLocal(p.cost.amountReceivedLocal, p.cost.localCurrency)}
                </div>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <button onClick={() => authorize(p.id)} className="btn btn-primary">
                <Check size={16} /> Autorizar
              </button>
              <button
                onClick={() => reject(p.id)}
                className="btn btn-ghost"
                style={{ color: "var(--error)", borderColor: "var(--error)" }}
              >
                <X size={16} /> Rechazar
              </button>
              <Link href={`/pagos/detalle?id=${p.id}`} className="btn btn-ghost">
                Ver detalle
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
