"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { calcCost, COUNTRIES, fmtMXN, fmtLocal } from "@/lib/pricing";
import { createPayment } from "@/lib/store";
import type { Country } from "@/lib/types";
import { ArrowRight } from "lucide-react";

export default function NuevoPago() {
  const router = useRouter();
  const [beneficiary, setBeneficiary] = useState("");
  const [country, setCountry] = useState<Country>("CO");
  const [concept, setConcept] = useState("");
  const [amount, setAmount] = useState<string>("10000");

  const amountNum = Number(amount) || 0;
  const cost = useMemo(() => calcCost(amountNum, country), [amountNum, country]);
  const valid = beneficiary.trim() !== "" && amountNum > 0;

  function submit() {
    if (!valid) return;
    const p = createPayment({
      beneficiary: beneficiary.trim(),
      country,
      concept: concept.trim() || "Pago a colaborador",
      amountMXN: amountNum,
    });
    router.push(`/pagos/detalle?id=${p.id}`);
  }

  return (
    <div className="container-app max-w-3xl">
      <h1 className="text-2xl font-bold tracking-tight">Registrar pago</h1>
      <p className="text-sm" style={{ color: "var(--text-2)" }}>
        Captura el pago y revisa el costo total antes de enviarlo a autorización.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-5">
        {/* Formulario */}
        <div className="card md:col-span-3">
          <div className="grid gap-4">
            <div>
              <label className="label">Beneficiario</label>
              <input
                className="input"
                placeholder="Nombre del colaborador"
                value={beneficiary}
                onChange={(e) => setBeneficiary(e.target.value)}
              />
            </div>
            <div>
              <label className="label">País destino</label>
              <div className="grid grid-cols-3 gap-2">
                {(Object.keys(COUNTRIES) as Country[]).map((c) => (
                  <button
                    key={c}
                    onClick={() => setCountry(c)}
                    className="rounded-xl border px-3 py-2.5 text-sm font-medium transition"
                    style={
                      country === c
                        ? { borderColor: "var(--accent)", background: "var(--bg-2)" }
                        : { borderColor: "var(--border-2)" }
                    }
                  >
                    {COUNTRIES[c].flag} {COUNTRIES[c].name}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="label">Concepto</label>
              <input
                className="input"
                placeholder="Ej. Diseño UI — Octubre"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
              />
            </div>
            <div>
              <label className="label">Monto a enviar (MXN)</label>
              <input
                className="input"
                type="number"
                min={0}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Costo total en vivo */}
        <div className="md:col-span-2">
          <div className="card" style={{ background: "#1a1a1a", color: "#fff", borderColor: "#1a1a1a" }}>
            <div className="text-xs uppercase tracking-wide" style={{ color: "#b5aea4" }}>
              Costo total estimado
            </div>
            <div className="mt-1 text-3xl font-bold">{fmtMXN(cost.totalCostMXN)}</div>

            <div className="mt-4 space-y-2 text-sm">
              <Row label="Monto" value={fmtMXN(cost.amountMXN)} muted />
              <Row label="Comisión de servicio (1.5%)" value={fmtMXN(cost.serviceFeeMXN)} muted />
              <Row label="Comisión de red (Stellar)" value={fmtMXN(cost.networkFeeMXN)} muted />
              <div className="my-2 h-px" style={{ background: "#2a2a2a" }} />
              <Row
                label="Tipo de cambio"
                value={`1 MXN ≈ ${cost.fxRate} ${cost.localCurrency}`}
                muted
              />
              <div className="rounded-xl p-3" style={{ background: "#232323" }}>
                <div className="text-xs" style={{ color: "#b5aea4" }}>
                  El colaborador recibe
                </div>
                <div className="text-xl font-bold" style={{ color: "var(--accent)" }}>
                  {fmtLocal(cost.amountReceivedLocal, cost.localCurrency)}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={submit}
            disabled={!valid}
            className="btn btn-primary mt-3 w-full"
            style={!valid ? { opacity: 0.45, cursor: "not-allowed" } : undefined}
          >
            Enviar a autorización <ArrowRight size={16} />
          </button>
          <p className="mt-2 text-center text-xs" style={{ color: "var(--text-3)" }}>
            Valores de tipo de cambio simulados para el prototipo (testnet).
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value, muted }: { label: string; value: string; muted?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span style={{ color: muted ? "#b5aea4" : "#fff" }}>{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
