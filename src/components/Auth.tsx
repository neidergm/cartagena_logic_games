import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    const handleSendMagicLink = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.signInWithOtp({
            email,
            options: {
                emailRedirectTo: window.location.origin,
            }
        });

        if (error) {
            setMessage({ text: error.message, type: 'error' });
            setLoading(false);
        } else {
            setSent(true);
            setMessage({ text: '¡Enlace mágico enviado! Revisa tu correo.', type: 'success' });
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#1a1614] font-['Lato'] p-4">
            <div className="bg-[#2c241b] p-8 rounded-lg border border-[#5D4037] shadow-2xl max-w-md w-full">
                <h1 className="text-3xl font-bold text-[#FFD700] font-['Cinzel'] text-center mb-2">
                    Cartagena Games
                </h1>
                <p className="text-stone-400 text-center mb-8">Acceso a la Plataforma</p>

                {message && (
                    <div className={`mb-4 p-3 rounded text-sm ${message.type === 'error' ? 'bg-red-900/50 text-red-200 border border-red-800' : 'bg-green-900/50 text-green-200 border border-green-800'}`}>
                        {message.text}
                    </div>
                )}

                {!sent ? (
                    <form onSubmit={handleSendMagicLink} className="space-y-4">
                        <div>
                            <label className="block text-stone-300 text-sm font-bold mb-2" htmlFor="email">
                                Correo Electrónico
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-black/30 border border-[#5D4037] rounded p-3 text-stone-100 focus:border-[#FFD700] focus:outline-none transition-colors"
                                placeholder="tu@email.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50 disabled:cursor-not-allowed border border-[#deb887]/20"
                        >
                            {loading ? 'Enviando...' : 'Enviar Enlace Mágico'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="bg-black/20 p-6 rounded-lg border border-[#5D4037]/50">
                            <div className="text-4xl mb-4">📧</div>
                            <h3 className="text-[#FFD700] font-bold text-lg mb-2">¡Revisa tu bandeja!</h3>
                            <p className="text-stone-400 text-sm">
                                Hemos enviado un enlace de acceso a <span className="text-white font-mono">{email}</span>
                            </p>
                            <p className="text-stone-500 text-xs mt-4">
                                Puedes cerrar esta pestaña una vez hayas hecho click en el enlace.
                            </p>
                        </div>

                        <button
                            onClick={() => {
                                setSent(false);
                                setMessage(null);
                            }}
                            className="text-stone-500 hover:text-[#deb887] text-sm underline transition-colors"
                        >
                            Usar otro correo
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
