import React, { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  Search,
  Bell,
  HelpCircle,
  Plus,
  ChevronRight,
  LogOut,
  Building2,
  ExternalLink,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { Button } from '../ui/Button';

interface HeaderProps {
  onOpenMobileMenu: () => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export function Header({
  onOpenMobileMenu,
  onOpenSearch,
  onOpenNotifications,
}: HeaderProps) {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { currentUser, unreadCount, organization, service } = useImpactData();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  // Derive page title & breadcrumbs
  const getBreadcrumbs = () => {
    if (pathname === '/') return { title: 'Executive Overview', section: 'Dashboard' };
    if (pathname.startsWith('/fundraising')) return { title: 'Fundraising Campaigns', section: 'Fundraising' };
    if (pathname === '/campaigns/new') return { title: 'Create Campaign', section: 'Fundraising' };
    if (pathname.includes('/public')) return { title: 'Public Giving Page', section: 'Campaign' };
    if (pathname.startsWith('/campaigns/')) return { title: 'Campaign Management', section: 'Fundraising' };
    if (pathname.startsWith('/donors')) return { title: 'Donor CRM & Contributions', section: 'Donors' };
    if (pathname.startsWith('/beneficiaries')) return { title: 'Beneficiary Case Management', section: 'Impact' };
    if (pathname.startsWith('/projects')) return { title: 'Projects & Program Portfolios', section: 'Programs' };
    if (pathname.startsWith('/finance')) return { title: 'Finance & Expense Ledger', section: 'Finance' };
    if (pathname.startsWith('/volunteers')) return { title: 'Volunteers & Field Team', section: 'Team' };
    if (pathname.startsWith('/reports')) return { title: 'Impact & Financial Reports', section: 'Analytics' };
    if (pathname.startsWith('/settings')) return { title: 'Organization & Workspace Settings', section: 'Settings' };
    return { title: 'ImpactHub', section: 'Home' };
  };

  const breadcrumb = getBreadcrumbs();

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-slate-200/80 sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & breadcrumbs */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          onClick={onOpenMobileMenu}
          className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg -ml-1 transition-colors"
          aria-label="Open mobile menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 min-w-0">
          <span className="hidden sm:inline-flex items-center text-xs font-semibold text-slate-400 uppercase tracking-wider">
            {breadcrumb.section}
          </span>
          <ChevronRight className="hidden sm:inline w-3.5 h-3.5 text-slate-300" />
          <h1 className="text-sm sm:text-base font-bold text-slate-900 truncate">
            {breadcrumb.title}
          </h1>
        </div>
      </div>

      {/* Right: Search, Notifications, Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search trigger */}
        <button
          onClick={onOpenSearch}
          className="flex items-center gap-2 px-3 py-1.5 text-xs sm:text-sm text-slate-500 bg-slate-100 hover:bg-slate-200/80 rounded-lg border border-slate-200/80 transition-colors cursor-pointer group"
          title="Search campaigns, donors, projects (Ctrl+K)"
        >
          <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 group-hover:text-slate-600" />
          <span className="hidden sm:inline">Search records...</span>
          <kbd className="hidden md:inline-flex items-center px-1.5 py-0.5 text-[10px] font-mono text-slate-500 bg-white border border-slate-300 rounded shadow-2xs">
            ⌘K
          </kbd>
        </button>

        {/* Create Campaign shortcut */}
        <Button
          variant="primary"
          size="sm"
          onClick={() => navigate('/campaigns/new')}
          className="hidden lg:inline-flex"
          leftIcon={<Plus className="w-3.5 h-3.5" />}
        >
          New Campaign
        </Button>

        {/* Notifications Button */}
        <button
          onClick={onOpenNotifications}
          className="relative p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Open notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-brand-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
              {unreadCount}
            </span>
          )}
        </button>

        {/* Help icon */}
        <button
          onClick={() => alert(`ImpactHub Help Center\n\nOrganization: ${organization.name}\nRegistration: ${organization.registrationNumber}\nSupport: contact@hopefoundation.org`)}
          className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer hidden sm:block"
          title="Help & documentation"
        >
          <HelpCircle className="w-4 h-4 sm:w-5 sm:h-5" />
        </button>

        <div className="h-5 w-px bg-slate-200 hidden sm:block" />

        {/* User avatar menu dropdown */}
        <div className="relative">
          <button
            onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
            className="flex items-center gap-2 p-1 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full object-cover ring-2 ring-brand-500/30"
            />
            <div className="hidden xl:flex flex-col text-left">
              <span className="text-xs font-semibold text-slate-900 leading-tight">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-slate-500 leading-none">
                {currentUser.role}
              </span>
            </div>
          </button>

          {profileDropdownOpen && (
            <>
              <div
                className="fixed inset-0 z-40"
                onClick={() => setProfileDropdownOpen(false)}
              />
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-card-hover border border-slate-200 p-1.5 z-50 animate-in fade-in zoom-in-95">
                <div className="px-3 py-2 border-b border-slate-100">
                  <p className="text-xs font-bold text-slate-900">{currentUser.name}</p>
                  <p className="text-[11px] text-slate-500 truncate">{currentUser.email}</p>
                  <span className="inline-block mt-1 text-[10px] font-medium bg-brand-50 text-brand-700 px-1.5 py-0.5 rounded">
                    {organization.name} • {currentUser.role}
                  </span>
                </div>

                <div className="py-1">
                  <Link
                    to="/settings"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Organization Settings</span>
                  </Link>
                  <Link
                    to="/login"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span>Admin Auth & Security</span>
                  </Link>
                  <Link
                    to="/campaigns/camp-1/public"
                    onClick={() => setProfileDropdownOpen(false)}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                    <span>View Public Campaign</span>
                  </Link>
                </div>

                <div className="pt-1 border-t border-slate-100 space-y-0.5">
                  <button
                    onClick={() => {
                      service.logout();
                      setProfileDropdownOpen(false);
                      navigate('/login');
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-rose-600 hover:bg-rose-50 rounded-lg transition-colors font-medium cursor-pointer"
                  >
                    <LogOut className="w-3.5 h-3.5 text-rose-500" />
                    <span>Log Out (Admin Tanvi)</span>
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Reset mock data back to Hope Foundation defaults?')) {
                        service.resetToDefaults();
                        setProfileDropdownOpen(false);
                      }
                    }}
                    className="w-full text-left flex items-center gap-2 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <span>Reset Mock Demo Data</span>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
