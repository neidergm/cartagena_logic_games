import React from 'react';
import type { CellType } from '../types';
import { clsx } from 'clsx';
import { useDroppable } from '@dnd-kit/core';

interface GridCellProps {
    type: CellType;
    row: number;
    col: number;
    isOverlay?: boolean;
    ghostType?: 'valid' | 'invalid' | null;
}

export const GridCell: React.FC<GridCellProps> = ({ type, row, col, isOverlay, ghostType }) => {
    const { setNodeRef } = useDroppable({
        id: `cell-${row}-${col}`,
        data: { row, col },
    });

    // Stone texture pattern (CSS radial gradient trick)
    const stoneTexture = {
        backgroundImage: `
      radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 60%),
      linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1)),
      linear-gradient(45deg, rgba(0,0,0,0.1) 25%, transparent 25%, transparent 75%, rgba(0,0,0,0.1) 75%, rgba(0,0,0,0.1))
    `,
        backgroundSize: '100% 100%, 4px 4px, 4px 4px',
        backgroundPosition: '0 0, 0 0, 2px 2px'
    };

    return (
        <div
            ref={setNodeRef}
            style={type === 0 || type === 2 ? stoneTexture : undefined}
            className={clsx(
                'w-10 h-10 border border-stone-900/30 flex items-center justify-center transition-all duration-200 relative',
                {
                    // Wall (Intact) - Warm stone color
                    'bg-[#8B7355] shadow-[inset_0_0_10px_rgba(0,0,0,0.3)]': type === 0 && !ghostType,

                    // Crack (Target) - Dark earth/void
                    'bg-[#1a1510] shadow-[inset_0_0_15px_rgba(0,0,0,0.8)]': type === 1 && !ghostType,

                    // Occupied (Placed Piece) - Slightly lighter/different stone to distinguish
                    'bg-[#A08B6B] shadow-[inset_0_2px_5px_rgba(255,255,255,0.2),0_2px_4px_rgba(0,0,0,0.4)] z-10': type === 2 && !ghostType,

                    'opacity-50': isOverlay,

                    // Ghost feedback
                    'bg-green-500/40 ring-2 ring-green-400 z-20': ghostType === 'valid',
                    'bg-red-500/40 ring-2 ring-red-400 z-20': ghostType === 'invalid',
                }
            )}
        >
            {/* Inner detail for the crack to make it look organic */}
            {type === 1 && !ghostType && (
                <div className="w-full h-full opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cracked-ground.png')]"></div>
            )}
        </div>
    );
};
