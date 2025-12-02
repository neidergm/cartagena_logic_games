import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallArchitectStore } from '../store';
import { Board } from './Board';
import { Piece } from './Piece';
import {
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    pointerWithin
} from '@dnd-kit/core';
import type { Piece as PieceType, Position } from '../types';

export const PlayingView: React.FC = () => {
    const {
        inventoryPieces,
        rotatePiece,
        placePiece,
        resetLevel,
        levelInfo,
        stats,
        levelCompleted
    } = useWallArchitectStore();

    const [activePiece, setActivePiece] = useState<PieceType | null>(null);
    const [hoveredCell, setHoveredCell] = useState<Position | null>(null);
    const [dragCellSize, setDragCellSize] = useState<number | undefined>(undefined);
    const [grabOffset, setGrabOffset] = useState<{ x: number, y: number } | null>(null);
    const [showExitConfirm, setShowExitConfirm] = useState(false);
    const navigate = useNavigate();

    const handleExit = () => {
        navigate('/');
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

    const measureCellSize = () => {
        const firstCell = document.querySelector('[id^="cell-"]');
        if (firstCell) {
            const rect = firstCell.getBoundingClientRect();
            return rect.width;
        }
        return undefined;
    };

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const piece = active.data.current?.piece as PieceType;
        if (piece) {
            setActivePiece(piece);
            const size = measureCellSize();
            if (size) setDragCellSize(size);

            // Calculate grab offset relative to the piece's top-left
            // This allows us to keep the piece centered on the cursor even when it resizes
            const activatorEvent = event.activatorEvent as MouseEvent | TouchEvent;
            const rect = active.rect.current.initial;

            if (rect && activatorEvent) {
                let clientX, clientY;
                if ('touches' in activatorEvent) {
                    clientX = activatorEvent.touches[0].clientX;
                    clientY = activatorEvent.touches[0].clientY;
                } else {
                    clientX = (activatorEvent as MouseEvent).clientX;
                    clientY = (activatorEvent as MouseEvent).clientY;
                }

                if (rect.left !== undefined && rect.top !== undefined) {
                    setGrabOffset({
                        x: clientX - rect.left,
                        y: clientY - rect.top
                    });
                }
            }
        }
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;

        // Fallback: if dragCellSize wasn't set (e.g. race condition), try again
        if (!dragCellSize) {
            const size = measureCellSize();
            if (size) setDragCellSize(size);
        }

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
        setDragCellSize(undefined);
        setGrabOffset(null);

        if (over && over.id.toString().startsWith('cell-')) {
            const { row, col } = over.data.current as { row: number; col: number };
            placePiece(active.id.toString(), { row, col });
        } else {
            // Increment moves even if dropped outside or invalid
            // Note: placePiece handles valid moves incrementing.
            // If we drop outside, we should probably count it as a move too?
            // The user request said "invalid moves also count".
            // Dropping outside is technically an invalid move.
            useWallArchitectStore.getState().incrementMoves();
        }
    };

    // Format time helper
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    // Calculate shift to keep piece under cursor
    const getDragShift = () => {
        if (!hoveredCell || !dragCellSize || !grabOffset) return undefined;

        // Default inventory size is 32px
        const scale = dragCellSize / 32;

        // Shift = GrabOffset * (1 - Scale)
        // This moves the piece so the grabbed point stays stationary relative to the cursor
        return {
            x: grabOffset.x * (1 - scale),
            y: grabOffset.y * (1 - scale)
        };
    };

    const dragShift = getDragShift();

    return (
        <div
            className="min-h-screen text-stone-100 p-4 md:p-8 font-['Lato'] relative overflow-hidden flex flex-col"
        >
            {/* Exit Button */}
            <button
                onClick={() => setShowExitConfirm(true)}
                className="absolute top-6 right-6 z-50 p-3 bg-black/50 hover:bg-[#8B4513] text-stone-400 hover:text-white rounded-full border border-[#deb887]/30 transition-all backdrop-blur-sm group"
                title="Salir al Inicio"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 group-hover:scale-110 transition-transform"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>

            {/* Exit Confirmation Modal */}
            {showExitConfirm && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
                    <div className="bg-[#2c241b] p-8 rounded-lg border border-[#5D4037] shadow-2xl max-w-sm w-full text-center relative">
                        <h3 className="text-xl font-bold text-[#FFD700] font-['Cinzel'] mb-4">¿Abandonar Trabajo?</h3>
                        <p className="text-stone-300 mb-8 font-sans">El progreso del nivel actual se perderá.</p>
                        <div className="flex gap-4 justify-center font-sans">
                            <button
                                onClick={() => setShowExitConfirm(false)}
                                className="px-4 py-2 text-stone-400 hover:text-white transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handleExit}
                                className="px-6 py-2 bg-[#8B4513] hover:bg-[#A0522D] text-white rounded border border-[#deb887]/30 transition-all shadow-lg"
                            >
                                Confirmar
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <div
                className="fixed inset-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("/assets/cartagena_wall.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0, // Ensure it sits above Layout background but below content
                }}
            />
            <header className="mb-6 flex justify-between items-center relative z-10 border-b border-stone-700 pb-4 pr-16">
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

            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="flex-grow flex flex-col lg:flex-row gap-12 items-start justify-center relative z-10">
                    {/* Main Game Area - The Wall Close-up */}
                    <div className="flex flex-col items-center w-full lg:w-2xl">
                        <div className="relative p-1 rounded shadow-2xl w-full ">
                            {/* Decorative outer frame resembling rough stone/wood */}
                            <div className="absolute inset-0 border-[8px] border-[#2a221b] rounded pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-20"></div>
                            <Board activePiece={activePiece} hoveredCell={hoveredCell} />
                        </div>
                    </div>

                    {/* Inventory / Workshop */}
                    <div className="bg-[#2c241b]/95 p-6 rounded-lg border border-[#5D4037] h-fit shadow-2xl backdrop-blur-md w-full lg:w-auto lg:min-w-[300px]">
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

                <DragOverlay dropAnimation={{
                    duration: 250,
                    easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
                }}>
                    {activePiece ? (
                        <div style={{
                            transform: dragShift ? `translate(${dragShift.x}px, ${dragShift.y}px)` : undefined,
                            transition: 'transform 0.1s ease-out' // Smooth adjustment
                        }}>
                            <Piece
                                piece={activePiece}
                                isOverlay
                                cellSize={hoveredCell ? dragCellSize : undefined}
                            />
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    );
};
