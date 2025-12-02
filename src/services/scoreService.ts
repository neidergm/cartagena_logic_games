import { supabase } from "../lib/supabaseClient";

type LevelStats = {
    timeElapsed: number;
    moves: number;
    score: number;
}

export const saveGameScore = async (levelId: number, stats: LevelStats, gameId?: number) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.warn('User not authenticated, score not saved.');
            return;
        }

        const payload: any = {
            user_id: user.id,
            level_id: levelId,
            time_seconds: stats.timeElapsed,
            score: stats.score,
            movements: stats.moves,
            // played_at is default now()
        };

        if (gameId) {
            payload.game_id = gameId;
        }

        const { error } = await supabase
            .from('game_scores')
            .insert(payload);

        if (error) {
            throw error;
        }
    } catch (err) {
        console.error('Unexpected error saving score:', err);
    }
};