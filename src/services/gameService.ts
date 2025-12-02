import { supabase } from '../lib/supabaseClient';

export interface Game {
    id: number;
    slug: string;
    name: string;
    description: string | null;
    is_active: boolean;
    daily_limit: number;
    base_points: number;
    image_url: string | null;
}

export interface LeveInfo {
    level_number: number;
    name: string;
    difficulty: string;
    description: string;
    config: unknown,
    id: number,
    game_id: number,
    created_at: string,
}

export const fetchGameBySlug = async (slug: string): Promise<Game | null> => {
    try {
        const { data, error } = await supabase
            .from('games')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error) {
            console.error('Error fetching game:', error);
            return null;
        }

        return data;
    } catch (err) {
        return null;
    }
};

export const getHighestUnlockedLevel = async (gameId: number): Promise<LeveInfo | null> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        // We need to find the max level_number for this game that the user has completed.
        // Assuming game_scores links to game_levels via level_id.
        const { data, error } = await
            supabase
                .rpc('get_next_unplayed_level', {
                    p_game_id: gameId,
                    p_user_id: user.id
                })
                .limit(1)

        if (error) return null;

        if (data && data.length > 0) return data[0];

        return null;
    } catch (err) {
        return null;
    }
};

export const fetchLevels = async (gameId: number): Promise<any[]> => {
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

        return data || [];
    } catch (err) {
        console.error('Unexpected error fetching levels:', err);
        return [];
    }
};
