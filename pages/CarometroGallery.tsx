
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Funcionario, Shift, AuthUser } from '../../types';
import { Search, UserCircle2, User } from 'lucide-react';

interface CarometroGalleryProps {
  officials: Funcionario[];
  user: AuthUser;
  onToggleRole: () => void;
}

const CarometroGallery: React.FC<CarometroGalleryProps> = ({ officials, user, onToggleRole }) => {
  const { shift, grade } = useParams<{ shift: string; grade: string }>();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOfficials = officials.filter(s => {
    const isAllShifts = shift === Shift.ALL || shift === 'Todos';
    const isAllGrades = grade === 'Todos';

    const matchesShift = isAllShifts || s.vinculo === shift;
    const matchesGrade = isAllGrades || s.categoria === grade;
    const matchesSearch = s.nome_func.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesShift && matchesGrade && matchesSearch;
  });

  const displayTitle = (
    <div className="flex flex-col items-center leading-none">
      <span className="text-lg sm:text-xl font-black tracking-tighter uppercase mb-0.5">
        {shift?.toUpperCase()} - {grade === 'Todos' ? 'TODAS CATEGORIAS' : grade}
      </span>
    </div>
  );

  return (
    <Layout
      title={displayTitle}
      user={user}
      onToggleRole={onToggleRole}
    >
      <div className="p-4 sm:p-8 max-w-7xl mx-auto w-full">
        {/* Search Bar */}
        <div className="relative mb-10 max-w-xl mx-auto">
          <input
            type="text"
            placeholder="Buscar por nome ou registro..."
            className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-2xl outline-none shadow-sm text-base font-medium transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        </div>

        {filteredOfficials.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-x-4 sm:gap-x-6 gap-y-10 sm:gap-y-14">
            {filteredOfficials.map((official) => (
              <div
                key={official.id_func}
                className="flex flex-col items-center group cursor-pointer transition-all"
                onClick={() => navigate(`/funcionario/${official.id_func}`)}
              >
                <div className="w-full aspect-[3/4] bg-gray-100 rounded-2xl overflow-hidden shadow-sm mb-3 border-4 border-transparent group-hover:border-[#3b5998] group-hover:shadow-lg transition-all relative flex items-center justify-center">
                  {official.foto_func ? (
                    <img
                      src={official.foto_func}
                      alt={official.nome_func}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-gray-300">
                      <User size={48} strokeWidth={1} />
                      <span className="text-[8px] font-black uppercase tracking-widest mt-1">Sem Foto</span>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  {official.status && (
                    <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest shadow-md z-10 ${official.status === 'Ativo' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                      }`}>
                      {official.status}
                    </div>
                  )}
                </div>
                <div className="text-center flex flex-col w-full px-1">
                  <span className="text-[11px] sm:text-xs font-black text-gray-800 uppercase leading-tight line-clamp-2">
                    {official.nome_func}
                  </span>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <UserCircle2 size={10} className="text-[#3b5998]" />
                    <span className="text-[10px] sm:text-[11px] text-[#3b5998] font-bold uppercase tracking-tighter">
                      {official.cargo}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-100">
            <UserCircle2 className="mx-auto text-gray-200 mb-4" size={48} />
            <p className="text-gray-400 font-bold uppercase tracking-widest text-sm">Nenhum colaborador encontrado</p>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default CarometroGallery;
