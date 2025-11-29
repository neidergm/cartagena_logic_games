import React from 'react';
import { useLightsOut } from './hooks/useLightsOut';
import { GameHeader } from './components/GameHeader';
import { GameBoard } from './components/GameBoard';
import { WinMessage } from './components/WinMessage';

export const GamePage: React.FC = () => {
    const { grid, moves, isWon, handleCellClick, resetGame } = useLightsOut();

    return (
        <div className="max-w-4xl mx-auto flex flex-col items-center">
            <div className="bg-gray-800/50 rounded-2xl p-8 border border-gray-700 backdrop-blur-sm w-full max-w-2xl">
                <GameHeader moves={moves} onReset={resetGame} />

                {isWon ? (
                    <WinMessage moves={moves} onPlayAgain={resetGame} />
                ) : (
                    <GameBoard grid={grid} onCellClick={handleCellClick} />
                )}

                <div className="mt-8 text-center text-gray-500 text-sm">
                    <p>Click a cell to toggle it and its neighbors. Turn all lights off to win!</p>
                </div>
            </div>
        </div>
    );
};
