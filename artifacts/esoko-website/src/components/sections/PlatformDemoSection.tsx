import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Map, BarChart3, FormInput, MessageSquareQuote, Store } from 'lucide-react';

const TABS = [
  { id: 'maps', label: 'Maps', icon: Map },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'survey', label: 'Survey Builder', icon: FormInput },
  { id: 'messaging', label: 'Messaging', icon: MessageSquareQuote },
  { id: 'marketplace', label: 'Marketplace', icon: Store }
];

export function PlatformDemoSection() {
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  return (
    <section className="py-24 bg-[#1F2937] text-white">
      <div className="container mx-auto px-4 md:px-6">
        <div className="text-center mb-12">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-heading font-bold text-white"
          >
            See the Platform in Action
          </motion.h2>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all ${
                  isActive 
                    ? 'bg-[#C05C0E] text-white shadow-lg shadow-[#C05C0E]/30' 
                    : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white'
                }`}
              >
                <tab.icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-white/50'}`} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Demo Window */}
        <div className="max-w-5xl mx-auto">
          <div className="bg-[#0f172a] rounded-xl border border-white/10 shadow-2xl overflow-hidden shadow-black/50 aspect-[16/9] relative flex flex-col">
            {/* Window Header */}
            <div className="h-12 bg-white/5 border-b border-white/10 flex items-center px-4 gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
              <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              <div className="mx-auto bg-white/5 rounded-md px-4 py-1 text-xs text-white/40 font-mono">
                app.esoko.com/dashboard
              </div>
            </div>

            {/* Window Content */}
            <div className="flex-1 relative bg-[#0f172a] overflow-hidden p-6">
              <AnimatePresence mode="wait">
                {activeTab === 'maps' && <MapsMock key="maps" />}
                {activeTab === 'analytics' && <AnalyticsMock key="analytics" />}
                {activeTab === 'survey' && <SurveyMock key="survey" />}
                {activeTab === 'messaging' && <MessagingMock key="messaging" />}
                {activeTab === 'marketplace' && <MarketplaceMock key="marketplace" />}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// Sub-components for mocks to keep code clean

