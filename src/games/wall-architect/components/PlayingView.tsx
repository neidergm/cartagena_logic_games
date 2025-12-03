import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useWallArchitectStore } from '../store';
import { Board } from './Board';
import { Piece } from './Piece';
import {
    type DragStartEvent,
    type DragOverEvent,
    type DragEndEvent,
    type DragMoveEvent,
    type DropAnimation,
    DndContext,
    DragOverlay,
    MouseSensor,
    TouchSensor,
    useSensor,
    useSensors,
    pointerWithin,
    defaultDropAnimationSideEffects
} from '@dnd-kit/core';
import type { Piece as PieceType, Position } from '../types';
import { calculateGridCoords } from '../utils';
import PlayingViewHeader from './PlayingViewHeader';
import ExitButton from './ExitButton';
import Inventory from './Inventory';

const dropAnimation: DropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
        styles: { active: { opacity: '0.4' } },
    }),
};

export const PlayingView: React.FC = () => {

    const placePiece = useWallArchitectStore((state) => state.placePiece);
    const board = useWallArchitectStore((state) => state.board);
    const setCellSize = useWallArchitectStore((state) => state.setCellSize);
    const cellSize = useWallArchitectStore((state) => state.cellSize);

    const [activePiece, setActivePiece] = useState<PieceType | null>(null);
    const [shadow, setShadow] = useState<Position | null>(null);

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

    const boardContainerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        // Efecto para calcular el tamaño de la celda basado en el contenedor
        const updateSize = () => {
            if (boardContainerRef.current) {
                const containerWidth = boardContainerRef.current.offsetWidth;
                const newSize = Math.floor(containerWidth / board?.[0]?.length);
                setCellSize(Math.max(10, newSize));
            }
        };

        const resizeObserver = new ResizeObserver(() => { updateSize() });

        if (boardContainerRef.current) {
            resizeObserver.observe(boardContainerRef.current);
            updateSize();
        }

        return () => resizeObserver.disconnect();
    }, []);

    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const piece = active.data.current?.piece as PieceType;
        if (piece) {
            setActivePiece(piece);
        }
    };

    const handleDragMove = useCallback((e: DragMoveEvent) => {
        const { active, over } = e;

        // Si salimos del tablero, limpiamos sombra y evitamos cálculos
        if (!over) {
            setShadow((prev) => prev ? null : prev); // Solo null si no era null
            return;
        }

        const coords = calculateGridCoords(active.rect.current.translated, over.rect, cellSize);

        if (coords) {
            setShadow((prev) => {
                if (prev && prev.row === coords.row && prev.col === coords.col) return prev;
                return { row: coords.row, col: coords.col };
            });
        }
    }, [cellSize]);

    const handleDragOver = (event: DragOverEvent) => {
        const { over } = event;

        if (over && over.id.toString().startsWith('cell-')) {
            const { row, col } = over.data.current as { row: number; col: number };
            setShadow({ row, col });
        } else {
            setShadow(null);
        }
    };

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (!over || !active.data.current) return;

        const coords = calculateGridCoords(active.rect.current.translated, over.rect, cellSize);
        if (!coords) return;

        setActivePiece(null);
        setShadow(null);

        placePiece(active.id.toString(), coords);
    };

    return (
        <div
            className="min-h-screen text-stone-100 p-4 md:p-8 font-['Lato'] relative overflow-hidden flex flex-col"
        >
            <ExitButton />

            <div
                className="fixed inset-0"
                style={{
                    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.8)), url("/assets/cartagena_wall.jpg")',
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    zIndex: 0,
                }}
            />
            <PlayingViewHeader />

            <DndContext
                sensors={sensors}
                collisionDetection={pointerWithin}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
                onDragMove={handleDragMove}
            >
                <div className="flex-grow flex flex-col lg:flex-row gap-12 items-start justify-center relative z-10">
                    {/* Main Game Area - The Wall Close-up */}
                    <div className="flex flex-col items-center w-full lg:w-2xl">
                        <div className="relative p-1 rounded shadow-2xl w-full " >
                            {/* Decorative outer frame resembling rough stone/wood */}
                            <div className="absolute inset-0 border-[8px] border-[#2a221b] rounded pointer-events-none shadow-[inset_0_0_20px_rgba(0,0,0,0.8)] z-20"></div>

                            <div
                                className="bg-stone-800 md:p-4 rounded-lg shadow-2xl border-4 border-stone-600"
                            >
                                <div ref={boardContainerRef} className=' mx-auto max-w-[600px]'>
                                    <Board activePiece={activePiece} shadow={shadow} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <Inventory />
                </div>

                <DragOverlay dropAnimation={dropAnimation}>
                    {activePiece ? (
                        <Piece
                            piece={activePiece}
                            isOverlay
                            cellSize={cellSize}
                        />
                    ) : null}
                </DragOverlay>
            </DndContext >
        </div >
    );
};
