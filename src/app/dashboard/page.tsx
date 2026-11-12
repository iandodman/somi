'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { ActivoCompleto, EstadoMantencion } from '@/types';
import { DashboardMetrics } from '@/components/dashboard/DashboardMetrics';
import { DashboardTable } from '@/components/dashboard/DashboardTable';
import { Search, Plus, Wrench } from 'lucide-react';
import { AuthGuard } from '@/components/auth/AuthGuard';

const PAGE_SIZE = 10;

export default function DashboardPage() {
  const [activos, setActivos] = useState<ActivoCompleto[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Paginación
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [edificioFiltro, setEdificioFiltro] = useState<string>('TODOS');
  const [clasificacionFiltro, setClasificacionFiltro] = useState<string>('TODAS');
  const [filtroRapido, setFiltroRapido] = useState<EstadoMantencion | 'TODOS' | 'CAPEX'>('TODOS');

  // Listado único de edificios para el selector
  const [edificios, setEdificios] = useState<string[]>([]);

  // Métricas globales
  const [metrics, setMetrics] = useState({
    totalActivos: 0,
    vencidos: 0,
    porVencer: 0,
    alDia: 0,
    alertasCapex: 0,
  });

  // 1. Cargar edificios disponibles para el selector
  useEffect(() => {
    async function cargarEdificios() {
      const { data } = await supabase
        .from('vista_activos_completa')
        .select('nombre_edificio');
      
      if (data) {
        const unicos = Array.from(new Set(data.map((d) => d.nombre_edificio).filter(Boolean)));
        setEdificios(unicos as string[]);
      }
    }
    cargarEdificios();
  }, []);

  // 2. Cargar contadores de métricas globales de la vista
  useEffect(() => {
    async function cargarMetricas() {
      const { data } = await supabase
        .from('vista_activos_completa')
        .select('estado_mantencion, alerta_recambio_capex');

      if (data) {
        setMetrics({
          totalActivos: data.length,
          vencidos: data.filter((a) => a.estado_mantencion === 'VENCIDO').length,
          porVencer: data.filter((a) => a.estado_mantencion === 'POR VENCER').length,
          alDia: data.filter((a) => a.estado_mantencion === 'AL DÍA').length,
          alertasCapex: data.filter((a) => a.alerta_recambio_capex).length,
        });
      }
    }
    cargarMetricas();
  }, []);

  // 3. Cargar activos paginados desde Supabase con filtros aplicados
  const cargarActivosPaginados = useCallback(async () => {
    setLoading(true);

    const from = (page - 1) * PAGE_SIZE;
    const to = from + PAGE_SIZE - 1;

    let query = supabase
      .from('vista_activos_completa')
      .select('*', { count: 'exact' })
      .order('dias_restantes', { ascending: true, nullsFirst: false });

    if (busqueda.trim() !== '') {
      const term = `%${busqueda.trim()}%`;
      query = query.or(`tipo_equipo.ilike.${term},codigo_activo.ilike.${term},nombre_espacio.ilike.${term},marca.ilike.${term}`);
    }

    if (edificioFiltro !== 'TODOS') {
      query = query.eq('nombre_edificio', edificioFiltro);
    }

    if (clasificacionFiltro !== 'TODAS') {
      query = query.eq('clasificacion', clasificacionFiltro);
    }

    if (filtroRapido === 'CAPEX') {
      query = query.eq('alerta_recambio_capex', true);
    } else if (filtroRapido !== 'TODOS') {
      query = query.eq('estado_mantencion', filtroRapido);
    }

    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.error('Error en Supabase:', error);
    } else {
      setActivos(data || []);
      setTotalCount(count ?? 0);
    }

    setLoading(false);
  }, [page, busqueda, edificioFiltro, clasificacionFiltro, filtroRapido]);

  useEffect(() => {
    setPage(1);
  }, [busqueda, edificioFiltro, clasificacionFiltro, filtroRapido]);

  useEffect(() => {
    cargarActivosPaginados();
  }, [cargarActivosPaginados]);

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto space-y-6 transition-colors">
        
        {/* Cabecera Ejecutiva con Acciones Rápidas (estilo Asset Nexus) */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand-dark dark:text-white">
              Panel de Control Operacional
            </h1>
            <p className="text-xs sm:text-sm text-brand-metallic dark:text-slate-400 mt-0.5">
              Visión general de estado preventivo, criticidad normativa y ciclo de vida
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <Link
              href="/maestro"
              className="flex items-center gap-1.5 px-3.5 py-2 bg-white dark:bg-brand-cardDark hover:bg-slate-50 dark:hover:bg-slate-800 text-brand-dark dark:text-slate-200 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold shadow-2xs transition"
            >
              <Wrench className="w-3.5 h-3.5 text-brand-cyan" />
              <span>Registro Terreno</span>
            </Link>
            <Link
              href="/activos"
              className="flex items-center gap-1.5 px-4 py-2 bg-brand-cyan hover:bg-brand-cyanHover text-white rounded-xl text-xs font-bold shadow-xs transition active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Gestionar Activos</span>
            </Link>
          </div>
        </div>

        {/* Componente Modular de Métricas */}
        <DashboardMetrics
          totalActivos={metrics.totalActivos}
          vencidos={metrics.vencidos}
          porVencer={metrics.porVencer}
          alDia={metrics.alDia}
          alertasCapex={metrics.alertasCapex}
          filtroRapido={filtroRapido}
          onFiltroRapidoChange={setFiltroRapido}
        />

        {/* Barra de Filtros */}
        <div className="bg-white dark:bg-brand-cardDark p-3.5 sm:p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-metallic" />
            <input
              type="text"
              placeholder="Buscar por código de activo, equipo, marca o recinto..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-3.5 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-dark/60 rounded-xl text-xs sm:text-sm text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
            />
          </div>

          <div className="flex items-center gap-2">
            <select
              value={edificioFiltro}
              onChange={(e) => setEdificioFiltro(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-dark/80 rounded-xl text-xs sm:text-sm text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition"
            >
              <option value="TODOS">Todos los edificios</option>
              {edificios.map((ed) => (
                <option key={ed} value={ed}>{ed}</option>
              ))}
            </select>

            <select
              value={clasificacionFiltro}
              onChange={(e) => setClasificacionFiltro(e.target.value)}
              className="flex-1 sm:flex-none px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-brand-dark/80 rounded-xl text-xs sm:text-sm text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition"
            >
              <option value="TODAS">Toda criticidad</option>
              <option value="OPERACIÓN">OPERACIÓN</option>
              <option value="SEGURIDAD">SEGURIDAD</option>
              <option value="LEGAL">LEGAL</option>
              <option value="GENERAL">GENERAL</option>
            </select>
          </div>
        </div>

        {/* Tabla con Paginación */}
        <DashboardTable
          activos={activos}
          loading={loading}
          page={page}
          totalPages={Math.ceil(totalCount / PAGE_SIZE)}
          totalCount={totalCount}
          onPageChange={(newPage) => setPage(newPage)}
        />

      </div>
    </AuthGuard>
  );
}