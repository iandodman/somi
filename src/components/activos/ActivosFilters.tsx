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
    <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row gap-4 items-center justify-between transition-colors">
      <div className="relative w-full lg:w-80">
        <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
        <input
          type="text"
          placeholder="Buscar por equipo, sala o técnico..."
          value={busqueda}
          onChange={(e) => onBusquedaChange(e.target.value)}
          className="w-full pl-9 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
        <select
          value={sedeSeleccionada}
          onChange={(e) => {
            onSedeChange(e.target.value);
            onEdificioChange('TODOS');
          }}
          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="TODAS">Todas las Sedes</option>
          {sedes.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select
          value={edificioSeleccionado}
          onChange={(e) => onEdificioChange(e.target.value)}
          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="TODOS">Todos los Edificios</option>
          {edificios.map((ed) => (
            <option key={ed} value={ed}>{ed}</option>
          ))}
        </select>

        <select
          value={clasificacionSeleccionada}
          onChange={(e) => onClasificacionChange(e.target.value)}
          className="px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="TODAS">Todas las Clasificaciones</option>
          <option value="SEGURIDAD">SEGURIDAD</option>
          <option value="OPERACIÓN">OPERACIÓN</option>
          <option value="LEGAL">LEGAL</option>
          <option value="GENERAL">GENERAL</option>
        </select>

        <button
          onClick={onNuevoActivo}
          className="ml-auto lg:ml-2 flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo Activo
        </button>
      </div>
    </div>
  );
}