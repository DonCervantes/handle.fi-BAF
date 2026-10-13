"use client";

import { useEffect, useState } from "react";
import type { Payment, Country, PaymentStatus } from "./types";
import { calcCost } from "./pricing";

const KEY = "handlefi.payments.v1";

// ── Datos de ejemplo (seed) ──
function seed(): Payment[] {
  const mk = (
    id: string,
    beneficiary: string,
    country: Country,
    concept: string,
    amountMXN: number,
    status: PaymentStatus,
    ref: string,
    extra: Partial<Payment> = {}
  ): Payment => ({
    id,
    reference: ref,
    beneficiary,
    country,
    concept,
    cost: calcCost(amountMXN, country),
    status,
    createdAt: new Date(Date.now() - Math.random() * 6e8).toISOString(),
    ...extra,
  });

  return [
    mk("p-1004", "Valentina Ríos", "CO", "Diseño UI — Octubre", 18000, "recibido", "HF-2026-1004", {
      authorizedBy: "Daniel Cruz (Admin)",
      authorizedAt: new Date(Date.now() - 5e8).toISOString(),
      stellarTxHash: "",
      receiptName: "comprobante-1004.pdf",
    }),
    mk("p-1003", "Mateo Fernández", "AR", "Desarrollo backend — Octubre", 25000, "en_transito", "HF-2026-1003", {
      authorizedBy: "Daniel Cruz (Admin)",
      authorizedAt: new Date(Date.now() - 2e8).toISOString(),
    }),
    mk("p-1002", "Catalina Soto", "CL", "QA y pruebas — Octubre", 14500, "autorizado", "HF-2026-1002", {
      authorizedBy: "Daniel Cruz (Admin)",
      authorizedAt: new Date(Date.now() - 1e8).toISOString(),
    }),
    mk("p-1001", "Samuel Duarte", "CO", "Soporte técnico — Octubre", 9000, "pendiente_autorizacion", "HF-2026-1001"),
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
}): Payment {
  const list = load();
  const n = 1000 + list.length + 1;
  const p: Payment = {
    id: `p-${n}`,
    reference: `HF-2026-${n}`,
    beneficiary: input.beneficiary,
    country: input.country,
    concept: input.concept,
    cost: calcCost(input.amountMXN, input.country),
    status: "pendiente_autorizacion",
    createdAt: new Date().toISOString(),
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

/** Simula el avance del pago sobre Stellar: autorizado → enviado → en tránsito → recibido */
export function advanceStatus(id: string) {
  const order: PaymentStatus[] = ["autorizado", "enviado", "en_transito", "recibido"];
  patch(id, (p) => {
    const idx = order.indexOf(p.status);
    if (idx === -1 || idx === order.length - 1) return p;
    return { ...p, status: order[idx + 1] };
  });
}

export function attachReceipt(id: string, name: string) {
  patch(id, (p) => ({ ...p, receiptName: name }));
}

export function setTxHash(id: string, hash: string) {
  patch(id, (p) => ({ ...p, stellarTxHash: hash }));
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
