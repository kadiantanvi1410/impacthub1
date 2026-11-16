import { useState, useMemo } from 'react';
import {
  FolderKanban,
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  X,
  Target,
  ArrowUpRight,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  formatCurrency,
  formatDate,
  getStatusBadgeClass,
  getCategoryBadgeClass,
} from '../../utils/formatters';
import { Project, ProjectStatus, CampaignCategory } from '../../types';

export function Projects() {
  const { projects, teamMembers, service } = useImpactData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  // Detail Drawer state
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  // Add Project Modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    category: 'Education' as CampaignCategory,
    location: 'Bengaluru, Karnataka',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    budget: 1500000,
    beneficiariesCount: 500,
    projectLead: {
      name: teamMembers[0]?.name || 'Ananya Deshmukh',
      avatar: teamMembers[0]?.avatar || '',
      role: 'Project Director',
    },
    status: 'Active' as ProjectStatus,
  });

  // Top Metrics
  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const totalSpent = projects.reduce((sum, p) => sum + p.spent, 0);
  const totalBeneficiaries = projects.reduce((sum, p) => sum + p.beneficiariesCount, 0);
  const activeProjectsCount = projects.filter((p) => p.status === 'Active').length;

  // Filtered
  const filteredProjects = useMemo(() => {
    return projects.filter((p) => {
      const matchesSearch =
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.projectLead.name.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesStatus =
        selectedStatus === 'All' ? true : p.status === selectedStatus;

      const matchesCategory =
        selectedCategory === 'All' ? true : p.category === selectedCategory;

      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [projects, searchQuery, selectedStatus, selectedCategory]);

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.name.trim() || !newProject.budget) {
      alert('Please provide project title and budget amount.');
      return;
    }

    const created = service.addProject(newProject);
    setIsAddOpen(false);
    setActiveProject(created);
    setNewProject({
      name: '',
      description: '',
      category: 'Education',
      location: 'Bengaluru, Karnataka',
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      budget: 1500000,
      beneficiariesCount: 500,
      projectLead: {
        name: teamMembers[0]?.name || 'Ananya Deshmukh',
        avatar: teamMembers[0]?.avatar || '',
        role: 'Project Director',
      },
      status: 'Active',
    });
  };

  const handleToggleMilestone = (milestoneId: string) => {
    if (!activeProject) return;
    const updatedMilestones = activeProject.milestones.map((m) =>
      m.id === milestoneId ? { ...m, completed: !m.completed } : m
    );
    service.updateProject(activeProject.id, { milestones: updatedMilestones });
    setActiveProject({ ...activeProject, milestones: updatedMilestones });
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Programs & Projects Portfolio
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track budgets, milestones, and field execution across long-term community interventions.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => setIsAddOpen(true)}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Project
        </Button>
      </div>

      {/* Top 4 KPI Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Portfolio Budget</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalBudget, true)}
          </p>
          <span className="text-[11px] text-slate-400">Total allocated</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Spent</span>
            <Target className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalSpent, true)}
          </p>
          <span className="text-[11px] text-brand-700 font-medium">
            {Math.round((totalSpent / totalBudget) * 100)}% budget utilized
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Direct Target Reach</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {totalBeneficiaries.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Beneficiaries</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Deployments</span>
            <FolderKanban className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{activeProjectsCount}</p>
          <span className="text-[11px] text-blue-600 font-medium">In the field</span>
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
            placeholder="Search projects by title, location or lead..."
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
              <option value="Planning">Planning</option>
              <option value="On Hold">On Hold</option>
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

      {/* Projects Grid */}
      {filteredProjects.length === 0 ? (
        <EmptyState
          icon={<FolderKanban className="w-6 h-6 text-brand-600" />}
          title="No projects found"
          description="Adjust your search criteria or create a new program."
          actionText="Create Project"
          onAction={() => setIsAddOpen(true)}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredProjects.map((proj) => {
            const utilization = Math.round((proj.spent / proj.budget) * 100);
            const remaining = proj.budget - proj.spent;

            return (
              <Card
                key={proj.id}
                hover
                onClick={() => setActiveProject(proj)}
                className="cursor-pointer group flex flex-col justify-between"
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                            proj.category
                          )}`}
                        >
                          {proj.category}
                        </span>
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                            proj.status
                          )}`}
                        >
                          {proj.status}
                        </span>
                      </div>
                      <CardTitle className="group-hover:text-brand-700 transition-colors flex items-center gap-1.5">
                        {proj.name}
                        <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </CardTitle>
                    </div>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </CardHeader>

                <CardContent className="space-y-4 pt-0">
                  {/* Budget Utilization Gauge */}
                  <div className="space-y-1.5 p-3.5 bg-slate-50 rounded-xl border border-slate-200/80">
                    <div className="flex justify-between items-baseline text-xs">
                      <span className="font-semibold text-slate-700">
                        Disbursed: {formatCurrency(proj.spent)}
                      </span>
                      <span className="text-slate-500 text-[11px]">
                        Budget: {formatCurrency(proj.budget, true)}
                      </span>
                    </div>
                    <ProgressBar value={utilization} size="sm" variant="teal" />
                    <div className="flex justify-between text-[11px] text-slate-500 pt-0.5">
                      <span>{utilization}% spent</span>
                      <span className="font-medium text-emerald-700">
                        {formatCurrency(remaining, true)} remaining
                      </span>
                    </div>
                  </div>

                  {/* Metadata Row */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-slate-600 pt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{proj.location}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span>{proj.beneficiariesCount} Target Aid</span>
                    </div>
                  </div>

                  {/* Project Lead */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <img
                        src={proj.projectLead.avatar}
                        alt=""
                        className="w-6 h-6 rounded-full object-cover ring-1 ring-slate-200"
                      />
                      <span className="text-xs font-semibold text-slate-800">
                        {proj.projectLead.name}
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {proj.milestones.filter((m) => m.completed).length} /{' '}
                      {proj.milestones.length} Milestones
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Project Detail Drawer */}
      {activeProject && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity animate-in fade-in"
            onClick={() => setActiveProject(null)}
          />

          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xl bg-white shadow-2xl flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200 overflow-y-auto">
              {/* Header */}
              <div className="p-6 bg-slate-50 border-b border-slate-200 relative">
                <button
                  onClick={() => setActiveProject(null)}
                  className="absolute top-4 right-4 p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="flex items-center gap-2 mb-2">
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                      activeProject.category
                    )}`}
                  >
                    {activeProject.category}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                      activeProject.status
                    )}`}
                  >
                    {activeProject.status}
                  </span>
                </div>

                <h2 className="text-xl font-bold text-slate-900">{activeProject.name}</h2>
                <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                  {activeProject.description}
                </p>

                <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-slate-200 text-xs">
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">
                      Budget
                    </span>
                    <p className="font-bold text-slate-900 mt-0.5">
                      {formatCurrency(activeProject.budget, true)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">
                      Spent
                    </span>
                    <p className="font-bold text-brand-700 mt-0.5">
                      {formatCurrency(activeProject.spent, true)}
                    </p>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[10px] font-semibold uppercase">
                      Remaining
                    </span>
                    <p className="font-bold text-emerald-700 mt-0.5">
                      {formatCurrency(activeProject.budget - activeProject.spent, true)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Drawer Content */}
              <div className="p-6 space-y-6 flex-1 text-xs">
                {/* Timeline & Location */}
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                  <div className="flex items-center justify-between text-slate-700">
                    <span className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      <span>{activeProject.location}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-500">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      <span>
                        {formatDate(activeProject.startDate)} -{' '}
                        {formatDate(activeProject.endDate)}
                      </span>
                    </span>
                  </div>
                </div>

                {/* Milestones Checklist (Interactive Toggle!) */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="font-bold text-slate-900 uppercase tracking-wider">
                      Key Deliverables & Milestones
                    </h3>
                    <span className="text-[11px] text-slate-400">Click checkmark to toggle</span>
                  </div>

                  <div className="space-y-2.5">
                    {activeProject.milestones.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleToggleMilestone(m.id)}
                        className={`p-3 rounded-xl border transition-colors cursor-pointer flex items-start gap-3 ${
                          m.completed
                            ? 'bg-emerald-50/60 border-emerald-200 text-slate-800'
                            : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-md flex items-center justify-center shrink-0 mt-0.5 ${
                            m.completed
                              ? 'bg-emerald-600 text-white'
                              : 'border border-slate-300 bg-white'
                          }`}
                        >
                          {m.completed && <CheckCircle2 className="w-3.5 h-3.5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <p
                              className={`font-semibold ${
                                m.completed ? 'line-through text-slate-500' : 'text-slate-900'
                              }`}
                            >
                              {m.title}
                            </p>
                            <span className="text-[10px] text-slate-400 shrink-0">
                              Due {formatDate(m.dueDate)}
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                            {m.description}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Team Lead Card */}
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={activeProject.projectLead.avatar}
                      alt=""
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-brand-500/20"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900">
                        {activeProject.projectLead.name}
                      </h4>
                      <p className="text-[11px] text-slate-500">
                        {activeProject.projectLead.role}
                      </p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[11px] font-medium bg-brand-50 text-brand-700 border border-brand-200">
                    Lead Officer
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Project Modal */}
      <Modal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        title="Create Field Program / Project"
        description="Initiate a budgeted intervention with target beneficiaries and milestones."
      >
        <form onSubmit={handleAddSubmit} className="space-y-4">
          <Input
            label="Project Title *"
            placeholder="e.g. Project Vidya: Digital Classrooms"
            value={newProject.name}
            onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
          />

          <Textarea
            label="Program Description"
            rows={2}
            placeholder="Intervention summary and goals..."
            value={newProject.description}
            onChange={(e) =>
              setNewProject({ ...newProject, description: e.target.value })
            }
          />

          <div className="grid grid-cols-2 gap-3">
            <Select
              label="Category"
              value={newProject.category}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  category: e.target.value as CampaignCategory,
                })
              }
            >
              <option value="Education">Education</option>
              <option value="Hunger Relief">Hunger Relief</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Women Empowerment">Women Empowerment</option>
              <option value="Disaster Relief">Disaster Relief</option>
            </Select>

            <Input
              label="Target Beneficiaries"
              type="number"
              value={newProject.beneficiariesCount}
              onChange={(e) =>
                setNewProject({
                  ...newProject,
                  beneficiariesCount: Number(e.target.value),
                })
              }
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Budget (INR ₹) *"
              type="number"
              value={newProject.budget}
              onChange={(e) =>
                setNewProject({ ...newProject, budget: Number(e.target.value) })
              }
            />
            <Input
              label="Location"
              value={newProject.location}
              onChange={(e) => setNewProject({ ...newProject, location: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Start Date"
              type="date"
              value={newProject.startDate}
              onChange={(e) =>
                setNewProject({ ...newProject, startDate: e.target.value })
              }
            />
            <Input
              label="End Date"
              type="date"
              value={newProject.endDate}
              onChange={(e) => setNewProject({ ...newProject, endDate: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Launch Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
