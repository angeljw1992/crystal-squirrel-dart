"use client";

import React, { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import html2pdf from 'html2pdf.js';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { CalendarIcon, DownloadIcon } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  idNumber: z.string().min(1, "La cédula es requerida."),
  companyName: z.string().min(1, "El nombre de la empresa es requerido."),
  jobTitle: z.string().min(1, "El cargo es requerido."),
  city: z.string().min(1, "La ciudad es requerida.").default("Panamá"),
  startDate: z.date({ required_error: "La fecha de inicio es requerida." }),
  endDate: z.date({ required_error: "La fecha de fin es requerida." }),
  reason: z.string().optional(),
});

const CartaRenuncia = () => {
  const [letterContent, setLetterContent] = useState<string | null>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", idNumber: "", companyName: "", jobTitle: "", city: "Panamá", reason: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const { name, idNumber, companyName, jobTitle, city, startDate, endDate, reason } = values;
    const formattedStartDate = format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const formattedEndDate = format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });

    const reasonParagraph = reason ? `\n\n${reason.trim()}` : '';

    const letter = `${city}, ${currentDate}\n\nSeñores\n${companyName}\nE.S.M.\n\nEstimados señores:\n\nPor medio de la presente, yo, ${name}, con cédula de identidad personal No. ${idNumber}, presento mi renuncia voluntaria e irrevocable al cargo de ${jobTitle}, que he venido desempeñando desde el ${formattedStartDate}.\n\nEsta decisión será efectiva a partir del día ${formattedEndDate}, siendo este mi último día de labores.${reasonParagraph}\n\nAgradezco la oportunidad y la confianza depositada en mí durante mi tiempo en la empresa.\n\nAtentamente,\n\n_________________________\n${name}\nC.I.P. No. ${idNumber}`;
    setLetterContent(letter.trim());
  };

  const handleDownloadPdf = () => {
    if (letterRef.current) {
      const opt = { margin: 1, filename: 'carta_renuncia.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2 }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
      html2pdf().from(letterRef.current).set(opt).save();
    }
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary">Generador de Carta de Renuncia</CardTitle>
        <p className="text-sm text-gray-500">
          Complete los campos para generar su carta de renuncia (se generarán 2 copias).
        </p>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="idNumber" render={({ field }) => (<FormItem><FormLabel>Número de Cédula</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Nombre de la Empresa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="jobTitle" render={({ field }) => (<FormItem><FormLabel>Cargo que Desempeña</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="startDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fecha de Inicio en la Empresa</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date > new Date() || date < new Date("1900-01-01")} initialFocus locale={es} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="endDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fecha Efectiva de Renuncia</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={(date) => date < form.getValues("startDate")} initialFocus locale={es} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Motivo de la Renuncia (Opcional)</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ej: Agradezco las oportunidades de desarrollo profesional que me brindaron..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="w-full md:w-auto">Generar Carta</Button>
          </form>
        </Form>

        {letterContent && (
          <div className="mt-8 p-4 border rounded-md bg-gray-50">
            <h3 className="text-xl font-semibold mb-4 text-center">Borrador de Carta de Renuncia</h3>
            <div ref={letterRef} className="p-6 bg-white rounded-md shadow-inner">
              <div className="whitespace-pre-wrap font-serif text-sm mb-10 pb-10 border-b-2 border-dashed border-gray-300">{letterContent}</div>
              <div className="whitespace-pre-wrap font-serif text-sm">{letterContent}</div>
            </div>
            <Button onClick={handleDownloadPdf} className="w-full mt-6"><DownloadIcon className="mr-2 h-4 w-4" /> Descargar PDF (2 Copias)</Button>
            <p className="text-xs text-gray-600 mt-4 text-center">*Este es un borrador. Revíselo cuidadosamente.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CartaRenuncia;