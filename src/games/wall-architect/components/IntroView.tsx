import React, { useState } from 'react';
import { useWallArchitectStore } from '../store';

interface IntroViewProps {
    onCrackFound: () => void;
}

export const IntroView: React.FC<IntroViewProps> = ({ onCrackFound }) => {
    const { levelInfo, stats, incrementSearchClicks, startGame, gameStarted } = useWallArchitectStore();

    // Search Phase State
    const [crackFound, setCrackFound] = useState(false);
    const [clickFeedback, setClickFeedback] = useState<{ x: number, y: number, text: string, color: string } | null>(null);

    // Define valid wall areas (rectangles in %: x, y, width, height)
    const wallRects = [
        { x: 0, y: 55, w: 35, h: 30 },   // Left Wall mass
        { x: 40, y: 65, w: 20, h: 25 },  // Center/Tower base
        { x: 65, y: 55, w: 35, h: 30 }   // Right Wall mass
    ];

    const getRandomCrackPosition = () => {
        const rect = wallRects[Math.floor(Math.random() * wallRects.length)];
        return {
            x: rect.x + Math.random() * rect.w,
            y: rect.y + Math.random() * rect.h
        };
    };

    const [crackPos] = useState(getRandomCrackPosition);

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!gameStarted) {
            startGame();
        }

        if (crackFound) return;

        incrementSearchClicks();

        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

        // Distance check (Euclidean in percentage space)
        const dist = Math.sqrt(Math.pow(x - crackPos.x, 2) + Math.pow(y - crackPos.y, 2));

        let text = "";
        let color = "";

        if (dist < 5) { // Tighter radius for "Found"
            setCrackFound(true);
            setClickFeedback({ x, y, text: "¡GRIETA ENCONTRADA!", color: "bg-green-600 text-white ring-4 ring-green-400" });
            return;
        } else if (dist < 10) {
            text = "¡QUEMA! 🔥";
            color = "bg-red-600 text-white animate-bounce";
        } else if (dist < 20) {
            text = "¡Caliente! 🌡️";
            color = "bg-orange-500 text-white";
        } else if (dist < 35) {
            text = "Tibio... ☀️";
            color = "bg-yellow-400 text-black";
        } else if (dist < 55) {
            text = "Frío ❄️";
            color = "bg-cyan-600 text-white";
        } else {
            text = "¡Helado! 🧊";
            color = "bg-blue-900 text-white";
        }

        setClickFeedback({ x, y, text, color });

        // Clear feedback after a delay
        setTimeout(() => setClickFeedback(null), 1200);
    };

    // Format time helper
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div
            className="min-h-screen relative overflow-hidden font-['Cinzel'] select-none cursor-crosshair"
            onClick={handleMapClick}
        >
            {/* Background Image */}
            <div
                className="absolute inset-0 z-0 transition-transform duration-[2000ms] ease-out"
                style={{
                    backgroundImage: 'url("/assets/cartagena_wall.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    transform: crackFound ? `scale(1.5) origin-${crackPos.x}% ${crackPos.y}%` : 'scale(1)',
                }}
            />

            <div className="absolute inset-0 bg-black/10 hover:bg-transparent transition-colors duration-500" />

            {/* Initial UI Overlay - Hides on start */}
            <div className={`absolute inset-0 z-10 flex flex-col items-center pt-20 text-center pointer-events-none transition-opacity duration-500 ${gameStarted ? 'opacity-0' : 'opacity-100'}`}>
                <h1 className="text-5xl font-bold text-[#FFD700] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2 uppercase tracking-widest bg-black/40 px-6 py-2 rounded-lg backdrop-blur-sm">
                    El Arquitecto
                </h1>
                <div className="mt-8 bg-black/60 p-6 rounded-xl backdrop-blur-md border border-[#FFD700]/30 max-w-md mx-4 shadow-2xl">
                    <p className="text-white text-xl mb-2 font-bold">Misión de Inspección</p>
                    <p className="text-stone-300">
                        Nivel {levelInfo?.level_number}
                        <br /><br />
                        <span className="text-[#FFD700]">Haz click en la muralla</span> para encontrar la grieta oculta.
                        <br />
                        <span className="text-sm text-stone-400 mt-2 block">¡Usa las pistas de temperatura!</span>
                    </p>
                </div>
            </div>

            {/* Persistent HUD - Shows on start */}
            <div className={`absolute top-0 left-0 right-0 z-10 flex justify-between items-center px-6 py-4 bg-gradient-to-b from-black/80 to-transparent transition-opacity duration-500 ${gameStarted && !crackFound ? 'opacity-100' : 'opacity-0'}`}>
                <div className="text-[#FFD700] font-bold text-lg drop-shadow-md">
                    EL ARQUITECTO - Nivel {levelInfo?.level_number}
                </div>
                <div className="flex gap-6 text-white font-mono text-sm drop-shadow-md">
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-stone-400 uppercase">Tiempo</span>
                        <span className="font-bold">{formatTime(stats.timeElapsed)}</span>
                    </div>
                    <div className="flex flex-col items-center">
                        <span className="text-xs text-stone-400 uppercase">Clicks</span>
                        <span className="font-bold">{stats.clicksToFindCrack}</span>
                    </div>
                </div>
            </div>

            {/* Click Feedback Marker */}
            {clickFeedback && (
                <div
                    className="absolute z-20 pointer-events-none flex flex-col items-center"
                    style={{ left: `${clickFeedback.x}%`, top: `${clickFeedback.y}%`, transform: 'translate(-50%, -50%)' }}
                >
                    <div className={`w-4 h-4 rounded-full border-2 border-white shadow-sm mb-2 ${clickFeedback.color.split(' ')[0]}`} />
                    <span className={`px-4 py-2 rounded-full text-lg font-bold shadow-[0_4px_10px_rgba(0,0,0,0.5)] whitespace-nowrap border-2 border-white/20 backdrop-blur-sm ${clickFeedback.color}`}>
                        {clickFeedback.text}
                    </span>
                </div>
            )}

            {/* Found Button */}
            {crackFound && (
                <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 backdrop-blur-[2px] animate-in fade-in duration-1000">
                    <div className="text-center">
                        <div className="w-32 h-32 mx-auto mb-6 rounded-full border-4 border-red-500 bg-black/50 flex items-center justify-center animate-pulse shadow-[0_0_30px_rgba(239,68,68,0.6)]">
                            <span className="text-6xl">⚠️</span>
                        </div>
                        <h2 className="text-4xl text-[#FFD700] font-bold mb-8 drop-shadow-lg uppercase">¡Daño Localizado!</h2>
                        <button
                            onClick={(e) => {
                                e.stopPropagation();
                                onCrackFound();
                            }}
                            className="px-10 py-4 bg-gradient-to-r from-[#8B4513] to-[#A0522D] hover:scale-105 text-white font-bold rounded-lg shadow-[0_0_20px_rgba(0,0,0,0.5)] border-2 border-[#FFD700] transition-all text-xl tracking-widest pointer-events-auto"
                        >
                            Comenzar Reparación
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
