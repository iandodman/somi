'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { ActivoCompleto } from '@/types';
import { ActivosFilters } from '@/components/activos/ActivosFilters';
import { ActivosTable } from '@/components/activos/ActivosTable';
import { ActivoModal } from '@/components/activos/ActivoModal';
import { DeleteActivoDialog } from '@/components/activos/DeleteActivoDialog';
import { AuthGuard } from '@/components/auth/AuthGuard';

const ITEMS_POR_PAGINA = 10;

export default function ActivosPage() {
  const [activos, setActivos] = useState<ActivoCompleto[]>([]);
  const [loading, setLoading] = useState(true);

  // Paginación
  const [paginaActual, setPaginaActual] = useState(1);

  // Filtros
  const [busqueda, setBusqueda] = useState('');
  const [sedeSeleccionada, setSedeSeleccionada] = useState('TODAS');
  const [edificioSeleccionado, setEdificioSeleccionado] = useState('TODOS');
  const [clasificacionSeleccionada, setClasificacionSeleccionada] = useState('TODAS');

  // Modales
  const [modalOpen, setModalOpen] = useState(false);
  const [activoAEditar, setActivoAEditar] = useState<ActivoCompleto | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [activoAEliminar, setActivoAEliminar] = useState<ActivoCompleto | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    cargarActivos();
  }, []);

  useEffect(() => {
    setPaginaActual(1);
  }, [busqueda, sedeSeleccionada, edificioSeleccionado, clasificacionSeleccionada]);

  async function cargarActivos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('vista_activos_completa')
      .select('*')
      .order('dias_restantes', { ascending: true, nullsFirst: false })
      .range(0, 2000);

    if (error) {
      console.error('Error cargando activos:', error);
    } else {
      setActivos(data || []);
    }
    setLoading(false);
  }

  async function confirmarEliminar() {
    if (!activoAEliminar) return;
    setIsDeleting(true);
    const { error } = await supabase.from('activos').delete().eq('id', activoAEliminar.id);

    if (error) {
      alert('Error al eliminar: ' + error.message);
    } else {
      setDeleteDialogOpen(false);
      setActivoAEliminar(null);
      cargarActivos();
    }
    setIsDeleting(false);
  }

  const sedes = useMemo(() => Array.from(new Set(activos.map((a) => a.nombre_sede).filter(Boolean))), [activos]);
  const edificios = useMemo(() => {
    return Array.from(
      new Set(
        activos
          .filter((a) => sedeSeleccionada === 'TODAS' || a.nombre_sede === sedeSeleccionada)
          .map((a) => a.nombre_edificio)
          .filter(Boolean)
      )
    );
  }, [activos, sedeSeleccionada]);

  const activosFiltrados = useMemo(() => {
    return activos.filter((a) => {
      const term = busqueda.toLowerCase().trim();
      const coincideBusqueda =
        term === '' ||
        a.codigo_activo?.toLowerCase().includes(term) ||
        a.tipo_equipo?.toLowerCase().includes(term) ||
        a.nombre_espacio?.toLowerCase().includes(term) ||
        a.responsable_default?.toLowerCase().includes(term) ||
        a.marca?.toLowerCase().includes(term);

      const coincideSede = sedeSeleccionada === 'TODAS' || a.nombre_sede === sedeSeleccionada;
      const coincideEdificio = edificioSeleccionado === 'TODOS' || a.nombre_edificio === edificioSeleccionado;
      const coincideClasificacion = clasificacionSeleccionada === 'TODAS' || a.clasificacion === clasificacionSeleccionada;

      return coincideBusqueda && coincideSede && coincideEdificio && coincideClasificacion;
    });
  }, [activos, busqueda, sedeSeleccionada, edificioSeleccionado, clasificacionSeleccionada]);

  const totalPaginas = Math.ceil(activosFiltrados.length / ITEMS_POR_PAGINA) || 1;
  
  const activosPaginados = useMemo(() => {
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    return activosFiltrados.slice(inicio, inicio + ITEMS_POR_PAGINA);
  }, [activosFiltrados, paginaActual]);

  return (
    <AuthGuard>
      <div className="max-w-7xl mx-auto space-y-6 transition-colors">
        
        {/* Cabecera Ejecutiva */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-brand-dark dark:text-white">
                Maestro de Activos
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30">
                {activosFiltrados.length} equipos
              </span>
            </div>
            <p className="text-xs sm:text-sm text-brand-metallic dark:text-slate-400 mt-0.5">
              Inventario técnico unificado, programación preventiva y control de recambio CAPEX
            </p>
          </div>
        </div>

        {/* Filtros Responsivos */}
        <ActivosFilters
          busqueda={busqueda}
          onBusquedaChange={setBusqueda}
          sedeSeleccionada={sedeSeleccionada}
          onSedeChange={setSedeSeleccionada}
          sedes={sedes}
          edificioSeleccionado={edificioSeleccionado}
          onEdificioChange={setEdificioSeleccionado}
          edificios={edificios}
          clasificacionSeleccionada={clasificacionSeleccionada}
          onClasificacionChange={setClasificacionSeleccionada}
          onNuevoActivo={() => {
            setActivoAEditar(null);
            setModalOpen(true);
          }}
        />

        {/* Contenedor Principal de Activos */}
        <div className="bg-white dark:bg-brand-cardDark rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs overflow-hidden">
          <ActivosTable
            activos={activosPaginados}
            loading={loading}
            page={paginaActual}
            totalPaginas={totalPaginas}
            totalCount={activosFiltrados.length}
            onPageChange={(nuevaPag) => setPaginaActual(nuevaPag)}
            onEditar={(activo) => {
              setActivoAEditar(activo);
              setModalOpen(true);
            }}
            onEliminar={(activo) => {
              setActivoAEliminar(activo);
              setDeleteDialogOpen(true);
            }}
          />
        </div>

        {/* Modal Editar / Nuevo */}
        <ActivoModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          onSuccess={cargarActivos}
          activoEditar={activoAEditar}
        />

        {/* Modal Confirmación de Eliminación */}
        <DeleteActivoDialog
          isOpen={deleteDialogOpen}
          activoNombre={activoAEliminar?.tipo_equipo || ''}
          onConfirm={confirmarEliminar}
          onCancel={() => {
            setDeleteDialogOpen(false);
            setActivoAEliminar(null);
          }}
          isDeleting={isDeleting}
        />
      </div>
    </AuthGuard>
  );
}