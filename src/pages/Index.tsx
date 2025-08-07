import { Link } from "react-router-dom";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Calculator, Wallet, CalendarDays, FileText } from "lucide-react";

const tools = [
  {
    to: "/liquidacion",
    label: "Calculadora de Liquidación",
    description: "Estime su liquidación por terminación de contrato, ya sea por despido o renuncia.",
    icon: Calculator,
  },
  {
    to: "/salario",
    label: "Calculadora de Salario Neto",
    description: "Calcule su salario neto mensual después de deducciones de CSS y seguro educativo.",
    icon: Wallet,
  },
  {
    to: "/decimo-tercer-mes",
    label: "Calculadora de Décimo Tercer Mes",
    description: "Calcule el monto correspondiente a cada partida del décimo tercer mes.",
    icon: CalendarDays,
  },
  {
    to: "/carta-renuncia",
    label: "Generador de Carta de Renuncia",
    description: "Cree una carta de renuncia profesional y lista para descargar en formato PDF.",
    icon: FileText,
  },
];

const Index = () => {
  return (
    <div className="w-full">
      <div className="text-center mb-12">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
          Su Asistente Laboral en Panamá
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto">
          Bienvenido a la herramienta definitiva para entender sus derechos laborales en Panamá. Aquí puede realizar cálculos precisos de su liquidación, salario neto, y décimo tercer mes. Además, genere una carta de renuncia profesional en segundos. Todo en un solo lugar, de forma gratuita y fácil de usar.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link to={tool.to} key={tool.to} className="group">
            <Card className="h-full hover:border-primary hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center gap-4">
                <div className="bg-primary/10 p-3 rounded-lg">
                  <tool.icon className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-lg group-hover:text-primary transition-colors">
                    {tool.label}
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription>{tool.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
      
      <div className="mt-12 text-center text-sm text-neutral-500">
        <p>Palabras clave: cálculo de liquidación Panamá, cálculo de salario, carta de renuncia, décimo tercer mes, prestaciones laborales, salario neto, derechos laborales, código de trabajo Panamá, calculadora laboral.</p>
      </div>
    </div>
  );
};

export default Index;