import { useState, FormEvent } from 'react';
import { useLocation } from 'wouter';
import {
  Eye, EyeOff, Lock, Mail, AlertCircle, Loader2,
  Users, BookOpen, ShieldCheck,
} from 'lucide-react';

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow]         = useState(false);
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState<string | null>(null);

  /* ── Auth logic untouched ─────────────────────────────────────── */
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${import.meta.env.BASE_URL}api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        const data = await res.json() as { user?: { role?: string } };
        const role = data.user?.role;
        if (role === 'CONTENT_EDITOR' || role === 'CONTENT_AUTHOR') {
          setLocation('/admin/resources');
        } else {
          setLocation('/admin/careers');
        }
      } else {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setError(data.error ?? 'Invalid email or password.');
      }
    } catch {
      setError('Could not reach the server. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">

      {/* ── Left panel — brand ──────────────────────────────────── */}
      <div className="hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between bg-gradient-to-br from-emerald-900 via-emerald-800 to-green-900 p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-[480px] h-[480px] rounded-full bg-white/5 pointer-events-none" />

        {/* Logo */}
        <div>
          <img src="/esoko-logo.png" alt="Esoko" style={{ height: 36, width: 'auto', filter: 'brightness(0) invert(1)' }} />
        </div>

        {/* Centre copy */}
        <div className="relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
            <ShieldCheck className="w-7 h-7 text-emerald-300" />
          </div>
          <h2 className="text-3xl font-bold text-white leading-snug mb-4">
            Esoko<br />Staff Portal
          </h2>
          <p className="text-emerald-200 text-base leading-relaxed max-w-xs">
            Secure access for Esoko team members. Your role determines your dashboard after sign-in.
          </p>

          {/* Role hint cards */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">HR Administration</p>
                <p className="text-xs text-emerald-300">Careers, applications &amp; candidates</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Content Management</p>
                <p className="text-xs text-emerald-300">Articles, events, reports &amp; media</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom note */}
        <p className="text-xs text-emerald-400 relative z-10">
          Authorized personnel only. All access is logged.
        </p>
      </div>

      {/* ── Right panel — form ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 px-6 py-12">

        {/* Mobile logo */}
        <div className="lg:hidden mb-8">
          <img src="/esoko-logo.png" alt="Esoko" style={{ height: 32, width: 'auto' }} />
        </div>

        <div className="w-full max-w-sm">
          {/* Header */}
          <div className="mb-8 text-center lg:text-left">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 mb-4 lg:mb-3">
              <Lock className="w-5 h-5 text-emerald-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 leading-tight">
              Esoko Staff Portal
            </h1>
            <p className="text-sm text-gray-500 mt-1.5">
              Secure access for authorized Esoko staff.
            </p>
          </div>

          {/* Mobile role hints */}
          <div className="lg:hidden grid grid-cols-2 gap-2 mb-6">
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
              <Users className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-900">HR Admin</p>
                <p className="text-[10px] text-emerald-600">Careers &amp; people</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-xl px-3 py-2.5">
              <BookOpen className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <div>
                <p className="text-xs font-semibold text-emerald-900">Content</p>
                <p className="text-[10px] text-emerald-600">Articles &amp; media</p>
              </div>
            </div>
          </div>

          {/* Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">

            {/* Error state */}
            {error && (
              <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-red-700 text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    autoFocus
                    autoComplete="email"
                    placeholder="you@esoko.com"
                    className="w-full pl-10 pr-4 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 bg-gray-50 transition-colors"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={show ? 'text' : 'password'}
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 pr-10 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-400/40 focus:border-emerald-400 bg-gray-50 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShow(s => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                    aria-label={show ? 'Hide password' : 'Show password'}
                  >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in…
                  </>
                ) : (
                  'Sign In'
                )}
              </button>
            </form>
          </div>

          <p className="text-center text-xs text-gray-400 mt-5">
            Contact your administrator if you need access.
          </p>
        </div>
      </div>
    </div>
  );
}
