/**
 * AdminDashboardPage.tsx
 * /admin
 *
 * Role-appropriate stat cards + quick links.
 */
import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import {
  FileText, Eye, Clock, AlertCircle, CheckCircle, CalendarClock,
  Briefcase, XCircle, Plus, LayoutList, RefreshCw, ArrowRight,
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { useAdminUser } from '@/components/admin/AdminLayout';

const BASE = `${import.meta.env.BASE_URL}api`;

interface Stats {
  content?: {
    drafts: number;
    inReview: number;
    scheduled: number;
    published: number;
    myDrafts?: number;
    myInReview?: number;
  };
  hr?: {
    published: number;
    drafts: number;
    closed: number;
  };
}

function StatCard({
  icon: Icon, label, value, color, href,
}: {
  icon: React.FC<{ className?: string }>;
  label: string;
  value: number | string;
  color: string;
  href?: string;
}) {
  const inner = (
    <div className="bg-white rounded-2xl border border-gray-200 p-5 flex items-center gap-4 hover:shadow-sm transition-shadow">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${color}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-2xl font-heading font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500">{label}</p>
      </div>
      {href && <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />}
    </div>
  );
  return href ? <Link href={href}>{inner}</Link> : inner;
}

function QuickLink({ href, icon: Icon, label, description }: {
  href: string; icon: React.FC<{ className?: string }>; label: string; description: string;
}) {
  return (
    <Link href={href} className="flex items-start gap-3 p-4 bg-white border border-gray-200 rounded-2xl hover:border-emerald-300 hover:shadow-sm transition-all group">
      <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center flex-shrink-0 group-hover:bg-emerald-100 transition-colors">
        <Icon className="w-4 h-4 text-emerald-600" />
      </div>
      <div>
        <p className="text-sm font-semibold text-gray-900">{label}</p>
        <p className="text-xs text-gray-400 mt-0.5">{description}</p>
      </div>
    </Link>
  );
}

export default function AdminDashboardPage() {
  const user = useAdminUser();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`${BASE}/admin/stats`, { credentials: 'include' })
      .then(r => r.json())
      .then((d: Stats) => { setStats(d); setLoading(false); })
      .catch(e => { setError((e as Error).message); setLoading(false); });
  }, []);

  const isContentRole = user && ['SUPER_ADMIN','CONTENT_EDITOR','CONTENT_AUTHOR'].includes(user.role);
  const isHrRole      = user && ['SUPER_ADMIN','HR_ADMIN'].includes(user.role);
  const isAuthor      = user?.role === 'CONTENT_AUTHOR';

  return (
    <AdminLayout title="Dashboard">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Welcome banner */}
        <div className="bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
          <p className="text-sm text-emerald-200 mb-1">Good day,</p>
          <h2 className="font-heading text-xl font-bold">{user?.name ?? 'Welcome back'}</h2>
          <p className="text-sm text-emerald-200 mt-1 capitalize">{user?.role.replace(/_/g, ' ').toLowerCase()}</p>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-12">
            <RefreshCw className="w-6 h-6 animate-spin text-emerald-600" />
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-2xl flex items-center gap-3 text-red-700">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">Could not load stats: {error}</p>
          </div>
        )}

        {!loading && stats && (
          <>
            {/* Content stats */}
            {isContentRole && stats.content && (
              <section>
                <h2 className="font-heading font-bold text-gray-900 mb-4">
                  {isAuthor ? 'My Content' : 'Content Overview'}
                </h2>

                {isAuthor && (stats.content.myDrafts !== undefined) ? (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Clock}        label="My Drafts"       value={stats.content.myDrafts ?? 0}   color="text-amber-600 bg-amber-50"   href="/admin/resources?status=Draft" />
                    <StatCard icon={AlertCircle}  label="My In Review"    value={stats.content.myInReview ?? 0} color="text-blue-600 bg-blue-50"     href="/admin/resources?status=In Review" />
                    <StatCard icon={CheckCircle}  label="Total Published" value={stats.content.published}       color="text-emerald-600 bg-emerald-50" href="/admin/resources?status=Published" />
                    <StatCard icon={CalendarClock} label="Scheduled"      value={stats.content.scheduled}       color="text-purple-600 bg-purple-50" href="/admin/resources?status=Scheduled" />
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <StatCard icon={Clock}         label="Drafts"         value={stats.content.drafts}    color="text-amber-600 bg-amber-50"     href="/admin/resources?status=Draft" />
                    <StatCard icon={AlertCircle}   label="In Review"      value={stats.content.inReview}  color="text-blue-600 bg-blue-50"       href="/admin/resources?status=In Review" />
                    <StatCard icon={CalendarClock} label="Scheduled"      value={stats.content.scheduled} color="text-purple-600 bg-purple-50"  href="/admin/resources?status=Scheduled" />
                    <StatCard icon={CheckCircle}   label="Published"      value={stats.content.published} color="text-emerald-600 bg-emerald-50" href="/admin/resources?status=Published" />
                  </div>
                )}
              </section>
            )}

            {/* HR stats */}
            {isHrRole && stats.hr && (
              <section>
                <h2 className="font-heading font-bold text-gray-900 mb-4">HR Overview</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <StatCard icon={Briefcase} label="Live Vacancies" value={stats.hr.published} color="text-emerald-600 bg-emerald-50" href="/admin/careers" />
                  <StatCard icon={Clock}     label="Draft Jobs"     value={stats.hr.drafts}    color="text-amber-600 bg-amber-50"     href="/admin/careers" />
                  <StatCard icon={XCircle}   label="Closed Jobs"    value={stats.hr.closed}    color="text-red-500 bg-red-50"         href="/admin/careers" />
                </div>
              </section>
            )}
          </>
        )}

        {/* Quick actions */}
        <section>
          <h2 className="font-heading font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {isContentRole && (
              <>
                <QuickLink href="/admin/resources/new?type=blog"             icon={FileText}  label="Write a Blog Post"    description="Create a new article" />
                <QuickLink href="/admin/resources/new?type=events"           icon={CalendarClock} label="Add an Event"     description="Announce upcoming events" />
                <QuickLink href="/admin/resources/new?type=podcasts"         icon={LayoutList} label="Add a Podcast"       description="Share an audio episode" />
                <QuickLink href="/admin/resources/new?type=reports"          icon={Briefcase}  label="Upload a Report"     description="Research reports and whitepapers" />
                <QuickLink href="/admin/resources/new?type=customer-stories" icon={CheckCircle} label="Add a Customer Story" description="Highlight a client success" />
                <QuickLink href="/admin/resources"                           icon={LayoutList} label="Browse All Content"   description="Search and manage all resources" />
              </>
            )}
            {isHrRole && (
              <>
                <QuickLink href="/admin/careers" icon={Briefcase} label="Manage Jobs"     description="View and edit job listings" />
                <QuickLink href="/admin/careers" icon={Plus}      label="Post New Job"    description="Create a new vacancy" />
              </>
            )}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
