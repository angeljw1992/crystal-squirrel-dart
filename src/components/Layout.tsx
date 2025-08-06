"use client";

import { NavLink, Outlet, useLocation } from "react-router-dom";
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
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-5">
          <div className="flex items-center justify-center space-x-4">
            <HardHat className="h-10 w-10 md:h-12 md:w-12 text-primary" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold text-primary tracking-tight">CÁLCULO DE PRESTACIONES</h1>
              <p className="text-xs md:text-sm text-gray-500">Y DERECHOS ADQUIRIDOS EN PANAMÁ</p>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 md:p-8 flex-grow">
        <div className="bg-white p-4 sm:p-6 md:p-8 rounded-xl shadow-md border border-gray-200">
          <nav className="flex flex-wrap justify-center border-b -mt-2 mb-6">
            {navLinks.map(({ to, label, icon: Icon }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  cn(
                    "flex items-center space-x-2 px-3 py-3 text-sm font-medium text-gray-600 hover:text-primary transition-colors duration-200",
                    isActive 
                      ? "border-b-2 border-primary text-primary" 
                      : "border-b-2 border-transparent"
                  )
                }
              >
                <Icon className="h-5 w-5" />
                <span className="hidden sm:inline">{label}</span>
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