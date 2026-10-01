'use client';

import Link from 'next/link';
import { 
  ShieldCheck, 
  FileCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Smartphone,
  BarChart3
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Sistema Especializado de Operaciones y Mantenimiento Institucional</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white max-w-4xl mx-auto leading-tight">
            Control de infraestructura y activos diseñado para la <span className="text-blue-600 dark:text-blue-500">realidad escolar</span>.
          </h1>

          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Digitaliza el inventario técnico, mantenciones en terreno y cumplimiento normativo chileno en una plataforma unificada.
          </p>

          {/* Único botón de acceso formal */}
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
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> +1.000 activos gestionables
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Cumplimiento D.S. 594 y Ley 20.296
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Sin límite de registros de terreno
            </span>
          </div>

        </div>
      </section>

      {/* Módulos Principales */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Tres pilares para una gestión operativa sin fricciones
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Cada perfil cuenta con la herramienta precisa para su día a día
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Técnico en Terreno</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Búsqueda instantánea por código de activo físico. Registro de mantención con un toque desde el teléfono.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/80 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Cumplimiento Legal & Sanitario</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Semáforos de alerta para resoluciones de la Seremi de Salud, certificación de ascensores (Ley 20.296) y extintores.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Control Gerencial & CAPEX</h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Visibilidad de ciclo de vida para planificar recambios antes de fallas críticas.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-8 text-center text-xs text-slate-500 dark:text-slate-400">
        <p>© 2026 SOMI. Sistema de Operaciones y Mantenimiento Institucional.</p>
      </footer>

    </div>
  );
}