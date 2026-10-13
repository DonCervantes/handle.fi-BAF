// Tipos del dominio de Handle.Fi (MVP)

export type Country = "CO" | "CL" | "AR";

export type PaymentStatus =
  | "pendiente_autorizacion"
  | "autorizado"
  | "enviado" // transacción enviada a Stellar, esperando confirmación
  | "confirmado" // incluida en un ledger: verificable en la red
  | "fallido" // la red rechazó la transacción
  | "rechazado"; // el administrador no autorizó el pago

export interface CostBreakdown {
  amountMXN: number; // lo que sale de la empresa en pesos
  fxRate: number; // 1 MXN = fxRate (moneda local)
  localCurrency: string; // COP / CLP / ARS
  serviceFeeMXN: number; // comisión del servicio
  networkFeeMXN: number; // comisión de red (Stellar)
  totalCostMXN: number; // amount + comisiones
  amountReceivedLocal: number; // lo que recibe el colaborador en moneda local
  amountXLM: string; // monto que se liquida en Stellar testnet
}

export interface Payment {
  id: string;
  reference: string; // referencia única compartida (va en el memo de Stellar)
  beneficiary: string;
  country: Country;
  concept: string;
  cost: CostBreakdown;
  status: PaymentStatus;
  createdAt: string;
  destination?: string; // cuenta Stellar (G...) del colaborador
  authorizedBy?: string;
  authorizedAt?: string;
  stellarTxHash?: string;
  sentAt?: string;
  ledger?: number;
  confirmedAt?: string;
  txError?: string;
  receiptName?: string; // nombre del comprobante adjunto
}
