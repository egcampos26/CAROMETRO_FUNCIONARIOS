
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
}

const AuthContext = createContext<AuthContextType>({
    user: null,
    loading: true,
    login: async () => ({ error: 'Not implemented' }),
    logout: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserSession | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check local storage for persisted session (simple implementation)
        const storedUser = localStorage.getItem('carometro_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (emailOrName: string, senha: string) => {
        try {
            // Query our custom LOGIN table with proper column escaping
            const { data, error } = await supabase
                .from('LOGIN')
                .select('id_func, nome_func, "E-mail", Categoria, VINCULO, funcionario_id')
                .or(`"E-mail".eq.${emailOrName},nome_func.ilike.%${emailOrName}%`)
                .eq('Senha', senha)
                .maybeSingle();

            if (error || !data) {
                console.error('Login query error:', error);
                return { error: 'Credenciais inválidas' };
            }

            // Now fetch the full funcionario details using funcionario_id
            let funcionarioDetails = null;
            if (data.funcionario_id) {
                const { data: funcData } = await supabase
                    .from('FUNCIONARIOS')
                    .select('*')
                    .eq('id_func', data.funcionario_id)
                    .single();

                funcionarioDetails = funcData;
            }

            // Map to UserSession
            const role = data.Categoria === 'GESTAO' ? 'Admin' : 'Teacher';

            const sessionUser: UserSession = {
                id_func: data.id_func.toString(),
                nome_func: data.nome_func,
                email: data['E-mail'],
                role: role,
                details: funcionarioDetails as unknown as Funcionario
            };

            setUser(sessionUser);
            localStorage.setItem('carometro_user', JSON.stringify(sessionUser));
            return { error: null };
        } catch (err) {
            console.error('Login error:', err);
            return { error: 'Erro ao conectar com o servidor' };
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('carometro_user');
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
