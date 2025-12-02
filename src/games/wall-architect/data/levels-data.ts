export interface SolutionPlacementData {
    shape: number[][] | string;
    row: number;
    col: number;
}

export interface LevelData {
    id: number;
    rows: number;
    cols: number;
    solution: SolutionPlacementData[];
}


export const LEVELS_DATA_OLD: LevelData[] = [
    {
        "id": 1,
        "rows": 9,
        "cols": 9,
        "solution": [
            { "shape": "SQUARE_2x2", "row": 3, "col": 3 },
            { "shape": "SQUARE_2x2", "row": 3, "col": 5 },
            { "shape": "BAR_2x1", "row": 5, "col": 4 }
        ]
    },
    {
        "id": 2,
        "rows": 10,
        "cols": 10,
        "solution": [
            { "shape": "T_4", "row": 4, "col": 4 },
            { "shape": "L_4", "row": 5, "col": 3 },
            { "shape": "BAR_3x1", "row": 4, "col": 7 },
            { "shape": "SQUARE_2x2", "row": 2, "col": 4 }
        ]
    },
    {
        "id": 3,
        "rows": 10,
        "cols": 12,
        "solution": [
            { "shape": "BAR_1x5", "row": 2, "col": 5 },
            { "shape": "BAR_3x1", "row": 2, "col": 6 },
            { "shape": "BAR_3x1", "row": 6, "col": 2 },
            { "shape": "SQUARE_2x2", "row": 4, "col": 6 }
        ]
    },
    {
        "id": 4,
        "rows": 11,
        "cols": 11,
        "solution": [
            { "shape": "S_4", "row": 5, "col": 5 },
            { "shape": "Z_4", "row": 6, "col": 6 },
            { "shape": "L_3", "row": 4, "col": 6 },
            { "shape": "BAR_2x1", "row": 7, "col": 4 },
            { "shape": "SQUARE_2x2", "row": 5, "col": 3 }
        ]
    },
    {
        "id": 5,
        "rows": 12,
        "cols": 14,
        "solution": [
            { "shape": "BAR_5x1", "row": 6, "col": 4 },
            { "shape": "BAR_1x5", "row": 2, "col": 4 },
            { "shape": "SQUARE_3x3", "row": 3, "col": 5 },
            { "shape": "T_4", "row": 6, "col": 9 },
            { "shape": "I_4", "row": 2, "col": 8 }
        ]
    },
    {
        "id": 6,
        "rows": 13,
        "cols": 13,
        "solution": [
            { "shape": "L_4", "row": 4, "col": 4 },
            { "shape": "L_4", "row": 6, "col": 5 },
            { "shape": "L_4", "row": 8, "col": 6 },
            { "shape": "BAR_1x3", "row": 4, "col": 6 },
            { "shape": "SQUARE_2x2", "row": 9, "col": 4 },
            { "shape": "Z_4", "row": 3, "col": 3 }
        ]
    },
    {
        "id": 7,
        "rows": 14,
        "cols": 14,
        "solution": [
            { "shape": "SQUARE_3x3", "row": 5, "col": 5 },
            { "shape": "T_4", "row": 4, "col": 6 },
            { "shape": "J_4", "row": 6, "col": 4 },
            { "shape": "L_3", "row": 8, "col": 6 },
            { "shape": "BAR_4x1", "row": 5, "col": 8 },
            { "shape": "S_4", "row": 3, "col": 8 },
            { "shape": "SQUARE_2x2", "row": 7, "col": 3 }
        ]
    },
    {
        "id": 8,
        "rows": 15,
        "cols": 15,
        "solution": [
            { "shape": "BAR_1x5", "row": 4, "col": 4 },
            { "shape": "BAR_5x1", "row": 4, "col": 5 },
            { "shape": "BAR_1x5", "row": 4, "col": 9 },
            { "shape": "BAR_3x1", "row": 9, "col": 5 },
            { "shape": "SQUARE_2x2", "row": 8, "col": 4 },
            { "shape": "L_3", "row": 8, "col": 8 },
            { "shape": "T_4", "row": 3, "col": 7 },
            { "shape": "Z_4", "row": 9, "col": 7 }
        ]
    },
    {
        "id": 9,
        "rows": 16,
        "cols": 14,
        "solution": [
            { "shape": "I_4", "row": 5, "col": 5 },
            { "shape": "I_4", "row": 6, "col": 5 },
            { "shape": "SQUARE_2x2", "row": 5, "col": 9 },
            { "shape": "SQUARE_2x2", "row": 7, "col": 5 },
            { "shape": "J_4", "row": 4, "col": 7 },
            { "shape": "L_4", "row": 7, "col": 7 },
            { "shape": "S_4", "row": 3, "col": 5 },
            { "shape": "Z_4", "row": 8, "col": 8 },
            { "shape": "BAR_2x1", "row": 6, "col": 4 },
            { "shape": "BAR_2x1", "row": 6, "col": 11 }
        ]
    },
    {
        "id": 10,
        "rows": 16,
        "cols": 16,
        "solution": [
            { "shape": "SQUARE_3x3", "row": 7, "col": 7 },
            { "shape": "BAR_1x5", "row": 2, "col": 8 },
            { "shape": "T_4", "row": 6, "col": 7 },
            { "shape": "BAR_1x5", "row": 10, "col": 8 },
            { "shape": "S_4", "row": 10, "col": 6 },
            { "shape": "BAR_5x1", "row": 8, "col": 2 },
            { "shape": "L_3", "row": 7, "col": 6 },
            { "shape": "BAR_5x1", "row": 8, "col": 10 },
            { "shape": "J_4", "row": 7, "col": 10 },
            { "shape": "SQUARE_2x2", "row": 3, "col": 6 },
            { "shape": "Z_4", "row": 11, "col": 9 },
            { "shape": "BAR_1x3", "row": 12, "col": 7 }
        ]
    }
]