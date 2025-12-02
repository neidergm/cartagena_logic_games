import React from 'react';
import { Link } from 'react-router-dom';
import { Hammer, Search, ArrowLeft, Play } from 'lucide-react';

const WallArchitectInstructions: React.FC = () => {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 font-['Lato']">
            <div className="mb-8">
                <Link to="/" className="inline-flex items-center text-stone-400 hover:text-[#FFD700] transition-colors font-['Cinzel']">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Volver al inicio
                </Link>
            </div>

            <div className="bg-[#2c241b]/95 rounded-2xl p-8 md:p-12 border border-[#5D4037] shadow-2xl backdrop-blur-sm relative overflow-hidden">
                {/* Decorative background element */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#FFD700]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

                <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-10 relative z-10">
                    <div className="p-4 bg-[#4a3728] rounded-2xl border border-[#8B4513] shadow-lg">
                        <Hammer className="w-12 h-12 text-[#FFD700]" />
                    </div>
                    <div>
                        <h1 className="text-4xl md:text-5xl font-bold text-[#FFD700] font-['Cinzel'] mb-2 tracking-wide">
                            El Arquitecto
                        </h1>
                        <p className="text-stone-400 text-lg">Restauración de las Murallas de Cartagena</p>
                    </div>
                </div>

                <div className="space-y-8 text-stone-300 leading-relaxed relative z-10">
                    <div className="prose prose-invert max-w-none">
                        <p className="text-xl text-stone-200">
                            Las históricas murallas han sufrido daños por el paso del tiempo. Como Arquitecto Real, tu misión es
                            <strong className="text-[#FFD700]"> localizar las grietas ocultas</strong> y
                            <strong className="text-[#FFD700]"> repararlas</strong> utilizando las piedras originales.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="bg-black/30 p-6 rounded-xl border border-[#5D4037]/50 hover:border-[#FFD700]/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Search className="w-6 h-6 text-blue-400" />
                                <h3 className="text-xl font-bold text-stone-100 font-['Cinzel']">1. Inspección</h3>
                            </div>
                            <ul className="space-y-3 text-stone-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FFD700] mt-1">•</span>
                                    <span>Explora la imagen de la muralla haciendo clic.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FFD700] mt-1">•</span>
                                    <span>Usa el sensor térmico: <span className="text-red-400 font-bold">¡QUEMA!</span> significa que estás muy cerca.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FFD700] mt-1">•</span>
                                    <span>Encuentra el punto exacto del daño para comenzar la obra.</span>
                                </li>
                            </ul>
                        </div>

                        <div className="bg-black/30 p-6 rounded-xl border border-[#5D4037]/50 hover:border-[#FFD700]/30 transition-colors">
                            <div className="flex items-center gap-3 mb-4">
                                <Hammer className="w-6 h-6 text-amber-500" />
                                <h3 className="text-xl font-bold text-stone-100 font-['Cinzel']">2. Reparación</h3>
                            </div>
                            <ul className="space-y-3 text-stone-400">
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FFD700] mt-1">•</span>
                                    <span>Arrastra las piedras del inventario hacia la grieta.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FFD700] mt-1">•</span>
                                    <span>Haz clic en una piedra del inventario para <span className="text-white font-bold">rotarla</span>.</span>
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-[#FFD700] mt-1">•</span>
                                    <span>Cubre todos los espacios oscuros sin superponer piedras.</span>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-8 border-t border-[#5D4037]">
                        <div className="text-sm text-stone-500 font-mono">
                            Dificultad: <span className="text-[#FFD700]">Progresiva</span>
                        </div>
                        <Link
                            to="/game/wall-architect-play"
                            className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-[#8B4513] to-[#A0522D] hover:from-[#A0522D] hover:to-[#8B4513] text-white rounded-lg font-bold transition-all hover:scale-105 hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] border border-[#FFD700]/30 font-['Cinzel'] tracking-wider text-lg"
                        >
                            Comenzar Obra <Play className="w-5 h-5 ml-3 fill-current" />
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};
export default WallArchitectInstructions;
