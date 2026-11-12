'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { ActivoCompleto } from '@/types';
import { RegistrarMantencionModal } from '@/components/maestro/RegistrarMantencionModal';
import { 
  Search, 
  Wrench, 
  MapPin, 
  Building2, 
  ChevronLeft, 
  ChevronRight
} from 'lucide-react';
import { AuthGuard } from '@/components/auth/AuthGuard';

const ITEMS_POR_PAGINA = 10;

const ESTILOS_ESTADO: Record<string, string> = {
  VENCIDO: 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-900',
  'POR VENCER': 'bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-900',
  'AL DÍA': 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
};

export default function MaestroPage() {
  const [activos, setActivos] = useState<ActivoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  const [busquedaCodigo, setBusquedaCodigo] = useState('');
  
  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);

  // Modal de registro
  const [activoSeleccionado, setActivoSeleccionado] = useState<ActivoCompleto | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  // Filtros
  const [filtroVista, setFiltroVista] = useState<'URGENTES' | 'TODOS'>('URGENTES');
  const [edificioFiltro, setEdificioFiltro] = useState<string>('TODOS');

  useEffect(() => {
    cargarActivos();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busquedaCodigo, filtroVista, edificioFiltro]);

  async function cargarActivos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('vista_activos_completa')
      .select('*')
      .order('dias_restantes', { ascending: true, nullsFirst: false })
      .range(0, 2000);

    if (!error && data) {
      setActivos(data);
    }
    setLoading(false);
  }

  // Búsqueda directa por código exacto en la caja superior
  const activoEncontradoExacto = useMemo(() => {
    const term = busquedaCodigo.trim().toLowerCase();
    if (!term) return null;
    return activos.find((a) => a.codigo_activo?.toLowerCase() === term);
  }, [activos, busquedaCodigo]);

  // Lista de edificios para el selector
  const edificios = useMemo(() => {
    return Array.from(new Set(activos.map((a) => a.nombre_edificio).filter(Boolean)));
  }, [activos]);

  // Contadores para los botones Urgentes vs Todos
  const { totalUrgentes, totalTodos, tareasFiltradas } = useMemo(() => {
    const term = busquedaCodigo.trim().toLowerCase();

    const base = activos.filter((a) => {
      const coincideTexto =
        term === '' ||
        a.codigo_activo?.toLowerCase().includes(term) ||
        a.tipo_equipo?.toLowerCase().includes(term) ||
        a.nombre_espacio?.toLowerCase().includes(term);

      const coincideEdificio =
        edificioFiltro === 'TODOS' || a.nombre_edificio === edificioFiltro;

      return coincideTexto && coincideEdificio;
    });

    const urgentes = base.filter(
      (a) => a.estado_mantencion === 'VENCIDO' || a.estado_mantencion === 'POR VENCER'
    );

    const filtradas = filtroVista === 'URGENTES' ? urgentes : base;

    return {
      totalUrgentes: urgentes.length,
      totalTodos: base.length,
      tareasFiltradas: filtradas,
    };
  }, [activos, busquedaCodigo, edificioFiltro, filtroVista]);

  // Cálculo de Paginación
  const totalPaginas = Math.ceil(tareasFiltradas.length / ITEMS_POR_PAGINA) || 1;
  const tareasPaginadas = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return tareasFiltradas.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [tareasFiltradas, paginaActual]);

  return (
    <AuthGuard>
      <div className="max-w-2xl mx-auto pb-16 space-y-5 transition-colors">

        {/* Encabezado Maestro */}
        <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="p-2.5 bg-brand-cyan text-white rounded-xl shadow-xs shrink-0">
            <Wrench className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold tracking-tight text-brand-dark dark:text-white">
              Panel Técnico en Terreno
            </h1>
            <p className="text-xs text-brand-metallic dark:text-slate-400">
              Búsqueda rápida por placa y registro inmediato de mantención
            </p>
          </div>
        </div>

        {/* Caja de Búsqueda de Código Rápida */}
        <div className="bg-white dark:bg-brand-cardDark p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-brand-metallic dark:text-slate-400">
            Código de Activo / Placa
          </label>
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-metallic" />
            <input
              type="text"
              placeholder="Ej. DSV-0001, DSV-0150..."
              value={busquedaCodigo}
              onChange={(e) => setBusquedaCodigo(e.target.value)}
              className="w-full pl-11 pr-4 py-2.5 bg-slate-50 dark:bg-brand-dark/60 border border-slate-200 dark:border-slate-700 rounded-xl text-base font-mono uppercase tracking-wider text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
            />
          </div>

          {/* Tarjeta de coincidencia exacta inmediata */}
          {activoEncontradoExacto && (
            <div className="p-4 bg-brand-cyan/10 border border-brand-cyan/30 rounded-xl mt-3 space-y-3 animate-in fade-in">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 bg-brand-cyan text-white rounded">
                    {activoEncontradoExacto.codigo_activo}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold border ${
                      ESTILOS_ESTADO[activoEncontradoExacto.estado_mantencion] || ''
                    }`}
                  >
                    {activoEncontradoExacto.estado_mantencion}
                  </span>
                </div>

                <h3 className="font-bold text-brand-dark dark:text-white text-base">
                  {activoEncontradoExacto.tipo_equipo}
                </h3>
                <p className="text-xs text-brand-metallic dark:text-slate-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-cyan shrink-0" />
                  <span>
                    {activoEncontradoExacto.nombre_edificio}
                    {activoEncontradoExacto.nivel_piso ? ` • ${activoEncontradoExacto.nivel_piso}` : ''} ({activoEncontradoExacto.nombre_espacio})
                  </span>
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActivoSeleccionado(activoEncontradoExacto);
                  setModalAbierto(true);
                }}
                className="w-full flex items-center justify-center gap-2 py-3 bg-brand-cyan hover:bg-brand-cyanHover text-white rounded-xl text-sm font-bold shadow-md transition active:scale-98"
              >
                <Wrench className="w-4 h-4" />
                Registrar Mantención Realizada
              </button>
            </div>
          )}
        </div>

        {/* Sección: Tareas de Mantenimiento por Recorrer */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
            <div>
              <h2 className="text-sm sm:text-base font-bold text-brand-dark dark:text-white">
                Equipos por Mantener
              </h2>
              <p className="text-xs text-brand-metallic dark:text-slate-400">
                Lista de trabajo para el recorrido en terreno
              </p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Selector Urgentes / Todos */}
              <div className="inline-flex rounded-xl border border-slate-200/80 dark:border-slate-700/80 p-0.5 bg-white dark:bg-brand-cardDark text-xs shrink-0 shadow-2xs">
                <button
                  type="button"
                  onClick={() => setFiltroVista('URGENTES')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    filtroVista === 'URGENTES'
                      ? 'bg-brand-cyan text-white font-semibold shadow-xs'
                      : 'text-brand-metallic dark:text-slate-400 hover:text-brand-dark dark:hover:text-white'
                  }`}
                >
                  Urgentes ({totalUrgentes})
                </button>
                <button
                  type="button"
                  onClick={() => setFiltroVista('TODOS')}
                  className={`px-3 py-1.5 rounded-lg font-medium transition ${
                    filtroVista === 'TODOS'
                      ? 'bg-brand-cyan text-white font-semibold shadow-xs'
                      : 'text-brand-metallic dark:text-slate-400 hover:text-brand-dark dark:hover:text-white'
                  }`}
                >
                  Todos ({totalTodos})
                </button>
              </div>

              {/* Selector Edificio */}
              <select
                value={edificioFiltro}
                onChange={(e) => setEdificioFiltro(e.target.value)}
                className="w-full sm:w-auto px-2.5 py-1.5 text-xs bg-white dark:bg-brand-cardDark border border-slate-200/80 dark:border-slate-700/80 rounded-xl text-brand-dark dark:text-slate-100 focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition"
              >
                <option value="TODOS">Todos los edificios</option>
                {edificios.map((ed) => (
                  <option key={ed} value={ed}>{ed}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Lista de Activos Paginados */}
          <div className="bg-white dark:bg-brand-cardDark rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
            {loading ? (
              <div className="p-10 text-center text-xs text-brand-metallic">
                Cargando equipos asignados...
              </div>
            ) : tareasPaginadas.length === 0 ? (
              <div className="p-10 text-center text-xs text-brand-metallic">
                No hay equipos pendientes con los filtros seleccionados.
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-slate-800">
                {tareasPaginadas.map((a, idx) => {
                  const estadoEstilo =
                    ESTILOS_ESTADO[a.estado_mantencion] ||
                    'bg-slate-100 dark:bg-brand-dark text-brand-metallic border-transparent';

                  return (
                    <article
                      key={a.id || `tar-${idx}`}
                      className="p-3.5 sm:p-4 hover:bg-slate-50/70 dark:hover:bg-brand-dark/40 transition flex items-center justify-between gap-3"
                    >
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-brand-cyan">
                            {a.codigo_activo || 'SIN CÓDIGO'}
                          </span>
                          <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${estadoEstilo}`}>
                            {a.estado_mantencion}
                          </span>
                        </div>

                        <h3 className="font-semibold text-brand-dark dark:text-slate-100 text-sm truncate">
                          {a.tipo_equipo}
                        </h3>

                        <p className="text-xs text-brand-metallic dark:text-slate-400 flex items-center gap-1 truncate">
                          <Building2 className="w-3.5 h-3.5 text-brand-metallic shrink-0" />
                          <span className="truncate">
                            {a.nombre_edificio} • {a.nombre_espacio}
                          </span>
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActivoSeleccionado(a);
                          setModalAbierto(true);
                        }}
                        className="px-3.5 py-2 bg-slate-100 dark:bg-brand-dark hover:bg-brand-cyan hover:text-white dark:hover:bg-brand-cyan text-brand-dark dark:text-slate-200 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0 active:scale-95 shadow-2xs"
                        title="Registrar mantención"
                      >
                        <Wrench className="w-3.5 h-3.5" />
                        <span>Mantener</span>
                      </button>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Barra de Paginación */}
            {!loading && totalPaginas > 1 && (
              <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/70 dark:bg-brand-dark/50 text-xs">
                <span className="text-brand-metallic dark:text-slate-400 font-medium">
                  Página <span className="font-bold text-brand-dark dark:text-white">{paginaActual}</span> de{' '}
                  <span className="font-bold text-brand-dark dark:text-white">{totalPaginas}</span>
                  <span className="hidden sm:inline text-brand-metallic ml-1">
                    ({tareasFiltradas.length} equipos)
                  </span>
                </span>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setPaginaActual((p) => p - 1)}
                    disabled={paginaActual <= 1}
                    className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-brand-cardDark text-brand-dark dark:text-slate-200 hover:border-brand-cyan hover:text-brand-cyan disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Anterior</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaginaActual((p) => p + 1)}
                    disabled={paginaActual >= totalPaginas}
                    className="flex items-center gap-1 px-3 py-1.5 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-brand-cardDark text-brand-dark dark:text-slate-200 hover:border-brand-cyan hover:text-brand-cyan disabled:opacity-40 disabled:cursor-not-allowed transition"
                  >
                    <span>Siguiente</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal de Registro */}
        <RegistrarMantencionModal
          isOpen={modalAbierto}
          activo={activoSeleccionado}
          onClose={() => {
            setModalAbierto(false);
            setActivoSeleccionado(null);
          }}
          onSuccess={cargarActivos}
        />

      </div>
    </AuthGuard>
  );
}