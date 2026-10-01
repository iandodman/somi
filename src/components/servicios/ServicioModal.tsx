'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { ServicioRecurrenteCompleto, CategoriaServicio } from '@/types';
import { X, Calendar, Building2, ShieldCheck, FileText, CheckCircle2 } from 'lucide-react';

interface ServicioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  servicioEditar?: ServicioRecurrenteCompleto | null;
}

export function ServicioModal({ isOpen, onClose, onSuccess, servicioEditar }: ServicioModalProps) {
  const [loading, setLoading] = useState(false);
  const [nombre, setNombre] = useState('');
  const [categoria, setCategoria] = useState<CategoriaServicio>('SANITARIO');
  const [organismoRegulador, setOrganismoRegulador] = useState('');
  const [normativaReferencia, setNormativaReferencia] = useState('');
  const [periodicidadDias, setPeriodicidadDias] = useState<number>(30);
  const [fechaUltima, setFechaUltima] = useState(new Date().toISOString().split('T')[0]);
  const [proveedorEmpresa, setProveedorEmpresa] = useState('');
  const [numeroCertificado, setNumeroCertificado] = useState('');
  const [costoClp, setCostoClp] = useState<number>(0);
  const [observaciones, setObservaciones] = useState('');

  useEffect(() => {
    if (servicioEditar) {
      setNombre(servicioEditar.nombre);
      setCategoria(servicioEditar.categoria);
      setOrganismoRegulador(servicioEditar.organismo_regulador || '');
      setNormativaReferencia(servicioEditar.normativa_referencia || '');
      setPeriodicidadDias(servicioEditar.periodicidad_dias);
      setFechaUltima(servicioEditar.fecha_ultima_ejecucion);
      setProveedorEmpresa(servicioEditar.proveedor_empresa || '');
      setNumeroCertificado(servicioEditar.numero_certificado_resolucion || '');
      setCostoClp(servicioEditar.costo_estimado_clp || 0);
      setObservaciones(servicioEditar.observaciones || '');
    } else {
      setNombre('');
      setCategoria('SANITARIO');
      setOrganismoRegulador('');
      setNormativaReferencia('');
      setPeriodicidadDias(30);
      setFechaUltima(new Date().toISOString().split('T')[0]);
      setProveedorEmpresa('');
      setNumeroCertificado('');
      setCostoClp(0);
      setObservaciones('');
    }
  }, [servicioEditar, isOpen]);

  if (!isOpen) return null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);

    // Calcular fecha del próximo vencimiento
    const fechaBase = new Date(fechaUltima);
    fechaBase.setDate(fechaBase.getDate() + Number(periodicidadDias));
    const fechaProximoVencimiento = fechaBase.toISOString().split('T')[0];

    // Obtener colegio por defecto
    const { data: colegio } = await supabase.from('colegios').select('id').limit(1).single();

    const payload = {
      nombre,
      categoria,
      organismo_regulador: organismoRegulador || null,
      normativa_referencia: normativaReferencia || null,
      periodicidad_dias: Number(periodicidadDias),
      fecha_ultima_ejecucion: fechaUltima,
      fecha_proximo_vencimiento: fechaProximoVencimiento,
      proveedor_empresa: proveedorEmpresa || null,
      numero_certificado_resolucion: numeroCertificado || null,
      costo_estimado_clp: Number(costoClp) || 0,
      observaciones: observaciones || null,
      colegio_id: colegio?.id || null,
    };

    let error;
    if (servicioEditar) {
      const res = await supabase.from('servicios_recurrentes').update(payload).eq('id', servicioEditar.id);
      error = res.error;
    } else {
      const res = await supabase.from('servicios_recurrentes').insert([payload]);
      error = res.error;
    }

    setLoading(false);
    if (error) {
      alert('Error guardando servicio: ' + error.message);
    } else {
      onSuccess();
      onClose();
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl w-full max-w-lg shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 rounded-xl">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-slate-900 dark:text-white text-base">
                {servicioEditar ? 'Actualizar Servicio Normativo' : 'Nuevo Servicio Recurrente'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Control de resoluciones sanitarias y certificaciones legales
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Nombre del Servicio *
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Fumigación y Desratización Trimestral"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaServicio)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white"
              >
                <option value="SANITARIO">Sanitario (Plagas, Agua)</option>
                <option value="TRANSPORTE_VERTICAL">Transporte Vertical (Ascensores)</option>
                <option value="SEGURIDAD">Seguridad (Extintores, Campanas)</option>
                <option value="INSTALACIONES">Instalaciones (Gas, Eléctrico)</option>
                <option value="AMBIENTAL">Ambiental (Calefacción, Residuos)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Organismo Regulador
              </label>
              <input
                type="text"
                placeholder="Ej. Seremi de Salud / SEC / MINVU"
                value={organismoRegulador}
                onChange={(e) => setOrganismoRegulador(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white"
              >
              </input>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Periodicidad (Días) *
              </label>
              <input
                type="number"
                min="1"
                required
                value={periodicidadDias}
                onChange={(e) => setPeriodicidadDias(Number(e.target.value))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white font-mono"
              />
              <span className="text-[10px] text-slate-400">30 = Mensual | 90 = Trimestral | 365 = Anual</span>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Fecha Última Ejecución *
              </label>
              <input
                type="date"
                required
                value={fechaUltima}
                onChange={(e) => setFechaUltima(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                Empresa Proveedora
              </label>
              <input
                type="text"
                placeholder="Ej. Schindler / PlagStop"
                value={proveedorEmpresa}
                onChange={(e) => setProveedorEmpresa(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
                N° Certificado / Resolución
              </label>
              <input
                type="text"
                placeholder="Ej. RES-SAN-884"
                value={numeroCertificado}
                onChange={(e) => setNumeroCertificado(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-1">
              Observaciones
            </label>
            <textarea
              rows={2}
              placeholder="Detalles sobre muestras, alcances o exigencias..."
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-sm text-slate-900 dark:text-white"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl transition shadow-xs disabled:opacity-50"
            >
              {loading ? 'Guardando...' : servicioEditar ? 'Guardar Cambios' : 'Registrar Servicio'}
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}