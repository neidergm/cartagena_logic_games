import { create } from 'zustand';
import { type GameState } from './types';
import { rotateMatrix, isValidPlacement, placePieceOnBoard, checkLevelCompleted } from './utils';
import { LEVELS } from './data/levels';

interface ExtendedGameState extends GameState {
    currentLevelIndex: number;
    nextLevel: () => void;
    setLevel: (levelIndex: number) => void;
}

export const useWallArchitectStore = create<ExtendedGameState>((set) => ({
    board: [], // Initialized in resetLevel
    inventoryPieces: [],
    placedPieces: [],
    levelCompleted: false,
    currentLevelIndex: 0,
    stats: {
        clicksToFindCrack: 0,
        movesCount: 0,
        timeElapsed: 0,
    },

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

        if (isValidPlacement(state.board, piece.shape, position.row, position.col)) {
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
                stats: { ...state.stats, movesCount: state.stats.movesCount + 1 }
            };
        }
        return {};
    }),

    removePiece: (pieceId) => {
        // TODO: Implement if needed
        console.log("Remove piece", pieceId);
    },

    resetLevel: () => set((state) => {
        const levelConfig = LEVELS[state.currentLevelIndex];
        const rows = levelConfig.rows || 8;
        const cols = levelConfig.cols || 8;
        return {
            board: levelConfig.boardSetup(rows, cols),
            inventoryPieces: [...levelConfig.pieces], // Clone array
            placedPieces: [],
            levelCompleted: false,
            stats: {
                clicksToFindCrack: 0,
                movesCount: 0,
                timeElapsed: 0,
            }
        };
    }),

    nextLevel: () => set((state) => {
        const nextIndex = (state.currentLevelIndex + 1) % LEVELS.length;
        const levelConfig = LEVELS[nextIndex];
        const rows = levelConfig.rows || 8;
        const cols = levelConfig.cols || 8;
        return {
            currentLevelIndex: nextIndex,
            board: levelConfig.boardSetup(rows, cols),
            inventoryPieces: [...levelConfig.pieces],
            placedPieces: [],
            levelCompleted: false,
            stats: {
                clicksToFindCrack: 0,
                movesCount: 0,
                timeElapsed: 0,
            }
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

    setLevel: (levelIndex: number) => set(() => {
        const safeIndex = Math.max(0, Math.min(levelIndex, LEVELS.length - 1));
        const levelConfig = LEVELS[safeIndex];
        const rows = levelConfig.rows || 8;
        const cols = levelConfig.cols || 8;
        return {
            currentLevelIndex: safeIndex,
            board: levelConfig.boardSetup(rows, cols),
            inventoryPieces: [...levelConfig.pieces],
            placedPieces: [],
            levelCompleted: false,
            stats: {
                clicksToFindCrack: 0,
                movesCount: 0,
                timeElapsed: 0,
            }
        };
    })
}));

// Initialize first level
useWallArchitectStore.getState().resetLevel();
