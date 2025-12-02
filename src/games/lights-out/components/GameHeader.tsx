import React from 'react';
import { RotateCcw, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

interface GameHeaderProps {
    moves: number;
    timeElapsed: number;
    onReset: () => void;
}

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const GameHeader: React.FC<GameHeaderProps> = ({ moves, timeElapsed, onReset }) => {
    return (
        <div className="flex justify-between items-center mb-8 border-b border-[#5D4037]/50 pb-4">
            <div className="flex items-center gap-4">
                <h2 className="text-3xl font-bold text-[#FFD700] font-['Cinzel'] drop-shadow-md hidden sm:block">Apaga las Luces</h2>
            </div>

            <div className="flex items-center gap-6">
                <div className="text-stone-400 flex flex-col items-end">
                    <span className="text-xs uppercase tracking-widest text-[#deb887]">Tiempo</span>
                    <span className="text-xl font-mono text-white font-bold">{formatTime(timeElapsed)}</span>
                </div>
                <div className="text-stone-400 flex flex-col items-end">
                    <span className="text-xs uppercase tracking-widest text-[#deb887]">Movimientos</span>
                    <span className="text-xl font-mono text-white font-bold">{moves}</span>
                </div>
                <button
                    onClick={onReset}
                    className="p-3 bg-[#8B4513] hover:bg-[#A0522D] text-white rounded-lg transition-all border border-[#deb887]/30 hover:border-[#deb887] shadow-lg active:scale-95"
                    title="Reiniciar Juego"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
