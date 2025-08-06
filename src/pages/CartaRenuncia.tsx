"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import html2pdf from 'html2pdf.js'; // Import html2pdf
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
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { CalendarIcon, DownloadIcon, ArrowLeft } from "lucide-react"; // Import DownloadIcon

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  idNumber: z.string().min(1, "La cédula es requerida."),
  companyName: z.string().min(1, "El nombre de la empresa es requerido."),
  startDate: z.date({
    required_error: "La fecha de inicio es requerida.",
  }),
  endDate: z.date({
    required_error: "La fecha de fin es requerida.",
  }),
  reason: z.string().min(10, "El motivo de la renuncia debe ser más detallado."),
});

const CartaRenuncia = () => {
  const [letterContent, setLetterContent] = useState<string | null>(null);
  const letterRef = useRef<HTMLDivElement>(null); // Ref for the letter content

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      idNumber: "",
      companyName: "",
      reason: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { name, idNumber, companyName, startDate, endDate, reason } = values;

    const formattedStartDate = format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const formattedEndDate = format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });

    const letter = `
Panamá, ${currentDate}

Señores
${companyName}
Presente

Estimados señores:

Por medio de la presente, yo, ${name}, con cédula de identidad personal No. ${idNumber}, les comunico mi decisión irrevocable de renunciar a mi puesto de trabajo en su distinguida empresa, a partir del día ${formattedEndDate}.

Mi fecha de ingreso a la empresa fue el ${formattedStartDate}.

El motivo de mi renuncia es: ${reason}

Agradezco la oportunidad que me brindaron de formar parte de su equipo durante este tiempo.

Sin otro particular, me despido.

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
            Complete los siguientes campos para generar un borrador de su carta de renuncia.
          </p>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
              <FormField
                control={form.control}
                name="reason"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Motivo de la Renuncia</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Escriba aquí el motivo de su renuncia..."
                        className="resize-y min-h-[100px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full">Generar Carta</Button>
            </form>
          </Form>

          {letterContent && (
            <div className="mt-8 p-4 border rounded-md bg-gray-50">
              <h3 className="text-xl font-semibold mb-4 text-center">Borrador de Carta de Renuncia</h3>
              <div ref={letterRef} className="whitespace-pre-wrap font-mono text-sm p-4 bg-white rounded-md shadow-inner">
                {letterContent}
              </div>
              <Button onClick={handleDownloadPdf} className="w-full mt-4">
                <DownloadIcon className="mr-2 h-4 w-4" /> Descargar PDF
              </Button>
              <p className="text-xs text-red-500 mt-4">
                *Este es un borrador de carta de renuncia. Asegúrese de revisarlo cuidadosamente y adaptarlo a sus necesidades específicas antes de usarlo.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CartaRenuncia;