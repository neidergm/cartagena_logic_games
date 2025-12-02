
import React, { useState } from 'react';
import { useLightsOut } from './hooks/useLightsOut';
import { GameHeader } from './components/GameHeader';
import { GameBoard } from './components/GameBoard';
import { WinMessage } from './components/WinMessage';

import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

export const GamePage: React.FC = () => {
    const { grid, moves, timeElapsed, isWon, handleCellClick, resetGame } = useLightsOut();
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const navigate = useNavigate();

    const handleExit = () => {
        navigate('/');
    };

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-4 font-['Cinzel']">
            {/* Exit Button */}
            <button
                onClick={() => setShowExitConfirm(true)}
                className="absolute top-6 right-6 z-50 p-3 bg-black/50 hover:bg-[#8B4513] text-stone-400 hover:text-white rounded-full border border-[#deb887]/30 transition-all backdrop-blur-sm group"
                title="Salir al Inicio"
            >
                <LogOut className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </button>

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#2c241b] p-8 rounded-lg border border-[#5D4037] shadow-2xl max-w-sm w-full text-center relative">
                        <h3 className="text-xl font-bold text-[#FFD700] font-['Cinzel'] mb-4">¿Abandonar Partida?</h3>
                        <p className="text-stone-300 mb-8 font-sans">El progreso actual se perderá.</p>
                        <div className="flex gap-4 justify-center font-sans">
                            <button
                                onClick={() => setShowExitConfirm(false)}
                                className="px-4 py-2 text-stone-400 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleExit}
                                className="px-6 py-2 bg-[#8B4513] hover:bg-[#A0522D] text-white rounded border border-[#deb887]/30 transition-all shadow-lg"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Background Image */}
            <div
                className="absolute inset-0 z-0"
                style={{
                    backgroundImage: 'url("/assets/lights-out.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            />
            <div className="absolute inset-0 bg-black/70 z-0" />

            <div className="relative z-10 bg-black/60 rounded-2xl p-8 border border-[#FFD700]/30 backdrop-blur-md w-full max-w-2xl shadow-2xl">
                <GameHeader moves={moves} timeElapsed={timeElapsed} onReset={resetGame} />

                {isWon ? (
                    <WinMessage moves={moves} timeElapsed={timeElapsed} onPlayAgain={resetGame} />
                ) : (
                    <GameBoard grid={grid} onCellClick={handleCellClick} />
                )}

                <div className="mt-8 text-center text-stone-400 text-sm font-sans">
                    <p>Click en una lámpara para alternar su luz y las vecinas. ¡Apaga todas para ganar!</p>
                </div>
            </div>
        </div>
    );
};

