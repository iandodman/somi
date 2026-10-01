'use client';

import { ChevronLeft, ChevronRight } from 'lucide-react';

interface ActivosPaginationProps {
  page: number;
  totalPaginas: number;
  totalCount?: number;
  onPageChange: (newPage: number) => void;
}

export function ActivosPagination({ page, totalPaginas, totalCount, onPageChange }: ActivosPaginationProps) {
  if (totalPaginas <= 1) return null;

  return (
    <div className="flex items-center justify-between px-4 py-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
      <span className="text-slate-500 dark:text-slate-400 font-medium">
        Página <span className="font-bold text-slate-900 dark:text-white">{page}</span> de{' '}
        <span className="font-bold text-slate-900 dark:text-white">{totalPaginas}</span>
        {totalCount !== undefined && (
          <span className="hidden sm:inline text-slate-400 dark:text-slate-500 ml-1">
            ({totalCount} activos)
          </span>
        )}
      </span>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Anterior</span>
        </button>
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPaginas}
          className="flex items-center gap-1 px-3 py-1.5 border border-slate-300 dark:border-slate-700 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition"
        >
          <span>Siguiente</span>
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}