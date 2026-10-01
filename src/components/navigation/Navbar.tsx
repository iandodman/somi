'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, 
  Building, 
  Wrench, 
  FileCheck,
  Sun, 
  Moon, 
  Menu, 
  X,
  ShieldCheck,
  LogOut,
  LogIn,
  UserCheck
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
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
  const showNav = session && !isPublicPage;

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventario', href: '/activos', icon: Building },
    { label: 'Servicios & Leyes', href: '/servicios', icon: FileCheck },
    { label: 'Técnico / Terreno', href: '/maestro', icon: Wrench },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          
          {/* EXTREMO IZQUIERDO: Marca SOMI */}
          <div className="flex items-center z-10">
            <Link 
              href={session ? "/dashboard" : "/"} 
              className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white transition group"
            >
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs shrink-0 group-hover:bg-blue-700 transition">
                <ShieldCheck className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
              <span className="text-xl sm:text-2xl font-black tracking-tight leading-none">
                SOMI
              </span>
            </Link>
          </div>

          {/* CENTRO: Menú de Módulos (Solo dentro del sistema autenticado) */}
          {showNav && (
            <nav className="hidden md:flex absolute inset-x-0 mx-auto justify-center pointer-events-none">
              <div className="flex items-center gap-1 pointer-events-auto bg-slate-100/90 dark:bg-slate-800/90 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 shadow-2xs">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-white/60 dark:hover:bg-slate-700/60'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </nav>
          )}

          {/* EXTREMO DERECHO: Controles y Perfil */}
          <div className="flex items-center gap-2 z-10">
            {session ? (
              <div className="flex items-center gap-2">
                {/* Indicador de perfil institucional */}
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-medium border border-slate-200/80 dark:border-slate-700/80">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                  <span className="truncate max-w-[120px]">
                    {session.user?.email?.split('@')[0] || 'Sesión Activa'}
                  </span>
                </div>

                {/* Botón Salir integrado */}
                <button
                  type="button"
                  onClick={handleLogout}
                  className="p-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl transition"
                  title="Cerrar Sesión"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar</span>
              </Link>
            )}

            {/* Separador vertical sutil */}
            <div className="h-5 w-px bg-slate-200 dark:bg-slate-800 mx-1" />

            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Cambiar tema"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Sun className="w-5 h-5 hidden dark:block text-amber-400" />
              <Moon className="w-5 h-5 block dark:hidden text-slate-600" />
            </button>

            {/* Menú Móvil (Solo visible dentro de la app con sesión) */}
            {showNav && (
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 md:hidden rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Menú Desplegable Móvil */}
      {showNav && mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-2 pb-4 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3.5 py-3 rounded-xl text-sm font-semibold transition ${
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            );
          })}
          
          <div className="pt-2 mt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-3 px-3.5 py-3 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-sm font-semibold transition"
            >
              <LogOut className="w-5 h-5" />
              <span>Cerrar Sesión</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}