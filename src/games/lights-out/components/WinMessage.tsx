import React from 'react';
import { Trophy } from 'lucide-react';

interface WinMessageProps {
    moves: number;
    onPlayAgain: () => void;
}

export const WinMessage: React.FC<WinMessageProps> = ({ moves, onPlayAgain }) => {
    return (
        <div className="aspect-square w-full max-w-[400px] mx-auto bg-gray-900/50 rounded-xl flex flex-col items-center justify-center border border-gray-800 animate-fade-in">
            <Trophy className="w-24 h-24 text-yellow-500 mb-4 animate-bounce" />
            <h3 className="text-3xl font-bold text-white mb-2">You Won!</h3>
            <p className="text-gray-400 mb-6">Solved in {moves} moves</p>
            <button
                onClick={onPlayAgain}
                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-full font-bold transition-all hover:scale-105"
            >
                Play Again
            </button>
        </div>
    );
};
