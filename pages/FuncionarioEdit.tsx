
import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { GRADES, MOCK_FUNCIONARIOS } from '../constants';
import { Funcionario, AuthUser } from '../types';
import { Save, Camera, Image as ImageIcon, UserCircle2, X, ShieldAlert } from 'lucide-react';
import { convertToWebP } from '../lib/imageUtils';

interface FuncionarioEditProps {
  officials: Funcionario[];
  onUpdate: (official: Funcionario) => void;
  user: AuthUser;
  onToggleRole: () => void;
}

const FuncionarioEdit: React.FC<FuncionarioEditProps> = ({ officials, onUpdate, user, onToggleRole }) => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const official = officials.find(s => s.id_func === id);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState<Funcionario | null>(official ? { ...official } : null);
  const [showSourceModal, setShowSourceModal] = useState(false);

  useEffect(() => {
    if (user.role !== 'Admin') {
      const timer = setTimeout(() => {
        navigate(`/funcionario/${id}`, { replace: true });
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [user.role, navigate, id]);

  if (user.role !== 'Admin') {
    return (
      <Layout title="ACESSO NEGADO" user={user} onToggleRole={onToggleRole}>
        <div className="flex flex-col items-center justify-center h-[70vh] p-8 text-center space-y-4">
          <ShieldAlert size={48} className="text-red-500 mb-4" />
          <h2 className="text-2xl font-black text-gray-900 uppercase">Apenas Administradores</h2>
          <p className="text-gray-500 font-medium">Redirecionando...</p>
        </div>
      </Layout>
    );
  }

  if (!formData) return <div className="p-8 text-center font-bold">Funcionário não encontrado</div>;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdate(formData);
    navigate(`/funcionario/${formData.id_func}`, { replace: true });
  };

  const handleCancel = () => {
    navigate(`/funcionario/${formData.id_func}`, { replace: true });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const webpDataUrl = await convertToWebP(file);
        setFormData({ ...formData, foto_func: webpDataUrl });
        setShowSourceModal(false);
      } catch (err) {
        console.error('Error converting image to WebP:', err);
        // Fallback to original reader if WebP fails
        const reader = new FileReader();
        reader.onloadend = () => {
          setFormData({ ...formData, foto_func: reader.result as string });
          setShowSourceModal(false);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  const headerTitle = (
    <div className="flex flex-col items-center leading-none">
      <span className="text-lg sm:text-xl font-black tracking-tighter uppercase mb-0.5">EDITOR DE PERFIL</span>
    </div>
  );

  return (
    <Layout
      title={headerTitle}
      user={user}
      onToggleRole={onToggleRole}
    >
      <div className="max-w-4xl mx-auto p-4 sm:p-8 lg:p-12">
        <form onSubmit={handleSave} className="flex flex-col lg:flex-row gap-8 lg:gap-16">

          <div className="flex flex-col items-center lg:w-1/3">
            <span className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest block text-center mb-4">FOTO DO PERFIL</span>
            <div
              onClick={() => setShowSourceModal(true)}
              className="relative w-56 aspect-[3/4] bg-gray-100 border-4 border-white rounded-3xl mx-auto flex flex-col items-center justify-center cursor-pointer overflow-hidden shadow-xl"
            >
              {formData.foto_func ? (
                <img src={formData.foto_func} alt="Preview" className="w-full h-full object-cover" />
              ) : (
                <UserCircle2 size={64} className="text-gray-300" />
              )}
              <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={32} />
              </div>
            </div>
          </div>

          <div className="flex-1 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="col-span-1 md:col-span-2">
                <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Nome Completo</label>
                <input
                  type="text"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-2xl font-bold outline-none"
                  value={formData.nome_func}
                  onChange={(e) => setFormData({ ...formData, nome_func: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">RF (Registro Funcional)</label>
                <input
                  type="text"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-2xl font-bold outline-none"
                  value={formData.rf}
                  onChange={(e) => setFormData({ ...formData, rf: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">VC (Vínculo)</label>
                <input
                  type="text"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-2xl font-bold outline-none"
                  value={formData.vc}
                  onChange={(e) => setFormData({ ...formData, vc: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Vínculo (Grupo)</label>
                <select
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-2xl font-bold outline-none appearance-none"
                  value={formData.categoria}
                  onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                >
                  <option value="SERVIDOR">SERVIDOR</option>
                  <option value="TERCERIZADO">TERCEIRIZADO</option>
                  <option value="CONTRATO">CONTRATO</option>
                </select>
              </div>

              <div className="col-span-1 md:col-span-2 grid grid-cols-3 gap-3">
                <div className="col-span-1">
                  <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Cargo</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-xl font-bold outline-none text-xs"
                    value={formData.cargo}
                    onChange={(e) => setFormData({ ...formData, cargo: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Função</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-xl font-bold outline-none text-xs"
                    value={formData.funcao}
                    onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
                  />
                </div>
                <div className="col-span-1">
                  <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Subfunção</label>
                  <input
                    type="text"
                    className="w-full p-3 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-xl font-bold outline-none text-xs"
                    value={formData.subfuncao}
                    onChange={(e) => setFormData({ ...formData, subfuncao: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Grau QPE</label>
                <input
                  type="text"
                  placeholder="Ex: 14"
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-2xl font-bold outline-none"
                  value={formData.qpe}
                  onChange={(e) => setFormData({ ...formData, qpe: e.target.value })}
                />
              </div>

              <div>
                <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Status</label>
                <select
                  className="w-full p-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-2xl font-bold outline-none appearance-none"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="Ativo">Ativo</option>
                  <option value="Inativo">Inativo</option>
                </select>
              </div>
            </div>

            <div className="flex gap-4 mt-8">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 bg-gray-100 text-gray-500 py-4 rounded-3xl font-black uppercase shadow-sm hover:bg-gray-200 active:scale-95 transition-all text-sm tracking-widest border-b-4 border-gray-300"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-[1.5] bg-[#3b5998] text-white py-4 rounded-3xl font-black uppercase shadow-xl hover:bg-blue-700 active:scale-95 transition-all text-sm tracking-widest border-b-4 border-blue-900"
              >
                Confirmar Alterações
              </button>
            </div>
          </div>
        </form>
      </div>

      <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
      <input type="file" ref={cameraInputRef} onChange={handleFileChange} accept="image/*" capture="environment" className="hidden" />

      {showSourceModal && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-sm bg-white rounded-t-[40px] sm:rounded-[40px] p-8 space-y-6 animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center">
              <h3 className="font-black text-[#3b5998] uppercase tracking-widest text-sm">Alterar Foto</h3>
              <button onClick={() => setShowSourceModal(false)}><X size={24} className="text-gray-300" /></button>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => cameraInputRef.current?.click()} className="flex flex-col items-center p-6 bg-blue-50 rounded-3xl border-2 border-blue-100">
                <Camera size={32} className="text-[#3b5998] mb-2" />
                <span className="text-[10px] font-black text-[#3b5998] uppercase tracking-widest">Câmera</span>
              </button>
              <button onClick={() => fileInputRef.current?.click()} className="flex flex-col items-center p-6 bg-gray-50 rounded-3xl border-2 border-gray-100">
                <ImageIcon size={32} className="text-gray-400 mb-2" />
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Galeria</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default FuncionarioEdit;
