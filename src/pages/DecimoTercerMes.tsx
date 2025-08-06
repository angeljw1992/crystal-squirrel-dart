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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  periodType: z.enum(["primer", "segundo", "tercer"], {
    required_error: "Debe seleccionar un período.",
  }),
  salaries: z.object({
    december: z.coerce.number().min(0).optional(),
    january: z.coerce.number().min(0).optional(),
    february: z.coerce.number().min(0).optional(),
    march: z.coerce.number().min(0).optional(),
    april: z.coerce.number().min(0).optional(),
    may: z.coerce.number().min(0).optional(),
    june: z.coerce.number().min(0).optional(),
    july: z.coerce.number().min(0).optional(),
    august: z.coerce.number().min(0).optional(),
    september: z.coerce.number().min(0).optional(),
    october: z.coerce.number().min(0).optional(),
    november: z.coerce.number().min(0).optional(),
  }),
});

const DecimoTercerMes = () => {
  const [result, setResult] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      periodType: "primer",
      salaries: {},
    },
  });

  const selectedPeriod = form.watch("periodType");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { periodType, salaries: s } = values;
    let totalEarnings = 0;

    if (periodType === "primer") { // Abril
      totalEarnings = (s.december || 0) + (s.january || 0) + (s.february || 0) + (s.march || 0) + (s.april || 0);
    } else if (periodType === "segundo") { // Agosto
      totalEarnings = (s.april || 0) + (s.may || 0) + (s.june || 0) + (s.july || 0) + (s.august || 0);
    } else if (periodType === "tercer") { // Diciembre
      totalEarnings = (s.august || 0) + (s.september || 0) + (s.october || 0) + (s.november || 0) + (s.december || 0);
    }

    const decimoTercerMesAmount = totalEarnings / 12;

    setResult({
      totalEarnings,
      periodType,
      decimoTercerMesAmount,
    });
  };

  const renderMonthInput = (month: keyof z.infer<typeof formSchema>['salaries'], label: string) => (
    <FormField
      control={form.control}
      name={`salaries.${month}`}
      render={({ field }) => (
        <FormItem>
          <FormLabel>Ingresos de {label} ($)</FormLabel>
          <FormControl>
            <Input type="number" placeholder="0.00" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Cálculo de Décimo Tercer Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Seleccione el período e ingrese los salarios brutos correspondientes para calcular el décimo tercer mes.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="periodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período de Pago</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione un período" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primer">Abril</SelectItem>
                        <SelectItem value="segundo">Agosto</SelectItem>
                        <SelectItem value="tercer">Diciembre</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-4 pt-4 border-t">
                {selectedPeriod === 'primer' && (
                  <>
                    {renderMonthInput('december', 'Diciembre')}
                    {renderMonthInput('january', 'Enero')}
                    {renderMonthInput('february', 'Febrero')}
                    {renderMonthInput('march', 'Marzo')}
                    {renderMonthInput('april', 'Abril')}
                  </>
                )}
                {selectedPeriod === 'segundo' && (
                  <>
                    {renderMonthInput('april', 'Abril')}
                    {renderMonthInput('may', 'Mayo')}
                    {renderMonthInput('june', 'Junio')}
                    {renderMonthInput('july', 'Julio')}
                    {renderMonthInput('august', 'Agosto')}
                  </>
                )}
                {selectedPeriod === 'tercer' && (
                  <>
                    {renderMonthInput('august', 'Agosto')}
                    {renderMonthInput('september', 'Septiembre')}
                    {renderMonthInput('october', 'Octubre')}
                    {renderMonthInput('november', 'Noviembre')}
                    {renderMonthInput('december', 'Diciembre')}
                  </>
                )}
              </div>

              <Button type="submit" className="w-full">Calcular Décimo Tercer Mes</Button>
            </form>
          </Form>

          {result && (
            <div className="mt-8 p-4 border rounded-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-4 text-center">Resultados del Cálculo</h3>
              <div className="space-y-2">
                <p><strong>Período Seleccionado:</strong> {result.periodType === "primer" ? "Abril" : result.periodType === "segundo" ? "Agosto" : "Diciembre"}</p>
                <p><strong>Total de Ingresos Brutos en el Período:</strong> ${result.totalEarnings.toFixed(2)}</p>
                <p className="text-lg font-bold mt-4">Monto del Décimo Tercer Mes: ${result.decimoTercerMesAmount.toFixed(2)}</p>
              </div>
              <p className="text-xs text-red-500 mt-4">
                *Este cálculo es una estimación. El décimo tercer mes se calcula sobre el promedio de salarios ordinarios y extraordinarios percibidos en el período. Consulte a un profesional para un cálculo exacto.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DecimoTercerMes;