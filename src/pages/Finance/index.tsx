import { useState, useMemo } from 'react';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Download,
  Search,
  Filter,
  DollarSign,
  TrendingDown,
  TrendingUp,
  FileSpreadsheet,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { IncomeExpenseChart } from '../../components/charts/IncomeExpenseChart';
import { ExpenseBreakdownChart } from '../../components/charts/ExpenseBreakdownChart';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  formatCurrency,
  formatDate,
  getStatusBadgeClass,
} from '../../utils/formatters';
import { IncomeCategory, ExpenseCategory } from '../../types';

export function Finance() {
  const { transactions, projects, campaigns, service } = useImpactData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<'All' | 'Income' | 'Expense'>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Add Transaction Modal
  const [isAddTxOpen, setIsAddTxOpen] = useState(false);
  const [txType, setTxType] = useState<'Income' | 'Expense'>('Expense');
  const [newTx, setNewTx] = useState({
    description: '',
    category: 'Program' as IncomeCategory | ExpenseCategory,
    amount: 25000,
    date: new Date().toISOString().split('T')[0],
    projectId: '',
    paymentMethod: 'Bank Transfer',
    status: 'Completed' as const,
  });

  // Top Metrics
  const totalIncome = transactions
    .filter((t) => t.type === 'Income' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === 'Expense' && t.status === 'Completed')
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpense;

  const monthlyBurn = 285000; // Average monthly burn

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((t) => {
      const matchesSearch =
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.referenceNo.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = selectedType === 'All' ? true : t.type === selectedType;
      const matchesCategory =
        selectedCategory === 'All' ? true : t.category === selectedCategory;

      return matchesSearch && matchesType && matchesCategory;
    });
  }, [transactions, searchQuery, selectedType, selectedCategory]);

  const handleAddTxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTx.description.trim() || !newTx.amount) {
      alert('Please fill out the transaction description and amount.');
      return;
    }

    const selectedProj = projects.find((p) => p.id === newTx.projectId);

    service.addTransaction({
      ...newTx,
      type: txType,
      projectName: selectedProj?.name,
    });

    setIsAddTxOpen(false);
    setNewTx({
      description: '',
      category: 'Program',
      amount: 25000,
      date: new Date().toISOString().split('T')[0],
      projectId: '',
      paymentMethod: 'Bank Transfer',
      status: 'Completed',
    });
  };

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      ['Date,Description,Type,Category,Amount,Reference,Status']
        .concat(
          filteredTransactions.map(
            (t) =>
              `"${t.date}","${t.description.replace(/"/g, '""')}","${t.type}","${t.category}","${t.amount}","${t.referenceNo}","${t.status}"`
          )
        )
        .join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `hope_foundation_ledger_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Financial Ledger & Operations
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time income, grant disbursements, program expenses, and FCRA/80G compliance.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          <Button
            variant="outline"
            size="md"
            onClick={handleExportCSV}
            leftIcon={<Download className="w-4 h-4" />}
          >
            Export CSV
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setTxType('Expense');
              setIsAddTxOpen(true);
            }}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Add Transaction
          </Button>
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Inflow (Income)</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalIncome)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">+15.4% vs last period</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Outflow (Expenses)</span>
            <TrendingDown className="w-4 h-4 text-rose-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalExpense)}
          </p>
          <span className="text-[11px] text-slate-400">Audited program expenditures</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Net Operating Balance</span>
            <Wallet className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(netBalance)}
          </p>
          <span className="text-[11px] text-brand-700 font-medium">Healthy runway reserve</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Monthly Program Spend</span>
            <DollarSign className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(monthlyBurn, true)}
          </p>
          <span className="text-[11px] text-blue-600 font-medium">87.4% program ratio</span>
        </div>
      </div>

      {/* Visual Analytics Row: Inflow/Outflow + Category Allocation */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Cash Flow Trajectory</CardTitle>
                <p className="text-xs text-slate-500">
                  Monthly donations & grants vs field deployments (Past 6 Months)
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <IncomeExpenseChart />
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Expense Distribution</CardTitle>
              <p className="text-xs text-slate-500">Breakdown by audited cost centers</p>
            </CardHeader>
            <CardContent>
              <ExpenseBreakdownChart />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search transactions by description, vendor, or reference..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Type Selector Tabs */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            {(['All', 'Income', 'Expense'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setSelectedType(t)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
                  selectedType === t
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Categories</option>
              <option value="Donations">Donations</option>
              <option value="Grants">Grants</option>
              <option value="Education Supplies">Education Supplies</option>
              <option value="Food & Provisions">Food & Provisions</option>
              <option value="Medical Supplies">Medical Supplies</option>
              <option value="Operations">Operations</option>
              <option value="Salaries & Honorariums">Salaries & Honorariums</option>
            </select>
          </div>
        </div>
      </div>

      {/* Transactions Ledger Table */}
      {filteredTransactions.length === 0 ? (
        <EmptyState
          icon={<FileSpreadsheet className="w-6 h-6 text-brand-600" />}
          title="No transactions found"
          description="Adjust your search filters or add a new voucher to the ledger."
          actionText="Add Transaction"
          onAction={() => setIsAddTxOpen(true)}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Date</th>
                  <th className="py-3 px-4">Description</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Amount</th>
                  <th className="py-3 px-4">Program / Allocation</th>
                  <th className="py-3 px-4">Ref No.</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4 sm:px-6 text-slate-500 whitespace-nowrap">
                      {formatDate(tx.date)}
                    </td>
                    <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs truncate">
                      {tx.description}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      <span className="inline-block px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-700">
                        {tx.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                          tx.type === 'Income'
                            ? 'text-emerald-700 bg-emerald-50 border border-emerald-200'
                            : 'text-rose-700 bg-rose-50 border border-rose-200'
                        }`}
                      >
                        {tx.type === 'Income' ? (
                          <ArrowUpRight className="w-3 h-3" />
                        ) : (
                          <ArrowDownRight className="w-3 h-3" />
                        )}
                        {tx.type}
                      </span>
                    </td>
                    <td
                      className={`py-3.5 px-4 font-bold text-sm whitespace-nowrap ${
                        tx.type === 'Income' ? 'text-emerald-700' : 'text-slate-900'
                      }`}
                    >
                      {tx.type === 'Expense' ? '-' : '+'}
                      {formatCurrency(tx.amount)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 max-w-[180px] truncate">
                      {tx.projectName || tx.campaignName || 'General Operations'}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-[11px] text-slate-400">
                      {tx.referenceNo}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                          tx.status
                        )}`}
                      >
                        {tx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Add Transaction Modal */}
      <Modal
        isOpen={isAddTxOpen}
        onClose={() => setIsAddTxOpen(false)}
        title={txType === 'Income' ? 'Record Income Inflow' : 'Record Expense Voucher'}
        description="Log audited financial movement with program attribution."
      >
        <form onSubmit={handleAddTxSubmit} className="space-y-4">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setTxType('Expense');
                setNewTx({ ...newTx, category: 'Program' });
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                txType === 'Expense'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Expense Disbursal
            </button>
            <button
              type="button"
              onClick={() => {
                setTxType('Income');
                setNewTx({ ...newTx, category: 'Grants' });
              }}
              className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all ${
                txType === 'Income'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Income Receipt
            </button>
          </div>

          <Input
            label="Transaction Description *"
            placeholder="e.g. Purchase of 200 School Uniform Kits"
            value={newTx.description}
            onChange={(e) => setNewTx({ ...newTx, description: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Amount (INR ₹) *"
              type="number"
              value={newTx.amount}
              onChange={(e) => setNewTx({ ...newTx, amount: Number(e.target.value) })}
            />

            <Select
              label="Category *"
              value={newTx.category}
              onChange={(e) =>
                setNewTx({ ...newTx, category: e.target.value as any })
              }
            >
              {txType === 'Income' ? (
                <>
                  <option value="Grants">CSR & Institutional Grants</option>
                  <option value="Donations">Individual Donations</option>
                  <option value="Sponsorships">Corporate Sponsorships</option>
                  <option value="Other Income">Other Income</option>
                </>
              ) : (
                <>
                  <option value="Program">Program Execution</option>
                  <option value="Education Supplies">Education Supplies</option>
                  <option value="Food & Provisions">Food & Provisions</option>
                  <option value="Medical Supplies">Medical Supplies</option>
                  <option value="Operations">Operations & Fleet</option>
                  <option value="Salaries & Honorariums">Salaries & Honorariums</option>
                </>
              )}
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Transaction Date *"
              type="date"
              value={newTx.date}
              onChange={(e) => setNewTx({ ...newTx, date: e.target.value })}
            />

            <Select
              label="Payment Channel"
              value={newTx.paymentMethod}
              onChange={(e) => setNewTx({ ...newTx, paymentMethod: e.target.value })}
            >
              <option value="Bank Transfer">Bank Transfer / NEFT</option>
              <option value="UPI">UPI</option>
              <option value="Credit Card">Corporate Card</option>
              <option value="Cheque">Cheque</option>
            </Select>
          </div>

          <Select
            label="Linked Project / Program (Optional)"
            value={newTx.projectId}
            onChange={(e) => setNewTx({ ...newTx, projectId: e.target.value })}
          >
            <option value="">General Organizational Budget</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddTxOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Post to Ledger
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
