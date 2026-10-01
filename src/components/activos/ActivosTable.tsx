'use client';

import { ActivoCompleto } from '@/types';
import { ActivosMobileView } from './ActivosMobileView';
import { ActivosDesktopView } from './ActivosDesktopView';
import { ActivosPagination } from './ActivosPagination';

interface ActivosTableProps {
  activos: ActivoCompleto[];
  loading: boolean;
  page?: number;
  totalPaginas?: number;
  totalCount?: number;
  onPageChange?: (newPage: number) => void;
  onEditar: (activo: ActivoCompleto) => void;
  onEliminar: (activo: ActivoCompleto) => void;
}

export function ActivosTable({
  activos,
  loading,
  page = 1,
  totalPaginas = 1,
  totalCount,
  onPageChange,
  onEditar,
  onEliminar,
}: ActivosTableProps) {
  if (loading) {
    return (
      <div className="p-12 text-center text-xs sm:text-sm text-slate-400">
        Cargando inventario maestro...
      </div>
    );
  }

  if (activos.length === 0) {
    return (
      <div className="p-12 text-center text-xs sm:text-sm text-slate-400">
        No se encontraron activos con los filtros seleccionados.
      </div>
    );
  }

  return (
    <div>
      {/* Contenedor Móvil (< md) */}
      <div className="block md:hidden">
        <ActivosMobileView activos={activos} onEditar={onEditar} onEliminar={onEliminar} />
      </div>

      {/* Contenedor Escritorio (>= md) */}
      <div className="hidden md:block overflow-x-auto">
        <ActivosDesktopView activos={activos} onEditar={onEditar} onEliminar={onEliminar} />
      </div>

      {/* Paginación Compartida */}
      {onPageChange && (
        <ActivosPagination
          page={page}
          totalPaginas={totalPaginas}
          totalCount={totalCount}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}