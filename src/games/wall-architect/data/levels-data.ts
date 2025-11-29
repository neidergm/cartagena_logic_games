export interface SolutionPlacementData {
    pieceId: string;
    shape: number[][];
    color: string;
    row: number;
    col: number;
}

export interface LevelData {
    id: number;
    rows: number;
    cols: number;
    solution: SolutionPlacementData[];
}

// Common Shapes (Inlined for JSON purity, or could be referenced if we had a shapes table)
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

export const LEVELS_DATA: LevelData[] = [
    // Level 1: Simple 2x3 Rectangle
    {
        id: 1,
        rows: 8,
        cols: 8,
        solution: [
            { pieceId: 'p1_1', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-600', row: 3, col: 3 },
            { pieceId: 'p1_2', shape: [[1], [1]], color: 'bg-amber-700', row: 3, col: 5 } // Vertical Bar 1x2 to fill (3,5) and (4,5)
        ]
    },
    // Level 2: "L" Shape Crack
    {
        id: 2,
        rows: 8,
        cols: 8,
        solution: [
            { pieceId: 'p2_1', shape: SHAPES.BAR_3x1, color: 'bg-amber-600', row: 2, col: 3 },
            { pieceId: 'p2_2', shape: SHAPES.BAR_3x1, color: 'bg-amber-700', row: 3, col: 3 },
            { pieceId: 'p2_3', shape: SHAPES.BAR_3x1, color: 'bg-amber-800', row: 4, col: 3 },
        ]
    },
    // Level 3: The "Podium"
    {
        id: 3,
        rows: 8,
        cols: 8,
        solution: [
            // Square 2x2
            { pieceId: 'p3_1', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-600', row: 2, col: 2 },
            // T-shape (3x2)
            { pieceId: 'p3_3', shape: [[1, 1, 1], [0, 1, 0]], color: 'bg-amber-800', row: 2, col: 4 },
            // Long Bar (4x1)
            { pieceId: 'p3_2', shape: SHAPES.BAR_4x1, color: 'bg-amber-700', row: 4, col: 2 },
        ]
    },
    // Level 4: "The Bridge"
    {
        id: 4,
        rows: 10,
        cols: 10,
        solution: [
            // Left Island
            { pieceId: 'p4_1', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-600', row: 4, col: 1 },
            // Right Island
            { pieceId: 'p4_2', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-700', row: 4, col: 7 },
            // Bridge (Bar 4x1) - spanning across?
            // Let's connect them.
            { pieceId: 'p4_3', shape: SHAPES.BAR_4x1, color: 'bg-amber-800', row: 4, col: 3 },
            // T-shape somewhere
            { pieceId: 'p4_4', shape: [[1, 1, 1], [0, 1, 0]], color: 'bg-amber-900', row: 5, col: 3 },
        ]
    },
    // Level 5: "The Monolith" (5x4 block)
    {
        id: 5,
        rows: 10,
        cols: 10,
        solution: [
            { pieceId: 'p5_1', shape: SHAPES.BAR_1x5, color: 'bg-amber-500', row: 3, col: 3 },
            { pieceId: 'p5_2', shape: SHAPES.BAR_1x5, color: 'bg-amber-600', row: 3, col: 4 },
            { pieceId: 'p5_3', shape: SHAPES.BAR_1x5, color: 'bg-amber-700', row: 3, col: 5 },
            { pieceId: 'p5_4', shape: SHAPES.BAR_1x5, color: 'bg-amber-800', row: 3, col: 6 },
        ]
    },
    // Level 6: "The Block" (5x5 Square)
    {
        id: 6,
        rows: 10,
        cols: 10,
        solution: [
            { pieceId: 'p6_1', shape: SHAPES.SQUARE_3x3, color: 'bg-amber-500', row: 1, col: 1 },
            { pieceId: 'p6_2', shape: SHAPES.BAR_5x1, color: 'bg-amber-600', row: 0, col: 0 },
            { pieceId: 'p6_3', shape: SHAPES.BAR_5x1, color: 'bg-amber-700', row: 4, col: 0 },
            { pieceId: 'p6_4', shape: SHAPES.BAR_1x3, color: 'bg-amber-800', row: 1, col: 0 },
            { pieceId: 'p6_5', shape: SHAPES.BAR_1x3, color: 'bg-amber-900', row: 1, col: 4 },
        ]
    },
    // Level 7: "The Frame" (6x6 with 2x2 hole)
    {
        id: 7,
        rows: 10,
        cols: 10,
        solution: [
            { pieceId: 'p7_1', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-500', row: 0, col: 0 },
            { pieceId: 'p7_2', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-600', row: 0, col: 2 },
            { pieceId: 'p7_3', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-700', row: 0, col: 4 },
            { pieceId: 'p7_4', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-800', row: 2, col: 0 },
            { pieceId: 'p7_5', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-900', row: 2, col: 4 },
            { pieceId: 'p7_6', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-500', row: 4, col: 0 },
            { pieceId: 'p7_7', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-600', row: 4, col: 2 },
            { pieceId: 'p7_8', shape: SHAPES.SQUARE_2x2, color: 'bg-amber-700', row: 4, col: 4 },
        ]
    },
    // Level 8: "The Checkerboard"
    {
        id: 8,
        rows: 10,
        cols: 10,
        solution: [
            { pieceId: 'p8_1', shape: SHAPES.O_4, color: 'bg-amber-500', row: 0, col: 0 },
            { pieceId: 'p8_2', shape: SHAPES.O_4, color: 'bg-amber-600', row: 0, col: 2 },
            { pieceId: 'p8_3', shape: SHAPES.O_4, color: 'bg-amber-700', row: 0, col: 4 },
            { pieceId: 'p8_4', shape: SHAPES.O_4, color: 'bg-amber-800', row: 2, col: 0 },
            { pieceId: 'p8_5', shape: SHAPES.O_4, color: 'bg-amber-900', row: 2, col: 2 },
            { pieceId: 'p8_6', shape: SHAPES.O_4, color: 'bg-amber-500', row: 2, col: 4 },
            { pieceId: 'p8_7', shape: SHAPES.O_4, color: 'bg-amber-600', row: 4, col: 0 },
            { pieceId: 'p8_8', shape: SHAPES.O_4, color: 'bg-amber-700', row: 4, col: 2 },
            { pieceId: 'p8_9', shape: SHAPES.O_4, color: 'bg-amber-800', row: 4, col: 4 },
        ]
    },
    // Level 9: "The Towers"
    {
        id: 9,
        rows: 12,
        cols: 12,
        solution: [
            { pieceId: 'p9_1', shape: SHAPES.O_4, color: 'bg-amber-500', row: 0, col: 0 },
            { pieceId: 'p9_2', shape: SHAPES.O_4, color: 'bg-amber-600', row: 0, col: 2 },
            { pieceId: 'p9_3', shape: SHAPES.O_4, color: 'bg-amber-700', row: 0, col: 4 },
            { pieceId: 'p9_4', shape: SHAPES.O_4, color: 'bg-amber-800', row: 0, col: 6 },
            { pieceId: 'p9_5', shape: SHAPES.O_4, color: 'bg-amber-900', row: 2, col: 0 },
            { pieceId: 'p9_6', shape: SHAPES.O_4, color: 'bg-amber-500', row: 2, col: 2 },
            { pieceId: 'p9_7', shape: SHAPES.O_4, color: 'bg-amber-600', row: 2, col: 4 },
            { pieceId: 'p9_8', shape: SHAPES.O_4, color: 'bg-amber-700', row: 2, col: 6 },
            { pieceId: 'p9_9', shape: SHAPES.O_4, color: 'bg-amber-800', row: 4, col: 2 },
            { pieceId: 'p9_10', shape: SHAPES.O_4, color: 'bg-amber-900', row: 4, col: 4 },
        ]
    },
    // Level 10: "The Big Wall"
    {
        id: 10,
        rows: 12,
        cols: 12,
        solution: [
            { pieceId: 'p10_1', shape: SHAPES.BAR_5x1, color: 'bg-amber-500', row: 0, col: 0 },
            { pieceId: 'p10_2', shape: SHAPES.BAR_5x1, color: 'bg-amber-600', row: 1, col: 0 },
            { pieceId: 'p10_3', shape: SHAPES.BAR_5x1, color: 'bg-amber-700', row: 2, col: 0 },
            { pieceId: 'p10_4', shape: SHAPES.BAR_5x1, color: 'bg-amber-800', row: 3, col: 0 },
            { pieceId: 'p10_5', shape: SHAPES.BAR_5x1, color: 'bg-amber-900', row: 4, col: 0 },
            { pieceId: 'p10_6', shape: SHAPES.BAR_5x1, color: 'bg-amber-500', row: 0, col: 5 },
            { pieceId: 'p10_7', shape: SHAPES.BAR_5x1, color: 'bg-amber-600', row: 1, col: 5 },
            { pieceId: 'p10_8', shape: SHAPES.BAR_5x1, color: 'bg-amber-700', row: 2, col: 5 },
            { pieceId: 'p10_9', shape: SHAPES.BAR_5x1, color: 'bg-amber-800', row: 3, col: 5 },
            { pieceId: 'p10_10', shape: SHAPES.BAR_5x1, color: 'bg-amber-900', row: 4, col: 5 },
        ]
    }
];
