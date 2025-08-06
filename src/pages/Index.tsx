"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator, Wallet, CalendarDays, FileText } from "lucide-react"; // Import icons

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-xl rounded-lg text-center bg-white/90 backdrop-blur-sm border-blue-200">
        <CardHeader className="pb-4">
          <CardTitle className="text-3xl font-extrabold text-primary mb-2">
            Calculadora de Prestaciones Laborales
          </CardTitle>
          <p className="text-lg text-gray-600">Panamá</p>
        </CardHeader>
        <CardContent className="space-y-5 pt-4">
          <p className="text-md text-gray-700 leading-relaxed">
            Seleccione la herramienta que desea utilizar para sus cálculos laborales:
          </p>
          <div className="flex flex-col space-y-4">
            <Link to="/liquidacion">
              <Button className="w-full py-3 h-auto text-lg shadow-md transition-all duration-200 flex items-center justify-center">
                <Calculator className="mr-3 h-6 w-6" /> Cálculo de Liquidación
              </Button>
            </Link>
            <Link to="/salario">
              <Button className="w-full py-3 h-auto text-lg shadow-md transition-all duration-200 flex items-center justify-center">
                <Wallet className="mr-3 h-6 w-6" /> Cálculo de Salario Neto
              </Button>
            </Link>
            <Link to="/decimo-tercer-mes">
              <Button className="w-full py-3 h-auto text-lg shadow-md transition-all duration-200 flex items-center justify-center">
                <CalendarDays className="mr-3 h-6 w-6" /> Cálculo de Décimo Tercer Mes
              </Button>
            </Link>
            <Link to="/carta-renuncia">
              <Button className="w-full py-3 h-auto text-lg shadow-md transition-all duration-200 flex items-center justify-center">
                <FileText className="mr-3 h-6 w-6" /> Generador de Carta de Renuncia
              </Button>
            </Link>
          </div>
          <p className="text-xs text-gray-500 mt-6">
            *Estas herramientas proporcionan estimaciones. Para cálculos oficiales o asesoría legal/fiscal, consulte a un experto.
          </p>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default Index;