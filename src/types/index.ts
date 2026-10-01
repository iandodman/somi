export type ClasificacionActivo = 'SEGURIDAD' | 'OPERACIÓN' | 'LEGAL' | 'GENERAL';
export type CategoriaActivo = 'Equipo' | 'Infraestructura';
export type EstadoMantencion = 'AL DÍA' | 'POR VENCER' | 'VENCIDO' | 'SIN PROGRAMAR';
export type EstadoCumplimiento = 'AL DÍA' | 'POR VENCER' | 'VENCIDO';
export type CategoriaServicio = 
  | 'SANITARIO' 
  | 'SEGURIDAD' 
  | 'TRANSPORTE_VERTICAL' 
  | 'INSTALACIONES' 
  | 'AMBIENTAL'; 

export interface Sede {
  id: string;
  nombre: string;
  direccion?: string;
  comuna?: string;
}

export interface Edificio {
  id: string;
  sede_id: string;
  nombre: string;
}

export interface Espacio {
  id: string;
  edificio_id: string;
  nivel_piso: string;
  nombre_espacio: string;
  superficie_m2?: number;
}

export interface ActivoCompleto {
  id: string;
  colegio_id: string;
  espacio_id: string;
  codigo_activo: string | null; // <-- Código único
  tipo_equipo: string;
  categoria: CategoriaActivo;
  sub_categoria: string | null;
  clasificacion: ClasificacionActivo;
  prioridad: number;
  marca: string | null;
  modelo: string | null;
  numero_serie: string | null;
  potencia_capacidad: string | null;
  ano_adquisicion: number | null;
  vida_util_anos: number | null;
  anos_anticipacion_alerta_recambio: number;
  frecuencia_mantencion: string | null;
  frecuencia_dias: number | null;
  dias_anticipacion_alerta_preventiva: number;
  responsable_default: string | null;
  fecha_ultimo_mantenimiento: string | null;
  fecha_proximo_mantenimiento: string | null;
  estado_operativo: string;
  observacion_general: string | null;
  observacion_especifica: string | null;
  
  // Campos calculados por la vista SQL
  nombre_espacio: string;
  nivel_piso: string;
  nombre_edificio: string;
  nombre_sede: string;
  dias_restantes: number | null;
  estado_mantencion: EstadoMantencion;
  alerta_recambio_capex: boolean;
}

export interface HistorialMantenimiento {
  id: string;
  colegio_id?: string;
  activo_id: string;
  fecha_ejecucion: string;
  realizado_por: string;
  tipo_trabajo: 'Preventivo' | 'Correctivo' | 'Inspección';
  observaciones: string | null;
  foto_url: string | null;
  created_at?: string;
}

export interface ServicioRecurrenteCompleto {
  id: string;
  colegio_id: string;
  nombre_colegio?: string;
  sede_id?: string;
  nombre_sede?: string;
  nombre: string;
  categoria: CategoriaServicio;
  organismo_regulador?: string;
  normativa_referencia?: string;
  periodicidad_dias: number;
  fecha_ultima_ejecucion: string;
  fecha_proximo_vencimiento: string;
  proveedor_empresa?: string;
  proveedor_contacto?: string;
  proveedor_telefono?: string;
  numero_certificado_resolucion?: string;
  url_documento_respaldo?: string;
  costo_estimado_clp?: number;
  observaciones?: string;
  activo: boolean;
  created_at: string;
  dias_restantes: number | null;
  estado_cumplimiento: EstadoCumplimiento;
}