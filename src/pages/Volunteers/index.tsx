import { useState, useMemo } from 'react';
import {
  UserPlus,
  Search,
  Filter,
  Clock,
  Briefcase,
  Star,
  Mail,
  Phone,
  Calendar,
  X,
  Award,
  ArrowUpRight,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { EmptyState } from '../../components/ui/EmptyState';
import { formatDate, getStatusBadgeClass } from '../../utils/formatters';
import { Volunteer, VolunteerStatus } from '../../types';

export function Volunteers() {
  const { volunteers, projects, service } = useImpactData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [activeVolunteer, setActiveVolunteer] = useState<Volunteer | null>(null);

  // Add Volunteer Modal
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newVol, setNewVol] = useState({
    name: '',
    role: 'Field Education Mentor',
    email: '',
    phone: '',
    skillsString: 'Teaching, Content Writing',
    assignedProjectId: 'proj-1',
    status: 'Active' as VolunteerStatus,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  });

  // Top Metrics
  const totalVolunteers = volunteers.length;
  const activeCount = volunteers.filter((v) => v.status === 'Active').length;
  const totalHours = volunteers.reduce((sum, v) => sum + v.hoursContributed, 0);

  // Filtered
  const filteredVolunteers = useMemo(() => {
    return volunteers.filter((v) => {
      const matchesSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesStatus =
        selectedStatus === 'All' ? true : v.status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [volunteers, searchQuery, selectedStatus]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVol.name.trim() || !newVol.email.trim()) {
      alert('Please provide volunteer name and email.');
      return;
    }

    const selectedProj = projects.find((p) => p.id === newVol.assignedProjectId);

    const created = service.addVolunteer({
      name: newVol.name,
      role: newVol.role,
      email: newVol.email,
      phone: newVol.phone || '+91 98000 00000',
      avatar: newVol.avatar,
      skills: newVol.skillsString.split(',').map((s) => s.trim()),
      assignedProjectId: newVol.assignedProjectId,
      assignedProjectName: selectedProj?.name,
      status: newVol.status,
    });

    setIsAddOpen(false);
    setActiveVolunteer(created);
    setNewVol({
      name: '',
      role: 'Field Education Mentor',
      email: '',
      phone: '',
      skillsString: 'Teaching, Content Writing',
      assignedProjectId: 'proj-1',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Volunteers & Field Team
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Empower grassroot mentors, doctors, logistics leads, and community ambassadors.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        >
          Add Volunteer
        </Button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Volunteers</span>
            <Award className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{totalVolunteers}</p>
          <span className="text-[11px] text-slate-400">Registered mentors & staff</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active in Field</span>
            <Briefcase className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{activeCount}</p>
          <span className="text-[11px] text-emerald-600 font-medium">Currently deployed</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Hours Contributed</span>
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{totalHours} hrs</p>
          <span className="text-[11px] text-blue-600 font-medium">Verified service hours</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Average Satisfaction</span>
            <Star className="w-4 h-4 text-amber-500 fill-current" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">4.9 / 5.0</p>
          <span className="text-[11px] text-amber-600 font-medium">Community feedback</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search volunteers by name, skill, or role..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none cursor-pointer"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
            <option value="On Leave">On Leave</option>
          </select>
        </div>
      </div>

      {/* Volunteer Cards Grid */}
      {filteredVolunteers.length === 0 ? (
        <EmptyState
          icon={<Award className="w-6 h-6 text-brand-600" />}
          title="No volunteers found"
          description="Try adjusting your search criteria or register a new field volunteer."
          actionText="Add Volunteer"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVolunteers.map((vol) => (
            <Card
              key={vol.id}
              hover
              onClick={() => setActiveVolunteer(vol)}
              className="cursor-pointer group flex flex-col justify-between"
            >
              <CardContent className="pt-6 space-y-4">
                <div className="flex items-start gap-3.5">
                  <img
                    src={vol.avatar}
                    alt=""
                    className="w-12 h-12 rounded-2xl object-cover ring-2 ring-slate-100 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors truncate">
                        {vol.name}
                      </h3>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                          vol.status
                        )}`}
                      >
                        {vol.status}
                      </span>
                    </div>
                    <p className="text-xs text-brand-700 font-medium truncate mt-0.5">
                      {vol.role}
                    </p>
                  </div>
                </div>

                {/* Project Assignment */}
                <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1 text-xs">
                  <span className="text-[10px] uppercase font-semibold text-slate-400">
                    Assigned Project
                  </span>
                  <p className="font-medium text-slate-800 truncate">
                    {vol.assignedProjectName || 'General Operations'}
                  </p>
                </div>

                {/* Skills tags */}
                <div className="flex flex-wrap gap-1.5">
                  {vol.skills.map((skill) => (
                    <span
                      key={skill}
                      className="text-[11px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md"
                    >
                      {skill}
                    </span>
                  ))}
                </div>

                {/* Hours & Joined */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1 font-semibold text-slate-900">
                    <Clock className="w-3.5 h-3.5 text-brand-600" />
                    {vol.hoursContributed} Hours
                  </span>
                  <span>Joined {formatDate(vol.joinedDate)}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Volunteer Profile Drawer */}
      {activeVolunteer && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setActiveVolunteer(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200 overflow-y-auto">
              <div className="p-6 bg-slate-50 border-b border-slate-200 relative">
                <button
                  onClick={() => setActiveVolunteer(null)}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-4">
                  <img
                    src={activeVolunteer.avatar}
                    alt=""
                    className="w-16 h-16 rounded-2xl object-cover ring-2 ring-brand-500/20"
                  />
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">{activeVolunteer.name}</h2>
                    <p className="text-xs text-brand-700 font-semibold">{activeVolunteer.role}</p>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border inline-block mt-1.5 ${getStatusBadgeClass(
                        activeVolunteer.status
                      )}`}
                    >
                      {activeVolunteer.status}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mt-5">
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Service Hours
                    </span>
                    <p className="text-lg font-bold text-slate-900 mt-0.5">
                      {activeVolunteer.hoursContributed} hrs
                    </p>
                  </div>
                  <div className="bg-white p-3 rounded-xl border border-slate-200 text-center">
                    <span className="text-[10px] uppercase font-semibold text-slate-400">
                      Impact Rating
                    </span>
                    <p className="text-lg font-bold text-amber-600 mt-0.5">
                      {activeVolunteer.rating || 5.0} ★
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 flex-1 text-xs">
                <div className="space-y-3">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                    Contact Information
                  </h3>
                  <div className="space-y-2 text-slate-700">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <span>{activeVolunteer.email}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-slate-400" />
                      <span>{activeVolunteer.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>Joined {formatDate(activeVolunteer.joinedDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                    Skills & Domains
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {activeVolunteer.skills.map((s) => (
                      <span
                        key={s}
                        className="bg-slate-100 text-slate-800 font-medium px-2.5 py-1 rounded-lg"
                      >
                        {s}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                    Assigned Field Project
                  </h3>
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <p className="font-semibold text-slate-900">
                      {activeVolunteer.assignedProjectName || 'General Operations'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Direct supervision under Hope Foundation program managers.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Volunteer Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Add Volunteer Record"
        description="Onboard a field mentor or community contributor."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Tanvi Mathur"
            value={newVol.name}
            onChange={(e) => setNewVol({ ...newVol, name: e.target.value })}
          />

          <Input
            label="Role / Designation *"
            placeholder="e.g. STEM Education Mentor"
            value={newVol.role}
            onChange={(e) => setNewVol({ ...newVol, role: e.target.value })}
          />

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Email *"
              type="email"
              placeholder="vol@example.com"
              value={newVol.email}
              onChange={(e) => setNewVol({ ...newVol, email: e.target.value })}
            />
            <Input
              label="Phone"
              placeholder="+91 98..."
              value={newVol.phone}
              onChange={(e) => setNewVol({ ...newVol, phone: e.target.value })}
            />
          </div>

          <Input
            label="Skills (Comma-separated)"
            placeholder="Mathematics, Photography, Translation"
            value={newVol.skillsString}
            onChange={(e) => setNewVol({ ...newVol, skillsString: e.target.value })}
          />

          <Select
            label="Assign to Project"
            value={newVol.assignedProjectId}
            onChange={(e) =>
              setNewVol({ ...newVol, assignedProjectId: e.target.value })
            }
          >
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </Select>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Volunteer
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
