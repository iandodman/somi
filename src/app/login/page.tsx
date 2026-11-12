'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Logo } from '@/components/Logo';
import { Lock, Mail, ArrowRight, AlertCircle, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password: password,
      });

      if (error) {
        setErrorMsg('Credenciales inválidas. Verifica tu correo o contraseña.');
        setLoading(false);
        return;
      }

      if (data?.session) {
        window.location.href = '/dashboard';
      } else {
        setLoading(false);
      }
    } catch {
      setErrorMsg('Error de conexión con el servidor de autenticación.');
      setLoading(false);
    }
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-brand-lightBg dark:bg-brand-dark flex flex-col justify-center items-center p-4 transition-colors">
      <div className="w-full max-w-md bg-white dark:bg-brand-cardDark border border-slate-200/80 dark:border-slate-700/80 rounded-2xl p-8 shadow-xl space-y-6">
        
        {/* Encabezado con el Logo Asset Nexus */}
        <div className="pt-2 pb-2">
          <Logo size="md" showSubtitle={true} />
        </div>

        {errorMsg && (
          <div className="p-3 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 rounded-xl text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-metallic dark:text-slate-300">
              Correo Electrónico
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-metallic" />
              <input
                type="email"
                required
                placeholder="usuario@institucion.cl"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-dark/60 rounded-xl text-sm text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="block text-xs font-semibold uppercase tracking-wider text-brand-metallic dark:text-slate-300">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-metallic" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-brand-dark/60 rounded-xl text-sm text-brand-dark dark:text-white focus:outline-none focus:border-brand-cyan focus:ring-1 focus:ring-brand-cyan transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-brand-metallic hover:text-brand-dark dark:hover:text-white transition"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-brand-cyan hover:bg-brand-cyanHover text-white rounded-xl text-sm font-bold shadow-md transition active:scale-95 disabled:opacity-50 mt-2"
          >
            <span>{loading ? 'Validando acceso...' : 'Iniciar Sesión'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2">
          <p className="text-[11px] text-brand-metallic">
            ¿Problemas de acceso? Contacte al administrador de operaciones.
          </p>
          <Link
            href="/"
            className="inline-block text-xs font-semibold text-brand-cyan hover:text-brand-cyanHover hover:underline"
          >
            ← Volver a la portada principal
          </Link>
        </div>

      </div>
    </div>
  );
}