import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import HomePage from '@/pages/HomePage';
import ProductsServicesPage from '@/pages/ProductsServicesPage';
import SolutionPage from '@/pages/solutions/SolutionPage';
import PricingPage from '@/pages/PricingPage';
import CompanyPage from '@/pages/CompanyPage';
import CareersPage from '@/pages/CareersPage';
import CareersJobPage from '@/pages/CareersJobPage';
import AdminCareersPage from '@/pages/AdminCareersPage';
import AdminLoginPage from '@/pages/AdminLoginPage';
import AdminAuditLogsPage from '@/pages/AdminAuditLogsPage';
import AdminDashboardPage from '@/pages/AdminDashboardPage';
import AdminUsersPage from '@/pages/AdminUsersPage';
import AdminResourcesPage from '@/pages/AdminResourcesPage';
import AdminResourceListPage from '@/pages/AdminResourceListPage';
import AdminResourceFormPage from '@/pages/AdminResourceFormPage';
import ResourcesPage from '@/pages/resources/ResourcesPage';
import ResourceListingPage from '@/pages/resources/ResourceListingPage';
import ResourceDetailPage from '@/pages/resources/ResourceDetailPage';
import { Route, Switch, Router as WouterRouter } from 'wouter';
import { BookDemoProvider } from '@/context/BookDemoContext';
import { BookDemoModal } from '@/components/BookDemoModal';

const queryClient = new QueryClient();

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomePage} />
      <Route path="/products-services" component={ProductsServicesPage} />
      <Route path="/solutions/:slug" component={SolutionPage} />
      <Route path="/pricing" component={PricingPage} />
      <Route path="/company" component={CompanyPage} />
      <Route path="/careers" component={CareersPage} />
      <Route path="/careers/:id" component={CareersJobPage} />
      <Route path="/resources/:type/:slug" component={ResourceDetailPage} />
      <Route path="/resources/:type" component={ResourceListingPage} />
      <Route path="/resources" component={ResourcesPage} />
      <Route path="/admin/login" component={AdminLoginPage} />
      <Route path="/admin/audit-logs" component={AdminAuditLogsPage} />
      <Route path="/admin/careers" component={AdminCareersPage} />
      <Route path="/admin/users" component={AdminUsersPage} />
      <Route path="/admin/resources/new" component={AdminResourceFormPage} />
      <Route path="/admin/resources/:id/edit" component={AdminResourceFormPage} />
      <Route path="/admin/resources/:type" component={AdminResourceListPage} />
      <Route path="/admin/resources" component={AdminResourcesPage} />
      <Route path="/admin" component={AdminDashboardPage} />
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
