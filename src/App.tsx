import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { ThirdwebProvider } from "thirdweb/react";
import Index from "./pages/Index";

const queryClient = new QueryClient();

const App = () => {
  return (
    <ThirdwebProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <Index />
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ThirdwebProvider>
  );
};

export default App;
