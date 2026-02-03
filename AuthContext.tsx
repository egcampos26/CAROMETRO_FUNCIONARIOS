
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
            // Helper function for persistent diagnostic logging
            const logDebug = (key: string, value: any) => {
                const timestamp = new Date().toISOString();
                const logEntry = { timestamp, value };
                console.log(`[CAROMETRO DEBUG ${timestamp}] ${key}:`, value);
                try {
                    sessionStorage.setItem(`carometro_debug_${key}`, JSON.stringify(logEntry));
                } catch (e) {
                    console.error('Failed to write to sessionStorage:', e);
                }
            };

            // Priority 1: Check URL for external session (MFE mode)
            logDebug('full_url', window.location.href);
            logDebug('referrer', document.referrer);
            logDebug('in_iframe', window.self !== window.top);

            const params = new URLSearchParams(window.location.search);
            const externalUserId = params.get('user_id');
            logDebug('url_params', Object.fromEntries(params.entries()));
            logDebug('user_id_param', externalUserId);

            if (externalUserId) {
                logDebug('auth_step', 'starting_external_login');
                try {
                    const startTime = Date.now();
                    const { data, error } = await supabase
                        .from('LOGIN')
                        .select('id_func, email, usuario')
                        .eq('id_func', externalUserId)
                        .maybeSingle();

                    const queryTime = Date.now() - startTime;
                    logDebug('supabase_query_time_ms', queryTime);

                    if (error) {
                        logDebug('supabase_error', {
                            message: error.message,
                            details: error.details,
                            hint: error.hint,
                            code: error.code
                        });
                    }

                    if (data && !error) {
                        logDebug('user_found', { email: data.email, id_func: data.id_func });

                        const { data: funcData, error: funcError } = await supabase
                            .from('FUNCIONARIOS')
                            .select('*')
                            .eq('id_func', data.id_func)
                            .single();

                        if (funcError) {
                            logDebug('funcionario_error', {
                                message: funcError.message,
                                code: funcError.code
                            });
                        }

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
                        logDebug('auth_success', { nome: sessionUser.nome_func, role: sessionUser.role });
                        setLoading(false);
                        return;
                    } else {
                        logDebug('auth_step', 'user_not_found_in_db');
                    }
                } catch (err: any) {
                    logDebug('external_login_exception', {
                        message: err?.message || 'Unknown error',
                        stack: err?.stack || 'No stack trace'
                    });
                }
            } else {
                logDebug('auth_step', 'no_external_user_id');
            }

            // Priority 2: Check local storage for persisted session
            const storedUser = localStorage.getItem('carometro_user');
            if (storedUser) {
                logDebug('auth_step', 'using_stored_session');
                setUser(JSON.parse(storedUser));
            } else {
                logDebug('auth_step', 'no_stored_session');
            }
            setLoading(false);
            logDebug('auth_complete', { hasUser: !!storedUser || !!externalUserId });
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
