"use client";

import { NavLink, Outlet, useLocation, Link } from "react-router-dom";
import { Calculator, Wallet, CalendarDays, FileText, ArrowLeft, HardHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { MadeWithDyad } from "@/components/made-with-dyad";
import { Button } from "@/components/ui/button";

const navLinks = [
  { to: "/liquidacion", label: "Liquidación", icon: Calculator },
  { to: "/salario", label: "Salario Neto", icon: Wallet },
  { to: "/decimo-tercer-mes", label: "Décimo Tercer Mes", icon: CalendarDays },
  { to: "/carta-renuncia", label: "Carta de Renuncia", icon: FileText },
];

const Layout = () => {
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  return (
    <div className="min-h-screen bg-neutral-100 dark:bg-neutral-900 flex flex-col">
      <header className="bg-background border-b bg-gradient-to-b from-white to-neutral-50 dark:from-neutral-950 dark:to-neutral-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-center">
            <Link to="/" className="flex items-center gap-4 text-foreground transition-colors group">
              <HardHat className="h-16 w-16 text-primary/80 group-hover:text-primary transition-colors" />
              <div className="text-left">
                <h1 className="text-xl font-bold uppercase leading-tight text-neutral-800 dark:text-neutral-100 group-hover:text-primary transition-colors">
                  Cálculo de Prestaciones
                </h1>
                <p className="text-sm font-medium uppercase text-neutral-500 dark:text-neutral-400">
                  y Derechos Adquiridos en Panamá
                </p>
              </div>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto p-4 sm:p-6 lg:p-8 flex-grow">
        <div className="bg-card p-4 sm:p-6 md:p-8 rounded-xl shadow-lg shadow-neutral-200/50 dark:shadow-black/20 border">
          {!isHomePage && (
            <div className="mb-6">
              <Link to="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Volver al Inicio
                </Button>
              </Link>
            </div>
          )}
          {!isHomePage && (
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
          )}
          <Outlet />
        </div>
      </main>
      <MadeWithDyad />
    </div>
  );
};

export default Layout;