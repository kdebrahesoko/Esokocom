/**
 * AdminResourceFormPage.tsx
 *
 * Create:  /admin/resources/new?type=blog
 * Edit:    /admin/resources/:id/edit
 *
 * Handles all six resource types with type-specific extension fields,
 * image/file upload, category/tag selectors, SEO fields, and a
 * role-aware status action bar.
 */
import { useState, useEffect, useRef, useCallback } from 'react';
import { Link, useParams, useSearch, useLocation } from 'wouter';
import {
  ArrowLeft, Save, Upload, Image, Tag, AlertCircle, Loader2,
  Eye, EyeOff, ChevronDown, ChevronUp, Star, StarOff, Info,
} from 'lucide-react';
import AdminLayout, { useAdminUser } from '@/components/admin/AdminLayout';
import { toast } from '@/hooks/use-toast';

const BASE = `${import.meta.env.BASE_URL}api`;

/* ── Type mappings ────────────────────────────────────────────────── */
const ADMIN_URL_TO_DB_TYPE: Record<string, string> = {
  blog: 'Blog', events: 'Event', podcasts: 'Podcast',
  webinars: 'Webinar', reports: 'Research Report', 'customer-stories': 'Customer Story',
};
const DB_TYPE_TO_ADMIN_URL: Record<string, string> = {
  Blog: 'blog', Event: 'events', Podcast: 'podcasts',
  Webinar: 'webinars', 'Research Report': 'reports', 'Customer Story': 'customer-stories',
};
const DB_TYPE_TO_API_SLUG: Record<string, string> = {
  Blog: 'blog', Event: 'event', Podcast: 'podcast',
  Webinar: 'webinar', 'Research Report': 'research-report', 'Customer Story': 'customer-story',
};
const ALL_CONTENT_TYPES = ['Blog','Event','Podcast','Webinar','Research Report','Customer Story'] as const;

