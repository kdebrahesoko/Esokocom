/**
 * AdminUsersPage.tsx
 * /admin/users (SUPER_ADMIN only)
 *
 * List users, create new users, edit roles/active status.
 */
import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'wouter';
import {
  Plus, RefreshCw, AlertCircle, ShieldCheck, UserCog,
  UserX, UserCheck, Edit2, X, Save, Eye, EyeOff, Loader2,
} from 'lucide-react';
import AdminLayout, { useAdminUser } from '@/components/admin/AdminLayout';
import { toast } from '@/hooks/use-toast';

const BASE = `${import.meta.env.BASE_URL}api`;

async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...opts,
    credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers ?? {}) },
  });
  if (res.status === 401 || res.status === 403) throw new Error('__UNAUTHORIZED__');
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

interface AdminUserRow {
  id: number;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  createdAt: string;
}

const ROLES = ['SUPER_ADMIN', 'HR_ADMIN', 'CONTENT_EDITOR', 'CONTENT_AUTHOR'] as const;

const ROLE_COLORS: Record<string, string> = {
  SUPER_ADMIN:     'bg-red-100 text-red-700',
  HR_ADMIN:        'bg-blue-100 text-blue-700',
  CONTENT_EDITOR:  'bg-emerald-100 text-emerald-700',
  CONTENT_AUTHOR:  'bg-amber-100 text-amber-700',
};

const BLANK_CREATE = { name: '', email: '', password: '', role: 'CONTENT_AUTHOR' as const };
const BLANK_EDIT   = { name: '', role: 'CONTENT_AUTHOR' as string, isActive: true, password: '' };

