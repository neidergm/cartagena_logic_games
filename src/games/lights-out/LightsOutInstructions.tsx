import React from 'react';
import { Link } from 'react-router-dom';
import { Lightbulb, Play, ArrowLeft } from 'lucide-react';

const LightsOutInstructions: React.FC = () => {
    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 font-['Cinzel']">
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("/assets/lights-out.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="absolute inset-0 bg-black/80 z-0" />

            <div className="relative z-10 max-w-2xl w-full">
                <div className="mb-6">
                    <Link to="/" className="inline-flex items-center text-stone-400 hover:text-[#FFD700] transition-colors">
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Volver al inicio
                    </Link>
                </div>

                <div className="bg-black/60 rounded-2xl p-8 border border-[#FFD700]/30 backdrop-blur-md shadow-2xl">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="p-3 bg-[#FFD700]/10 rounded-xl border border-[#FFD700]/20">
                            <Lightbulb className="w-8 h-8 text-[#FFD700]" />
                        </div>
                        <h1 className="text-3xl font-bold text-[#FFD700]">Apaga las Luces</h1>
                    </div>

                    <div className="space-y-6 text-stone-300 leading-relaxed font-sans">
                        <p className="text-lg">
                            Bienvenido a <strong className="text-[#FFD700]">Apaga las Luces</strong>. El objetivo es simple pero desafiante:
                            apagar todas las lámparas de la cuadrícula.
                        </p>

                        <div className="bg-black/40 p-6 rounded-xl border border-[#5D4037]">
                            <h3 className="text-[#FFD700] font-bold mb-3 font-['Cinzel']">Reglas:</h3>
                            <ul className="list-disc list-inside space-y-2 text-stone-400">
                                <li>El juego comienza con un patrón aleatorio de luces encendidas.</li>
                                <li>Al tocar una lámpara, se alterna su estado y el de sus vecinas (arriba, abajo, izquierda, derecha).</li>
                                <li>Alternar significa: ENCENDIDO pasa a APAGADO, y viceversa.</li>
                                <li>Ganas cuando toda la cuadrícula está oscura.</li>
                            </ul>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-[#5D4037]/30">
                            <div className="text-sm text-stone-500">
                                Dificultad: <span className="text-[#FFD700] font-medium">Media</span>
                            </div>
                            <Link
                                to="/game/lights-out-play"
                                className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-[#8B4513] to-[#A0522D] hover:scale-105 text-white rounded-lg font-bold transition-all border border-[#FFD700]/50 shadow-lg tracking-wider font-['Cinzel']"
                            >
                                Jugar Ahora <Play className="w-4 h-4 ml-2 fill-current" />
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default LightsOutInstructions;
