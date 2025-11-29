import React from 'react';
import { RotateCcw } from 'lucide-react';

interface GameHeaderProps {
    moves: number;
    onReset: () => void;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ moves, onReset }) => {
    return (
        <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Lights Out</h2>
            <div className="flex items-center gap-4">
                <div className="text-gray-400">
                    <span className="text-sm uppercase tracking-wider text-gray-500 mr-2">Moves</span>
                    <span className="text-2xl font-mono text-white">{moves}</span>
                </div>
                <button
                    onClick={onReset}
                    className="p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    title="Reset Game"
                >
                    <RotateCcw className="w-5 h-5" />
                </button>
            </div>
        </div>
    );
};
