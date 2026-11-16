import { useNavigate } from 'react-router-dom';
import {
  HeartHandshake,
  TrendingUp,
  Users,
  UserCheck,
  FolderKanban,
  FileBarChart2,
  Plus,
  ArrowRight,
  Clock,
  Calendar,
  AlertTriangle,
  FileCheck,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { StatCard } from '../../components/ui/StatCard';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { FundraisingTrendChart } from '../../components/charts/FundraisingTrendChart';
import { IncomeExpenseChart } from '../../components/charts/IncomeExpenseChart';
import { ExpenseBreakdownChart } from '../../components/charts/ExpenseBreakdownChart';
import {
  formatCurrency,
  getDaysRemaining,
  getCategoryBadgeClass,
  getStatusBadgeClass,
} from '../../utils/formatters';

export function Dashboard() {
  const navigate = useNavigate();
  const { currentUser, campaigns, donations, metrics, notifications, service } = useImpactData();

  const activeCampaigns = campaigns.filter((c) => c.status === 'Active');
  const recentDonations = donations.slice(0, 5);
  const pendingAlerts = notifications.filter((n) => !n.isRead).slice(0, 4);

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-12">
      {/* 1. Header & Welcome Area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-700 bg-brand-50 border border-brand-200/60 px-2 py-0.5 rounded-md">
              Live Operations Dashboard
            </span>
            <span className="text-xs text-slate-400 font-medium">
              October 2026 Reporting Cycle
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-1.5">
            Good morning, {currentUser?.name?.split(' ')[0] || 'Tanvi'}
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Here&apos;s what&apos;s happening with your organization today across all programs and campaigns.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="md"
            onClick={() => navigate('/reports')}
            leftIcon={<FileBarChart2 className="w-4 h-4 text-slate-500" />}
          >
            Generate Report
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/campaigns/new')}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create Campaign
          </Button>
        </div>
      </div>

      {/* 2. Top 6 KPI Cards (PRD Specified) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 sm:gap-5">
        <StatCard
          title="Total Funds Raised"
          value={formatCurrency(metrics.totalFundsRaised, true)}
          change={{ value: '+18.4%', trend: 'up', period: 'vs last quarter' }}
          icon={<HeartHandshake className="w-5 h-5" />}
          iconBgColor="bg-emerald-50 text-emerald-700 border-emerald-200"
          onClick={() => navigate('/fundraising')}
        />
        <StatCard
          title="Raised This Month"
          value={formatCurrency(metrics.fundsRaisedThisMonth, true)}
          change={{ value: '+12.1%', trend: 'up', period: 'vs Sep' }}
          icon={<TrendingUp className="w-5 h-5" />}
          iconBgColor="bg-teal-50 text-teal-700 border-teal-200"
          onClick={() => navigate('/finance')}
        />
        <StatCard
          title="Active Campaigns"
          value={metrics.activeCampaigns}
          description="2 nearing target"
          icon={<Calendar className="w-5 h-5" />}
          iconBgColor="bg-blue-50 text-blue-700 border-blue-200"
          onClick={() => navigate('/fundraising')}
        />
        <StatCard
          title="Total Donors"
          value={metrics.totalDonors.toLocaleString()}
          change={{ value: '+14.2%', trend: 'up', period: '84 new' }}
          icon={<Users className="w-5 h-5" />}
          iconBgColor="bg-indigo-50 text-indigo-700 border-indigo-200"
          onClick={() => navigate('/donors')}
        />
        <StatCard
          title="Beneficiaries Helped"
          value={metrics.beneficiariesHelped.toLocaleString()}
          change={{ value: '+22.0%', trend: 'up', period: 'direct aid' }}
          icon={<UserCheck className="w-5 h-5" />}
          iconBgColor="bg-purple-50 text-purple-700 border-purple-200"
          onClick={() => navigate('/beneficiaries')}
        />
        <StatCard
          title="Active Projects"
          value={metrics.activeProjects}
          description="Across 3 states"
          icon={<FolderKanban className="w-5 h-5" />}
          iconBgColor="bg-amber-50 text-amber-700 border-amber-200"
          onClick={() => navigate('/projects')}
        />
      </div>

      {/* 3. Primary Charts & Overview Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Fundraising Trajectory Chart */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between pb-0">
              <div>
                <CardTitle>Fundraising Performance</CardTitle>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time donation velocity across corporate CSR & individual givers
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/fundraising')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                All campaigns
              </Button>
            </CardHeader>
            <CardContent className="pt-4">
              <FundraisingTrendChart />
            </CardContent>
          </Card>
        </div>

        {/* Right: Urgent Alerts & Tasks (PRD Specified) */}
        <div>
          <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <span>Operational Alerts</span>
                  {pendingAlerts.length > 0 && (
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
                      {pendingAlerts.length}
                    </span>
                  )}
                </CardTitle>
                <p className="text-xs text-slate-500">Requires team coordination</p>
              </div>
            </CardHeader>
            <CardContent className="flex-1 space-y-3 pt-0">
              {pendingAlerts.length === 0 ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  All team actions are up to date!
                </div>
              ) : (
                pendingAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    onClick={() => {
                      if (alert.link) navigate(alert.link);
                      service.markNotificationRead(alert.id);
                    }}
                    className="p-3 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-100/80 transition-colors cursor-pointer group space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 font-semibold text-slate-900 group-hover:text-brand-700">
                        {alert.type === 'campaign_deadline' ? (
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                        ) : alert.type === 'expense_approval' ? (
                          <FileCheck className="w-3.5 h-3.5 text-blue-600" />
                        ) : (
                          <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />
                        )}
                        <span>{alert.title}</span>
                      </div>
                      <span className="text-[10px] text-slate-400">{alert.timestamp}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                      {alert.message}
                    </p>
                  </div>
                ))
              )}

              {/* Quick Impact summary box */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-br from-brand-50 to-teal-100/50 border border-brand-200/60">
                <div className="flex items-center justify-between text-xs font-semibold text-brand-900">
                  <span>Volunteer Field Force</span>
                  <span className="text-brand-700 font-bold">
                    {metrics.totalVolunteerHours} hrs
                  </span>
                </div>
                <p className="text-[11px] text-brand-800/80 mt-1 leading-normal">
                  {metrics.volunteerCount} active volunteers deployed across Bangalore, Delhi, and Raichur field clinics.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* 4. Active Campaigns Carousel/Grid (PRD Section B) */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Active Fundraising Campaigns</h2>
            <p className="text-xs text-slate-500">
              Live appeals raising funds for Hope Foundation interventions
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/fundraising')}
            rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
          >
            View All ({campaigns.length})
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {activeCampaigns.slice(0, 3).map((camp) => {
            const percent = Math.round((camp.raisedAmount / camp.goalAmount) * 100);
            const daysLeft = getDaysRemaining(camp.endDate);

            return (
              <Card key={camp.id} hover className="flex flex-col overflow-hidden">
                <div className="relative h-44 overflow-hidden group">
                  <img
                    src={camp.coverImage}
                    alt={camp.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 flex items-center gap-1.5">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-xs bg-white/95 backdrop-blur-xs ${getCategoryBadgeClass(
                        camp.category
                      )}`}
                    >
                      {camp.category}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3">
                    <span
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border shadow-xs bg-white/95 backdrop-blur-xs ${getStatusBadgeClass(
                        camp.status
                      )}`}
                    >
                      {camp.status}
                    </span>
                  </div>
                </div>

                <CardContent className="flex-1 flex flex-col justify-between pt-4">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 line-clamp-1 hover:text-brand-700 transition-colors">
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {camp.shortDescription}
                    </p>

                    {/* Progress Bar & Amounts */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-slate-900 text-sm">
                          {formatCurrency(camp.raisedAmount)}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          Target: {formatCurrency(camp.goalAmount, true)}
                        </span>
                      </div>
                      <ProgressBar value={percent} size="sm" variant="teal" />
                      <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                        <span className="font-semibold text-brand-700">{percent}% Funded</span>
                        <span>{camp.donorsCount} Donors</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions & Metrics */}
                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{daysLeft} days left</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/campaigns/${camp.id}/public`)}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                        title="View Public Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => navigate(`/campaigns/${camp.id}`)}
                      >
                        Manage
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* 5. Financial Overview & Recent Donations (PRD Section C & D) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Financial Inflow vs Outflow */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Financial Health & Burn Rate</CardTitle>
                <p className="text-xs text-slate-500">
                  Income vs Program disbursements (Past 6 months)
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="text-slate-500">Net Surplus:</span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                  {formatCurrency(metrics.netBalance, true)}
                </span>
              </div>
            </CardHeader>
            <CardContent>
              <IncomeExpenseChart />
            </CardContent>
          </Card>

          {/* Recent Donations Table (PRD Section C) */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Recent Contributions</CardTitle>
                <p className="text-xs text-slate-500">
                  Latest audited transactions across payment channels
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate('/donors')}
                rightIcon={<ArrowRight className="w-3.5 h-3.5" />}
              >
                View all donors
              </Button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200/80 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 sm:px-6">Donor</th>
                      <th className="py-3 px-4">Campaign</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Channel</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {recentDonations.map((don) => (
                      <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                          <div className="flex items-center gap-2">
                            <div className="w-7 h-7 rounded-full bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-[10px]">
                              {don.donorName.slice(0, 2).toUpperCase()}
                            </div>
                            <span className="truncate max-w-[140px] sm:max-w-none">
                              {don.donorName}
                            </span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-slate-600 truncate max-w-[200px]">
                          {don.campaignTitle}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-slate-900">
                          {formatCurrency(don.amount)}
                        </td>
                        <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                          {don.date.split(' ')[0]}
                        </td>
                        <td className="py-3.5 px-4 sm:px-6 text-right">
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                            {don.paymentMethod}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right: Spending Allocation Donut (PRD Section D) */}
        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Spending Allocation</CardTitle>
              <p className="text-xs text-slate-500">
                Where donor funds are currently put to work
              </p>
            </CardHeader>
            <CardContent>
              <ExpenseBreakdownChart />

              <div className="mt-8 p-4 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2">
                <div className="flex items-center justify-between text-xs font-semibold text-slate-900">
                  <span>Program Ratio Efficiency</span>
                  <span className="text-emerald-700 font-bold">87.4%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div className="bg-emerald-600 h-2 rounded-full w-[87.4%]" />
                </div>
                <p className="text-[11px] text-slate-500">
                  Hope Foundation maintains an 87.4% direct program-to-beneficiary expenditure ratio, beating standard nonprofit benchmarks.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
