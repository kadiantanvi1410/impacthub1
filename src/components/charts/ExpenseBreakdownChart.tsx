import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const expenseCategories = [
  { name: 'Program Materials', value: 385000, color: '#0d9488' },
  { name: 'Food & Nutrition', value: 240000, color: '#f59e0b' },
  { name: 'Medical & Healthcare', value: 185000, color: '#3b82f6' },
  { name: 'Salaries & Staff', value: 145000, color: '#8b5cf6' },
  { name: 'Operations & Fleet', value: 92500, color: '#ec4899' },
  { name: 'Emergency Winter Aid', value: 65000, color: '#10b981' },
];

export function ExpenseBreakdownChart() {
  const total = expenseCategories.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Donut Chart */}
      <div className="h-56 w-56 relative shrink-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload;
                  return (
                    <div className="bg-slate-900 text-white p-2.5 rounded-xl shadow-xl text-xs space-y-1 border border-slate-800">
                      <p className="font-semibold">{data.name}</p>
                      <p className="font-bold text-teal-400">{formatCurrency(data.value)}</p>
                      <p className="text-slate-400 text-[10px]">
                        {Math.round((data.value / total) * 100)}% of total spend
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Pie
              data={expenseCategories}
              innerRadius={60}
              outerRadius={85}
              paddingAngle={3}
              dataKey="value"
            >
              {expenseCategories.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-[10px] uppercase font-semibold text-slate-400">Total Spent</span>
          <span className="text-base font-bold text-slate-900">{formatCurrency(total, true)}</span>
        </div>
      </div>

      {/* Legend list */}
      <div className="flex-1 w-full space-y-2 text-xs">
        {expenseCategories.map((cat) => (
          <div key={cat.name} className="flex items-center justify-between py-1 border-b border-slate-50 last:border-none">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: cat.color }} />
              <span className="text-slate-600 font-medium">{cat.name}</span>
            </div>
            <div className="flex items-center gap-2 font-semibold">
              <span className="text-slate-900">{formatCurrency(cat.value)}</span>
              <span className="text-slate-400 text-[11px] w-8 text-right">
                {Math.round((cat.value / total) * 100)}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
