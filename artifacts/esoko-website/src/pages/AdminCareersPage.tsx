import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Plus, Edit2, Archive, ChevronDown, ChevronUp, Users, Briefcase,
  Clock, XCircle, DownloadCloud, Eye, EyeOff, RefreshCw,
  AlertCircle, Save, X, LogOut, Search, MessageSquare, Send,
  Star, SlidersHorizontal,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link, useLocation } from 'wouter';

/* ── Types ──────────────────────────────────────────────────────────── */
interface ApiJob {
  dbId: number;
  slug: string;
  title: string;
  department: string;
  location: string;
  type: string;
  experience: string;
  featured: boolean;
  about: string;
  responsibilities: string[];
  requirements: string[];
  niceToHave: string[];
  skills: string[];
  benefits: string[];
  salaryRange?: string;
  deadline: string;
  applicationQuestions: string[];
  seoTitle?: string;
  seoDescription?: string;
  status: 'Draft' | 'Published' | 'Closed';
  publishedAt?: string | null;
  publishedBy?: number | null;
  postedDaysAgo: number;
  createdAt: string;
}

interface ApplicationAnswer { question: string; answer: string; }
interface Application {
  id: number;
  jobId: number;
  jobTitle?: string;
  jobSlug?: string;
  name: string;
  email: string;
  phone?: string;
  coverLetter?: string;
  cvFileUrl?: string;
  answers?: ApplicationAnswer[] | string;
  stage: ApplicationStage;
  createdAt: string;
}

interface AppNote {
  id: number;
  body: string;
  authorId: number | null;
  createdAt: string;
}

type ApplicationStage =
  | 'Applied' | 'Review' | 'Leadership'   // legacy
  | 'New' | 'Screening' | 'Shortlisted' | 'Interview' | 'Assessment'
  | 'Offer' | 'Hired' | 'Rejected' | 'Withdrawn';

// Preferred display order (legacy stages kept for backward compat display)
const STAGES: ApplicationStage[] = [
  'New', 'Screening', 'Shortlisted', 'Interview', 'Assessment',
  'Offer', 'Hired', 'Rejected', 'Withdrawn',
  // legacy shown if data exists but not as new selection options
];
const ALL_STAGES: ApplicationStage[] = [
  'Applied', 'Review', 'Leadership',
  'New', 'Screening', 'Shortlisted', 'Interview', 'Assessment',
  'Offer', 'Hired', 'Rejected', 'Withdrawn',
];

const STAGE_COLORS: Record<ApplicationStage, string> = {
  Applied:     'bg-blue-100 text-blue-700',
  Review:      'bg-amber-100 text-amber-700',
  Leadership:  'bg-cyan-100 text-cyan-700',
  New:         'bg-sky-100 text-sky-700',
  Screening:   'bg-amber-100 text-amber-700',
  Shortlisted: 'bg-purple-100 text-purple-700',
  Interview:   'bg-indigo-100 text-indigo-700',
  Assessment:  'bg-violet-100 text-violet-700',
  Offer:       'bg-emerald-100 text-emerald-700',
  Hired:       'bg-green-100 text-green-700 font-semibold',
  Rejected:    'bg-red-100 text-red-600',
  Withdrawn:   'bg-gray-100 text-gray-500',
};

const STATUS_COLORS: Record<string, string> = {
  Draft:     'bg-gray-100 text-gray-600',
  Published: 'bg-emerald-100 text-emerald-700',
  Closed:    'bg-red-100 text-red-600',
};

/* ── API helpers ────────────────────────────────────────────────────── */
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

/* ── Blank job form ─────────────────────────────────────────────────── */
const BLANK_JOB = {
  slug: '', title: '', department: 'Engineering', location: '', type: 'Full Time',
  experience: 'Mid Level', featured: false, about: '', responsibilities: '',
  requirements: '', niceToHave: '', skills: '', benefits: '', salaryRange: '',
  deadline: '', status: 'Draft', applicationQuestions: '',
  seoTitle: '', seoDescription: '',
};
type JobFormState = typeof BLANK_JOB;

/* ═══════════════════════════════════════════════════════════════════════ */
/*  PAGE                                                                   */
/* ═══════════════════════════════════════════════════════════════════════ */

