import { type BoardMatrix, type LevelConfig, type LevelData } from './types';
import { getShape } from './utils';

const createEmptyBoard = (rows: number, cols: number): BoardMatrix =>
    Array(rows).fill(null).map(() => Array(cols).fill(0));

// Engine function to convert JSON data into playable LevelConfig
export const createLevelFromData = (data: LevelData): LevelConfig => {
    return {
        id: data.id,
        rows: data.rows,
        cols: data.cols,
        boardSetup: (rows, cols) => {
            const board = createEmptyBoard(rows, cols);
            data.solution.forEach(p => {
                const { shape: s, row, col } = p;
                const shape = getShape(s as never);
                for (let i = 0; i < shape.length; i++) {
                    for (let j = 0; j < shape[i].length; j++) {
                        if (shape[i][j] === 1) {
                            if (row + i < rows && col + j < cols) {
                                board[row + i][col + j] = 1;
                            }
                        }
                    }
                }
            });
            return board;
        },
        pieces: data.solution.map((p, i) => ({
            id: `p${data.id}_${i}`,
            shape: getShape(p.shape as never),
            position: null
        }))
    };
};


