
import React, { useState } from 'react';
import { useLightsOut } from './hooks/useLightsOut';
import { GameHeader } from './components/GameHeader';
import { GameBoard } from './components/GameBoard';
import { WinMessage } from './components/WinMessage';

import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import { getHighestUnlockedLevel, type LeveInfo } from '../../services/gameService';
import { saveGameScore } from '../../services/scoreService';
import { calculateScore } from './utils';

interface LightsOutGameProps {
    gameId: number;
    initialLevel: number;
}

const GamePage: React.FC<LightsOutGameProps> = ({ gameId }) => {
    const [levelInfo, setLevelInfo] = useState<LeveInfo | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [gameCompleted, setGameCompleted] = useState(false);

    // Load level
    const loadLevel = async () => {
        setIsLoading(true);
        if (gameId) {
            const data = await getHighestUnlockedLevel(gameId);
            if (!data) {
                setGameCompleted(true);
                setIsLoading(false);
                return;
            }
            setLevelInfo(data);
            setGameCompleted(false);
        }
        setIsLoading(false);
    };

    React.useEffect(() => {
        loadLevel();
    }, [gameId]);

    const currentLevelConfig = (levelInfo?.config as any) || { gridSize: 5, complexity: 10 };

    const { grid, moves, timeElapsed, isWon, handleCellClick, resetGame } = useLightsOut(
        currentLevelConfig.gridSize,
        currentLevelConfig.complexity
    );
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const navigate = useNavigate();

    // Handle Level Completion
    React.useEffect(() => {
        if (isWon) {
            // Save score
            const levelId = levelInfo?.id;

            const stats = {
                timeElapsed,
                movesCount: moves,
                score: calculateScore({
                    timeElapsed,
                    movesCount: moves,
                    clicksToFindCrack: 0,
                }),
            };

            if (levelId) {
                saveGameScore(levelId, {
                    moves,
                    timeElapsed,
                    score: stats.score,
                });
            }
        }
    }, [isWon, levelInfo, moves, timeElapsed]);

    const handleNextLevel = async () => {
        await loadLevel();
    };

    // Force reset when level changes (even if config is same)
    React.useEffect(() => {
        resetGame();
    }, [levelInfo, resetGame]);

    const handleExit = () => {
        navigate('/');
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-[#FFD700] font-['Cinzel']">
                <div className="text-2xl animate-pulse">Cargando Nivel...</div>
            </div>
        );
    }

    if (gameCompleted) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-[#FFD700] font-['Cinzel']">
                <div className="text-center p-8 border border-[#FFD700] rounded bg-[#2c241b]">
                    <h2 className="text-4xl font-bold mb-4">¡Juego Completado!</h2>
                    <p className="text-stone-300 mb-6">Has completado todos los niveles. ¡Excelente trabajo!</p>
                    <button
                        onClick={() => window.location.href = '/'}
                        className="px-6 py-3 bg-[#8B4513] hover:bg-[#A0522D] text-white rounded border border-[#deb887]/30 transition-all"
                    >
                        Volver al Inicio
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen relative flex flex-col items-center justify-center p-2 sm:p-4 font-['Cinzel']">
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
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-in fade-in duration-200">
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

            <div className="relative z-10 bg-black/60 rounded-2xl p-4 sm:p-8 border border-[#FFD700]/30 backdrop-blur-md w-full max-w-2xl shadow-2xl">
                <GameHeader moves={moves} timeElapsed={timeElapsed} onReset={resetGame} level={levelInfo?.level_number || 1} />

                {isWon ? (
                    <WinMessage
                        moves={moves}
                        timeElapsed={timeElapsed}
                        onPlayAgain={() => {
                            handleNextLevel();
                        }}
                        isLastLevel={false} // Always show "Next Level" until game completed screen
                    />
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

export default GamePage;
