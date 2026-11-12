import React from 'react';

interface LogoProps {
  showSubtitle?: boolean;
  size?: 'sm' | 'md' | 'lg';
  horizontal?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  showSubtitle = true, 
  size = 'md',
  horizontal = false 
}) => {
  const iconDimensions = {
    sm: 'w-9 h-9',
    md: 'w-14 h-14',
    lg: 'w-16 h-16',
  }[size];

  const titleSize = {
    sm: 'text-lg sm:text-xl',
    md: 'text-2xl',
    lg: 'text-3xl',
  }[size];

  return (
    <div className={`flex ${horizontal ? 'flex-row items-center gap-3 text-left' : 'flex-col items-center justify-center text-center'}`}>
      {/* Isotipo de Nodos Interconectados (SVG) */}
      <div className={`${iconDimensions} shrink-0 ${!horizontal ? 'mb-2' : ''}`}>
        <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          {/* Hexágono base */}
          <polygon points="50,15 80,32 80,68 50,85 20,68 20,32" stroke="#64748B" strokeWidth="4" fill="none" />
          {/* Conexiones */}
          <line x1="50" y1="15" x2="80" y2="68" stroke="#00B493" strokeWidth="4" />
          <line x1="80" y1="32" x2="20" y2="68" stroke="#00B493" strokeWidth="4" />
          <line x1="20" y1="32" x2="50" y2="85" className="stroke-[#0B192C] dark:stroke-slate-200 transition-colors" strokeWidth="4" />
          {/* Nodos */}
          <circle cx="50" cy="15" r="7" fill="#00B493" />
          <circle cx="80" cy="32" r="7" fill="#64748B" />
          <circle cx="80" cy="68" r="7" fill="#00B493" />
          <circle cx="50" cy="85" r="7" className="fill-[#0B192C] dark:fill-slate-200 transition-colors" />
          <circle cx="20" cy="68" r="7" fill="#64748B" />
          <circle cx="20" cy="32" r="7" fill="#00B493" />
        </svg>
      </div>

      {/* Nombre y Bajada */}
      <div>
        <span className={`block ${titleSize} font-extrabold tracking-wider text-brand-dark dark:text-white uppercase leading-none`}>
          Asset <span className="text-brand-metallic dark:text-slate-400 font-normal">Nexus</span>
        </span>
        {showSubtitle && (
          <p className="text-xs font-medium text-brand-metallic dark:text-slate-400 mt-1">
            Gestión de Infraestructura y Activos
          </p>
        )}
      </div>
    </div>
  );
};