"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format, differenceInDays, differenceInMonths, differenceInYears } from "date-fns";
import { es } from "date-fns/locale"; // Import Spanish locale
import { Link } from "react-router-dom";

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
import { CalendarIcon, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  contractType: z.enum(["indefinido", "definido", "obra_terminada"], {
    required_error: "El tipo de contrato es requerido.",
  }),
  startDate: z.date({
    required_error: "La fecha de inicio es requerida.",
  }),
  endDate: z.date({
    required_error: "La fecha de fin es requerida.",
  }),
  monthlySalary: z.coerce.number().min(0, "El salario mensual debe ser un número positivo."),
  pendingVacationDays: z.coerce.number().min(0, "Los días de vacaciones deben ser un número positivo.").optional().default(0),
  pendingThirteenthMonth: z.coerce.number().min(0, "El décimo tercer mes pendiente debe ser un número positivo.").optional().default(0),
});

const Liquidacion = () => {
  const [result, setResult] = useState<any>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      monthlySalary: 0,
      pendingVacationDays: 0,
      pendingThirteenthMonth: 0,
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { contractType, startDate, endDate, monthlySalary, pendingVacationDays, pendingThirteenthMonth } = values;

    // Basic calculations (simplified for demonstration)
    const yearsOfService = differenceInYears(endDate, startDate);
    const monthsOfService = differenceInMonths(endDate, startDate) % 12;
    const daysOfService = differenceInDays(endDate, startDate);

    // Preaviso (Notice Period) - Simplified rules
    let preavisoDays = 0;
    if (yearsOfService >= 2) {
      preavisoDays = 30; // Example: 30 days for 2+ years
    } else if (yearsOfService >= 1) {
      preavisoDays = 15; // Example: 15 days for 1-2 years
    } else if (monthsOfService >= 3) {
      preavisoDays = 7; // Example: 7 days for 3-12 months
    }
    const preaviso = (monthlySalary / 30) * preavisoDays;

    // Antigüedad (Seniority Pay) - Only for indefinite contracts
    let antiguedad = 0;
    if (contractType === 'indefinido') {
      if (yearsOfService >= 2) {
        antiguedad = (monthlySalary / 4.33) * 3.4 * yearsOfService; // 3.4 weeks per year
      } else if (yearsOfService >= 1) {
        antiguedad = (monthlySalary / 4.33) * 1 * 12; // 1 week per month for 1st year
      } else {
        antiguedad = (monthlySalary / 4.33) * 1 * monthsOfService; // 1 week per month for less than 1 year
      }
    }

    // Vacaciones Proporcionales (Proportional Vacation)
    const dailySalary = monthlySalary / 30;
    const proportionalVacation = (daysOfService / 11) * dailySalary;

    // Décimo Tercer Mes Proporcional (Proportional Thirteenth Month)
    const proportionalThirteenthMonth = (monthlySalary / 12) * (daysOfService / 30);

    const totalLiquidacion = preaviso + antiguedad + proportionalVacation + proportionalThirteenthMonth + (pendingVacationDays * dailySalary) + pendingThirteenthMonth;

    setResult({
      preaviso,
      antiguedad,
      proportionalVacation,
      proportionalThirteenthMonth,
      pendingVacationDays: pendingVacationDays * dailySalary,
      pendingThirteenthMonth,
      totalLiquidacion,
      yearsOfService,
      monthsOfService,
      daysOfService,
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl mb-4">
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-2xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Cálculo de Liquidación</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Ingrese los datos para calcular la liquidación. Tenga en cuenta que este es un cálculo simplificado y no reemplaza la asesoría legal.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="contractType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Contrato</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccione el tipo de contrato" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="indefinido">Indefinido</SelectItem>
                        <SelectItem value="definido">Definido</SelectItem>
                        <SelectItem value="obra_terminada">Obra Terminada</SelectItem>
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
                    <FormLabel>Fecha de Inicio de Contrato</FormLabel>
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
                    <FormLabel>Fecha de Fin de Contrato</FormLabel>
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
                name="monthlySalary"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Salario Mensual ($)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pendingVacationDays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Días de Vacaciones Pendientes (si aplica)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="pendingThirteenthMonth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Décimo Tercer Mes Pendiente (si aplica)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Calcular Liquidación</Button>
            </form>
          </Form>

          {result && (
            <div className="mt-8 p-4 border rounded-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-4 text-center">Resultados del Cálculo</h3>
              <div className="space-y-2">
                <p><strong>Tiempo de Servicio:</strong> {result.yearsOfService} años, {result.monthsOfService} meses, {result.daysOfService % 30} días</p>
                <p><strong>Preaviso:</strong> ${result.preaviso.toFixed(2)}</p>
                <p><strong>Prima de Antigüedad:</strong> ${result.antiguedad.toFixed(2)}</p>
                <p><strong>Vacaciones Proporcionales:</strong> ${result.proportionalVacation.toFixed(2)}</p>
                <p><strong>Décimo Tercer Mes Proporcional:</strong> ${result.proportionalThirteenthMonth.toFixed(2)}</p>
                {result.pendingVacationDays > 0 && <p><strong>Pago por Vacaciones Pendientes:</strong> ${result.pendingVacationDays.toFixed(2)}</p>}
                {result.pendingThirteenthMonth > 0 && <p><strong>Décimo Tercer Mes Pendiente:</strong> ${result.pendingThirteenthMonth.toFixed(2)}</p>}
                <p className="text-lg font-bold mt-4">Total Liquidación Estimada: ${result.totalLiquidacion.toFixed(2)}</p>
              </div>
              <p className="text-xs text-red-500 mt-4">
                *Este cálculo es una estimación y asume una terminación por parte del empleador. La prima de antigüedad solo aplica a contratos indefinidos. Las leyes laborales de Panamá son complejas. Consulte a un profesional para un cálculo exacto.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Liquidacion;