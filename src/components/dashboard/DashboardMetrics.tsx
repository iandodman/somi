'use client';

import { EstadoMantencion } from '@/types';
import { 
  Building2, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Sparkles 
} from 'lucide-react';

interface DashboardMetricsProps {
  totalActivos: number;
  vencidos: number;
  porVencer: number;
  alDia: number;
  alertasCapex: number;
  filtroRapido: EstadoMantencion | 'TODOS' | 'CAPEX';
  onFiltroRapidoChange: (filtro: EstadoMantencion | 'TODOS' | 'CAPEX') => void;
}

export function DashboardMetrics({
  totalActivos,
  vencidos,
  porVencer,
  alDia,
  alertasCapex,
  filtroRapido,
  onFiltroRapidoChange,
}: DashboardMetricsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {/* Total Activos */}
      <button
        onClick={() => onFiltroRapidoChange('TODOS')}
        className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all shadow-xs ${
          filtroRapido === 'TODOS'
            ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/40 shadow-md'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-blue-300 dark:hover:border-slate-700'
        }`}
      >
        <div
          className={`flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider ${
            filtroRapido === 'TODOS' ? 'text-blue-100' : 'text-slate-500 dark:text-slate-400'
          }`}
        >
          <Building2 className="w-3.5 h-3.5" />
          Total
        </div>
        <div
          className={`text-xl sm:text-2xl font-bold mt-1.5 ${
            filtroRapido === 'TODOS' ? 'text-white' : 'text-slate-900 dark:text-white'
          }`}
        >
          {totalActivos}
        </div>
      </button>

      {/* Vencidos */}
      <button
        onClick={() => onFiltroRapidoChange('VENCIDO')}
        className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all shadow-xs ${
          filtroRapido === 'VENCIDO'
            ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/30'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-rose-300'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
          <XCircle className="w-3.5 h-3.5" />
          Vencidos
        </div>
        <div className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1.5">
          {vencidos}
        </div>
      </button>

      {/* Por Vencer */}
      <button
        onClick={() => onFiltroRapidoChange('POR VENCER')}
        className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all shadow-xs ${
          filtroRapido === 'POR VENCER'
            ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/30'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-amber-300'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
          <Clock className="w-3.5 h-3.5" />
          Por Vencer
        </div>
        <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1.5">
          {porVencer}
        </div>
      </button>

      {/* Al Día */}
      <button
        onClick={() => onFiltroRapidoChange('AL DÍA')}
        className={`p-3.5 sm:p-4 rounded-xl border text-left transition-all shadow-xs ${
          filtroRapido === 'AL DÍA'
            ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-emerald-300'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
          <CheckCircle2 className="w-3.5 h-3.5" />
          Al Día
        </div>
        <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1.5">
          {alDia}
        </div>
      </button>

      {/* Alerta CAPEX */}
      <button
        onClick={() => onFiltroRapidoChange('CAPEX')}
        className={`col-span-2 sm:col-span-1 p-3.5 sm:p-4 rounded-xl border text-left transition-all shadow-xs ${
          filtroRapido === 'CAPEX'
            ? 'bg-purple-50 dark:bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/30'
            : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-purple-300'
        }`}
      >
        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Alerta CAPEX
        </div>
        <div className="text-xl sm:text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1.5">
          {alertasCapex}
        </div>
      </button>
    </div>
  );
}