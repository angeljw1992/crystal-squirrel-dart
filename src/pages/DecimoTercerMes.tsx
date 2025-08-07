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
    december: z.coerce.number().min(0).optional(), january: z.coerce.number().min(0).optional(),
    february: z.coerce.number().min(0).optional(), march: z.coerce.number().min(0).optional(),
    april: z.coerce.number().min(0).optional(), may: z.coerce.number().min(0).optional(),
    june: z.coerce.number().min(0).optional(), july: z.coerce.number().min(0).optional(),
    august: z.coerce.number().min(0).optional(), september: z.coerce.number().min(0).optional(),
    october: z.coerce.number().min(0).optional(), november: z.coerce.number().min(0).optional(),
  }),
});

const DecimoTercerMes = () => {
  const [result, setResult] = useState<any>(null);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { periodType: "primer", salaries: {} },
  });
  const selectedPeriod = form.watch("periodType");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { periodType, salaries: s } = values;
    let totalEarnings = 0;
    if (periodType === "primer") totalEarnings = (s.december || 0) + (s.january || 0) + (s.february || 0) + (s.march || 0);
    else if (periodType === "segundo") totalEarnings = (s.april || 0) + (s.may || 0) + (s.june || 0) + (s.july || 0);
    else if (periodType === "tercer") totalEarnings = (s.august || 0) + (s.september || 0) + (s.october || 0) + (s.november || 0);
    const decimoTercerMesAmount = totalEarnings / 12;
    setResult({ totalEarnings, periodType, decimoTercerMesAmount });
  };

  const renderMonthInput = (month: keyof z.infer<typeof formSchema>['salaries'], label: string) => (
    <FormField control={form.control} name={`salaries.${month}`} render={({ field }) => (
      <FormItem>
        <FormLabel>Ingresos de {label} ($)</FormLabel>
        <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
        <FormMessage />
      </FormItem>
    )} />
  );

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="p-0 mb-8">
        <CardTitle className="text-xl text-foreground">Cálculo de Décimo Tercer Mes</CardTitle>
        <p className="text-sm text-neutral-600">
          Seleccione el período e ingrese los salarios brutos para calcular el décimo.
        </p>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <div className="md:col-span-2">
                <FormField control={form.control} name="periodType" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período de Pago</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger><SelectValue placeholder="Seleccione un período" /></SelectTrigger></FormControl>
                      <SelectContent>
                        <SelectItem value="primer">1er Período (15 de Abril)</SelectItem>
                        <SelectItem value="segundo">2do Período (15 de Agosto)</SelectItem>
                        <SelectItem value="tercer">3er Período (15 de Diciembre)</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              {selectedPeriod === 'primer' && <> {renderMonthInput('december', 'Diciembre')} {renderMonthInput('january', 'Enero')} {renderMonthInput('february', 'Febrero')} {renderMonthInput('march', 'Marzo')} </>}
              {selectedPeriod === 'segundo' && <> {renderMonthInput('april', 'Abril')} {renderMonthInput('may', 'Mayo')} {renderMonthInput('june', 'Junio')} {renderMonthInput('july', 'Julio')} </>}
              {selectedPeriod === 'tercer' && <> {renderMonthInput('august', 'Agosto')} {renderMonthInput('september', 'Septiembre')} {renderMonthInput('october', 'Octubre')} {renderMonthInput('november', 'Noviembre')} </>}
            </div>
            <Button type="submit" className="w-full md:w-auto" size="lg">Calcular Décimo</Button>
          </form>
        </Form>

        {result && (
          <div className="mt-12 p-6 border rounded-lg bg-neutral-50">
            <h3 className="text-lg font-semibold mb-6 text-center text-foreground">Resultados del Cálculo</h3>
            <div className="space-y-3 text-sm text-neutral-800">
              <p><strong className="font-semibold text-neutral-900">Período:</strong> {result.periodType === "primer" ? "1ro (Abril)" : result.periodType === "segundo" ? "2do (Agosto)" : "3ro (Diciembre)"}</p>
              <p><strong className="font-semibold text-neutral-900">Total de Ingresos en el Período:</strong> ${result.totalEarnings.toFixed(2)}</p>
              <p className="text-lg font-bold mt-6 pt-4 border-t !text-primary-700">Monto del Décimo Tercer Mes: ${result.decimoTercerMesAmount.toFixed(2)}</p>
            </div>
            <p className="text-xs text-destructive-700 mt-6 text-center">
              *Este cálculo es una estimación. Consulte a un profesional para un cálculo exacto.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default DecimoTercerMes;