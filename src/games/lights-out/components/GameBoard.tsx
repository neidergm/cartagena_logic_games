import React from 'react';
import { type TGridState } from '../types/game';

interface GameBoardProps {
    grid: TGridState;
    onCellClick: (row: number, col: number) => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ grid, onCellClick }) => {
    return (
        <div className="grid grid-cols-5 gap-2 w-full max-w-[400px] mx-auto aspect-square">
            {grid.map((row, rIndex) => (
                row.map((isOn, cIndex) => (
                    <button
                        key={`${rIndex}-${cIndex}`}
                        onClick={() => onCellClick(rIndex, cIndex)}
                        className={`
              w-full h-full rounded-lg transition-all duration-300 transform hover:scale-105
              ${isOn
                                ? 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] border-indigo-400'
                                : 'bg-gray-700 border-gray-600 hover:bg-gray-600'
                            }
              border
            `}
                        aria-label={`Cell ${rIndex},${cIndex} is ${isOn ? 'on' : 'off'}`}
                    />
                ))
            ))}
        </div>
    );
};
