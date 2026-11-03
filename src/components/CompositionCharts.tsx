'use client';

import React, { useState, useEffect } from 'react';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { PieChart as PieIcon, BarChart3 } from 'lucide-react';
import { BinStatus } from '@/types';
import { WASTE_CATEGORIES } from '@/constants/wasteConfig';
import { cn } from '@/lib/utils';

interface CompositionChartsProps {
  bins: BinStatus[];
}

export function CompositionCharts({ bins }: CompositionChartsProps) {
  const [chartType, setChartType] = useState<'donut' | 'bar'>('donut');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const totalItems = bins.reduce((acc, curr) => acc + curr.itemCount, 0);

  const chartData = bins.map((bin) => {
    const meta = WASTE_CATEGORIES[bin.id];
    const percentage =
      totalItems > 0 ? Number(((bin.itemCount / totalItems) * 100).toFixed(1)) : 0;

    return {
      name: bin.name,
      englishName: meta.englishName,
      items: bin.itemCount,
      percentage,
      color: meta.color,
    };
  });

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 rounded-xl p-3 shadow-xl text-xs">
          <div className="flex items-center gap-2 mb-1">
            <span
              className="w-2.5 h-2.5 rounded-full"
              style={{ backgroundColor: data.color }}
            />
            <span className="font-bold text-white">
              {data.name} ({data.englishName})
            </span>
          </div>
          <div className="space-y-0.5 text-slate-300 font-mono text-[11px]">
            <div>Jumlah: <strong className="text-white">{data.items} item</strong></div>
            <div>Persentase: <strong style={{ color: data.color }}>{data.percentage}%</strong></div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white">Komposisi Sampah Terpilah</h3>
          <p className="text-xs text-slate-400">Distribusi 6 Jenis Sampah</p>
        </div>

        {/* Toggle Chart Type */}
        <div className="flex items-center bg-slate-950 border border-slate-800 rounded-lg p-0.5 text-xs">
          <button
            type="button"
            onClick={() => setChartType('donut')}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium',
              chartType === 'donut'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <PieIcon className="w-3 h-3" />
            <span>Donut</span>
          </button>
          <button
            type="button"
            onClick={() => setChartType('bar')}
            className={cn(
              'flex items-center gap-1 px-2.5 py-1 rounded-md transition-all font-medium',
              chartType === 'bar'
                ? 'bg-slate-800 text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-300'
            )}
          >
            <BarChart3 className="w-3 h-3" />
            <span>Bar</span>
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-56 my-2">
        {!mounted ? (
          <div className="w-full h-full flex items-center justify-center text-xs text-slate-500">
            Memuat grafik...
          </div>
        ) : chartType === 'donut' ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={80}
                paddingAngle={4}
                dataKey="items"
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.color}
                    stroke="#0f172a"
                    strokeWidth={2}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
            >
              <XAxis
                dataKey="name"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={{ stroke: '#334155' }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="items" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* Clean Legend */}
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 pt-2 border-t border-slate-800/80">
        {chartData.map((entry) => (
          <div
            key={entry.name}
            className="flex items-center gap-1.5 text-xs"
          >
            <span
              className="w-2.5 h-2.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: entry.color }}
            />
            <span className="text-slate-300 font-medium truncate">
              {entry.name}
            </span>
            <span className="text-slate-500 text-[11px] font-mono ml-auto">
              {entry.percentage}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
