"use client";

import { useEffect, useState } from "react";
import type { Payment, Country } from "./types";
import { calcCost } from "./pricing";

const KEY = "handlefi.payments.v2";

// ── Datos de ejemplo (seed) ──
// Sin pagos "confirmados": un pago solo se confirma con una transacción real en testnet.
function seed(): Payment[] {
  const now = Date.now();
  const mk = (
    n: number,
    beneficiary: string,
    country: Country,
    concept: string,
    amountMXN: number,
    hoursAgo: number,
    extra: Partial<Payment> = {}
  ): Payment => ({
    id: `p-${n}`,
    reference: `HF-2026-${n}`,
    beneficiary,
    country,
    concept,
    cost: calcCost(amountMXN, country),
    status: "pendiente_autorizacion",
    createdAt: new Date(now - hoursAgo * 36e5).toISOString(),
    ...extra,
  });

  return [
    mk(1004, "Valentina Ríos", "CO", "Diseño UI — Octubre", 1800, 2),
    mk(1003, "Mateo Fernández", "AR", "Desarrollo backend — Octubre", 2500, 20, {
      status: "autorizado",
      authorizedBy: "Daniel Cruz (Admin)",
      authorizedAt: new Date(now - 18 * 36e5).toISOString(),
    }),
    mk(1002, "Catalina Soto", "CL", "QA y pruebas — Octubre", 1450, 30, {
      status: "rechazado",
      authorizedBy: "Daniel Cruz (Admin)",
      authorizedAt: new Date(now - 28 * 36e5).toISOString(),
    }),
    mk(1001, "Samuel Duarte", "CO", "Soporte técnico — Octubre", 900, 48),
  ];
}

function load(): Payment[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) {
      const s = seed();
      window.localStorage.setItem(KEY, JSON.stringify(s));
      return s;
    }
    return JSON.parse(raw) as Payment[];
  } catch {
    return seed();
  }
}

function save(list: Payment[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(list));
  } catch {
    /* ignora cuota/privado */
  }
  emit();
}

// ── Suscripción simple para re-render entre pantallas ──
const listeners = new Set<() => void>();
function emit() {
  listeners.forEach((l) => l());
}

export function getAll(): Payment[] {
  return load().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function getById(id: string): Payment | undefined {
  return load().find((p) => p.id === id);
}

export function createPayment(input: {
  beneficiary: string;
  country: Country;
  concept: string;
  amountMXN: number;
  destination?: string;
}): Payment {
  const list = load();
  const n = Math.max(1000, ...list.map((p) => Number(p.id.slice(2)) || 0)) + 1;
  const p: Payment = {
    id: `p-${n}`,
    reference: `HF-2026-${n}`,
    beneficiary: input.beneficiary,
    country: input.country,
    concept: input.concept,
    cost: calcCost(input.amountMXN, input.country),
    status: "pendiente_autorizacion",
    createdAt: new Date().toISOString(),
    destination: input.destination,
  };
  save([p, ...list]);
  return p;
}

function patch(id: string, fn: (p: Payment) => Payment) {
  const list = load().map((p) => (p.id === id ? fn(p) : p));
  save(list);
}

export function authorize(id: string, by = "Daniel Cruz (Admin)") {
  patch(id, (p) => ({
    ...p,
    status: "autorizado",
    authorizedBy: by,
    authorizedAt: new Date().toISOString(),
  }));
}

export function reject(id: string, by = "Daniel Cruz (Admin)") {
  patch(id, (p) => ({
    ...p,
    status: "rechazado",
    authorizedBy: by,
    authorizedAt: new Date().toISOString(),
  }));
}

export function setDestination(id: string, destination: string) {
  patch(id, (p) => ({ ...p, destination }));
}

/** La transacción quedó firmada y se envió a la red; falta que la red la confirme. */
export function markSent(id: string, hash: string) {
  patch(id, (p) => ({
    ...p,
    status: "enviado",
    stellarTxHash: hash,
    sentAt: new Date().toISOString(),
    txError: undefined,
  }));
}

/** La red incluyó la transacción en un ledger. */
export function markConfirmed(id: string, ledger: number, confirmedAt: string) {
  patch(id, (p) => ({ ...p, status: "confirmado", ledger, confirmedAt, txError: undefined }));
}

/** La red rechazó la transacción: el pago vuelve a poder ejecutarse. */
export function markFailed(id: string, error: string) {
  patch(id, (p) => ({ ...p, status: "fallido", txError: error }));
}

export function attachReceipt(id: string, name: string) {
  patch(id, (p) => ({ ...p, receiptName: name }));
}

export function resetSeed() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(KEY);
  save(seed());
}

// ── Hook ──
export function usePayments() {
  const [list, setList] = useState<Payment[]>([]);
  useEffect(() => {
    const refresh = () => setList(getAll());
    refresh();
    listeners.add(refresh);
    return () => {
      listeners.delete(refresh);
    };
  }, []);
  return list;
}

export function usePayment(id: string) {
  const [payment, setPayment] = useState<Payment | undefined>(undefined);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const refresh = () => {
      setPayment(getById(id));
      setLoaded(true);
    };
    refresh();
    listeners.add(refresh);
    return () => {
      listeners.delete(refresh);
    };
  }, [id]);
  return { payment, loaded };
}
