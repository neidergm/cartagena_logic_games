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



// Common Shapes (Inlined for JSON purity, or could be referenced if we had a shapes table)
// Shape is an array of rows, each row is an array of columns, example:
// [[1, 1], [1, 1]]
// 1 is a block, 0 is empty space
const SHAPES = {
    SQUARE_2x2: [[1, 1], [1, 1]],
    SQUARE_3x3: [[1, 1, 1], [1, 1, 1], [1, 1, 1]],
    BAR_2x1: [[1, 1]],
    BAR_3x1: [[1, 1, 1]],
    BAR_4x1: [[1, 1, 1, 1]],
    BAR_5x1: [[1, 1, 1, 1, 1]],
    BAR_1x3: [[1], [1], [1]],
    BAR_1x5: [[1], [1], [1], [1], [1]],
    L_3: [[1, 0], [1, 1]],
    L_4: [[1, 0], [1, 0], [1, 1]],
    J_4: [[0, 1], [0, 1], [1, 1]],
    T_4: [[1, 1, 1], [0, 1, 0]],
    O_4: [[1, 1], [1, 1]],
    I_4: [[1, 1, 1, 1]],
    Z_4: [[1, 1, 0], [0, 1, 1]],
    S_4: [[0, 1, 1], [1, 1, 0]],
};

export const getShape = (shape: keyof typeof SHAPES | number[][]): PieceShape =>
    typeof shape === 'string' ? SHAPES[shape] : shape;