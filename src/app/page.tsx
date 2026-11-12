'use client';

import Link from 'next/link';
import { Logo } from '@/components/Logo';
import {
  CheckCircle2,
  ArrowRight,
  Smartphone,
  BarChart3,
  Scale,
  ShieldCheck,
  Clock,
  Layers
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-[calc(100vh-4rem)] bg-brand-lightBg dark:bg-brand-dark text-brand-dark dark:text-slate-100 transition-colors">
      
      {/* Sección Hero */}
      <section className="relative overflow-hidden py-16 sm:py-24 border-b border-slate-200/80 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          
          {/* Isotipo de Marca */}
          <div className="flex justify-center pb-2">
            <Logo size="lg" showSubtitle={false} />
          </div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-cyan/10 border border-brand-cyan/30 text-brand-cyan text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Plataforma Institucional de Gestión de Infraestructura y Activos</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-brand-dark dark:text-white max-w-4xl mx-auto leading-tight">
            Trazabilidad operacional y control normativo para <span className="text-brand-cyan">recintos de alta exigencia</span>.
          </h1>

          <p className="text-base sm:text-lg text-brand-metallic dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
            Centraliza el inventario maestro, coordina cuadrillas técnicas en terreno y asegura el cumplimiento legal y sanitario en tiempo real, sin cuotas artificiales ni fricciones administrativas.
          </p>

          <div className="flex items-center justify-center pt-4">
            <Link
              href="/login"
              className="flex items-center justify-center gap-2.5 px-8 py-4 bg-brand-cyan hover:bg-brand-cyanHover text-white rounded-xl text-sm font-bold shadow-lg shadow-brand-cyan/20 transition active:scale-95"
            >
              <span>Ingresar al Portal Institucional</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="pt-8 flex flex-wrap items-center justify-center gap-6 text-xs font-medium text-brand-metallic dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-cyan" /> Despliegue inmediato sobre inventario real
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-cyan" /> Auditoría D.S. 594, Ley 20.296 y D.S. 289
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-brand-cyan" /> Registros en terreno ilimitados
            </span>
          </div>

        </div>
      </section>

      {/* Pilares de Arquitectura */}
      <section className="py-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-brand-dark dark:text-white">
            Arquitectura de gestión integral
          </h2>
          <p className="text-xs sm:text-sm text-brand-metallic dark:text-slate-400 max-w-2xl mx-auto">
            Conecta en una sola red la ejecución técnica en terreno con la supervisión administrativa, financiera y legal de la institución.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Tarjeta 1: Operaciones y Terreno */}
          <div className="bg-white dark:bg-brand-cardDark p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark dark:text-white">
              Operaciones Técnicas en Terreno
            </h3>
            <p className="text-xs text-brand-metallic dark:text-slate-300 leading-relaxed">
              Identificación instantánea mediante codificación única de activo físico. Registro ágil de mantenciones preventivas y correctivas diseñado para dispositivos móviles.
            </p>
            <ul className="text-xs space-y-2 text-brand-metallic dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-brand-cyan font-bold">•</span>
                <span>Priorización automática por criticidad y seguridad</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-cyan font-bold">•</span>
                <span>Sin límites diarios de solicitudes ni cobros por volumen</span>
              </li>
            </ul>
          </div>

          {/* Tarjeta 2: Cumplimiento y Marco Legal */}
          <div className="bg-white dark:bg-brand-cardDark p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-dark/10 dark:bg-slate-800 text-brand-dark dark:text-brand-cyan flex items-center justify-center">
              <Scale className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark dark:text-white">
              Cumplimiento Normativo & Sanitario
            </h3>
            <p className="text-xs text-brand-metallic dark:text-slate-300 leading-relaxed">
              Control preventivo de resoluciones sanitarias, certificación de transporte vertical (Ley 20.296), sistemas contra incendios, calderas y protocolos ambientales (D.S. 594).
            </p>
            <ul className="text-xs space-y-2 text-brand-metallic dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-brand-cyan font-bold">•</span>
                <span>Semáforos de alerta preventiva con 30 días de anticipación</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-cyan font-bold">•</span>
                <span>Bitácora auditable de certificados y proveedores externos</span>
              </li>
            </ul>
          </div>

          {/* Tarjeta 3: Dirección y CAPEX */}
          <div className="bg-white dark:bg-brand-cardDark p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/80 shadow-xs space-y-4">
            <div className="w-10 h-10 rounded-xl bg-brand-cyan/15 text-brand-cyan flex items-center justify-center">
              <BarChart3 className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-brand-dark dark:text-white">
              Control Directivo & Ciclos CAPEX
            </h3>
            <p className="text-xs text-brand-metallic dark:text-slate-300 leading-relaxed">
              Visibilidad estratégica para administración y finanzas. Monitoreo de vida útil remanente y proyección presupuestaria de recambios antes de fallas operacionales.
            </p>
            <ul className="text-xs space-y-2 text-brand-metallic dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-800">
              <li className="flex items-start gap-2">
                <span className="text-brand-cyan font-bold">•</span>
                <span>Segmentación por riesgo Legal, Operacional y Seguridad</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-brand-cyan font-bold">•</span>
                <span>Consolidación multisede por edificio, nivel y recinto</span>
              </li>
            </ul>
          </div>

        </div>
      </section>

      {/* Franja de Ventaja Operativa */}
      <section className="py-12 bg-slate-100/80 dark:bg-brand-cardDark text-brand-dark dark:text-white border-t border-slate-200/80 dark:border-slate-800 transition-colors">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
          <div className="flex items-start gap-3.5">
            <Clock className="w-6 h-6 text-brand-cyan shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Puesta en Marcha Inmediata</h4>
              <p className="text-xs text-brand-metallic dark:text-slate-400 mt-1">
                Arquitectura lista para operar sobre la estructura física real de tu organización, sin meses de espera en desarrollo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <Layers className="w-6 h-6 text-brand-cyan shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Trazabilidad Extremo a Extremo</h4>
              <p className="text-xs text-brand-metallic dark:text-slate-400 mt-1">
                Cada intervención técnica, repuesto o certificación queda vinculada al historial histórico de cada activo.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3.5">
            <ShieldCheck className="w-6 h-6 text-brand-cyan shrink-0 mt-0.5" />
            <div>
              <h4 className="text-sm font-bold">Continuidad sin Sobrecostos</h4>
              <p className="text-xs text-brand-metallic dark:text-slate-400 mt-1">
                Sin topes diarios de tickets por operador ni cobros adicionales por paquetes de tráfico mensual.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pie de Página Institucional */}
      <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-brand-dark py-8 text-center text-xs text-brand-metallic dark:text-slate-400">
        <p className="font-semibold text-brand-dark dark:text-slate-300">
          © 2026 Asset Nexus. Todos los derechos reservados.
        </p>
        <p className="mt-1">
          Sistema Institucional de Gestión de Infraestructura, Activos y Continuidad Operativa.
        </p>
      </footer>

    </div>
  );
}