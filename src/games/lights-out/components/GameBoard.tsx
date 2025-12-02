import React from 'react';
import { type TGridState } from '../types/game';

interface GameBoardProps {
    grid: TGridState;
    onCellClick: (row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid, onCellClick }) => {
    return (
        <div className="grid grid-cols-5 gap-2 w-full max-w-[400px] mx-auto aspect-square p-3 sm:p-4 bg-black/40 rounded-xl border border-[#5D4037]">
            {grid.map((row, rIndex) => (
                row.map((isOn, cIndex) => (
                    <button
                        key={`${rIndex}-${cIndex}`}
                        onClick={() => onCellClick(rIndex, cIndex)}
                        className={`
              w-full h-full rounded-lg transition-all duration-300 transform hover:scale-105
              ${isOn
                                ? 'bg-[#FFD700] shadow-[0_0_20px_rgba(255,215,0,0.6)] border-[#FFD700] scale-100'
                                : 'bg-[#2c241b] border-[#5D4037] hover:bg-[#3e3326] scale-95 opacity-80'
                            }
              border-2 relative overflow-hidden
            `}
                        aria-label={`Cell ${rIndex},${cIndex} is ${isOn ? 'on' : 'off'}`}
                    >
                        {/* Inner glow effect for lit cells */}
                        {isOn && <div className="absolute inset-0 bg-white/30 blur-sm" />}
                    </button>
                ))
            ))}
        </div>
    );
};
