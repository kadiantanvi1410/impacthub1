import { useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const dataSets: Record<string, { label: string; amount: number; donors: number }[]> = {
  '7d': [
    { label: 'Oct 01', amount: 35000, donors: 12 },
    { label: 'Oct 02', amount: 48000, donors: 18 },
    { label: 'Oct 03', amount: 42000, donors: 14 },
    { label: 'Oct 04', amount: 76000, donors: 28 },
    { label: 'Oct 05', amount: 62000, donors: 22 },
    { label: 'Oct 06', amount: 89000, donors: 34 },
    { label: 'Oct 07', amount: 95000, donors: 38 },
  ],
  '30d': [
    { label: 'Week 1', amount: 180000, donors: 84 },
    { label: 'Week 2', amount: 260000, donors: 110 },
    { label: 'Week 3', amount: 390000, donors: 165 },
    { label: 'Week 4', amount: 420000, donors: 182 },
  ],
  '3m': [
    { label: 'Aug 2026', amount: 310000, donors: 142 },
    { label: 'Sep 2026', amount: 395000, donors: 178 },
    { label: 'Oct 2026', amount: 420000, donors: 195 },
  ],
  '6m': [
    { label: 'May 2026', amount: 210000, donors: 95 },
    { label: 'Jun 2026', amount: 245000, donors: 115 },
    { label: 'Jul 2026', amount: 280000, donors: 130 },
    { label: 'Aug 2026', amount: 310000, donors: 142 },
    { label: 'Sep 2026', amount: 395000, donors: 178 },
    { label: 'Oct 2026', amount: 420000, donors: 195 },
  ],
  '1y': [
    { label: 'Q4 2025', amount: 450000, donors: 210 },
    { label: 'Q1 2026', amount: 620000, donors: 290 },
    { label: 'Q2 2026', amount: 735000, donors: 340 },
    { label: 'Q3 2026', amount: 1125000, donors: 480 },
  ],
};

export function FundraisingTrendChart() {
  const [timeRange, setTimeRange] = useState<string>('30d');
  const data = dataSets[timeRange] || dataSets['30d'];

  return (
    <div className="w-full">
      {/* Chart Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Giving Trajectory
          </span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-2xl font-bold text-slate-900">
              {formatCurrency(
                data.reduce((sum, item) => sum + item.amount, 0),
                true
              )}
            </span>
            <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
              +18.4% YoY
            </span>
          </div>
        </div>

        {/* Time filters */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/80 self-start sm:self-auto">
          {[
            { id: '7d', label: '7D' },
            { id: '30d', label: '30D' },
            { id: '3m', label: '3M' },
            { id: '6m', label: '6M' },
            { id: '1y', label: '1Y' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setTimeRange(tab.id)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all ${
                timeRange === tab.id
                  ? 'bg-white text-brand-800 shadow-xs border border-slate-200/60'
                  : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Area Chart */}
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="fundraisingGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0d9488" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#0d9488" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="label"
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={{ stroke: '#e2e8f0' }}
            />
            <YAxis
              stroke="#94a3b8"
              fontSize={11}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => formatCurrency(v, true)}
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                      <p className="font-semibold text-slate-300">{item.label}</p>
                      <p className="text-emerald-400 font-bold text-sm">
                        {formatCurrency(item.amount)}
                      </p>
                      <p className="text-slate-400 text-[11px]">{item.donors} donors contributed</p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area
              type="monotone"
              dataKey="amount"
              stroke="#0d9488"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#fundraisingGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
