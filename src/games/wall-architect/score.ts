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


