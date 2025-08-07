"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z.object({
  grossSalary: z.coerce.number().min(0, "El salario bruto debe ser un número positivo."),
  overtimeHours: z.coerce.number().min(0, "Las horas extras deben ser un número positivo.").optional().default(0),
  otherIncome: z.coerce.number().min(0, "Otros ingresos deben ser un número positivo.").optional().default(0),
  otherDeductions: z.coerce.number().min(0, "Otras deducciones deben ser un número positivo.").optional().default(0),
});

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
    const hourlyRate = grossSalary / 160;
    const overtimePay = overtimeHours * hourlyRate * 1.5;
    const totalIncome = grossSalary + overtimePay + otherIncome;
    const monthlyTaxableIncome = totalIncome - cssDeduction - seguroEducativoDeduction;
    const annualTaxableIncome = monthlyTaxableIncome * 12;
    const annualISR = calculateISR(annualTaxableIncome);
    const monthlyISR = annualISR / 12;
    const totalDeductions = cssDeduction + seguroEducativoDeduction + otherDeductions + monthlyISR;
    const netSalary = totalIncome - totalDeductions;

    setResult({
      grossSalary, overtimePay, otherIncome, cssDeduction, seguroEducativoDeduction,
      monthlyISR, otherDeductions, totalIncome, totalDeductions, netSalary,
    });
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="p-0 mb-8">
        <CardTitle className="text-xl text-foreground">Cálculo de Salario Neto</CardTitle>
        <p className="text-sm text-neutral-600">
          Ingrese los datos para calcular el salario neto, incluyendo deducciones de CSS, S.E. e ISR.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField
                control={form.control}
                name="grossSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario Bruto Mensual ($)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="overtimeHours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Horas Extras (cantidad)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherIncome"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Otros Ingresos ($)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="otherDeductions"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Otras Deducciones ($)</FormLabel>
                    <FormControl><Input type="number" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button type="submit" className="w-full md:w-auto" size="lg">Calcular Salario Neto</Button>
          </form>
        </Form>

        {result && (
          <div className="mt-12 p-6 border rounded-lg bg-neutral-50">
            <h3 className="text-lg font-semibold mb-6 text-center text-foreground">Resultados del Cálculo</h3>
            <div className="space-y-3 text-sm text-neutral-800">
              <p><strong className="font-semibold text-neutral-900">Salario Bruto:</strong> ${result.grossSalary.toFixed(2)}</p>
              <p><strong className="font-semibold text-neutral-900">Pago por Horas Extras:</strong> ${result.overtimePay.toFixed(2)}</p>
              <p><strong className="font-semibold text-neutral-900">Otros Ingresos:</strong> ${result.otherIncome.toFixed(2)}</p>
              <p><strong className="font-semibold text-neutral-900">Deducción CSS (9.75%):</strong> ${result.cssDeduction.toFixed(2)}</p>
              <p><strong className="font-semibold text-neutral-900">Deducción S. Educativo (1.25%):</strong> ${result.seguroEducativoDeduction.toFixed(2)}</p>
              <p><strong className="font-semibold text-neutral-900">Impuesto Sobre la Renta (ISR):</strong> ${result.monthlyISR.toFixed(2)}</p>
              <p><strong className="font-semibold text-neutral-900">Otras Deducciones:</strong> ${result.otherDeductions.toFixed(2)}</p>
              <p><strong className="font-semibold text-neutral-900">Ingresos Totales:</strong> ${result.totalIncome.toFixed(2)}</p>
              <p><strong className="font-semibold text-neutral-900">Deducciones Totales:</strong> ${result.totalDeductions.toFixed(2)}</p>
              <p className="text-lg font-bold mt-6 pt-4 border-t !text-primary-700">Salario Neto Estimado: ${result.netSalary.toFixed(2)}</p>
            </div>
            <p className="text-xs text-destructive-700 mt-6 text-center">
              *Este cálculo es una estimación simplificada del ISR. Consulte a un contador para un cálculo exacto.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default Salario;