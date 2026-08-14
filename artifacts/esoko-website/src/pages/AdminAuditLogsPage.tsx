import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import { ShieldCheck, RefreshCw, AlertCircle, ChevronLeft, ChevronRight, LogIn, LogOut, UserPlus, UserCog, Briefcase, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

/* ── Types ──────────────────────────────────────────────────────────── */
interface AuditLog {
  id: number;
  action: string;
  entity_type: string | null;
  entity_id: string | null;
  metadata: string | null;
  ip: string | null;
  created_at: string;
  user_email: string | null;
  user_name: string | null;
}

interface Pagination {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

const BASE = `${import.meta.env.BASE_URL}api`;

async function apiFetch<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}${path}`, { credentials: 'include' });
  if (res.status === 401 || res.status === 403) throw new Error('__UNAUTHORIZED__');
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function actionIcon(action: string) {
  if (action.includes('login_failed')) return <AlertCircle className="w-4 h-4 text-red-500" />;
  if (action.includes('login')) return <LogIn className="w-4 h-4 text-emerald-600" />;
  if (action.includes('logout')) return <LogOut className="w-4 h-4 text-gray-500" />;
  if (action.includes('user_created')) return <UserPlus className="w-4 h-4 text-blue-600" />;
  if (action.includes('user')) return <UserCog className="w-4 h-4 text-amber-600" />;
  if (action.includes('job')) return <Briefcase className="w-4 h-4 text-purple-600" />;
  if (action.includes('application')) return <CheckCircle className="w-4 h-4 text-indigo-600" />;
  return <ShieldCheck className="w-4 h-4 text-gray-400" />;
}

function actionLabel(action: string): string {
  return action.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());
}

function metaSummary(metadata: string | null): string {
  if (!metadata || metadata === '{}') return '';
  try {
    const obj = JSON.parse(metadata) as Record<string, unknown>;
    return Object.entries(obj)
      .filter(([, v]) => v !== null && v !== undefined)
      .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(', ') : String(v)}`)
      .join(' · ')
      .slice(0, 80);
  } catch { return ''; }
}

export default function AdminAuditLogsPage() {
  const [, setLocation] = useLocation();
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [pagination, setPagination] = useState<Pagination>({ page: 1, limit: 50, total: 0, pages: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadLogs = useCallback(async (page = 1) => {
    setLoading(true); setError(null);
    try {
      const data = await apiFetch<{ logs: AuditLog[]; pagination: Pagination }>(
        `/audit-logs?page=${page}&limit=50`
      );
      setLogs(data.logs);
      setPagination(data.pagination);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === '__UNAUTHORIZED__') setLocation('/admin/login');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  }, [setLocation]);

  useEffect(() => { loadLogs(1); }, [loadLogs]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img src="/esoko-logo.png" alt="Esoko" style={{ height: 32, width: 'auto' }} />
            <span className="text-gray-300">|</span>
            <div>
              <p className="font-heading font-bold text-gray-900 text-sm">Audit Logs</p>
              <p className="text-xs text-gray-400">System activity — SUPER_ADMIN only</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="outline" onClick={() => setLocation('/admin/careers')} className="rounded-xl text-sm">
              ← Back to Dashboard
            </Button>
            <button
              onClick={() => loadLogs(pagination.page)}
              className="p-2 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              aria-label="Refresh"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
            <h2 className="font-heading font-bold text-gray-900">
              Activity Log
              {pagination.total > 0 && (
                <span className="text-sm font-normal text-gray-400 ml-2">({pagination.total} events)</span>
              )}
            </h2>
          </div>

          {loading && (
            <div className="p-12 text-center text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
              <p>Loading logs…</p>
            </div>
          )}

          {error && !loading && (
            <div className="p-8 text-center text-red-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-3" />
              <p className="font-medium">Failed to load audit logs</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
              <Button onClick={() => loadLogs(1)} variant="outline" className="mt-4 rounded-xl text-sm">Retry</Button>
            </div>
          )}

          {!loading && !error && logs.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <ShieldCheck className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium text-gray-600">No audit events yet</p>
            </div>
          )}

          {!loading && !error && logs.length > 0 && (
            <>
              <div className="divide-y divide-gray-100">
                {logs.map(log => (
                  <div key={log.id} className="px-6 py-3 flex items-start gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-shrink-0 mt-0.5">{actionIcon(log.action)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm font-semibold text-gray-800">{actionLabel(log.action)}</span>
                        {log.entity_type && (
                          <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                            {log.entity_type}{log.entity_id ? ` #${log.entity_id}` : ''}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-0.5 flex-wrap">
                        <span className="text-xs text-gray-500">
                          {log.user_name ? `${log.user_name} (${log.user_email})` : log.user_email ?? 'Unknown user'}
                        </span>
                        {log.ip && <span className="text-xs text-gray-300">{log.ip}</span>}
                        {metaSummary(log.metadata) && (
                          <span className="text-xs text-gray-400 italic">{metaSummary(log.metadata)}</span>
                        )}
                      </div>
                    </div>
                    <div className="flex-shrink-0 text-xs text-gray-400 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                  <p className="text-xs text-gray-400">
                    Page {pagination.page} of {pagination.pages}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      disabled={pagination.page <= 1}
                      onClick={() => loadLogs(pagination.page - 1)}
                      className="rounded-xl text-xs px-3 py-1.5 h-auto"
                    >
                      <ChevronLeft className="w-3.5 h-3.5" />
                    </Button>
                    <Button
                      variant="outline"
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => loadLogs(pagination.page + 1)}
                      className="rounded-xl text-xs px-3 py-1.5 h-auto"
                    >
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
