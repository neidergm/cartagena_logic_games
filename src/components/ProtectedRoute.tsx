import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Auth } from './Auth';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1614] flex items-center justify-center text-[#FFD700] font-['Cinzel']">
                <div className="text-xl animate-pulse">Verificando credenciales...</div>
            </div>
        );
    }

    if (!session) {
        return (
            <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="w-full max-w-md">
                    <Auth />
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
