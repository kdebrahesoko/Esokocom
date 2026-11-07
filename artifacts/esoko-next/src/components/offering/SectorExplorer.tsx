'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/use-reduced-motion';
import { Activity, CheckCircle2, Database, ArrowUpRight } from 'lucide-react';
import { SECTORS_DATA } from '@/data/sectors';
import { siteHref } from '@/lib/site-links';
import { buttonClass } from './button-styles';

type Tab = 'Public Sector' | 'Private Sector';
const PUBLIC_SECTORS = SECTORS_DATA.filter(s => s.category === 'Public Sector');
const PRIVATE_SECTORS = SECTORS_DATA.filter(s => s.category === 'Private Sector');
const EASE = [0.16, 1, 0.3, 1] as const;

/** Source interactive sector explorer: Public/Private tabs, sector list and animated detail card. */
export function SectorExplorer() {
  const reduced = useReducedMotion() ?? false;
  const [activeTab, setActiveTabState] = useState<Tab>('Public Sector');
  const [activeSectorId, setActiveSectorId] = useState<string>(PUBLIC_SECTORS[0].id);

  // Source synced the first sector on tab change via effect; done inline here.
  const setActiveTab = (tab: Tab) => {
    setActiveTabState(tab);
    setActiveSectorId(tab === 'Public Sector' ? PUBLIC_SECTORS[0].id : PRIVATE_SECTORS[0].id);
  };

  const activeSectorsList = activeTab === 'Public Sector' ? PUBLIC_SECTORS : PRIVATE_SECTORS;
  const activeSector = SECTORS_DATA.find(s => s.id === activeSectorId) || SECTORS_DATA[0];

  const reveal = reduced ? {} : {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, delay: 0.2, ease: EASE },
  };

  return (
    <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
      {/* Left Nav */}
      <div className="w-full lg:w-1/3 flex-shrink-0">
        <motion.div {...reveal} className="sticky top-28">
          <div className="flex p-1.5 bg-gray-200/50 rounded-2xl mb-8" role="tablist">
            {(['Public Sector', 'Private Sector'] as const).map(tab => (
              <button
                key={tab}
                type="button"
                role="tab"
                aria-selected={activeTab === tab}
                data-testid={`tab-${tab === 'Public Sector' ? 'public' : 'private'}-sector`}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${activeTab === tab ? 'bg-white text-emerald-800 shadow-sm' : 'text-gray-500 hover:text-gray-900'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-row lg:flex-col gap-2 overflow-x-auto lg:overflow-x-visible pb-4 lg:pb-0 hide-scrollbar">
            {activeSectorsList.map(sector => {
              const isActive = activeSectorId === sector.id;
              const Icon = sector.icon;
              return (
                <button
                  key={sector.id}
                  type="button"
                  aria-pressed={isActive}
                  data-testid={`button-sector-${sector.id}`}
                  onClick={() => setActiveSectorId(sector.id)}
                  className={`flex-shrink-0 lg:flex-shrink w-auto lg:w-full flex items-center gap-3 px-5 py-4 rounded-2xl text-left transition-all ${
                    isActive
                      ? 'bg-emerald-800 text-white shadow-lg shadow-emerald-900/20 translate-x-0 lg:translate-x-2'
                      : 'bg-white border border-gray-100 text-gray-700 hover:bg-emerald-50 hover:border-emerald-100 hover:text-emerald-800'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-colors ${isActive ? 'bg-white/15' : 'bg-gray-50'}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{sector.name}</span>
                </button>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Right Content Panel */}
      <div className="w-full lg:w-2/3">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSector.id}
            initial={{ opacity: 0, y: 20, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            exit={{ opacity: 0, y: -20, filter: 'blur(4px)' }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="bg-white rounded-3xl border border-gray-100 shadow-xl overflow-hidden"
            data-testid={`card-sector-${activeSector.id}`}
          >
            <div className="relative h-64 sm:h-80 lg:h-96 w-full overflow-hidden group">
              <Image
                src={activeSector.heroImage}
                alt={activeSector.imageAlt}
                fill
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-white text-xs font-bold uppercase tracking-wider mb-3">
                  {activeSector.category}
                </div>
                <h3 className="text-3xl md:text-4xl font-heading font-bold text-white">{activeSector.headline}</h3>
              </div>
            </div>

            <div className="p-8 md:p-10">
              <p className="text-lg text-gray-600 mb-10 leading-relaxed">{activeSector.description}</p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-5 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-600" /> Use Cases
                  </h4>
                  <ul className="space-y-3">
                    {activeSector.useCases.slice(0, 6).map(uc => (
                      <li key={uc} className="flex items-start gap-3 text-gray-600">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span className="leading-snug">{uc}</span>
                      </li>
                    ))}
                    {activeSector.useCases.length > 6 && (
                      <li className="text-sm text-emerald-600 font-medium pl-8">
                        + {activeSector.useCases.length - 6} more applications
                      </li>
                    )}
                  </ul>
                </div>

                <div>
                  <h4 className="text-sm font-bold uppercase tracking-wider text-gray-900 mb-5 flex items-center gap-2">
                    <Database className="w-4 h-4 text-emerald-600" /> Esoko Capabilities
                  </h4>
                  <div className="grid grid-cols-1 gap-3">
                    {activeSector.capabilities.map(cap => {
                      const CapIcon = cap.icon;
                      return (
                        <div key={cap.name} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 border border-gray-100 hover:border-emerald-200 transition-colors">
                          <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center flex-shrink-0">
                            <CapIcon className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-gray-800 text-sm">{cap.name}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="mt-10 py-6 border-t border-b border-gray-100 grid grid-cols-3 gap-4">
                {activeSector.statistics.map(stat => (
                  <div key={stat.label}>
                    <div className="text-2xl md:text-3xl font-heading font-bold text-emerald-800">{stat.value}</div>
                    <div className="text-xs font-medium text-gray-500 mt-1 uppercase tracking-wide">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8">
                <a
                  href={siteHref(`/sectors/${activeSector.slug}`)}
                  data-testid={`link-sector-detail-${activeSector.slug}`}
                  className={buttonClass('w-full sm:w-auto rounded-full px-8 py-6 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold text-base flex items-center justify-center gap-2 group')}
                >
                  {activeSector.cta}
                  <ArrowUpRight className="w-5 h-5 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </a>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
