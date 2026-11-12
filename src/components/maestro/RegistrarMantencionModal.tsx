'use client';

import { useState, useEffect } from 'react';
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
  const [realizadoPor, setRealizadoPor] = useState('');
  const [tipoTrabajo, setTipoTrabajo] = useState<'Preventivo' | 'Correctivo' | 'Inspección'>('Preventivo');
  const [observaciones, setObservaciones] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Sincronizar responsable por defecto al abrir un activo distinto
  useEffect(() => {
    if (activo) {
      setRealizadoPor(activo.responsable_default || '');
      setFechaEjecucion(hoyStr);
      setObservaciones('');
      setErrorMsg(null);
    }
  }, [activo, hoyStr]);

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
    <div className="fixed inset-0 z-50 bg-brand-dark/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-brand-cardDark border border-slate-200/80 dark:border-slate-700/80 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5 text-brand-dark dark:text-slate-100 transition-colors">
        
        {/* Cabecera */}
        <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-3.5">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brand-cyan/15 text-brand-cyan rounded border border-brand-cyan/30">
                {activo.codigo_activo || 'SIN CÓDIGO'}
              </span>
              <span className="text-xs text-brand-metallic dark:text-slate-400">
                {activo.nombre_edificio} • {activo.nombre_espacio}
              </span>
            </div>
            <h2 className="text-lg font-extrabold text-brand-dark dark:text-white mt-1.5">
              Registrar Mantención
            </h2>
            <p className="text-xs text-brand-metallic dark:text-slate-300">
              {activo.tipo_equipo}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="text-brand-metallic hover:text-brand-dark dark:hover:text-white p-1 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-xs rounded-xl border border-rose-200 dark:border-rose-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleGuardar} className="space-y-4 text-sm">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-metallic dark:text-slate-400 mb-1">
                Fecha de Ejecución *
              </label>
              <input
                type="date"
                required
                value={fechaEjecucion}
                onChange={(e) => setFechaEjecucion(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-dark/60 rounded-xl text-sm text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-brand-metallic dark:text-slate-400 mb-1">
                Tipo de Trabajo
              </label>
              <select
                value={tipoTrabajo}
                onChange={(e) => setTipoTrabajo(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-dark/60 rounded-xl text-sm text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
              >
                <option value="Preventivo">Preventivo (Programado)</option>
                <option value="Correctivo">Correctivo (Reparación)</option>
                <option value="Inspección">Inspección / Revisión</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-metallic dark:text-slate-400 mb-1">
              Técnico / Realizado por *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Juan Pérez (Operaciones)"
              value={realizadoPor}
              onChange={(e) => setRealizadoPor(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-dark/60 rounded-xl text-sm text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-metallic dark:text-slate-400 mb-1">
              Observaciones / Trabajos Realizados
            </label>
            <textarea
              rows={3}
              placeholder="Ej. Se realizó limpieza de filtros, cambio de empaquetadura y verificación de presión. Equipo queda 100% operativo."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-dark/60 rounded-xl text-sm text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
            />
          </div>

          <div className="p-3.5 bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl text-xs space-y-1">
            <div className="font-bold text-brand-dark dark:text-white flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4 text-brand-cyan shrink-0" />
              Actualización automática de ciclo
            </div>
            <p className="text-brand-metallic dark:text-slate-300 leading-relaxed">
              Al guardar, la próxima mantención se programará automáticamente sumando su ciclo de <strong className="text-brand-dark dark:text-white">{activo.frecuencia_mantencion || `${activo.frecuencia_dias || 365} días`}</strong>, dejando el activo con estado <strong className="text-brand-cyan">AL DÍA</strong>.
            </p>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-brand-metallic dark:text-slate-300 hover:text-brand-dark dark:hover:text-white rounded-xl text-xs font-semibold hover:bg-slate-50 dark:hover:bg-brand-dark transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-brand-cyan hover:bg-brand-cyanHover text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95 disabled:opacity-50"
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