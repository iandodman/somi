'use client';

import { ActivoCompleto } from '@/types';
import { Building2, Clock, ChevronLeft, ChevronRight } from 'lucide-react';

interface DashboardTableProps {
  activos: ActivoCompleto[];
  loading: boolean;
  page?: number;
  totalPages?: number;
  totalPaginas?: number;
  totalCount?: number;       // <-- Agregada para quitar el error en rojo
  totalActivos?: number;     // <-- Soporte alternativo en español
  onPageChange?: (newPage: number) => void;
}

export function DashboardTable({
  activos,
  loading,
  page = 1,
  totalPages,
  totalPaginas,
  totalCount,
  totalActivos,
  onPageChange,
}: DashboardTableProps) {
  const maxPaginas = totalPages ?? totalPaginas ?? 1;
  const countTotal = totalCount ?? totalActivos;
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-xs">
      
      {/* ========================================================= */}
      {/* VISTA MÓVIL: TARJETAS COMPACTAS (Visible solo en < md)      */}
      {/* ========================================================= */}
      <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800/80">
        {loading ? (
          <div className="p-8 text-center text-xs text-slate-400">
            Cargando información del inventario...
          </div>
        ) : activos.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-400">
            No se encontraron activos con los filtros indicados.
          </div>
        ) : (
          activos.map((a, idx) => {
            const keyUnica = a.id ? `movil-${a.id}` : `movil-${idx}`;
            return (
              <div key={keyUnica} className="p-4 space-y-2.5 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
                    {a.codigo_activo || 'SIN CÓDIGO'}
                  </span>

                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    a.estado_mantencion === 'VENCIDO'
                      ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                      : a.estado_mantencion === 'POR VENCER'
                      ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                      : a.estado_mantencion === 'AL DÍA'
                      ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                  }`}>
                    {a.estado_mantencion}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm">
                    {a.tipo_equipo}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-0.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{a.nombre_edificio} • {a.nivel_piso} ({a.nombre_espacio})</span>
                  </p>
                </div>

                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800/60">
                  <span className={`inline-flex items-center px-1.5 py-0.2 rounded text-[10px] font-bold ${
                    a.clasificacion === 'SEGURIDAD' 
                      ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                      : a.clasificacion === 'OPERACIÓN'
                      ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                      : a.clasificacion === 'LEGAL'
                      ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                      : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                  }`}>
                    {a.clasificacion}
                  </span>

                  <div className="flex items-center gap-1.5 text-right font-mono text-[11px]">
                    <Clock className="w-3 h-3 text-slate-400" />
                    <span className="text-slate-700 dark:text-slate-300">
                      {a.fecha_proximo_mantenimiento || 'Sin programar'}
                    </span>
                    {a.dias_restantes !== null && (
                      <span className={`text-[10px] font-bold ${
                        a.dias_restantes < 0 
                          ? 'text-rose-600' 
                          : a.dias_restantes <= 30 
                          ? 'text-amber-600' 
                          : 'text-slate-400'
                      }`}>
                        ({a.dias_restantes < 0 ? `${Math.abs(a.dias_restantes)}d` : `${a.dias_restantes}d`})
                      </span>
                    )}
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* ========================================================= */}
      {/* VISTA ESCRITORIO: TABLA COMPLETA (Visible en md en adelante) */}
      {/* ========================================================= */}
      <table className="hidden md:table w-full text-left border-collapse text-xs sm:text-sm">
        <thead>
          <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
            <th className="p-3.5">Código / Equipo</th>
            <th className="p-3.5">Ubicación</th>
            <th className="p-3.5">Criticidad</th>
            <th className="p-3.5">Próx. Mantención</th>
            <th className="p-3.5 text-center">Estado</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
          {loading ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-xs text-slate-400">
                Cargando información del inventario...
              </td>
            </tr>
          ) : activos.length === 0 ? (
            <tr>
              <td colSpan={5} className="p-8 text-center text-xs text-slate-400">
                No se encontraron activos con los filtros indicados.
              </td>
            </tr>
          ) : (
            activos.map((a, idx) => {
              const keyUnica = a.id ? `desk-${a.id}` : `desk-${idx}`;
              return (
                <tr key={keyUnica} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                  <td className="p-3.5">
                    <div className="font-mono text-xs font-semibold text-blue-600 dark:text-blue-400">
                      {a.codigo_activo || 'SIN CÓDIGO'}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white mt-0.5">
                      {a.tipo_equipo}
                    </div>
                    {a.marca && (
                      <div className="text-[11px] text-slate-500 dark:text-slate-400">
                        {a.marca} {a.modelo ? `• ${a.modelo}` : ''}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300">
                    <div className="font-medium text-slate-900 dark:text-slate-200">
                      {a.nombre_edificio}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {a.nivel_piso} • {a.nombre_espacio}
                    </div>
                  </td>
                  <td className="p-3.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                      a.clasificacion === 'SEGURIDAD' 
                        ? 'bg-rose-100 dark:bg-rose-950/80 text-rose-700 dark:text-rose-300'
                        : a.clasificacion === 'OPERACIÓN'
                        ? 'bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300'
                        : a.clasificacion === 'LEGAL'
                        ? 'bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}>
                      {a.clasificacion}
                    </span>
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-300 font-mono text-xs">
                    {a.fecha_proximo_mantenimiento || 'Sin programar'}
                    {a.dias_restantes !== null && (
                      <div className={`text-[10px] ${
                        a.dias_restantes < 0 
                          ? 'text-rose-600 font-bold' 
                          : a.dias_restantes <= 30 
                          ? 'text-amber-600 font-bold' 
                          : 'text-slate-400'
                      }`}>
                        {a.dias_restantes < 0 
                          ? `Vencido hace ${Math.abs(a.dias_restantes)} días` 
                          : `En ${a.dias_restantes} días`}
                      </div>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
                      a.estado_mantencion === 'VENCIDO'
                        ? 'bg-rose-50 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-900'
                        : a.estado_mantencion === 'POR VENCER'
                        ? 'bg-amber-50 dark:bg-amber-950/70 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-900'
                        : a.estado_mantencion === 'AL DÍA'
                        ? 'bg-emerald-50 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-900'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                    }`}>
                      {a.estado_mantencion}
                    </span>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>

      {/* BARRA DE PAGINACIÓN */}
      {onPageChange && maxPaginas > 1 && (
        <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
          <span className="text-slate-500 dark:text-slate-400 font-medium">
            Página <span className="font-bold text-slate-900 dark:text-white">{page}</span> de{' '}
            <span className="font-bold text-slate-900 dark:text-white">{maxPaginas}</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onPageChange(page - 1)}
              disabled={page <= 1}
              className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Anterior</span>
            </button>
            <button
              onClick={() => onPageChange(page + 1)}
              disabled={page >= maxPaginas}
              className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
            >
              <span>Siguiente</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

    </div>
  );
}