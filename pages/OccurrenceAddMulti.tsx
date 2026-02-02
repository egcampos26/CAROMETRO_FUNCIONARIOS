
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { Funcionario, Occurrence, AuthUser } from '../types';
import { UserCheck, Calendar, Search, X, Users, CheckCircle2 } from 'lucide-react';

interface OccurrenceAddMultiProps {
  officials: Funcionario[];
  onAdd: (occ: Occurrence) => void;
  user: AuthUser | null;
}

const OccurrenceAddMulti: React.FC<OccurrenceAddMultiProps> = ({ officials, onAdd, user }) => {
  const navigate = useNavigate();

  const today = new Date().toISOString().split('T')[0];

  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [officialSearch, setOfficialSearch] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState(today);
  const [category, setCategory] = useState<Occurrence['category']>('Comportamental');

  const filteredOfficials = officialSearch.trim() === ''
    ? []
    : officials.filter(s =>
      s.nome_func.toLowerCase().includes(officialSearch.toLowerCase()) ||
      s.rf.toLowerCase().includes(officialSearch.toLowerCase())
    ).slice(0, 5); // Limit suggestions to avoid clutter

  const toggleOfficial = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
    setOfficialSearch('');
  };

  const getOfficial = (id: string) => officials.find(s => s.id_func === id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIds.length === 0 || !title || !description || !date) return;

    // Create a group ID to link these records
    const groupId = `group-${Date.now()}`;

    // Create an occurrence for EACH selected student
    selectedIds.forEach((id, index) => {
      const newOcc: Occurrence = {
        id: (Date.now() + index).toString(),
        funcionarioId: id,
        groupId, // Associates records
        date: date,
        title,
        description,
        category,
        registeredBy: user?.name || 'Sistema'
      };
      onAdd(newOcc);
    });

    navigate('/occurrences', { replace: true });
  };

  const headerTitle = (
    <div className="flex flex-col items-center leading-none">
      <span className="text-lg sm:text-xl font-black tracking-tighter uppercase mb-0.5">REGISTRO COLETIVO</span>
      <span className="text-[10px] sm:text-[11px] font-bold opacity-70 tracking-widest uppercase">MÚLTIPLOS ALUNOS</span>
    </div>
  );

  return (
    <Layout title={headerTitle}>
      <div className="p-6 max-w-4xl mx-auto pb-20">

        {/* Seleção de Alunos */}
        <div className="mb-10 space-y-4">
          <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1 flex items-center gap-2">
            <Users size={14} /> Selecionar Alunos
          </label>

          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-300">
              <Search size={18} />
            </div>
            <input
              type="text"
              placeholder="Buscar colaborador por nome ou RA..."
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#3b5998] outline-none font-bold text-gray-700 transition-all"
              value={officialSearch}
              onChange={(e) => setOfficialSearch(e.target.value)}
            />

            {filteredOfficials.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-40">
                {filteredOfficials.map(s => (
                  <button
                    key={s.id_func}
                    onClick={() => toggleOfficial(s.id_func)}
                    className="w-full p-4 flex items-center gap-3 hover:bg-gray-50 transition-colors border-b border-gray-50 last:border-0"
                  >
                    <img src={s.foto_func} className="w-10 h-10 rounded-lg object-cover" alt="" />
                    <div className="text-left">
                      <p className="text-xs font-black text-gray-800 uppercase leading-none">{s.nome_func}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">{s.funcao} • RA: {s.rf}</p>
                    </div>
                    {selectedIds.includes(s.id_func) && <CheckCircle2 size={18} className="ml-auto text-green-500" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Chips dos selecionados */}
          {selectedIds.length > 0 && (
            <div className="flex flex-wrap gap-2 pt-2">
              {selectedIds.map(id => {
                const s = getOfficial(id);
                if (!s) return null;
                return (
                  <div key={id} className="flex items-center gap-2 bg-blue-50 text-[#3b5998] pl-2 pr-1 py-1 rounded-full border border-blue-100 animate-in fade-in zoom-in duration-200">
                    <span className="text-[10px] font-black uppercase truncate max-w-[120px]">{s.nome_func.split(' ')[0]}</span>
                    <button
                      onClick={() => toggleOfficial(id)}
                      className="w-5 h-5 bg-white rounded-full flex items-center justify-center hover:bg-red-50 hover:text-red-500 transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </div>
                );
              })}
              <button
                onClick={() => setSelectedIds([])}
                className="text-[9px] text-gray-400 font-black uppercase hover:text-red-500 underline pl-2"
              >
                Limpar Todos
              </button>
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
              placeholder="Ex: Conflito em grupo, Atividade coletiva..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Relato Detalhado</label>
            <textarea
              className="w-full p-4 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:bg-white focus:border-[#3b5998] outline-none min-h-[180px] font-medium text-gray-700 leading-relaxed transition-all"
              placeholder="Descreva o ocorrido que envolveu os alunos selecionados..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={selectedIds.length === 0}
            className={`w-full py-5 rounded-3xl font-black uppercase shadow-xl active:scale-95 transition-all text-base tracking-widest border-b-4 ${selectedIds.length > 0
              ? 'bg-[#3b5998] border-blue-900 text-white'
              : 'bg-gray-200 border-gray-300 text-gray-400 cursor-not-allowed'
              }`}
          >
            Confirmar Registro ({selectedIds.length} Alunos)
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default OccurrenceAddMulti;
