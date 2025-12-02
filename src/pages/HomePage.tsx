import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Play, BrainCircuit, Loader2, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface Game {
    id: string;
    name: string;
    description: string;
    slug: string;
    image_url?: string;
}

export const HomePage: React.FC = () => {
    const [games, setGames] = useState<Game[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                const { data, error } = await supabase
                    .from('games')
                    .select();

                if (error) throw error;
                setGames(data || []);
            } catch (err) {
                console.error('Error fetching games:', err);
                setError('Failed to load games. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] text-center space-y-12 px-4 py-7">
            <div className="space-y-6 max-w-3xl">
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-amber-500/10 rounded-full ring-1 ring-amber-500/50">
                        <BrainCircuit className="w-16 h-16 text-amber-500" />
                    </div>
                </div>
                <div>
                    <h1 className="text-5xl font-extrabold tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-amber-400 to-orange-600 font-['Cinzel']">
                        Cartagena
                    </h1>
                    <h3 className="text-2xl font-bold text-amber-500 mb-2 font-['Cinzel']">
                        Juegos de lógica
                    </h3>
                </div>
                <p className="text-xl text-stone-400 leading-relaxed font-['Lato']">
                    Resuelve juegos de lógica para ayudar a crecer y ser mejor a la fantástica ciudad
                </p>
            </div>

            <div className="w-full max-w-5xl">
                {loading ? (
                    <div className="flex justify-center py-12 flex-col items-center">
                        <Loader2 className="w-12 h-12 text-amber-500 animate-spin" />
                        <p>Loading</p>
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center gap-4 py-8 text-red-400 bg-red-900/10 rounded-lg border border-red-900/30">
                        <AlertCircle className="w-10 h-10" />
                        <p>{error}</p>
                    </div>
                ) : games.length > 0 ? (
                    <div className="w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-900/30 backdrop-blur-sm">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead>
                                    <tr className="border-b border-stone-800 bg-stone-900/80 text-xs uppercase tracking-wider text-amber-500 font-['Cinzel']">
                                        <th scope="col" className="px-6 py-5 font-bold">Juego</th>
                                        <th scope="col" className="px-6 py-5 font-bold hidden md:table-cell">Descripción</th>
                                        <th scope="col" className="px-6 py-5 font-bold text-right"></th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-stone-800">
                                    {games.map((game) => (
                                        <tr
                                            key={game.id}
                                            className="group hover:bg-stone-800/40 transition-colors duration-300"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-4">
                                                    <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-lg border border-stone-800 bg-stone-900 group-hover:border-amber-500/30 transition-colors">
                                                        {game.image_url ? (
                                                            <img
                                                                src={game.image_url}
                                                                alt={game.name}
                                                                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                                                            />
                                                        ) : (
                                                            <div className="flex h-full w-full items-center justify-center">
                                                                <BrainCircuit className="h-8 w-8 text-stone-700 group-hover:text-amber-500/50 transition-colors" />
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div>
                                                        <div className="font-['Cinzel'] text-lg font-bold text-stone-200 group-hover:text-amber-500 transition-colors">
                                                            {game.name}
                                                        </div>
                                                        <div className="md:hidden mt-1 text-sm text-stone-500 line-clamp-2">
                                                            {game.description}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 hidden md:table-cell">
                                                <p className="text-stone-400 text-sm leading-relaxed line-clamp-2">
                                                    {game.description}
                                                </p>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <Link
                                                    to={`/game/${game.slug}`}
                                                    className="inline-flex items-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-bold text-stone-900 hover:bg-amber-400 hover:shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all duration-300 transform group-hover:translate-x-1"
                                                >
                                                    Jugar <Play className="h-4 w-4 fill-current" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="text-stone-500 italic py-12">
                        No games found in the archives.
                    </div>
                )}
            </div>
        </div>
    );
};
