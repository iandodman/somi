'use client';

import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase';
import { ActivoCompleto, ClasificacionActivo, CategoriaActivo } from '@/types';
import { X, Save, AlertCircle, MapPin, Calculator } from 'lucide-react';

interface ActivoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  activoEditar: ActivoCompleto | null;
}

interface EspacioRow {
  id: string;
  edificio_id: string;
  nivel_piso: string;
  nombre_espacio: string;
}

interface EdificioRow {
  id: string;
  nombre: string;
}

// Función auxiliar para sumar días a una fecha en formato YYYY-MM-DD
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

export function ActivoModal({ isOpen, onClose, onSuccess, activoEditar }: ActivoModalProps) {
  const [edificios, setEdificios] = useState<EdificioRow[]>([]);
  const [espacios, setEspacios] = useState<EspacioRow[]>([]);
  const [loadingGeo, setLoadingGeo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados de jerarquía de ubicación
  const [selectedEdificioId, setSelectedEdificioId] = useState<string>('');
  const [selectedNivel, setSelectedNivel] = useState<string>('');
  const [selectedEspacioId, setSelectedEspacioId] = useState<string>('');

  // Form State
  const [tipoEquipo, setTipoEquipo] = useState('');
  const [categoria, setCategoria] = useState<CategoriaActivo>('Equipo');
  const [subCategoria, setSubCategoria] = useState('');
  const [clasificacion, setClasificacion] = useState<ClasificacionActivo>('OPERACIÓN');
  const [prioridad, setPrioridad] = useState(2);
  const [marca, setMarca] = useState('');
  const [modelo, setModelo] = useState('');
  const [numeroSerie, setNumeroSerie] = useState('');
  const [potenciaCapacidad, setPotenciaCapacidad] = useState('');
  const [anoAdquisicion, setAnoAdquisicion] = useState<string>('');
  const [vidaUtilAnos, setVidaUtilAnos] = useState<string>('');
  const [anosAnticipacionCapex, setAnosAnticipacionCapex] = useState('2');
  const [frecuenciaMantencion, setFrecuenciaMantencion] = useState('Anual');
  const [frecuenciaDias, setFrecuenciaDias] = useState('365');
  const [diasAnticipacionPreventiva, setDiasAnticipacionPreventiva] = useState('30');
  const [responsableDefault, setResponsableDefault] = useState('');
  const [fechaUltimaMantencion, setFechaUltimaMantencion] = useState('');
  const [fechaProximaMantencion, setFechaProximaMantencion] = useState('');
  const [estadoOperativo, setEstadoOperativo] = useState('Operativo');
  const [observacionGeneral, setObservacionGeneral] = useState('');

  // 1. Cargar edificios y espacios
  useEffect(() => {
    if (isOpen) {
      cargarDatosUbicacion();
    }
  }, [isOpen]);

  async function cargarDatosUbicacion() {
    setLoadingGeo(true);
    try {
      const [{ data: edData }, { data: espData }] = await Promise.all([
        supabase.from('edificios').select('id, nombre').order('nombre'),
        supabase.from('espacios').select('id, edificio_id, nivel_piso, nombre_espacio').order('nombre_espacio'),
      ]);

      if (edData) setEdificios(edData);
      if (espData) setEspacios(espData);
    } catch (e) {
      console.error('Error cargando ubicaciones:', e);
    } finally {
      setLoadingGeo(false);
    }
  }

  // 2. Poblar formulario al abrir o cambiar activoEditar
  useEffect(() => {
    if (!isOpen) return;

    if (activoEditar) {
      setTipoEquipo(activoEditar.tipo_equipo || '');
      setCategoria(activoEditar.categoria || 'Equipo');
      setSubCategoria(activoEditar.sub_categoria || '');
      setClasificacion(activoEditar.clasificacion || 'OPERACIÓN');
      setPrioridad(activoEditar.prioridad || 2);
      setMarca(activoEditar.marca || '');
      setModelo(activoEditar.modelo || '');
      setNumeroSerie(activoEditar.numero_serie || '');
      setPotenciaCapacidad(activoEditar.potencia_capacidad || '');
      setAnoAdquisicion(activoEditar.ano_adquisicion ? String(activoEditar.ano_adquisicion) : '');
      setVidaUtilAnos(
        activoEditar.vida_util_anos !== null && activoEditar.vida_util_anos !== undefined
          ? String(activoEditar.vida_util_anos)
          : ''
      );
      setAnosAnticipacionCapex(String(activoEditar.anos_anticipacion_alerta_recambio || 2));
      setFrecuenciaMantencion(activoEditar.frecuencia_mantencion || 'Anual');
      setFrecuenciaDias(activoEditar.frecuencia_dias ? String(activoEditar.frecuencia_dias) : '365');
      setDiasAnticipacionPreventiva(String(activoEditar.dias_anticipacion_alerta_preventiva || 30));
      setResponsableDefault(activoEditar.responsable_default || '');
      setFechaUltimaMantencion(activoEditar.fecha_ultimo_mantenimiento || '');
      setFechaProximaMantencion(activoEditar.fecha_proximo_mantenimiento || '');
      setEstadoOperativo(activoEditar.estado_operativo || 'Operativo');
      setObservacionGeneral(activoEditar.observacion_general || '');

      // Ubicación actual del activo
      if (activoEditar.espacio_id && espacios.length > 0) {
        const espActual = espacios.find((e) => e.id === activoEditar.espacio_id);
        if (espActual) {
          setSelectedEdificioId(espActual.edificio_id);
          setSelectedNivel(espActual.nivel_piso);
          setSelectedEspacioId(espActual.id);
        } else {
          setSelectedEspacioId(activoEditar.espacio_id);
        }
      }
    } else {
      // Valores por defecto al registrar nuevo activo
      setTipoEquipo('');
      setSubCategoria('');
      setMarca('');
      setModelo('');
      setNumeroSerie('');
      setPotenciaCapacidad('');
      setAnoAdquisicion('');
      setVidaUtilAnos('');
      setFrecuenciaMantencion('Anual');
      setFrecuenciaDias('365');
      setFechaUltimaMantencion('');
      setFechaProximaMantencion('');
      setObservacionGeneral('');
      if (edificios.length > 0) setSelectedEdificioId(edificios[0].id);
    }
  }, [isOpen, activoEditar, espacios]);

  // Manejadores para el cálculo automático de próxima mantención
  function handleCambioUltimaMantencion(nuevaFecha: string) {
    setFechaUltimaMantencion(nuevaFecha);
    if (nuevaFecha && frecuenciaDias) {
      setFechaProximaMantencion(sumarDias(nuevaFecha, Number(frecuenciaDias)));
    }
  }

  function handleCambioFrecuencia(diasStr: string) {
    setFrecuenciaDias(diasStr);
    const dias = Number(diasStr);
    if (dias === 30) setFrecuenciaMantencion('Mensual');
    else if (dias === 90) setFrecuenciaMantencion('Trimestral');
    else if (dias === 180) setFrecuenciaMantencion('Semestral');
    else if (dias === 365) setFrecuenciaMantencion('Anual');
    else if (dias === 730) setFrecuenciaMantencion('2 años');

    if (fechaUltimaMantencion && dias > 0) {
      setFechaProximaMantencion(sumarDias(fechaUltimaMantencion, dias));
    }
  }

  function handleRecalcularProxima() {
    if (fechaUltimaMantencion && frecuenciaDias) {
      setFechaProximaMantencion(sumarDias(fechaUltimaMantencion, Number(frecuenciaDias)));
    }
  }

  // Niveles disponibles según el edificio seleccionado
  const nivelesDisponibles = useMemo(() => {
    if (!selectedEdificioId) return [];
    const filtrados = espacios.filter((e) => e.edificio_id === selectedEdificioId);
    return Array.from(new Set(filtrados.map((e) => e.nivel_piso).filter(Boolean)));
  }, [selectedEdificioId, espacios]);

  // Espacios disponibles según edificio y nivel
  const espaciosDisponibles = useMemo(() => {
    if (!selectedEdificioId) return [];
    return espacios.filter((e) => {
      const matchEd = e.edificio_id === selectedEdificioId;
      const matchNivel = !selectedNivel || e.nivel_piso === selectedNivel;
      return matchEd && matchNivel;
    });
  }, [selectedEdificioId, selectedNivel, espacios]);

  // Manejar cambio de edificio
  function handleEdificioChange(edId: string) {
    setSelectedEdificioId(edId);
    const espDeEdificio = espacios.filter((e) => e.edificio_id === edId);
    const primerNivel = espDeEdificio.length > 0 ? espDeEdificio[0].nivel_piso : '';
    setSelectedNivel(primerNivel);
    const primerEsp = espDeEdificio.find((e) => e.nivel_piso === primerNivel);
    setSelectedEspacioId(primerEsp ? primerEsp.id : '');
  }

  // Manejar cambio de nivel
  function handleNivelChange(nivel: string) {
    setSelectedNivel(nivel);
    const esp = espacios.find((e) => e.edificio_id === selectedEdificioId && e.nivel_piso === nivel);
    setSelectedEspacioId(esp ? esp.id : '');
  }

  async function handleGuardar(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (!selectedEspacioId) {
        throw new Error('Debes seleccionar un espacio/sala de destino.');
      }

      const { data: colData } = await supabase.from('colegios').select('id').limit(1).single();
      const colegioId = colData?.id;

      const payload = {
        colegio_id: colegioId,
        espacio_id: selectedEspacioId,
        tipo_equipo: tipoEquipo.trim(),
        categoria,
        sub_categoria: subCategoria.trim() || null,
        clasificacion,
        prioridad: Number(prioridad),
        marca: marca.trim() || null,
        modelo: modelo.trim() || null,
        numero_serie: numeroSerie.trim() || null,
        potencia_capacidad: potenciaCapacidad.trim() || null,
        ano_adquisicion: anoAdquisicion ? parseInt(anoAdquisicion) : null,
        vida_util_anos: vidaUtilAnos ? parseFloat(vidaUtilAnos) : null,
        anos_anticipacion_alerta_recambio: parseFloat(anosAnticipacionCapex) || 2,
        frecuencia_mantencion: frecuenciaMantencion || null,
        frecuencia_dias: frecuenciaDias ? parseFloat(frecuenciaDias) : null,
        dias_anticipacion_alerta_preventiva: parseInt(diasAnticipacionPreventiva) || 30,
        responsable_default: responsableDefault.trim() || null,
        fecha_ultimo_mantenimiento: fechaUltimaMantencion || null,
        fecha_proximo_mantenimiento: fechaProximaMantencion || null,
        estado_operativo: estadoOperativo,
        observacion_general: observacionGeneral.trim() || null,
      };

      if (activoEditar) {
        const { error } = await supabase.from('activos').update(payload).eq('id', activoEditar.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('activos').insert(payload);
        if (error) throw error;
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al guardar el activo.');
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-3xl w-full p-6 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto text-slate-900 dark:text-slate-100 transition-colors">
        
        {/* Encabezado */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {activoEditar ? 'Editar Activo' : 'Registrar Nuevo Activo'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {activoEditar
                ? `Actualizando registro de ${activoEditar.tipo_equipo}`
                : 'Completa los datos técnicos y ciclos de mantenimiento.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {errorMsg && (
          <div className="p-3.5 bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 text-sm rounded-lg border border-rose-200 dark:border-rose-900 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <form onSubmit={handleGuardar} className="space-y-6">
          
          {/* Nombre del Activo */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Nombre de Equipo / Activo *
            </label>
            <input
              type="text"
              required
              value={tipoEquipo}
              onChange={(e) => setTipoEquipo(e.target.value)}
              placeholder="Ej. Pista de Recortán, Caldera N° 1, Extintor PQS 6kg..."
              className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
            />
          </div>

          {/* Bloque Jerárquico de Ubicación */}
          <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              <MapPin className="w-4 h-4 text-blue-500" />
              Ubicación Física del Activo
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* 1. Edificio */}
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                  1. Edificio / Pabellón
                </label>
                <select
                  value={selectedEdificioId}
                  onChange={(e) => handleEdificioChange(e.target.value)}
                  disabled={loadingGeo || edificios.length === 0}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                >
                  {edificios.length === 0 ? (
                    <option value="">Cargando edificios...</option>
                  ) : (
                    edificios.map((ed) => (
                      <option key={ed.id} value={ed.id}>{ed.nombre}</option>
                    ))
                  )}
                </select>
              </div>

              {/* 2. Nivel / Piso */}
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                  2. Nivel / Piso
                </label>
                <select
                  value={selectedNivel}
                  onChange={(e) => handleNivelChange(e.target.value)}
                  disabled={nivelesDisponibles.length === 0}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                >
                  {nivelesDisponibles.map((n) => (
                    <option key={n} value={n}>{n}</option>
                  ))}
                </select>
              </div>

              {/* 3. Espacio / Sala específica */}
              <div>
                <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                  3. Espacio / Sala *
                </label>
                <select
                  required
                  value={selectedEspacioId}
                  onChange={(e) => setSelectedEspacioId(e.target.value)}
                  disabled={espaciosDisponibles.length === 0}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:opacity-50"
                >
                  {espaciosDisponibles.map((esp) => (
                    <option key={esp.id} value={esp.id}>{esp.nombre_espacio}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Clasificación y Prioridad */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Categoría
              </label>
              <select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value as CategoriaActivo)}
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="Equipo">Equipo</option>
                <option value="Infraestructura">Infraestructura</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Clasificación de Riesgo
              </label>
              <select
                value={clasificacion}
                onChange={(e) => setClasificacion(e.target.value as ClasificacionActivo)}
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value="OPERACIÓN">OPERACIÓN</option>
                <option value="SEGURIDAD">SEGURIDAD</option>
                <option value="LEGAL">LEGAL</option>
                <option value="GENERAL">GENERAL</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
                Prioridad
              </label>
              <select
                value={prioridad}
                onChange={(e) => setPrioridad(Number(e.target.value))}
                className="w-full px-3.5 py-2.5 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              >
                <option value={1}>1 - Alta / Crítica</option>
                <option value={2}>2 - Media</option>
                <option value={3}>3 - Baja</option>
              </select>
            </div>
          </div>

          {/* Datos Técnicos */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-slate-200 dark:border-slate-800 pt-4">
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Marca</label>
              <input
                type="text"
                value={marca}
                onChange={(e) => setMarca(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">Modelo</label>
              <input
                type="text"
                value={modelo}
                onChange={(e) => setModelo(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">N° Serie / Identificador</label>
              <input
                type="text"
                value={numeroSerie}
                onChange={(e) => setNumeroSerie(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Ciclo de Vida Útil / Alerta CAPEX */}
          <div className="p-4 bg-purple-50/70 dark:bg-purple-950/30 rounded-xl border border-purple-200 dark:border-purple-900/50 space-y-3">
            <h3 className="text-sm font-bold text-purple-900 dark:text-purple-200">
              Ciclo de Vida Útil (Planificación de Recambio / Inversión CAPEX)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-purple-800 dark:text-purple-300 mb-1">
                  Año Instalación / Adquisición
                </label>
                <input
                  type="number"
                  placeholder="Ej. 2018"
                  value={anoAdquisicion}
                  onChange={(e) => setAnoAdquisicion(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 dark:border-purple-800/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-800 dark:text-purple-300 mb-1">
                  Vida Útil Estimada (Años)
                </label>
                <input
                  type="number"
                  step="0.5"
                  placeholder="Ej. 15 (0 si no aplica)"
                  value={vidaUtilAnos}
                  onChange={(e) => setVidaUtilAnos(e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 dark:border-purple-800/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-purple-800 dark:text-purple-300 mb-1">
                  Avisar con anticipación de:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={anosAnticipacionCapex}
                    onChange={(e) => setAnosAnticipacionCapex(e.target.value)}
                    className="w-full px-3 py-2 border border-purple-200 dark:border-purple-800/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                  />
                  <span className="text-xs text-purple-800 dark:text-purple-300 font-medium">años</span>
                </div>
              </div>
            </div>
          </div>

          {/* Ciclo de Mantención Preventiva con Cálculo Automático */}
          <div className="p-4 bg-blue-50/70 dark:bg-blue-950/30 rounded-xl border border-blue-200 dark:border-blue-900/50 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-blue-900 dark:text-blue-200">
                Programa de Mantención Preventiva (Operación Continua)
              </h3>
              {fechaUltimaMantencion && frecuenciaDias && (
                <button
                  type="button"
                  onClick={handleRecalcularProxima}
                  className="flex items-center gap-1.5 text-xs font-medium text-blue-700 dark:text-blue-300 hover:underline"
                  title="Recalcular fecha sumando los días a la última mantención"
                >
                  <Calculator className="w-3.5 h-3.5" />
                  Recalcular fecha
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Frecuencia de Ciclo */}
              <div>
                <label className="block text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Frecuencia de Ciclo
                </label>
                <select
                  value={frecuenciaDias}
                  onChange={(e) => handleCambioFrecuencia(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                >
                  <option value="30">Mensual (30 días)</option>
                  <option value="90">Trimestral (90 días)</option>
                  <option value="180">Semestral (180 días)</option>
                  <option value="365">Anual (365 días)</option>
                  <option value="730">Cada 2 años (730 días)</option>
                </select>
              </div>

              {/* Última Mantención */}
              <div>
                <label className="block text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Última Mantención Realizada
                </label>
                <input
                  type="date"
                  value={fechaUltimaMantencion}
                  onChange={(e) => handleCambioUltimaMantencion(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Próxima Mantención (Solo Lectura / Auto-calculada) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-medium text-blue-800 dark:text-blue-300">
                    Próxima Mantención
                  </label>
                  <span className="text-[10px] text-blue-600 dark:text-blue-400 font-semibold uppercase tracking-wider">
                    Calculada
                  </span>
                </div>
                <input
                  type="date"
                  readOnly
                  tabIndex={-1}
                  value={fechaProximaMantencion}
                  className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800/80 bg-blue-100/50 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 rounded-lg text-sm cursor-not-allowed select-none focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Responsable Asignado / Proveedor
                </label>
                <input
                  type="text"
                  placeholder="Ej. Operaciones DSV, Empresa Externa Clima..."
                  value={responsableDefault}
                  onChange={(e) => setResponsableDefault(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-blue-800 dark:text-blue-300 mb-1">
                  Alerta Preventiva (días antes)
                </label>
                <input
                  type="number"
                  value={diasAnticipacionPreventiva}
                  onChange={(e) => setDiasAnticipacionPreventiva(e.target.value)}
                  className="w-full px-3 py-2 border border-blue-200 dark:border-blue-800/80 bg-white dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-5 py-2.5 text-sm font-medium border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold shadow-sm transition disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              {loading ? 'Guardando...' : activoEditar ? 'Guardar Cambios' : 'Crear Activo'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}