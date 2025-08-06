"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";

const formSchema = z.object({
  totalEarnings: z.coerce.number().min(0, "El total de ingresos debe ser un número positivo."),
  periodType: z.enum(["primer", "segundo", "tercer"], {
    required_error: "Debe seleccionar un período.",
  }),
  startDate: z.date({
    required_error: "La fecha de inicio del período es requerida.",
  }),
  endDate: z.date({
    required_error: "La fecha de fin del período es requerida.",
  }),
});

const DecimoTercerMes = () => {
  const [result, setResult] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      totalEarnings: 0,
      periodType: "primer", // Default to first period
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { totalEarnings, periodType, startDate, endDate } = values;

    // Décimo Tercer Mes is 1/12 of total earnings during the specific period.
    // The periods are:
    // 1. April 15: Jan 1 - Mar 31
    // 2. August 15: Apr 1 - Jul 31
    // 3. December 15: Aug 1 - Nov 30

    // For simplicity, we'll use the totalEarnings provided for the selected period.
    const decimoTercerMesAmount = totalEarnings / 12;

    setResult({
      totalEarnings,
      periodType,
      decimoTercerMesAmount,
      startDate,
      endDate,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">Cálculo de Décimo Tercer Mes</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Ingrese el total de ingresos brutos percibidos durante el período correspondiente para calcular el décimo tercer mes.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="periodType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Período de Cálculo</FormLabel>
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
              <FormField
                control={form.control}
                name="startDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Inicio del Período</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < new Date("1900-01-01")
                          }
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="endDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Fin del Período</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
                            ) : (
                              <span>Seleccione una fecha</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date > new Date() || date < form.getValues("startDate")
                          }
                          initialFocus
                          locale={es}
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="totalEarnings"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total de Ingresos Brutos en el Período ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Calcular Décimo Tercer Mes</Button>
            </form>
          </Form>

          {result && (
            <div className="mt-8 p-4 border rounded-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-4 text-center">Resultados del Cálculo</h3>
              <div className="space-y-2">
                <p><strong>Período Seleccionado:</strong> {result.periodType === "primer" ? "Abril" : result.periodType === "segundo" ? "Agosto" : "Diciembre"}</p>
                <p><strong>Fecha de Inicio del Período:</strong> {format(result.startDate, "PPP", { locale: es })}</p>
                <p><strong>Fecha de Fin del Período:</strong> {format(result.endDate, "PPP", { locale: es })}</p>
                <p><strong>Total de Ingresos Brutos en el Período:</strong> ${result.totalEarnings.toFixed(2)}</p>
                <p className="text-lg font-bold mt-4">Monto del Décimo Tercer Mes: ${result.decimoTercerMesAmount.toFixed(2)}</p>
              </div>
              <p className="text-xs text-red-500 mt-4">
                *Este cálculo es una estimación simplificada. El décimo tercer mes se calcula sobre el promedio de salarios ordinarios y extraordinarios percibidos en el período. Consulte a un profesional para un cálculo exacto.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DecimoTercerMes;