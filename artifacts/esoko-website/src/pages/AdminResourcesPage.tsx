/**
 * AdminResourcesPage.tsx
 * /admin/resources — All resources across all types.
 * Filterable by type, status, and search query.
 */
import { useState, useEffect, useCallback } from 'react';
import { Link } from 'wouter';
import {
  Plus, Search, RefreshCw, AlertCircle, FileText, Calendar,
  Mic, Video, BarChart2, BookOpen, Edit2, Trash2, ChevronLeft, ChevronRight,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminUser } from '@/components/admin/AdminLayout';
import { toast } from '@/hooks/use-toast';

const BASE = `${import.meta.env.BASE_URL}api`;

interface Resource {
  id: number;
  title: string;
  slug: string;
  contentType: string;
  status: string;
  featured: boolean;
  typeSlug: string;
  categoryName: string | null;
  authorName?: string;
  publishedAt: string | null;
  updatedAt: string;
}

/* ── Type mappings ────────────────────────────────────────────────── */
export const DB_TYPE_TO_ADMIN_URL: Record<string, string> = {
  'Blog':            'blog',
  'Event':           'events',
  'Podcast':         'podcasts',
  'Webinar':         'webinars',
  'Research Report': 'reports',
  'Customer Story':  'customer-stories',
};

export const ADMIN_URL_TO_API_TYPE: Record<string, string> = {
  'blog':             'blog',
  'events':           'event',
  'podcasts':         'podcast',
  'webinars':         'webinar',
  'reports':          'research-report',
  'customer-stories': 'customer-story',
};

const TYPE_ICONS: Record<string, React.FC<{ className?: string }>> = {
  Blog:             FileText,
  Event:            Calendar,
  Podcast:          Mic,
  Webinar:          Video,
  'Research Report': BarChart2,
  'Customer Story': BookOpen,
};

const TYPE_COLORS: Record<string, string> = {
  Blog:             'bg-purple-100 text-purple-700',
  Event:            'bg-blue-100 text-blue-700',
  Podcast:          'bg-orange-100 text-orange-700',
  Webinar:          'bg-indigo-100 text-indigo-700',
  'Research Report': 'bg-teal-100 text-teal-700',
  'Customer Story': 'bg-emerald-100 text-emerald-700',
};

export const STATUS_COLORS: Record<string, string> = {
  Draft:       'bg-gray-100 text-gray-600',
  'In Review': 'bg-amber-100 text-amber-700',
  Scheduled:   'bg-blue-100 text-blue-700',
  Published:   'bg-emerald-100 text-emerald-700',
  Unpublished: 'bg-orange-100 text-orange-700',
  Archived:    'bg-red-100 text-red-600',
};

const ALL_STATUSES = ['Draft', 'In Review', 'Scheduled', 'Published', 'Unpublished', 'Archived'];
const ALL_TYPES    = ['blog', 'events', 'podcasts', 'webinars', 'reports', 'customer-stories'];
const TYPE_LABELS: Record<string, string> = {
  blog: 'Blog', events: 'Events', podcasts: 'Podcasts',
  webinars: 'Webinars', reports: 'Reports', 'customer-stories': 'Customer Stories',
};

export default function AdminResourcesPage() {
  const user = useAdminUser();
  const isEditor = user && ['SUPER_ADMIN','CONTENT_EDITOR'].includes(user.role);

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter]     = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]     = useState(1);
  const [total, setTotal]   = useState(0);
  const LIMIT = 20;

  const load = useCallback(async (p = 1, s = search, tf = typeFilter, sf = statusFilter) => {
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (s)  params.set('search', s);
      if (tf) params.set('type', ADMIN_URL_TO_API_TYPE[tf] ?? tf);
      if (sf) params.set('status', sf);
      const data = await fetch(`${BASE}/admin/resources?${params}`, { credentials: 'include' }).then(r => r.json()) as {
        resources: Resource[]; total: number;
      };
      setResources(data.resources); setTotal(data.total); setPage(p);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [search, typeFilter, statusFilter]);

  useEffect(() => { load(1); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (r: Resource) => {
    if (!confirm(`Archive "${r.title}"? It will be hidden from the public.`)) return;
    try {
      const res = await fetch(`${BASE}/admin/resources/${r.id}`, { method: 'DELETE', credentials: 'include' });
      if (!res.ok) throw new Error('Delete failed');
      toast({ title: 'Resource archived' });
      load(page);
    } catch (e) { alert((e as Error).message); }
  };

  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  return (
    <AdminLayout
      title="All Resources"
      actions={
        <Link href="/admin/resources/new"
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> New Resource
        </Link>
      }
    >
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Type quick-links */}
        <div className="flex flex-wrap gap-2">
          <TypeChip active={typeFilter === ''} onClick={() => { setTypeFilter(''); load(1, search, '', statusFilter); }}>All</TypeChip>
          {ALL_TYPES.map(t => (
            <TypeChip key={t} active={typeFilter === t} onClick={() => { setTypeFilter(t); load(1, search, t, statusFilter); }}>
              {TYPE_LABELS[t]}
            </TypeChip>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="search"
              value={search}
              onChange={e => { setSearch(e.target.value); load(1, e.target.value, typeFilter, statusFilter); }}
              placeholder="Search title…"
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); load(1, search, typeFilter, e.target.value); }}
            className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30"
          >
            <option value="">All statuses</option>
            {ALL_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => load(page)} className="text-gray-400 hover:text-gray-700 p-2 rounded-xl hover:bg-gray-100">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
          <span className="text-xs text-gray-400 ml-auto">{total} total</span>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Table */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Type</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden lg:table-cell">Updated</th>
                <th className="text-right px-5 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400">
                  <RefreshCw className="w-5 h-5 animate-spin inline" />
                </td></tr>
              ) : resources.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-12 text-gray-400 text-sm">No resources found.</td></tr>
              ) : resources.map(r => {
                const Icon = TYPE_ICONS[r.contentType] ?? FileText;
                const adminUrl = DB_TYPE_TO_ADMIN_URL[r.contentType] ?? 'blog';
                return (
                  <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4 text-gray-400 flex-shrink-0 hidden sm:block" />
                        <div>
                          <p className="font-medium text-gray-900 line-clamp-1">{r.title}</p>
                          <p className="text-xs text-gray-400">/{adminUrl}/{r.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3 hidden md:table-cell">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${TYPE_COLORS[r.contentType] ?? 'bg-gray-100 text-gray-600'}`}>
                        {r.contentType}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_COLORS[r.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-gray-400 text-xs hidden lg:table-cell">
                      {new Date(r.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-1 justify-end">
                        <Link href={`/admin/resources/${r.id}/edit`}
                          className="text-gray-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-50 transition-colors" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </Link>
                        {isEditor && (
                          <button onClick={() => handleDelete(r)}
                            className="text-gray-400 hover:text-red-500 p-1.5 rounded-lg hover:bg-red-50 transition-colors" title="Archive">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-between">
              <p className="text-xs text-gray-400">Page {page} of {totalPages}</p>
              <div className="flex gap-1">
                <button onClick={() => load(page - 1)} disabled={page <= 1}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button onClick={() => load(page + 1)} disabled={page >= totalPages}
                  className="p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40">
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
}

function TypeChip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors
        ${active ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300 hover:text-emerald-700'}`}>
      {children}
    </button>
  );
}
