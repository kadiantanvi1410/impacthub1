import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ExternalLink,
  Calendar,
  MapPin,
  Clock,
  HeartHandshake,
  DollarSign,
  Plus,
  Share2,
  CheckCircle2,
  Users,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '../../components/ui/Card';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { Modal } from '../../components/ui/Modal';
import { Input, Textarea } from '../../components/ui/Input';
import {
  formatCurrency,
  getDaysRemaining,
  getCategoryBadgeClass,
  getStatusBadgeClass,
} from '../../utils/formatters';

export function CampaignDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { service } = useImpactData();

  const campaign = service.getCampaignById(id || '');
  const donations = service.getDonationsByCampaign(id || '');

  // Add update modal
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [updateTitle, setUpdateTitle] = useState('');
  const [updateContent, setUpdateContent] = useState('');
  const [copyFeedback, setCopyFeedback] = useState(false);

  if (!campaign) {
    return (
      <div className="text-center py-20">
        <h2 className="text-xl font-bold text-slate-900">Campaign not found</h2>
        <Button className="mt-4" onClick={() => navigate('/fundraising')}>
          Return to Campaigns
        </Button>
      </div>
    );
  }

  const percent = Math.round((campaign.raisedAmount / campaign.goalAmount) * 100);
  const daysLeft = getDaysRemaining(campaign.endDate);

  const handleAddUpdate = () => {
    if (!updateTitle.trim() || !updateContent.trim()) return;

    const newUpdates = [
      ...(campaign.updates || []),
      {
        id: `upd-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        title: updateTitle,
        content: updateContent,
        author: 'Meera Sen, Campaign Lead',
      },
    ];

    service.updateCampaign(campaign.id, { updates: newUpdates });
    setUpdateTitle('');
    setUpdateContent('');
    setIsUpdateModalOpen(false);
  };

  const handleShare = () => {
    const url = `${window.location.origin}/campaigns/${campaign.id}/public`;
    navigator.clipboard.writeText(url);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200 pb-16">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-200">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getCategoryBadgeClass(
                campaign.category
              )}`}
            >
              {campaign.category}
            </span>
            <span
              className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${getStatusBadgeClass(
                campaign.status
              )}`}
            >
              {campaign.status}
            </span>
            <span className="text-xs text-slate-500 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              {campaign.location}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            {campaign.title}
          </h1>
          <p className="text-sm text-slate-600 max-w-3xl leading-relaxed">
            {campaign.shortDescription}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            variant="outline"
            size="sm"
            onClick={handleShare}
            leftIcon={<Share2 className="w-3.5 h-3.5" />}
          >
            {copyFeedback ? 'Link Copied!' : 'Share'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/campaigns/${campaign.id}/public`)}
            leftIcon={<ExternalLink className="w-3.5 h-3.5" />}
          >
            Public Donor Page
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setIsUpdateModalOpen(true)}
            leftIcon={<Plus className="w-3.5 h-3.5" />}
          >
            Post Update
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Raised
          </span>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(campaign.raisedAmount)}
          </p>
          <span className="text-xs text-emerald-600 font-medium">{percent}% funded</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Target Goal
          </span>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(campaign.goalAmount, true)}
          </p>
          <span className="text-xs text-slate-500">Total budget</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Donors
          </span>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {campaign.donorsCount.toLocaleString()}
          </p>
          <span className="text-xs text-slate-500">Supporters</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Beneficiaries
          </span>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {campaign.beneficiaryTarget}
          </p>
          <span className="text-xs text-slate-500">Direct impact</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Days Left
          </span>
          <p className="text-xl font-bold text-slate-900 mt-1">{daysLeft}</p>
          <span className="text-xs text-slate-500">Until completion</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Disbursed
          </span>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(campaign.expensesAllocated || 0, true)}
          </p>
          <span className="text-xs text-slate-500">Program expenses</span>
        </div>
      </div>

      {/* Main Content & Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Details & Updates & Donations */}
        <div className="lg:col-span-2 space-y-6">
          {/* Progress Overview Card */}
          <Card className="p-6 space-y-4">
            <div className="flex justify-between items-baseline">
              <div>
                <h3 className="text-base font-bold text-slate-900">Funding Progress</h3>
                <p className="text-xs text-slate-500">
                  {formatCurrency(campaign.raisedAmount)} collected out of{' '}
                  {formatCurrency(campaign.goalAmount)}
                </p>
              </div>
              <span className="text-lg font-extrabold text-brand-700">{percent}%</span>
            </div>
            <ProgressBar value={percent} size="md" variant="teal" />
          </Card>

          {/* Full Narrative & Problem */}
          <Card>
            <CardHeader>
              <CardTitle>Campaign Story & Humanitarian Case</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm text-slate-700 leading-relaxed">
              <div className="whitespace-pre-line">{campaign.fullStory}</div>

              <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80">
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1">
                    Problem Solved
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {campaign.problemStatement}
                  </p>
                </div>
                <div className="p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
                  <h4 className="text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1">
                    Expected Outcome
                  </h4>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    {campaign.expectedImpact}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Campaign Updates Feed */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Field Progress Updates</CardTitle>
                <p className="text-xs text-slate-500">
                  Transparent reporting sent to all registered donors
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsUpdateModalOpen(true)}
                leftIcon={<Plus className="w-3.5 h-3.5" />}
              >
                New Update
              </Button>
            </CardHeader>
            <CardContent className="space-y-4 pt-3">
              {(!campaign.updates || campaign.updates.length === 0) ? (
                <div className="p-6 text-center text-xs text-slate-400">
                  No public updates posted yet. Post milestone achievements to keep donors engaged!
                </div>
              ) : (
                campaign.updates.map((upd) => (
                  <div
                    key={upd.id}
                    className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 space-y-2"
                  >
                    <div className="flex items-center justify-between text-xs">
                      <h4 className="font-bold text-slate-900">{upd.title}</h4>
                      <span className="text-slate-400">{upd.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed">{upd.content}</p>
                    <p className="text-[11px] text-brand-700 font-medium">— {upd.author}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Donations Received for this Campaign */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Contributions Received ({donations.length})</CardTitle>
                <p className="text-xs text-slate-500">
                  Audited donation transactions linked to this campaign
                </p>
              </div>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 border-y border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                    <tr>
                      <th className="py-3 px-4 sm:px-6">Donor</th>
                      <th className="py-3 px-4">Amount</th>
                      <th className="py-3 px-4">Receipt</th>
                      <th className="py-3 px-4">Date</th>
                      <th className="py-3 px-4 sm:px-6 text-right">Method</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {donations.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-slate-400">
                          No donations recorded yet. Share the public link to begin collecting funds!
                        </td>
                      </tr>
                    ) : (
                      donations.map((don) => (
                        <tr key={don.id} className="hover:bg-slate-50/80 transition-colors">
                          <td className="py-3 px-4 sm:px-6 font-semibold text-slate-900">
                            {don.donorName}
                          </td>
                          <td className="py-3 px-4 font-bold text-slate-900">
                            {formatCurrency(don.amount)}
                          </td>
                          <td className="py-3 px-4 text-slate-500 font-mono text-[11px]">
                            {don.receiptNumber}
                          </td>
                          <td className="py-3 px-4 text-slate-500">{don.date.split(' ')[0]}</td>
                          <td className="py-3 px-4 sm:px-6 text-right">
                            <span className="inline-block px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 font-medium">
                              {don.paymentMethod}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Col: Media & Quick Actions */}
        <div className="space-y-6">
          {/* Cover Media Card */}
          <Card className="overflow-hidden">
            <img
              src={campaign.coverImage}
              alt=""
              className="w-full h-52 object-cover"
            />
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Timeline</span>
                <span className="font-semibold text-slate-800">
                  {campaign.startDate} to {campaign.endDate}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>Tax Benefit</span>
                <span className="font-semibold text-emerald-700">80G 50% Exemption</span>
              </div>
              <Button
                variant="primary"
                className="w-full mt-2"
                onClick={() => navigate(`/campaigns/${campaign.id}/public`)}
                leftIcon={<ExternalLink className="w-4 h-4" />}
              >
                Open Public Donor Page
              </Button>
            </div>
          </Card>

          {/* Transparency & Audit Checklist */}
          <Card className="p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Governance & Compliance
            </h4>
            <ul className="space-y-2 text-xs text-slate-600">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Audited by Hope Foundation Finance Committee</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Receipt generation enabled for all online givers</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Beneficiary privacy guardrails active</span>
              </li>
            </ul>
          </Card>
        </div>
      </div>

      {/* Post Update Modal */}
      <Modal
        isOpen={isUpdateModalOpen}
        onClose={() => setIsUpdateModalOpen(false)}
        title="Post Campaign Progress Update"
        description="Share photos, milestone completions, and news with donors."
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsUpdateModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleAddUpdate}>
              Publish Update
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <Input
            label="Update Title *"
            placeholder="e.g. 150 School Kits Distributed in Whitefield!"
            value={updateTitle}
            onChange={(e) => setUpdateTitle(e.target.value)}
          />
          <Textarea
            label="Update Details *"
            rows={4}
            placeholder="Write what was accomplished with donor funds..."
            value={updateContent}
            onChange={(e) => setUpdateContent(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  );
}
