import { CheckCircle2, ExternalLink, Zap } from 'lucide-react';
import type { Product } from '@/data/products-services';
import { Motion } from './Motion';

export function PoweredBadge({ label, color }: { label: string; color: string }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full text-white"
      style={{ background: color }}
    >
      <Zap className="w-2.5 h-2.5" /> {label}
    </span>
  );
}

/* Mini app-preview mockup for product cards */
export function ProductMockup({ p }: { p: Product }) {
  return (
    <div className="rounded-xl overflow-hidden border border-gray-200 shadow-md bg-white">
      <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-100 border-b border-gray-200">
        <div className="flex gap-1">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-yellow-400" />
          <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
        </div>
        <div className="flex-1 bg-white rounded text-[10px] text-gray-400 px-2 py-0.5 border border-gray-200 truncate">
          {p.url.replace('https://', '')}
        </div>
      </div>
      <div className="flex" style={{ height: 140 }}>
        <div className="w-24 bg-gray-50 border-r border-gray-100 p-2 space-y-1 flex-shrink-0">
          <div className="flex items-center gap-1.5 px-2 py-1.5 mb-2">
            <div className="w-4 h-4 rounded" style={{ background: p.color }} />
            <div className="h-2 w-10 rounded bg-gray-300" />
          </div>
          {[0.9, 0.6, 0.5, 0.45].map((op, i) => (
            <div key={i} className={`h-6 rounded flex items-center gap-1.5 px-2 ${i === 0 ? 'bg-white shadow-sm' : ''}`}>
              <div className="w-3 h-3 rounded-sm" style={{ background: p.color, opacity: op * 0.5 }} />
              <div className="h-1.5 rounded flex-1 bg-gray-200" style={{ opacity: op * 0.7 }} />
            </div>
          ))}
        </div>
        <div className="flex-1 p-3 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="h-2.5 w-20 rounded bg-gray-800 mb-1" />
              <div className="h-1.5 w-28 rounded bg-gray-300" />
            </div>
            <div className="h-6 w-14 rounded-full text-white text-[9px] flex items-center justify-center font-bold" style={{ background: p.color }}>
              + New
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {['4.2M', '98%', '847'].map((v, i) => (
              <div key={i} className="bg-gray-50 rounded-lg p-1.5 border border-gray-100">
                <div className="text-[10px] font-bold" style={{ color: p.color }}>{v}</div>
                <div className="h-1 w-8 rounded bg-gray-200 mt-0.5" />
              </div>
            ))}
          </div>
          <div className="flex-1 bg-gray-50 rounded-lg border border-gray-100 flex items-end gap-0.5 px-2 py-1.5">
            {[55, 72, 48, 85, 60, 90, 70, 82, 65, 95].map((h, i) => (
              <div key={i} className="flex-1 rounded-t-sm transition-all" style={{ height: `${h}%`, background: p.color, opacity: 0.2 + (i / 10) * 0.7 }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function ProductCard({ p, index }: { p: Product; index: number }) {
  const Icon = p.icon;
  return (
    <Motion
      initial={{ opacity: 0, y: 32 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="group relative bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl transition-shadow duration-300 overflow-hidden flex flex-col"
    >
      <div className={`relative bg-gradient-to-br ${p.bg} p-6 pb-8`}>
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 70% 30%, white 0%, transparent 60%)' }} />
        <ProductMockup p={p} />
      </div>

      <div className="p-8 flex flex-col flex-1">
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-lg"
            style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}cc)` }}
          >
            <Icon className="w-6 h-6" />
          </div>
          <span className="text-xs font-semibold uppercase tracking-widest text-gray-400 bg-gray-50 px-3 py-1.5 rounded-full mt-1">
            {p.category}
          </span>
        </div>

        <h3 className="text-2xl font-heading font-bold text-gray-900 mb-3">{p.name}</h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-6 flex-1">{p.desc}</p>

        <div className="flex flex-wrap gap-2 mb-8">
          {p.features.map(f => (
            <span key={f} className="inline-flex items-center gap-1 text-xs font-medium bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full border border-gray-100">
              <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" /> {f}
            </span>
          ))}
        </div>

        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${p.name} platform — opens in a new tab`}
          data-testid={`link-launch-${p.id}`}
          className="inline-flex items-center gap-2 font-semibold text-sm px-6 py-3 rounded-full text-white transition-all duration-200 shadow-sm hover:shadow-lg active:scale-95 w-fit"
          style={{ background: `linear-gradient(135deg, ${p.color}, ${p.color}dd)` }}
        >
          Launch {p.name} <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </Motion>
  );
}