export default function AdminCareersPage() {
  const [, setLocation] = useLocation();

  /* Auth / role */
  const [authChecked, setAuthChecked] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ id: number; role: string; name: string } | null>(null);

  useEffect(() => {
    apiFetch<{ authenticated: boolean; user: { id: number; role: string; name: string } }>('/auth/me')
      .then(d => { setCurrentUser(d.user); setAuthChecked(true); })
      .catch(err => {
        if ((err as Error).message === '__UNAUTHORIZED__') setLocation('/admin/login');
        else setAuthChecked(true);
      });
  }, [setLocation]);

  const handleLogout = async () => {
    await fetch(`${BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    setLocation('/admin/login');
  };

  /* Jobs state */
  const [jobs, setJobs] = useState<ApiJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<string>('All');

  /* Form state */
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<ApiJob | null>(null);
  const [form, setForm] = useState<JobFormState>(BLANK_JOB);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  /* Applications panel per-job */
  const [expandedJob, setExpandedJob] = useState<number | null>(null);
  const [applications, setApplications] = useState<Record<number, Application[]>>({});
  const [loadingApps, setLoadingApps] = useState<number | null>(null);
  const [appSearch, setAppSearch] = useState<Record<number, string>>({});
  const [appStageFilter, setAppStageFilter] = useState<Record<number, string>>({});

  /* Notes state */
  const [notes, setNotes] = useState<Record<number, AppNote[]>>({});
  const [expandedNotes, setExpandedNotes] = useState<Set<number>>(new Set());
  const [loadingNotes, setLoadingNotes] = useState<number | null>(null);
  const [noteInput, setNoteInput] = useState<Record<number, string>>({});
  const [savingNote, setSavingNote] = useState<number | null>(null);

  /* ── Main view: Jobs | All Applications ────────────────────────── */
  const [mainView, setMainView] = useState<'jobs' | 'applications'>('jobs');

  /* All-applications (server-paginated) */
  const [allApps, setAllApps] = useState<Application[]>([]);
  const [allAppsTotal, setAllAppsTotal] = useState(0);
  const [allAppsPages, setAllAppsPages] = useState(1);
  const [allAppsPage, setAllAppsPage] = useState(1);
  const [allAppsSearch, setAllAppsSearch] = useState('');
  const [allAppsStage, setAllAppsStage] = useState('');
  const [allAppsLoading, setAllAppsLoading] = useState(false);
  const [allAppsError, setAllAppsError] = useState<string | null>(null);
  const APPS_PER_PAGE = 20;

  const loadJobs = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const params = statusFilter !== 'All' ? `?status=${statusFilter}` : '';
      const data = await apiFetch<{ jobs: ApiJob[] }>(`/jobs/admin/all${params}`);
      setJobs(data.jobs);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === '__UNAUTHORIZED__') setLocation('/admin/login');
      else setError(msg);
    } finally {
      setLoading(false);
    }
  }, [setLocation, statusFilter]);

  useEffect(() => { if (authChecked) loadJobs(); }, [authChecked, loadJobs]);

  const loadApplications = async (jobId: number, slug: string) => {
    if (expandedJob === jobId) { setExpandedJob(null); return; }
    if (applications[jobId]) { setExpandedJob(jobId); return; }
    setLoadingApps(jobId);
    try {
      const data = await apiFetch<{ applications: Application[] }>(`/jobs/admin/${slug}/applications`);
      setApplications(prev => ({ ...prev, [jobId]: data.applications }));
      setExpandedJob(jobId);
    } catch (e) { console.error('Failed to load applications', e); }
    finally { setLoadingApps(null); }
  };

  const loadAllApplications = useCallback(async (page = allAppsPage, search = allAppsSearch, stage = allAppsStage) => {
    setAllAppsLoading(true); setAllAppsError(null);
    try {
      const params = new URLSearchParams({ page: String(page), limit: String(APPS_PER_PAGE) });
      if (search) params.set('search', search);
      if (stage) params.set('stage', stage);
      const data = await apiFetch<{ applications: Application[]; total: number; totalPages: number; page: number }>(
        `/jobs/admin/all-applications?${params.toString()}`
      );
      setAllApps(data.applications);
      setAllAppsTotal(data.total);
      setAllAppsPages(data.totalPages);
      setAllAppsPage(data.page);
    } catch (e) {
      const msg = (e as Error).message;
      if (msg === '__UNAUTHORIZED__') setLocation('/admin/login');
      else setAllAppsError(msg);
    } finally { setAllAppsLoading(false); }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setLocation]);

  useEffect(() => {
    if (mainView === 'applications' && authChecked) {
      loadAllApplications(1, '', '');
      setAllAppsPage(1); setAllAppsSearch(''); setAllAppsStage('');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mainView, authChecked]);

  const loadNotes = async (appId: number) => {
    setLoadingNotes(appId);
    try {
      const data = await apiFetch<{ notes: AppNote[] }>(`/jobs/admin/applications/${appId}/notes`);
      setNotes(prev => ({ ...prev, [appId]: data.notes }));
    } finally { setLoadingNotes(null); }
  };

  const toggleNotes = async (appId: number) => {
    const next = new Set(expandedNotes);
    if (next.has(appId)) { next.delete(appId); setExpandedNotes(next); return; }
    next.add(appId); setExpandedNotes(next);
    if (!notes[appId]) await loadNotes(appId);
  };

  const submitNote = async (appId: number, jobId: number) => {
    const body = noteInput[appId]?.trim();
    if (!body) return;
    setSavingNote(appId);
    try {
      const data = await apiFetch<{ note: AppNote }>(`/jobs/admin/applications/${appId}/notes`, {
        method: 'POST',
        body: JSON.stringify({ body }),
      });
      setNotes(prev => ({ ...prev, [appId]: [data.note, ...(prev[appId] ?? [])] }));
      setNoteInput(prev => ({ ...prev, [appId]: '' }));
      void jobId; // kept for future refresh
    } catch (e) { alert('Failed to save note: ' + (e as Error).message); }
    finally { setSavingNote(null); }
  };

  const openCreate = () => {
    setEditingJob(null); setForm(BLANK_JOB); setFormError(null);
    setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openEdit = (job: ApiJob) => {
    setEditingJob(job);
    setForm({
      slug: job.slug, title: job.title, department: job.department,
      location: job.location, type: job.type, experience: job.experience,
      featured: job.featured,
      about: job.about,
      responsibilities: job.responsibilities.join('\n'),
      requirements: job.requirements.join('\n'),
      niceToHave: job.niceToHave.join('\n'),
      skills: job.skills.join(', '),
      benefits: job.benefits.join(', '),
      salaryRange: job.salaryRange ?? '',
      deadline: job.deadline,
      status: job.status,
      applicationQuestions: (job.applicationQuestions ?? []).join('\n'),
      seoTitle: job.seoTitle ?? '',
      seoDescription: job.seoDescription ?? '',
    });
    setFormError(null); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const saveJob = async () => {
    setSaving(true); setFormError(null);
    try {
      const payload = {
        ...form,
        featured: form.featured,
        responsibilities: form.responsibilities.split('\n').map(s => s.trim()).filter(Boolean),
        requirements: form.requirements.split('\n').map(s => s.trim()).filter(Boolean),
        niceToHave: form.niceToHave.split('\n').map(s => s.trim()).filter(Boolean),
        skills: form.skills.split(',').map(s => s.trim()).filter(Boolean),
        benefits: form.benefits.split(',').map(s => s.trim()).filter(Boolean),
        applicationQuestions: form.applicationQuestions.split('\n').map(s => s.trim()).filter(Boolean),
        seoTitle: form.seoTitle || undefined,
        seoDescription: form.seoDescription || undefined,
      };
      if (editingJob) {
        await apiFetch(`/jobs/${editingJob.dbId}`, { method: 'PUT', body: JSON.stringify(payload) });
      } else {
        await apiFetch('/jobs', { method: 'POST', body: JSON.stringify(payload) });
      }
      setShowForm(false); await loadJobs();
    } catch (e) { setFormError((e as Error).message); }
    finally { setSaving(false); }
  };

  const toggleStatus = async (job: ApiJob) => {
    const newStatus = job.status === 'Published' ? 'Closed' : 'Published';
    try {
      await apiFetch(`/jobs/${job.dbId}`, { method: 'PUT', body: JSON.stringify({ status: newStatus }) });
      setJobs(prev => prev.map(j => j.dbId === job.dbId ? { ...j, status: newStatus as ApiJob['status'] } : j));
    } catch (e) { alert('Failed to update status: ' + (e as Error).message); }
  };

  const archiveJob = async (job: ApiJob) => {
    if (!confirm(`Archive "${job.title}"? It will be hidden from the public careers page.`)) return;
    try {
      await apiFetch(`/jobs/${job.dbId}`, { method: 'DELETE' });
      setJobs(prev => prev.map(j => j.dbId === job.dbId ? { ...j, status: 'Closed' } : j));
    } catch (e) { alert('Failed to archive: ' + (e as Error).message); }
  };

  const updateStage = async (appId: number, jobId: number, stage: ApplicationStage) => {
    try {
      await apiFetch(`/jobs/admin/applications/${appId}/stage`, { method: 'PATCH', body: JSON.stringify({ stage }) });
      setApplications(prev => ({
        ...prev,
        [jobId]: (prev[jobId] ?? []).map(a => a.id === appId ? { ...a, stage } : a),
      }));
    } catch (e) { alert('Failed to update stage: ' + (e as Error).message); }
  };

  /* Stats */
  const published = jobs.filter(j => j.status === 'Published').length;
  const drafts    = jobs.filter(j => j.status === 'Draft').length;
  const closed    = jobs.filter(j => j.status === 'Closed').length;
  const totalApps = Object.values(applications).reduce((sum, a) => sum + a.length, 0);

  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
      </div>
    );
  }

  const isSuperAdmin = currentUser?.role === 'SUPER_ADMIN';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <img src="/esoko-logo.png" alt="Esoko" style={{ height: 32, width: 'auto' }} />
            </Link>
            <span className="text-gray-300">|</span>
            <div>
              <p className="font-heading font-bold text-gray-900 text-sm">Careers Admin</p>
              <p className="text-xs text-gray-400">HR Management Dashboard{currentUser ? ` · ${currentUser.name}` : ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isSuperAdmin && (
              <Link href="/admin/audit-logs" className="text-xs text-gray-500 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-lg transition-colors">
                Audit Logs
              </Link>
            )}
            <Link href="/careers" className="text-sm text-emerald-600 hover:underline flex items-center gap-1.5">
              <Eye className="w-4 h-4" /> View Live
            </Link>
            <Button onClick={openCreate} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm px-4">
              <Plus className="w-4 h-4 mr-1.5" /> New Job
            </Button>
            <button onClick={handleLogout} className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors" title="Sign out">
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* Stats row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: Briefcase, label: 'Published',          val: published, color: 'text-emerald-600 bg-emerald-50' },
            { icon: Clock,     label: 'Drafts',             val: drafts,    color: 'text-amber-600 bg-amber-50'     },
            { icon: XCircle,   label: 'Closed',             val: closed,    color: 'text-red-500 bg-red-50'         },
            { icon: Users,     label: 'Total Applications', val: totalApps, color: 'text-blue-600 bg-blue-50'       },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-heading font-bold text-gray-900">{s.val}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Job Form */}
        {showForm && (
          <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-heading font-bold text-gray-900 text-xl">
                {editingJob ? `Edit: ${editingJob.title}` : 'Create New Job'}
              </h2>
              <button onClick={() => setShowForm(false)} className="text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            {formError && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" /> {formError}
              </div>
            )}

            {/* Published metadata (read-only) */}
            {editingJob?.publishedAt && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-xs text-emerald-700 flex items-center gap-2">
                <Eye className="w-3.5 h-3.5 flex-shrink-0" />
                Published {new Date(editingJob.publishedAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <FormField label="Job Title *"           value={form.title}      onChange={v => setForm(p => ({...p, title: v}))}                                    placeholder="e.g. Senior Software Engineer" />
              <FormField label="URL Slug *"            value={form.slug}       onChange={v => setForm(p => ({...p, slug: v.toLowerCase().replace(/\s+/g, '-')}))}  placeholder="e.g. senior-software-engineer" />
              <FormSelect label="Department *"         value={form.department} onChange={v => setForm(p => ({...p, department: v}))}  options={["Engineering","Product","Agriculture","Operations","Marketing","Finance","HR"]} />
              <FormField label="Location *"            value={form.location}   onChange={v => setForm(p => ({...p, location: v}))}    placeholder="e.g. Accra / Hybrid" />
              <FormSelect label="Employment Type *"    value={form.type}       onChange={v => setForm(p => ({...p, type: v}))}        options={["Full Time","Contract","Internship","Graduate"]} />
              <FormSelect label="Experience Level *"   value={form.experience} onChange={v => setForm(p => ({...p, experience: v}))}  options={["Entry Level","Mid Level","Senior","Leadership"]} />
              <FormField label="Deadline"              value={form.deadline}   onChange={v => setForm(p => ({...p, deadline: v}))}    placeholder="e.g. October 30, 2026" />
              <FormField label="Salary Range"          value={form.salaryRange ?? ''} onChange={v => setForm(p => ({...p, salaryRange: v}))} placeholder="e.g. GHS 8,000 – 12,000/month" />
              <FormSelect label="Status"               value={form.status}     onChange={v => setForm(p => ({...p, status: v}))}      options={["Draft","Published","Closed"]} />
              <div className="flex items-center gap-3 pt-6">
                <label className="flex items-center gap-2.5 cursor-pointer select-none">
                  <button
                    type="button"
                    onClick={() => setForm(p => ({...p, featured: !p.featured}))}
                    className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${form.featured ? 'bg-amber-400' : 'bg-gray-200'}`}
                    role="switch"
                    aria-checked={form.featured}
                  >
                    <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${form.featured ? 'translate-x-5' : 'translate-x-0'}`} />
                  </button>
                  <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                    <Star className="w-3.5 h-3.5 text-amber-400" /> Featured role
                  </span>
                </label>
              </div>
            </div>

            {/* SEO fields */}
            <div className="border-t border-gray-100 pt-4 mb-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">SEO Metadata (optional)</p>
              <div className="grid grid-cols-1 gap-3">
                <FormField label="SEO Title" value={form.seoTitle ?? ''} onChange={v => setForm(p => ({...p, seoTitle: v}))} placeholder="Defaults to job title if empty (max 120 chars)" />
                <FormField label="SEO Description" value={form.seoDescription ?? ''} onChange={v => setForm(p => ({...p, seoDescription: v}))} placeholder="Brief description for search engines (max 320 chars)" />
              </div>
            </div>

            <div className="space-y-4 mb-6">
              <FormTextarea label="About the Role *"              value={form.about}            onChange={v => setForm(p => ({...p, about: v}))}            placeholder="Describe the role…"       rows={3} />
              <FormTextarea label="Responsibilities (one per line)" value={form.responsibilities} onChange={v => setForm(p => ({...p, responsibilities: v}))} placeholder="Lead the development of…" rows={4} />
              <FormTextarea label="Requirements (one per line)"   value={form.requirements}     onChange={v => setForm(p => ({...p, requirements: v}))}     placeholder="Bachelor's degree in…"    rows={4} />
              <FormTextarea label="Nice to Have (one per line)"   value={form.niceToHave}       onChange={v => setForm(p => ({...p, niceToHave: v}))}       placeholder="Experience with…"         rows={3} />
              <FormField   label="Skills (comma-separated)"       value={form.skills}           onChange={v => setForm(p => ({...p, skills: v}))}           placeholder="TypeScript, React, Node.js" />
              <FormField   label="Benefits (comma-separated)"     value={form.benefits}         onChange={v => setForm(p => ({...p, benefits: v}))}         placeholder="Competitive salary, Health insurance" />
              <FormTextarea label="Application Questions (one per line)" value={form.applicationQuestions} onChange={v => setForm(p => ({...p, applicationQuestions: v}))} placeholder={"Why do you want to work at Esoko?\nDescribe a project you led end-to-end."} rows={3} />
            </div>
            <div className="flex gap-3 justify-end">
              <Button variant="outline" onClick={() => setShowForm(false)} className="rounded-xl">Cancel</Button>
              <Button onClick={saveJob} disabled={saving} className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl min-w-[100px]">
                {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <><Save className="w-4 h-4 mr-1.5" />{editingJob ? 'Save Changes' : 'Create Job'}</>}
              </Button>
            </div>
          </div>
        )}

        {/* Main view tabs */}
        <div className="flex items-center gap-1 mb-4 bg-gray-100 rounded-xl p-1 w-fit">
          <button
            onClick={() => setMainView('jobs')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mainView === 'jobs' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Briefcase className="w-3.5 h-3.5" /> Jobs
          </button>
          <button
            onClick={() => setMainView('applications')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${mainView === 'applications' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Users className="w-3.5 h-3.5" /> All Applications {allAppsTotal > 0 && <span className="bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full font-bold">{allAppsTotal}</span>}
          </button>
        </div>

        {/* ── All Applications Panel (server-paginated) ─────────────── */}
        {mainView === 'applications' && (
          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-3">
              <h2 className="font-heading font-bold text-gray-900">All Applications</h2>
              <button onClick={() => loadAllApplications(allAppsPage, allAppsSearch, allAppsStage)} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Refresh">
                <RefreshCw className={`w-4 h-4 ${allAppsLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>

            {/* Search + stage filter */}
            <div className="px-6 py-3 border-b border-gray-100 flex items-center gap-2 flex-wrap">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
                <input
                  type="search"
                  value={allAppsSearch}
                  onChange={e => { setAllAppsSearch(e.target.value); loadAllApplications(1, e.target.value, allAppsStage); setAllAppsPage(1); }}
                  placeholder="Search name or email…"
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-gray-50"
                />
              </div>
              <select
                value={allAppsStage}
                onChange={e => { setAllAppsStage(e.target.value); loadAllApplications(1, allAppsSearch, e.target.value); setAllAppsPage(1); }}
                className="text-sm border border-gray-200 rounded-lg px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-400"
              >
                <option value="">All stages</option>
                {ALL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
              {(allAppsSearch || allAppsStage) && (
                <button onClick={() => { setAllAppsSearch(''); setAllAppsStage(''); loadAllApplications(1, '', ''); setAllAppsPage(1); }} className="text-xs text-gray-400 hover:text-gray-700">Clear</button>
              )}
              <span className="text-xs text-gray-400 ml-auto">{allAppsTotal} total</span>
            </div>

            {allAppsLoading && !allApps.length && (
              <div className="p-12 text-center text-gray-400"><RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" /><p>Loading…</p></div>
            )}
            {allAppsError && (
              <div className="p-8 text-center text-red-500"><AlertCircle className="w-6 h-6 mx-auto mb-2" /><p>{allAppsError}</p></div>
            )}
            {!allAppsLoading && !allAppsError && allApps.length === 0 && (
              <div className="p-12 text-center text-gray-400"><Users className="w-10 h-10 mx-auto mb-3 opacity-30" /><p>No applications found.</p></div>
            )}

            {allApps.length > 0 && (
              <div className={`divide-y divide-gray-100 ${allAppsLoading ? 'opacity-60 pointer-events-none' : ''}`}>
                {allApps.map(app => (
                  <div key={app.id} className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <p className="font-semibold text-gray-800 text-sm">{app.name}</p>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${STAGE_COLORS[app.stage] ?? 'bg-gray-100 text-gray-600'}`}>{app.stage}</span>
                        {app.jobTitle && <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full truncate max-w-[180px]">{app.jobTitle}</span>}
                      </div>
                      <p className="text-xs text-gray-500">{app.email}{app.phone ? ` · ${app.phone}` : ''}</p>
                      <p className="text-xs text-gray-300 mt-0.5">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {app.cvFileUrl && (
                        <a href={`${import.meta.env.BASE_URL}api/jobs/admin/applications/${app.id}/cv`} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-2.5 py-1.5 rounded-lg transition-colors">
                          <DownloadCloud className="w-3.5 h-3.5" /> CV
                        </a>
                      )}
                      <div className="relative">
                        <select
                          value={app.stage}
                          onChange={async e => {
                            const stage = e.target.value as ApplicationStage;
                            try {
                              await apiFetch(`/jobs/admin/applications/${app.id}/stage`, { method: 'PATCH', body: JSON.stringify({ stage }) });
                              setAllApps(prev => prev.map(a => a.id === app.id ? { ...a, stage } : a));
                            } catch (err) { alert('Failed to update stage: ' + (err as Error).message); }
                          }}
                          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 pr-6 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 cursor-pointer"
                        >
                          {ALL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                        <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                      </div>
                      <button
                        onClick={() => toggleNotes(app.id)}
                        className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${expandedNotes.has(app.id) ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        Notes {(notes[app.id]?.length ?? 0) > 0 && <span className="bg-amber-500 text-white text-[10px] px-1 rounded-full">{notes[app.id].length}</span>}
                      </button>
                    </div>
                    {/* Notes inline */}
                    {expandedNotes.has(app.id) && (
                      <div className="w-full mt-2 border-t border-gray-100 pt-3 bg-amber-50/50 px-2 py-2 rounded-xl">
                        <p className="text-xs font-semibold text-gray-500 mb-2">Internal Notes — HR Only</p>
                        <div className="flex gap-2 mb-2">
                          <textarea
                            value={noteInput[app.id] ?? ''}
                            onChange={e => setNoteInput(p => ({...p, [app.id]: e.target.value}))}
                            onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) void submitNote(app.id, app.jobId); }}
                            rows={2}
                            placeholder="Add a note… (Ctrl+Enter to save)"
                            className="flex-1 text-xs border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white resize-none"
                          />
                          <button
                            onClick={() => void submitNote(app.id, app.jobId)}
                            disabled={savingNote === app.id || !(noteInput[app.id]?.trim())}
                            className="self-end px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-lg text-xs flex items-center gap-1"
                          >
                            {savingNote === app.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                          </button>
                        </div>
                        {loadingNotes === app.id && <p className="text-xs text-gray-400">Loading…</p>}
                        {notes[app.id]?.length === 0 && loadingNotes !== app.id && <p className="text-xs text-gray-400 italic">No notes yet.</p>}
                        <div className="space-y-1.5">
                          {(notes[app.id] ?? []).map(note => (
                            <div key={note.id} className="bg-white border border-amber-100 rounded-lg px-3 py-2">
                              <p className="text-xs text-gray-700 whitespace-pre-wrap">{note.body}</p>
                              <p className="text-[10px] text-gray-400 mt-1">{new Date(note.createdAt).toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {allAppsPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-between">
                <button
                  onClick={() => { const p = allAppsPage - 1; setAllAppsPage(p); loadAllApplications(p, allAppsSearch, allAppsStage); }}
                  disabled={allAppsPage <= 1 || allAppsLoading}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >← Prev</button>
                <span className="text-xs text-gray-500">Page {allAppsPage} of {allAppsPages}</span>
                <button
                  onClick={() => { const p = allAppsPage + 1; setAllAppsPage(p); loadAllApplications(p, allAppsSearch, allAppsStage); }}
                  disabled={allAppsPage >= allAppsPages || allAppsLoading}
                  className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 disabled:opacity-40 hover:bg-gray-50 transition-colors"
                >Next →</button>
              </div>
            )}
          </div>
        )}

        {/* Job list */}
        {mainView === 'jobs' && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 flex-wrap gap-3">
            <h2 className="font-heading font-bold text-gray-900">All Jobs ({jobs.length})</h2>
            <div className="flex items-center gap-2">
              {/* Status filter */}
              <div className="flex items-center gap-1.5 text-xs text-gray-600">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                {['All','Draft','Published','Closed'].map(s => (
                  <button
                    key={s}
                    onClick={() => setStatusFilter(s)}
                    className={`px-2.5 py-1 rounded-lg transition-colors ${statusFilter === s ? 'bg-emerald-100 text-emerald-700 font-semibold' : 'hover:bg-gray-100'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
              <button onClick={loadJobs} className="text-gray-400 hover:text-gray-600 p-1.5 rounded-lg hover:bg-gray-100 transition-colors" aria-label="Refresh">
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {loading && (
            <div className="p-12 text-center text-gray-400">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-3" />
              <p>Loading jobs…</p>
            </div>
          )}
          {error && !loading && (
            <div className="p-8 text-center text-red-500">
              <AlertCircle className="w-8 h-8 mx-auto mb-3" />
              <p className="font-medium">Failed to load jobs</p>
              <p className="text-sm text-gray-500 mt-1">{error}</p>
              <Button onClick={loadJobs} variant="outline" className="mt-4 rounded-xl text-sm">Retry</Button>
            </div>
          )}
          {!loading && !error && jobs.length === 0 && (
            <div className="p-12 text-center text-gray-400">
              <Briefcase className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-medium text-gray-600">No jobs yet</p>
              <p className="text-sm mt-1">Create your first job posting above.</p>
            </div>
          )}
          {!loading && !error && jobs.length > 0 && (
            <div className="divide-y divide-gray-100">
              {jobs.map(job => (
                <div key={job.dbId}>
                  <div className="px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition-colors">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2.5 mb-1 flex-wrap">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[job.status]}`}>{job.status}</span>
                        {job.featured && <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 flex items-center gap-1"><Star className="w-3 h-3" />Featured</span>}
                        <span className="text-xs text-gray-400 bg-gray-100 px-2.5 py-0.5 rounded-full">{job.department}</span>
                        <span className="text-xs text-gray-400">{job.type}</span>
                      </div>
                      <p className="font-semibold text-gray-900 text-sm truncate">{job.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {job.location} · Deadline: {job.deadline || '—'}
                        {job.publishedAt && <span className="ml-2">· Published {new Date(job.publishedAt).toLocaleDateString()}</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <button
                        onClick={() => {
                          if (expandedJob === job.dbId) setExpandedJob(null);
                          else loadApplications(job.dbId, job.slug);
                        }}
                        className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                      >
                        {loadingApps === job.dbId ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Users className="w-3.5 h-3.5" />}
                        Applications
                        {expandedJob === job.dbId ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>
                      <button onClick={() => toggleStatus(job)} title={job.status === 'Published' ? 'Unpublish' : 'Publish'}
                        className={`p-1.5 rounded-lg transition-colors ${job.status === 'Published' ? 'text-amber-600 hover:bg-amber-50' : 'text-emerald-600 hover:bg-emerald-50'}`}>
                        {job.status === 'Published' ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button onClick={() => openEdit(job)} className="p-1.5 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors" title="Edit">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      {job.status !== 'Closed' && (
                        <button onClick={() => archiveJob(job)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors" title="Archive">
                          <Archive className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  {expandedJob === job.dbId && applications[job.dbId] && (
                    <ApplicationsPanel
                      jobTitle={job.title}
                      jobDbId={job.dbId}
                      apps={applications[job.dbId]}
                      search={appSearch[job.dbId] ?? ''}
                      stageFilter={appStageFilter[job.dbId] ?? ''}
                      onSearchChange={v => setAppSearch(p => ({...p, [job.dbId]: v}))}
                      onStageFilterChange={v => setAppStageFilter(p => ({...p, [job.dbId]: v}))}
                      onStageChange={updateStage}
                      notes={notes}
                      expandedNotes={expandedNotes}
                      noteInput={noteInput}
                      savingNote={savingNote}
                      loadingNotes={loadingNotes}
                      onToggleNotes={toggleNotes}
                      onNoteInputChange={(appId, val) => setNoteInput(p => ({...p, [appId]: val}))}
                      onSubmitNote={submitNote}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

/* ── Applications Panel ─────────────────────────────────────────────── */
function ApplicationsPanel({
  jobTitle, jobDbId, apps,
  search, stageFilter,
  onSearchChange, onStageFilterChange,
  onStageChange,
  notes, expandedNotes, noteInput, savingNote, loadingNotes,
  onToggleNotes, onNoteInputChange, onSubmitNote,
}: {
  jobTitle: string;
  jobDbId: number;
  apps: Application[];
  search: string;
  stageFilter: string;
  onSearchChange: (v: string) => void;
  onStageFilterChange: (v: string) => void;
  onStageChange: (appId: number, jobId: number, stage: ApplicationStage) => void;
  notes: Record<number, AppNote[]>;
  expandedNotes: Set<number>;
  noteInput: Record<number, string>;
  savingNote: number | null;
  loadingNotes: number | null;
  onToggleNotes: (appId: number) => void;
  onNoteInputChange: (appId: number, val: string) => void;
  onSubmitNote: (appId: number, jobId: number) => void;
}) {
  const noteRefs = useRef<Record<number, HTMLTextAreaElement | null>>({});

  const filtered = apps.filter(a => {
    if (stageFilter && a.stage !== stageFilter) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!a.name.toLowerCase().includes(q) && !a.email.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  const stageCounts = ALL_STAGES.reduce((acc, s) => {
    acc[s] = apps.filter(a => a.stage === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="border-t border-gray-100 bg-gray-50 px-6 py-5">
      {/* Header + stage badges */}
      <div className="flex items-start justify-between mb-4 flex-wrap gap-3">
        <h3 className="text-sm font-semibold text-gray-700">Applications for {jobTitle} ({apps.length})</h3>
        <div className="flex items-center gap-1.5 flex-wrap">
          {ALL_STAGES.map(s => stageCounts[s] > 0 && (
            <span key={s} className={`text-xs px-2 py-0.5 rounded-full font-medium cursor-pointer ${stageFilter === s ? 'ring-2 ring-offset-1 ring-gray-400' : ''} ${STAGE_COLORS[s]}`}
              onClick={() => onStageFilterChange(stageFilter === s ? '' : s)}>
              {s}: {stageCounts[s]}
            </span>
          ))}
        </div>
      </div>

      {/* Search + filter bar */}
      <div className="flex items-center gap-2 mb-4 flex-wrap">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
          <input
            type="search"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Search name or email…"
            className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-400 bg-white"
          />
        </div>
        <select
          value={stageFilter}
          onChange={e => onStageFilterChange(e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-400"
        >
          <option value="">All stages</option>
          {ALL_STAGES.filter(s => stageCounts[s] > 0).map(s => (
            <option key={s} value={s}>{s} ({stageCounts[s]})</option>
          ))}
        </select>
        {(search || stageFilter) && (
          <button onClick={() => { onSearchChange(''); onStageFilterChange(''); }} className="text-xs text-gray-400 hover:text-gray-700">Clear</button>
        )}
        <span className="text-xs text-gray-400 ml-auto">{filtered.length} shown</span>
      </div>

      {filtered.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-4">No applications match the filter</p>
      ) : (
        <div className="space-y-3">
          {filtered.map(app => (
            <div key={app.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              {/* Application row */}
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-gray-800 text-sm">{app.name}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${STAGE_COLORS[app.stage] ?? 'bg-gray-100 text-gray-600'}`}>{app.stage}</span>
                  </div>
                  <p className="text-xs text-gray-500">{app.email}{app.phone ? ` · ${app.phone}` : ''}</p>
                  {app.coverLetter && <p className="text-xs text-gray-400 mt-1 line-clamp-1 max-w-xs italic">"{app.coverLetter}"</p>}
                  {(() => {
                    const rawAnswers = app.answers;
                    let parsed: unknown[] = [];
                    if (Array.isArray(rawAnswers)) parsed = rawAnswers;
                    else if (typeof rawAnswers === 'string' && rawAnswers !== '[]') {
                      try { const p = JSON.parse(rawAnswers); if (Array.isArray(p)) parsed = p; } catch { /* ignore */ }
                    }
                    const answers = parsed.filter(
                      (a): a is { question: string; answer: string } =>
                        a !== null && typeof a === 'object' && !Array.isArray(a) &&
                        typeof (a as Record<string,unknown>)['question'] === 'string' &&
                        typeof (a as Record<string,unknown>)['answer'] === 'string' &&
                        String((a as Record<string,unknown>)['answer']).trim().length > 0
                    );
                    return answers.map((a, i) => (
                      <div key={i} className="mt-1.5">
                        <p className="text-xs text-gray-400 font-medium">{String(a.question)}</p>
                        <p className="text-xs text-gray-500 line-clamp-2">{String(a.answer)}</p>
                      </div>
                    ));
                  })()}
                  <p className="text-xs text-gray-300 mt-1">Applied {new Date(app.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
                  {app.cvFileUrl && (
                    <a
                      href={`${import.meta.env.BASE_URL}api/jobs/admin/applications/${app.id}/cv`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-xs bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      <DownloadCloud className="w-3.5 h-3.5" /> CV
                    </a>
                  )}
                  {/* Stage select */}
                  <div className="relative">
                    <select
                      value={app.stage}
                      onChange={e => onStageChange(app.id, jobDbId, e.target.value as ApplicationStage)}
                      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 pr-6 appearance-none bg-white focus:outline-none focus:ring-2 focus:ring-emerald-400/30 cursor-pointer"
                      aria-label="Change application stage"
                    >
                      {ALL_STAGES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none" />
                  </div>
                  {/* Notes toggle */}
                  <button
                    onClick={() => onToggleNotes(app.id)}
                    className={`flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg transition-colors ${expandedNotes.has(app.id) ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    title="Internal notes"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    Notes
                    {(notes[app.id]?.length ?? 0) > 0 && (
                      <span className="bg-amber-500 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">{notes[app.id].length}</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Notes panel */}
              {expandedNotes.has(app.id) && (
                <div className="border-t border-gray-100 bg-amber-50/50 px-4 py-3">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Internal Notes — HR Only</p>

                  {/* Note input */}
                  <div className="flex gap-2 mb-3">
                    <textarea
                      ref={el => { noteRefs.current[app.id] = el; }}
                      value={noteInput[app.id] ?? ''}
                      onChange={e => onNoteInputChange(app.id, e.target.value)}
                      onKeyDown={e => { if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) onSubmitNote(app.id, jobDbId); }}
                      rows={2}
                      placeholder="Add an internal note… (Ctrl+Enter to save)"
                      className="flex-1 text-xs border border-amber-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-1 focus:ring-amber-400 bg-white resize-none"
                    />
                    <button
                      onClick={() => onSubmitNote(app.id, jobDbId)}
                      disabled={savingNote === app.id || !(noteInput[app.id]?.trim())}
                      className="self-end px-3 py-2 bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white rounded-lg text-xs flex items-center gap-1 transition-colors"
                    >
                      {savingNote === app.id ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                    </button>
                  </div>

                  {/* Existing notes */}
                  {loadingNotes === app.id && (
                    <div className="text-xs text-gray-400 flex items-center gap-1.5 py-1">
                      <RefreshCw className="w-3 h-3 animate-spin" /> Loading notes…
                    </div>
                  )}
                  {notes[app.id]?.length === 0 && loadingNotes !== app.id && (
                    <p className="text-xs text-gray-400 italic">No notes yet.</p>
                  )}
                  <div className="space-y-2">
                    {(notes[app.id] ?? []).map(note => (
                      <div key={note.id} className="bg-white border border-amber-100 rounded-lg px-3 py-2">
                        <p className="text-xs text-gray-700 whitespace-pre-wrap">{note.body}</p>
                        <p className="text-[10px] text-gray-400 mt-1">
                          {new Date(note.createdAt).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Small form helpers ──────────────────────────────────────────────── */
function FormField({ label, value, onChange, placeholder }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 bg-gray-50" />
    </div>
  );
}
function FormSelect({ label, value, onChange, options }: { label: string; value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <div className="relative">
        <select value={value} onChange={e => onChange(e.target.value)}
          className="w-full pl-3 pr-8 py-2 text-sm border border-gray-200 rounded-xl appearance-none focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 bg-gray-50 cursor-pointer">
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
        <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
      </div>
    </div>
  );
}
function FormTextarea({ label, value, onChange, placeholder, rows = 3 }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; rows?: number }) {
  return (
    <div>
      <label className="block text-xs font-semibold text-gray-600 mb-1.5">{label}</label>
      <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={rows}
        className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400 bg-gray-50 resize-y" />
    </div>
  );
}
