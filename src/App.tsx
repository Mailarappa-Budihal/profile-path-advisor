
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthProvider";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import PortfolioBuilder from "./pages/PortfolioBuilder";
import ResumeGenerator from "./pages/ResumeGenerator";
import CoverLetterWriter from "./pages/CoverLetterWriter";
import MockInterviewer from "./pages/MockInterviewer";
import JobAlerts from "./pages/JobAlerts";
import CareerCoaching from "./pages/CareerCoaching";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/portfolio-builder" element={<PortfolioBuilder />} />
            <Route path="/resume-generator" element={<ResumeGenerator />} />
            <Route path="/cover-letter" element={<CoverLetterWriter />} />
            <Route path="/mock-interview" element={<MockInterviewer />} />
            <Route path="/job-alerts" element={<JobAlerts />} />
            <Route path="/career-coaching" element={<CareerCoaching />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
