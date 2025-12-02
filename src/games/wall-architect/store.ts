import { create } from 'zustand';
import { type GameState } from './types';
import { rotateMatrix, isValidPlacement, placePieceOnBoard, checkLevelCompleted } from './utils';
import { fetchLevelsByGameId } from './services/levelService';
import { type LevelConfig } from './types';

interface ExtendedGameState extends GameState {
    currentLevelIndex: number;
    gameStarted: boolean;
    levels: LevelConfig[];
    isLoadingLevels: boolean;
    startGame: () => void;
    nextLevel: () => void;
    setLevel: (levelIndex: number) => void;
    loadLevels: (gameId: number) => Promise<void>;
}

export const useWallArchitectStore = create<ExtendedGameState>((set) => ({
    board: [], // Initialized in resetLevel
    inventoryPieces: [],
    placedPieces: [],
    levelCompleted: false,

    currentLevelIndex: 0,
    levels: [],
    isLoadingLevels: false,
    stats: {
        clicksToFindCrack: 0,
        movesCount: 0,
        timeElapsed: 0,
    },

    gameStarted: false,

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
        // Invalid placement: still count the move
        return {
            stats: { ...state.stats, movesCount: state.stats.movesCount + 1 }
        };
    }),

    removePiece: (pieceId) => {
        // TODO: Implement if needed
        console.log("Remove piece", pieceId);
    },

    resetLevel: () => set((state) => {
        if (state.levels.length === 0) return {};
        const levelConfig = state.levels[state.currentLevelIndex];
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

    nextLevel: () => set((state) => {
        if (state.levels.length === 0) return {};
        const nextIndex = (state.currentLevelIndex + 1) % state.levels.length;
        const levelConfig = state.levels[nextIndex];
        const rows = levelConfig.rows || 8;
        const cols = levelConfig.cols || 8;
        return {
            gameStarted: false,
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

    setLevel: (levelIndex: number) => set((state) => {
        if (state.levels.length === 0) return {};
        const safeIndex = Math.max(0, Math.min(levelIndex, state.levels.length - 1));
        const levelConfig = state.levels[safeIndex];
        const rows = levelConfig.rows || 8;
        const cols = levelConfig.cols || 8;
        return {
            gameStarted: false,
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
    }),

    loadLevels: async (gameId: number) => {
        set({ isLoadingLevels: true });
        const levels = await fetchLevelsByGameId(gameId);
        set({ levels, isLoadingLevels: false });
        // Initialize first level if levels found
        if (levels.length > 0) {
            useWallArchitectStore.getState().resetLevel();
        }
    }
}));

// Initialize first level

