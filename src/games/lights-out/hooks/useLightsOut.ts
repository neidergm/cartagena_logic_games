import { useState, useCallback, useEffect } from 'react';
import { type TGridState } from '../types/game';
import { createEmptyGrid, createLevelFromData, toggleCell } from '../levelsEngine';

const GRID_SIZE = 5;

export const useLightsOut = (gridSize = GRID_SIZE, complexity = 10) => {
    const [grid, setGrid] = useState<TGridState>(createEmptyGrid(gridSize));
    const [moves, setMoves] = useState(0);
    const [isWon, setIsWon] = useState(false);

    const [timeElapsed, setTimeElapsed] = useState(0);

    const resetGame = useCallback(() => {
        const newGrid = createLevelFromData(gridSize, complexity);
        setGrid(newGrid);
        setMoves(0);
        setTimeElapsed(0);
        setIsWon(false);
    }, [gridSize, complexity]);

    // Initialize game on mount or when config changes
    useEffect(() => {
        resetGame();
    }, [resetGame]);

    // Timer Effect
    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (!isWon) {
            interval = setInterval(() => {
                setTimeElapsed(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isWon]);

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

    return { grid, moves, timeElapsed, isWon, handleCellClick, resetGame };
};
