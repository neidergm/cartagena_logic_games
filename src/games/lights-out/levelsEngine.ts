import type { TGridState } from "./types/game";

export const createEmptyGrid = (size: number): TGridState => {
    const numericSize = Number(size);
    return Array(numericSize).fill(null).map(() => Array(numericSize).fill(false));
};

export const toggleCell = (grid: TGridState, row: number, col: number): TGridState => {
    const size = grid.length;
    const newGrid = grid.map(r => [...r]);
    const directions = [[0, 0], [0, 1], [0, -1], [1, 0], [-1, 0]];

    directions.forEach(([dr, dc]) => {
        const r = row + dr;
        const c = col + dc;
        if (r >= 0 && r < size && c >= 0 && c < size) {
            newGrid[r][c] = !newGrid[r][c];
        }
    });

    return newGrid;
};

export const createLevelFromData = (gridSize: number, complexity: number): TGridState => {
    let newGrid = createEmptyGrid(gridSize);
    // Simulate random moves to ensure solvability
    for (let i = 0; i < complexity; i++) {
        const r = Math.floor(Math.random() * gridSize);
        const c = Math.floor(Math.random() * gridSize);
        newGrid = toggleCell(newGrid, r, c);
    }

    return newGrid;
};