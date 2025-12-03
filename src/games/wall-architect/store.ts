import { create } from 'zustand';
import { type GameState } from './types';
import { rotateMatrix, isValidPlacement, placePieceOnBoard, checkLevelCompleted } from './utils';
import { type LevelConfig } from './types';
import type { LeveInfo } from '../../services/gameService';

interface ExtendedGameState extends GameState {
    gameStarted: boolean;
    level: LevelConfig | null;
    levelInfo: LeveInfo | null;
    cellSize: number;
    startGame: () => void;
    setLevel: (level: LevelConfig, levelInfo: LeveInfo) => void;
    rotatePiece: (pieceId: string) => void;
    placePiece: (pieceId: string, position: { row: number; col: number }) => void;
    removePiece: (pieceId: string) => void;
    resetLevel: () => void;
    incrementSearchClicks: () => void;
    incrementMoves: () => void;
    tickTime: () => void;
    setCellSize: (cellSize: number) => void;
}

export const useWallArchitectStore = create<ExtendedGameState>((set) => ({
    board: [], // Initialized in resetLevel
    inventoryPieces: [],
    placedPieces: [],
    levelCompleted: false,
    levelInfo: null,
    level: null,
    stats: {
        clicksToFindCrack: 0,
        movesCount: 0,
        timeElapsed: 0,
    },
    gameStarted: false,
    cellSize: 0,

    setCellSize: (cellSize: number) => set({ cellSize }),

    startGame: () => set({ gameStarted: true }),

    rotatePiece: (pieceId) => set((state) => {
        const piece = state.inventoryPieces.find((p) => p.id === pieceId);
        if (!piece) return {};

        const newShape = rotateMatrix(piece.shape);
        const updatedPieces = state.inventoryPieces.map((p) =>
            p.id === pieceId ? { ...p, shape: newShape } : p
        );

        return {
            inventoryPieces: updatedPieces,
            stats: { ...state.stats, movesCount: state.stats.movesCount + 1 }
        };
    }),

    placePiece: (pieceId, position) => set((state) => {
        const piece = state.inventoryPieces.find((p) => p.id === pieceId);

        if (!piece) return {};

        const stats = { ...state.stats, movesCount: state.stats.movesCount + 1 }

        if (!isValidPlacement(state.board, piece.shape, position.row, position.col)) return { stats };

        const newBoard = placePieceOnBoard(state.board, piece.shape, position.row, position.col);
        const newPlacedPiece = { ...piece, position };

        const newInventory = state.inventoryPieces.filter((p) => p.id !== pieceId);
        const newPlacedPieces = [...state.placedPieces, newPlacedPiece];

        const isCompleted = checkLevelCompleted(newBoard);

        return {
            board: newBoard,
            inventoryPieces: newInventory,
            placedPieces: newPlacedPieces,
            levelCompleted: isCompleted,
            stats
        };
    }),

    removePiece: (pieceId) => {
        // TODO: Implement if needed
        console.log("Remove piece", pieceId);
    },

    resetLevel: () => set((state) => {
        if (!state.level) return {};
        const levelConfig = state.level;
        const rows = levelConfig.rows || 8;
        const cols = levelConfig.cols || 8;
        return {
            // Preserve gameStarted and stats
            gameStarted: state.gameStarted,
            board: levelConfig.boardSetup(rows, cols),
            inventoryPieces: [...levelConfig.pieces], // Clone array
            placedPieces: [],
            levelCompleted: false,
            stats: state.stats
        };
    }),

    incrementSearchClicks: () => set((state) => ({
        stats: { ...state.stats, clicksToFindCrack: state.stats.clicksToFindCrack + 1 }
    })),

    incrementMoves: () => set((state) => ({
        stats: { ...state.stats, movesCount: state.stats.movesCount + 1 }
    })),

    tickTime: () => set((state) => ({
        stats: { ...state.stats, timeElapsed: state.stats.timeElapsed + 1 }
    })),

    setLevel: (level: LevelConfig, levelInfo: LeveInfo) => {
        const rows = level.rows || 8;
        const cols = level.cols || 8;
        set({
            level,
            levelInfo,
            gameStarted: false,
            board: level.boardSetup(rows, cols),
            inventoryPieces: [...level.pieces],
            placedPieces: [],
            levelCompleted: false,
            stats: {
                clicksToFindCrack: 0,
                movesCount: 0,
                timeElapsed: 0,
            }
        });
    }
}));
