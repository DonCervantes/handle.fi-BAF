import type { PaymentStatus } from "@/lib/types";

const MAP: Record<
  PaymentStatus,
  { label: string; bg: string; color: string; dot: string }
> = {
  pendiente_autorizacion: { label: "Pendiente de autorización", bg: "#faf3e2", color: "#8a6d1f", dot: "#a67c2e" },
  autorizado: { label: "Autorizado", bg: "#eef2f7", color: "#3b5068", dot: "#3b5068" },
  enviado: { label: "Enviado a la red", bg: "#eef0fb", color: "#434b9c", dot: "#434b9c" },
  confirmado: { label: "Confirmado en la red", bg: "#e8f5ee", color: "#1f6b46", dot: "#2e6f4e" },
  fallido: { label: "Falló en la red", bg: "#fbeaea", color: "#8f2f2f", dot: "#a54545" },
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

export const STATUS_STEPS: PaymentStatus[] = ["autorizado", "enviado", "confirmado"];
