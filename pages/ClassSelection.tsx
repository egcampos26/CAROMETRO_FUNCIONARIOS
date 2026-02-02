
import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Layout from '../components/Layout';
import { GRADES, SERVIDORES_ROLES, TERCEIRIZADOS_ROLES, CONTRATOS_ROLES } from '../../constants';
import { AuthUser, Shift } from '../../types';

interface ClassSelectionProps {
  user: AuthUser;
  onToggleRole: () => void;
}

const ClassSelection: React.FC<ClassSelectionProps> = ({ user, onToggleRole }) => {
  const { shift } = useParams<{ shift: string }>();
  const navigate = useNavigate();

  // Determina qual lista de categorias usar com base no vínculo selecionado
  const getCategories = () => {
    if (shift === 'SERVIDOR') return SERVIDORES_ROLES;
    if (shift === 'TERCEIRIZADO') return TERCEIRIZADOS_ROLES;
    if (shift === 'CONTRATO') return CONTRATOS_ROLES;
    return GRADES;
  };

  const categoriesToDisplay = getCategories();

  const headerTitle = (
    <div className="flex flex-col items-center leading-none">
      <span className="text-lg sm:text-xl font-black tracking-tighter uppercase mb-0.5">SELECIONAR CARGO</span>
      <span className="text-[10px] sm:text-[11px] font-bold opacity-70 tracking-widest uppercase truncate max-w-[200px]">CATEGORIA {shift?.toUpperCase()}</span>
    </div>
  );

  return (
    <Layout
      title={headerTitle}
      user={user}
      onToggleRole={onToggleRole}
    >
      <div className="p-4 sm:p-8 md:p-12 max-w-6xl mx-auto w-full">
        <div className="text-center mb-10">
          <p className="text-gray-400 text-[10px] sm:text-xs uppercase font-bold tracking-[0.2em]">
            Selecione o cargo ou setor para visualizar os funcionários
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {categoriesToDisplay.map((category) => (
            <button
              key={category}
              onClick={() => navigate(`/carometro/${shift}/${category}`)}
              className="bg-[#3b5998] text-white p-6 sm:p-8 flex items-center justify-center rounded-2xl font-black text-sm sm:text-base md:text-lg shadow-md hover:bg-blue-700 hover:scale-[1.02] active:scale-95 transition-all border-b-4 border-blue-900 text-center uppercase tracking-widest leading-tight min-h-[100px]"
            >
              {category}
            </button>
          ))}

          <button
            onClick={() => navigate(`/carometro/${shift}/Todos`)}
            className="bg-blue-50 text-[#3b5998] p-6 sm:p-8 flex items-center justify-center rounded-2xl font-black text-sm sm:text-base md:text-lg shadow-sm hover:bg-blue-100 hover:scale-[1.02] active:scale-95 transition-all border-b-4 border-blue-200 text-center uppercase tracking-widest leading-tight min-h-[100px]"
          >
            Ver Todos desta Categoria
          </button>
        </div>
      </div>
    </Layout>
  );
};

export default ClassSelection;
