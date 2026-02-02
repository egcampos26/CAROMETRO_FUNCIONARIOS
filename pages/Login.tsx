
import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Lock, User, AlertCircle, Loader2 } from 'lucide-react';
import { INSTITUTIONAL_BLUE } from '../constants';

const Login: React.FC = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        const { error } = await login(email, password);

        if (error) {
            setError(error);
            setIsLoading(false);
        } else {
            // Login successful, AuthContext will update user state
            // We rely on the parent component (App) to redirect or show content
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
            <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white">

                {/* Header */}
                <div className="bg-[#3b5998] p-8 text-center relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-0"></div>
                    <div className="relative z-10">
                        <div className="bg-white/20 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 backdrop-blur-sm shadow-md">
                            <LayoutDashboard color="white" size={32} strokeWidth={2} />
                        </div>
                        <h1 className="text-white font-black text-2xl uppercase tracking-tighter mb-1">Portal Tarsila</h1>
                        <p className="text-blue-100 text-[10px] uppercase font-bold tracking-widest">Carômetro dos Funcionários</p>
                    </div>
                </div>

                {/* Form */}
                <div className="p-8 sm:p-10 space-y-8">
                    <div className="text-center">
                        <h2 className="text-[#3b5998] font-black text-xl uppercase tracking-tight">Login</h2>
                        <p className="text-gray-400 text-xs font-bold uppercase tracking-widest mt-1">Insira suas credenciais</p>
                    </div>

                    {error && (
                        <div className="bg-red-50 border border-red-100 p-4 rounded-xl flex items-center gap-3 text-red-500 animate-in slide-in-from-top duration-300">
                            <AlertCircle size={20} />
                            <span className="text-xs font-black uppercase tracking-wide">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Usuário ou E-mail</label>
                            <div className="relative">
                                <input
                                    type="text"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-2xl outline-none font-bold text-gray-700 transition-all text-sm"
                                    placeholder="Digite seu usuário..."
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[#3b5998] text-[10px] font-black uppercase tracking-widest ml-1">Senha</label>
                            <div className="relative">
                                <input
                                    type="password"
                                    className="w-full pl-12 pr-4 py-4 bg-gray-50 border-2 border-transparent focus:bg-white focus:border-[#3b5998] rounded-2xl outline-none font-bold text-gray-700 transition-all text-sm"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#3b5998] text-white py-4 rounded-2xl font-black uppercase shadow-lg hover:bg-blue-700 active:scale-95 transition-all text-sm tracking-widest border-b-4 border-blue-900 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 className="animate-spin" size={20} /> : 'Entrar'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login;
