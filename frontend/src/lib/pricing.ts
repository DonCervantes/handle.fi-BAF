import type { Country, CostBreakdown } from "./types";

/**
 * Tipos de cambio y metadatos por país destino.
 * NOTA: valores SIMULADOS para el prototipo (red testnet, sin precios reales).
 * 1 MXN = rate (moneda local).
 */
export const COUNTRIES: Record<
  Country,
  { name: string; currency: string; rate: number; flag: string }
> = {
  CO: { name: "Colombia", currency: "COP", rate: 211.5, flag: "🇨🇴" },
  CL: { name: "Chile", currency: "CLP", rate: 51.3, flag: "🇨🇱" },
  AR: { name: "Argentina", currency: "ARS", rate: 68.4, flag: "🇦🇷" },
};

const SERVICE_FEE_PCT = 0.015; // 1.5% comisión de servicio
const NETWORK_FEE_MXN = 3.5; // comisión de red (Stellar) simulada

/**
 * Calcula el costo total de un pago internacional.
 * Devuelve el desglose que el contador ve ANTES de ejecutar (Historia 2).
 */
export function calcCost(amountMXN: number, country: Country): CostBreakdown {
  const meta = COUNTRIES[country];
  const serviceFeeMXN = round2(amountMXN * SERVICE_FEE_PCT);
  const networkFeeMXN = NETWORK_FEE_MXN;
  const totalCostMXN = round2(amountMXN + serviceFeeMXN + networkFeeMXN);
  const amountReceivedLocal = Math.round(amountMXN * meta.rate);

  return {
    amountMXN: round2(amountMXN),
    fxRate: meta.rate,
    localCurrency: meta.currency,
    serviceFeeMXN,
    networkFeeMXN,
    totalCostMXN,
    amountReceivedLocal,
  };
}

function round2(n: number): number {
  return Math.round(n * 100) / 100;
}

export function fmtMXN(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
  }).format(n);
}

export function fmtLocal(n: number, currency: string): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(n);
}
