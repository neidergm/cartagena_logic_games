import type { LevelStats } from './types/game';

export const calculateScore = (stats: LevelStats): number => {
    // Base score
    let score = 1000;

    // Penalties
    score -= stats.timeElapsed * 1; // -1 point per second
    score -= stats.movesCount * 2;  // -2 points per move
    score -= stats.clicksToFindCrack * 5; // -5 points per click

    return Math.max(0, score); // Minimum score 0
};