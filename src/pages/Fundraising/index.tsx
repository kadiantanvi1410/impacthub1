import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Plus,
  Search,
  Filter,
  HeartHandshake,
  TrendingUp,
  Users,
  Target,
  Clock,
  ExternalLink,
  Edit,
  LayoutGrid,
  List,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Card, CardContent } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { ProgressBar } from '../../components/ui/ProgressBar';
import { EmptyState } from '../../components/ui/EmptyState';
import {
  formatCurrency,
  getDaysRemaining,
  getCategoryBadgeClass,
  getStatusBadgeClass,
} from '../../utils/formatters';
import { CampaignCategory, CampaignStatus } from '../../types';

export function Fundraising() {
  const navigate = useNavigate();
  const { campaigns } = useImpactData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'newest' | 'raised' | 'percent'>('raised');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Aggregated metrics
  const totalRaised = campaigns.reduce((sum, c) => sum + c.raisedAmount, 0);
  const totalGoal = campaigns.reduce((sum, c) => sum + c.goalAmount, 0);
  const totalDonors = campaigns.reduce((sum, c) => sum + c.donorsCount, 0);
  const activeCount = campaigns.filter((c) => c.status === 'Active').length;

  // Filtered and sorted campaigns
  const filteredCampaigns = useMemo(() => {
    return campaigns
      .filter((c) => {
        const matchesSearch =
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          c.location.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus =
          selectedStatus === 'All' ? true : c.status === selectedStatus;
        const matchesCategory =
          selectedCategory === 'All' ? true : c.category === selectedCategory;
        return matchesSearch && matchesStatus && matchesCategory;
      })
      .sort((a, b) => {
        if (sortBy === 'raised') return b.raisedAmount - a.raisedAmount;
        if (sortBy === 'percent') {
          return b.raisedAmount / b.goalAmount - a.raisedAmount / a.goalAmount;
        }
        return new Date(b.startDate).getTime() - new Date(a.startDate).getTime();
      });
  }, [campaigns, searchQuery, selectedStatus, selectedCategory, sortBy]);

  const categories: (CampaignCategory | 'All')[] = [
    'All',
    'Education',
    'Hunger Relief',
    'Healthcare',
    'Disaster Relief',
    'Women Empowerment',
  ];

  const statuses: (CampaignStatus | 'All')[] = [
    'All',
    'Active',
    'Draft',
    'Completed',
    'Paused',
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Fundraising Campaigns
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Deploy, monitor, and optimize impact appeals and donor engagement.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/campaigns/new')}
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Create Campaign
        </Button>
      </div>

      {/* Top Summary Metrics Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Raised</span>
            <HeartHandshake className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalRaised)}
          </p>
          <span className="text-[11px] text-slate-400">
            Across {campaigns.length} campaigns
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Overall Goal</span>
            <Target className="w-4 h-4 text-brand-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {formatCurrency(totalGoal)}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            {Math.round((totalRaised / totalGoal) * 100)}% overall funded
          </span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Appeals</span>
            <TrendingUp className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">{activeCount}</p>
          <span className="text-[11px] text-slate-400">Receiving donations</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-card">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Unique Donors</span>
            <Users className="w-4 h-4 text-purple-600" />
          </div>
          <p className="text-xl font-bold text-slate-900 mt-1">
            {totalDonors.toLocaleString()}
          </p>
          <span className="text-[11px] text-slate-400">Contributors</span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search campaigns by title, keywords or location..."
            className="w-full pl-10 pr-4 py-2 text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white rounded-xl border border-slate-200 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20 focus:outline-none transition-colors"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Category */}
          <div className="flex items-center gap-1.5 text-xs text-slate-600">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-500 cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c === 'All' ? 'All Categories' : c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-slate-700 focus:outline-none focus:border-brand-500 cursor-pointer"
          >
            <option value="raised">Sort: Most Raised</option>
            <option value="percent">Sort: % Progress</option>
            <option value="newest">Sort: Newest</option>
          </select>

          {/* View mode toggle */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded-md ${
                viewMode === 'grid'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded-md ${
                viewMode === 'table'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
              title="Table View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1 overflow-x-auto">
        {statuses.map((status) => {
          const count =
            status === 'All'
              ? campaigns.length
              : campaigns.filter((c) => c.status === status).length;
          return (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap flex items-center gap-1.5 ${
                selectedStatus === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <span>{status}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  selectedStatus === status
                    ? 'bg-slate-700 text-slate-200'
                    : 'bg-slate-100 text-slate-500'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Campaigns Listing */}
      {filteredCampaigns.length === 0 ? (
        <EmptyState
          icon={<HeartHandshake className="w-6 h-6 text-brand-600" />}
          title="No campaigns found"
          description="Try adjusting your search terms, category filters, or status selection."
          actionText="Create New Campaign"
          onAction={() => navigate('/campaigns/new')}
        />
      ) : viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map((camp) => {
            const percent = Math.round((camp.raisedAmount / camp.goalAmount) * 100);
            const daysLeft = getDaysRemaining(camp.endDate);

            return (
              <Card key={camp.id} hover className="flex flex-col overflow-hidden">
                <div className="relative h-48 overflow-hidden group">
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
                    <h3
                      onClick={() => navigate(`/campaigns/${camp.id}`)}
                      className="text-base font-bold text-slate-900 line-clamp-1 hover:text-brand-700 transition-colors cursor-pointer"
                    >
                      {camp.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {camp.shortDescription}
                    </p>

                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between items-baseline text-xs">
                        <span className="font-bold text-slate-900 text-sm">
                          {formatCurrency(camp.raisedAmount)}
                        </span>
                        <span className="text-slate-500 text-[11px]">
                          Goal: {formatCurrency(camp.goalAmount, true)}
                        </span>
                      </div>
                      <ProgressBar value={percent} size="sm" variant="teal" />
                      <div className="flex justify-between items-center text-[11px] text-slate-500 pt-0.5">
                        <span className="font-semibold text-brand-700">{percent}% Funded</span>
                        <span>{camp.donorsCount} Donors</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-1 text-[11px] text-slate-500">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{camp.status === 'Completed' ? 'Goal Met' : `${daysLeft} days left`}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => navigate(`/campaigns/${camp.id}/public`)}
                        className="p-1.5 text-slate-500 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
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
      ) : (
        /* Table View */
        <Card className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 sm:px-6">Campaign</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Raised / Goal</th>
                  <th className="py-3 px-4">Progress</th>
                  <th className="py-3 px-4">Donors</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 sm:px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredCampaigns.map((camp) => {
                  const percent = Math.round((camp.raisedAmount / camp.goalAmount) * 100);
                  return (
                    <tr key={camp.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-slate-900">
                        <div className="flex items-center gap-3">
                          <img
                            src={camp.coverImage}
                            alt=""
                            className="w-10 h-10 rounded-lg object-cover"
                          />
                          <div>
                            <p
                              onClick={() => navigate(`/campaigns/${camp.id}`)}
                              className="font-bold text-slate-900 hover:text-brand-700 cursor-pointer"
                            >
                              {camp.title}
                            </p>
                            <p className="text-[11px] text-slate-400 font-normal">
                              {camp.location}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(
                            camp.category
                          )}`}
                        >
                          {camp.category}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span className="font-bold text-slate-900">
                          {formatCurrency(camp.raisedAmount)}
                        </span>
                        <span className="text-slate-400 text-[11px] block">
                          of {formatCurrency(camp.goalAmount)}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 w-32">
                        <ProgressBar value={percent} size="sm" />
                        <span className="text-[10px] text-slate-500 font-medium mt-1 block">
                          {percent}%
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-slate-700 font-medium">
                        {camp.donorsCount}
                      </td>
                      <td className="py-3.5 px-4">
                        <span
                          className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border ${getStatusBadgeClass(
                            camp.status
                          )}`}
                        >
                          {camp.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => navigate(`/campaigns/${camp.id}/public`)}
                            className="p-1.5 text-slate-400 hover:text-brand-700 hover:bg-brand-50 rounded-lg transition-colors"
                            title="Public Page"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => navigate(`/campaigns/${camp.id}`)}
                            leftIcon={<Edit className="w-3.5 h-3.5" />}
                          >
                            Manage
                          </Button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>
      )}
    </div>
  );
}
