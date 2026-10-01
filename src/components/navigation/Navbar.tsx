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
    setSession(null);
    router.replace('/login');
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
          
          {/* EXTREMO IZQUIERDO: Logo */}
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

          {/* CENTRO: Menú de Navegación (Solo si hay sesión activa) */}
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

          {/* EXTREMO DERECHO: Tema y Botón Login / Logout */}
          <div className="flex items-center gap-2 z-10">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              aria-label="Cambiar tema"
              className="p-2 rounded-xl text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <Sun className="w-5 h-5 hidden dark:block text-amber-400" />
              <Moon className="w-5 h-5 block dark:hidden text-slate-600" />
            </button>

            {session ? (
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 rounded-xl transition border border-rose-200 dark:border-rose-900/50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            ) : (
              <Link
                href="/login"
                className="flex items-center gap-1.5 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                <LogIn className="w-4 h-4" />
                <span>Ingresar</span>
              </Link>
            )}

            {/* Menú Móvil (solo si hay sesión) */}
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
        </div>
      )}
    </header>
  );
}