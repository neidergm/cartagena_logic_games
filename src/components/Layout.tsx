import React, { useEffect, useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { type Session } from '@supabase/supabase-js';
import { Auth } from './Auth';

export const Layout: React.FC = () => {
    const [session, setSession] = useState<Session | null>(null);
    const [loading, setLoading] = useState(true);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
            setLoading(false);
        });

        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
            if (session) setShowAuthModal(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setShowLogoutConfirm(false);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#1a1614] flex items-center justify-center text-[#FFD700] font-['Cinzel']">
                <div className="text-xl animate-pulse">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-900 text-white font-sans flex flex-col relative">
            <header className="bg-[#2c241b] border-b border-[#5D4037] py-4 px-6 flex justify-between items-center shadow-md z-20 relative">
                <div className="font-['Cinzel'] text-[#FFD700] font-bold text-xl tracking-wider">
                    <Link to="/">Cartagena Games</Link>
                </div>
                <div className="flex items-center gap-4">
                    {session ? (
                        <>
                            <span className="text-stone-400 text-sm hidden sm:inline">{session.user.email}</span>
                            <button
                                onClick={() => setShowLogoutConfirm(true)}
                                className="text-xs uppercase tracking-widest text-[#deb887] hover:text-white border border-[#deb887]/30 hover:border-[#deb887] px-3 py-1 rounded transition-all"
                            >
                                Cerrar Sesión
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => setShowAuthModal(true)}
                            className="text-xs uppercase tracking-widest bg-[#8B4513] hover:bg-[#A0522D] text-white border border-[#deb887]/30 px-4 py-2 rounded transition-all shadow-lg"
                        >
                            Iniciar Sesión
                        </button>
                    )}
                </div>
            </header>

            <main className="flex-grow z-10">
                <Outlet />
            </main>

            <footer className="border-t border-gray-800 py-6 bg-[#1a1614] z-20 relative">
                <div className="max-w-7xl mx-auto px-4 text-center text-stone-600 text-sm font-['Cinzel']">
                    &copy; {new Date().getFullYear()} NG. Strengthen your mind.
                </div>
            </footer>

            {/* Auth Modal */}
            {showAuthModal && !session && (
                <div className="fixed inset-0 z-50 bg-black/10 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300 py-5">
                    <div className="relative w-full max-w-md">
                        <button
                            onClick={() => setShowAuthModal(false)}
                            className="absolute top-0 mt-10 text-stone-400 hover:text-white text-xl"
                        >
                            ✕ Cerrar
                        </button>
                        <Auth />
                    </div>
                </div>
            )}

            {/* Logout Confirmation Modal */}
            {showLogoutConfirm && (
                <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#2c241b] p-8 rounded-lg border border-[#5D4037] shadow-2xl max-w-sm w-full text-center">
                        <h3 className="text-xl font-bold text-[#FFD700] font-['Cinzel'] mb-4">¿Cerrar Sesión?</h3>
                        <p className="text-stone-300 mb-8">¿Estás seguro de que quieres salir?</p>
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={() => setShowLogoutConfirm(false)}
                                className="px-4 py-2 text-stone-400 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleLogout}
                                className="px-6 py-2 bg-[#8B4513] hover:bg-[#A0522D] text-white rounded border border-[#deb887]/30 transition-all shadow-lg"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
