"use client";

import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, differenceInDays, differenceInYears } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Award, Sun, Gift, ShieldCheck, Megaphone, AlertTriangle } from "lucide-react";
import AdBanner from "@/components/AdBanner";

const formSchema = z.object({
  contractType: z.enum(["indefinido", "definido"], { required_error: "El tipo de contrato es requerido." }),
  terminationReason: z.enum(["mutuo_acuerdo", "despido_justificado", "despido_injustificado", "renuncia", "obra_terminada"], { required_error: "El motivo de terminación es requerido." }),
  startDate: z.date({ required_error: "La fecha de inicio es requerida." }),
  endDate: z.date({ required_error: "La fecha de fin es requerida." }),
  monthlySalary: z.coerce.number().min(0.01, "El salario mensual debe ser mayor a cero."),
  pendingVacationDays: z.coerce.number().min(0, "Los días de vacaciones deben ser un número positivo.").optional().default(0),
  pendingThirteenthMonth: z.coerce.number().min(0, "El décimo pendiente debe ser un número positivo.").optional().default(0),
  preaviso: z.boolean().default(false).optional(),
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
    defaultValues: { monthlySalary: 0, pendingVacationDays: 0, pendingThirteenthMonth: 0, preaviso: false },
  });

  const terminationReason = form.watch("terminationReason");

  useEffect(() => {
    if (terminationReason === 'obra_terminada') {
      form.setValue('contractType', 'definido');
    }
  }, [terminationReason, form]);

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { contractType, terminationReason, startDate, endDate, monthlySalary, pendingVacationDays, pendingThirteenthMonth, preaviso } = values;

    const daysOfService = differenceInDays(endDate, startDate);
    if (daysOfService < 0) {
        form.setError("endDate", { type: "manual", message: "La fecha de fin no puede ser anterior a la de inicio." });
        return;
    }
    const yearsOfService = differenceInYears(endDate, startDate);
    const dailySalary = monthlySalary / 30;
    const weeklySalary = (monthlySalary * 12) / 52;

    // Acquired Rights (Derechos Adquiridos)
    const vacacionesPendientesPagadas = (pendingVacationDays || 0) * dailySalary;
    const decimoPendientePagado = pendingThirteenthMonth || 0;
    const vacacionesProporcionales = (daysOfService / 365) * 30 * dailySalary;
    const decimoProporcional = monthlySalary * (daysOfService / 365);

    let primaDeAntiguedad = 0;
    let indemnizacion = 0;
    let pagoPreaviso = 0;
    let specialNote = "";

    if (contractType === 'indefinido') {
      primaDeAntiguedad = weeklySalary * yearsOfService;
    }

    if (terminationReason === 'despido_injustificado') {
      if (contractType === 'indefinido') {
        indemnizacion = 3.4 * weeklySalary * (daysOfService / 365);
        if (!preaviso) {
          pagoPreaviso = monthlySalary;
        }
      } else { // 'definido'
        specialNote = "Para contratos de término definido, la indemnización por despido injustificado corresponde a los salarios restantes hasta la finalización del contrato. Este cálculo no puede ser realizado automáticamente.";
      }
    } else if (terminationReason === 'obra_terminada') {
      indemnizacion = 3 * weeklySalary * (daysOfService / 365);
      primaDeAntiguedad = 0; // This termination reason has its own special indemnity, not seniority premium.
    }

    const totalLiquidacion = vacacionesPendientesPagadas + decimoPendientePagado + vacacionesProporcionales + decimoProporcional + primaDeAntiguedad + indemnizacion + pagoPreaviso;
    
    setResult({
      vacacionesPendientesPagadas, decimoPendientePagado, vacacionesProporcionales, decimoProporcional,
      primaDeAntiguedad, indemnizacion, pagoPreaviso, totalLiquidacion,
      yearsOfService, monthsOfService: differenceInDays(endDate, startDate) / 30 % 12, daysOfService: daysOfService % 30,
      specialNote,
    });
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="p-0 mb-8">
        <CardTitle className="text-xl text-foreground">Cálculo de Liquidación</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Ingrese los datos para calcular su liquidación según el motivo de terminación.</p>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField control={form.control} name="terminationReason" render={({ field }) => (<FormItem><FormLabel>Motivo de Terminación</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un motivo" /></SelectTrigger></FormControl><SelectContent><SelectItem value="renuncia">Renuncia Voluntaria</SelectItem><SelectItem value="mutuo_acuerdo">Mutuo Acuerdo</SelectItem><SelectItem value="despido_justificado">Despido Justificado</SelectItem><SelectItem value="despido_injustificado">Despido Injustificado</SelectItem><SelectItem value="obra_terminada">Terminación de Obra</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="contractType" render={({ field }) => (<FormItem><FormLabel>Tipo de Contrato</FormLabel><Select onValueChange={field.onChange} value={field.value} disabled={terminationReason === 'obra_terminada'}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione un tipo" /></SelectTrigger></FormControl><SelectContent><SelectItem value="indefinido">Indefinido</SelectItem><SelectItem value="definido">Definido / Obra</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="monthlySalary" render={({ field }) => (<FormItem><FormLabel>Último Salario Mensual ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="startDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fecha de Inicio</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={es} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="endDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fecha de Fin</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={es} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="pendingVacationDays" render={({ field }) => (<FormItem><FormLabel>Días de Vacaciones Acumulados</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="pendingThirteenthMonth" render={({ field }) => (<FormItem><FormLabel>Décimo Acumulado ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
              {terminationReason === 'despido_injustificado' && (
                <FormField control={form.control} name="preaviso" render={({ field }) => (<FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 md:col-span-2"><FormControl><Checkbox checked={field.value} onCheckedChange={field.onChange} /></FormControl><div className="space-y-1 leading-none"><FormLabel>¿Recibió el preaviso de 30 días?</FormLabel><p className="text-xs text-muted-foreground">Marque esta casilla si su empleador le notificó su despido con 30 días o más de anticipación.</p></div></FormItem>)} />
              )}
            </div>
            <Button type="submit" className="w-full md:w-auto" size="lg">Calcular Liquidación</Button>
          </form>
        </Form>
        {result && (
          <div className="mt-12 p-6 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800/50 border rounded-xl shadow-lg shadow-primary/10">
            <h3 className="text-lg font-semibold mb-2 text-center text-foreground">Resultados del Cálculo</h3>
            <div className="divide-y divide-neutral-200/70 dark:divide-neutral-700/70">
              <ResultRow icon={Clock} label="Tiempo de Servicio" value={`${result.yearsOfService}a ${Math.floor(result.monthsOfService)}m ${Math.floor(result.daysOfService)}d`} />
              <ResultRow icon={Sun} label="Vacaciones Proporcionales" value={`$${result.vacacionesProporcionales.toFixed(2)}`} />
              <ResultRow icon={Gift} label="Décimo Proporcional" value={`$${result.decimoProporcional.toFixed(2)}`} />
              {result.vacacionesPendientesPagadas > 0 && <ResultRow icon={Sun} label="Vacaciones Acumuladas" value={`$${result.vacacionesPendientesPagadas.toFixed(2)}`} />}
              {result.decimoPendientePagado > 0 && <ResultRow icon={Gift} label="Décimo Acumulado" value={`$${result.decimoPendientePagado.toFixed(2)}`} />}
              {result.primaDeAntiguedad > 0 && <ResultRow icon={Award} label="Prima de Antigüedad" value={`$${result.primaDeAntiguedad.toFixed(2)}`} />}
              {result.indemnizacion > 0 && <ResultRow icon={ShieldCheck} label="Indemnización" value={`$${result.indemnizacion.toFixed(2)}`} />}
              {result.pagoPreaviso > 0 && <ResultRow icon={Megaphone} label="Falta de Preaviso" value={`$${result.pagoPreaviso.toFixed(2)}`} />}
            </div>
            {result.specialNote && (
              <div className="mt-4 p-3 bg-yellow-100/50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 text-yellow-800 dark:text-yellow-200 text-sm rounded-r-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 dark:text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p><strong className="font-semibold">Nota Importante:</strong> {result.specialNote}</p>
                </div>
              </div>
            )}
            <div className="mt-6 pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Liquidación Estimada</p>
              <p className="text-4xl font-bold text-primary mt-1">${result.totalLiquidacion.toFixed(2)}</p>
            </div>
            <p className="text-xs text-neutral-500 mt-6 text-center">*Este cálculo es una estimación basada en aproximaciones de la ley. Consulte a un profesional de recursos humanos o un abogado laboral para un cálculo exacto y asesoría legal.</p>
          </div>
        )}
        <AdBanner />
      </CardContent>
    </Card>
  );
};

export default Liquidacion;