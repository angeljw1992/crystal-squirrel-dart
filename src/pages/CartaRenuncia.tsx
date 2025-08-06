"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import html2pdf from 'html2pdf.js';
import { Link } from "react-router-dom";

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
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, DownloadIcon, ArrowLeft } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  idNumber: z.string().min(1, "La cédula es requerida."),
  companyName: z.string().min(1, "El nombre de la empresa es requerido."),
  jobTitle: z.string().min(1, "El cargo es requerido."),
  city: z.string().min(1, "La ciudad es requerida.").default("Panamá"),
  startDate: z.date({
    required_error: "La fecha de inicio es requerida.",
  }),
  endDate: z.date({
    required_error: "La fecha de fin es requerida.",
  }),
});

const CartaRenuncia = () => {
  const [letterContent, setLetterContent] = useState<string | null>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      idNumber: "",
      companyName: "",
      jobTitle: "",
      city: "Panamá",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { name, idNumber, companyName, jobTitle, city, startDate, endDate } = values;

    const formattedStartDate = format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const formattedEndDate = format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });

    const letter = `
${city}, ${currentDate}

Señores
${companyName}
E.S.M.

Estimados señores:

Por medio de la presente, yo, ${name}, con cédula de identidad personal No. ${idNumber}, presento mi renuncia voluntaria e irrevocable al cargo de ${jobTitle}, que he venido desempeñando desde el ${formattedStartDate}.

Esta decisión será efectiva a partir del día ${formattedEndDate}, siendo este mi último día de labores.

Agradezco la oportunidad y la confianza depositada en mí durante mi tiempo en la empresa.

Atentamente,

_________________________
${name}
C.I.P. No. ${idNumber}
    `.trim();
    setLetterContent(letter);
  };

  const handleDownloadPdf = () => {
    if (letterRef.current) {
      const opt = {
        margin: 1,
        filename: 'carta_renuncia.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
      };
      html2pdf().from(letterRef.current).set(opt).save();
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-3xl mb-4">
        <Link to="/">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver al Inicio
          </Button>
        </Link>
      </div>
      <Card className="w-full max-w-3xl shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-primary">Generador de Carta de Renuncia</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 mb-4 text-center">
            Complete los campos para generar su carta de renuncia con el formato estándar (se generarán 2 copias).
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre Completo</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="idNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Número de Cédula</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="companyName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre de la Empresa</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="jobTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cargo que Desempeña</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ciudad</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Fecha de Inicio en la Empresa</FormLabel>
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
                      <FormLabel>Fecha Efectiva de Renuncia</FormLabel>
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
                              date < form.getValues("startDate")
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
              </div>
              <Button type="submit" className="w-full">Generar Carta</Button>
            </form>
          </Form>

          {letterContent && (
            <div className="mt-8 p-4 border rounded-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-4 text-center">Borrador de Carta de Renuncia</h3>
              <div ref={letterRef} className="p-6 bg-white rounded-md shadow-inner">
                <div className="whitespace-pre-wrap font-serif text-sm mb-10 pb-10 border-b-2 border-dashed border-gray-300">
                  {letterContent}
                </div>
                <div className="whitespace-pre-wrap font-serif text-sm">
                  {letterContent}
                </div>
              </div>
              <Button onClick={handleDownloadPdf} className="w-full mt-6">
                <DownloadIcon className="mr-2 h-4 w-4" /> Descargar PDF (2 Copias)
              </Button>
              <p className="text-xs text-gray-600 mt-4 text-center">
                *Este es un borrador. Revíselo cuidadosamente. Se generarán dos copias: una para usted (Acusado de Recibo) y otra para la empresa.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CartaRenuncia;