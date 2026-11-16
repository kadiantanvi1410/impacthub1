import { useState } from 'react';
import {
  Building2,
  Users,
  Shield,
  Bell,
  Sliders,
  CheckCircle2,
  Mail,
  UserPlus,
  RefreshCw,
  Lock,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { Input, Textarea } from '../../components/ui/Input';
import { Select } from '../../components/ui/Select';
import { Modal } from '../../components/ui/Modal';
import { UserRole } from '../../types';

export function Settings() {
  const { organization, teamMembers, service } = useImpactData();

  const [activeTab, setActiveTab] = useState<'org' | 'team' | 'roles' | 'preferences'>('org');

  // Org form state
  const [orgForm, setOrgForm] = useState({
    name: organization.name,
    tagline: organization.tagline,
    registrationNumber: organization.registrationNumber,
    email: organization.email,
    phone: organization.phone,
    website: organization.website,
    taxExemptStatus: organization.taxExemptStatus,
    street: organization.address.street,
    city: organization.address.city,
    state: organization.address.state,
    description: organization.description,
  });
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Invite modal state
  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Program Manager');

  const handleSaveOrg = (e: React.FormEvent) => {
    e.preventDefault();
    service.updateOrganization({
      name: orgForm.name,
      tagline: orgForm.tagline,
      registrationNumber: orgForm.registrationNumber,
      email: orgForm.email,
      phone: orgForm.phone,
      website: orgForm.website,
      taxExemptStatus: orgForm.taxExemptStatus,
      description: orgForm.description,
      address: {
        street: orgForm.street,
        city: orgForm.city,
        state: orgForm.state,
        postalCode: organization.address.postalCode,
        country: organization.address.country,
      },
    });

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const handleInviteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteName.trim() || !inviteEmail.trim()) {
      alert('Please enter member name and email.');
      return;
    }
    service.inviteTeamMember({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
    });
    setIsInviteOpen(false);
    setInviteName('');
    setInviteEmail('');
    alert(`Invitation sent to ${inviteEmail} with role: ${inviteRole}`);
  };

  const roleMatrix = [
    { module: 'Executive Dashboard', Admin: 'Full', Finance: 'View', Fundraising: 'Full', Program: 'Full', Volunteer: 'View', Viewer: 'View' },
    { module: 'Fundraising Appeals', Admin: 'Full', Finance: 'View', Fundraising: 'Full', Program: 'Create', Volunteer: 'View', Viewer: 'View' },
    { module: 'Donations & Donors', Admin: 'Full', Finance: 'Full', Fundraising: 'Full', Program: 'View', Volunteer: 'None', Viewer: 'View' },
    { module: 'Beneficiary Records', Admin: 'Full', Finance: 'None', Fundraising: 'Masked', Program: 'Full', Volunteer: 'Field Only', Viewer: 'Masked' },
    { module: 'Financial Disbursements', Admin: 'Full', Finance: 'Full', Fundraising: 'View', Program: 'View', Volunteer: 'None', Viewer: 'None' },
    { module: 'Volunteer Management', Admin: 'Full', Finance: 'None', Fundraising: 'View', Program: 'Manage', Volunteer: 'Full', Viewer: 'View' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200 max-w-5xl mx-auto pb-16">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          Settings & Workspace Administration
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Manage NGO identity, team access controls, audit compliance, and system preferences.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        {[
          { id: 'org', label: 'Organization Profile', icon: Building2 },
          { id: 'team', label: 'Team Members', icon: Users },
          { id: 'roles', label: 'Roles & Permissions', icon: Shield },
          { id: 'preferences', label: 'Demo & System Controls', icon: Sliders },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors ${
                activeTab === tab.id
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: ORGANIZATION PROFILE */}
      {activeTab === 'org' && (
        <Card className="p-6 sm:p-8">
          <form onSubmit={handleSaveOrg} className="space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Official Non-Profit Entity</h2>
                <p className="text-xs text-slate-500">
                  This information appears on public fundraising pages and 80G tax receipts.
                </p>
              </div>
              {savedSuccess && (
                <div className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Changes Saved Successfully!</span>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Organization Name *"
                value={orgForm.name}
                onChange={(e) => setOrgForm({ ...orgForm, name: e.target.value })}
              />
              <Input
                label="Tagline / Motto"
                value={orgForm.tagline}
                onChange={(e) => setOrgForm({ ...orgForm, tagline: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="Government Registration No. *"
                value={orgForm.registrationNumber}
                onChange={(e) =>
                  setOrgForm({ ...orgForm, registrationNumber: e.target.value })
                }
              />
              <Input
                label="Tax Exemption Certification (80G / 12A) *"
                value={orgForm.taxExemptStatus}
                onChange={(e) =>
                  setOrgForm({ ...orgForm, taxExemptStatus: e.target.value })
                }
              />
            </div>

            <Textarea
              label="Mission Statement & Description *"
              rows={3}
              value={orgForm.description}
              onChange={(e) => setOrgForm({ ...orgForm, description: e.target.value })}
            />

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Official Email *"
                type="email"
                value={orgForm.email}
                onChange={(e) => setOrgForm({ ...orgForm, email: e.target.value })}
              />
              <Input
                label="Phone Number"
                value={orgForm.phone}
                onChange={(e) => setOrgForm({ ...orgForm, phone: e.target.value })}
              />
              <Input
                label="Website URL"
                value={orgForm.website}
                onChange={(e) => setOrgForm({ ...orgForm, website: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <Input
                label="Registered Street Address"
                value={orgForm.street}
                onChange={(e) => setOrgForm({ ...orgForm, street: e.target.value })}
              />
              <Input
                label="City"
                value={orgForm.city}
                onChange={(e) => setOrgForm({ ...orgForm, city: e.target.value })}
              />
              <Input
                label="State"
                value={orgForm.state}
                onChange={(e) => setOrgForm({ ...orgForm, state: e.target.value })}
              />
            </div>

            <div className="pt-4 border-t border-slate-100 flex justify-end">
              <Button variant="primary" type="submit" size="md">
                Save Organization Profile
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 2: TEAM MEMBERS */}
      {activeTab === 'team' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <h2 className="text-lg font-bold text-slate-900">Workspace Staff & Officers</h2>
              <p className="text-xs text-slate-500">
                Grant team members access to specific operational modules based on role.
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsInviteOpen(true)}
              leftIcon={<UserPlus className="w-4 h-4" />}
            >
              Invite Member
            </Button>
          </div>

          <div className="divide-y divide-slate-100">
            {teamMembers.map((member) => (
              <div key={member.id} className="py-4 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <img
                    src={member.avatar}
                    alt=""
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-slate-100"
                  />
                  <div>
                    <p className="text-sm font-bold text-slate-900">{member.name}</p>
                    <p className="text-xs text-slate-500">{member.email}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-brand-50 text-brand-800 border border-brand-200">
                    {member.role}
                  </span>
                  <span className="text-[11px] text-slate-400 hidden sm:inline">
                    {member.lastActive}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 3: ROLES & PERMISSIONS */}
      {activeTab === 'roles' && (
        <Card className="overflow-hidden">
          <CardHeader>
            <CardTitle>Role-Based Access Control (RBAC) Matrix</CardTitle>
            <p className="text-xs text-slate-500">
              Configured authorization tiers ensuring financial and beneficiary privacy safeguards.
            </p>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-y border-slate-200 text-slate-600 font-semibold uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4 sm:px-6">Functional Module</th>
                    <th className="py-3 px-4">Admin</th>
                    <th className="py-3 px-4">Finance</th>
                    <th className="py-3 px-4">Fundraising</th>
                    <th className="py-3 px-4">Program</th>
                    <th className="py-3 px-4">Volunteer</th>
                    <th className="py-3 px-4 sm:px-6">Viewer</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {roleMatrix.map((row) => (
                    <tr key={row.module} className="hover:bg-slate-50">
                      <td className="py-3 px-4 sm:px-6 font-bold text-slate-900">
                        {row.module}
                      </td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">{row.Admin}</td>
                      <td className="py-3 px-4 text-slate-700">{row.Finance}</td>
                      <td className="py-3 px-4 text-slate-700">{row.Fundraising}</td>
                      <td className="py-3 px-4 text-slate-700">{row.Program}</td>
                      <td className="py-3 px-4 text-slate-500">{row.Volunteer}</td>
                      <td className="py-3 px-4 sm:px-6 text-slate-400">{row.Viewer}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}

      {/* TAB 4: DEMO CONTROLS */}
      {activeTab === 'preferences' && (
        <Card className="p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Demo Environment & Storage Reset</h2>
            <p className="text-xs text-slate-500">
              ImpactHub stores interactive changes (donations, campaigns, beneficiaries) in your local session.
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="text-sm font-bold text-slate-900">Reset to Hope Foundation Seed Dataset</h4>
              <p className="text-xs text-slate-500 mt-0.5">
                Restores the verified baseline (₹12.8L raised, 6 campaigns, 11 donors, 4 field programs).
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (confirm('Reset all demo records back to initial Hope Foundation seed state?')) {
                  service.resetToDefaults();
                  alert('Demo database reset to default seed records!');
                }
              }}
              leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
            >
              Reset Mock Data
            </Button>
          </div>
        </Card>
      )}

      {/* Invite Member Modal */}
      <Modal
        isOpen={isInviteOpen}
        onClose={() => setIsInviteOpen(false)}
        title="Invite Organization Team Member"
        description="Send an invitation link with specified permission privileges."
      >
        <form onSubmit={handleInviteSubmit} className="space-y-4">
          <Input
            label="Full Name *"
            placeholder="e.g. Sonal Verma"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />

          <Input
            label="Email Address *"
            type="email"
            placeholder="member@hopefoundation.org"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />

          <Select
            label="Role & Privilege Level *"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value as UserRole)}
          >
            <option value="Admin">Admin (Full Control)</option>
            <option value="Finance Manager">Finance Manager (Ledgers & Approvals)</option>
            <option value="Fundraising Manager">Fundraising Manager (Appeals & CRM)</option>
            <option value="Program Manager">Program Manager (Field & Beneficiaries)</option>
            <option value="Volunteer Manager">Volunteer Manager</option>
            <option value="Viewer">Viewer (Read-only)</option>
          </Select>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-2">
            <Button variant="ghost" type="button" onClick={() => setIsInviteOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Send Workspace Invite
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
