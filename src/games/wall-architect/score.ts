import { supabase } from '../../lib/supabaseClient';
import type { LevelStats } from './types';

export const calculateScore = (stats: LevelStats): number => {
    // Base score
    let score = 1000;

    // Penalties
    score -= stats.timeElapsed * 1; // -1 point per second
    score -= stats.movesCount * 2;  // -2 points per move
    score -= stats.clicksToFindCrack * 5; // -5 points per click

    return Math.max(0, score); // Minimum score 0
};

export const saveGameScore = async (levelId: number, stats: LevelStats) => {
    try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            console.warn('User not authenticated, score not saved.');
            return;
        }

        const score = calculateScore(stats);

        const { error } = await supabase
            .from('game_scores')
            .insert({
                user_id: user.id,
                level_id: levelId,
                time_seconds: stats.timeElapsed,
                score: score,
                // played_at is default now()
            });

        if (error) {
            console.error('Error saving score:', error);
        } else {
            console.log('Score saved successfully:', score);
        }
    } catch (err) {
        console.error('Unexpected error saving score:', err);
    }
};

export const getHighestUnlockedLevel = async (): Promise<number> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 1;

        const { data, error } = await supabase
            .from('game_scores')
            .select('level_id')
            .eq('user_id', user.id)
            .order('level_id', { ascending: false })
            .limit(1);

        if (error) {
            console.error('Error fetching progress:', error);
            return 1;
        }

        if (data && data.length > 0) {
            // If they finished level X, they should be on level X + 1
            return data[0].level_id + 1;
        }

        return 1;
    } catch (err) {
        console.error('Unexpected error fetching progress:', err);
        return 1;
    }
};
