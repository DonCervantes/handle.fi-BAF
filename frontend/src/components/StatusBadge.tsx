import type { PaymentStatus } from "@/lib/types";

const MAP: Record<
  PaymentStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  pendiente_autorizacion: { label: "Pendiente de autorización", bg: "#faf3e2", color: "#8a6d1f", dot: "#a67c2e" },
  autorizado: { label: "Autorizado", bg: "#eef2f7", color: "#3b5068", dot: "#5068" },
  enviado: { label: "Enviado", bg: "#eaf2fb", color: "#2f5a8f", dot: "#2f5a8f" },
  en_transito: { label: "En tránsito", bg: "#eef0fb", color: "#434b9c", dot: "#434b9c" },
  recibido: { label: "Recibido", bg: "#e8f5ee", color: "#1f6b46", dot: "#2e6f4e" },
  rechazado: { label: "Rechazado", bg: "#fbeaea", color: "#8f2f2f", dot: "#a54545" },
};

export function StatusBadge({ status }: { status: PaymentStatus }) {
  const s = MAP[status];
  return (
    <span className="badge" style={{ background: s.bg, color: s.color }}>
      <span className="pill-dot" style={{ background: s.dot }} />
      {s.label}
    </span>
  );
}

export const STATUS_STEPS: PaymentStatus[] = [
  "autorizado",
  "enviado",
  "en_transito",
  "recibido",
];
