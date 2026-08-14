import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import HomePage from '@/pages/HomePage';
import SolutionPage from '@/pages/solutions/SolutionPage';
import PricingPage from '@/pages/PricingPage';
import CompanyPage from '@/pages/CompanyPage';
import CareersPage from '@/pages/CareersPage';
import CareersJobPage from '@/pages/CareersJobPage';
import AdminCareersPage from '@/pages/AdminCareersPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminAuditLogsPage from '@/pages/AdminAuditLogsPage';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { BookDemoProvider } from '@/context/BookDemoContext';
import { BookDemoModal } from '@/components/BookDemoModal';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/solutions/:slug" component={SolutionPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/company" component={CompanyPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/careers/:id" component={CareersJobPage} />
      <Route path="/admin/careers" component={AdminCareersPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/audit-logs" component={AdminAuditLogsPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BookDemoProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
            <Router />
          </WouterRouter>
          <BookDemoModal />
          <Toaster />
        </BookDemoProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
