'use client';

import { ActivoCompleto } from '@/types';
import { Edit3, Trash2, Sparkles } from 'lucide-react';

interface ActivosDesktopViewProps {
  activos: ActivoCompleto[];
  onEditar: (activo: ActivoCompleto) => void;
  onEliminar: (activo: ActivoCompleto) => void;
}

const ESTILOS_ESTADO: Record<string, string> = {
  VENCIDO: 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
  'POR VENCER': 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900',
  'AL DÍA': 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
};

const ESTILOS_CRITICIDAD: Record<string, string> = {
  SEGURIDAD: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300',
  OPERACIÓN: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300',
  LEGAL: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300',
};

export function ActivosDesktopView({ activos, onEditar, onEliminar }: ActivosDesktopViewProps) {
  return (
    <table className="w-full text-left border-collapse text-xs sm:text-sm">
      <thead>
        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
          <th className="p-3.5">Código / Equipo</th>
          <th className="p-3.5">Ubicación</th>
          <th className="p-3.5">Criticidad</th>
          <th className="p-3.5">Próx. Mantención</th>
          <th className="p-3.5">Ciclo CAPEX</th>
          <th className="p-3.5 text-center">Estado</th>
          <th className="p-3.5 text-right">Acciones</th>
        </tr>
      </thead>
      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
        {activos.map((a, idx) => {
          const estadoEstilo =
            ESTILOS_ESTADO[a.estado_mantencion] ||
            'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent';

          const criticidadEstilo =
            ESTILOS_CRITICIDAD[a.clasificacion] ||
            'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

          return (
            <tr key={a.id || `desk-${idx}`} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
              <td className="p-3.5">
                <div className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                  {a.codigo_activo || 'SIN CÓDIGO'}
                </div>
                <div className="font-bold text-slate-900 dark:text-white mt-0.5">{a.tipo_equipo}</div>
                {(a.marca || a.modelo) && (
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    {[a.marca, a.modelo].filter(Boolean).join(' • ')}
                  </div>
                )}
              </td>
              <td className="p-3.5 text-slate-600 dark:text-slate-300">
                <div className="font-medium text-slate-900 dark:text-slate-200">{a.nombre_edificio}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  {a.nivel_piso} • {a.nombre_espacio}
                </div>
              </td>
              <td className="p-3.5">
                <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-bold ${criticidadEstilo}`}>
                  {a.clasificacion}
                </span>
              </td>
              <td className="p-3.5 font-mono text-xs">
                <div className="text-slate-700 dark:text-slate-300">
                  {a.fecha_proximo_mantenimiento || 'Sin programar'}
                </div>
                {a.dias_restantes !== null && (
                  <div className={`text-[10px] font-semibold ${
                    a.dias_restantes < 0
                      ? 'text-rose-600'
                      : a.dias_restantes <= 30
                      ? 'text-amber-600'
                      : 'text-slate-400'
                  }`}>
                    {a.dias_restantes < 0 ? `Vencido (${Math.abs(a.dias_restantes)}d)` : `En ${a.dias_restantes} días`}
                  </div>
                )}
              </td>
              <td className="p-3.5 text-xs">
                {a.vida_util_anos ? (
                  <div>
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{a.vida_util_anos} años</span>
                    {a.alerta_recambio_capex && (
                      <div className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-0.5">
                        <Sparkles className="w-3 h-3" /> Alerta recambio
                      </div>
                    )}
                  </div>
                ) : (
                  <span className="text-slate-400 text-[11px]">—</span>
                )}
              </td>
              <td className="p-3.5 text-center">
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${estadoEstilo}`}>
                  {a.estado_mantencion}
                </span>
              </td>
              <td className="p-3.5 text-right">
                <div className="inline-flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => onEditar(a)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 dark:text-slate-400 rounded-lg transition"
                    title="Editar activo"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => onEliminar(a)}
                    className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-rose-600 dark:text-slate-400 rounded-lg transition"
                    title="Eliminar activo"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}