/* ── Helpers ──────────────────────────────────────────────────────── */
function slugify(t: string): string {
  return t.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-').replace(/-+/g,'-').replace(/^-|-$/g,'').slice(0,200);
}
function parseJson(v: string, fb: unknown = []): unknown {
  try { return JSON.parse(v); } catch { return fb; }
}
function formatDTL(iso: string): string {
  try {
    const d = new Date(iso);
    const p = (n: number) => String(n).padStart(2,'0');
    return `${d.getFullYear()}-${p(d.getMonth()+1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`;
  } catch { return ''; }
}
async function apiFetch<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...opts, credentials: 'include',
    headers: { 'Content-Type': 'application/json', ...(opts.headers ?? {}) },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({})) as { error?: string };
    throw new Error(err.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

/* ── Form state ───────────────────────────────────────────────────── */
interface FormState {
  title: string; slug: string; shortDescription: string; body: string;
  featuredImageUrl: string; categoryId: string; status: string;
  featured: boolean; seoTitle: string; seoDescription: string;
  scheduledFor: string; tagIds: number[];
  // Event
  ev_startDatetime: string; ev_endDatetime: string; ev_timezone: string;
  ev_venue: string; ev_isOnline: boolean; ev_registrationUrl: string; ev_speakers: string;
  // Podcast
  pod_episodeNumber: string; pod_season: string; pod_host: string;
  pod_guests: string; pod_audioUrl: string; pod_externalUrls: string; pod_transcript: string;
  // Webinar
  web_registrationUrl: string; web_meetingUrl: string; web_recordingUrl: string;
  web_speakers: string; web_transcript: string;
  // Report
  rep_fileUrl: string; rep_fileType: string; rep_organisation: string; rep_publicationYear: string;
}

const BLANK: FormState = {
  title:'', slug:'', shortDescription:'', body:'',
  featuredImageUrl:'', categoryId:'', status:'Draft',
  featured:false, seoTitle:'', seoDescription:'',
  scheduledFor:'', tagIds:[],
  ev_startDatetime:'', ev_endDatetime:'', ev_timezone:'Africa/Accra',
  ev_venue:'', ev_isOnline:false, ev_registrationUrl:'', ev_speakers:'[]',
  pod_episodeNumber:'', pod_season:'1', pod_host:'', pod_guests:'[]',
  pod_audioUrl:'', pod_externalUrls:'{}', pod_transcript:'',
  web_registrationUrl:'', web_meetingUrl:'', web_recordingUrl:'',
  web_speakers:'[]', web_transcript:'',
  rep_fileUrl:'', rep_fileType:'PDF', rep_organisation:'',
  rep_publicationYear: String(new Date().getFullYear()),
};

function initFromResource(r: Record<string, unknown>): FormState {
  const d = (r.details ?? {}) as Record<string, unknown>;
  const str = (v: unknown) => v ? String(v) : '';
  const jsonStr = (v: unknown) => {
    if (typeof v === 'string') return v;
    return JSON.stringify(v ?? [], null, 2);
  };
  return {
    title: str(r.title), slug: str(r.slug),
    shortDescription: str(r.shortDescription), body: str(r.body),
    featuredImageUrl: str(r.featuredImageUrl), categoryId: r.categoryId ? String(r.categoryId) : '',
    status: str(r.status) || 'Draft', featured: !!(r.featured),
    seoTitle: str(r.seoTitle), seoDescription: str(r.seoDescription),
    scheduledFor: r.scheduledFor ? formatDTL(str(r.scheduledFor)) : '',
    tagIds: ((r.tags ?? []) as { id: number }[]).map(t => t.id),
    // Event
    ev_startDatetime: d.startDatetime ? formatDTL(str(d.startDatetime)) : '',
    ev_endDatetime: d.endDatetime ? formatDTL(str(d.endDatetime)) : '',
    ev_timezone: str(d.timezone) || 'Africa/Accra',
    ev_venue: str(d.venue), ev_isOnline: !!(d.isOnline), ev_registrationUrl: str(d.registrationUrl),
    ev_speakers: jsonStr(d.speakers),
    // Podcast
    pod_episodeNumber: d.episodeNumber ? String(d.episodeNumber) : '',
    pod_season: d.season ? String(d.season) : '1',
    pod_host: str(d.host), pod_guests: jsonStr(d.guests),
    pod_audioUrl: str(d.audioUrl), pod_externalUrls: jsonStr(d.externalUrls),
    pod_transcript: str(d.transcript),
    // Webinar
    web_registrationUrl: str(d.registrationUrl), web_meetingUrl: str(d.meetingUrl),
    web_recordingUrl: str(d.recordingUrl), web_speakers: jsonStr(d.speakers),
    web_transcript: str(d.transcript),
    // Report
    rep_fileUrl: str(d.fileUrl), rep_fileType: str(d.fileType) || 'PDF',
    rep_organisation: str(d.organisation),
    rep_publicationYear: d.publicationYear ? String(d.publicationYear) : String(new Date().getFullYear()),
  };
}

function buildDetails(ct: string, f: FormState): Record<string, unknown> {
  if (ct === 'Event') return {
    startDatetime: f.ev_startDatetime || null, endDatetime: f.ev_endDatetime || null,
    timezone: f.ev_timezone || 'Africa/Accra', venue: f.ev_venue || null,
    isOnline: f.ev_isOnline, registrationUrl: f.ev_registrationUrl || null,
    speakers: parseJson(f.ev_speakers, []),
  };
  if (ct === 'Podcast') return {
    episodeNumber: f.pod_episodeNumber ? Number(f.pod_episodeNumber) : null,
    season: f.pod_season ? Number(f.pod_season) : null,
    host: f.pod_host || null, guests: parseJson(f.pod_guests, []),
    audioUrl: f.pod_audioUrl || null, externalUrls: parseJson(f.pod_externalUrls, {}),
    transcript: f.pod_transcript || null,
  };
  if (ct === 'Webinar') return {
    speakers: parseJson(f.web_speakers, []), registrationUrl: f.web_registrationUrl || null,
    meetingUrl: f.web_meetingUrl || null, recordingUrl: f.web_recordingUrl || null,
    transcript: f.web_transcript || null,
  };
  if (ct === 'Research Report') return {
    fileUrl: f.rep_fileUrl || null, fileType: f.rep_fileType || null,
    organisation: f.rep_organisation || null,
    publicationYear: f.rep_publicationYear ? Number(f.rep_publicationYear) : null,
  };
  return {};
}

/* ── Field sub-components ─────────────────────────────────────────── */
const inputCls = "w-full px-3 py-2 text-sm border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-emerald-400/30 focus:border-emerald-400";
const labelCls = "block text-xs font-semibold text-gray-600 mb-1.5";

function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className={labelCls}>{label}</label>
      {children}
      {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-5 space-y-4">
      <h3 className="font-heading font-bold text-gray-900 text-sm">{title}</h3>
      {children}
    </div>
  );
}

