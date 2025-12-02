import { create } from 'zustand';
import { type TGridState } from './types/game';
import { createLevelFromData, toggleCell } from './levelsEngine';

interface LightsOutState {
    grid: TGridState;
    moves: number;
    isWon: boolean;
    timeElapsed: number;
    isPlaying: boolean;

    // Actions
    initializeGame: (gridSize: number, complexity: number) => void;
    resetGame: (gridSize: number, complexity: number) => void;
    toggleLight: (row: number, col: number) => void;
    incrementTime: () => void;
    setWon: (won: boolean) => void;
}

export const useLightsOutStore = create<LightsOutState>((set, get) => ({
    grid: [],
    moves: 0,
    isWon: false,
    timeElapsed: 0,
    isPlaying: false,

    initializeGame: (gridSize, complexity) => {
        const newGrid = createLevelFromData(gridSize, complexity);
        set({
            grid: newGrid,
            moves: 0,
            timeElapsed: 0,
            isWon: false,
            isPlaying: true
        });
    },

    resetGame: (gridSize, complexity) => {
        get().initializeGame(gridSize, complexity);
    },

    toggleLight: (row, col) => {
        const { grid, isWon } = get();
        if (isWon) return;

        const newGrid = toggleCell(grid, row, col);
        const allOff = newGrid.every(r => r.every(cell => !cell));

        set(state => ({
            grid: newGrid,
            moves: state.moves + 1,
            isWon: allOff,
            isPlaying: !allOff
        }));
    },

    incrementTime: () => {
        const { isWon } = get();
        if (!isWon) {
            set(state => ({ timeElapsed: state.timeElapsed + 1 }));
        }
    },

    setWon: (won) => set({ isWon: won })
}));
