import React, { useState, useEffect } from 'react';
import { useWallArchitectStore } from './store';
import { Board } from './components/Board';
import { Piece } from './components/Piece';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, type DragOverEvent, MouseSensor, TouchSensor, useSensor, useSensors } from '@dnd-kit/core';
import type { Piece as PieceType, Position } from './types';
import { saveGameScore, calculateScore, getHighestUnlockedLevel } from './score';

type GameView = 'intro' | 'playing';

export const WallArchitectGame: React.FC = () => {
    const {
        inventoryPieces,
        rotatePiece,
        placePiece,
        levelCompleted,
        resetLevel,
        nextLevel,
        setLevel,
        currentLevelIndex,
        stats,
        incrementSearchClicks,
        tickTime
    } = useWallArchitectStore();

    const [view, setView] = useState<GameView>('intro');
    const [activePiece, setActivePiece] = useState<PieceType | null>(null);
    const [hoveredCell, setHoveredCell] = useState<Position | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Load Progress Effect
    useEffect(() => {
        const loadProgress = async () => {
            const level = await getHighestUnlockedLevel();
            // level is 1-based, setLevel expects 0-based index
            setLevel(level - 1);
            setIsLoading(false);
        };
        loadProgress();
    }, [setLevel]);

    // Search Phase State
    const [crackFound, setCrackFound] = useState(false);
    const [clickFeedback, setClickFeedback] = useState<{ x: number, y: number, text: string, color: string } | null>(null);

    // Timer Effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (!levelCompleted) {
            interval = setInterval(() => {
                tickTime();
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [levelCompleted, tickTime]);

    // Save Score Effect
    useEffect(() => {
        if (levelCompleted) {
            // Level IDs are 1-based, currentLevelIndex is 0-based
            saveGameScore(currentLevelIndex + 1, stats);
        }
    }, [levelCompleted, currentLevelIndex, stats]);

    // Define valid wall areas (rectangles in %: x, y, width, height)
    // Based on visual estimation of cartagena_wall.jpg
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

    const [crackPos, setCrackPos] = useState(getRandomCrackPosition);

    // Reset crack position when returning to intro or starting new level
    const startSearchPhase = () => {
        setCrackPos(getRandomCrackPosition());
        setCrackFound(false);
        setClickFeedback(null);
        setView('intro');
    };

    const sensors = useSensors(
        useSensor(MouseSensor, {
            activationConstraint: {
                distance: 10,
            },
        }),
        useSensor(TouchSensor, {
            activationConstraint: {
                delay: 250,
                tolerance: 5,
            },
        })
    );

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const piece = active.data.current?.piece as PieceType;
        if (piece) {
            setActivePiece(piece);
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;
        if (over && over.id.toString().startsWith('cell-')) {
            const { row, col } = over.data.current as { row: number; col: number };
            setHoveredCell({ row, col });
        } else {
            setHoveredCell(null);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;
        setActivePiece(null);
        setHoveredCell(null);

        if (over && over.id.toString().startsWith('cell-')) {
            const { row, col } = over.data.current as { row: number; col: number };
            placePiece(active.id.toString(), { row, col });
        }
    };

    const handleNextLevel = () => {
        nextLevel();
        startSearchPhase(); // Go back to search for the new crack
    };

    const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
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

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-[#FFD700] font-['Cinzel']">
                <div className="text-2xl animate-pulse">Cargando Progreso...</div>
            </div>
        );
    }

    if (view === 'intro') {
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

                {/* UI Overlay */}
                <div className={`relative z-10 flex flex-col items-center pt-20 h-screen text-center pointer-events-none transition-opacity duration-500 ${crackFound ? 'opacity-0' : 'opacity-100'}`}>
                    <h1 className="text-5xl font-bold text-[#FFD700] drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)] mb-2 uppercase tracking-widest bg-black/40 px-6 py-2 rounded-lg backdrop-blur-sm">
                        El Arquitecto
                    </h1>
                    <div className="mt-8 bg-black/60 p-6 rounded-xl backdrop-blur-md border border-[#FFD700]/30 max-w-md mx-4 shadow-2xl">
                        <p className="text-white text-xl mb-2 font-bold">Misión de Inspección</p>
                        <p className="text-stone-300">
                            Nivel {currentLevelIndex + 1}
                            <br />
                            <span className="text-[#FFD700]">Haz click en la muralla</span> para encontrar la grieta oculta.
                            <br />
                            <span className="text-sm text-stone-400 mt-2 block">¡Usa las pistas de temperatura!</span>
                        </p>
                        <div className="mt-4 pt-4 border-t border-stone-600 flex justify-between text-sm text-stone-400">
                            <span>Tiempo: {formatTime(stats.timeElapsed)}</span>
                            <span>Clicks: {stats.clicksToFindCrack}</span>
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
                                    setView('playing');
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
    }

    return (
        <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnd={handleDragEnd}
        >
            <div
                className="min-h-screen text-stone-100 p-8 font-['Lato'] relative overflow-hidden flex flex-col"
                style={{
                    // Blurred background of the same scene to imply "focus"
                    background: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("/assets/cartagena_wall.jpg") center/cover fixed',
                }}
            >
                <header className="mb-6 flex justify-between items-center relative z-10 border-b border-stone-700 pb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-[#FFD700] font-['Cinzel'] tracking-widest">
                            Zona de Reparación
                        </h1>
                        <p className="text-stone-400 text-sm">Sector: Torre del Reloj - Nivel {currentLevelIndex + 1}</p>
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
                    <button
                        onClick={startSearchPhase}
                        className="text-stone-400 hover:text-white transition-colors text-sm uppercase tracking-wider flex items-center gap-2"
                    >
                        ← Volver al Mapa
                    </button>
                </header>

                <div className="flex-grow flex flex-col lg:flex-row gap-12 items-start justify-center relative z-10">
                    {/* Main Game Area - The Wall Close-up */}
                    <div className="flex flex-col items-center">
                        <div className="relative p-1 bg-[#3e342b] rounded shadow-2xl">
                            {/* Decorative outer frame resembling rough stone/wood */}
                            <div className="absolute inset-0 border-[8px] border-[#2a221b] rounded pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-20"></div>
                            <Board activePiece={activePiece} hoveredCell={hoveredCell} />
                        </div>
                    </div>

                    {/* Inventory / Workshop */}
                    <div className="bg-[#2c241b]/95 p-6 rounded-lg border border-[#5D4037] h-fit shadow-2xl backdrop-blur-md min-w-[300px]">
                        <h2 className="text-xl font-bold mb-4 text-[#deb887] border-b border-[#5D4037] pb-2 font-['Cinzel'] text-center">
                            Piedras Disponibles
                        </h2>
                        <div className="flex flex-wrap gap-4 justify-center min-h-[150px] content-start">
                            {inventoryPieces.map((piece) => (
                                <div key={piece.id} className="flex flex-col items-center group">
                                    <div className="p-2 bg-black/30 rounded border border-stone-700 group-hover:border-[#deb887] transition-all duration-300 hover:bg-black/50">
                                        <Piece
                                            piece={piece}
                                            inInventory
                                            onClick={() => rotatePiece(piece.id)}
                                        />
                                    </div>
                                </div>
                            ))}
                            {inventoryPieces.length === 0 && !levelCompleted && (
                                <div className="flex flex-col items-center justify-center h-full text-stone-500 italic text-sm">
                                    <p>Has usado todas las piedras.</p>
                                </div>
                            )}
                        </div>

                        <button
                            onClick={resetLevel}
                            className="mt-6 w-full py-2 px-4 bg-[#4a3728] hover:bg-[#5d4037] rounded border border-[#deb887]/20 text-[#deb887] font-['Cinzel'] font-bold text-sm tracking-wider transition-all"
                        >
                            Reiniciar Trabajo
                        </button>
                    </div>
                </div>

                {/* Victory Modal */}
                {levelCompleted && (
                    <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50 animate-in fade-in duration-500 backdrop-blur-sm">
                        <div className="bg-[#2c241b] p-10 rounded border-4 border-[#FFD700] text-center max-w-lg shadow-[0_0_50px_rgba(255,215,0,0.2)] relative">
                            <h2 className="text-4xl font-bold text-[#FFD700] mb-2 font-['Cinzel'] uppercase">¡Obra Finalizada!</h2>
                            <p className="text-stone-300 mb-6 text-lg">
                                La estructura es sólida de nuevo. Excelente trabajo, Arquitecto.
                            </p>

                            <div className="grid grid-cols-3 gap-4 mb-8 bg-black/30 p-4 rounded border border-stone-700">
                                <div className="flex flex-col">
                                    <span className="text-stone-500 text-xs uppercase">Tiempo</span>
                                    <span className="text-xl font-bold text-[#FFD700]">{formatTime(stats.timeElapsed)}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-stone-500 text-xs uppercase">Clicks</span>
                                    <span className="text-xl font-bold text-[#FFD700]">{stats.clicksToFindCrack}</span>
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-stone-500 text-xs uppercase">Movimientos</span>
                                    <span className="text-xl font-bold text-[#FFD700]">{stats.movesCount}</span>
                                </div>
                            </div>

                            <div className="text-center mb-6">
                                <span className="text-stone-400 uppercase text-sm tracking-widest">Puntaje Total</span>
                                <div className="text-5xl font-bold text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] mt-2">
                                    {calculateScore(stats)}
                                </div>
                            </div>

                            <div className="flex gap-4 justify-center">
                                <button
                                    onClick={resetLevel}
                                    className="px-6 py-3 bg-[#5d4037] hover:bg-[#4a3728] text-[#deb887] font-bold rounded border border-[#deb887]/30 transition-all font-['Cinzel']"
                                >
                                    Repetir Nivel
                                </button>
                                <button
                                    onClick={handleNextLevel}
                                    className="px-6 py-3 bg-[#FFD700] hover:bg-[#FDB931] text-[#2c241b] font-bold rounded shadow-lg transition-all font-['Cinzel']"
                                >
                                    Siguiente Nivel
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DragOverlay dropAnimation={{
                duration: 250,
                easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
            }}>
                {activePiece ? <Piece piece={activePiece} isOverlay /> : null}
            </DragOverlay>
        </DndContext>
    );
};
