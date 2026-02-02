
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Funcionario, Occurrence, AuthUser } from '../../types';
import { Edit2, ChevronRight, CreditCard, Briefcase, Activity, Landmark, User, Building } from 'lucide-react';

interface FuncionarioDetailProps {
  officials: Funcionario[];
  occurrences: Occurrence[];
  user: AuthUser;
  onToggleRole: () => void;
}

const FuncionarioDetail: React.FC<FuncionarioDetailProps> = ({ officials, occurrences, user, onToggleRole }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const official = officials.find(s => s.id_func === id);
  const studentOccurrences = occurrences
    .filter(o => o.funcionarioId === id)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (!official) return <div className="p-8 text-center font-bold">Colaborador não encontrado</div>;

  const isAdmin = user.role === 'Admin';

  const headerTitle = (
    <div className="flex flex-col items-center leading-none">
      <span className="text-lg sm:text-xl font-black tracking-tighter uppercase mb-0.5">PERFIL DO FUNCIONÁRIO</span>
    </div>
  );

  const hasRfVc = official.rf || official.vc;
  const hasJobInfo = official.cargo || official.funcao || official.subfuncao;

  return (
    <Layout
      title={headerTitle}
      user={user}
      onToggleRole={onToggleRole}
      rightAction={
        isAdmin ? (
          <button
            onClick={() => navigate(`/edit-funcionario/${official.id_func}`)}
            className="w-10 h-10 flex items-center justify-center bg-white text-[#3b5998] rounded-full hover:bg-gray-100 transition-colors shadow-sm active:scale-90"
          >
            <Edit2 size={18} />
          </button>
        ) : null
      }
    >
      <div className="max-w-6xl mx-auto p-4 sm:p-8 lg:p-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
          <div className="flex flex-col items-center lg:w-1/3 space-y-8">
            <div className="w-full max-w-[320px] lg:max-w-none">
              <div className="aspect-[3/4] bg-gray-100 rounded-3xl overflow-hidden shadow-2xl border-8 border-white relative group flex items-center justify-center">
                {official.photoUrl ? (
                  <img src={official.foto_func} alt={official.nome_func} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center justify-center text-gray-300">
                    <User size={80} strokeWidth={1} />
                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">Sem Imagem</span>
                  </div>
                )}
                {official.status && (
                  <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg z-10 ${official.status === 'Ativo' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {official.status}
                  </div>
                )}
              </div>
            </div>

            {hasRfVc && (
              <div className="w-full bg-[#3b5998] p-6 rounded-3xl shadow-xl border-b-4 border-blue-900 text-center">
                <div className="flex items-center justify-center gap-2 mb-4 text-white/70">
                  <CreditCard size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">RF / VC</span>
                </div>
                <div className="flex items-baseline justify-center gap-2 text-white">
                  <p className="font-black text-3xl tracking-tight">{official.rf || '---'}</p>
                  <span className="text-xl font-bold opacity-50">/</span>
                  <p className="font-black text-3xl tracking-tight">{official.vc || '0'}</p>
                </div>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-8">
            <div className="border-b-4 border-gray-50 pb-8 flex justify-between items-start">
              <div className="flex-1">
                <span className="text-[#3b5998] text-xs font-black uppercase block mb-3 tracking-widest">NOME COMPLETO</span>
                <h3 className="text-gray-900 font-black text-3xl sm:text-4xl leading-tight uppercase tracking-tight">{official.nome_func}</h3>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
              {official.categoria && (
                <div className={`${official.funcao ? 'sm:col-span-5' : 'sm:col-span-10'} p-6 bg-white rounded-3xl border-2 border-gray-50 shadow-sm`}>
                  <span className="text-[#3b5998] text-[10px] font-black uppercase block mb-1 tracking-widest">CATEGORIA</span>
                  <p className="font-black text-gray-800 text-xl uppercase leading-none">{official.categoria}</p>
                </div>
              )}
              {official.funcao && (
                <div className={`${official.categoria ? 'sm:col-span-5' : 'sm:col-span-10'} p-6 bg-white rounded-3xl border-2 border-gray-50 shadow-sm`}>
                  <span className="text-[#3b5998] text-[10px] font-black uppercase block mb-1 tracking-widest">FUNÇÃO</span>
                  <p className="font-black text-gray-800 text-xl uppercase leading-none">{official.funcao}</p>
                </div>
              )}
              {official.qpe && (
                <div className="sm:col-span-2 p-6 bg-white rounded-3xl border-2 border-gray-50 shadow-sm flex flex-col justify-center items-center text-center">
                  <span className="text-[#3b5998] text-[10px] font-black uppercase block mb-1 tracking-widest">QPE</span>
                  <p className="font-black text-gray-800 text-xl uppercase leading-none">{official.qpe}</p>
                </div>
              )}
            </div>

            {hasJobInfo && (
              <div className="bg-white rounded-3xl border-2 border-gray-50 p-6 shadow-sm overflow-hidden">
                <div className="flex items-center gap-3 mb-6">
                  <Briefcase size={18} className="text-[#3b5998]" />
                  <h4 className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest">Atribuição Profissional</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  {(() => {
                    // Filter unique professional attribution values
                    const values = [
                      { label: 'Cargo Base', value: official.cargo_base },
                      { label: 'Cargo', value: official.cargo },
                      { label: 'Função', value: official.funcao },
                      { label: 'Subfunção', value: official.subfuncao }
                    ];

                    const uniqueValues: Array<{ label: string, value: string }> = [];
                    const seenValues = new Set<string>();

                    values.forEach(item => {
                      if (item.value && !seenValues.has(item.value.toUpperCase())) {
                        uniqueValues.push(item);
                        seenValues.add(item.value.toUpperCase());
                      }
                    });

                    return uniqueValues.map((item, idx) => (
                      <div key={idx} className="space-y-1">
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-tighter">{item.label}</p>
                        <p className="font-bold text-gray-800 uppercase text-sm leading-tight">{item.value}</p>
                      </div>
                    ));
                  })()}
                </div>
              </div>
            )}

            <div className="bg-white rounded-3xl border-2 border-gray-50 p-8 space-y-6">
              {official.ue_exercicio && (
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#3b5998] shrink-0">
                    <Landmark size={24} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">UNIDADE / GESTÃO</p>
                    <p className="text-lg font-bold text-gray-800 truncate uppercase">{official.ue_exercicio}</p>
                  </div>
                </div>
              )}
              {official.empresa && (
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-[#3b5998] shrink-0">
                    <Building size={24} />
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-black uppercase tracking-widest">EMPRESA</p>
                    <p className="text-lg font-bold text-gray-800 uppercase">{official.empresa}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-8">
              <div className="flex justify-between items-center mb-6">
                <h4 className="text-[#3b5998] font-black uppercase text-sm tracking-widest">Histórico de Ocorrências</h4>
                <button
                  onClick={() => navigate(`/add-occurrence/${official.id_func}`)}
                  className="bg-[#3b5998] text-white text-[10px] font-black px-6 py-2 rounded-full uppercase shadow-lg hover:bg-blue-700 transition-all"
                >
                  + Novo Registro
                </button>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {studentOccurrences.length > 0 ? (
                  studentOccurrences.map(occ => (
                    <div
                      key={occ.id}
                      className="bg-white p-4 rounded-2xl border-2 border-gray-50 hover:border-blue-100 shadow-sm flex justify-between items-center group cursor-pointer transition-all"
                      onClick={() => navigate(`/occurrence/${occ.id}`)}
                    >
                      <div className="flex-1 min-w-0 pr-4">
                        <div className="flex items-center gap-2 mb-1">
                          <span className={`w-2 h-2 rounded-full ${occ.category === 'Comportamental' ? 'bg-red-500' : 'bg-blue-500'}`} />
                          <p className="font-black text-gray-800 text-xs uppercase tracking-tighter truncate">{occ.title}</p>
                        </div>
                        <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest">
                          {new Date(occ.date).toLocaleDateString()}
                        </p>
                      </div>
                      <ChevronRight size={16} className="text-gray-300 group-hover:text-[#3b5998]" />
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-100">
                    <p className="text-gray-400 text-[9px] font-black uppercase">Sem registros técnicos</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default FuncionarioDetail;
