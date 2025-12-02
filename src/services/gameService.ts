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

export const getHighestUnlockedLevel = async (gameId: number): Promise<number> => {
    try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return 1;

        // We need to find the max level_number for this game that the user has completed.
        // Assuming game_scores links to game_levels via level_id.
        const { data, error } = await
            supabase
                .rpc('get_next_unplayed_level', {
                    p_game_id: gameId,
                    p_user_id: user.id
                })
                .limit(1)

        if (error) {
            return 1;
        }

        if (data && data.length > 0) {
            const maxLevel = data[0].level_number;
            return maxLevel;
        }

        return 1;
    } catch (err) {
        return 1;
    }
};
