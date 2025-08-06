"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
    defaultValues: {
      grossSalary: 0,
      overtimeHours: 0,
      otherIncome: 0,
      otherDeductions: 0,
    },
  });

  const calculateISR = (annualTaxableIncome: number): number => {
    let isr = 0;
    // Simplified ISR brackets for Panama (example, not official or exhaustive)
    // These brackets are for annual income.
    if (annualTaxableIncome <= 11000) {
      isr = 0;
    } else if (annualTaxableIncome <= 50000) {
      isr = (annualTaxableIncome - 11000) * 0.15;
    } else {
      isr = (39000 * 0.15) + (annualTaxableIncome - 50000) * 0.25; // 39000 = 50000 - 11000
    }
    return isr;
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { grossSalary, overtimeHours, otherIncome, otherDeductions } = values;

    // Simplified calculations for Panama
    // CSS (Caja de Seguro Social) - Employee contribution: 9.75%
    const cssDeduction = grossSalary * 0.0975;

    // Seguro Educativo - Employee contribution: 1.25%
    const seguroEducativoDeduction = grossSalary * 0.0125;

    // Overtime calculation (simplified: assuming 1.25x for regular overtime, 1.5x for night/holiday)
    // For simplicity, let's assume a fixed hourly rate and a general overtime multiplier
    const hourlyRate = grossSalary / 160; // Assuming 160 working hours per month
    const overtimePay = overtimeHours * hourlyRate * 1.5; // Example: 1.5x for all overtime

    const totalIncome = grossSalary + overtimePay + otherIncome;
    
    // Taxable income for ISR (gross income - CSS deduction - Seguro Educativo)
    const monthlyTaxableIncome = totalIncome - cssDeduction - seguroEducativoDeduction;
    const annualTaxableIncome = monthlyTaxableIncome * 12; // Convert to annual for ISR calculation

    const annualISR = calculateISR(annualTaxableIncome);
    const monthlyISR = annualISR / 12; // Convert annual ISR back to monthly

    const totalDeductions = cssDeduction + seguroEducativoDeduction + otherDeductions + monthlyISR;
    const netSalary = totalIncome - totalDeductions;

    setResult({
      grossSalary,
      overtimePay,
      otherIncome,
      cssDeduction,
      seguroEducativoDeduction, // Add to result
      monthlyISR,
      otherDeductions,
      totalIncome,
      totalDeductions,
      netSalary,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Cálculo de Salario Neto</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Ingrese los datos para calcular el salario neto. Este cálculo incluye deducciones básicas de CSS, Seguro Educativo e ISR.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="grossSalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario Bruto Mensual ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
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
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Calcular Salario Neto</Button>
            </form>
          </Form>

          {result && (
            <div className="mt-8 p-4 border rounded-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-4 text-center">Resultados del Cálculo</h3>
              <div className="space-y-2">
                <p><strong>Salario Bruto Ingresado:</strong> ${result.grossSalary.toFixed(2)}</p>
                <p><strong>Pago por Horas Extras:</strong> ${result.overtimePay.toFixed(2)}</p>
                <p><strong>Otros Ingresos:</strong> ${result.otherIncome.toFixed(2)}</p>
                <p><strong>Deducción CSS (9.75%):</strong> ${result.cssDeduction.toFixed(2)}</p>
                <p><strong>Deducción Seguro Educativo (1.25%):</strong> ${result.seguroEducativoDeduction.toFixed(2)}</p>
                <p><strong>Impuesto Sobre la Renta (ISR):</strong> ${result.monthlyISR.toFixed(2)}</p>
                <p><strong>Otras Deducciones:</strong> ${result.otherDeductions.toFixed(2)}</p>
                <p><strong>Ingresos Totales:</strong> ${result.totalIncome.toFixed(2)}</p>
                <p><strong>Deducciones Totales:</strong> ${result.totalDeductions.toFixed(2)}</p>
                <p className="text-lg font-bold mt-4">Salario Neto Estimado: ${result.netSalary.toFixed(2)}</p>
              </div>
              <p className="text-xs text-red-500 mt-4">
                *Este cálculo es una estimación simplificada del Impuesto Sobre la Renta (ISR) y no considera todas las variables o deducciones permitidas por la ley panameña. Las leyes fiscales pueden cambiar. Consulte a un contador o profesional para un cálculo exacto y asesoría fiscal.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Salario;