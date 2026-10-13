// Tipos del dominio de Handle.Fi (MVP)

export type Country = "CO" | "CL" | "AR";

export type PaymentStatus =
  | "pendiente_autorizacion"
  | "autorizado"
  | "enviado"
  | "en_transito"
  | "recibido"
  | "rechazado";

export interface CostBreakdown {
  amountMXN: number; // lo que sale de la empresa en pesos
  fxRate: number; // 1 MXN = fxRate (moneda local)
  localCurrency: string; // COP / CLP / ARS
  serviceFeeMXN: number; // comisión del servicio
  networkFeeMXN: number; // comisión de red (Stellar)
  totalCostMXN: number; // amount + comisiones
  amountReceivedLocal: number; // lo que recibe el colaborador en moneda local
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
  authorizedBy?: string;
  authorizedAt?: string;
  stellarTxHash?: string; // hash de la transacción en testnet (fase posterior / demo)
  receiptName?: string; // nombre del comprobante adjunto
}
