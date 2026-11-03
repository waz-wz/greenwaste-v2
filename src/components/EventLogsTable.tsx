'use client';

import React, { useState, useMemo } from 'react';
import { Search, Download, Trash2, CheckCircle } from 'lucide-react';
import { LogEntry, WasteCategory } from '@/types';
import { WASTE_CATEGORIES } from '@/constants/wasteConfig';
import { WasteIcon } from './WasteIcon';
import { cn } from '@/lib/utils';

interface EventLogsTableProps {
  logs: LogEntry[];
  onClearLogs: () => void;
}

const CATEGORY_FILTERS: Array<WasteCategory | 'ALL'> = [
  'ALL',
  'Kaca',
  'Kardus',
  'Kertas',
  'Logam',
  'Organik',
  'Plastik',
];

export function EventLogsTable({ logs, onClearLogs }: EventLogsTableProps) {
  const [selectedFilter, setSelectedFilter] = useState<WasteCategory | 'ALL'>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesCategory =
        selectedFilter === 'ALL' || log.category === selectedFilter;
      const matchesSearch =
        searchQuery.trim() === '' ||
        log.itemName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.id.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [logs, selectedFilter, searchQuery]);

  const handleExportCSV = () => {
    if (logs.length === 0) return;

    const headers = ['ID', 'Waktu', 'Kategori', 'Item', 'Confidence', 'Target Bin', 'Status'];
    const rows = logs.map((l) => [
      l.id,
      l.timestamp,
      l.category,
      `"${l.itemName.replace(/"/g, '""')}"`,
      `${l.confidence}%`,
      `"${l.targetBin}"`,
      l.status,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `greenwaste_logs_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="rounded-2xl bg-slate-900/90 border border-slate-800 p-4 shadow-lg">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
        <div>
          <h3 className="text-sm font-bold text-white">Riwayat Pemilahan Terkini</h3>
          <p className="text-xs text-slate-400">Log deteksi dan pemilahan terbaru</p>
        </div>

        {/* Search & Actions */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 w-36 sm:w-44 transition-colors"
            />
          </div>

          <button
            type="button"
            onClick={handleExportCSV}
            title="Download CSV"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 hover:bg-slate-800 border border-slate-800 text-xs font-medium text-slate-300 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden sm:inline">Export</span>
          </button>

          <button
            type="button"
            onClick={onClearLogs}
            title="Bersihkan Log"
            className="p-1.5 rounded-xl bg-slate-950 hover:bg-rose-950/40 hover:text-rose-400 border border-slate-800 text-slate-500 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Quick Category Filter Pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto py-2.5 scrollbar-thin">
        {CATEGORY_FILTERS.map((cat) => {
          const isAll = cat === 'ALL';
          const meta = !isAll ? WASTE_CATEGORIES[cat] : null;
          const isSelected = selectedFilter === cat;

          return (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedFilter(cat)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border',
                isSelected
                  ? isAll
                    ? 'bg-emerald-600 text-white border-emerald-500'
                    : 'text-white border-transparent'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-800'
              )}
              style={
                isSelected && meta
                  ? {
                      backgroundColor: meta.color,
                      borderColor: meta.color,
                    }
                  : undefined
              }
            >
              <span>{isAll ? 'Semua' : cat}</span>
            </button>
          );
        })}
      </div>

      {/* Clean Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-800/80">
        <table className="w-full text-left text-xs text-slate-300">
          <thead className="bg-slate-950/80 text-slate-400 uppercase text-[10px] font-mono tracking-wider border-b border-slate-800">
            <tr>
              <th className="py-2 px-3">Waktu</th>
              <th className="py-2 px-3">Item</th>
              <th className="py-2 px-3">Kategori</th>
              <th className="py-2 px-3">Confidence</th>
              <th className="py-2 px-3">Target Bin</th>
              <th className="py-2 px-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {filteredLogs.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-6 text-slate-500">
                  Tidak ada riwayat log.
                </td>
              </tr>
            ) : (
              filteredLogs.slice(0, 10).map((log) => {
                const meta = WASTE_CATEGORIES[log.category];
                return (
                  <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                    <td className="py-2 px-3 text-slate-400 font-mono whitespace-nowrap">
                      {log.timestamp}
                    </td>

                    <td className="py-2 px-3 text-white font-medium whitespace-nowrap">
                      {log.itemName}
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap">
                      <span
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: `${meta.color}20`,
                          color: meta.hexLight || meta.color,
                        }}
                      >
                        <WasteIcon category={log.category} className="w-3 h-3" />
                        {log.category}
                      </span>
                    </td>

                    <td className="py-2 px-3 font-mono whitespace-nowrap">
                      {log.confidence}%
                    </td>

                    <td className="py-2 px-3 text-slate-300 whitespace-nowrap">
                      {log.targetBin}
                    </td>

                    <td className="py-2 px-3 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 text-emerald-400 text-xs">
                        <CheckCircle className="w-3 h-3" />
                        {log.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
