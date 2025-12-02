import React from 'react';
import { useWallArchitectStore } from '../store';
import { GridCell } from './GridCell';

import type { Piece, Position } from '../types';
import { isValidPlacement } from '../utils';

interface BoardProps {
    activePiece: Piece | null;
    hoveredCell: Position | null;
}

export const Board: React.FC<BoardProps> = ({ activePiece, hoveredCell }) => {
    const board = useWallArchitectStore((state) => state.board);

    // Pre-calculate ghost cells to avoid running logic for every cell render
    const ghostCells = React.useMemo(() => {
        const cells = new Set<string>();
        if (!activePiece || !hoveredCell) return { cells, isValid: false };

        let isValid = true;

        // Check validity first (once per drag update)
        isValid = isValidPlacement(board, activePiece.shape, hoveredCell.row, hoveredCell.col);

        // Calculate affected cells
        for (let r = 0; r < activePiece.shape.length; r++) {
            for (let c = 0; c < activePiece.shape[0].length; c++) {
                if (activePiece.shape[r][c] === 1) {
                    const targetRow = hoveredCell.row + r;
                    const targetCol = hoveredCell.col + c;
                    cells.add(`${targetRow}-${targetCol}`);
                }
            }
        }

        return { cells, isValid };
    }, [activePiece, hoveredCell, board]);

    return (
        <div
            className="bg-stone-800 md:p-4 rounded-lg shadow-2xl border-4 border-stone-600"
        >
            <div
                className="grid gap-0 bg-stone-900 border-2 border-stone-900 mx-auto"
                style={{
                    gridTemplateColumns: `repeat(${board[0].length}, minmax(0, 1fr))`,
                    maxWidth: `${board[0].length * 40}px`,
                }}
            >
                {board.map((row, rIndex) => (
                    row.map((cell, cIndex) => {
                        const cellKey = `${rIndex}-${cIndex}`;
                        const isGhost = ghostCells.cells.has(cellKey);
                        const ghostType = isGhost ? (ghostCells.isValid ? 'valid' : 'invalid') : null;

                        return (
                            <GridCell
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
        </div>
    );
};
