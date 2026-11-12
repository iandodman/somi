'use client';

import { Search, Plus } from 'lucide-react';

interface ActivosFiltersProps {
  busqueda: string;
  onBusquedaChange: (val: string) => void;
  sedeSeleccionada: string;
  onSedeChange: (val: string) => void;
  sedes: string[];
  edificioSeleccionado: string;
  onEdificioChange: (val: string) => void;
  edificios: string[];
  clasificacionSeleccionada: string;
  onClasificacionChange: (val: string) => void;
  onNuevoActivo: () => void;
}

export function ActivosFilters({
  busqueda,
  onBusquedaChange,
  sedeSeleccionada,
  onSedeChange,
  sedes,
  edificioSeleccionado,
  onEdificioChange,
  edificios,
  clasificacionSeleccionada,
  onClasificacionChange,
  onNuevoActivo,
}: ActivosFiltersProps) {
  return (
    <div className="bg-white dark:bg-brand-cardDark p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col lg:flex-row gap-3 items-stretch lg:items-center justify-between transition-colors">
      <div className="relative w-full lg:w-80">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-metallic" />
        <input
          type="text"
          placeholder="Buscar por equipo, código, sala o técnico..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="w-full pl-10 pr-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-dark/60 text-brand-dark dark:text-white rounded-xl text-xs sm:text-sm focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full lg:w-auto">
        <select
          value={sedeSeleccionada}
          onChange={(e) => {
            onSedeChange(e.target.value);
            onEdificioChange('TODOS');
          }}
          className="flex-1 sm:flex-none px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-brand-dark/80 text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition"
        >
          <option value="TODAS">Todas las Sedes</option>
          {sedes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={edificioSeleccionado}
          onChange={(e) => onEdificioChange(e.target.value)}
          className="flex-1 sm:flex-none px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-brand-dark/80 text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition"
        >
          <option value="TODOS">Todos los Edificios</option>
          {edificios.map((ed) => (
            <option key={ed} value={ed}>{ed}</option>
          ))}
        </select>

        <select
          value={clasificacionSeleccionada}
          onChange={(e) => onClasificacionChange(e.target.value)}
          className="flex-1 sm:flex-none px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm bg-white dark:bg-brand-dark/80 text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition"
        >
          <option value="TODAS">Todas las Clasificaciones</option>
          <option value="SEGURIDAD">SEGURIDAD</option>
          <option value="OPERACIÓN">OPERACIÓN</option>
          <option value="LEGAL">LEGAL</option>
          <option value="GENERAL">GENERAL</option>
        </select>

        <button
          onClick={onNuevoActivo}
          className="w-full sm:w-auto ml-auto lg:ml-1 flex items-center justify-center gap-2 px-4 py-2 bg-brand-cyan hover:bg-brand-cyanHover text-white rounded-xl text-xs sm:text-sm font-bold shadow-xs transition active:scale-95"
        >
          <Plus className="w-4 h-4" />
          Nuevo Activo
        </button>
      </div>
    </div>
  );
}