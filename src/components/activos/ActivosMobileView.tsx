'use client';

import { ActivoCompleto } from '@/types';
import { MapPin, Calendar, Edit3, Trash2, Sparkles } from 'lucide-react';

interface ActivosMobileViewProps {
  activos: ActivoCompleto[];
  onEditar: (activo: ActivoCompleto) => void;
  onEliminar: (activo: ActivoCompleto) => void;
}

const ESTILOS_ESTADO: Record<string, string> = {
  VENCIDO: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
  'POR VENCER': 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900',
  'AL DÍA': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
};

const ESTILOS_CRITICIDAD: Record<string, string> = {
  SEGURIDAD: 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300',
  OPERACIÓN: 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300',
  LEGAL: 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300',
};

export function ActivosMobileView({ activos, onEditar, onEliminar }: ActivosMobileViewProps) {
  return (
    <div className="divide-y divide-slate-100 dark:divide-slate-800/80 bg-white dark:bg-slate-900">
      {activos.map((a, idx) => {
        const estadoEstilo =
          ESTILOS_ESTADO[a.estado_mantencion] ||
          'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-transparent';

        const criticidadEstilo =
          ESTILOS_CRITICIDAD[a.clasificacion] ||
          'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300';

        return (
          <article
            key={a.id || `mob-${idx}`}
            className="p-4 space-y-3 hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition active:bg-slate-100/60 dark:active:bg-slate-800/70"
          >
            {/* Cabecera de la Tarjeta */}
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
                {a.codigo_activo || 'SIN CÓDIGO'}
              </span>
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${estadoEstilo}`}>
                {a.estado_mantencion}
              </span>
            </div>

            {/* Identificación del Equipo */}
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base leading-snug">
                {a.tipo_equipo}
              </h2>
              {(a.marca || a.modelo) && (
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {[a.marca, a.modelo].filter(Boolean).join(' • ')}
                </p>
              )}
            </div>

            {/* Ubicación */}
            <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {a.nombre_edificio} • {a.nivel_piso} ({a.nombre_espacio})
              </span>
            </div>

            {/* Grilla Informativa de Ciclos y Criticidad */}
            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800/80 text-xs">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl space-y-1">
                <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-blue-500" />
                  Próx. Mantención
                </span>
                <div className="font-mono font-medium text-slate-800 dark:text-slate-200 text-xs">
                  {a.fecha_proximo_mantenimiento || 'Sin programar'}
                </div>
                {a.dias_restantes !== null && (
                  <div className={`text-[11px] font-semibold ${
                    a.dias_restantes < 0
                      ? 'text-rose-600 dark:text-rose-400'
                      : a.dias_restantes <= 30
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-500'
                  }`}>
                    {a.dias_restantes < 0
                      ? `Vencido (${Math.abs(a.dias_restantes)}d)`
                      : `En ${a.dias_restantes} días`}
                  </div>
                )}
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl space-y-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 dark:text-slate-400 block mb-1">
                    Criticidad
                  </span>
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold ${criticidadEstilo}`}>
                    {a.clasificacion}
                  </span>
                </div>

                {a.alerta_recambio_capex && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-purple-600 dark:text-purple-400 pt-1">
                    <Sparkles className="w-3 h-3 shrink-0" />
                    Alerta CAPEX
                  </span>
                )}
              </div>
            </div>

            {/* Barra de Acciones Táctiles */}
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => onEditar(a)}
                className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition active:scale-95"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Editar
              </button>
              <button
                type="button"
                onClick={() => onEliminar(a)}
                className="p-2 hover:bg-rose-50 dark:hover:bg-rose-950/60 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl transition active:scale-95"
                title="Eliminar activo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </article>
        );
      })}
    </div>
  );
}