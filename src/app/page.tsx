'use client';

import Link from 'next/link';
import { 
  ShieldCheck, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Smartphone,
  BarChart3,
  Building2,
  Scale
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Sección Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Sistema de Operaciones y Mantenimiento Institucional</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Control de infraestructura, activos y mantenimiento para <span className="text-blue-600 dark:text-blue-500">recintos de alta exigencia</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Plataforma unificada para la gestión del ciclo de vida de equipamiento técnico, control de mantenciones en terreno y trazabilidad de cumplimiento normativo legal y sanitario.
          </p>

          <div className="flex items-center justify-center pt-4">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2 px-8 py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-md transition active:scale-95"
            >
              <span>Acceso al Portal Institucional</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Control de activos maestros
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Fiscalización sanitaria y técnica (D.S. 594, Ley 20.296)
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Operación de terreno sin restricciones
            </span>
          </div>

        </div>
      </section>

      {/* Módulos de Operación Institucional */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Arquitectura de gestión integral
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl mx-auto">
            Diseñado para conectar en tiempo real a las cuadrillas técnicas en terreno con la administración general y el control normativo.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta 1: Operaciones y Terreno */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Operaciones Técnicas en Terreno
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Identificación inmediata mediante codificación de placas de activo físico. Registro expedito de mantenciones preventivas y correctivas optimizado para dispositivos móviles.
            </p>
            <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <li>• Priorización por criticidad operativa y seguridad</li>
              <li>• Sin cuotas de registros ni límites diarios por usuario</li>
            </ul>
          </div>

          {/* Tarjeta 2: Cumplimiento y Marco Legal */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Cumplimiento Normativo & Sanitario
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Monitoreo continuo y auditoría de resoluciones sanitarias, mantención mensual y certificación de ascensores (Ley 20.296), sistemas contra incendios y protocolos sanitarios.
            </p>
            <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <li>• Semáforos preventivos de vencimiento (30 días de anticipación)</li>
              <li>• Registro centralizado de certificados y empresas ejecutoras</li>
            </ul>
          </div>

          {/* Tarjeta 3: Dirección y CAPEX */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Control Directivo & Ciclos CAPEX
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Visibilidad estratégica para administración y finanzas. Seguimiento de vida útil remanente y proyección de inversiones de recambio antes de generar pérdidas operacionales.
            </p>
            <ul className="text-xs space-y-1.5 text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <li>• Clasificación por criticidad (Legal, Operación y Seguridad)</li>
              <li>• Vista unificada multisede y desglose por edificios</li>
            </ul>
          </div>

        </div>
      </section>

      {/* Pie de Página Institucional */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 SOMI. Sistema de Operaciones y Mantenimiento Institucional.</p>
        <p className="mt-1">Plataforma de gestión de infraestructura, activos y continuidad operativa.</p>
      </footer>

    </div>
  );
}