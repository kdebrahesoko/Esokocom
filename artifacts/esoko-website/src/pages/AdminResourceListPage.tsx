/**
 * AdminResourceListPage.tsx
 * /admin/resources/:type  (blog, events, podcasts, webinars, reports, customer-stories)
 *
 * Per-type resource list — same table UI, pre-filtered to one content type.
 */
import { useState, useEffect, useCallback } from 'react';
import { Link, useParams } from 'wouter';
import {
  Plus, Search, RefreshCw, AlertCircle, Edit2, Trash2,
  ChevronLeft, ChevronRight, ArrowLeft,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminUser } from '@/components/admin/AdminLayout';
import { ADMIN_URL_TO_API_TYPE, STATUS_COLORS } from './AdminResourcesPage';
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
  publishedAt: string | null;
  updatedAt: string;
}

const LABELS: Record<string, string> = {
  blog:             'Blog Posts',
  events:           'Events',
  podcasts:         'Podcasts',
  webinars:         'Webinars',
  reports:          'Research Reports',
  'customer-stories': 'Customer Stories',
};

const ALL_STATUSES = ['Draft', 'In Review', 'Scheduled', 'Published', 'Unpublished', 'Archived'];
const LIMIT = 20;

export default function AdminResourceListPage() {
  const params  = useParams<{ type: string }>();
  const typeKey = params.type ?? 'blog';            // e.g. "events"
  const apiType = ADMIN_URL_TO_API_TYPE[typeKey];   // e.g. "event"
  const label   = LABELS[typeKey] ?? typeKey;
  const user    = useAdminUser();
  const isEditor = user && ['SUPER_ADMIN','CONTENT_EDITOR'].includes(user.role);

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading]     = useState(true);
  const [error, setError]         = useState<string | null>(null);
  const [search, setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage]   = useState(1);
  const [total, setTotal] = useState(0);

  const load = useCallback(async (p = 1, s = search, sf = statusFilter) => {
    if (!apiType) return;
    setLoading(true); setError(null);
    try {
      const params = new URLSearchParams({ type: apiType, page: String(p), limit: String(LIMIT) });
      if (s)  params.set('search', s);
      if (sf) params.set('status', sf);
      const data = await fetch(`${BASE}/admin/resources?${params}`, { credentials: 'include' }).then(r => r.json()) as {
        resources: Resource[]; total: number;
      };
      setResources(data.resources); setTotal(data.total); setPage(p);
    } catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [apiType, search, statusFilter]);

  useEffect(() => { load(1); }, [apiType]); // reload when type changes // eslint-disable-line react-hooks/exhaustive-deps

  const handleDelete = async (r: Resource) => {
    if (!confirm(`Archive "${r.title}"?`)) return;
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
      title={label}
      actions={
        <Link href={`/admin/resources/new?type=${typeKey}`}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> New
        </Link>
      }
    >
      <div className="max-w-6xl mx-auto space-y-5">

        {/* Back link */}
        <Link href="/admin/resources" className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-emerald-700 w-fit">
          <ArrowLeft className="w-4 h-4" /> All Resources
        </Link>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 items-center">
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="search" value={search}
              onChange={e => { setSearch(e.target.value); load(1, e.target.value, statusFilter); }}
              placeholder={`Search ${label}…`}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400"
            />
          </div>
          <select
            value={statusFilter}
            onChange={e => { setStatusFilter(e.target.value); load(1, search, e.target.value); }}
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

        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Title</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Category</th>
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
                <tr><td colSpan={5} className="text-center py-12 text-sm text-gray-400">
                  No {label.toLowerCase()} yet. <Link href={`/admin/resources/new?type=${typeKey}`} className="text-emerald-600 hover:underline">Create the first one.</Link>
                </td></tr>
              ) : resources.map(r => (
                <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-5 py-3">
                    <p className="font-medium text-gray-900 line-clamp-1">{r.title}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.slug}</p>
                  </td>
                  <td className="px-5 py-3 text-gray-500 hidden md:table-cell text-xs">{r.categoryName ?? '—'}</td>
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
              ))}
            </tbody>
          </table>

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
