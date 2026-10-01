'use client';

import { AlertTriangle } from 'lucide-react';

interface DeleteActivoDialogProps {
  isOpen: boolean;
  activoNombre: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDeleting: boolean;
}

export function DeleteActivoDialog({
  isOpen,
  activoNombre,
  onConfirm,
  onCancel,
  isDeleting,
}: DeleteActivoDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl space-y-4">
        <div className="flex items-center gap-3 text-rose-600">
          <div className="p-2 bg-rose-50 rounded-lg">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">¿Eliminar Activo?</h3>
        </div>

        <p className="text-sm text-slate-600">
          ¿Estás seguro de que deseas eliminar <strong className="text-slate-900">"{activoNombre}"</strong>? Esta acción no se puede deshacer y borrará también su historial asociado.
        </p>

        <div className="flex justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-medium border border-slate-300 rounded-lg hover:bg-slate-50 transition"
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting}
            className="px-4 py-2 text-sm font-semibold bg-rose-600 hover:bg-rose-700 text-white rounded-lg transition"
          >
            {isDeleting ? 'Eliminando...' : 'Sí, eliminar'}
          </button>
        </div>
      </div>
    </div>
  );
}