/* ── Tag selector ─────────────────────────────────────────────────── */
function TagSelector({ tagIds, onChange, allTags }: {
  tagIds: number[]; onChange: (ids: number[]) => void;
  allTags: { id: number; name: string }[];
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const fn = (e: MouseEvent) => { if (!ref.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('mousedown', fn);
    return () => document.removeEventListener('mousedown', fn);
  }, []);
  return (
    <div className="relative" ref={ref}>
      <button type="button" onClick={() => setOpen(!open)}
        className={`${inputCls} text-left flex items-center justify-between`}>
        <span className={tagIds.length ? 'text-gray-900' : 'text-gray-400'}>
          {tagIds.length ? `${tagIds.length} tag${tagIds.length > 1 ? 's' : ''} selected` : 'Select tags…'}
        </span>
        <Tag className="w-4 h-4 text-gray-400 flex-shrink-0" />
      </button>
      {open && (
        <div className="absolute z-20 top-full left-0 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-2 max-h-48 overflow-y-auto">
          {allTags.length === 0 && <p className="text-xs text-gray-400 p-2">No tags found.</p>}
          {allTags.map(tag => (
            <label key={tag.id} className="flex items-center gap-2 px-2 py-1.5 hover:bg-gray-50 rounded-lg cursor-pointer text-sm">
              <input type="checkbox" className="accent-emerald-600"
                checked={tagIds.includes(tag.id)}
                onChange={e => onChange(e.target.checked ? [...tagIds, tag.id] : tagIds.filter(id => id !== tag.id))} />
              {tag.name}
            </label>
          ))}
        </div>
      )}
      {tagIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-2">
          {tagIds.map(id => {
            const t = allTags.find(x => x.id === id);
            return t ? (
              <span key={id} className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full font-medium flex items-center gap-1">
                {t.name}
                <button type="button" onClick={() => onChange(tagIds.filter(x => x !== id))} className="hover:text-red-500">×</button>
              </span>
            ) : null;
          })}
        </div>
      )}
    </div>
  );
}

/* ── Image upload ──────────────────────────────────────────────────── */
function ImageUpload({ value, onChange }: { value: string; onChange: (url: string) => void }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith('image/')) { alert('Please select an image file.'); return; }
    setUploading(true);
    try {
      const { uploadURL, objectPath } = await apiFetch<{ uploadURL: string; objectPath: string }>(
        '/storage/uploads/request-url',
        { method: 'POST', body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }) },
      );
      await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      onChange(objectPath);
      toast({ title: 'Image uploaded' });
    } catch (e) {
      toast({ title: 'Upload failed', description: (e as Error).message });
    } finally { setUploading(false); }
  };

  // Derive a display URL from objectPath (could be a full URL or a storage path)
  const displayUrl = value.startsWith('http') ? value : value ? `${BASE}/storage/public-objects/${value}` : '';

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <input type="url" value={value} onChange={e => onChange(e.target.value)}
          placeholder="https://example.com/image.jpg or upload below"
          className={`${inputCls} flex-1`} />
        <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
          className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50">
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
          {uploading ? 'Uploading…' : 'Upload'}
        </button>
      </div>
      <input ref={fileRef} type="file" accept="image/*" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
      {displayUrl && (
        <div className="relative rounded-xl overflow-hidden border border-gray-200 bg-gray-50 h-40">
          <img src={displayUrl} alt="Featured image preview" className="w-full h-full object-cover" />
          <button type="button" onClick={() => onChange('')}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600">×</button>
        </div>
      )}
      {!displayUrl && (
        <div className="flex items-center justify-center border-2 border-dashed border-gray-200 rounded-xl h-24 text-gray-400 text-sm cursor-pointer hover:border-emerald-300 hover:text-emerald-600 transition-colors"
          onClick={() => fileRef.current?.click()}>
          <div className="text-center"><Image className="w-6 h-6 mx-auto mb-1" /><p className="text-xs">Click to upload</p></div>
        </div>
      )}
    </div>
  );
}

/* ── File upload (for reports PDF) ───────────────────────────────── */
function FileUpload({ value, onChange, label }: { value: string; onChange: (url: string) => void; label: string }) {
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setUploading(true);
    try {
      const { uploadURL, objectPath } = await apiFetch<{ uploadURL: string; objectPath: string }>(
        '/storage/uploads/request-url',
        { method: 'POST', body: JSON.stringify({ name: file.name, size: file.size, contentType: file.type }) },
      );
      await fetch(uploadURL, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } });
      onChange(objectPath);
      toast({ title: `${label} uploaded` });
    } catch (e) {
      toast({ title: 'Upload failed', description: (e as Error).message });
    } finally { setUploading(false); }
  };

  return (
    <div className="flex gap-2">
      <input type="url" value={value} onChange={e => onChange(e.target.value)}
        placeholder={`${label} URL or upload`} className={`${inputCls} flex-1`} />
      <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
        className="flex items-center gap-1.5 px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors disabled:opacity-50">
        {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
        {uploading ? 'Uploading…' : 'Upload'}
      </button>
      <input ref={fileRef} type="file" accept="application/pdf,.pdf" className="hidden"
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f); e.target.value = ''; }} />
    </div>
  );
}

