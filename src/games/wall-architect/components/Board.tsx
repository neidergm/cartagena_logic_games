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

    // Calculate ghost cells
    const getGhostType = (r: number, c: number): 'valid' | 'invalid' | null => {
        if (!activePiece || !hoveredCell) return null;

        // Check if this cell is part of the ghost piece
        // The piece is positioned at hoveredCell (top-left)
        const relativeR = r - hoveredCell.row;
        const relativeC = c - hoveredCell.col;

        if (
            relativeR >= 0 &&
            relativeR < activePiece.shape.length &&
            relativeC >= 0 &&
            relativeC < activePiece.shape[0].length &&
            activePiece.shape[relativeR][relativeC] === 1
        ) {
            // This cell is part of the ghost piece
            // Check if the overall placement is valid
            const valid = isValidPlacement(board, activePiece.shape, hoveredCell.row, hoveredCell.col);
            return valid ? 'valid' : 'invalid';
        }

        return null;
    };

    return (
        <div
            className="bg-stone-800 p-4 rounded-lg shadow-2xl border-4 border-stone-600"
        >
            <div
                className="grid gap-0.5 bg-stone-900 border-2 border-stone-900"
                style={{
                    gridTemplateColumns: `repeat(${board[0].length}, minmax(0, 1fr))`
                }}
            >
                {board.map((row, rIndex) => (
                    row.map((cell, cIndex) => (
                        <GridCell
                            key={`${rIndex}-${cIndex}`}
                            type={cell}
                            row={rIndex}
                            col={cIndex}
                            ghostType={getGhostType(rIndex, cIndex)}
                        />
                    ))
                ))}
            </div>
        </div>
    );
};
