import { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  DollarSign,
  HeartHandshake,
  Repeat,
  Sparkles,
  Mail,
  Phone,
  MapPin,
  Calendar,
  X,
  Clock,
  ArrowUpRight,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  formatCurrency,
  formatDate,
  getStatusBadgeClass,
  getCategoryBadgeClass,
} from '../../utils/formatters';
import { Donor, CampaignCategory } from '../../types';

export function Donors() {
  const { donors, donations, service } = useImpactData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'donated' | 'recent' | 'name'>('donated');

  // Drawer / Profile state
  const [activeDonor, setActiveDonor] = useState<Donor | null>(null);

  // Add Donor Modal state
  const [isAddDonorOpen, setIsAddDonorOpen] = useState(false);
  const [newDonor, setNewDonor] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Bengaluru',
    preferredCategory: 'Education' as CampaignCategory,
    isRecurring: false,
    status: 'Active' as const,
    notes: '',
  });

  // Top Metrics
  const totalDonated = donors.reduce((sum, d) => sum + d.totalDonated, 0);
  const recurringCount = donors.filter((d) => d.isRecurring).length;
  const vipCount = donors.filter((d) => d.status === 'VIP').length;

  // Filtered Donors
  const filteredDonors = useMemo(() => {
    return donors
      .filter((d) => {
        const matchesSearch =
          d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          d.phone.includes(searchQuery);

        const matchesStatus =
          selectedStatus === 'All' ? true : d.status === selectedStatus;

        const matchesCategory =
          selectedCategory === 'All' ? true : d.preferredCategory === selectedCategory;

        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'donated') return b.totalDonated - a.totalDonated;
        if (sortBy === 'recent') {
          return new Date(b.lastDonationDate).getTime() - new Date(a.lastDonationDate).getTime();
        }
        return a.name.localeCompare(b.name);
      });
  }, [donors, searchQuery, selectedStatus, selectedCategory, sortBy]);

  const handleAddDonorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDonor.name.trim() || !newDonor.email.trim()) {
      alert('Please provide at least a donor name and email.');
      return;
    }

    const created = service.addDonor(newDonor);
    setIsAddDonorOpen(false);
    setActiveDonor(created);
    setNewDonor({
      name: '',
      email: '',
      phone: '',
      city: 'Bengaluru',
      preferredCategory: 'Education',
      isRecurring: false,
      status: 'Active',
      notes: '',
    });
  };

  // Active donor's contributions
  const activeDonorDonations = useMemo(() => {
    if (!activeDonor) return [];
    return donations.filter(
      (d) =>
        d.donorId === activeDonor.id ||
        d.donorEmail.toLowerCase() === activeDonor.email.toLowerCase()
    );
  }, [activeDonor, donations]);

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Donor Relationship Management (CRM)
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Cultivate relationships with CSR institutions, patrons, and grassroots givers.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddDonorOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Add Donor
        </Button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Contributions</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalDonated)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">Lifetime funds received</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Donors</span>
            <Users className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{donors.length}</p>
          <span className="text-[11px] text-slate-400">On file</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Recurring Supporters</span>
            <Repeat className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{recurringCount}</p>
          <span className="text-[11px] text-blue-600 font-medium">Monthly giving active</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>VIP / CSR Champions</span>
            <Sparkles className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{vipCount}</p>
          <span className="text-[11px] text-purple-600 font-medium">Major gifts partners</span>
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
            placeholder="Search donors by name, email, phone, city..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="VIP">VIP</option>
              <option value="Lapsed">Lapsed</option>
            </select>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Causes</option>
            <option value="Education">Education</option>
            <option value="Hunger Relief">Hunger Relief</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Women Empowerment">Women Empowerment</option>
            <option value="Disaster Relief">Disaster Relief</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="donated">Sort: Total Donated</option>
            <option value="recent">Sort: Last Donation</option>
            <option value="name">Sort: Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Donors Table */}
      {filteredDonors.length === 0 ? (
        <EmptyState
          icon={<Users className="w-6 h-6 text-brand-600" />}
          title="No donors found"
          description="Try adjusting your search criteria or add a new donor record."
          actionText="Add New Donor"
          onAction={() => setIsAddDonorOpen(true)}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Donor Name</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Total Donated</th>
                  <th className="py-3 px-4">Gifts</th>
                  <th className="py-3 px-4">Last Given</th>
                  <th className="py-3 px-4">Preferred Cause</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredDonors.map((donor) => (
                  <tr
                    key={donor.id}
                    onClick={() => setActiveDonor(donor)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                      <div className="flex items-center gap-3">
                        {donor.avatar ? (
                          <img
                            src={donor.avatar}
                            alt=""
                            className="w-8 h-8 rounded-full object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="w-8 h-8 rounded-full bg-brand-50 border border-brand-200 text-brand-700 flex items-center justify-center font-bold text-xs">
                            {donor.name.slice(0, 2).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <p className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors flex items-center gap-1.5">
                            {donor.name}
                            <ArrowUpRight className="w-3 h-3 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </p>
                          <span className="text-[11px] text-slate-400 font-normal">
                            {donor.city}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-slate-800 font-medium">{donor.email}</p>
                      <p className="text-slate-400 text-[11px]">{donor.phone}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 text-sm whitespace-nowrap">
                      {formatCurrency(donor.totalDonated)}
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium whitespace-nowrap">
                      {donor.donationCount} {donor.donationCount === 1 ? 'gift' : 'gifts'}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(donor.lastDonationDate)}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                          donor.preferredCategory
                        )}`}
                      >
                        {donor.preferredCategory}
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      {donor.isRecurring ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                          <Repeat className="w-3 h-3" />
                          Recurring
                        </span>
                      ) : (
                        <span className="text-[11px] text-slate-400">One-time</span>
                      )}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                          donor.status
                        )}`}
                      >
                        {donor.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Donor Profile Flyout Drawer */}
      {activeDonor && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setActiveDonor(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200 overflow-y-auto">
              {/* Drawer Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-200 relative">
                <button
                  onClick={() => setActiveDonor(null)}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  {activeDonor.avatar ? (
                    <img
                      src={activeDonor.avatar}
                      alt=""
                      className="w-14 h-14 rounded-2xl object-cover ring-2 ring-brand-500/20"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-xl">
                      {activeDonor.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{activeDonor.name}</h2>
                    <div className="flex items-center gap-2 mt-1">
                      <span
                        className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                          activeDonor.status
                        )}`}
                      >
                        {activeDonor.status}
                      </span>
                      {activeDonor.isRecurring && (
                        <span className="text-[11px] font-semibold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Repeat className="w-2.5 h-2.5" /> Recurring
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Donor Quick Stats */}
                <div className="grid grid-cols-2 gap-3 mt-6">
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                      Lifetime Contributed
                    </span>
                    <p className="text-base font-extrabold text-slate-900 mt-0.5">
                      {formatCurrency(activeDonor.totalDonated)}
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200">
                    <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider">
                      Total Donations
                    </span>
                    <p className="text-base font-extrabold text-slate-900 mt-0.5">
                      {activeDonor.donationCount} Transactions
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Body */}
              <div className="p-6 space-y-6 flex-1">
                {/* Contact & Meta */}
                <div className="space-y-3">
                  <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                    Donor Details
                  </h3>
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{activeDonor.email}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{activeDonor.phone}</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{activeDonor.city}, India</span>
                    </div>
                    <div className="flex items-center gap-2.5 text-slate-700">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Member since {formatDate(activeDonor.joinedDate)}</span>
                    </div>
                  </div>
                </div>

                {/* Internal Relationship Notes */}
                {activeDonor.notes && (
                  <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl space-y-1">
                    <h4 className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">
                      Stewardship Notes
                    </h4>
                    <p className="text-xs text-amber-900/90 leading-relaxed">
                      {activeDonor.notes}
                    </p>
                  </div>
                )}

                {/* Contribution History Ledger */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Donation History ({activeDonorDonations.length})
                    </h3>
                  </div>

                  <div className="space-y-2">
                    {activeDonorDonations.length === 0 ? (
                      <p className="text-xs text-slate-400 py-3 text-center">
                        No transactions recorded for this donor yet.
                      </p>
                    ) : (
                      activeDonorDonations.map((don) => (
                        <div
                          key={don.id}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/50 space-y-1.5"
                        >
                          <div className="flex justify-between items-baseline">
                            <span className="font-bold text-slate-900 text-sm">
                              {formatCurrency(don.amount)}
                            </span>
                            <span className="text-[11px] font-mono text-slate-400">
                              {don.receiptNumber}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 line-clamp-1">
                            {don.campaignTitle}
                          </p>
                          <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100">
                            <span>{don.date}</span>
                            <span className="font-medium text-slate-600">{don.paymentMethod}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Donor Modal */}
      <Modal
        isOpen={isAddDonorOpen}
        onClose={() => setIsAddDonorOpen(false)}
        title="Add New Donor"
        description="Register an individual giver or corporate CSR partner."
      >
        <form onSubmit={handleAddDonorSubmit} className="space-y-4">
          <Input
            label="Full Name / Organization *"
            placeholder="e.g. Ramesh Kulkarni"
            value={newDonor.name}
            onChange={(e) => setNewDonor({ ...newDonor, name: e.target.value })}
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="donor@example.com"
            value={newDonor.email}
            onChange={(e) => setNewDonor({ ...newDonor, email: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Phone Number"
              placeholder="+91 98..."
              value={newDonor.phone}
              onChange={(e) => setNewDonor({ ...newDonor, phone: e.target.value })}
            />
            <Input
              label="City"
              placeholder="Bengaluru"
              value={newDonor.city}
              onChange={(e) => setNewDonor({ ...newDonor, city: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Preferred Cause"
              value={newDonor.preferredCategory}
              onChange={(e) =>
                setNewDonor({
                  ...newDonor,
                  preferredCategory: e.target.value as CampaignCategory,
                })
              }
            >
              <option value="Education">Education</option>
              <option value="Hunger Relief">Hunger Relief</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Women Empowerment">Women Empowerment</option>
              <option value="Disaster Relief">Disaster Relief</option>
            </Select>

            <Select
              label="Status"
              value={newDonor.status}
              onChange={(e) =>
                setNewDonor({ ...newDonor, status: e.target.value as any })
              }
            >
              <option value="Active">Active</option>
              <option value="VIP">VIP</option>
              <option value="Lapsed">Lapsed</option>
            </Select>
          </div>

          <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={newDonor.isRecurring}
              onChange={(e) =>
                setNewDonor({ ...newDonor, isRecurring: e.target.checked })
              }
              className="rounded border-slate-300 text-brand-600 focus:ring-brand-500"
            />
            <span>Recurring monthly donor</span>
          </label>

          <Input
            label="Stewardship Notes"
            placeholder="Add notes on donor preferences..."
            value={newDonor.notes}
            onChange={(e) => setNewDonor({ ...newDonor, notes: e.target.value })}
          />

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button
              variant="ghost"
              type="button"
              onClick={() => setIsAddDonorOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Donor Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
