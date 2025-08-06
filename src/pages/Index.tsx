import { MadeWithDyad } from "@/components/made-with-dyad";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-md shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-3xl font-bold mb-4">Calculadora de Prestaciones Laborales - Panamá</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-lg text-gray-700">
            Seleccione el tipo de cálculo o herramienta que desea utilizar:
          </p>
          <div className="flex flex-col space-y-3">
            <Link to="/liquidacion">
              <Button className="w-full py-3 text-lg">Cálculo de Liquidación</Button>
            </Link>
            <Link to="/salario">
              <Button className="w-full py-3 text-lg">Cálculo de Salario Neto</Button>
            </Link>
            <Link to="/decimo-tercer-mes">
              <Button className="w-full py-3 text-lg">Cálculo de Décimo Tercer Mes</Button>
            </Link>
            <Link to="/carta-renuncia">
              <Button className="w-full py-3 text-lg">Generador de Carta de Renuncia</Button>
            </Link>
          </div>
          <p className="text-sm text-gray-600 mt-6">
            *Estas herramientas proporcionan estimaciones. Para cálculos oficiales o asesoría legal/fiscal, consulte a un experto.
          </p>
        </CardContent>
      </Card>
      <MadeWithDyad />
    </div>
  );
};

export default Index;