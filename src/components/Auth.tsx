import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export const Auth: React.FC = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [sent, setSent] = useState(false);
    const [message, setMessage] = useState<{ text: string, type: 'error' | 'success' } | null>(null);

    const [otpCode, setOtpCode] = useState('');

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
            setMessage({ text: '¡Enlace enviado! Revisa tu correo o ingresa el código.', type: 'success' });
            setLoading(false);
        }
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);

        const { error } = await supabase.auth.verifyOtp({
            email,
            token: otpCode,
            type: 'email',
        });

        if (error) {
            setMessage({ text: error.message, type: 'error' });
            setLoading(false);
        } else {
            // Session is handled automatically by onAuthStateChange in Layout
            // We don't need to do anything here other than maybe show success
            setMessage({ text: '¡Acceso concedido!', type: 'success' });
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center font-['Lato'] p-4">
            <div className="bg-[#2c241b] p-8 rounded-lg border border-[#5D4037] shadow-2xl max-w-md w-full">
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
                            {loading ? 'Cargando...' : 'Continuar'}
                        </button>
                    </form>
                ) : (
                    <div className="text-center space-y-6">
                        <div className="bg-black/20 p-6 rounded-lg border border-[#5D4037]/50">
                            <div className="text-4xl mb-4">📧</div>
                            <h3 className="text-[#FFD700] font-bold text-lg mb-2">¡Revisa tu bandeja!</h3>
                            <p className="text-stone-400 text-sm mb-4">
                                Hemos enviado un enlace de acceso a <span className="text-white font-mono">{email}</span>
                            </p>

                            <div className="border-t border-[#5D4037]/30 pt-4 mt-4">
                                <p className="text-stone-300 text-sm mb-3">O ingresa el código de seguridad:</p>
                                <form onSubmit={handleVerifyOtp} className="space-y-3">
                                    <input
                                        type="text"
                                        value={otpCode}
                                        onChange={(e) => setOtpCode(e.target.value)}
                                        className="w-full bg-black/30 border border-[#5D4037] rounded p-3 text-center text-xl tracking-widest text-[#FFD700] focus:border-[#FFD700] focus:outline-none transition-colors font-mono"
                                        placeholder="00000000"
                                        maxLength={8}
                                        required
                                    />
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="w-full bg-[#8B4513] hover:bg-[#A0522D] text-white font-bold py-2 px-4 rounded transition-colors disabled:opacity-50 border border-[#deb887]/20"
                                    >
                                        {loading ? 'Verificando...' : 'Verificar Código'}
                                    </button>
                                </form>
                            </div>
                        </div>

                        <button
                            onClick={() => {
                                setSent(false);
                                setMessage(null);
                                setOtpCode('');
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
