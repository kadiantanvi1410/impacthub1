import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: string;
    trend: 'up' | 'down' | 'neutral';
    period?: string;
  };
  icon: React.ReactNode;
  iconBgColor?: string;
  description?: string;
  onClick?: () => void;
}

export function StatCard({
  title,
  value,
  change,
  icon,
  iconBgColor = 'bg-brand-50 text-brand-700 border-brand-100',
  description,
  onClick,
}: StatCardProps) {
  return (
    <div
      onClick={onClick}
      className={`group bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-card hover:shadow-card-hover hover:border-slate-300 transition-all duration-200 ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-medium text-slate-500 uppercase tracking-wide">
            {title}
          </p>
          <div className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 group-hover:text-brand-900 transition-colors">
            {value}
          </div>
        </div>
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center border shadow-subtle ${iconBgColor} group-hover:scale-105 transition-transform duration-200`}
        >
          {icon}
        </div>
      </div>

      {(change || description) && (
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
          {change && (
            <div className="flex items-center gap-1.5">
              <span
                className={`inline-flex items-center gap-1 font-semibold px-2 py-0.5 rounded-full text-[11px] ${
                  change.trend === 'up'
                    ? 'text-emerald-700 bg-emerald-50 border border-emerald-100'
                    : change.trend === 'down'
                    ? 'text-rose-700 bg-rose-50 border border-rose-100'
                    : 'text-slate-700 bg-slate-100'
                }`}
              >
                {change.trend === 'up' && <TrendingUp className="w-3 h-3" />}
                {change.trend === 'down' && <TrendingDown className="w-3 h-3" />}
                {change.trend === 'neutral' && <Minus className="w-3 h-3" />}
                {change.value}
              </span>
              <span className="text-slate-400 font-normal">
                {change.period || 'vs last month'}
              </span>
            </div>
          )}
          {description && <span className="text-slate-400">{description}</span>}
        </div>
      )}
    </div>
  );
}
