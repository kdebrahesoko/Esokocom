import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { Leaf, TrendingUp, MessageSquare, AlertCircle } from 'lucide-react';
import AdminLayout, { useAdminUser } from '@/components/admin/AdminLayout';
import AdvisoriesTab from '@/components/admin/farm-data/AdvisoriesTab';
import MarketPricesTab from '@/components/admin/farm-data/MarketPricesTab';
import SmsAlertsTab from '@/components/admin/farm-data/SmsAlertsTab';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

function FarmDataContent() {
  const user = useAdminUser();
  const [, setLocation] = useLocation();
  const canManage = user?.role === 'SUPER_ADMIN' || user?.role === 'CONTENT_EDITOR';

  useEffect(() => {
    if (user && !canManage) setLocation('/admin');
  }, [canManage, setLocation, user]);

  if (!canManage) return null;

  return (
    <div className="max-w-7xl mx-auto space-y-6">
        {/* Bold, deliberate header */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#D9531E] to-[#9A3510] text-white p-8 shadow-lg">
          <div className="relative z-10">
            <h1 className="text-3xl font-heading font-bold mb-2">Farm Data Intelligence</h1>
            <p className="text-orange-100 max-w-2xl text-sm md:text-base leading-relaxed">
              Keep farmer-facing advisories, market prices, and SMS alerts accurate. 
              The information published here directly impacts time-sensitive field operations.
            </p>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none translate-x-1/4 translate-y-1/4">
            <Leaf className="w-64 h-64" />
          </div>
        </div>

        <Tabs defaultValue="advisories" className="w-full">
          <TabsList className="grid w-full md:w-auto grid-cols-3 bg-white border shadow-sm rounded-xl p-1 h-auto gap-1">
            <TabsTrigger 
              value="advisories" 
              className="data-[state=active]:bg-[#D9531E] data-[state=active]:text-white rounded-lg py-2.5 transition-all"
              data-testid="tab-advisories"
            >
              <div className="flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                <span className="font-semibold">Advisories</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="prices" 
              className="data-[state=active]:bg-[#D9531E] data-[state=active]:text-white rounded-lg py-2.5 transition-all"
              data-testid="tab-prices"
            >
              <div className="flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                <span className="font-semibold">Market Prices</span>
              </div>
            </TabsTrigger>
            <TabsTrigger 
              value="sms" 
              className="data-[state=active]:bg-[#D9531E] data-[state=active]:text-white rounded-lg py-2.5 transition-all"
              data-testid="tab-sms"
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                <span className="font-semibold">SMS Alerts</span>
              </div>
            </TabsTrigger>
          </TabsList>

          <div className="mt-6 bg-white border shadow-sm rounded-xl overflow-hidden min-h-[500px]">
            <TabsContent value="advisories" className="m-0 focus-visible:outline-none">
              <AdvisoriesTab />
            </TabsContent>
            <TabsContent value="prices" className="m-0 focus-visible:outline-none">
              <MarketPricesTab />
            </TabsContent>
            <TabsContent value="sms" className="m-0 focus-visible:outline-none">
              <SmsAlertsTab />
            </TabsContent>
          </div>
        </Tabs>
    </div>
  );
}

export default function AdminFarmDataPage() {
  return (
    <AdminLayout title="Farm Data Management">
      <FarmDataContent />
    </AdminLayout>
  );
}
