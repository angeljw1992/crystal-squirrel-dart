"use client";

import { NavLink, Outlet } from "react-router-dom";
import { HardHat, Calculator, Wallet, CalendarDays, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { MadeWithDyad } from "@/components/made-with-dyad";

const navLinks = [
  { to: "/liquidacion", label: "Liquidación", icon: Calculator },
  { to: "/salario", label: "Salario Neto", icon: Wallet },
  { to: "/decimo-tercer-mes", label: "Décimo Tercer Mes", icon: CalendarDays },
  { to: "/carta-renuncia", label: "Carta de Renuncia", icon: FileText },
];

const Layout = () => {
  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col">
      <header className="bg-background border-b bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-center space-x-4">
            <HardHat className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            <div>
              <h1 className="text-xl md:text-2xl text-primary-700 dark:text-primary-400">CÁLCULO DE PRESTACIONES</h1>
              <p className="text-xs md:text-sm text-neutral-600 dark:text-neutral-400 tracking-caps uppercase">Y DERECHOS ADQUIRIDOS EN PANAMÁ</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="bg-card p-4 sm:p-6 md:p-8 rounded-xl shadow-lg shadow-neutral-200/50 dark:shadow-black/20 border">
          <nav className="flex justify-center border-b mb-8">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center gap-1 p-3 text-center text-xs font-medium text-neutral-600 hover:text-primary transition-colors duration-200 w-1/4",
                    "sm:w-auto sm:flex-row sm:gap-2 sm:px-4 sm:py-3 sm:text-sm sm:border-b-2 sm:border-transparent",
                    isActive ? "text-primary font-semibold sm:border-primary" : "font-medium"
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </NavLink>
            ))}
          </nav>
          <Outlet />
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Layout;