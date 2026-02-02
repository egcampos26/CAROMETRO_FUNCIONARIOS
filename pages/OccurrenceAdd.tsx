
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Funcionario, Occurrence, AuthUser } from '../types';
import { UserCheck, Calendar, Search, Users, X, CheckCircle2 } from 'lucide-react';

interface OccurrenceAddProps {
  officials: Funcionario[];
  onAdd: (occ: Occurrence) => void;
  user: AuthUser | null;
}

const OccurrenceAdd: React.FC<OccurrenceAddProps> = ({ officials, onAdd, user }) => {
  const { funcionarioId } = useParams<{ funcionarioId: string }>();
  const navigate = useNavigate();
  const initialOfficial = officials.find(s => s.id_func === funcionarioId);

  const today = new Date().toISOString().split('T')[0];

  const [selectedIds, setSelectedIds] = useState<string[]>(funcionarioId ? [funcionarioId] : []);
  const [officialSearch, setOfficialSearch] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<Occurrence['category']>('Comportamental');

  if (!initialOfficial) return <div className="p-8 text-center font-bold">Colaborador não encontrado</div>;

  const filteredOfficials = officialSearch.trim() === ''
    ? []
    : officials.filter(s =>
      (s.nome_func.toLowerCase().includes(officialSearch.toLowerCase()) ||
        s.rf.toLowerCase().includes(officialSearch.toLowerCase())) &&
      !selectedIds.includes(s.id_func)
    ).slice(0, 5);

  const toggleAdditionalOfficial = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    setOfficialSearch('');
  };

  const getOfficial = (id: string) => officials.find(s => s.id_func === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0 || !title || !description || !date) return;

    const groupId = selectedIds.length > 1 ? `group-${Date.now()}` : undefined;

    selectedIds.forEach((id, index) => {
      const newOcc: Occurrence = {
        id: (Date.now() + index).toString(),
        funcionarioId: id,
        groupId,
        date: date,
        title,
        description,
        category,
        registeredBy: user?.name || 'Sistema'
      };
      onAdd(newOcc);
    });

    navigate(`/funcionario/${initialOfficial.id_func}`, { replace: true });
  };

  const headerTitle = (
    <div className="flex flex-col items-center leading-none">
      <span className="text-lg sm:text-xl font-black tracking-tighter uppercase mb-0.5">REGISTRO</span>
      <span className="text-[10px] sm:text-[11px] font-bold opacity-70 tracking-widest uppercase">NOVA OCORRÊNCIA</span>
    </div>
  );

  return (
    <Layout title={headerTitle}>
      <div className="p-6 max-w-4xl mx-auto pb-20">
        <div className="mb-6 flex items-center gap-4 p-4 bg-blue-50/30 rounded-2xl border border-blue-100/50">
          <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-sm flex items-center justify-center bg-gray-100">
            {initialOfficial.photoUrl ? (
              <img src={initialOfficial.foto_func} className="w-full h-full object-cover" alt="" />
            ) : (
              <X size={24} className="text-gray-300" />
            )}
          </div>
          <div>
            <h3 className="font-black text-[#3b5998] uppercase text-sm leading-tight">{initialOfficial.nome_func}</h3>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{initialOfficial.funcao} • {initialOfficial.categoria}</p>
          </div>
          <div className="ml-auto">
            <span className="text-[9px] font-black bg-[#3b5998] text-white px-2 py-1 rounded-md uppercase">Principal</span>
          </div>
        </div>

        <div className="mb-10 p-5 bg-gray-50/50 rounded-2xl border-2 border-dashed border-gray-100 space-y-4">
          <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
            <Users size={14} /> Acrescentar mais colaboradores a este registro?
          </label>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Buscar colaborador por nome ou RF..."
              className="w-full pl-12 pr-4 py-4 bg-white border-2 border-gray-100 rounded-2xl focus:border-[#3b5998] outline-none font-bold text-gray-700 transition-all text-sm"
              value={officialSearch}
              onChange={(e) => setOfficialSearch(e.target.value)}
            />

            {filteredOfficials.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-40">
                {filteredOfficials.map(s => (
                  <button
                    key={s.id_func}
                    type="button"
                    onClick={() => toggleAdditionalOfficial(s.id_func)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex items-center justify-center bg-gray-100">
                      {s.foto_func ? <img src={s.foto_func} className="w-full h-full object-cover" alt="" /> : <X size={16} className="text-gray-300" />}
                    </div>
                    <div className="text-left">
                      <p className="text-xs font-black text-gray-800 uppercase leading-none">{s.nome_func}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{s.funcao} • RF: {s.rf}</p>
                    </div>
                    <CheckCircle2 size={18} className="ml-auto text-gray-200" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {selectedIds.length > 1 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedIds.map(id => {
                if (id === funcionarioId) return null;
                const s = getOfficial(id);
                if (!s) return null;
                return (
                  <div key={id} className="flex items-center gap-2 bg-blue-50 text-[#3b5998] pl-2 pr-1 py-1 rounded-full border border-blue-100 animate-in fade-in zoom-in duration-200">
                    <span className="text-[10px] font-black uppercase truncate max-w-[120px]">{s.nome_func.split(' ')[0]}</span>
                    <button
                      type="button"
                      onClick={() => toggleAdditionalOfficial(id)}
                      className="w-5 h-5 bg-white rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Data da Ocorrência</label>
              <div className="relative">
                <input
                  type="date"
                  className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#3b5998] outline-none font-bold text-gray-700 transition-all"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                />
                <Calendar className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-300 pointer-events-none" size={18} />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Registrado por</label>
              <div className="flex items-center gap-3 p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl text-gray-500 font-bold">
                <UserCheck size={18} className="text-[#3b5998]" />
                <span className="text-sm">{user?.name || 'Usuário'}</span>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Categoria</label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {['Comportamental', 'Acadêmica', 'Médica', 'Outros'].map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat as any)}
                  className={`py-3 px-2 rounded-xl text-[10px] font-black uppercase tracking-tighter border-2 transition-all shadow-sm ${category === cat
                    ? 'bg-[#3b5998] border-[#3b5998] text-white'
                    : 'bg-white border-gray-100 text-gray-400 hover:border-gray-200'
                    }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Assunto / Título</label>
            <input
              type="text"
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#3b5998] outline-none font-bold text-gray-800 transition-all"
              placeholder="Ex: Falta de material, Conflito, Elogio..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Relato Detalhado</label>
            <textarea
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#3b5998] outline-none min-h-[180px] font-medium text-gray-700 leading-relaxed transition-all"
              placeholder="Descreva o ocorrido com o máximo de detalhes..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-[#3b5998] text-white py-5 rounded-3xl font-black uppercase shadow-xl hover:bg-blue-700 active:scale-95 transition-all text-base tracking-widest border-b-4 border-blue-900"
          >
            Confirmar Registro {selectedIds.length > 1 ? `(${selectedIds.length} Colaboradores)` : ''}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default OccurrenceAdd;
