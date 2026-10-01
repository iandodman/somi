'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { ServicioRecurrenteCompleto, EstadoCumplimiento } from '@/types';
import { ServicioModal } from '@/components/servicios/ServicioModal';
import { 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar, 
  Plus, 
  Search, 
  FileText, 
  Building2,
  Trash2,
  Edit3
} from 'lucide-react';

const ESTILOS_ESTADO: Record<string, string> = {
  VENCIDO: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
  'POR VENCER': 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900',
  'AL DÍA': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
};

export default function ServiciosPage() {
  const [servicios, setServicios] = useState<ServicioRecurrenteCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busqueda, setBusqueda] = useState('');
  const [filtroEstado, setFiltroEstado] = useState<EstadoCumplimiento | 'TODOS'>('TODOS');
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>('TODAS');

  const [modalOpen, setModalOpen] = useState(false);
  const [servicioAEditar, setServicioAEditar] = useState<ServicioRecurrenteCompleto | null>(null);

  useEffect(() => {
    cargarServicios();
  }, []);

  async function cargarServicios() {
    setLoading(true);
    const { data, error } = await supabase
      .from('vista_servicios_completa')
      .select('*')
      .order('dias_restantes', { ascending: true, nullsFirst: false });

    if (!error && data) {
      setServicios(data);
    }
    setLoading(false);
  }

  async function eliminarServicio(id: string) {
    if (!confirm('¿Estás seguro de eliminar este servicio del registro normativo?')) return;
    const { error } = await supabase.from('servicios_recurrentes').delete().eq('id', id);
    if (!error) {
      cargarServicios();
    } else {
      alert('Error al eliminar: ' + error.message);
    }
  }

  // Métricas
  const total = servicios.length;
  const vencidos = servicios.filter((s) => s.estado_cumplimiento === 'VENCIDO').length;
  const porVencer = servicios.filter((s) => s.estado_cumplimiento === 'POR VENCER').length;
  const alDia = servicios.filter((s) => s.estado_cumplimiento === 'AL DÍA').length;

  const serviciosFiltrados = useMemo(() => {
    return servicios.filter((s) => {
      const term = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        term === '' ||
        s.nombre?.toLowerCase().includes(term) ||
        s.organismo_regulador?.toLowerCase().includes(term) ||
        s.proveedor_empresa?.toLowerCase().includes(term) ||
        s.numero_certificado_resolucion?.toLowerCase().includes(term);

      const coincideEstado = filtroEstado === 'TODOS' || s.estado_cumplimiento === filtroEstado;
      const coincideCat = categoriaFiltro === 'TODAS' || s.categoria === categoriaFiltro;

      return coincideBusqueda && coincideEstado && coincideCat;
    });
  }, [servicios, busqueda, filtroEstado, categoriaFiltro]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 p-3 sm:p-6 lg:p-8 space-y-6 transition-colors">
      
      {/* Cabecera */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-blue-600" />
            Servicios Recurrentes y Cumplimiento Normativo
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Certificaciones, resoluciones sanitarias y mantenciones periódicas legales
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setServicioAEditar(null);
            setModalOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition"
        >
          <Plus className="w-4 h-4" />
          Nuevo Servicio
        </button>
      </div>

      {/* Tarjetas de Métricas de Cumplimiento */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => setFiltroEstado('TODOS')}
          className={`p-4 rounded-xl border text-left transition shadow-xs ${
            filtroEstado === 'TODOS'
              ? 'bg-blue-600 text-white border-blue-600 ring-2 ring-blue-500/40 shadow-md'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider opacity-80">Total Servicios</div>
          <div className="text-xl sm:text-2xl font-bold mt-1">{total}</div>
        </button>

        <button
          type="button"
          onClick={() => setFiltroEstado('VENCIDO')}
          className={`p-4 rounded-xl border text-left transition shadow-xs ${
            filtroEstado === 'VENCIDO'
              ? 'bg-rose-50 dark:bg-rose-950/60 border-rose-500 ring-2 ring-rose-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400 flex items-center gap-1">
            <XCircle className="w-3.5 h-3.5" /> Vencidos
          </div>
          <div className="text-xl sm:text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">{vencidos}</div>
        </button>

        <button
          type="button"
          onClick={() => setFiltroEstado('POR VENCER')}
          className={`p-4 rounded-xl border text-left transition shadow-xs ${
            filtroEstado === 'POR VENCER'
              ? 'bg-amber-50 dark:bg-amber-950/60 border-amber-500 ring-2 ring-amber-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> Por Vencer
          </div>
          <div className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{porVencer}</div>
        </button>

        <button
          type="button"
          onClick={() => setFiltroEstado('AL DÍA')}
          className={`p-4 rounded-xl border text-left transition shadow-xs ${
            filtroEstado === 'AL DÍA'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 border-emerald-500 ring-2 ring-emerald-500/30'
              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
          }`}
        >
          <div className="text-[11px] font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Al Día
          </div>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{alDia}</div>
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por servicio, regulador, certificado o proveedor..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            className="w-full pl-10 pr-3.5 py-2 border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
          />
        </div>

        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white"
        >
          <option value="TODAS">Todas las categorías</option>
          <option value="SANITARIO">Sanitario</option>
          <option value="TRANSPORTE_VERTICAL">Transporte Vertical</option>
          <option value="SEGURIDAD">Seguridad</option>
          <option value="INSTALACIONES">Instalaciones</option>
          <option value="AMBIENTAL">Ambiental</option>
        </select>
      </div>

      {/* Lista de Servicios: Patrón Híbrido Móvil / Escritorio */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        
        {/* VISTA MÓVIL: TARJETAS */}
        <div className="block md:hidden divide-y divide-slate-100 dark:divide-slate-800">
          {loading ? (
            <div className="p-8 text-center text-xs text-slate-400">Cargando servicios normativos...</div>
          ) : serviciosFiltrados.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">No hay servicios registrados con estos filtros.</div>
          ) : (
            serviciosFiltrados.map((s) => (
              <div key={s.id} className="p-4 space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 uppercase">
                    {s.categoria}
                  </span>
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${ESTILOS_ESTADO[s.estado_cumplimiento]}`}>
                    {s.estado_cumplimiento}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-base leading-snug">{s.nombre}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {s.organismo_regulador || 'Sin regulador especificado'} {s.normativa_referencia ? `(${s.normativa_referencia})` : ''}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-xl">
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Vencimiento</span>
                    <span className="font-mono font-medium text-slate-800 dark:text-slate-200">{s.fecha_proximo_vencimiento}</span>
                    {s.dias_restantes !== null && (
                      <div className={`text-[10px] font-bold mt-0.5 ${
                        s.dias_restantes < 0 ? 'text-rose-600' : s.dias_restantes <= 30 ? 'text-amber-600' : 'text-slate-500'
                      }`}>
                        {s.dias_restantes < 0 ? `Vencido (${Math.abs(s.dias_restantes)}d)` : `En ${s.dias_restantes} días`}
                      </div>
                    )}
                  </div>
                  <div>
                    <span className="text-[10px] uppercase font-semibold text-slate-400 block">Certificado / Prov.</span>
                    <span className="font-mono text-xs text-blue-600 dark:text-blue-400 block truncate">{s.numero_certificado_resolucion || 'S/N'}</span>
                    <span className="text-[11px] text-slate-500 truncate block">{s.proveedor_empresa || '—'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => {
                      setServicioAEditar(s);
                      setModalOpen(true);
                    }}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold"
                  >
                    <Edit3 className="w-3.5 h-3.5" /> Editar / Renovar
                  </button>
                  <button
                    type="button"
                    onClick={() => eliminarServicio(s.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* VISTA ESCRITORIO: TABLA COMPLETA */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-800/40 text-slate-600 dark:text-slate-400 font-semibold text-xs uppercase tracking-wider">
                <th className="p-3.5">Servicio / Categoría</th>
                <th className="p-3.5">Organismo / Norma</th>
                <th className="p-3.5">Proveedor</th>
                <th className="p-3.5">N° Certificado</th>
                <th className="p-3.5">Próx. Vencimiento</th>
                <th className="p-3.5 text-center">Estado</th>
                <th className="p-3.5 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
              {loading ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-slate-400">Cargando servicios normativos...</td>
                </tr>
              ) : serviciosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-xs text-slate-400">No hay servicios registrados con estos filtros.</td>
                </tr>
              ) : (
                serviciosFiltrados.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition">
                    <td className="p-3.5">
                      <div className="font-bold text-slate-900 dark:text-white">{s.nombre}</div>
                      <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">{s.categoria}</span>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300">
                      <div>{s.organismo_regulador || '—'}</div>
                      <div className="text-[11px] text-slate-400">{s.normativa_referencia || '—'}</div>
                    </td>
                    <td className="p-3.5 text-slate-600 dark:text-slate-300 font-medium">
                      {s.proveedor_empresa || '—'}
                    </td>
                    <td className="p-3.5 font-mono text-xs text-blue-600 dark:text-blue-400">
                      {s.numero_certificado_resolucion || '—'}
                    </td>
                    <td className="p-3.5 font-mono text-xs">
                      <div>{s.fecha_proximo_vencimiento}</div>
                      {s.dias_restantes !== null && (
                        <div className={`text-[10px] font-bold ${
                          s.dias_restantes < 0 ? 'text-rose-600' : s.dias_restantes <= 30 ? 'text-amber-600' : 'text-slate-400'
                        }`}>
                          {s.dias_restantes < 0 ? `Vencido (${Math.abs(s.dias_restantes)}d)` : `En ${s.dias_restantes} días`}
                        </div>
                      )}
                    </td>
                    <td className="p-3.5 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border ${ESTILOS_ESTADO[s.estado_cumplimiento]}`}>
                        {s.estado_cumplimiento}
                      </span>
                    </td>
                    <td className="p-3.5 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setServicioAEditar(s);
                            setModalOpen(true);
                          }}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 hover:text-blue-600 rounded-lg transition"
                          title="Editar / Renovar servicio"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => eliminarServicio(s.id)}
                          className="p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-rose-600 rounded-lg transition"
                          title="Eliminar registro"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>

      {/* Modal */}
      <ServicioModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSuccess={cargarServicios}
        servicioEditar={servicioAEditar}
      />

    </div>
  );
}