import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Funcionario, AuthUser } from '../types';
import { Save } from 'lucide-react';

interface PersonalDataEditProps {
    officials: Funcionario[];
    onUpdate: (updated: Funcionario) => Promise<void>;
    user: AuthUser;
    onToggleRole: () => void;
}

const PersonalDataEdit: React.FC<PersonalDataEditProps> = ({ officials, onUpdate, user, onToggleRole }) => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [cepLoading, setCepLoading] = useState(false);

    const [formData, setFormData] = useState<Partial<Funcionario>>({});

    useEffect(() => {
        const official = officials.find(s => s.id_func === id);
        if (official) {
            setFormData(official);
        }
    }, [id, officials]);

    if (!id) return <div>ID não encontrado</div>;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleCepBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
        const cep = e.target.value.replace(/\D/g, '');
        if (cep.length === 8) {
            setCepLoading(true);
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                const data = await response.json();
                if (!data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        logradouro_func: data.logradouro,
                        bairro_func: data.bairro,
                        cidade_func: data.localidade,
                        estado_func: data.uf
                    }));
                }
            } catch (error) {
                console.error("Erro ao buscar CEP", error);
            } finally {
                setCepLoading(false);
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Ensure id_func is present (fallback to URL param id)
        const funcId = formData.id_func || id;
        if (!funcId) {
            console.error("ID do funcionário não encontrado");
            alert("Erro: ID do funcionário não identificado.");
            return;
        }

        setLoading(true);
        console.log("Iniciando salvamento...", { funcId, formData });

        // Ensure we handle data types suitable for DB if needed, but Supabase JS handles most casts.
        // 'cep_func' is integer in DB, so we should arguably strip non-digits.
        // However, if we send "12345-678" to an int4 column, it might fail.
        // Let's strip it just in case.
        try {
            const payload = {
                ...formData,
                id_func: funcId, // Ensure ID is set
                cep_func: formData.cep_func ? String(formData.cep_func).replace(/\D/g, '') : null
            };

            console.log("Payload para atualização:", payload);
            await onUpdate(payload as Funcionario);
            console.log("Atualização concluída. Navegando para:", `/personal-data/${id}`);
            navigate(`/personal-data/${id}`);
        } catch (error) {
            console.error("Erro ao salvar:", error);
            alert("Erro ao salvar alterações. Verifique o console.");
        } finally {
            if (mounted) setLoading(false);
        }
    };

    // Safety check for unmount
    let mounted = true;
    useEffect(() => {
        return () => { mounted = false };
    }, []);

    return (
        <Layout
            title="EDITAR DADOS PESSOAIS"
            user={user}
            onToggleRole={onToggleRole}
            showBack
        >
            <div className="max-w-4xl mx-auto p-4 sm:p-8">
                <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <h3 className="col-span-1 md:col-span-2 text-[#3b5998] font-black uppercase text-sm tracking-widest border-b border-gray-100 pb-2">
                            Documentos
                        </h3>

                        <div>
                            <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">RG</label>
                            <input
                                type="text"
                                name="rg_func"
                                value={formData.rg_func || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-[#3b5998]"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">CPF</label>
                            <input
                                type="text"
                                name="cpf_func"
                                value={formData.cpf_func || ''}
                                onChange={handleChange}
                                placeholder="000.000.000-00"
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-[#3b5998]"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Data de Nascimento</label>
                            <input
                                type="date"
                                name="data_nascimento_func"
                                value={formData.data_nascimento_func || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-[#3b5998]"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-6 pt-4">
                        <h3 className="col-span-1 md:col-span-6 text-[#3b5998] font-black uppercase text-sm tracking-widest border-b border-gray-100 pb-2">
                            Endereço
                        </h3>

                        <div className="md:col-span-2 relative">
                            <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">CEP</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    name="cep_func"
                                    value={formData.cep_func || ''}
                                    onChange={handleChange}
                                    onBlur={handleCepBlur}
                                    placeholder="00000-000"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-[#3b5998]"
                                />
                                {cepLoading && (
                                    <div className="absolute right-3 top-3 animate-spin rounded-full h-5 w-5 border-b-2 border-[#3b5998]"></div>
                                )}
                            </div>
                        </div>

                        <div className="md:col-span-4">
                            <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Logradouro</label>
                            <input
                                type="text"
                                name="logradouro_func"
                                value={formData.logradouro_func || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-[#3b5998]"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Número</label>
                            <input
                                type="text"
                                name="n°_func"
                                value={formData["n°_func"] || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-[#3b5998]"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Complemento</label>
                            <input
                                type="text"
                                name="compl_func"
                                value={formData.compl_func || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-[#3b5998]"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Bairro</label>
                            <input
                                type="text"
                                name="bairro_func"
                                value={formData.bairro_func || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-[#3b5998]"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Cidade</label>
                            <input
                                type="text"
                                name="cidade_func"
                                value={formData.cidade_func || ''}
                                onChange={handleChange}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-[#3b5998]"
                            />
                        </div>

                        <div className="md:col-span-3">
                            <label className="block text-[10px] uppercase font-black text-gray-400 tracking-widest mb-1">Estado</label>
                            <input
                                type="text"
                                name="estado_func"
                                value={formData.estado_func || ''}
                                onChange={handleChange}
                                maxLength={2}
                                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 font-bold text-gray-700 focus:outline-none focus:border-[#3b5998]"
                            />
                        </div>

                    </div>

                    <div className="pt-6 flex justify-end">
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-[#3b5998] text-white font-black uppercase tracking-widest py-3 px-8 rounded-full shadow-lg hover:bg-blue-700 active:scale-95 transition-all text-xs flex items-center gap-2"
                        >
                            <Save size={16} />
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default PersonalDataEdit;
