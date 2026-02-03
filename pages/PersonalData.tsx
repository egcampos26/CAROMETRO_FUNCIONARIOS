import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Funcionario, AuthUser } from '../types';
import { Edit2 } from 'lucide-react';

interface PersonalDataProps {
    officials: Funcionario[];
    user: AuthUser;
    onToggleRole: () => void;
    // onUpdate not needed for view, but we might pass it down or omit it. Layout doesn't use it.
}

const PersonalData: React.FC<PersonalDataProps> = ({ officials, user, onToggleRole }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const official = officials.find(s => s.id_func === id);

    if (!official) return <div>Colaborador não encontrado</div>;

    const handleEdit = () => {
        navigate(`/personal-data/${id}/edit`);
    };

    const InfoBlock = ({ label, value }: { label: string, value?: string | number }) => (
        <div>
            <p className="text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">{label}</p>
            <p className="font-bold text-gray-800 text-lg">{value || '---'}</p>
        </div>
    );

    return (
        <Layout
            title="DADOS PESSOAIS"
            user={user}
            onToggleRole={onToggleRole}
            showBack
            rightAction={
                <button
                    onClick={handleEdit}
                    className="w-10 h-10 flex items-center justify-center bg-white text-[#3b5998] rounded-full hover:bg-gray-100 transition-colors shadow-sm active:scale-90"
                    title="Editar Dados"
                >
                    <Edit2 size={18} />
                </button>
            }
        >
            <div className="max-w-4xl mx-auto p-4 sm:p-8 space-y-8">

                {/* Header Summary */}
                <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm flex items-center gap-6">
                    <div className="w-16 h-16 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-md shrink-0">
                        {official.foto_func ? (
                            <img src={official.foto_func} alt={official.nome_func} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center bg-gray-200 text-gray-400 font-bold">?</div>
                        )}
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-gray-900 uppercase leading-none">{official.nome_func}</h2>
                        <p className="text-sm font-bold text-[#3b5998] opacity-70 mt-1">{official.cargo || 'Cargo não informado'}</p>
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-8">

                    <div>
                        <h3 className="text-[#3b5998] font-black uppercase text-sm tracking-widest border-b border-gray-100 pb-2 mb-6">
                            Documentos
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <InfoBlock label="RG" value={official.rg_func} />
                            <InfoBlock label="CPF" value={official.cpf_func} />
                            <InfoBlock
                                label="Data de Nascimento"
                                value={official.data_nascimento_func ? new Date(official.data_nascimento_func).toLocaleDateString() : '---'}
                            />
                        </div>
                    </div>

                    <div>
                        <h3 className="text-[#3b5998] font-black uppercase text-sm tracking-widest border-b border-gray-100 pb-2 mb-6">
                            Endereço
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <InfoBlock label="Logradouro" value={official.logradouro_func} />
                            <InfoBlock label="Número" value={official["n°_func"]} />
                            <InfoBlock label="Complemento" value={official.compl_func} />

                            <InfoBlock label="Bairro" value={official.bairro_func} />
                            <InfoBlock label="Cidade" value={official.cidade_func} />
                            <InfoBlock label="Estado" value={official.estado_func} />

                            <InfoBlock label="CEP" value={official.cep_func} />
                        </div>
                    </div>

                </div>
            </div>
        </Layout>
    );
};

export default PersonalData;
