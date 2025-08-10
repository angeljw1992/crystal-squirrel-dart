"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, differenceInDays, differenceInYears, addYears, getYear } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Award, Sun, Gift, ShieldCheck, Info } from "lucide-react";
import AdBanner from "@/components/AdBanner";

const formSchema = z.object({
  startDate: z.date({ required_error: "La fecha de inicio es requerida." }),
  endDate: z.date({ required_error: "La fecha de fin es requerida." }),
  monthlySalary: z.coerce.number().min(0.01, "El salario mensual debe ser mayor a cero."),
  pendingVacationDays: z.coerce.number().min(0, "Los días de vacaciones deben ser un número positivo.").optional().default(0),
  terminationType: z.enum([
    "despido_injustificado",
    "despido_justificado",
    "renuncia_voluntaria",
    "renuncia_justificada",
    "mutuo_acuerdo",
    "expiracion_contrato",
    "conclusion_de_obra"
  ], { required_error: "El tipo de terminación es requerido." }),
});

const ResultRow = ({ icon: Icon, label, value }: { icon: React.ElementType, label: string, value: string }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-primary/80" />
      <span className="text-sm text-neutral-600 dark:text-neutral-300">{label}</span>
    </div>
    <span className="font-semibold text-neutral-800 dark:text-neutral-100">{value}</span>
  </div>
);

