/**
 * AdminLayout.tsx
 *
 * Persistent sidebar + topbar layout for all admin pages.
 * Handles authentication check, redirects to /admin/login if unauthenticated.
 * Exposes current user via AdminUserContext for child components.
 */
import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Link, useLocation } from 'wouter';
import {
  LayoutDashboard, Briefcase, FileText, Calendar, Mic, Video,
  BarChart2, Users, ShieldCheck, UserCog, LayoutList, LogOut,
  Menu, X, ChevronRight, BookOpen, Sprout
} from 'lucide-react';

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'HR_ADMIN' | 'CONTENT_EDITOR' | 'CONTENT_AUTHOR';
}

const AdminUserContext = createContext<AdminUser | null>(null);
export function useAdminUser(): AdminUser | null {
  return useContext(AdminUserContext);
}

/* ── apiFetch ─────────────────────────────────────────────────────── */
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

/* ── Nav structure ────────────────────────────────────────────────── */
interface NavItem { label: string; href: string; icon: React.FC<{ className?: string }>; }
interface NavSection { title: string; roles: string[]; items: NavItem[]; }

const NAV: NavSection[] = [
  {
    title: '',
    roles: ['all'],
    items: [
      { label: 'Dashboard',  href: '/admin',    icon: LayoutDashboard },
    ],
  },
  {
    title: 'HR Management',
    roles: ['HR_ADMIN', 'SUPER_ADMIN'],
    items: [
      { label: 'Jobs & Careers', href: '/admin/careers', icon: Briefcase },
    ],
  },
  {
    title: 'Content',
    roles: ['CONTENT_EDITOR', 'CONTENT_AUTHOR', 'SUPER_ADMIN'],
    items: [
      { label: 'All Resources',    href: '/admin/resources',                  icon: LayoutList  },
      { label: 'Blog',             href: '/admin/resources/blog',             icon: FileText    },
      { label: 'Events',           href: '/admin/resources/events',           icon: Calendar    },
      { label: 'Podcasts',         href: '/admin/resources/podcasts',         icon: Mic         },
      { label: 'Webinars',         href: '/admin/resources/webinars',         icon: Video       },
      { label: 'Reports',          href: '/admin/resources/reports',          icon: BarChart2   },
      { label: 'Customer Stories', href: '/admin/resources/customer-stories', icon: BookOpen    },
    ],
  },
  {
    title: 'Farmer Services',
    roles: ['CONTENT_EDITOR', 'SUPER_ADMIN'],
    items: [
      { label: 'Farm Data', href: '/admin/farm-data', icon: Sprout },
    ],
  },
  {
    title: 'System',
    roles: ['SUPER_ADMIN'],
    items: [
      { label: 'Users',      href: '/admin/users',      icon: UserCog    },
      { label: 'Audit Logs', href: '/admin/audit-logs', icon: ShieldCheck },
    ],
  },
];

function canSeeSection(section: NavSection, role: string): boolean {
  return section.roles.includes('all') || section.roles.includes(role);
}

/* ── Sidebar nav item ─────────────────────────────────────────────── */
function NavLink({ item, currentPath, onClick }: { item: NavItem; currentPath: string; onClick?: () => void }) {
  const isActive = currentPath === item.href || (item.href !== '/admin' && currentPath.startsWith(item.href));
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onClick}
      className={`flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm font-medium transition-colors
        ${isActive
          ? 'bg-emerald-50 text-emerald-700 font-semibold'
          : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
        }`}
    >
      <Icon className={`w-4 h-4 flex-shrink-0 ${isActive ? 'text-emerald-600' : 'text-gray-400'}`} />
      {item.label}
      {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-emerald-400" />}
    </Link>
  );
}

/* ── Sidebar ──────────────────────────────────────────────────────── */
function Sidebar({ user, currentPath, onClose }: { user: AdminUser; currentPath: string; onClose?: () => void }) {
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await fetch(`${BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
    setLocation('/admin/login');
  };

  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200">
      {/* Logo */}
      <div className="flex items-center justify-between px-4 py-4 border-b border-gray-100">
        <Link href="/" className="flex items-center gap-2">
          <img src="/esoko-logo.png" alt="Esoko" style={{ height: 28, width: 'auto' }} />
          <span className="text-xs font-semibold text-gray-400 uppercase tracking-wide">Admin</span>
        </Link>
        {onClose && (
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1 rounded-lg hover:bg-gray-100 md:hidden">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-5">
        {NAV.map((section, si) => {
          if (!canSeeSection(section, user.role)) return null;
          return (
            <div key={si}>
              {section.title && (
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider px-3 mb-1.5">
                  {section.title}
                </p>
              )}
              <div className="space-y-0.5">
                {section.items.map(item => (
                  <NavLink key={item.href} item={item} currentPath={currentPath} onClick={onClose} />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      {/* User profile + logout */}
      <div className="px-3 py-4 border-t border-gray-100">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-gray-50">
          <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
            <Users className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.role.replace(/_/g, ' ')}</p>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded-lg transition-colors"
            title="Sign out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── AdminLayout ──────────────────────────────────────────────────── */
interface AdminLayoutProps {
  children: React.ReactNode;
  title?: string;
  actions?: React.ReactNode;
}

export default function AdminLayout({ children, title, actions }: AdminLayoutProps) {
  const [location, setLocation] = useLocation();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  const checkAuth = useCallback(async () => {
    try {
      const data = await apiFetch<{ authenticated: boolean; user: AdminUser }>('/auth/me');
      setUser(data.user);
    } catch {
      setLocation('/admin/login');
    } finally {
      setLoading(false);
    }
  }, [setLocation]);

  useEffect(() => { checkAuth(); }, [checkAuth]);

  // Close mobile sidebar on route change
  useEffect(() => { setMobileOpen(false); }, [location]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <AdminUserContext.Provider value={user}>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex md:fixed md:inset-y-0 md:left-0 md:w-60 md:flex-col md:z-20">
          <Sidebar user={user} currentPath={location} />
        </aside>

        {/* Mobile sidebar overlay */}
        {mobileOpen && (
          <div className="fixed inset-0 z-40 flex md:hidden">
            <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <aside className="relative w-72 flex flex-col shadow-xl">
              <Sidebar user={user} currentPath={location} onClose={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 flex flex-col md:ml-60">
          {/* Topbar */}
          <header className="sticky top-0 z-10 bg-white border-b border-gray-200 h-14 flex items-center px-4 md:px-6 gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="md:hidden text-gray-500 hover:text-gray-700 p-1.5 rounded-lg hover:bg-gray-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex-1 min-w-0">
              {title && (
                <h1 className="font-heading font-bold text-gray-900 text-sm md:text-base truncate">{title}</h1>
              )}
            </div>
            {actions && <div className="flex items-center gap-2">{actions}</div>}
          </header>

          {/* Page content */}
          <main className="flex-1 p-4 md:p-6">
            {children}
          </main>
        </div>
      </div>
    </AdminUserContext.Provider>
  );
}