function MapsMock() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="absolute inset-0 bg-[#0B6B3A]/10 border border-white/5 rounded-lg m-6 overflow-hidden flex"
    >
      <div className="w-64 bg-[#1e293b] border-r border-white/10 p-4">
        <h4 className="font-semibold mb-4 text-sm text-white/80">Filter Layers</h4>
        <div className="space-y-3">
          {['Farmer locations', 'Agent clusters', 'High-risk zones', 'Distribution centers'].map((l, i) => (
            <div key={l} className="flex items-center gap-2">
              <input type="checkbox" defaultChecked={i < 2} className="accent-[#C05C0E] rounded bg-white/10 border-white/20" />
              <span className="text-xs text-white/60">{l}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-1 relative bg-[url('https://www.transparenttextures.com/patterns/grid-me.png')]">
        {/* Simulate map dots */}
        {Array.from({ length: 40 }).map((_, i) => (
          <motion.div
            key={i}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: i * 0.05 }}
            className="absolute w-2 h-2 bg-[#C05C0E] rounded-full shadow-[0_0_8px_#C05C0E]"
            style={{
              top: `${20 + Math.random() * 60}%`,
              left: `${20 + Math.random() * 60}%`,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}

function AnalyticsMock() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="absolute inset-0 flex flex-col gap-4 m-6"
    >
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total Farmers", val: "1,245,892", color: "text-blue-400" },
          { label: "Active Surveys", val: "45", color: "text-green-400" },
          { label: "Data Quality Score", val: "98.4%", color: "text-yellow-400" }
        ].map(s => (
          <div key={s.label} className="bg-[#1e293b] p-4 rounded-lg border border-white/10">
            <div className="text-xs text-white/50 mb-1">{s.label}</div>
            <div className={`text-2xl font-bold ${s.color}`}>{s.val}</div>
          </div>
        ))}
      </div>
      <div className="flex-1 flex gap-4">
        <div className="flex-[2] bg-[#1e293b] rounded-lg border border-white/10 p-4 flex flex-col">
          <h4 className="text-xs font-semibold text-white/60 mb-4">Registration Velocity</h4>
          <div className="flex-1 flex items-end gap-2">
            {[40, 60, 45, 80, 50, 90, 70, 100, 85, 60, 40].map((h, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: i * 0.05 }}
                className="flex-1 bg-gradient-to-t from-[#C05C0E]/20 to-[#C05C0E] rounded-t-sm"
              />
            ))}
          </div>
        </div>
        <div className="flex-1 bg-[#1e293b] rounded-lg border border-white/10 p-4">
          <h4 className="text-xs font-semibold text-white/60 mb-4">Crop Distribution</h4>
          <div className="flex justify-center items-center h-full">
            <div className="w-32 h-32 rounded-full border-[16px] border-[#C05C0E] border-r-secondary border-b-sky-500 border-l-orange-500"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function SurveyMock() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="absolute inset-0 flex m-6 gap-6"
    >
      <div className="w-64 bg-[#1e293b] rounded-lg border border-white/10 p-4 space-y-4">
        <div className="text-xs font-semibold text-white/60 uppercase tracking-wider">Field Types</div>
        {['Text Input', 'Multiple Choice', 'GPS Location', 'Photo Capture', 'Biometrics', 'Signature'].map(f => (
          <div key={f} className="p-2 bg-white/5 rounded border border-white/5 text-sm text-white/80 cursor-pointer hover:bg-white/10 flex items-center gap-2">
            <FormInput className="w-4 h-4" /> {f}
          </div>
        ))}
      </div>
      <div className="flex-1 bg-white rounded-lg shadow-inner flex flex-col overflow-hidden">
        <div className="bg-gray-100 p-4 border-b">
          <h2 className="text-black font-bold">Farmer Registration Form 2024</h2>
        </div>
        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">1. Full Name</label>
            <div className="h-10 border rounded px-3 bg-white w-full border-gray-300"></div>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">2. Farm Location (GPS)</label>
            <div className="h-12 border rounded border-dashed border-[#C05C0E]/50 bg-[#C05C0E]/5 flex items-center justify-center text-[#C05C0E] text-sm font-medium">
              <Map className="w-4 h-4 mr-2" /> Tap to capture coordinates
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function MessagingMock() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="absolute inset-0 flex m-6 gap-4"
    >
      <div className="w-1/3 bg-[#1e293b] rounded-lg border border-white/10 flex flex-col">
        <div className="p-4 border-b border-white/10">
          <h4 className="font-semibold text-white/90">Campaigns</h4>
        </div>
        <div className="flex-1 overflow-y-auto">
          {['Weather Alert: Rain', 'Market Prices: Cocoa', 'Pest Warning', 'Subsidy Info'].map((c, i) => (
            <div key={c} className={`p-4 border-b border-white/5 cursor-pointer ${i === 0 ? 'bg-[#C05C0E]/20' : 'hover:bg-white/5'}`}>
              <div className="text-sm font-medium text-white mb-1">{c}</div>
              <div className="text-xs text-white/50">{100 - i * 15}k recipients</div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex-[2] bg-[#1e293b] rounded-lg border border-white/10 p-6 flex flex-col">
        <div className="flex-1">
          <div className="mb-4">
            <label className="text-xs text-white/50 block mb-1">To:</label>
            <div className="bg-white/5 p-2 rounded text-sm text-white/80 border border-white/10">
              <span className="bg-[#C05C0E]/30 text-white px-2 py-0.5 rounded text-xs">All Cocoa Farmers (Northern Region)</span>
            </div>
          </div>
          <div>
            <label className="text-xs text-white/50 block mb-1">Message (SMS):</label>
            <div className="bg-white/5 p-3 rounded text-sm text-white border border-white/10 h-32 font-mono resize-none">
              Alert: Heavy rainfall expected in your region tomorrow. Delay fertilizer application until Friday. - Esoko Advisory
            </div>
          </div>
        </div>
        <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/10">
          <span className="text-xs text-white/40">114 chars • 1 segment</span>
          <button className="bg-accent text-white px-6 py-2 rounded-md text-sm font-medium">Send Campaign</button>
        </div>
      </div>
    </motion.div>
  );
}

function MarketplaceMock() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      className="absolute inset-0 flex flex-col m-6"
    >
      <div className="flex gap-4 mb-4">
        <input type="text" placeholder="Search commodities..." className="bg-[#1e293b] border border-white/10 rounded-md px-4 py-2 flex-1 text-sm text-white" />
        <button className="bg-white/10 px-4 py-2 rounded-md text-sm text-white border border-white/10">Filter</button>
      </div>
      <div className="grid grid-cols-4 gap-4 flex-1 overflow-hidden">
        {['Maize', 'Cocoa Beans', 'Sorghum', 'Rice', 'Cassava', 'Soybeans', 'Millet', 'Yam'].map((c, i) => (
          <div key={c} className="bg-[#1e293b] rounded-lg border border-white/10 p-3 flex flex-col">
            <div className="h-24 bg-white/5 rounded-md mb-3 flex items-center justify-center text-white/20">
              <Store className="w-8 h-8" />
            </div>
            <div className="text-sm font-medium text-white">{c}</div>
            <div className="text-xs text-white/50 mb-2">100 Metric Tons</div>
            <div className="mt-auto flex justify-between items-end">
              <div className="text-secondary font-bold text-lg">${120 + i * 15}</div>
              <button className="text-xs bg-[#C05C0E]/20 text-[#C05C0E] px-2 py-1 rounded">Bid</button>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
