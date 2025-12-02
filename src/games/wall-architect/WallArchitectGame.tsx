import React, { useState, useEffect } from 'react';
import { useWallArchitectStore } from './store';
import { IntroView } from './components/IntroView';
import { PlayingView } from './components/PlayingView';
import { VictoryModal } from './components/VictoryModal';
import { saveGameScore } from '../../services/scoreService';
import { calculateScore } from './utils';
import { getHighestUnlockedLevel } from '../../services/gameService';
import { createLevelFromData } from './levelsEngine';
import { type LevelData } from './types';

type GameView = 'intro' | 'playing';

interface WallArchitectGameProps {
    gameId: number;
    initialLevel: number;
}

const WallArchitectGame: React.FC<WallArchitectGameProps> = ({ gameId }) => {
    // Only subscribe to what we need for the high-level logic to avoid re-renders on every tick
    const levelCompleted = useWallArchitectStore((state) => state.levelCompleted);
    const setLevel = useWallArchitectStore((state) => state.setLevel);

    const tickTime = useWallArchitectStore((state) => state.tickTime);

    const [view, setView] = useState<GameView>('intro');
    const [isLoading, setIsLoading] = useState(true);
    const [gameCompleted, setGameCompleted] = useState(false);

    const loadLevel = async () => {
        setIsLoading(true);
        if (gameId) {
            const levelData = await getHighestUnlockedLevel(gameId);

            if (!levelData) {
                // No more levels or error
                setGameCompleted(true);
                setIsLoading(false);
                return;
            }

            // Transform DB data to Game Config
            const gameLevel = createLevelFromData(levelData.config as LevelData);
            // Ensure ID is set from the DB record, not just config
            gameLevel.id = levelData.id;

            setLevel(gameLevel, levelData);
            setGameCompleted(false);
        }
        setIsLoading(false);
    };

    // Initial Load
    useEffect(() => {
        loadLevel();
    }, [gameId]);

    const gameStarted = useWallArchitectStore((state) => state.gameStarted);

    // Timer Effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        // Only run timer if game has started and level is not completed
        if (gameStarted && !levelCompleted) {
            interval = setInterval(() => {
                tickTime();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [gameStarted, levelCompleted, tickTime]);

    // Save Score Effect
    useEffect(() => {
        if (levelCompleted) {
            // Get fresh stats from store without subscribing to them in the component body
            const currentStats = useWallArchitectStore.getState().stats;
            const currentLevel = useWallArchitectStore.getState().level;

            if (currentLevel) {
                saveGameScore(
                    currentLevel.id,
                    {
                        timeElapsed: currentStats.timeElapsed,
                        moves: currentStats.movesCount,
                        score: calculateScore(currentStats),
                    },
                    gameId
                );
            }
        }
    }, [levelCompleted]);

    const handleCrackFound = () => {
        setView('playing');
    };

    const handleNextLevel = async () => {
        await loadLevel();
        setView('intro');
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
                    <p className="text-stone-300 mb-6">Has restaurado todas las murallas. ¡Excelente trabajo!</p>
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
        <>
            {view === 'intro' ? (
                <IntroView onCrackFound={handleCrackFound} />
            ) : (
                <PlayingView />
            )}

            {levelCompleted && (
                <VictoryModal onNextLevel={handleNextLevel} />
            )}
        </>
    );
};
export default WallArchitectGame;