const Liquidacion = () => {
  const [result, setResult] = useState<any>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { monthlySalary: 0, pendingVacationDays: 0 },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { startDate, endDate, monthlySalary, pendingVacationDays, terminationType } = values;

    const totalDaysWorked = differenceInDays(endDate, startDate);
    if (totalDaysWorked < 0) {
        form.setError("endDate", { type: "manual", message: "La fecha de fin no puede ser anterior a la de inicio." });
        return;
    }

    const yearsWorked = differenceInYears(endDate, startDate);
    const lastAnniversary = addYears(startDate, yearsWorked);
    const remainingDaysAfterFullYears = differenceInDays(endDate, lastAnniversary);
    const monthsWorked = Math.floor(remainingDaysAfterFullYears / 30.44);
    const daysWorkedInMonth = Math.floor(remainingDaysAfterFullYears % 30.44);

    const dailySalary = monthlySalary / 30;
    const weeklySalary = (monthlySalary * 12) / 52;

    // Derechos Adquiridos
    const vacacionesAcumuladas = (pendingVacationDays || 0) * dailySalary;

    // Vacaciones Proporcionales: 1 día por cada 11 días trabajados desde el último aniversario.
    const daysForProportionalVacation = differenceInDays(endDate, lastAnniversary);
    const proportionalVacationDays = daysForProportionalVacation / 11;
    const vacacionesProporcionales = proportionalVacationDays * dailySalary;

    // Décimo Proporcional: Calculado desde el inicio del último período de pago.
    const endMonth = endDate.getMonth();
    const endYear = getYear(endDate);
    let decimoStartDate;
    if (endMonth < 4 || (endMonth === 4 && endDate.getDate() <= 15)) { // Periodo 1: 16-Dic a 15-Abr
        decimoStartDate = new Date(endYear - 1, 11, 16);
    } else if (endMonth < 8 || (endMonth === 8 && endDate.getDate() <= 15)) { // Periodo 2: 16-Abr a 15-Ago
        decimoStartDate = new Date(endYear, 3, 16);
    } else { // Periodo 3: 16-Ago a 15-Dic
        decimoStartDate = new Date(endYear, 7, 16);
    }
    const daysForDecimo = differenceInDays(endDate, decimoStartDate > startDate ? decimoStartDate : startDate);
    const decimoProporcional = (monthlySalary / 12) * (daysForDecimo / 30.44);

    let primaDeAntiguedad = 0;
    let indemnizacion = 0;
    let specialNote = "";
    const totalYearsFraction = totalDaysWorked / 365.25;

    switch (terminationType) {
      case 'despido_injustificado':
      case 'renuncia_justificada':
        primaDeAntiguedad = weeklySalary * totalYearsFraction;
        indemnizacion = 3.4 * weeklySalary * totalYearsFraction;
        specialNote = "El cálculo incluye indemnización por terminación injustificada y prima de antigüedad.";
        break;
      
      case 'renuncia_voluntaria':
      case 'expiracion_contrato':
      case 'mutuo_acuerdo':
        primaDeAntiguedad = weeklySalary * totalYearsFraction;
        if (terminationType === 'mutuo_acuerdo') {
          specialNote = "El cálculo incluye derechos adquiridos y prima de antigüedad. Cualquier bonificación adicional depende del acuerdo entre las partes.";
        } else {
          specialNote = "El cálculo incluye derechos adquiridos y prima de antigüedad.";
        }
        break;

      case 'conclusion_de_obra':
        indemnizacion = 3 * weeklySalary * totalYearsFraction;
        specialNote = "Incluye indemnización especial por terminación de obra. No aplica prima de antigüedad en este caso.";
        break;

      case 'despido_justificado':
        specialNote = "El cálculo solo incluye derechos adquiridos (vacaciones y décimo). No aplica indemnización ni prima de antigüedad.";
        break;
    }

    const totalLiquidacion = vacacionesAcumuladas + vacacionesProporcionales + decimoProporcional + primaDeAntiguedad + indemnizacion;
    
    setResult({
      vacacionesAcumuladas, vacacionesProporcionales, decimoProporcional,
      primaDeAntiguedad, indemnizacion, totalLiquidacion,
      yearsOfService: yearsWorked, monthsOfService: monthsWorked, daysOfService: daysWorkedInMonth,
      specialNote, endDate,
    });
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="p-0 mb-8">
        <CardTitle className="text-xl text-foreground">Calculadora de Liquidación</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Complete los campos para estimar su liquidación.</p>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField control={form.control} name="startDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fecha de Inicio</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={es} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="endDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fecha de Terminación</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={es} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="monthlySalary" render={({ field }) => (<FormItem><FormLabel>Último Salario Mensual ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="pendingVacationDays" render={({ field }) => (<FormItem><FormLabel>Días de Vacaciones Pendientes</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <div className="md:col-span-2">
                <FormField control={form.control} name="terminationType" render={({ field }) => (<FormItem><FormLabel>Tipo de Terminación</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un motivo" /></SelectTrigger></FormControl><SelectContent>
                  <SelectItem value="despido_injustificado">Despido Injustificado</SelectItem>
                  <SelectItem value="despido_justificado">Despido Justificado</SelectItem>
                  <SelectItem value="renuncia_voluntaria">Renuncia Voluntaria</SelectItem>
                  <SelectItem value="renuncia_justificada">Renuncia Justificada</SelectItem>
                  <SelectItem value="mutuo_acuerdo">Mutuo Acuerdo</SelectItem>
                  <SelectItem value="expiracion_contrato">Expiración de Contrato</SelectItem>
                  <SelectItem value="conclusion_de_obra">Conclusión de Obra</SelectItem>
                </SelectContent></Select><FormMessage /></FormItem>)} />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto" size="lg">Calcular Liquidación</Button>
          </form>
        </Form>
        {result && (
          <div className="mt-12 p-6 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800/50 border rounded-xl shadow-lg shadow-primary/10">
            <h3 className="text-lg font-semibold mb-2 text-center text-foreground">Resultados del Cálculo</h3>
            <div className="divide-y divide-neutral-200/70 dark:divide-neutral-700/70">
              <ResultRow icon={Clock} label="Tiempo de Servicio" value={`${result.yearsOfService}a ${result.monthsOfService}m ${result.daysOfService}d`} />
              <ResultRow icon={CalendarIcon} label="Fecha de Salida" value={format(result.endDate, "dd 'de' MMMM 'de' yyyy", { locale: es })} />
              {result.vacacionesAcumuladas > 0 && <ResultRow icon={Sun} label="Vacaciones Pendientes" value={`$${result.vacacionesAcumuladas.toFixed(2)}`} />}
              <ResultRow icon={Sun} label="Vacaciones Proporcionales" value={`$${result.vacacionesProporcionales.toFixed(2)}`} />
              <ResultRow icon={Gift} label="Décimo Proporcional" value={`$${result.decimoProporcional.toFixed(2)}`} />
              {result.primaDeAntiguedad > 0 && <ResultRow icon={Award} label="Prima de Antigüedad" value={`$${result.primaDeAntiguedad.toFixed(2)}`} />}
              {result.indemnizacion > 0 && <ResultRow icon={ShieldCheck} label="Indemnización" value={`$${result.indemnizacion.toFixed(2)}`} />}
            </div>
            {result.specialNote && (
              <div className="mt-4 p-3 bg-blue-100/50 dark:bg-blue-900/20 border-l-4 border-blue-500 text-blue-800 dark:text-blue-200 text-sm rounded-r-lg">
                <div className="flex items-start gap-3">
                  <Info className="h-5 w-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
                  <p><strong className="font-semibold">Nota:</strong> {result.specialNote}</p>
                </div>
              </div>
            )}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Liquidación Estimada</p>
              <p className="text-4xl font-bold text-primary mt-1">${result.totalLiquidacion.toFixed(2)}</p>
            </div>
            <p className="text-xs text-neutral-500 mt-6 text-center">*Este cálculo es una estimación. Consulte a un profesional para un cálculo exacto y asesoría legal.</p>
          </div>
        )}
        <AdBanner />
      </CardContent>
    </Card>
  );
};

export default Liquidacion;