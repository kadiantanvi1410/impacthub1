import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { formatCurrency } from '../../utils/formatters';

const financialData = [
  { month: 'May', income: 240000, expense: 195000 },
  { month: 'Jun', income: 310000, expense: 220000 },
  { month: 'Jul', income: 290000, expense: 245000 },
  { month: 'Aug', income: 380000, expense: 290000 },
  { month: 'Sep', income: 425000, expense: 335000 },
  { month: 'Oct', income: 512000, expense: 382000 },
];

export function IncomeExpenseChart() {
  return (
    <div className="w-full">
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={financialData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="month"
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
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  return (
                    <div className="bg-slate-900 text-white p-3 rounded-xl shadow-xl text-xs space-y-1.5 border border-slate-800">
                      <p className="font-semibold text-slate-300">{label} 2026</p>
                      <div className="flex justify-between gap-4">
                        <span className="text-teal-400">Total Inflow:</span>
                        <span className="font-bold">{formatCurrency(payload[0].value as number)}</span>
                      </div>
                      <div className="flex justify-between gap-4">
                        <span className="text-rose-400">Disbursed:</span>
                        <span className="font-bold">{formatCurrency(payload[1].value as number)}</span>
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ paddingBottom: '12px', fontSize: '12px' }}
            />
            <Bar dataKey="income" name="Income" fill="#0d9488" radius={[4, 4, 0, 0]} maxBarSize={28} />
            <Bar dataKey="expense" name="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} maxBarSize={28} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
