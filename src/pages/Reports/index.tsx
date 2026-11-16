import { useState } from 'react';
import {
  FileBarChart2,
  Download,
  Printer,
  Calendar,
  Share2,
  CheckCircle2,
  HeartHandshake,
  TrendingUp,
  Users,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { FundraisingTrendChart } from '../../components/charts/FundraisingTrendChart';
import { IncomeExpenseChart } from '../../components/charts/IncomeExpenseChart';
import { ExpenseBreakdownChart } from '../../components/charts/ExpenseBreakdownChart';
import { formatCurrency } from '../../utils/formatters';

export function Reports() {
  const { organization, currentUser, metrics, campaigns, projects, donors } = useImpactData();

  const [activeTab, setActiveTab] = useState<
    'monthly' | 'fundraising' | 'finance' | 'projects' | 'donors'
  >('monthly');

  const [dateRange, setDateRange] = useState('Oct 2026');
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState<'pdf' | 'csv'>('pdf');
  const [exporting, setExporting] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    setExporting(true);
    setTimeout(() => {
      setExporting(false);
      setIsExportModalOpen(false);
      alert(`Report exported successfully as ${exportFormat.toUpperCase()}! File: Hope_Foundation_${activeTab}_report.pdf`);
    }, 1000);
  };

  const reportTabs = [
    { id: 'monthly', label: 'Monthly Impact Report' },
    { id: 'fundraising', label: 'Fundraising Performance' },
    { id: 'finance', label: 'Financial Summary' },
    { id: 'projects', label: 'Project Performance' },
    { id: 'donors', label: 'Donor Retention & Summary' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 pb-16">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Impact & Executive Reports
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Generate verifiable impact reports for CSR committees, trustees, and regulatory audits.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={handlePrint}
            leftIcon={<Printer className="w-4 h-4" />}
          >
            Print
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => setIsExportModalOpen(true)}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export Report
          </Button>
        </div>
      </div>

      {/* Report Categories Nav Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {reportTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Date Range Selector Bar */}
      <div className="bg-white p-3.5 rounded-xl border border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-600 font-medium">
          <Calendar className="w-4 h-4 text-slate-400" />
          <span>Reporting Period:</span>
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded px-2 py-1 font-semibold text-slate-900 focus:outline-none"
          >
            <option value="Oct 2026">October 2026 (Current Cycle)</option>
            <option value="Q3 2026">Q3 2026 (Jul - Sep 2026)</option>
            <option value="FY 2026-27">Financial Year 2026-27 (YTD)</option>
          </select>
        </div>

        <div className="text-slate-400">
          Generated on {new Date().toLocaleDateString('en-IN')} by {currentUser.name}
        </div>
      </div>

      {/* PRINTABLE / PREVIEW DOCUMENT CANVAS */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-card p-8 sm:p-12 space-y-8 max-w-5xl mx-auto print:border-none print:shadow-none">
        {/* Document Letterhead */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b-2 border-slate-900 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tight">
                {organization.name}
              </h2>
              <p className="text-xs text-slate-500 font-mono">
                {organization.registrationNumber} • {organization.taxExemptStatus}
              </p>
            </div>
          </div>

          <div className="sm:text-right text-xs text-slate-500">
            <p className="font-bold text-slate-900 uppercase tracking-wider text-sm">
              {reportTabs.find((t) => t.id === activeTab)?.label}
            </p>
            <p>Period: {dateRange}</p>
            <p className="text-emerald-700 font-semibold mt-0.5">Audited & Verified</p>
          </div>
        </div>

        {/* TAB 1: MONTHLY IMPACT REPORT */}
        {activeTab === 'monthly' && (
          <div className="space-y-8">
            {/* Executive Summary */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1.5 text-xs text-slate-700 leading-relaxed">
              <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                Executive Narrative
              </h3>
              <p>
                During the {dateRange} operational cycle, Hope Foundation deployed interventions
                across 6 program corridors. Direct educational kits were distributed to 500 children
                in Bangalore clusters, 1,000 migrant households received dry ration hampers in Delhi,
                and our mobile medical clinic delivered 1,200 primary screenings in rural Raichur.
              </p>
            </div>

            {/* KPI Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Total Disbursed
                </span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {formatCurrency(metrics.totalExpenses, true)}
                </p>
                <span className="text-[11px] text-emerald-600 font-medium">87.4% Program Ratio</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Beneficiaries Reached
                </span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {metrics.beneficiariesHelped.toLocaleString()}
                </p>
                <span className="text-[11px] text-slate-500 font-medium">Direct individuals</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Active Projects
                </span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {metrics.activeProjects}
                </p>
                <span className="text-[11px] text-blue-600 font-medium">3 States</span>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-white">
                <span className="text-[10px] font-bold uppercase text-slate-400">
                  Volunteer Hours
                </span>
                <p className="text-xl font-extrabold text-slate-900 mt-1">
                  {metrics.totalVolunteerHours} hrs
                </p>
                <span className="text-[11px] text-purple-600 font-medium">Field contribution</span>
              </div>
            </div>

            {/* Program Outputs Table */}
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-3">
                Key Program Deliverables
              </h3>
              <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Program</th>
                    <th className="py-2.5 px-4">Intervention</th>
                    <th className="py-2.5 px-4">Beneficiaries</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td className="py-3 px-4 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-4 text-slate-600">{p.location}</td>
                      <td className="py-3 px-4 text-slate-700">{p.beneficiariesCount}</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">{p.status}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 2: FUNDRAISING PERFORMANCE */}
        {activeTab === 'fundraising' && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">Total Funds Mobilized</span>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  {formatCurrency(metrics.totalFundsRaised)}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">Individual Donors</span>
                <p className="text-xl font-bold text-slate-900 mt-0.5">{donors.length}</p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">Average Gift Size</span>
                <p className="text-xl font-bold text-slate-900 mt-0.5">
                  {formatCurrency(Math.round(metrics.totalFundsRaised / (donors.length || 1)))}
                </p>
              </div>
            </div>

            <FundraisingTrendChart />
          </div>
        )}

        {/* TAB 3: FINANCIAL SUMMARY */}
        {activeTab === 'finance' && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">Inflow Total</span>
                <p className="text-xl font-bold text-emerald-700 mt-0.5">
                  {formatCurrency(metrics.totalIncome)}
                </p>
              </div>
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-xs text-slate-500">Outflow Total</span>
                <p className="text-xl font-bold text-rose-700 mt-0.5">
                  {formatCurrency(metrics.totalExpenses)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <IncomeExpenseChart />
              <ExpenseBreakdownChart />
            </div>
          </div>
        )}

        {/* TAB 4: PROJECTS PERFORMANCE */}
        {activeTab === 'projects' && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {projects.map((p) => (
                <div key={p.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-slate-900 text-xs">{p.name}</h4>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
                      {p.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">{p.description}</p>
                  <div className="flex justify-between text-xs pt-2 border-t border-slate-200/80">
                    <span>Budget: {formatCurrency(p.budget, true)}</span>
                    <span className="font-semibold text-brand-700">
                      Spent: {formatCurrency(p.spent, true)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 5: DONORS SUMMARY */}
        {activeTab === 'donors' && (
          <div className="space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Top Institutional & Patron Givers
            </h3>
            <table className="w-full text-left text-xs border border-slate-200 rounded-lg overflow-hidden">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-4">Donor Name</th>
                  <th className="py-2.5 px-4">City</th>
                  <th className="py-2.5 px-4">Lifetime Contributed</th>
                  <th className="py-2.5 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {donors.slice(0, 8).map((d) => (
                  <tr key={d.id}>
                    <td className="py-2.5 px-4 font-bold text-slate-900">{d.name}</td>
                    <td className="py-2.5 px-4 text-slate-600">{d.city}</td>
                    <td className="py-2.5 px-4 font-bold text-emerald-700">
                      {formatCurrency(d.totalDonated)}
                    </td>
                    <td className="py-2.5 px-4 text-slate-700">{d.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Signature & Compliance Sign-off Block */}
        <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            <p className="font-semibold text-slate-900">Hope Foundation Board of Trustees</p>
            <p>Audited by Deshmukh & Nair Chartered Accountants, LLP</p>
          </div>
          <div className="flex items-center gap-2 text-emerald-700 font-semibold">
            <CheckCircle2 className="w-4 h-4" />
            <span>Digital Certificate Signed</span>
          </div>
        </div>
      </div>

      {/* Export Modal */}
      <Modal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        title="Export Official Impact Report"
        description="Generate formatted report package for donors, auditors or regulators."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsExportModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" isLoading={exporting} onClick={handleExport}>
              Download Package
            </Button>
          </>
        }
      >
        <div className="space-y-4 text-xs">
          <div className="space-y-1.5">
            <label className="font-bold text-slate-700 uppercase">Export Format</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setExportFormat('pdf')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  exportFormat === 'pdf'
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-bold text-slate-900">PDF Document</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  High-res letterhead report with charts and trustee sign-off.
                </p>
              </button>
              <button
                type="button"
                onClick={() => setExportFormat('csv')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  exportFormat === 'csv'
                    ? 'border-brand-600 bg-brand-50/50 ring-2 ring-brand-500/20'
                    : 'border-slate-200 hover:bg-slate-50'
                }`}
              >
                <p className="font-bold text-slate-900">Raw Data (CSV)</p>
                <p className="text-slate-500 text-[11px] mt-0.5">
                  Spreadsheet format for Excel/Google Sheets reconciliation.
                </p>
              </button>
            </div>
          </div>

          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
            <span className="font-bold text-slate-800">Included Sections:</span>
            <p className="text-slate-600">
              Executive Narrative, Verified KPIs, Inflow/Outflow Breakdown, Beneficiary Rosters (Masked), and Program Milestones.
            </p>
          </div>
        </div>
      </Modal>
    </div>
  );
}