/* ── Main page ────────────────────────────────────────────────────── */
export default function AdminResourceFormPage() {
  const [, setLocation] = useLocation();
  const user = useAdminUser();
  const params  = useParams<{ id?: string }>();
  const search  = useSearch();
  const qp      = new URLSearchParams(search);
  const typeKey = qp.get('type') ?? 'blog'; // admin URL segment, for create mode

  const resourceId = params.id ? parseInt(String(params.id)) : null;
  const isEdit = resourceId !== null && !Number.isNaN(resourceId);

  const [form, _setForm]        = useState<FormState>({ ...BLANK });
  const [contentType, setContentType] = useState<string>('Blog');
  const [loading, setLoading]   = useState(isEdit);
  const [saving, setSaving]     = useState(false);
  const [isDirty, setIsDirty]   = useState(false);
  const [seoOpen, setSeoOpen]   = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const slugEdited = useRef(false);

  // Selects
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
  const [allTags, setAllTags]       = useState<{ id: number; name: string }[]>([]);

  const setForm = useCallback((updater: FormState | ((p: FormState) => FormState)) => {
    _setForm(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      setIsDirty(true);
      return next;
    });
  }, []);

  const isEditor  = user && ['SUPER_ADMIN','CONTENT_EDITOR'].includes(user.role);
  const isAuthor  = user?.role === 'CONTENT_AUTHOR';
  const canEdit   = !isAuthor || form.status === 'Draft' || !isEdit;

  /* ── Load data ────────────────────────────────────────────────── */
  useEffect(() => {
    // Load categories and tags
    Promise.all([
      apiFetch<{ categories: { id: number; name: string }[] }>('/admin/resource-categories'),
      apiFetch<{ tags: { id: number; name: string }[] }>('/admin/resource-tags'),
    ]).then(([c, t]) => { setCategories(c.categories); setAllTags(t.tags); }).catch(console.error);
  }, []);

  useEffect(() => {
    if (isEdit) {
      apiFetch<{ resource: Record<string, unknown> }>(`/admin/resources/${resourceId}`)
        .then(d => {
          setContentType(String(d.resource.contentType ?? 'Blog'));
          _setForm(initFromResource(d.resource));
          setIsDirty(false);
        })
        .catch(e => { setFormError((e as Error).message); })
        .finally(() => setLoading(false));
    } else {
      // Create mode — set type from query param
      const dbType = ADMIN_URL_TO_DB_TYPE[typeKey] ?? 'Blog';
      setContentType(dbType);
      _setForm({ ...BLANK });
      slugEdited.current = false;
    }
  }, [isEdit, resourceId, typeKey]);

  /* ── Unsaved changes warning ─────────────────────────────────── */
  useEffect(() => {
    const fn = (e: BeforeUnloadEvent) => { if (isDirty) e.preventDefault(); };
    window.addEventListener('beforeunload', fn);
    return () => window.removeEventListener('beforeunload', fn);
  }, [isDirty]);

  /* ── Auto-slug ────────────────────────────────────────────────── */
  const handleTitleChange = (v: string) => {
    setForm(p => {
      const next = { ...p, title: v };
      if (!isEdit && !slugEdited.current) next.slug = slugify(v);
      return next;
    });
  };

  /* ── Build API payload ───────────────────────────────────────── */
  const buildPayload = (targetStatus?: string) => ({
    title:            form.title,
    slug:             form.slug,
    shortDescription: form.shortDescription,
    body:             form.body,
    featuredImageUrl: form.featuredImageUrl || null,
    categoryId:       form.categoryId ? Number(form.categoryId) : null,
    featured:         form.featured,
    seoTitle:         form.seoTitle || null,
    seoDescription:   form.seoDescription || null,
    tagIds:           form.tagIds,
    ...(targetStatus ? { status: targetStatus } : {}),
    ...(isEdit ? {} : { type: DB_TYPE_TO_API_SLUG[contentType] }),
    details: buildDetails(contentType, form),
  });

  /* ── Save + status actions ───────────────────────────────────── */
  const handleAction = async (action: string) => {
    if (!form.title.trim()) { setFormError('Title is required'); return; }
    if (!form.slug.trim())  { setFormError('Slug is required'); return; }
    setFormError(null); setSaving(true);

    try {
      let id = resourceId;

      // Status to include in the PUT/POST body (for status changes handled by the main endpoint)
      const inlineStatus = action === 'review' ? 'In Review' : action === 'back-to-draft' ? 'Draft' : undefined;

      if (!isEdit) {
        const res = await apiFetch<{ resource: { id: number } }>('/admin/resources', {
          method: 'POST', body: JSON.stringify(buildPayload(inlineStatus)),
        });
        id = res.resource.id;
      } else {
        await apiFetch(`/admin/resources/${id}`, {
          method: 'PUT', body: JSON.stringify(buildPayload(inlineStatus)),
        });
      }

      // Dedicated status endpoints for editor-level actions
      if (action === 'publish') {
        await apiFetch(`/admin/resources/${id}/publish`, { method: 'POST' });
      } else if (action === 'unpublish') {
        await apiFetch(`/admin/resources/${id}/unpublish`, { method: 'POST' });
      } else if (action === 'archive') {
        await apiFetch(`/admin/resources/${id}/archive`, { method: 'POST' });
      } else if (action === 'schedule') {
        if (!form.scheduledFor) { setFormError('Please set a "Publish at" date/time before scheduling.'); setSaving(false); return; }
        await apiFetch(`/admin/resources/${id}/schedule`, {
          method: 'POST', body: JSON.stringify({ scheduledFor: new Date(form.scheduledFor).toISOString() }),
        });
      } else if (action === 'publish-now') {
        await apiFetch(`/admin/resources/${id}/publish`, { method: 'POST' });
      }

      const actionLabel: Record<string, string> = {
        save: 'Saved', review: 'Submitted for review', publish: 'Published',
        unpublish: 'Unpublished', archive: 'Archived', schedule: 'Scheduled',
        'back-to-draft': 'Moved to Draft', 'publish-now': 'Published',
      };
      toast({ title: actionLabel[action] ?? 'Saved' });
      setIsDirty(false);
      const adminUrl = DB_TYPE_TO_ADMIN_URL[contentType] ?? 'blog';
      setLocation(`/admin/resources/${adminUrl}`);
    } catch (e) {
      setFormError((e as Error).message);
    } finally { setSaving(false); }
  };

  /* ── Type-specific extension fields ─────────────────────────── */
  const renderTypeFields = () => {
    if (contentType === 'Event') return (
      <Section title="Event Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Start Date & Time">
            <input type="datetime-local" value={form.ev_startDatetime} className={inputCls}
              onChange={e => setForm(p => ({...p, ev_startDatetime: e.target.value}))} />
          </Field>
          <Field label="End Date & Time">
            <input type="datetime-local" value={form.ev_endDatetime} className={inputCls}
              onChange={e => setForm(p => ({...p, ev_endDatetime: e.target.value}))} />
          </Field>
          <Field label="Timezone">
            <input type="text" value={form.ev_timezone} className={inputCls} placeholder="Africa/Accra"
              onChange={e => setForm(p => ({...p, ev_timezone: e.target.value}))} />
          </Field>
          <Field label="Venue / Location">
            <input type="text" value={form.ev_venue} className={inputCls} placeholder="Accra International Conference Centre"
              onChange={e => setForm(p => ({...p, ev_venue: e.target.value}))} />
          </Field>
          <Field label="Registration URL">
            <input type="url" value={form.ev_registrationUrl} className={inputCls} placeholder="https://…"
              onChange={e => setForm(p => ({...p, ev_registrationUrl: e.target.value}))} />
          </Field>
          <div className="flex items-center gap-3 pt-2">
            <button type="button" onClick={() => setForm(p => ({...p, ev_isOnline: !p.ev_isOnline}))}
              className={`w-10 h-5 rounded-full transition-colors flex-shrink-0 ${form.ev_isOnline ? 'bg-emerald-500' : 'bg-gray-300'}`}>
              <span className={`block w-4 h-4 rounded-full bg-white shadow transition-transform mx-0.5 ${form.ev_isOnline ? 'translate-x-5' : 'translate-x-0'}`} />
            </button>
            <span className="text-sm text-gray-700">Online event</span>
          </div>
        </div>
        <Field label="Speakers (JSON array)" hint='e.g. [{"name":"Dr. Ama Agyemang","title":"Director","organisation":"Esoko"}]'>
          <textarea value={form.ev_speakers} onChange={e => setForm(p => ({...p, ev_speakers: e.target.value}))}
            rows={4} className={`${inputCls} font-mono text-xs`} />
        </Field>
      </Section>
    );

    if (contentType === 'Podcast') return (
      <Section title="Podcast Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Episode Number">
            <input type="number" value={form.pod_episodeNumber} min="1" className={inputCls}
              onChange={e => setForm(p => ({...p, pod_episodeNumber: e.target.value}))} />
          </Field>
          <Field label="Season">
            <input type="number" value={form.pod_season} min="1" className={inputCls}
              onChange={e => setForm(p => ({...p, pod_season: e.target.value}))} />
          </Field>
          <Field label="Host">
            <input type="text" value={form.pod_host} className={inputCls} placeholder="Host name"
              onChange={e => setForm(p => ({...p, pod_host: e.target.value}))} />
          </Field>
          <Field label="Audio URL">
            <input type="url" value={form.pod_audioUrl} className={inputCls} placeholder="https://…/episode.mp3"
              onChange={e => setForm(p => ({...p, pod_audioUrl: e.target.value}))} />
          </Field>
        </div>
        <Field label="Guests (JSON array)" hint='e.g. [{"name":"Jane Doe","title":"CEO"}]'>
          <textarea value={form.pod_guests} onChange={e => setForm(p => ({...p, pod_guests: e.target.value}))}
            rows={3} className={`${inputCls} font-mono text-xs`} />
        </Field>
        <Field label="Transcript">
          <textarea value={form.pod_transcript} onChange={e => setForm(p => ({...p, pod_transcript: e.target.value}))}
            rows={5} className={inputCls} placeholder="Full episode transcript…" />
        </Field>
      </Section>
    );

    if (contentType === 'Webinar') return (
      <Section title="Webinar Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Registration URL">
            <input type="url" value={form.web_registrationUrl} className={inputCls} placeholder="https://…"
              onChange={e => setForm(p => ({...p, web_registrationUrl: e.target.value}))} />
          </Field>
          <Field label="Meeting / Join URL">
            <input type="url" value={form.web_meetingUrl} className={inputCls} placeholder="https://zoom.us/…"
              onChange={e => setForm(p => ({...p, web_meetingUrl: e.target.value}))} />
          </Field>
          <Field label="Recording URL">
            <input type="url" value={form.web_recordingUrl} className={inputCls} placeholder="https://…/recording.mp4"
              onChange={e => setForm(p => ({...p, web_recordingUrl: e.target.value}))} />
          </Field>
        </div>
        <Field label="Speakers (JSON array)" hint='e.g. [{"name":"Dr. Ama","title":"Director"}]'>
          <textarea value={form.web_speakers} onChange={e => setForm(p => ({...p, web_speakers: e.target.value}))}
            rows={3} className={`${inputCls} font-mono text-xs`} />
        </Field>
        <Field label="Transcript">
          <textarea value={form.web_transcript} onChange={e => setForm(p => ({...p, web_transcript: e.target.value}))}
            rows={5} className={inputCls} placeholder="Full webinar transcript…" />
        </Field>
      </Section>
    );

    if (contentType === 'Research Report') return (
      <Section title="Report Details">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="File Type">
            <select value={form.rep_fileType} onChange={e => setForm(p => ({...p, rep_fileType: e.target.value}))} className={inputCls}>
              {['PDF','XLSX','CSV','DOCX','Other'].map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </Field>
          <Field label="Publishing Organisation">
            <input type="text" value={form.rep_organisation} className={inputCls} placeholder="Esoko, World Bank, etc."
              onChange={e => setForm(p => ({...p, rep_organisation: e.target.value}))} />
          </Field>
          <Field label="Publication Year">
            <input type="number" value={form.rep_publicationYear} min="2000" max="2100" className={inputCls}
              onChange={e => setForm(p => ({...p, rep_publicationYear: e.target.value}))} />
          </Field>
        </div>
        <Field label="Report File">
          <FileUpload value={form.rep_fileUrl} onChange={v => setForm(p => ({...p, rep_fileUrl: v}))} label="Report" />
        </Field>
      </Section>
    );

    return null; // Blog / Customer Story — no extra fields
  };

  /* ── Action bar ───────────────────────────────────────────────── */
  const status = form.status;
  const isReadOnly = isAuthor && isEdit && status !== 'Draft';

  const renderActionBar = () => {
    if (isReadOnly) return (
      <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-200 rounded-2xl">
        <Info className="w-5 h-5 text-amber-600 flex-shrink-0" />
        <p className="text-sm text-amber-800">This resource is <strong>{status}</strong>. Only editors can make further changes.</p>
      </div>
    );

    const btn = (label: string, action: string, variant: 'primary'|'secondary'|'danger') => (
      <button key={action} type="button" disabled={saving}
        onClick={() => handleAction(action)}
        className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50
          ${variant === 'primary'  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' :
            variant === 'danger'   ? 'bg-red-50 hover:bg-red-100 text-red-700 border border-red-200' :
                                     'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'}`}>
        {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
        {label}
      </button>
    );

    const buttons: React.ReactNode[] = [];

    if (status === 'Draft' || !isEdit) {
      buttons.push(btn('Save Draft', 'save', 'secondary'));
      buttons.push(btn('Submit for Review', 'review', 'secondary'));
      if (isEditor) buttons.push(btn('Publish', 'publish', 'primary'));
    } else if (status === 'In Review') {
      if (isEditor) {
        buttons.push(btn('Save Changes', 'save', 'secondary'));
        buttons.push(btn('Back to Draft', 'back-to-draft', 'secondary'));
        buttons.push(btn('Publish', 'publish', 'primary'));
      }
    } else if (status === 'Published') {
      if (isEditor) {
        buttons.push(btn('Save Changes', 'save', 'secondary'));
        buttons.push(btn('Unpublish', 'unpublish', 'danger'));
        buttons.push(btn('Archive', 'archive', 'danger'));
      }
    } else if (status === 'Scheduled') {
      if (isEditor) {
        buttons.push(btn('Save Changes', 'save', 'secondary'));
        buttons.push(btn('Publish Now', 'publish-now', 'primary'));
        buttons.push(btn('Cancel Schedule', 'back-to-draft', 'danger'));
      }
    } else if (status === 'Unpublished' || status === 'Archived') {
      if (isEditor) {
        buttons.push(btn('Restore to Draft', 'back-to-draft', 'secondary'));
        buttons.push(btn('Publish', 'publish', 'primary'));
      }
    }

    // Schedule option for editors when in Draft/In-Review/Unpublished
    if (isEditor && ['Draft','In Review','Unpublished'].includes(status)) {
      buttons.push(
        <div key="schedule-group" className="flex items-center gap-2 border-l border-gray-200 pl-3 ml-1">
          <input type="datetime-local" value={form.scheduledFor}
            onChange={e => setForm(p => ({...p, scheduledFor: e.target.value}))}
            className="text-xs border border-gray-200 rounded-xl px-2 py-1.5 bg-gray-50 focus:outline-none focus:ring-1 focus:ring-emerald-400" />
          <button type="button" disabled={saving || !form.scheduledFor} onClick={() => handleAction('schedule')}
            className="text-xs font-semibold px-3 py-2 bg-blue-50 text-blue-700 border border-blue-200 rounded-xl hover:bg-blue-100 disabled:opacity-40 transition-colors">
            Schedule
          </button>
        </div>,
      );
    }

    return <div className="flex flex-wrap items-center gap-2">{buttons}</div>;
  };

  if (loading) return (
    <AdminLayout title={isEdit ? 'Edit Resource' : 'New Resource'}>
      <div className="flex justify-center py-20">
        <Loader2 className="w-7 h-7 animate-spin text-emerald-600" />
      </div>
    </AdminLayout>
  );

  const adminUrl  = DB_TYPE_TO_ADMIN_URL[contentType] ?? 'blog';
  const pageTitle = isEdit ? `Edit ${contentType}` : `New ${contentType}`;

  return (
    <AdminLayout title={pageTitle}>
      <div className="max-w-3xl mx-auto space-y-5">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/admin/resources" className="hover:text-emerald-700">Resources</Link>
          <span>›</span>
          <Link href={`/admin/resources/${adminUrl}`} className="hover:text-emerald-700 capitalize">{adminUrl.replace('-',' ')}</Link>
          <span>›</span>
          <span className="text-gray-900">{isEdit ? 'Edit' : 'New'}</span>
        </div>

        {/* Type selector (create mode only) */}
        {!isEdit && (
          <Section title="Content Type">
            <div className="flex flex-wrap gap-2">
              {ALL_CONTENT_TYPES.map(ct => (
                <button key={ct} type="button"
                  onClick={() => { setContentType(ct); }}
                  className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-colors
                    ${contentType === ct ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200 hover:border-emerald-300'}`}>
                  {ct}
                </button>
              ))}
            </div>
          </Section>
        )}

        {/* Status badge */}
        {isEdit && (
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-gray-500">Status:</span>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full
              ${status === 'Published' ? 'bg-emerald-100 text-emerald-700' :
                status === 'Draft'     ? 'bg-gray-100 text-gray-600' :
                status === 'In Review' ? 'bg-amber-100 text-amber-700' :
                status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                                         'bg-orange-100 text-orange-700'}`}>{status}</span>
            {isDirty && <span className="text-xs text-amber-600 font-medium">● Unsaved changes</span>}
          </div>
        )}

        {/* Form error */}
        {formError && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> <p className="text-sm">{formError}</p>
          </div>
        )}

        {/* Basic info */}
        <Section title="Basic Info">
          <Field label="Title *">
            <input type="text" value={form.title} onChange={e => handleTitleChange(e.target.value)}
              disabled={isReadOnly} placeholder={`${contentType} title…`} className={inputCls} />
          </Field>
          <Field label="Slug *" hint="Appears in the URL. Changing this breaks existing links.">
            <div className="flex gap-2">
              <input type="text" value={form.slug}
                onChange={e => { slugEdited.current = true; setForm(p => ({...p, slug: e.target.value})); }}
                disabled={isReadOnly} placeholder="my-resource-slug" className={`${inputCls} flex-1 font-mono text-xs`} />
              {!isEdit && (
                <button type="button" onClick={() => { slugEdited.current = true; setForm(p => ({...p, slug: slugify(p.title)})); }}
                  className="px-3 py-2 text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-medium transition-colors">
                  Re-generate
                </button>
              )}
            </div>
          </Field>
          <Field label="Short Description" hint="Shown in listing cards (max 300 chars)">
            <textarea value={form.shortDescription} rows={2}
              onChange={e => setForm(p => ({...p, shortDescription: e.target.value}))}
              disabled={isReadOnly} maxLength={300} className={inputCls}
              placeholder="A one or two sentence summary…" />
            <p className="text-xs text-gray-400 mt-1 text-right">{form.shortDescription.length}/300</p>
          </Field>
          <div className="flex items-center gap-3">
            <button type="button" onClick={() => setForm(p => ({...p, featured: !p.featured}))} disabled={isReadOnly}>
              {form.featured
                ? <Star className="w-5 h-5 text-amber-500" fill="currentColor" />
                : <StarOff className="w-5 h-5 text-gray-300" />}
            </button>
            <span className="text-sm text-gray-700">Featured resource</span>
          </div>
        </Section>

        {/* Body */}
        <Section title="Body Content">
          <div className="flex items-center gap-2 mb-2">
            <p className="text-xs text-gray-400">HTML formatting is supported. Write directly in HTML or paste from a document editor.</p>
          </div>
          <textarea value={form.body} rows={16}
            onChange={e => setForm(p => ({...p, body: e.target.value}))}
            disabled={isReadOnly}
            className={`${inputCls} font-mono text-xs leading-relaxed resize-y`}
            placeholder="<p>Your content here...</p>" />
        </Section>

        {/* Featured image */}
        <Section title="Featured Image">
          <ImageUpload value={form.featuredImageUrl} onChange={v => setForm(p => ({...p, featuredImageUrl: v}))} />
        </Section>

        {/* Taxonomy */}
        <Section title="Category & Tags">
          <Field label="Category">
            <select value={form.categoryId} onChange={e => setForm(p => ({...p, categoryId: e.target.value}))}
              disabled={isReadOnly} className={inputCls}>
              <option value="">No category</option>
              {categories.map(c => <option key={c.id} value={String(c.id)}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Tags">
            <TagSelector tagIds={form.tagIds} allTags={allTags}
              onChange={ids => setForm(p => ({...p, tagIds: ids}))} />
          </Field>
        </Section>

        {/* Type-specific extension fields */}
        {renderTypeFields()}

        {/* SEO (collapsible) */}
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">
          <button type="button" onClick={() => setSeoOpen(!seoOpen)}
            className="w-full flex items-center justify-between px-5 py-4 hover:bg-gray-50 transition-colors">
            <h3 className="font-heading font-bold text-gray-900 text-sm">SEO & Metadata</h3>
            {seoOpen ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
          </button>
          {seoOpen && (
            <div className="px-5 pb-5 space-y-4 border-t border-gray-100">
              <Field label="SEO Title" hint="Defaults to the resource title if blank. Max 60 chars.">
                <input type="text" value={form.seoTitle} maxLength={60}
                  onChange={e => setForm(p => ({...p, seoTitle: e.target.value}))}
                  disabled={isReadOnly} className={inputCls} placeholder="Search engine title…" />
              </Field>
              <Field label="SEO Description" hint="Shown in search results. Max 160 chars.">
                <textarea value={form.seoDescription} rows={3} maxLength={160}
                  onChange={e => setForm(p => ({...p, seoDescription: e.target.value}))}
                  disabled={isReadOnly} className={inputCls} placeholder="Search engine description…" />
                <p className="text-xs text-gray-400 mt-1 text-right">{form.seoDescription.length}/160</p>
              </Field>
            </div>
          )}
        </div>

        {/* Action bar */}
        <div className="sticky bottom-4 z-10">
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-lg shadow-gray-200/50">
            {renderActionBar()}
          </div>
        </div>

        {/* Extra bottom padding so sticky bar doesn't cover content */}
        <div className="h-4" />
      </div>
    </AdminLayout>
  );
}
