
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { Loader2, AlertCircle } from 'lucide-react';

export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { user, loading } = useAuth();
    const [showTimeout, setShowTimeout] = useState(false);

    // Detect if loading is taking too long (possible infinite loading)
    useEffect(() => {
        if (loading) {
            const timeout = setTimeout(() => {
                setShowTimeout(true);
            }, 10000); // 10 seconds

            return () => clearTimeout(timeout);
        } else {
            setShowTimeout(false);
        }
    }, [loading]);

    if (loading) {
        if (showTimeout) {
            // Show error message if loading takes too long
            return (
                <div className="h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                        <AlertCircle className="mx-auto mb-4 text-red-500" size={48} />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Tempo Limite Excedido</h2>
                        <p className="text-gray-600 mb-6">
                            A autenticação está demorando mais que o esperado. Isso pode indicar um problema de conexão.
                        </p>
                        <div className="space-y-3">
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-[#3b5998] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Tentar Novamente
                            </button>
                            <a
                                href="/debug.html"
                                target="_blank"
                                className="block w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Abrir Diagnóstico
                            </a>
                        </div>
                        <p className="text-xs text-gray-500 mt-4">
                            A página de diagnóstico mostra informações técnicas que podem ajudar a identificar o problema.
                        </p>
                    </div>
                </div>
            );
        }

        return (
            <div className="h-screen flex flex-col items-center justify-center">
                <Loader2 className="animate-spin text-[#3b5998] mb-4" size={32} />
                <p className="text-gray-500 text-sm">Autenticando...</p>
            </div>
        );
    }

    if (!user) {
        // Check if we're in an iframe and should not redirect to login
        const isInIframe = window.self !== window.top;
        const hasUserIdParam = new URLSearchParams(window.location.search).has('user_id');

        if (isInIframe || hasUserIdParam) {
            // Show error instead of redirecting, since we're in MFE mode
            return (
                <div className="h-screen flex items-center justify-center p-4">
                    <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                        <AlertCircle className="mx-auto mb-4 text-orange-500" size={48} />
                        <h2 className="text-xl font-bold text-gray-800 mb-2">Falha na Autenticação</h2>
                        <p className="text-gray-600 mb-4">
                            Não foi possível autenticar com as informações fornecidas pelo Portal.
                        </p>
                        <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left text-sm">
                            <p className="text-gray-700 font-semibold mb-2">Possíveis causas:</p>
                            <ul className="list-disc list-inside text-gray-600 space-y-1">
                                <li>Parâmetro user_id ausente ou inválido</li>
                                <li>Usuário não encontrado no banco de dados</li>
                                <li>Problema de conexão com o servidor</li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <a
                                href="/debug.html"
                                target="_blank"
                                className="block w-full bg-[#3b5998] text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                            >
                                Ver Diagnóstico Completo
                            </a>
                            <button
                                onClick={() => {
                                    sessionStorage.clear();
                                    localStorage.clear();
                                    window.location.reload();
                                }}
                                className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl font-bold hover:bg-gray-200 transition-colors"
                            >
                                Limpar Cache e Recarregar
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        // Normal redirect to login for standalone usage
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};
