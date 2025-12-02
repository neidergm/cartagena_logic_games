
import React, { useState } from 'react';
import { useLightsOut } from './hooks/useLightsOut';
import { GameHeader } from './components/GameHeader';
import { GameBoard } from './components/GameBoard';
import { WinMessage } from './components/WinMessage';

import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';

import { fetchLevels } from '../../services/gameService';
import { saveGameScore } from '../../services/scoreService';
import { calculateScore } from './utils';

interface LightsOutGameProps {
    gameId: number;
    initialLevel: number;
}

const GamePage: React.FC<LightsOutGameProps> = ({ gameId, initialLevel }) => {
    const [levels, setLevels] = useState<any[]>([]);
    const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    // Load levels
    React.useEffect(() => {
        const load = async () => {
            if (gameId) {
                const fetchedLevels = await fetchLevels(gameId);
                setLevels(fetchedLevels);
                // initialLevel is 1-based
                const startIndex = Math.max(0, Math.min(initialLevel - 1, fetchedLevels.length - 1));
                setCurrentLevelIndex(startIndex);
            }
            setIsLoading(false);
        };
        load();
    }, [gameId, initialLevel]);

    const currentLevelConfig = levels[currentLevelIndex]?.config || { gridSize: 5, complexity: 10 };

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
            const levelId = levels[currentLevelIndex]?.id;

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
    }, [isWon, currentLevelIndex, levels, moves, timeElapsed]);

    const handleNextLevel = () => {
        if (currentLevelIndex < levels.length - 1) {
            setCurrentLevelIndex(prev => prev + 1);
            // The hook will auto-reset when config changes (gridSize/complexity), 
            // BUT if config is same, it might not reset.
            // We should force reset or ensure config change triggers it.
            // useLightsOut has useEffect[resetGame] and resetGame depends on [gridSize, complexity].
            // If next level has same config, it won't trigger.
            // We need to manually reset if config is same.
            // Actually, let's just call resetGame() in a useEffect when level changes?
            // Or better, expose a way to force reset.
            // Let's rely on the key prop or explicit reset.
            // Simplest: Add a key to the hook or component?
            // Or just call resetGame() here? No, we can't call hook method from here easily without ref.
            // Let's use a key on the GameBoard or wrapper to force re-mount of hook?
            // Or better: add currentLevelIndex to useLightsOut dependency? No, hook shouldn't know about levels.
            // Let's add a useEffect here to reset when level index changes.
        } else {
            // Game Over / All Levels Done
            navigate('/');
        }
    };

    // Force reset when level changes (even if config is same)
    React.useEffect(() => {
        resetGame();
    }, [currentLevelIndex, resetGame]);

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
                    <WinMessage
                        moves={moves}
                        timeElapsed={timeElapsed}
                        onPlayAgain={() => {
                            if (currentLevelIndex < levels.length - 1) {
                                handleNextLevel();
                            } else {
                                resetGame();
                            }
                        }}
                        isLastLevel={currentLevelIndex >= levels.length - 1}
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
