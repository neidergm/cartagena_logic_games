import { supabase } from '../../../lib/supabaseClient';
import { type LevelConfig } from '../types';
import { createLevelFromData } from '../data/levels';
import { type LevelData } from '../data/levels-data';

export const fetchLevelsByGameId = async (gameId: number): Promise<LevelConfig[]> => {
    try {

        const { data, error } = await supabase
            .from('game_levels')
            .select('*')
            .eq('game_id', gameId)
            .order('level_number', { ascending: true });

        if (error) {
            console.error('Error fetching levels:', error);
            return [];
        }

        if (!data) return [];

        // Map Supabase data to LevelConfig
        return data.map((level: any) => {
            // The 'config' column is jsonb and should match LevelData structure
            const levelData: LevelData = level.config;
            // Ensure ID matches the DB id or keep the one in config? 
            // The config in file has 'id'. The DB has 'id'.
            // Let's use the config from DB but maybe override ID?
            // createLevelFromData uses data.id.
            return createLevelFromData({
                ...levelData,
                id: level.id // Use DB ID (primary key)
            });
        });

    } catch (err) {
        console.error('Unexpected error fetching levels:', err);
        return [];
    }
};
