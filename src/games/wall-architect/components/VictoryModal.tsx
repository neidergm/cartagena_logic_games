import React from 'react';
import { useWallArchitectStore } from '../store';
import { calculateScore } from '../score';

interface VictoryModalProps {
    onNextLevel: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({ onNextLevel }) => {
    const { stats, resetLevel } = useWallArchitectStore();

    // Format time helper
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-in fade-in duration-500 backdrop-blur-sm">
            <div className="bg-[#2c241b] p-10 rounded border-4 border-[#FFD700] text-center max-w-lg shadow-[0_0_50px_rgba(255,215,0,0.2)] relative">
                <h2 className="text-4xl font-bold text-[#FFD700] mb-2 font-['Cinzel'] uppercase">¡Obra Finalizada!</h2>
                <p className="text-stone-300 mb-6 text-lg">
                    La estructura es sólida de nuevo. Excelente trabajo, Arquitecto.
                </p>

                <div className="grid grid-cols-3 gap-4 mb-8 bg-black/30 p-4 rounded border border-stone-700">
                    <div className="flex flex-col">
                        <span className="text-stone-500 text-xs uppercase">Tiempo</span>
                        <span className="text-xl font-bold text-[#FFD700]">{formatTime(stats.timeElapsed)}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-stone-500 text-xs uppercase">Clicks</span>
                        <span className="text-xl font-bold text-[#FFD700]">{stats.clicksToFindCrack}</span>
                    </div>
                    <div className="flex flex-col">
                        <span className="text-stone-500 text-xs uppercase">Movimientos</span>
                        <span className="text-xl font-bold text-[#FFD700]">{stats.movesCount}</span>
                    </div>
                </div>

                <div className="text-center mb-6">
                    <span className="text-stone-400 uppercase text-sm tracking-widest">Puntaje Total</span>
                    <div className="text-5xl font-bold text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] mt-2">
                        {calculateScore(stats)}
                    </div>
                </div>

                <div className="flex gap-4 justify-center">
                    <button
                        onClick={resetLevel}
                        className="px-6 py-3 bg-[#5d4037] hover:bg-[#4a3728] text-[#deb887] font-bold rounded border border-[#deb887]/30 transition-all font-['Cinzel']"
                    >
                        Repetir Nivel
                    </button>
                    <button
                        onClick={onNextLevel}
                        className="px-6 py-3 bg-[#FFD700] hover:bg-[#FDB931] text-[#2c241b] font-bold rounded shadow-lg transition-all font-['Cinzel']"
                    >
                        Siguiente Nivel
                    </button>
                </div>
            </div>
        </div>
    );
};
