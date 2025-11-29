import React, { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { type Session } from '@supabase/supabase-js';
import { Auth } from './Auth';

export const Layout: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
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
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1614] flex items-center justify-center text-[#FFD700] font-['Cinzel']">
                <div className="text-xl animate-pulse">Cargando...</div>
            </div>
        );
    }

    if (!session) {
        return <Auth />;
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col">
            <header className="bg-[#2c241b] border-b border-[#5D4037] py-4 px-6 flex justify-between items-center shadow-md">
                <div className="font-['Cinzel'] text-[#FFD700] font-bold text-xl tracking-wider">
                    Cartagena Games
                </div>
                <div className="flex items-center gap-4">
                    <span className="text-stone-400 text-sm hidden sm:inline">{session.user.email}</span>
                    <button
                        onClick={handleLogout}
                        className="text-xs uppercase tracking-widest text-[#deb887] hover:text-white border border-[#deb887]/30 hover:border-[#deb887] px-3 py-1 rounded transition-all"
                    >
                        Cerrar Sesión
                    </button>
                </div>
            </header>

            <main className="flex-grow">
                <Outlet />
            </main>

            <footer className="border-t border-gray-800 py-6 bg-[#1a1614]">
                <div className="max-w-7xl mx-auto px-4 text-center text-stone-600 text-sm font-['Cinzel']">
                    &copy; {new Date().getFullYear()} NG. Strengthen your mind.
                </div>
            </footer>
        </div>
    );
};
