import { type BoardMatrix, type LevelConfig } from '../types';
import { LEVELS_DATA, type LevelData } from './levels-data';

const createEmptyBoard = (rows: number, cols: number): BoardMatrix =>
    Array(rows).fill(null).map(() => Array(cols).fill(0));

// Engine function to convert JSON data into playable LevelConfig
const createLevelFromData = (data: LevelData): LevelConfig => {
    return {
        id: data.id,
        rows: data.rows,
        cols: data.cols,
        boardSetup: (rows, cols) => {
            const board = createEmptyBoard(rows, cols);
            data.solution.forEach(p => {
                const { shape, row, col } = p;
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
        pieces: data.solution.map(p => ({
            id: p.pieceId,
            shape: p.shape,
            color: p.color,
            position: null // Start in inventory
        }))
    };
};

export const LEVELS: LevelConfig[] = LEVELS_DATA.map(createLevelFromData);


