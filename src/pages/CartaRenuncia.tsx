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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon, DownloadIcon } from "lucide-react";
import AdBanner from "@/components/AdBanner";

const formSchema = z.object({
  name: z.string().min(1, "El nombre es requerido."),
  idNumber: z.string().min(1, "La cédula es requerida."),
  companyName: z.string().min(1, "El nombre de la empresa es requerido."),
  jobTitle: z.string().min(1, "El cargo es requerido."),
  city: z.string().min(1, "La ciudad es requerida.").default("Panamá"),
  startDate: z.date({ required_error: "La fecha de inicio es requerida." }),
  endDate: z.date({ required_error: "La fecha de fin es requerida." }),
  reason: z.string().min(1, "El motivo de la renuncia es requerido."),
});

const CartaRenuncia = () => {
  const [letterData, setLetterData] = useState<z.infer<typeof formSchema> | null>(null);
  const letterRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", idNumber: "", companyName: "", jobTitle: "", city: "Panamá", reason: "" },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    setLetterData(values);
  };

  const handleDownloadPdf = () => {
    if (letterRef.current) {
      const opt = { margin: [1, 1, 1, 1.25], filename: 'carta_renuncia.pdf', image: { type: 'jpeg', quality: 0.98 }, html2canvas: { scale: 2, useCORS: true }, jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' } };
      html2pdf().from(letterRef.current).set(opt).save();
    }
  };

  const LetterContent = ({ data }: { data: z.infer<typeof formSchema> }) => {
    const { name, idNumber, companyName, jobTitle, city, startDate, endDate, reason } = data;
    const formattedStartDate = format(startDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const formattedEndDate = format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: es });
    const currentDate = format(new Date(), "dd 'de' MMMM 'de' yyyy", { locale: es });

    return (
      <div className="font-serif text-base text-neutral-800 leading-relaxed bg-white p-2">
        <p className="text-right mb-8">{city}, {currentDate}</p>
        <div className="mb-8">
          <p className="font-bold">Señores</p>
          <p className="font-bold">{companyName}</p>
          <p>E.S.M.</p>
        </div>
        <p className="mb-6 font-bold">Estimados señores:</p>
        <p className="mb-6 text-justify indent-8">
          Por medio de la presente, yo, <span className="font-semibold">{name}</span>, con cédula de identidad personal No. <span className="font-semibold">{idNumber}</span>, presento mi renuncia voluntaria e irrevocable al cargo de <span className="font-semibold">{jobTitle}</span>, que he venido desempeñando desde el {formattedStartDate}.
        </p>
        <p className="mb-6 text-justify indent-8">
          Esta decisión será efectiva a partir del día <span className="font-semibold">{endDate ? format(endDate, "dd 'de' MMMM 'de' yyyy", { locale: es }) : ''}</span>, siendo este mi último día de labores. {reason.trim()}
        </p>
        <p className="mb-12 text-justify indent-8">
          Agradezco la oportunidad y la confianza depositada en mí durante mi tiempo en la empresa.
        </p>
        <div className="mt-24">
          <p className="border-t border-neutral-800 w-64 pt-2">Atentamente,</p>
          <p className="font-semibold">{name}</p>
          <p>C.I.P. No. {idNumber}</p>
        </div>
      </div>
    );
  };

  return (
    <Card className="w-full shadow-none border-none">
      <CardHeader className="p-0 mb-8">
        <CardTitle className="text-xl text-foreground">Generador de Carta de Renuncia</CardTitle>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">Complete los campos para generar una carta de renuncia profesional.</p>
      </CardHeader>
      <CardContent className="p-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
              <FormField control={form.control} name="name" render={({ field }) => (<FormItem><FormLabel>Nombre Completo</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="idNumber" render={({ field }) => (<FormItem><FormLabel>Número de Cédula</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="companyName" render={({ field }) => (<FormItem><FormLabel>Nombre de la Empresa</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="jobTitle" render={({ field }) => (<FormItem><FormLabel>Cargo que Desempeña</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="city" render={({ field }) => (<FormItem><FormLabel>Ciudad</FormLabel><FormControl><Input {...field} /></FormControl><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="startDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fecha de Inicio</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={es} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <FormField control={form.control} name="endDate" render={({ field }) => (<FormItem className="flex flex-col"><FormLabel>Fecha de Fin</FormLabel><Popover><PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP", { locale: es }) : <span>Seleccione una fecha</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger><PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus locale={es} /></PopoverContent></Popover><FormMessage /></FormItem>)} />
              <div className="md:col-span-2"><FormField control={form.control} name="reason" render={({ field }) => (<FormItem><FormLabel>Motivo (Opcional)</FormLabel><FormControl><Textarea placeholder="Ej: Agradezco las oportunidades de desarrollo profesional que me brindaron..." className="resize-none" {...field} /></FormControl><FormMessage /></FormItem>)} /></div>
            </div>
            <Button type="submit" className="w-full md:w-auto" size="lg">Generar Carta</Button>
          </form>
        </Form>
        {letterData && (
          <div className="mt-12 p-6 border rounded-lg bg-neutral-50 dark:bg-neutral-900">
            <h3 className="text-lg font-semibold mb-6 text-center text-foreground">Vista Previa de la Carta</h3>
            <div className="p-4 sm:p-8 bg-white rounded-md shadow-lg max-w-3xl mx-auto">
              <div ref={letterRef}><LetterContent data={letterData} /></div>
            </div>
            <div className="text-center">
              <Button onClick={handleDownloadPdf} className="mt-8" size="lg"><DownloadIcon className="mr-2 h-5 w-5" /> Descargar PDF</Button>
            </div>
            <p className="text-xs text-neutral-600 mt-4 text-center">*Este es un borrador. Revíselo cuidadosamente antes de firmar y entregar.</p>
          </div>
        )}
        <AdBanner />
      </CardContent>
    </Card>
  );
};

export default CartaRenuncia;