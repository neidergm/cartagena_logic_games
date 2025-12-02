import React, { useState, useEffect } from 'react';
import { useWallArchitectStore } from './store';
import { saveGameScore } from './score';
import { IntroView } from './components/IntroView';
import { PlayingView } from './components/PlayingView';
import { VictoryModal } from './components/VictoryModal';

type GameView = 'intro' | 'playing';

interface WallArchitectGameProps {
    gameId: number;
    initialLevel: number;
}

export const WallArchitectGame: React.FC<WallArchitectGameProps> = ({ gameId, initialLevel }) => {
    // Only subscribe to what we need for the high-level logic to avoid re-renders on every tick
    // We use a selector or just access the store directly in effects where possible, 
    // but for 'levelCompleted' we need to react to it.
    const levelCompleted = useWallArchitectStore((state) => state.levelCompleted);
    const currentLevelIndex = useWallArchitectStore((state) => state.currentLevelIndex);
    const setLevel = useWallArchitectStore((state) => state.setLevel);
    const nextLevel = useWallArchitectStore((state) => state.nextLevel);
    const tickTime = useWallArchitectStore((state) => state.tickTime);
    const loadLevels = useWallArchitectStore((state) => state.loadLevels);
    const isLoadingLevels = useWallArchitectStore((state) => state.isLoadingLevels);

    // We need to access stats for saving score, but we don't want to re-render on every tick.
    // We can use useWallArchitectStore.getState() inside the effect, 
    // BUT we need the effect to trigger when levelCompleted becomes true.

    const [view, setView] = useState<GameView>('intro');
    const [isLoading, setIsLoading] = useState(true);

    // Load Progress Effect
    useEffect(() => {
        const loadProgress = async () => {
            await loadLevels(gameId);
            // Use initialLevel passed from prop, but we might want to verify or just set it.
            // initialLevel is 1-based.
            setLevel(initialLevel - 1);
            setIsLoading(false);
        };
        loadProgress();
    }, [setLevel, loadLevels, gameId, initialLevel]);

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
            // We need to save using the level ID (PK) from the levels array
            const levels = useWallArchitectStore.getState().levels;
            const currentLevelConfig = levels[currentLevelIndex];

            if (currentLevelConfig) {
                saveGameScore(currentLevelConfig.id, currentStats);
            }
        }
    }, [levelCompleted, currentLevelIndex]);

    const handleCrackFound = () => {
        setView('playing');
    };

    const handleBackToMap = () => {
        setView('intro');
    };

    const handleNextLevel = () => {
        nextLevel();
        setView('intro');
    };

    if (isLoading || isLoadingLevels) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-[#FFD700] font-['Cinzel']">
                <div className="text-2xl animate-pulse">Cargando Progreso...</div>
            </div>
        );
    }

    return (
        <>
            {view === 'intro' ? (
                <IntroView onCrackFound={handleCrackFound} />
            ) : (
                <PlayingView onBackToMap={handleBackToMap} />
            )}

            {levelCompleted && (
                <VictoryModal onNextLevel={handleNextLevel} />
            )}
        </>
    );
};
