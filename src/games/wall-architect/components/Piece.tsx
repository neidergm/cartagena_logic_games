import React from 'react';
import type { Piece as PieceType } from '../types';
import { clsx } from 'clsx';
import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';

interface PieceProps {
    piece: PieceType;
    inInventory?: boolean;
    onClick?: () => void;
    isOverlay?: boolean;
}

export const Piece: React.FC<PieceProps> = ({ piece, inInventory, onClick, isOverlay }) => {
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
        id: piece.id,
        data: { piece },
        disabled: !inInventory && !isOverlay,
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        opacity: isDragging ? 0.8 : 1, // Less transparent to keep texture visible
        filter: isDragging ? 'drop-shadow(0 10px 15px rgba(0,0,0,0.5))' : undefined,
    };

    // Stone texture for pieces
    const pieceTexture = {
        backgroundImage: `
      radial-gradient(circle at 30% 30%, rgba(255,255,255,0.15) 0%, transparent 20%),
      linear-gradient(135deg, rgba(0,0,0,0.05) 0%, transparent 100%)
    `,
    };

    const renderContent = () => (
        <div
            style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${piece.shape[0].length}, minmax(0, 1fr))`,
                gap: '0px', // No gap for solid stone look, or small gap for bricks
            }}
        >
            {piece.shape.map((row, rIndex) => (
                <React.Fragment key={rIndex}>
                    {row.map((cell, cIndex) => (
                        <div
                            key={`${rIndex}-${cIndex}`}
                            style={cell === 1 ? pieceTexture : undefined}
                            className={clsx(
                                'w-8 h-8 transition-all',
                                cell === 1
                                    ? 'bg-[#A08B6B] border border-[#5D4037]/40 shadow-[inset_0_1px_3px_rgba(255,255,255,0.3),inset_0_-1px_3px_rgba(0,0,0,0.2)]'
                                    : 'bg-transparent',
                                cell === 1 ? 'rounded-[2px]' : ''
                            )}
                        />
                    ))}
                </React.Fragment>
            ))}
        </div>
    );

    if (isOverlay) {
        return (
            <div className="relative pointer-events-none z-50 cursor-grabbing">
                {renderContent()}
            </div>
        );
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={clsx(
                "relative select-none touch-none",
                inInventory ? "cursor-grab active:cursor-grabbing p-2 hover:scale-105 transition-transform duration-200" : ""
            )}
            onClick={onClick}
        >
            {renderContent()}
        </div>
    );
};
