import type { BoardMatrix, PieceShape } from './types';

/**
 * Rotates a 2D matrix 90 degrees clockwise.
 */
export const rotateMatrix = (matrix: PieceShape): PieceShape => {
    const rows = matrix.length;
    const cols = matrix[0].length;

    // Create new matrix with swapped dimensions
    const newMatrix: number[][] = Array(cols).fill(null).map(() => Array(rows).fill(0));

    for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
            // New column is the original row
            // New row is (original width - 1) - original column
            newMatrix[c][rows - 1 - r] = matrix[r][c];
        }
    }

    return newMatrix;
};

/**
 * Checks if a piece can be placed at the specified position.
 * A placement is valid if:
 * 1. All occupied cells of the piece are within board bounds.
 * 2. All occupied cells of the piece land on '1' (target/crack) cells of the board.
 * 3. No occupied cell of the piece overlaps with an already filled cell (2).
 */
export const isValidPlacement = (
    board: BoardMatrix,
    pieceShape: PieceShape,
    startRow: number,
    startCol: number
): boolean => {
    const pieceRows = pieceShape.length;
    const pieceCols = pieceShape[0].length;
    const boardRows = board.length;
    const boardCols = board[0].length;

    for (let r = 0; r < pieceRows; r++) {
        for (let c = 0; c < pieceCols; c++) {
            // Only check if the piece actually has a block here
            if (pieceShape[r][c] === 1) {
                const boardR = startRow + r;
                const boardC = startCol + c;

                // Check bounds
                if (boardR < 0 || boardR >= boardRows || boardC < 0 || boardC >= boardCols) {
                    return false;
                }

                // Check target cell type
                // Must be 1 (Target). 
                // If it's 0 (Wall), we can't place it (it's outside the crack).
                // If it's 2 (Occupied), we can't overlap.
                const targetCell = board[boardR][boardC];
                if (targetCell !== 1) {
                    return false;
                }
            }
        }
    }

    return true;
};

/**
 * Returns a new board matrix with the piece placed on it.
 * Assumes validation has already passed.
 */
export const placePieceOnBoard = (
    board: BoardMatrix,
    pieceShape: PieceShape,
    startRow: number,
    startCol: number
): BoardMatrix => {
    // Deep copy board
    const newBoard = board.map(row => [...row]);

    const pieceRows = pieceShape.length;
    const pieceCols = pieceShape[0].length;

    for (let r = 0; r < pieceRows; r++) {
        for (let c = 0; c < pieceCols; c++) {
            if (pieceShape[r][c] === 1) {
                // Mark as 2 (Occupied)
                newBoard[startRow + r][startCol + c] = 2;
            }
        }
    }

    return newBoard;
};

/**
 * Checks if the level is completed (no '1' cells remaining).
 */
export const checkLevelCompleted = (board: BoardMatrix): boolean => {
    for (let r = 0; r < board.length; r++) {
        for (let c = 0; c < board[0].length; c++) {
            if (board[r][c] === 1) {
                return false;
            }
        }
    }
    return true;
};
