
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, ChevronLeft, ShieldCheck, User } from 'lucide-react';
import { AuthUser } from '../../types';

interface LayoutProps {
  title: React.ReactNode;
  children: React.ReactNode;
  showHome?: boolean;
  showBack?: boolean;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  user?: AuthUser;
  onToggleRole?: () => void;
  showProfile?: boolean; // Nova flag para controle de exibição
}

const Layout: React.FC<LayoutProps> = ({
  title,
  children,
  showHome = true,
  showBack = true,
  leftAction,
  rightAction,
  user,
  onToggleRole,
  showProfile = false // Default é não mostrar para manter as páginas internas limpas
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (location.pathname === '/') return;
    navigate(-1);
  };

  const handleHome = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigate('/', { replace: false });
  };

  return (
    <div className="flex flex-col h-screen w-full bg-white overflow-hidden">
      <header className="bg-[#3b5998] h-16 sm:h-20 flex items-center justify-between px-2 shrink-0 text-white shadow-md z-30 relative border-b border-white/10">

        {/* Lado Esquerdo: Home + Perfil do Usuário (Condicional) */}
        <div className="flex items-center gap-2 w-36 sm:w-56 pl-1">
          {showHome && (
            <button
              onClick={handleHome}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all focus:outline-none shrink-0"
              title="Ir para o Início"
            >
              <Home size={22} />
            </button>
          )}

          {showProfile && user && (
            <div
              onClick={onToggleRole}
              className="flex items-center gap-2 cursor-pointer hover:bg-white/10 p-1 pr-3 rounded-full transition-all active:scale-95 group shrink-0 sm:shrink"
              title="Clique para sair"
            >
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center text-sm font-black border-2 border-white/20 group-hover:border-white/50 transition-colors">
                {user.name.charAt(0)}
              </div>
              <div className="hidden sm:flex flex-col items-start leading-none min-w-0">
                <span className="text-[10px] font-black uppercase opacity-60 tracking-wider truncate w-full">{user.name}</span>
                <div className={`flex items-center gap-1 mt-0.5 px-1.5 py-0.5 rounded text-[8px] font-black uppercase tracking-widest ${user.role === 'Admin' ? 'bg-yellow-400 text-[#3b5998]' : 'bg-white/20 text-white'
                  }`}>
                  {user.role === 'Admin' && <ShieldCheck size={8} />}
                  {user.role === 'Admin' ? 'Admin' : 'Funcionário'}
                </div>
              </div>
              {/* Mobile point status */}
              <div className="sm:hidden relative">
                <div className={`w-2.5 h-2.5 rounded-full border-2 border-[#3b5998] ${user.role === 'Admin' ? 'bg-yellow-400' : 'bg-emerald-400'
                  }`} />
              </div>
            </div>
          )}
          {leftAction}
        </div>

        {/* Centro: Título */}
        <div className="flex-1 flex flex-col items-center justify-center text-center px-1 overflow-hidden">
          {typeof title === 'string' ? (
            <h1 className="text-base sm:text-xl font-black uppercase tracking-tight truncate w-full">
              {title}
            </h1>
          ) : (
            title
          )}
        </div>

        {/* Lado Direito: Ações Contextuais + Voltar */}
        <div className="flex items-center justify-end w-36 sm:w-56 pr-1 gap-3">
          {rightAction}
          {showBack && (
            <button
              onClick={handleBack}
              className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10 active:scale-90 transition-all border border-white/10 focus:outline-none shrink-0"
              aria-label="Voltar"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>
      </header>

      <main className="flex-1 overflow-y-auto bg-gray-50/30 safe-area-bottom custom-scrollbar">
        {children}
      </main>
    </div>
  );
};

export default Layout;
