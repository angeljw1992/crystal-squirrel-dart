"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, differenceInDays, differenceInMonths, differenceInYears } from "date-fns";
import { es } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, Clock, Award, Sun, Gift } from "lucide-react";
import AdBanner from "@/components/AdBanner";

const formSchema = z.object({
  contractType: z.enum(["indefinido", "definido", "obra_terminada"], { required_error: "El tipo de contrato es requerido." }),
  startDate: z.date({ required_error: "La fecha de inicio es requerida." }),
  endDate: z.date({ required_error: "La fecha de fin es requerida." }),
  monthlySalary: z.coerce.number().min(0, "El salario mensual debe ser un número positivo."),
  pendingVacationDays: z.coerce.number().min(0, "Los días de vacaciones deben ser un número positivo.").optional().default(0),
  pendingThirteenthMonth: z.coerce.number().min(0, "El décimo tercer mes pendiente debe ser un número positivo.").optional().default(0),
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
    defaultValues: { monthlySalary: 0, pendingVacationDays: 0, pendingThirteenthMonth: 0 },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { contractType, startDate, endDate, monthlySalary, pendingVacationDays, pendingThirteenthMonth } = values;
    const yearsOfService = differenceInYears(endDate, startDate);
    const monthsOfService = differenceInMonths(endDate, startDate) % 12;
    const daysOfService = differenceInDays(endDate, startDate);
    let antiguedad = 0;
    if (contractType === 'indefinido') {
      const totalMonths = yearsOfService * 12 + monthsOfService;
      if (totalMonths >= 3) {
        const weeklySalary = (monthlySalary * 12) / 52;
        antiguedad = weeklySalary * yearsOfService;
      }
    }
    const dailySalary = monthlySalary / 26; // Based on 26 working days
    const proportionalVacation = (11 * dailySalary) * (differenceInMonths(endDate, startDate) / 12);
    const proportionalThirteenthMonth = (monthlySalary / 3) * (differenceInMonths(endDate, startDate) / 4);
    const totalLiquidacion = antiguedad + proportionalVacation + proportionalThirteenthMonth + (pendingVacationDays * dailySalary) + pendingThirteenthMonth;
    setResult({
      antiguedad, proportionalVacation, proportionalThirteenthMonth,
      pendingVacationDays: pendingVacationDays * dailySalary,
      pendingThirteenthMonth, totalLiquidacion, yearsOfService,
      monthsOfService, daysOfService: daysOfService % 30,
    });
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="p-0 mb-8">
        <CardTitle className="text-xl text-foreground">Cálculo de Liquidación</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Ingrese los datos para calcular su liquidación.</p>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField control={form.control} name="contractType" render={({ field }) => (<FormItem><FormLabel>Tipo de Contrato</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione el tipo de contrato" /></SelectTrigger></FormControl><SelectContent><SelectItem value="indefinido">Indefinido</SelectItem><SelectItem value="definido">Definido</SelectItem><SelectItem value="obra_terminada">Obra Terminada</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="monthlySalary" render={({ field }) => (<FormItem><FormLabel>Salario Mensual ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="startDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fecha de Inicio</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={es} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="endDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fecha de Fin</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={es} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="pendingVacationDays" render={({ field }) => (<FormItem><FormLabel>Días de Vacaciones Pendientes</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="pendingThirteenthMonth" render={({ field }) => (<FormItem><FormLabel>Décimo Pendiente ($)</FormLabel><FormControl><Input type="number" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <Button type="submit" className="w-full md:w-auto" size="lg">Calcular Liquidación</Button>
          </form>
        </Form>
        {result && (
          <div className="mt-12 p-6 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800/50 border rounded-xl shadow-lg shadow-primary/10">
            <h3 className="text-lg font-semibold mb-2 text-center text-foreground">Resultados del Cálculo</h3>
            <div className="divide-y divide-neutral-200/70 dark:divide-neutral-700/70">
              <ResultRow icon={Clock} label="Tiempo de Servicio" value={`${result.yearsOfService}a ${result.monthsOfService}m ${result.daysOfService}d`} />
              <ResultRow icon={Award} label="Prima de Antigüedad" value={`$${result.antiguedad.toFixed(2)}`} />
              <ResultRow icon={Sun} label="Vacaciones Proporcionales" value={`$${result.proportionalVacation.toFixed(2)}`} />
              <ResultRow icon={Gift} label="Décimo Proporcional" value={`$${result.proportionalThirteenthMonth.toFixed(2)}`} />
              {result.pendingVacationDays > 0 && <ResultRow icon={Sun} label="Vacaciones Pendientes" value={`$${result.pendingVacationDays.toFixed(2)}`} />}
              {result.pendingThirteenthMonth > 0 && <ResultRow icon={Gift} label="Décimo Pendiente" value={`$${result.pendingThirteenthMonth.toFixed(2)}`} />}
            </div>
            <div className="mt-6 pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Total Liquidación Estimada</p>
              <p className="text-4xl font-bold text-primary mt-1">${result.totalLiquidacion.toFixed(2)}</p>
            </div>
            <p className="text-xs text-neutral-500 mt-6 text-center">*Este cálculo es una estimación. Consulte a un profesional para un cálculo exacto.</p>
          </div>
        )}
        <AdBanner />
      </CardContent>
    </Card>
  );
};

export default Liquidacion;