
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Shift, AuthUser } from '../types';
import { UserCircle2, ShieldCheck, GraduationCap } from 'lucide-react';

interface ShiftSelectionProps {
  user: AuthUser;
  onToggleRole: () => void;
  onSetUser: (id: string) => void;
  testUsers: AuthUser[];
}

const ShiftSelection: React.FC<ShiftSelectionProps> = ({ user, onToggleRole, onSetUser, testUsers }) => {
  const navigate = useNavigate();

  const handleSelect = (shift: Shift) => {
    if (shift === Shift.ALL) {
      navigate(`/carometro/Todos/Todos`);
    } else {
      navigate(`/classes/${shift}`);
    }
  };

  const headerTitle = (
    <div className="flex flex-col items-center leading-none">
      <span className="text-lg sm:text-xl font-black tracking-tighter uppercase mb-0.5">CARÔMETRO DOS FUNCIONÁRIOS</span>
    </div>
  );

  return (
    <Layout
      title={headerTitle}
      showHome={false}
      showBack={false}
      user={user}
      onToggleRole={onToggleRole}
      showProfile={true}
    >
      <div className="p-4 sm:p-8 md:p-12 flex flex-col gap-6 h-full max-w-5xl mx-auto w-full">
        <div className="text-center mb-4 sm:mb-8">
          <h2 className="text-[#3b5998] font-black uppercase tracking-widest text-lg sm:text-xl">VÍNCULOS</h2>
          <p className="text-gray-400 text-[10px] sm:text-xs mt-1 uppercase font-bold tracking-widest">Selecione uma categoria para acessar os funcionários</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6">
          <button
            onClick={() => handleSelect(Shift.MORNING)}
            className="w-full bg-[#3b5998] text-white py-8 sm:py-12 rounded-3xl font-black text-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-widest border-b-4 border-blue-900 group"
          >
            <span className="group-hover:scale-110 transition-transform block">SERVIDOR</span>
          </button>
          <button
            onClick={() => handleSelect(Shift.INTEGRAL)}
            className="w-full bg-[#3b5998] text-white py-8 sm:py-12 rounded-3xl font-black text-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-widest border-b-4 border-blue-900 group"
          >
            <span className="group-hover:scale-110 transition-transform block">CONTRATO</span>
          </button>
          <button
            onClick={() => handleSelect(Shift.AFTERNOON)}
            className="w-full bg-[#3b5998] text-white py-8 sm:py-12 rounded-3xl font-black text-xl shadow-lg hover:bg-blue-700 active:scale-95 transition-all uppercase tracking-widest border-b-4 border-blue-900 group"
          >
            <span className="group-hover:scale-110 transition-transform block">TERCEIRIZADO</span>
          </button>
          <button
            onClick={() => handleSelect(Shift.ALL)}
            className="w-full bg-blue-50 text-[#3b5998] py-8 sm:py-12 rounded-3xl font-black text-xl shadow-md hover:bg-blue-100 active:scale-95 transition-all uppercase tracking-widest border-b-4 border-blue-200 group"
          >
            <span className="group-hover:scale-110 transition-transform block">TODOS FUNCIONÁRIOS</span>
          </button>
        </div>


      </div>
    </Layout>
  );
};

export default ShiftSelection;