export default function AdminUsersPage() {
  const [, setLocation] = useLocation();
  const currentUser = useAdminUser();

  const [users, setUsers]     = useState<AdminUserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  /* Dialog state */
  const [showCreate, setShowCreate] = useState(false);
  const [editUser, setEditUser]     = useState<AdminUserRow | null>(null);
  const [createForm, setCreateForm] = useState(BLANK_CREATE);
  const [editForm, setEditForm]     = useState(BLANK_EDIT);
  const [showPwd, setShowPwd]       = useState(false);
  const [saving, setSaving]         = useState(false);
  const [formError, setFormError]   = useState<string | null>(null);

  const loadUsers = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const data = await apiFetch<{ users: AdminUserRow[] }>('/users');
      setUsers(data.users);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === '__UNAUTHORIZED__') setLocation('/admin/login');
      else setError(msg);
    } finally { setLoading(false); }
  }, [setLocation]);

  useEffect(() => { loadUsers(); }, [loadUsers]);

  // SUPER_ADMIN guard
  useEffect(() => {
    if (currentUser && currentUser.role !== 'SUPER_ADMIN') setLocation('/admin');
  }, [currentUser, setLocation]);

  const openEdit = (u: AdminUserRow) => {
    setEditUser(u);
    setEditForm({ name: u.name, role: u.role, isActive: u.isActive, password: '' });
    setFormError(null);
  };

  const handleCreate = async () => {
    if (!createForm.name || !createForm.email || !createForm.password) {
      setFormError('Name, email and password are required'); return;
    }
    setSaving(true); setFormError(null);
    try {
      await apiFetch('/users', { method: 'POST', body: JSON.stringify(createForm) });
      toast({ title: 'User created', description: `${createForm.email} added successfully.` });
      setShowCreate(false); setCreateForm(BLANK_CREATE);
      await loadUsers();
    } catch (e) { setFormError((e as Error).message); }
    finally { setSaving(false); }
  };

  const handleEdit = async () => {
    if (!editUser) return;
    setSaving(true); setFormError(null);
    try {
      const payload: Record<string, unknown> = {
        name: editForm.name, role: editForm.role, isActive: editForm.isActive,
      };
      if (editForm.password) payload.password = editForm.password;
      await apiFetch(`/users/${editUser.id}`, { method: 'PUT', body: JSON.stringify(payload) });
      toast({ title: 'User updated' });
      setEditUser(null);
      await loadUsers();
    } catch (e) { setFormError((e as Error).message); }
    finally { setSaving(false); }
  };

  const handleDeactivate = async (u: AdminUserRow) => {
    if (u.id === currentUser?.id) { alert("You can't deactivate your own account."); return; }
    if (!confirm(`Deactivate ${u.name}? They will lose access immediately.`)) return;
    try {
      await apiFetch(`/users/${u.id}`, { method: 'DELETE' });
      toast({ title: 'User deactivated' });
      await loadUsers();
    } catch (e) { alert((e as Error).message); }
  };

  const handleReactivate = async (u: AdminUserRow) => {
    try {
      await apiFetch(`/users/${u.id}`, { method: 'PUT', body: JSON.stringify({ isActive: true }) });
      toast({ title: 'User reactivated' });
      await loadUsers();
    } catch (e) { alert((e as Error).message); }
  };

  return (
    <AdminLayout
      title="Users"
      actions={
        <button onClick={() => { setShowCreate(true); setFormError(null); setCreateForm(BLANK_CREATE); }}
          className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
          <Plus className="w-4 h-4" /> New User
        </button>
      }
    >
      <div className="max-w-4xl mx-auto space-y-6">

        {loading && (
          <div className="flex justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        )}
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> <p className="text-sm">{error}</p>
          </div>
        )}

        {!loading && !error && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="font-heading font-bold text-gray-900">All Users ({users.length})</h2>
              <button onClick={loadUsers} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100">
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide hidden md:table-cell">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                  <th className="text-right px-6 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {users.map(u => (
                  <tr key={u.id} className={`hover:bg-gray-50 ${!u.isActive ? 'opacity-50' : ''}`}>
                    <td className="px-6 py-3 font-medium text-gray-900">
                      <div>{u.name}</div>
                      <div className="text-xs text-gray-400 md:hidden">{u.email}</div>
                    </td>
                    <td className="px-6 py-3 text-gray-500 hidden md:table-cell">{u.email}</td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-semibold px-2 py-1 rounded-full ${ROLE_COLORS[u.role] ?? 'bg-gray-100 text-gray-600'}`}>
                        {u.role.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      {u.isActive
                        ? <span className="flex items-center gap-1 text-xs text-emerald-600"><UserCheck className="w-3.5 h-3.5" /> Active</span>
                        : <span className="flex items-center gap-1 text-xs text-gray-400"><UserX className="w-3.5 h-3.5" /> Inactive</span>
                      }
                    </td>
                    <td className="px-6 py-3">
                      <div className="flex items-center gap-2 justify-end">
                        <button onClick={() => openEdit(u)} className="text-gray-400 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100" title="Edit">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        {u.isActive ? (
                          <button onClick={() => handleDeactivate(u)} className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50" title="Deactivate">
                            <UserX className="w-4 h-4" />
                          </button>
                        ) : (
                          <button onClick={() => handleReactivate(u)} className="text-gray-400 hover:text-emerald-600 p-1.5 rounded-lg hover:bg-emerald-50" title="Reactivate">
                            <UserCheck className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── Create user modal ─────────────────────────────────────────── */}
      {showCreate && (
        <Modal title="New User" onClose={() => setShowCreate(false)}>
          <div className="space-y-4">
            {formError && <ErrorBanner msg={formError} />}
            <Field label="Full Name *">
              <input type="text" value={createForm.name} onChange={e => setCreateForm(p => ({...p, name: e.target.value}))}
                placeholder="Jane Smith" className={inputCls} />
            </Field>
            <Field label="Email Address *">
              <input type="email" value={createForm.email} onChange={e => setCreateForm(p => ({...p, email: e.target.value}))}
                placeholder="jane@esoko.com" className={inputCls} />
            </Field>
            <Field label="Password *">
              <PasswordInput value={createForm.password} onChange={v => setCreateForm(p => ({...p, password: v}))} show={showPwd} setShow={setShowPwd} />
            </Field>
            <Field label="Role">
              <select value={createForm.role} onChange={e => setCreateForm(p => ({...p, role: e.target.value as typeof createForm.role}))} className={inputCls}>
                {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
              </select>
            </Field>
          </div>
          <ModalFooter>
            <button onClick={() => setShowCreate(false)} className={cancelCls}>Cancel</button>
            <button onClick={handleCreate} disabled={saving} className={submitCls}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Create User</>}
            </button>
          </ModalFooter>
        </Modal>
      )}

      {/* ── Edit user modal ───────────────────────────────────────────── */}
      {editUser && (
        <Modal title={`Edit: ${editUser.name}`} onClose={() => setEditUser(null)}>
          <div className="space-y-4">
            {formError && <ErrorBanner msg={formError} />}
            <Field label="Full Name">
              <input type="text" value={editForm.name} onChange={e => setEditForm(p => ({...p, name: e.target.value}))} className={inputCls} />
            </Field>
            <Field label="Role">
              <select value={editForm.role} onChange={e => setEditForm(p => ({...p, role: e.target.value}))} className={inputCls}>
                {ROLES.map(r => <option key={r} value={r}>{r.replace(/_/g, ' ')}</option>)}
              </select>
            </Field>
            <Field label="New Password (leave blank to keep current)">
              <PasswordInput value={editForm.password} onChange={v => setEditForm(p => ({...p, password: v}))} show={showPwd} setShow={setShowPwd} placeholder="Leave blank to keep current" />
            </Field>
            <div className="flex items-center gap-3">
              <button type="button" onClick={() => setEditForm(p => ({...p, isActive: !p.isActive}))}
                className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${editForm.isActive ? 'bg-emerald-500' : 'bg-gray-300'}`}>
                <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${editForm.isActive ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
              <span className="text-sm text-gray-700">Account active</span>
            </div>
            <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-amber-600 flex-shrink-0" />
              <p className="text-xs text-amber-700">Role changes take effect on next login.</p>
            </div>
          </div>
          <ModalFooter>
            <button onClick={() => setEditUser(null)} className={cancelCls}>Cancel</button>
            <button onClick={handleEdit} disabled={saving} className={submitCls}>
              {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4" /> Save Changes</>}
            </button>
          </ModalFooter>
        </Modal>
      )}
    </AdminLayout>
  );
}

/* ── Tiny helpers ─────────────────────────────────────────────────── */
const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400";
const cancelCls = "px-4 py-2 text-sm border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium";
const submitCls = "flex items-center gap-1.5 px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-colors font-semibold disabled:opacity-50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      {children}
    </div>
  );
}

function ErrorBanner({ msg }: { msg: string }) {
  return (
    <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
      <AlertCircle className="w-4 h-4 flex-shrink-0" /> {msg}
    </div>
  );
}

function PasswordInput({ value, onChange, show, setShow, placeholder }: {
  value: string; onChange: (v: string) => void; show: boolean; setShow: (s: boolean) => void; placeholder?: string;
}) {
  return (
    <div className="relative">
      <input type={show ? 'text' : 'password'} value={value} onChange={e => onChange(e.target.value)}
        placeholder={placeholder ?? 'Enter password'} className={`${inputCls} pr-10`} />
      <button type="button" onClick={() => setShow(!show)}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6 space-y-6 overflow-y-auto max-h-[90vh]">
        <div className="flex items-center justify-between">
          <h2 className="font-heading font-bold text-gray-900">{title}</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ModalFooter({ children }: { children: React.ReactNode }) {
  return <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">{children}</div>;
}
