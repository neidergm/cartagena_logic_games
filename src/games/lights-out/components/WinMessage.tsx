import React from 'react';
import { Trophy } from 'lucide-react';

interface WinMessageProps {
    moves: number;
    timeElapsed: number;
    onPlayAgain: () => void;
    isLastLevel?: boolean;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const WinMessage: React.FC<WinMessageProps> = ({ moves, timeElapsed, onPlayAgain, isLastLevel = false }) => {
    return (
        <div className="aspect-square w-full max-w-[400px] mx-auto bg-black/40 rounded-xl flex flex-col items-center justify-center border border-[#FFD700]/30 animate-fade-in p-6">
            <div className="relative mb-6">
                <div className="absolute inset-0 bg-[#FFD700] blur-xl opacity-20 animate-pulse" />
                <Trophy className="w-24 h-24 text-[#FFD700] relative z-10 drop-shadow-[0_0_15px_rgba(255,215,0,0.5)]" />
            </div>

            <h3 className="text-3xl font-bold text-white mb-2 font-['Cinzel']">¡Victoria!</h3>
            <div className="text-center mb-8 font-sans space-y-1">
                <p className="text-stone-300">Resuelto en <span className="text-[#FFD700] font-bold">{moves}</span> movimientos</p>
                <p className="text-stone-300">Tiempo: <span className="text-[#FFD700] font-bold">{formatTime(timeElapsed)}</span></p>
            </div>

            <button
                onClick={onPlayAgain}
                className="px-8 py-3 bg-gradient-to-r from-[#8B4513] to-[#A0522D] hover:scale-105 text-white rounded-lg font-bold transition-all border border-[#FFD700]/50 shadow-lg tracking-wider font-['Cinzel']"
            >
                {isLastLevel ? 'Jugar de Nuevo' : 'Siguiente Nivel'}
            </button>
        </div>
    );
};
