'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/Logo';
import {
  LayoutDashboard,
  Box,
  Wrench,
  FileCheck,
  Bell,
  Menu,
  X,
  LogOut,
  LogIn,
  Sun,
  Moon,
  ChevronDown,
  User
} from 'lucide-react';

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.href = '/login';
  }

  const isPublicPage = pathname === '/' || pathname === '/login';

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventario', href: '/activos', icon: Box },
    { label: 'Servicios & Leyes', href: '/servicios', icon: FileCheck },
    { label: 'Técnico / Terreno', href: '/maestro', icon: Wrench },
  ];

  // 1. VISTA PÚBLICA (Landing Page y Login)
  if (isPublicPage) {
    return (
      <div className="min-h-screen flex flex-col bg-brand-lightBg dark:bg-brand-dark transition-colors">
        <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md transition-colors">
          <div className="w-full px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/">
              <Logo size="sm" horizontal showSubtitle={false} />
            </Link>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                aria-label="Cambiar tema"
                className="p-2 rounded-xl text-brand-metallic hover:text-brand-dark dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-brand-cardDark transition"
              >
                <Sun className="w-5 h-5 hidden dark:block text-amber-400" />
                <Moon className="w-5 h-5 block dark:hidden text-brand-dark" />
              </button>

              {pathname !== '/login' && (
                <Link
                  href="/login"
                  className="flex items-center gap-1.5 px-4 py-2 bg-brand-cyan hover:bg-brand-cyanHover text-white rounded-xl text-xs font-bold transition shadow-xs"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Ingresar</span>
                </Link>
              )}
            </div>
          </div>
        </header>
        <main className="flex-1">{children}</main>
      </div>
    );
  }

  // 2. VISTA PRIVADA (Sidebar + Topbar adaptables a Claro y Oscuro)
  return (
    <div className="min-h-screen flex bg-brand-lightBg dark:bg-brand-dark text-brand-dark dark:text-slate-100 transition-colors">
      
      {/* Fondo oscuro móvil cuando se abre el menú lateral */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-brand-dark/60 backdrop-blur-xs md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* BARRA LATERAL IZQUIERDA (Blanca en modo claro, Azul Marino en modo oscuro) */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-white dark:bg-brand-dark border-r border-slate-200 dark:border-slate-800 transition-all duration-200 ease-in-out md:static md:translate-x-0 shrink-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Esquina Superior Izquierda: Solo Logo y Título sin subtítulo */}
        <div className="h-16 px-5 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 shrink-0">
          <Link href="/dashboard" onClick={() => setSidebarOpen(false)}>
            <Logo size="sm" horizontal showSubtitle={false} />
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-1.5 md:hidden text-brand-metallic hover:text-brand-dark dark:text-slate-400 dark:hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Enlaces de Navegación Vertical */}
        <div className="flex-1 overflow-y-auto py-5 px-3.5 space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-brand-metallic dark:text-slate-500 mb-2">
            Operaciones
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-brand-cyan text-white shadow-sm shadow-brand-cyan/20'
                    : 'text-brand-metallic dark:text-slate-300 hover:text-brand-dark dark:hover:text-white hover:bg-slate-100 dark:hover:bg-brand-cardDark'
                }`}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-brand-metallic dark:text-slate-400'}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>

        {/* Pie del Sidebar */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-[11px] text-brand-metallic dark:text-slate-400">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-cyan animate-pulse" />
            <span>Sistema Operativo En Línea</span>
          </div>
        </div>
      </aside>

      {/* COLUMNA DERECHA: Barra Superior + Contenido Principal */}
      <div className="flex-1 flex flex-col min-w-0">
        
        {/* Topbar (Blanca en modo claro, Azul Marino en modo oscuro) */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-brand-dark/95 backdrop-blur-md text-brand-dark dark:text-white px-4 sm:px-6 flex items-center justify-between border-b border-slate-200 dark:border-slate-800 transition-colors">
          
          {/* Izquierda: Botón Hamburguesa (móvil) + Bajada institucional */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              aria-label="Abrir menú"
              className="p-2 rounded-lg text-brand-metallic hover:text-brand-dark dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-brand-cardDark md:hidden transition"
            >
              <Menu className="w-5 h-5" />
            </button>
            <span className="text-xs font-medium text-brand-metallic dark:text-slate-400 hidden sm:inline">
              Plataforma Institucional de Gestión de Infraestructura y Activos
            </span>
          </div>

          {/* Derecha: Tema, Campana de Alertas y Perfil de Usuario */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Botón Tema */}
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Cambiar tema"
              className="p-2 rounded-xl text-brand-metallic hover:text-brand-dark dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-brand-cardDark transition"
            >
              <Sun className="w-4 h-4 hidden dark:block text-amber-400" />
              <Moon className="w-4 h-4 block dark:hidden text-brand-dark" />
            </button>

            {/* Campana de Notificaciones */}
            <Link
              href="/servicios"
              className="relative p-2 rounded-xl text-brand-metallic hover:text-brand-dark dark:text-slate-300 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-brand-cardDark transition"
              title="Revisar alertas y vencimientos"
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-white dark:ring-brand-dark" />
            </Link>

            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-0.5" />

            {/* Menú Desplegable del Usuario */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-brand-cardDark transition text-xs"
              >
                <div className="w-7 h-7 rounded-full bg-brand-cyan/15 text-brand-cyan border border-brand-cyan/30 flex items-center justify-center">
                  <User className="w-4 h-4" />
                </div>
                <span className="hidden sm:inline font-semibold text-brand-dark dark:text-slate-200 max-w-[130px] truncate">
                  {session?.user?.email?.split('@')[0] || 'Asset Nexus'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-brand-metallic" />
              </button>

              {userMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setUserMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-brand-cardDark rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 py-1.5 z-20 text-xs text-brand-dark dark:text-slate-200">
                    <div className="px-3.5 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-bold truncate">{session?.user?.email}</p>
                      <p className="text-[10px] text-brand-metallic">Administrador</p>
                    </div>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-3.5 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold transition mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </div>
                </>
              )}
            </div>

          </div>
        </header>

        {/* Área de Trabajo Principal */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          {children}
        </main>

      </div>
    </div>
  );
}