'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
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
  LogIn
} from 'lucide-react';

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [session, setSession] = useState<any>(null);

  // Determinar si estamos en una ruta pública
  const isPublicPage = pathname === '/' || pathname === '/login';

  useEffect(() => {
    // Verificar sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    // Escuchar cambios de autenticación
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { label: 'Inventario', href: '/activos', icon: Building },
    { label: 'Servicios & Leyes', href: '/servicios', icon: FileCheck },
    { label: 'Técnico / Terreno', href: '/maestro', icon: Wrench },
  ];

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md transition-colors">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="relative flex items-center justify-between h-16">
          
          {/* EXTREMO IZQUIERDO: Logo SOMI */}
          <div className="flex items-center z-10">
            <Link 
              href={session ? "/dashboard" : "/"} 
              className="flex items-center gap-2.5 font-bold text-slate-900 dark:text-white transition"
            >
              <div className="p-2 bg-blue-600 text-white rounded-xl shadow-xs shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="flex flex-col text-left">
                <span className="text-base font-extrabold tracking-tight leading-none">
                  SOMI
                </span>
                <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium tracking-wider uppercase">
                  Operaciones DSV
                </span>
              </div>
            </Link>
          </div>

          {/* CENTRO ABSOLUTO: Navegación (Solo si hay sesión o si no está en la landing/login) */}
          {!isPublicPage && (
            <nav className="hidden md:flex absolute inset-x-0 mx-auto justify-center pointer-events-none">
              <div className="flex items-center gap-1 pointer-events-auto bg-slate-100/80 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60 backdrop-blur-xs">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
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

          {/* EXTREMO DERECHO: Tema + Login / Logout */}
          <div className="flex items-center gap-2 z-10">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Cambiar tema"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Sun className="w-5 h-5 hidden dark:block text-amber-400" />
              <Moon className="w-5 h-5 block dark:hidden text-slate-600" />
            </button>

            {isPublicPage ? (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar</span>
              </Link>
            ) : (
              <button
                onClick={handleLogout}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-slate-500 hover:text-rose-600 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold transition"
                title="Cerrar Sesión"
              >
                <LogOut className="w-4 h-4" />
                <span>Salir</span>
              </button>
            )}

            {/* Hamburguesa móvil (solo dentro de la app) */}
            {!isPublicPage && (
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
      {!isPublicPage && mobileMenuOpen && (
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
      )}
    </header>
  );
}