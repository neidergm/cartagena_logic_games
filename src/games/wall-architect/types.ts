export type CellType = 0 | 1 | 2;
// 0: Empty space (wall intact/background)
// 1: Target space (crack to fill)
// 2: Occupied space (piece placed)

export type BoardMatrix = CellType[][];

export type PieceShape = number[][]; // 2D array of 0s and 1s

export interface Position {
    row: number;
    col: number;
}

export interface Piece {
    id: string;
    shape: PieceShape;
    position: Position | null; // null if in inventory
    isDragging?: boolean;
}

export interface LevelData {
    id: number;
    rows: number;
    cols: number;
    solution: ({
        shape: number;
    } & Position)[];
}

export interface LevelStats {
    clicksToFindCrack: number;
    movesCount: number;
    timeElapsed: number; // seconds
}

export interface GameState {
    board: BoardMatrix;
    inventoryPieces: Piece[];
    placedPieces: Piece[];
    levelCompleted: boolean;

    stats: LevelStats;

    // Actions
    rotatePiece: (pieceId: string) => void;
    placePiece: (pieceId: string, position: Position) => void;
    removePiece: (pieceId: string) => void;
    resetLevel: () => void;

    // Stats Actions
    incrementSearchClicks: () => void;
    incrementMoves: () => void;
    tickTime: () => void;
}

export interface LevelConfig {
    id: number;
    boardSetup: (rows: number, cols: number) => BoardMatrix;
    pieces: Piece[];
    rows?: number; // Optional override for board size
    cols?: number;
}
