import { useState, useMemo } from 'react';
import {
  UserCheck,
  UserPlus,
  Search,
  Filter,
  Shield,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Calendar,
  MapPin,
  FileText,
  X,
  CheckCircle2,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  formatDate,
  getStatusBadgeClass,
  getCategoryBadgeClass,
} from '../../utils/formatters';
import { Beneficiary, BeneficiaryCaseStatus, CampaignCategory } from '../../types';

export function Beneficiaries() {
  const { beneficiaries, projects, service } = useImpactData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [privacyMaskEnabled, setPrivacyMaskEnabled] = useState(false);

  // Drawer / Case state
  const [activeBeneficiary, setActiveBeneficiary] = useState<Beneficiary | null>(null);

  // Add Beneficiary Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newBen, setNewBen] = useState({
    name: '',
    age: 24,
    gender: 'Female' as const,
    location: '',
    category: 'Education' as CampaignCategory,
    programId: 'proj-1',
    programName: 'Project Vidya: Digital Classrooms & STEM',
    assistanceReceived: '',
    caseStatus: 'Active' as BeneficiaryCaseStatus,
    nextFollowUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0],
    notes: '',
    isSensitive: true,
  });

  // Metrics
  const totalBeneficiaries = beneficiaries.length;
  const activeCases = beneficiaries.filter((b) => b.caseStatus === 'Active').length;
  const completedCases = beneficiaries.filter((b) => b.caseStatus === 'Completed').length;
  const followUpDue = beneficiaries.filter(
    (b) => b.caseStatus === 'Follow-up Required'
  ).length;

  // Filtered list
  const filteredBeneficiaries = useMemo(() => {
    return beneficiaries.filter((b) => {
      const matchesSearch =
        b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.programName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'All' ? true : b.caseStatus === selectedStatus;

      const matchesCategory =
        selectedCategory === 'All' ? true : b.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [beneficiaries, searchQuery, selectedStatus, selectedCategory]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBen.name.trim() || !newBen.assistanceReceived.trim()) {
      alert('Please fill out the beneficiary name and assistance details.');
      return;
    }

    const selectedProj = projects.find((p) => p.id === newBen.programId);
    const created = service.addBeneficiary({
      ...newBen,
      programName: selectedProj ? selectedProj.name : newBen.programName,
    });

    setIsAddOpen(false);
    setActiveBeneficiary(created);
    setNewBen({
      name: '',
      age: 24,
      gender: 'Female',
      location: '',
      category: 'Education',
      programId: 'proj-1',
      programName: 'Project Vidya: Digital Classrooms & STEM',
      assistanceReceived: '',
      caseStatus: 'Active',
      nextFollowUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0],
      notes: '',
      isSensitive: true,
    });
  };

  const handleStatusChange = (status: BeneficiaryCaseStatus) => {
    if (!activeBeneficiary) return;
    service.updateBeneficiary(activeBeneficiary.id, { caseStatus: status });
    setActiveBeneficiary({ ...activeBeneficiary, caseStatus: status });
  };

  // Mask name for privacy protection if requested or sensitive
  const renderDisplayName = (ben: Beneficiary) => {
    if (privacyMaskEnabled && ben.isSensitive) {
      const parts = ben.name.split(' ');
      return parts[0] + ' ' + (parts[1] ? parts[1][0] + '***' : '***');
    }
    return ben.name;
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Beneficiary Case Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track individual and community assistance delivery with strict privacy controls.
          </p>
        </div>
        <div className="flex items-center gap-2.5">
          {/* Privacy Toggle */}
          <button
            onClick={() => setPrivacyMaskEnabled(!privacyMaskEnabled)}
            className={`flex items-center gap-1.5 px-3 py-2 text-xs font-semibold rounded-lg border transition-all ${
              privacyMaskEnabled
                ? 'bg-amber-50 text-amber-900 border-amber-300'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
            title="Toggle privacy masking for sensitive beneficiary names"
          >
            {privacyMaskEnabled ? (
              <>
                <EyeOff className="w-3.5 h-3.5 text-amber-700" />
                <span>Privacy Mask ON</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5 text-slate-500" />
                <span>Mask PII</span>
              </>
            )}
          </button>

          <Button
            variant="primary"
            size="md"
            onClick={() => setIsAddOpen(true)}
            leftIcon={<UserPlus className="w-4 h-4" />}
          >
            Register Beneficiary
          </Button>
        </div>
      </div>

      {/* Privacy Notice Banner (PRD Mandatory) */}
      <div className="p-3.5 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 flex items-start gap-3 text-xs">
        <Shield className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
        <div className="leading-relaxed">
          <strong className="text-white font-semibold">Strict Data Privacy Guardrail:</strong>{' '}
          Sensitive beneficiary records are encrypted and strictly shielded from public fundraising pages. Full addresses and medical records remain restricted to authorized Hope Foundation case workers only.
        </div>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Direct Case Registry</span>
            <UserCheck className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{totalBeneficiaries}</p>
          <span className="text-[11px] text-slate-400">Tracked in this cluster</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Cases</span>
            <Clock className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{activeCases}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Ongoing assistance</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Completed Assistance</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{completedCases}</p>
          <span className="text-[11px] text-blue-600 font-medium">Successfully graduated</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Follow-ups Required</span>
            <AlertCircle className="w-4 h-4 text-orange-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{followUpDue}</p>
          <span className="text-[11px] text-orange-600 font-medium">Review due this month</span>
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
            placeholder="Search by name, location, or program..."
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
              <option value="Pending">Pending</option>
              <option value="Follow-up Required">Follow-up Required</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Education">Education</option>
            <option value="Hunger Relief">Hunger Relief</option>
            <option value="Healthcare">Healthcare</option>
            <option value="Women Empowerment">Women Empowerment</option>
          </select>
        </div>
      </div>

      {/* Beneficiaries Table */}
      {filteredBeneficiaries.length === 0 ? (
        <EmptyState
          icon={<UserCheck className="w-6 h-6 text-brand-600" />}
          title="No beneficiaries found"
          description="Adjust your search filters or register a new community beneficiary."
          actionText="Register Beneficiary"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Beneficiary</th>
                  <th className="py-3 px-4">Demographics</th>
                  <th className="py-3 px-4">Program / Project</th>
                  <th className="py-3 px-4">Assistance Delivered</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4">Last Follow-up</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Case Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredBeneficiaries.map((ben) => (
                  <tr
                    key={ben.id}
                    onClick={() => setActiveBeneficiary(ben)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                          {renderDisplayName(ben)}
                        </span>
                        {ben.isSensitive && (
                          <span
                            className="p-1 rounded text-slate-400"
                            title="Sensitive record protected under privacy policy"
                          >
                            <Shield className="w-3 h-3 text-amber-500" />
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {ben.age} yrs • {ben.gender}
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-medium text-slate-800 line-clamp-1">
                        {ben.programName}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border inline-block mt-0.5 ${getCategoryBadgeClass(
                          ben.category
                        )}`}
                      >
                        {ben.category}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                      {ben.assistanceReceived}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {ben.location.split(',')[0]}
                    </td>
                    <td className="py-3.5 px-4 text-slate-500 whitespace-nowrap">
                      {formatDate(ben.lastFollowUpDate)}
                    </td>
                    <td className="py-3.5 px-4 sm:px-6 text-right">
                      <span
                        className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                          ben.caseStatus
                        )}`}
                      >
                        {ben.caseStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* Beneficiary Profile Drawer */}
      {activeBeneficiary && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setActiveBeneficiary(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-lg bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200 overflow-y-auto">
              {/* Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-200 relative">
                <button
                  onClick={() => setActiveBeneficiary(null)}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-800 flex items-center justify-center font-bold text-lg">
                    {activeBeneficiary.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">
                      {renderDisplayName(activeBeneficiary)}
                    </h2>
                    <p className="text-xs text-slate-500">
                      {activeBeneficiary.age} years • {activeBeneficiary.gender} • ID: {activeBeneficiary.id}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                      activeBeneficiary.caseStatus
                    )}`}
                  >
                    Case: {activeBeneficiary.caseStatus}
                  </span>
                  <span className="text-xs text-slate-400">
                    Registered: {formatDate(activeBeneficiary.registrationDate)}
                  </span>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 flex-1 text-xs">
                {/* Status Switcher Actions */}
                <div className="p-3 bg-white border border-slate-200 rounded-xl space-y-2">
                  <span className="font-bold text-slate-700 uppercase tracking-wider block">
                    Update Case Status
                  </span>
                  <div className="grid grid-cols-2 gap-2">
                    {(['Active', 'Follow-up Required', 'Completed', 'Pending'] as const).map(
                      (st) => (
                        <button
                          key={st}
                          onClick={() => handleStatusChange(st)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors ${
                            activeBeneficiary.caseStatus === st
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          {st}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {/* Assistance Details */}
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                    Program & Support Provided
                  </h3>
                  <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <p className="font-semibold text-slate-900 text-sm">
                      {activeBeneficiary.programName}
                    </p>
                    <p className="text-slate-700 leading-relaxed">
                      {activeBeneficiary.assistanceReceived}
                    </p>
                  </div>
                </div>

                {/* Location & Dates */}
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                    Field Location & Dates
                  </h3>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                    <div className="flex items-center gap-2 text-slate-700">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>{activeBeneficiary.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-slate-700">
                      <Calendar className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Last Follow-up: {formatDate(activeBeneficiary.lastFollowUpDate)}</span>
                    </div>
                    {activeBeneficiary.nextFollowUpDate && (
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock className="w-4 h-4 text-amber-500 shrink-0" />
                        <span>Next Due: {formatDate(activeBeneficiary.nextFollowUpDate)}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Case Worker Notes */}
                {activeBeneficiary.notes && (
                  <div className="space-y-2">
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                      Case Worker Field Notes
                    </h3>
                    <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-900 leading-relaxed">
                      {activeBeneficiary.notes}
                    </div>
                  </div>
                )}

                {/* Verified Documents */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2 text-slate-700">
                    <FileText className="w-4 h-4 text-brand-600" />
                    <span>
                      {activeBeneficiary.documentsCount} Audited Field Documents (Consent, Aadhaar, Photos)
                    </span>
                  </div>
                  <span className="text-emerald-700 font-semibold">Verified</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Beneficiary Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Register Beneficiary Record"
        description="Add an individual receiving direct educational, food, or medical assistance."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Sangeetha Devi"
            value={newBen.name}
            onChange={(e) => setNewBen({ ...newBen, name: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Age"
              type="number"
              value={newBen.age}
              onChange={(e) => setNewBen({ ...newBen, age: Number(e.target.value) })}
            />
            <Select
              label="Gender"
              value={newBen.gender}
              onChange={(e) => setNewBen({ ...newBen, gender: e.target.value as any })}
            >
              <option value="Female">Female</option>
              <option value="Male">Male</option>
              <option value="Other">Other</option>
            </Select>
          </div>

          <Input
            label="Settlement / Community Location *"
            placeholder="e.g. KR Puram Railway Colony, Bengaluru"
            value={newBen.location}
            onChange={(e) => setNewBen({ ...newBen, location: e.target.value })}
          />

          <Select
            label="Assigned Program *"
            value={newBen.programId}
            onChange={(e) => setNewBen({ ...newBen, programId: e.target.value })}
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>

          <Textarea
            label="Assistance Received & Deliverables *"
            rows={2}
            placeholder="e.g. Annual uniform set, STEM textbook kit, and daily tutoring enrollment."
            value={newBen.assistanceReceived}
            onChange={(e) =>
              setNewBen({ ...newBen, assistanceReceived: e.target.value })
            }
          />

          <Textarea
            label="Case Notes"
            rows={2}
            placeholder="Family context, socio-economic observations, medical notes..."
            value={newBen.notes}
            onChange={(e) => setNewBen({ ...newBen, notes: e.target.value })}
          />

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Beneficiary Record
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
