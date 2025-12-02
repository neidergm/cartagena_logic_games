import React, { Suspense, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { ProtectedRoute } from '../components/ProtectedRoute';
import { fetchGameBySlug, getHighestUnlockedLevel, type Game } from '../services/gameService';
import { loadGameComponent } from './gameLoader';

export const GameBox: React.FC = () => {
    const { slug } = useParams();
    const [game, setGame] = React.useState<Game | null>(null);
    const [initialLevel, setInitialLevel] = React.useState(1);
    const [loadingGame, setLoadingGame] = React.useState(true);

    React.useEffect(() => {
        const loadGameData = async () => {
            if (!slug) return;
            // Handle '-play' suffix to get the base game slug
            const gameSlug = slug.replace('-play', '');

            const gameData = await fetchGameBySlug(gameSlug);

            if (gameData) {
                setGame(gameData);
                const level = await getHighestUnlockedLevel(gameData.id);
                setInitialLevel(level?.level_number || 1);
            }
            setLoadingGame(false);
        };
        loadGameData();
    }, [slug]);

    // Lazy load games
    const GameComponent = useMemo(() => {
        if (!slug) return null;
        return loadGameComponent(slug);
    }, [slug]);

    if (loadingGame) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-white font-['Cinzel']">
                <div className="text-xl animate-pulse">Cargando información del juego...</div>
            </div>
        );
    }

    if (!GameComponent || (!game && slug !== 'lights-out' && slug !== 'lights-out-play')) { // Fallback for lights-out if not in DB yet? Or assume all in DB.
        // If game not found in DB but component exists, we might have an issue.
        // For now, let's assume if GameComponent exists, we try to render it, but if game is null and we need it...
        // WallArchitect needs gameId.
        if (!game && (slug?.includes('wall-architect'))) {
            return (
                <div className="flex items-center justify-center min-h-[50vh] text-white font-['Cinzel']">
                    <div className="text-center">
                        <h2 className="text-2xl font-bold mb-2">Juego no encontrado</h2>
                        <p className="text-gray-400">No se pudo cargar la información del juego "{slug}".</p>
                    </div>
                </div>
            );
        }
    }

    if (!GameComponent) {
        return (
            <div className="flex items-center justify-center min-h-[50vh] text-white font-['Cinzel']">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Juego no encontrado</h2>
                    <p className="text-gray-400">El juego "{slug}" no existe o no está disponible.</p>
                </div>
            </div>
        );
    }

    // Wrap gameplay routes with ProtectedRoute
    const isGameplayRoute = slug?.endsWith('-play');

    return (
        <Suspense
            fallback={
                <div className="flex items-center justify-center min-h-[50vh] text-white font-['Cinzel']">
                    <div className="text-xl animate-pulse">Cargando experiencia...</div>
                </div>
            }
        >
            {isGameplayRoute ? (
                <ProtectedRoute>
                    {/* @ts-ignore - Dynamic components might not have matching props types */}
                    <GameComponent gameId={game?.id} initialLevel={initialLevel} />
                </ProtectedRoute>
            ) : (
                /* @ts-ignore */
                <GameComponent gameId={game?.id} initialLevel={initialLevel} />
            )}
        </Suspense>
    );
};
