"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { DollarSign, Clock, MinusCircle, Shield, BookOpen, Percent } from "lucide-react";
import AdBanner from "@/components/AdBanner";

const formSchema = z.object({
  grossSalary: z.coerce.number().min(0, "El salario bruto debe ser un número positivo."),
  overtimeHours: z.coerce.number().min(0, "Las horas extras deben ser un número positivo.").optional().default(0),
  otherIncome: z.coerce.number().min(0, "Otros ingresos deben ser un número positivo.").optional().default(0),
  otherDeductions: z.coerce.number().min(0, "Otras deducciones deben ser un número positivo.").optional().default(0),
});

const ResultRow = ({ icon: Icon, label, value, colorClass = "text-neutral-800 dark:text-neutral-100" }: { icon: React.ElementType, label: string, value: string, colorClass?: string }) => (
  <div className="flex items-center justify-between py-3">
    <div className="flex items-center gap-3">
      <Icon className="h-5 w-5 text-primary/80" />
      <span className="text-sm text-neutral-600 dark:text-neutral-300">{label}</span>
    </div>
    <span className={`font-semibold ${colorClass}`}>{value}</span>
  </div>
);

const Salario = () => {
  const [result, setResult] = useState<any>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { grossSalary: 0, overtimeHours: 0, otherIncome: 0, otherDeductions: 0 },
  });

  const calculateISR = (annualTaxableIncome: number): number => {
    if (annualTaxableIncome <= 11000) return 0;
    if (annualTaxableIncome <= 50000) return (annualTaxableIncome - 11000) * 0.15;
    return (39000 * 0.15) + (annualTaxableIncome - 50000) * 0.25;
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { grossSalary, overtimeHours, otherIncome, otherDeductions } = values;
    const cssDeduction = grossSalary * 0.0975;
    const seguroEducativoDeduction = grossSalary * 0.0125;
    const hourlyRate = grossSalary / (4.33 * 40); // More accurate hourly rate
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    const totalIncome = grossSalary + overtimePay + otherIncome;
    const annualTaxableIncome = (grossSalary * 13) - (13 * (cssDeduction + seguroEducativoDeduction));
    const annualISR = calculateISR(annualTaxableIncome);
    const monthlyISR = annualISR / 12;
    const totalDeductions = cssDeduction + seguroEducativoDeduction + otherDeductions + monthlyISR;
    const netSalary = totalIncome - totalDeductions;
    setResult({ cssDeduction, seguroEducativoDeduction, overtimePay, totalIncome, monthlyISR, otherDeductions, totalDeductions, netSalary });
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="p-0 mb-8">
        <CardTitle className="text-xl text-foreground">Cálculo de Salario Neto</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Ingrese sus ingresos y deducciones para calcular su salario neto mensual.</p>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField control={form.control} name="grossSalary" render={({ field }) => (<FormItem><FormLabel>Salario Bruto Mensual ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="overtimeHours" render={({ field }) => (<FormItem><FormLabel>Horas Extras (cantidad)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="otherIncome" render={({ field }) => (<FormItem><FormLabel>Otros Ingresos ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="otherDeductions" render={({ field }) => (<FormItem><FormLabel>Otras Deducciones ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
            </div>
            <Button type="submit" className="w-full md:w-auto" size="lg">Calcular Salario Neto</Button>
          </form>
        </Form>
        {result && (
          <div className="mt-12 p-6 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800/50 border rounded-xl shadow-lg shadow-primary/10">
            <h3 className="text-lg font-semibold mb-2 text-center text-foreground">Desglose de Salario</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <div>
                <h4 className="font-semibold text-center text-green-600 dark:text-green-400 mb-2">Ingresos</h4>
                <div className="divide-y divide-neutral-200/70 dark:divide-neutral-700/70">
                  <ResultRow icon={DollarSign} label="Salario Bruto" value={`$${result.totalIncome.toFixed(2)}`} colorClass="text-green-600 dark:text-green-400" />
                  <ResultRow icon={Clock} label="Horas Extras" value={`$${result.overtimePay.toFixed(2)}`} />
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-center text-red-600 dark:text-red-400 mb-2">Deducciones</h4>
                <div className="divide-y divide-neutral-200/70 dark:divide-neutral-700/70">
                  <ResultRow icon={Shield} label="Seguro Social (9.75%)" value={`$${result.cssDeduction.toFixed(2)}`} colorClass="text-red-600 dark:text-red-400" />
                  <ResultRow icon={BookOpen} label="Seguro Educativo (1.25%)" value={`$${result.seguroEducativoDeduction.toFixed(2)}`} />
                  <ResultRow icon={Percent} label="Impuesto S/L Renta" value={`$${result.monthlyISR.toFixed(2)}`} />
                  <ResultRow icon={MinusCircle} label="Otras Deducciones" value={`$${result.otherDeductions.toFixed(2)}`} />
                </div>
              </div>
            </div>
            <div className="mt-6 pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Salario Neto Estimado</p>
              <p className="text-4xl font-bold text-primary mt-1">${result.netSalary.toFixed(2)}</p>
            </div>
            <p className="text-xs text-neutral-500 mt-6 text-center">*Este cálculo es una estimación. Consulte a un profesional para un cálculo exacto.</p>
          </div>
        )}
        <AdBanner />
      </CardContent>
    </Card>
  );
};

export default Salario;