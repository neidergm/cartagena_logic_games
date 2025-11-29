import { useState, useCallback, useEffect } from 'react';
import { type TGridState } from '../types/game';

const GRID_SIZE = 5;

const createEmptyGrid = (): TGridState =>
    Array(GRID_SIZE).fill(null).map(() => Array(GRID_SIZE).fill(false));

const toggleCell = (grid: TGridState, row: number, col: number): TGridState => {
    const newGrid = grid.map(r => [...r]);
    const directions = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];

    directions.forEach(([dr, dc]) => {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
            newGrid[r][c] = !newGrid[r][c];
        }
    });

    return newGrid;
};

export const useLightsOut = () => {
    const [grid, setGrid] = useState<TGridState>(createEmptyGrid());
    const [moves, setMoves] = useState(0);
    const [isWon, setIsWon] = useState(false);

    const resetGame = useCallback(() => {
        let newGrid = createEmptyGrid();
        // Simulate random moves to ensure solvability
        for (let i = 0; i < 10; i++) {
            const r = Math.floor(Math.random() * GRID_SIZE);
            const c = Math.floor(Math.random() * GRID_SIZE);
            newGrid = toggleCell(newGrid, r, c);
        }
        setGrid(newGrid);
        setMoves(0);
        setIsWon(false);
    }, []);

    // Initialize game on mount
    useEffect(() => {
        resetGame();
    }, [resetGame]);

    const handleCellClick = useCallback((row: number, col: number) => {
        if (isWon) return;

        setGrid(prev => {
            const newGrid = toggleCell(prev, row, col);
            // Check win condition (all lights off)
            const allOff = newGrid.every(r => r.every(cell => !cell));
            if (allOff) setIsWon(true);
            return newGrid;
        });
        setMoves(prev => prev + 1);
    }, [isWon]);

    return { grid, moves, isWon, handleCellClick, resetGame };
};
