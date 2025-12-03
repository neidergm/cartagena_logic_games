import React from 'react';
import { useWallArchitectStore } from '../store';
import { GridCell } from './GridCell';

import type { Piece, Position } from '../types';
import { isValidPlacement } from '../utils';
import { useDroppable } from '@dnd-kit/core';

interface BoardProps {
    activePiece: Piece | null;
    shadow: Position | null;
}
export const Board: React.FC<BoardProps> = ({ activePiece, shadow }) => {

    const { setNodeRef } = useDroppable({
        id: 'board-zone',
    });
    const board = useWallArchitectStore((state) => state.board);
    const cellSize = useWallArchitectStore((state) => state.cellSize);

    // Pre-calculate ghost cells to avoid running logic for every cell render
    const ghostCells = React.useMemo(() => {
        const cells = new Set<string>();
        if (!activePiece || !shadow) return { cells, isValid: false };
        let isValid = true;

        // Check validity first (once per drag update)
        isValid = isValidPlacement(board, activePiece.shape, shadow.row, shadow.col);

        // Calculate affected cells
        for (let r = 0; r < activePiece.shape.length; r++) {
            for (let c = 0; c < activePiece.shape[0].length; c++) {
                if (activePiece.shape[r][c] === 1) {
                    const targetRow = shadow.row + r;
                    const targetCol = shadow.col + c;
                    cells.add(`${targetRow}-${targetCol}`);
                }
            }
        }

        return { cells, isValid };
    }, [activePiece, shadow, board]);

    if (cellSize === 0) return null;

    return (
        <div ref={setNodeRef}
            className="grid gap-0 bg-stone-900 border-2 border-stone-900"
            style={{
                gridTemplateColumns: `repeat(${board?.[0]?.length}, minmax(0, 1fr))`,
                width: `${board?.[0]?.length * cellSize}px`,
            }}
        >
            {board?.map((row, rIndex) => (
                row.map((cell, cIndex) => {
                    const cellKey = `${rIndex}-${cIndex}`;
                    const isGhost = ghostCells.cells.has(cellKey);
                    const ghostType = isGhost ? (ghostCells.isValid ? 'valid' : 'invalid') : null;

                    return (
                        <GridCell
                            size={cellSize}
                            key={cellKey}
                            type={cell}
                            row={rIndex}
                            col={cIndex}
                            ghostType={ghostType}
                        />
                    );
                })
            ))}
        </div>
    );
};
