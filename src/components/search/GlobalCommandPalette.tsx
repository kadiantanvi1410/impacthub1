import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  HeartHandshake,
  Users,
  UserCheck,
  FolderKanban,
  Wallet,
  UserPlus,
  ArrowRight,
  X,
} from 'lucide-react';
import { useImpactData } from '../../hooks/useImpactData';
import { formatCurrency } from '../../utils/formatters';

interface GlobalCommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalCommandPalette({ isOpen, onClose }: GlobalCommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const { campaigns, donors, beneficiaries, projects, transactions, volunteers } =
    useImpactData();

  // Keyboard shortcut listener for Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Parent handles opening, but if opened, focus input
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  // Filter and group search results
  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) {
      // Default top recommendations
      return [
        ...campaigns.slice(0, 2).map((c) => ({
          id: c.id,
          title: c.title,
          subtitle: `${c.category} • ${formatCurrency(c.raisedAmount, true)} raised of ${formatCurrency(c.goalAmount, true)}`,
          category: 'Campaigns',
          icon: HeartHandshake,
          link: `/campaigns/${c.id}`,
        })),
        ...donors.slice(0, 2).map((d) => ({
          id: d.id,
          title: d.name,
          subtitle: `${d.city} • Total Donated: ${formatCurrency(d.totalDonated)}`,
          category: 'Donors',
          icon: Users,
          link: `/donors`,
        })),
        ...projects.slice(0, 2).map((p) => ({
          id: p.id,
          title: p.name,
          subtitle: `${p.location} • Budget: ${formatCurrency(p.budget, true)}`,
          category: 'Projects',
          icon: FolderKanban,
          link: `/projects`,
        })),
      ];
    }

    const items: Array<{
      id: string;
      title: string;
      subtitle: string;
      category: string;
      icon: any;
      link: string;
    }> = [];

    // Campaigns
    campaigns.forEach((c) => {
      if (
        c.title.toLowerCase().includes(q) ||
        c.category.toLowerCase().includes(q) ||
        c.location.toLowerCase().includes(q)
      ) {
        items.push({
          id: c.id,
          title: c.title,
          subtitle: `Campaign • ${c.category} • ${c.status}`,
          category: 'Campaigns',
          icon: HeartHandshake,
          link: `/campaigns/${c.id}`,
        });
      }
    });

    // Donors
    donors.forEach((d) => {
      if (
        d.name.toLowerCase().includes(q) ||
        d.email.toLowerCase().includes(q) ||
        d.city.toLowerCase().includes(q)
      ) {
        items.push({
          id: d.id,
          title: d.name,
          subtitle: `Donor • ${d.city} • ${formatCurrency(d.totalDonated)} donated`,
          category: 'Donors',
          icon: Users,
          link: `/donors`,
        });
      }
    });

    // Beneficiaries
    beneficiaries.forEach((b) => {
      if (
        b.name.toLowerCase().includes(q) ||
        b.programName.toLowerCase().includes(q) ||
        b.location.toLowerCase().includes(q)
      ) {
        items.push({
          id: b.id,
          title: b.name,
          subtitle: `Beneficiary • ${b.programName} • Status: ${b.caseStatus}`,
          category: 'Beneficiaries',
          icon: UserCheck,
          link: `/beneficiaries`,
        });
      }
    });

    // Projects
    projects.forEach((p) => {
      if (
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
      ) {
        items.push({
          id: p.id,
          title: p.name,
          subtitle: `Project • ${p.location} • ${p.status}`,
          category: 'Projects',
          icon: FolderKanban,
          link: `/projects`,
        });
      }
    });

    // Transactions
    transactions.forEach((t) => {
      if (
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.referenceNo.toLowerCase().includes(q)
      ) {
        items.push({
          id: t.id,
          title: t.description,
          subtitle: `${t.type} • ${formatCurrency(t.amount)} • ${t.date}`,
          category: 'Finance',
          icon: Wallet,
          link: `/finance`,
        });
      }
    });

    // Volunteers
    volunteers.forEach((v) => {
      if (
        v.name.toLowerCase().includes(q) ||
        v.role.toLowerCase().includes(q) ||
        v.skills.some((s) => s.toLowerCase().includes(q))
      ) {
        items.push({
          id: v.id,
          title: v.name,
          subtitle: `Volunteer • ${v.role} • ${v.hoursContributed} hrs`,
          category: 'Volunteers',
          icon: UserPlus,
          link: `/volunteers`,
        });
      }
    });

    return items.slice(0, 12);
  }, [query, campaigns, donors, beneficiaries, projects, transactions, volunteers]);

  const handleSelect = (item: (typeof results)[0]) => {
    navigate(item.link);
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < results.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : results.length - 1));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      handleSelect(results[selectedIndex]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto p-4 sm:p-6 md:p-20">
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative mx-auto max-w-2xl transform rounded-2xl bg-white shadow-2xl border border-slate-200 overflow-hidden transition-all">
        {/* Search Input Bar */}
        <div className="relative border-b border-slate-100 flex items-center px-4 py-3 bg-white">
          <Search className="w-5 h-5 text-slate-400 shrink-0 mr-3" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Type to search campaigns, donors, projects, transactions..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder-slate-400 focus:outline-none"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          ) : (
            <kbd className="hidden sm:inline-block text-[11px] font-mono text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
              ESC
            </kbd>
          )}
        </div>

        {/* Results List */}
        <div className="max-h-96 overflow-y-auto p-2">
          {results.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-400">
              No results found for &ldquo;<span className="text-slate-700 font-medium">{query}</span>&rdquo;
            </div>
          ) : (
            <div className="space-y-1">
              {!query && (
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  Quick Suggestions
                </div>
              )}
              {results.map((item, index) => {
                const Icon = item.icon;
                const isSelected = index === selectedIndex;
                return (
                  <div
                    key={`${item.category}-${item.id}`}
                    onClick={() => handleSelect(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-brand-50 text-brand-900 border border-brand-200/60'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          isSelected
                            ? 'bg-brand-600 text-white'
                            : 'bg-slate-100 text-slate-500'
                        }`}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-semibold truncate text-slate-900">
                          {item.title}
                        </p>
                        <p className="text-[11px] text-slate-500 truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 ml-3">
                      <span className="text-[10px] uppercase font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {item.category}
                      </span>
                      {isSelected && <ArrowRight className="w-3.5 h-3.5 text-brand-600" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white border border-slate-200 px-1 rounded text-[10px]">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="font-mono bg-white border border-slate-200 px-1 rounded text-[10px]">
                ↵
              </kbd>{' '}
              Select
            </span>
          </div>
          <span>Hope Foundation Unified Workspace</span>
        </div>
      </div>
    </div>
  );
}
