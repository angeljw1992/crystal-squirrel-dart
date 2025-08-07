"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DollarSign, Shield, BookOpen, Percent } from "lucide-react";
import AdBanner from "@/components/AdBanner";

const formSchema = z.object({
  grossSalary: z.coerce.number().min(0, "El salario bruto debe ser un número positivo."),
  payFrequency: z.enum(["mensual", "quincenal"], { required_error: "Debe seleccionar una frecuencia." }),
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
    defaultValues: { grossSalary: 0, payFrequency: "mensual" },
  });

  const calculateISR = (annualTaxableIncome: number): number => {
    if (annualTaxableIncome <= 11000) return 0;
    if (annualTaxableIncome <= 50000) return (annualTaxableIncome - 11000) * 0.15;
    // The fixed amount for the 15% bracket is $5,850 (which is 15% of $39,000)
    return 5850 + (annualTaxableIncome - 50000) * 0.25;
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { grossSalary, payFrequency } = values;

    const monthlyGrossSalary = payFrequency === 'quincenal' ? grossSalary * 2 : grossSalary;

    const cssDeductionMonthly = monthlyGrossSalary * 0.0975;
    const seguroEducativoDeductionMonthly = monthlyGrossSalary * 0.0125;

    // ISR is calculated on annual taxable income (12 months), as the 13th month is exempt.
    const annualTaxableIncome = (monthlyGrossSalary * 12) - (cssDeductionMonthly * 12) - (seguroEducativoDeductionMonthly * 12);
    const annualISR = calculateISR(annualTaxableIncome);
    const monthlyISR = annualISR / 12;

    let resultData;

    if (payFrequency === 'mensual') {
      const totalDeductions = cssDeductionMonthly + seguroEducativoDeductionMonthly + monthlyISR;
      const netSalary = monthlyGrossSalary - totalDeductions;
      resultData = {
        grossSalary: monthlyGrossSalary,
        cssDeduction: cssDeductionMonthly,
        seguroEducativoDeduction: seguroEducativoDeductionMonthly,
        isr: monthlyISR,
        totalDeductions: totalDeductions,
        netSalary: netSalary,
        payFrequency: 'Mensual'
      };
    } else { // quincenal
      const cssDeductionQuincenal = cssDeductionMonthly / 2;
      const seguroEducativoDeductionQuincenal = seguroEducativoDeductionMonthly / 2;
      const isrQuincenal = monthlyISR / 2;
      const totalDeductions = cssDeductionQuincenal + seguroEducativoDeductionQuincenal + isrQuincenal;
      const netSalary = grossSalary - totalDeductions;
      resultData = {
        grossSalary: grossSalary,
        cssDeduction: cssDeductionQuincenal,
        seguroEducativoDeduction: seguroEducativoDeductionQuincenal,
        isr: isrQuincenal,
        totalDeductions: totalDeductions,
        netSalary: netSalary,
        payFrequency: 'Quincenal'
      };
    }
    setResult(resultData);
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="p-0 mb-8">
        <CardTitle className="text-xl text-foreground">Cálculo de Salario Neto</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Ingrese su salario bruto para estimar su salario neto.</p>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField control={form.control} name="grossSalary" render={({ field }) => (<FormItem><FormLabel>Salario Bruto ($)</FormLabel><FormControl><Input type="number" step="0.01" {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="payFrequency" render={({ field }) => (<FormItem><FormLabel>Frecuencia de Pago</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Seleccione..." /></SelectTrigger></FormControl><SelectContent><SelectItem value="mensual">Mensual</SelectItem><SelectItem value="quincenal">Quincenal</SelectItem></SelectContent></Select><FormMessage /></FormItem>)} />
            </div>
            <Button type="submit" className="w-full md:w-auto" size="lg">Calcular Salario Neto</Button>
          </form>
        </Form>
        {result && (
          <div className="mt-12 p-6 bg-gradient-to-br from-neutral-50 to-white dark:from-neutral-900 dark:to-neutral-800/50 border rounded-xl shadow-lg shadow-primary/10">
            <h3 className="text-lg font-semibold mb-2 text-center text-foreground">Desglose de Salario ({result.payFrequency})</h3>
            <div className="divide-y divide-neutral-200/70 dark:divide-neutral-700/70 max-w-md mx-auto">
                <ResultRow icon={DollarSign} label="Salario Bruto" value={`$${result.grossSalary.toFixed(2)}`} colorClass="text-green-600 dark:text-green-400" />
                <ResultRow icon={Shield} label="Seguro Social (9.75%)" value={`-$${result.cssDeduction.toFixed(2)}`} colorClass="text-red-600 dark:text-red-400" />
                <ResultRow icon={BookOpen} label="Seguro Educativo (1.25%)" value={`-$${result.seguroEducativoDeduction.toFixed(2)}`} colorClass="text-red-600 dark:text-red-400" />
                <ResultRow icon={Percent} label="Impuesto S/L Renta" value={`-$${result.isr.toFixed(2)}`} colorClass="text-red-600 dark:text-red-400" />
            </div>
            <div className="mt-6 pt-4 border-t-2 border-dashed border-neutral-300 dark:border-neutral-700 text-center">
              <p className="text-sm text-neutral-600 dark:text-neutral-400">Salario Neto Estimado ({result.payFrequency})</p>
              <p className="text-4xl font-bold text-primary mt-1">${result.netSalary.toFixed(2)}</p>
            </div>
            <p className="text-xs text-neutral-500 mt-6 text-center">*Este cálculo es una estimación y no incluye otras deducciones o ingresos. Consulte a un profesional para un cálculo exacto.</p>
          </div>
        )}
        <AdBanner />
      </CardContent>
    </Card>
  );
};

export default Salario;