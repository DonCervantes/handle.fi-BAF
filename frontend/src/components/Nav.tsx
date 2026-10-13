"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutDashboard, PlusCircle, ShieldCheck } from "lucide-react";

const links = [
  { href: "/dashboard", label: "Pagos", icon: LayoutDashboard },
  { href: "/pagos/nuevo", label: "Nuevo pago", icon: PlusCircle },
  { href: "/autorizacion", label: "Autorización", icon: ShieldCheck },
];

export function Nav() {
  const path = usePathname();
  return (
    <header
      className="sticky top-0 z-30 h-16 border-b backdrop-blur"
      style={{ borderColor: "var(--border)", background: "rgba(245,242,236,0.85)" }}
    >
      <div className="container-app flex h-full items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <Image src="/logo.png" alt="Handle.Fi" width={34} height={34} />
          <span className="text-lg font-bold tracking-tight">Handle.Fi</span>
          <span
            className="ml-1 rounded-md px-1.5 py-0.5 text-[10px] font-bold uppercase"
            style={{ background: "var(--accent)", color: "#1a1a1a" }}
          >
            testnet
          </span>
        </Link>
        <nav className="flex items-center gap-1">
          {links.map((l) => {
            const active = path.startsWith(l.href);
            const Icon = l.icon;
            return (
              <Link
                key={l.href}
                href={l.href}
                className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition"
                style={
                  active
                    ? { background: "#1a1a1a", color: "#fff" }
                    : { color: "var(--text-2)" }
                }
              >
                <Icon size={16} />
                <span className="hidden sm:inline">{l.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
