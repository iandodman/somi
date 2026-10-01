'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        setAuthenticated(false);
        router.replace('/login');
      } else {
        setAuthenticated(true);
      }
    }

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        setAuthenticated(false);
        router.replace('/login');
      } else {
        setAuthenticated(true);
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  // Mientras verifica la sesión, muestra pantalla de carga neutra sin filtrar datos
  if (authenticated === null) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Verificando acceso institucional...</p>
        </div>
      </div>
    );
  }

  // Si no está autenticado, no renderiza nada mientras redirige
  if (!authenticated) {
    return null;
  }

  return <>{children}</>;
}