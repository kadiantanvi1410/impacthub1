import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  HeartHandshake,
  Users,
  UserCheck,
  FolderKanban,
  Wallet,
  UserPlus,
  FileBarChart2,
  Settings,
  ChevronLeft,
  ChevronRight,
  PlusCircle,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onCloseMobile?: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse, onCloseMobile }: SidebarProps) {
  const { organization, currentUser } = useImpactData();
  const navigate = useNavigate();

  const navItems = [
    { label: 'Dashboard', to: '/', icon: LayoutDashboard },
    { label: 'Fundraising', to: '/fundraising', icon: HeartHandshake },
    { label: 'Donors', to: '/donors', icon: Users },
    { label: 'Beneficiaries', to: '/beneficiaries', icon: UserCheck },
    { label: 'Projects', to: '/projects', icon: FolderKanban },
    { label: 'Finance', to: '/finance', icon: Wallet },
    { label: 'Volunteers', to: '/volunteers', icon: UserPlus },
    { label: 'Reports', to: '/reports', icon: FileBarChart2 },
  ];

  const handleLinkClick = () => {
    if (onCloseMobile) onCloseMobile();
  };

  return (
    <aside
      className={`h-screen bg-slate-900 text-slate-300 flex flex-col border-r border-slate-800 transition-all duration-300 select-none z-30 sticky top-0 ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-slate-800">
        <NavLink
          to="/"
          onClick={handleLinkClick}
          className="flex items-center gap-3 overflow-hidden text-left"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-teal-400 flex items-center justify-center text-white font-bold shadow-md shadow-brand-900/30 shrink-0">
            <svg
              className="w-5 h-5"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
            </svg>
          </div>
          {!isCollapsed && (
            <div className="flex flex-col min-w-0">
              <span className="text-base font-bold text-white tracking-tight leading-none flex items-center gap-1.5">
                ImpactHub
                <span className="text-[10px] font-semibold tracking-wider uppercase px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 border border-brand-500/30">
                  SaaS
                </span>
              </span>
              <span className="text-xs text-slate-400 truncate mt-0.5 font-normal">
                {organization.name}
              </span>
            </div>
          )}
        </NavLink>

        {/* Collapse toggle (desktop only) */}
        <button
          onClick={onToggleCollapse}
          className="hidden md:flex p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Primary Action Button */}
      <div className="p-3">
        <button
          onClick={() => {
            navigate('/campaigns/new');
            if (onCloseMobile) onCloseMobile();
          }}
          className={`w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-medium text-sm shadow-sm transition-all duration-150 active:scale-[0.98] ${
            isCollapsed ? 'px-0' : ''
          }`}
          title="Create New Campaign"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>New Campaign</span>}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        <div className={`px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 ${isCollapsed ? 'hidden' : 'block'}`}>
          Operations
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={handleLinkClick}
              end={item.to === '/'}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  isActive
                    ? 'bg-slate-800 text-white font-semibold shadow-sm border border-slate-700/60 text-brand-400'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
                }`
              }
              title={isCollapsed ? item.label : undefined}
            >
              <Icon className="w-5 h-5 shrink-0 transition-colors group-hover:text-brand-400" />
              {!isCollapsed && <span className="truncate">{item.label}</span>}
            </NavLink>
          );
        })}

        <div className={`pt-4 px-2 pb-1.5 text-[10px] font-semibold uppercase tracking-wider text-slate-400 ${isCollapsed ? 'hidden' : 'block'}`}>
          System
        </div>
        <NavLink
          to="/settings"
          onClick={handleLinkClick}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
              isActive
                ? 'bg-slate-800 text-white font-semibold shadow-sm border border-slate-700/60 text-brand-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`
          }
          title={isCollapsed ? 'Settings' : undefined}
        >
          <Settings className="w-5 h-5 shrink-0 transition-colors group-hover:text-brand-400" />
          {!isCollapsed && <span className="truncate">Settings</span>}
        </NavLink>
      </nav>

      {/* Public Page Quick Preview */}
      {!isCollapsed && (
        <div className="mx-3 mb-3 p-3 rounded-xl bg-slate-800/50 border border-slate-800 flex flex-col gap-1.5">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <ShieldCheck className="w-3.5 h-3.5 text-brand-400" />
            <span>Public Giving Page</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Preview donor-facing campaign landing experience.
          </p>
          <button
            onClick={() => {
              navigate('/campaigns/camp-1/public');
              if (onCloseMobile) onCloseMobile();
            }}
            className="mt-1 flex items-center justify-between text-xs text-brand-400 hover:text-brand-300 font-medium py-1"
          >
            <span>View Live Donor Page</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* User Footer Profile */}
      <div className="p-3 border-t border-slate-800 bg-slate-950/40">
        <NavLink
          to="/settings"
          onClick={handleLinkClick}
          className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-800/80 transition-colors"
        >
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-8 h-8 rounded-full object-cover ring-2 ring-brand-500/30 shrink-0"
          />
          {!isCollapsed && (
            <div className="flex flex-col min-w-0 text-left">
              <span className="text-xs font-semibold text-white truncate">
                {currentUser.name}
              </span>
              <span className="text-[11px] text-brand-400 font-medium truncate">
                {currentUser.role}
              </span>
            </div>
          )}
        </NavLink>
      </div>
    </aside>
  );
}
