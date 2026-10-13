"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { usePayments, resetSeed } from "@/lib/store";
import { COUNTRIES, fmtMXN } from "@/lib/pricing";
import { StatusBadge } from "@/components/StatusBadge";
import type { PaymentStatus } from "@/lib/types";
import { PlusCircle, RotateCcw, Search } from "lucide-react";

const FILTERS: { value: PaymentStatus | "todos"; label: string }[] = [
  { value: "todos", label: "Todos" },
  { value: "pendiente_autorizacion", label: "Pendientes" },
  { value: "en_transito", label: "En tránsito" },
  { value: "recibido", label: "Recibidos" },
];

export default function Dashboard() {
  const payments = usePayments();
  const [filter, setFilter] = useState<PaymentStatus | "todos">("todos");
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    return payments.filter((p) => {
      const byStatus = filter === "todos" || p.status === filter;
      const byText =
        q.trim() === "" ||
        p.beneficiary.toLowerCase().includes(q.toLowerCase()) ||
        p.reference.toLowerCase().includes(q.toLowerCase());
      return byStatus && byText;
    });
  }, [payments, filter, q]);

  const totalMXN = payments.reduce((s, p) => s + p.cost.totalCostMXN, 0);
  const recibidos = payments.filter((p) => p.status === "recibido").length;
  const pendientes = payments.filter(
    (p) => p.status === "pendiente_autorizacion"
  ).length;

  return (
    <div className="container-app">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Pagos</h1>
          <p className="text-sm" style={{ color: "var(--text-2)" }}>
            Estado de cada pago internacional, de principio a fin.
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={resetSeed} className="btn btn-ghost" title="Restaurar datos de ejemplo">
            <RotateCcw size={15} /> Reiniciar
          </button>
          <Link href="/pagos/nuevo" className="btn btn-primary">
            <PlusCircle size={16} /> Nuevo pago
          </Link>
        </div>
      </div>

      {/* KPIs */}
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        <Kpi label="Costo total gestionado" value={fmtMXN(totalMXN)} />
        <Kpi label="Pagos recibidos" value={`${recibidos} / ${payments.length}`} />
        <Kpi label="Pendientes de autorizar" value={String(pendientes)} />
      </div>

      {/* Filtros */}
      <div className="mt-6 flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: "var(--text-3)" }}
          />
          <input
            className="input pl-9"
            placeholder="Buscar por beneficiario o referencia…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        {FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value)}
            className="btn"
            style={
              filter === f.value
                ? { background: "#1a1a1a", color: "#fff" }
                : { border: "1px solid var(--border-2)", color: "var(--text-2)" }
            }
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="mt-4 overflow-hidden rounded-2xl border" style={{ borderColor: "var(--border)" }}>
        <table className="w-full text-sm">
          <thead>
            <tr
              className="text-left text-xs uppercase tracking-wide"
              style={{ background: "var(--bg-2)", color: "var(--text-3)" }}
            >
              <th className="px-4 py-3">Referencia</th>
              <th className="px-4 py-3">Beneficiario</th>
              <th className="px-4 py-3 hidden sm:table-cell">Destino</th>
              <th className="px-4 py-3">Costo total</th>
              <th className="px-4 py-3">Estado</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr
                key={p.id}
                className="border-t transition hover:bg-[var(--bg-2)]"
                style={{ borderColor: "var(--border)" }}
              >
                <td className="px-4 py-3">
                  <Link href={`/pagos/detalle?id=${p.id}`} className="font-semibold underline-offset-2 hover:underline">
                    {p.reference}
                  </Link>
                </td>
                <td className="px-4 py-3">
                  <div className="font-medium">{p.beneficiary}</div>
                  <div className="text-xs" style={{ color: "var(--text-3)" }}>
                    {p.concept}
                  </div>
                </td>
                <td className="px-4 py-3 hidden sm:table-cell">
                  {COUNTRIES[p.country].flag} {COUNTRIES[p.country].name}
                </td>
                <td className="px-4 py-3 font-medium">{fmtMXN(p.cost.totalCostMXN)}</td>
                <td className="px-4 py-3">
                  <StatusBadge status={p.status} />
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="px-4 py-10 text-center" style={{ color: "var(--text-3)" }}>
                  No hay pagos que coincidan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function Kpi({ label, value }: { label: string; value: string }) {
  return (
    <div className="card">
      <div className="text-xs uppercase tracking-wide" style={{ color: "var(--text-3)" }}>
        {label}
      </div>
      <div className="mt-1 text-2xl font-bold">{value}</div>
    </div>
  );
}
