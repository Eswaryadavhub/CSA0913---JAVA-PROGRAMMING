import { describe, it, expect } from 'vitest';
import { findAStarPath, manhattanDistance } from '../algorithms/AStar';

describe('A* Pathfinding Algorithm (TC12)', () => {
  it('calculates accurate Manhattan distance heuristic', () => {
    const p1 = { x: 2, y: 3 };
    const p2 = { x: 7, y: 10 };
    // |2 - 7| + |3 - 10| = 5 + 7 = 12
    expect(manhattanDistance(p1, p2)).toBe(12);
  });

  it('finds optimal path from start to goal on open grid', () => {
    // 5x5 grid, all walkable (0)
    const grid = [
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0],
    ];
    const start = { x: 0, y: 0 };
    const goal = { x: 4, y: 4 };

    const result = findAStarPath(grid, start, goal);

    expect(result.pathFound).toBe(true);
    expect(result.path.length).toBe(9); // 4 steps right + 4 steps down + start = 9 waypoints
    expect(result.path[0]).toEqual(start);
    expect(result.path[result.path.length - 1]).toEqual(goal);
    expect(result.totalCost).toBe(8);
  });

  it('navigates around environmental obstacles intelligently', () => {
    // 5x5 grid with vertical obstacle wall at x=2, y=0..3
    const grid = [
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 1, 0, 0],
      [0, 0, 0, 0, 0], // Opening at (2, 4)
    ];
    const start = { x: 0, y: 0 };
    const goal = { x: 4, y: 0 };

    const result = findAStarPath(grid, start, goal, (val) => val === 0);

    expect(result.pathFound).toBe(true);
    // Verify none of the waypoints intersect obstacle (1)
    for (const point of result.path) {
      expect(grid[point.y][point.x]).not.toBe(1);
    }
    // Verifies it went down to the gap at y=4
    const usedGap = result.path.some((p) => p.x === 2 && p.y === 4);
    expect(usedGap).toBe(true);
  });

  it('detects when goal is completely unreachable and returns empty path', () => {
    // Goal is completely surrounded by obstacles (1)
    const grid = [
      [0, 0, 0, 0, 0],
      [0, 1, 1, 1, 0],
      [0, 1, 0, 1, 0], // (2, 2) is enclosed
      [0, 1, 1, 1, 0],
      [0, 0, 0, 0, 0],
    ];
    const start = { x: 0, y: 0 };
    const goal = { x: 2, y: 2 };

    const result = findAStarPath(grid, start, goal, (val) => val === 0);

    expect(result.pathFound).toBe(false);
    expect(result.path).toEqual([]);
  });

  it('records step-by-step exploration details for visualizer and viva demo', () => {
    const grid = [
      [0, 0, 0],
      [0, 1, 0],
      [0, 0, 0],
    ];
    const start = { x: 0, y: 0 };
    const goal = { x: 2, y: 2 };

    const result = findAStarPath(grid, start, goal, (val) => val === 0, true);

    expect(result.pathFound).toBe(true);
    expect(result.steps.length).toBeGreaterThan(0);
    expect(result.nodeDetails.size).toBeGreaterThan(0);
  });
});
