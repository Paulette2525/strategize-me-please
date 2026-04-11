import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MarketingProvider } from "@/contexts/MarketingContext";
import { Layout } from "@/components/Layout";
import Index from "./pages/Index.tsx";
import Projects from "./pages/Projects.tsx";
import Campaigns from "./pages/Campaigns.tsx";
import CalendarPage from "./pages/CalendarPage.tsx";
import Budgets from "./pages/Budgets.tsx";
import Content from "./pages/Content.tsx";
import Analytics from "./pages/Analytics.tsx";
import NotFound from "./pages/NotFound.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <MarketingProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/projects" element={<Projects />} />
              <Route path="/campaigns" element={<Campaigns />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/budgets" element={<Budgets />} />
              <Route path="/content" element={<Content />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </MarketingProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
