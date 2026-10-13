import Link from "next/link";
import {
  ArrowRight,
  Eye,
  Calculator,
  FileCheck2,
  ShieldCheck,
  Link2,
} from "lucide-react";

const features = [
  {
    icon: Eye,
    title: "Estado de principio a fin",
    desc: "Autorizado, enviado o confirmado en la red. Una sola vista confiable, sin confundir «lo envié» con «ya le llegó».",
  },
  {
    icon: Calculator,
    title: "Costo total antes de pagar",
    desc: "Tipo de cambio y comisiones a la vista. Sabes cuánto sale en pesos y cuánto recibe el colaborador.",
  },
  {
    icon: Link2,
    title: "Referencia única compartida",
    desc: "Cada pago lleva una referencia que viaja en el memo de Stellar y permite conciliar sin cruces manuales.",
  },
  {
    icon: ShieldCheck,
    title: "Autorización del dueño",
    desc: "Ningún pago se ejecuta sin la aprobación del administrador. Control sobre cada salida de dinero.",
  },
  {
    icon: FileCheck2,
    title: "Comprobante conciliado",
    desc: "Adjunta y recupera el comprobante ligado a su referencia. Se acabó reconstruir la documentación a mano.",
  },
];

export default function Home() {
  return (
    <div className="container-app">
      {/* Hero */}
      <section className="py-10 sm:py-16">
        <span
          className="badge"
          style={{ background: "var(--bg-2)", color: "var(--text-2)" }}
        >
          <span className="pill-dot" style={{ background: "var(--accent)" }} />
          Prueba funcional · Semana 3 · Stellar testnet
        </span>
        <h1 className="mt-5 max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl">
          Controla de principio a fin los pagos de tu PyME a colaboradores en LatAm.
        </h1>
        <p className="mt-4 max-w-2xl text-lg" style={{ color: "var(--text-2)" }}>
          Handle.Fi le da a la contadora o contador una sola vista para saber el
          costo real de cada pago, en qué estado está y tener el comprobante
          conciliado — sobre la red Stellar.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link href="/dashboard" className="btn btn-primary">
            Ver el tablero de pagos <ArrowRight size={16} />
          </Link>
          <Link href="/pagos/nuevo" className="btn btn-ghost">
            Registrar un pago
          </Link>
        </div>
      </section>

      {/* Features = historias del MVP */}
      <section className="grid gap-4 pb-10 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f) => {
          const Icon = f.icon;
          return (
            <div key={f.title} className="card">
              <div
                className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl"
                style={{ background: "var(--bg-2)" }}
              >
                <Icon size={20} style={{ color: "var(--accent-hover)" }} />
              </div>
              <h3 className="font-semibold">{f.title}</h3>
              <p className="mt-1.5 text-sm" style={{ color: "var(--text-2)" }}>
                {f.desc}
              </p>
            </div>
          );
        })}
        <div
          className="card flex flex-col justify-between"
          style={{ background: "#1a1a1a", color: "#fff", borderColor: "#1a1a1a" }}
        >
          <div>
            <h3 className="font-semibold">Flujo del MVP</h3>
            <p className="mt-1.5 text-sm" style={{ color: "#b5aea4" }}>
              Registro → costo → autorización → ejecución en Stellar → estado →
              comprobante.
            </p>
          </div>
          <Link
            href="/dashboard"
            className="btn mt-4"
            style={{ background: "var(--accent)", color: "#1a1a1a" }}
          >
            Recorrer el flujo <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}
