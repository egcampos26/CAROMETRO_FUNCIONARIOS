
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from './supabase';
import { Funcionario } from './types';

// Defining our user type based on the View V_LOGIN_DETAILS or LOGIN table
export interface UserSession {
    id_func: string;
    nome_func: string;
    email: string;
    role: 'Admin' | 'Teacher' | 'Funcionario'; // Simplified roles for now
    details?: Funcionario;
}

interface AuthContextType {
    user: UserSession | null;
    loading: boolean;
    login: (email: string, senha: string) => Promise<{ error: string | null }>;
    logout: () => void;
    loginAsTestUser?: () => void;
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => ({ error: 'Not implemented' }),
    logout: () => { },
    loginAsTestUser: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initializeAuth = async () => {
            // Priority 1: Check URL for external session (MFE mode)
            // Debugging: Log the full URL and search params
            console.log('Current URL:', window.location.href);
            const params = new URLSearchParams(window.location.search);
            const externalUserId = params.get('user_id');
            console.log('Parsed user_id:', externalUserId);

            // DEBUG OVERLAY
            const debugLog = document.createElement('div');
            debugLog.style.position = 'fixed';
            debugLog.style.top = '0';
            debugLog.style.left = '0';
            debugLog.style.width = '100%';
            debugLog.style.background = 'rgba(0,0,0,0.8)';
            debugLog.style.color = '#00ff00';
            debugLog.style.padding = '10px';
            debugLog.style.zIndex = '99999';
            debugLog.style.fontSize = '12px';
            debugLog.style.fontFamily = 'monospace';
            debugLog.style.pointerEvents = 'none';
            debugLog.innerHTML = `
                <p>URL: ${window.location.href}</p>
                <p>Search: ${window.location.search}</p>
                <p>Hash: ${window.location.hash}</p>
                <p>User ID Param: ${externalUserId || 'null'}</p>
                <p>LocalStorage User: ${localStorage.getItem('carometro_user')}</p>
            `;
            document.body.appendChild(debugLog);

            if (externalUserId) {
                console.log('Detected external user_id, attempting auto-login...');
                try {
                    const { data, error } = await supabase
                        .from('LOGIN')
                        .select('id_func, email, usuario')
                        .eq('id_func', externalUserId)
                        .maybeSingle();

                    if (error) {
                        debugLog.innerHTML += `<p style="color:red">Supabase Error: ${error.message}</p>`;
                        console.error('Supabase error:', error);
                    }

                    if (data && !error) {
                        debugLog.innerHTML += `<p style="color:cyan">User Found: ${data.email}</p>`;
                        const { data: funcData } = await supabase
                            .from('FUNCIONARIOS')
                            .select('*')
                            .eq('id_func', data.id_func)
                            .single();

                        const role = (funcData?.categoria === 'GESTAO') ? 'Admin' : 'Teacher';
                        const sessionUser: UserSession = {
                            id_func: data.id_func.toString(),
                            nome_func: funcData?.nome_func || data.usuario || 'Usuário',
                            email: data.email,
                            role: role,
                            details: funcData as unknown as Funcionario
                        };
                        setUser(sessionUser);
                        localStorage.setItem('carometro_user', JSON.stringify(sessionUser));
                        setLoading(false);
                        debugLog.remove(); // Remove overlay on success
                        return;
                    } else {
                        debugLog.innerHTML += `<p style="color:orange">User Not Found in LOGIN table</p>`;
                    }
                } catch (err: any) {
                    console.error('External login failed:', err);
                    debugLog.innerHTML += `<p style="color:red">Exception: ${err.message}</p>`;
                }
            } else {
                debugLog.innerHTML += `<p>No external user_id found. Checking local storage...</p>`;
            }

            // Priority 2: Check local storage for persisted session
            const storedUser = localStorage.getItem('carometro_user');
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            }
            setLoading(false);
        };

        initializeAuth();
    }, []);

    const login = async (identifier: string, senha: string) => {
        try {
            // Use RPC to check credentials (handles hashed and plain text passwords)
            const { data, error } = await supabase
                .rpc('check_user_login', {
                    login_input: identifier,
                    password_input: senha
                });

            if (error) {
                console.error('Login RPC error:', error);
                return { error: 'Erro ao conectar com o servidor' };
            }

            if (!data || data.length === 0) {
                return { error: 'Credenciais inválidas' };
            }

            const userData = data[0];

            // Now fetch the full funcionario details using id_func for the session state
            let funcionarioDetails = null;
            const { data: funcData, error: funcError } = await supabase
                .from('FUNCIONARIOS')
                .select('*')
                .eq('id_func', userData.id_func)
                .single();

            if (funcError) {
                console.error('Error fetching funcionario details:', funcError);
            } else {
                funcionarioDetails = funcData;
            }

            // Map to UserSession
            // We'll determine the role based on funcionario categoria if available
            const role = (funcionarioDetails?.categoria === 'GESTAO') ? 'Admin' : 'Teacher';

            const sessionUser: UserSession = {
                id_func: userData.id_func.toString(),
                nome_func: funcionarioDetails?.nome_func || userData.usuario || 'Usuário',
                email: userData.email,
                role: role,
                details: funcionarioDetails as unknown as Funcionario
            };

            setUser(sessionUser);
            localStorage.setItem('carometro_user', JSON.stringify(sessionUser));
            return { error: null };
        } catch (err) {
            console.error('Login error:', err);
            return { error: 'Erro inesperado' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('carometro_user');
    };

    const loginAsTestUser = () => {
        const testUser: UserSession = {
            id_func: 'test-user-id',
            nome_func: 'Usuário Teste',
            email: 'teste@exemplo.com',
            role: 'Admin',
            details: {
                id_func: 'test-user-id',
                nome_func: 'Usuário Teste',
                rf: '0000000',
                vc: '1',
                empresa: 'PREFEITURA',
                status: 'ATIVO',
                vinculo: 'TESTE',
                categoria: 'GESTAO',
                cargo_base: 'Cargo Base',
                cargo: 'Cargo Teste',
                funcao: 'Função Teste',
                subfuncao: '',
                qpe: '00',
                jornada: 'COMPLETA',
                inicio_exercicio: '2024-01-01',
                inicio_ue: '2024-01-01',
                ue_lotacao: '000000',
                ue_exercicio: '000000',
                ue_acumulo: '',
                email_sme: 'teste@sme.sp.gov.br',
                email_edu: 'teste@edu.sme.sp.gov.br',
                foto_func: ''
            } as Funcionario
        };
        setUser(testUser);
        localStorage.setItem('carometro_user', JSON.stringify(testUser));
        console.log('Logged in as Test User');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout, loginAsTestUser }}>
            {children}
        </AuthContext.Provider>
    );
};
