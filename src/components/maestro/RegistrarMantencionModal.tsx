'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { ActivoCompleto } from '@/types';
import { X, CheckCircle, AlertTriangle, Wrench } from 'lucide-react';

interface Props {
  isOpen: boolean;
  activo: ActivoCompleto | null;
  onClose: () => void;
  onSuccess: () => void;
}

// Función auxiliar para sumar días en formato YYYY-MM-DD
function sumarDias(fechaStr: string, dias: number): string {
  if (!fechaStr || isNaN(dias) || dias <= 0) return '';
  const [year, month, day] = fechaStr.split('-').map(Number);
  const fecha = new Date(year, month - 1, day);
  fecha.setDate(fecha.getDate() + dias);

  const yyyy = fecha.getFullYear();
  const mm = String(fecha.getMonth() + 1).padStart(2, '0');
  const dd = String(fecha.getDate()).padStart(2, '0');
  return `${yyyy}-${mm}-${dd}`;
}

export function RegistrarMantencionModal({ isOpen, activo, onClose, onSuccess }: Props) {
  const hoyStr = new Date().toISOString().split('T')[0];

  const [fechaEjecucion, setFechaEjecucion] = useState(hoyStr);
  const [realizadoPor, setRealizadoPor] = useState(activo?.responsable_default || '');
  const [tipoTrabajo, setTipoTrabajo] = useState<'Preventivo' | 'Correctivo' | 'Inspección'>('Preventivo');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen || !activo) return null;

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    if (!activo) return;
    setLoading(true);
    setErrorMsg(null);

    try {
      if (!realizadoPor.trim()) {
        throw new Error('Debes indicar quién realizó la mantención.');
      }

      // 1. Calcular nueva fecha de próxima mantención según su ciclo
      const diasCiclo = activo.frecuencia_dias || 365;
      const proximaFechaCalculada = sumarDias(fechaEjecucion, diasCiclo);

      // 2. Insertar en historial_mantenimientos
      const { error: errHistorial } = await supabase
        .from('historial_mantenimientos')
        .insert({
          colegio_id: activo.colegio_id,
          activo_id: activo.id,
          fecha_ejecucion: fechaEjecucion,
          realizado_por: realizadoPor.trim(),
          tipo_trabajo: tipoTrabajo,
          observaciones: observaciones.trim() || null,
        });

      if (errHistorial) throw errHistorial;

      // 3. Actualizar el activo principal
      const { error: errActivo } = await supabase
        .from('activos')
        .update({
          fecha_ultimo_mantenimiento: fechaEjecucion,
          fecha_proximo_mantenimiento: proximaFechaCalculada,
          responsable_default: realizadoPor.trim(),
        })
        .eq('id', activo.id);

      if (errActivo) throw errActivo;

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al registrar el mantenimiento.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Cabecera */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 rounded border border-blue-200 dark:border-blue-800">
                {activo.codigo_activo || 'SIN CÓDIGO'}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                {activo.nombre_edificio} • {activo.nombre_espacio}
              </span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
              Registrar Mantención
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              {activo.tipo_equipo}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs rounded-lg border border-rose-200 dark:border-rose-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleGuardar} className="space-y-4 text-sm">
          
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Fecha de Ejecución *
              </label>
              <input
                type="date"
                required
                value={fechaEjecucion}
                onChange={(e) => setFechaEjecucion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
                Tipo de Trabajo
              </label>
              <select
                value={tipoTrabajo}
                onChange={(e) => setTipoTrabajo(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Preventivo">Preventivo (Programado)</option>
                <option value="Correctivo">Correctivo (Reparación)</option>
                <option value="Inspección">Inspección / Revisión</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Técnico / Realizado por *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Juan Pérez (Operaciones DSV)"
              value={realizadoPor}
              onChange={(e) => setRealizadoPor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-600 dark:text-slate-400 mb-1">
              Observaciones / Trabajos Realizados
            </label>
            <textarea
              rows={3}
              placeholder="Ej. Se realizó limpieza de filtros, cambio de empaquetadura y verificación de presión. Equipo queda 100% operativo."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/60 rounded-xl text-xs space-y-1">
            <div className="font-semibold text-blue-900 dark:text-blue-200 flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              Actualización automática de ciclo
            </div>
            <p className="text-blue-700 dark:text-blue-300">
              Al guardar, la próxima mantención se programará automáticamente sumando su ciclo de <strong>{activo.frecuencia_mantencion || `${activo.frecuencia_dias || 365} días`}</strong>, dejando el activo con estado <strong>AL DÍA</strong>.
            </p>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-medium hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold shadow-sm transition disabled:opacity-50"
            >
              <Wrench className="w-3.5 h-3.5" />
              {loading ? 'Guardando...' : 'Completar Mantención'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}