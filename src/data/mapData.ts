import { CellType } from './gameTypes';
import { Point } from '../algorithms/AStar';

export const GRID_COLS = 18;
export const GRID_ROWS = 12;
export const CELL_SIZE = 50;
export const CANVAS_WIDTH = GRID_COLS * CELL_SIZE; // 900px
export const CANVAS_HEIGHT = GRID_ROWS * CELL_SIZE; // 600px

export const DEFAULT_SPAWN_POINT: Point = { x: 0, y: 2 };
export const DEFAULT_BASE_POINT: Point = { x: 17, y: 9 };

/**
 * 18 cols x 12 rows Grid Map
 * 0 = WALKABLE
 * 1 = OBSTACLE (Rocks, ruins, trees)
 * 2 = TOWER_ZONE (Prepared defensive platform)
 * 3 = ENEMY_PATH (Roadway)
 * 4 = BASE (HQ Defense Objective)
 * 5 = SPAWN (Enemy Invasion Portal)
 */
export const DEFAULT_GRID_MAP: number[][] = [
  // Col: 0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17
  /*0*/ [ 0, 0, 1, 1, 0, 0, 2, 0, 0, 1, 0, 0, 2, 0, 0, 1, 0, 0 ],
  /*1*/ [ 0, 2, 1, 0, 0, 2, 3, 2, 0, 1, 0, 2, 3, 2, 0, 0, 2, 0 ],
  /*2*/ [ 5, 3, 3, 3, 3, 3, 3, 0, 0, 0, 0, 0, 3, 0, 0, 0, 0, 0 ],
  /*3*/ [ 0, 2, 0, 0, 2, 0, 0, 0, 2, 0, 0, 0, 3, 2, 1, 1, 0, 0 ],
  /*4*/ [ 0, 1, 0, 0, 1, 0, 2, 3, 3, 3, 3, 3, 3, 0, 2, 0, 0, 0 ],
  /*5*/ [ 0, 1, 0, 0, 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 1, 0, 0, 0 ],
  /*6*/ [ 0, 0, 2, 3, 3, 3, 3, 3, 0, 1, 1, 2, 0, 0, 1, 0, 2, 0 ],
  /*7*/ [ 0, 0, 2, 3, 2, 0, 0, 0, 0, 0, 2, 3, 3, 3, 3, 3, 3, 0 ],
  /*8*/ [ 0, 0, 0, 3, 2, 0, 1, 0, 0, 0, 2, 3, 2, 0, 0, 0, 3, 2 ],
  /*9*/ [ 0, 1, 0, 3, 3, 3, 3, 3, 3, 3, 3, 3, 0, 0, 1, 0, 3, 4 ],
  /*10*/[ 0, 1, 0, 0, 2, 0, 0, 2, 0, 0, 2, 0, 0, 0, 1, 0, 2, 0 ],
  /*11*/[ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0 ],
];

export function getCellCenter(gridPoint: Point): Point {
  return {
    x: gridPoint.x * CELL_SIZE + CELL_SIZE / 2,
    y: gridPoint.y * CELL_SIZE + CELL_SIZE / 2,
  };
}

export function pixelToGrid(pixelX: number, pixelY: number): Point {
  return {
    x: Math.floor(pixelX / CELL_SIZE),
    y: Math.floor(pixelY / CELL_SIZE),
  };
}
