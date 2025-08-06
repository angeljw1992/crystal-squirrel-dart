import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import Liquidacion from "./pages/Liquidacion";
import Salario from "./pages/Salario";
import DecimoTercerMes from "./pages/DecimoTercerMes";
import CartaRenuncia from "./pages/CartaRenuncia";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Navigate to="/liquidacion" replace />} />
            <Route path="liquidacion" element={<Liquidacion />} />
            <Route path="salario" element={<Salario />} />
            <Route path="decimo-tercer-mes" element={<DecimoTercerMes />} />
            <Route path="carta-renuncia" element={<CartaRenuncia />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;