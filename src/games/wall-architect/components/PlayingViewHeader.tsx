import { useWallArchitectStore } from "../store";

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const PlayingViewHeader = () => {
    const stats = useWallArchitectStore((state) => state.stats);
    const levelInfo = useWallArchitectStore((state) => state.levelInfo);

    return (
        <header className="mb-6 flex justify-between items-center relative z-10 border-b border-stone-700 pb-4 pr-16 flex-wrap gap-6">
            <div>
                <h1 className="text-2xl font-bold text-[#FFD700] font-['Cinzel'] tracking-widest">
                    Zona de Reparación
                </h1>
                <p className="text-stone-400 text-sm">Sector: Torre del Reloj - Nivel {levelInfo?.level_number}</p>
            </div>
            <div className="flex gap-6 text-stone-300 font-mono text-sm">
                <div className="flex flex-col items-center">
                    <span className="text-xs text-stone-500 uppercase">Tiempo</span>
                    <span className="text-[#FFD700]">{formatTime(stats.timeElapsed)}</span>
                </div>
                <div className="flex flex-col items-center">
                    <span className="text-xs text-stone-500 uppercase">Movimientos</span>
                    <span className="text-[#FFD700]">{stats.movesCount}</span>
                </div>
            </div>

        </header>
    )
}

export default PlayingViewHeader