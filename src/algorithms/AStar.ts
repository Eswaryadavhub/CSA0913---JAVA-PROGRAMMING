export interface Point {
  x: number;
  y: number;
}

export interface AStarNode {
  x: number;
  y: number;
  walkable: boolean;
  gCost: number; // Cost from start node to current node
  hCost: number; // Heuristic estimated cost to target node
  fCost: number; // gCost + hCost
  parent: AStarNode | null;
  inOpenSet: boolean;
  inClosedSet: boolean;
}

export interface AStarStep {
  currentNode: Point;
  openSet: Point[];
  closedSet: Point[];
  neighborsExamined: Point[];
  description: string;
}

export interface AStarResult {
  path: Point[];
  pathFound: boolean;
  visitedNodesCount: number;
  totalCost: number;
  openSetSnapshot: Point[];
  closedSetSnapshot: Point[];
  nodeDetails: Map<string, { g: number; h: number; f: number; parent: Point | null }>;
  steps: AStarStep[];
}

/**
 * Calculates Manhattan Distance heuristic between two points:
 * H(n) = |x1 - x2| + |y1 - y2|
 */
export function manhattanDistance(a: Point, b: Point): number {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
}

/**
 * Checks if a point is within grid boundaries
 */
export function isWithinBounds(x: number, y: number, width: number, height: number): boolean {
  return x >= 0 && x < width && y >= 0 && y < height;
}

/**
 * Creates a unique string key for a point: "x,y"
 */
export function pointKey(p: Point): string {
  return `${p.x},${p.y}`;
}

/**
 * Full A* Pathfinding implementation
 * 
 * @param grid 2D array representing the map (dimensions: height x width)
 * @param start Start point (Spawn)
 * @param target Target point (Base)
 * @param isWalkableFn Function to determine if a cell is walkable
 * @param recordSteps Whether to record step-by-step history for visualization
 */
export function findAStarPath(
  grid: number[][],
  start: Point,
  target: Point,
  isWalkableFn: (cellValue: number, x: number, y: number) => boolean = (val) => val === 0 || val === 3 || val === 4 || val === 5,
  recordSteps: boolean = false
): AStarResult {
  const height = grid.length;
  const width = grid[0]?.length || 0;

  if (width === 0 || height === 0) {
    return {
      path: [],
      pathFound: false,
      visitedNodesCount: 0,
      totalCost: 0,
      openSetSnapshot: [],
      closedSetSnapshot: [],
      nodeDetails: new Map(),
      steps: [],
    };
  }

  // Initialize node grid
  const nodes: AStarNode[][] = [];
  for (let y = 0; y < height; y++) {
    const row: AStarNode[] = [];
    for (let x = 0; x < width; x++) {
      const walkable = isWalkableFn(grid[y][x], x, y);
      row.push({
        x,
        y,
        walkable,
        gCost: Infinity,
        hCost: 0,
        fCost: Infinity,
        parent: null,
        inOpenSet: false,
        inClosedSet: false,
      });
    }
    nodes.push(row);
  }

  // Ensure start and target are within bounds
  if (!isWithinBounds(start.x, start.y, width, height) || !isWithinBounds(target.x, target.y, width, height)) {
    return {
      path: [],
      pathFound: false,
      visitedNodesCount: 0,
      totalCost: 0,
      openSetSnapshot: [],
      closedSetSnapshot: [],
      nodeDetails: new Map(),
      steps: [],
    };
  }

  const startNode = nodes[start.y][start.x];
  const targetNode = nodes[target.y][target.x];

  startNode.gCost = 0;
  startNode.hCost = manhattanDistance(start, target);
  startNode.fCost = startNode.gCost + startNode.hCost;
  startNode.inOpenSet = true;

  const openSet: AStarNode[] = [startNode];
  const closedSet: Set<string> = new Set();
  const nodeDetails = new Map<string, { g: number; h: number; f: number; parent: Point | null }>();
  const steps: AStarStep[] = [];

  // Record initial node
  nodeDetails.set(pointKey(start), {
    g: 0,
    h: startNode.hCost,
    f: startNode.fCost,
    parent: null,
  });

  // Cardinal 4-direction neighbors: Up, Right, Down, Left
  const directions: Point[] = [
    { x: 0, y: -1 }, // Up
    { x: 1, y: 0 },  // Right
    { x: 0, y: 1 },  // Down
    { x: -1, y: 0 }, // Left
  ];

  let pathFound = false;

  while (openSet.length > 0) {
    // Find node with lowest F cost in openSet. If tie, select lowest H cost.
    let lowestIndex = 0;
    for (let i = 1; i < openSet.length; i++) {
      if (
        openSet[i].fCost < openSet[lowestIndex].fCost ||
        (openSet[i].fCost === openSet[lowestIndex].fCost && openSet[i].hCost < openSet[lowestIndex].hCost)
      ) {
        lowestIndex = i;
      }
    }

    const current = openSet.splice(lowestIndex, 1)[0];
    current.inOpenSet = false;
    current.inClosedSet = true;
    closedSet.add(pointKey(current));

    // Check if reached destination
    if (current.x === target.x && current.y === target.y) {
      pathFound = true;
      if (recordSteps) {
        steps.push({
          currentNode: { x: current.x, y: current.y },
          openSet: openSet.map((n) => ({ x: n.x, y: n.y })),
          closedSet: Array.from(closedSet).map((k) => {
            const [cx, cy] = k.split(',').map(Number);
            return { x: cx, y: cy };
          }),
          neighborsExamined: [],
          description: `Goal reached at (${target.x}, ${target.y}) with total G-cost = ${current.gCost}!`,
        });
      }
      break;
    }

    const neighborsExamined: Point[] = [];

    // Explore 4-direction neighbors
    for (const dir of directions) {
      const nx = current.x + dir.x;
      const ny = current.y + dir.y;

      if (!isWithinBounds(nx, ny, width, height)) continue;

      const neighbor = nodes[ny][nx];

      // Skip non-walkable or already evaluated nodes
      if (!neighbor.walkable || neighbor.inClosedSet) continue;

      neighborsExamined.push({ x: nx, y: ny });

      // Edge cost between adjacent cardinal cells is 1 (or 10 in integer units)
      const tentativeGCost = current.gCost + 1;

      let isBetterPath = false;

      if (!neighbor.inOpenSet) {
        // First time discovering this neighbor
        neighbor.hCost = manhattanDistance({ x: nx, y: ny }, target);
        neighbor.inOpenSet = true;
        openSet.push(neighbor);
        isBetterPath = true;
      } else if (tentativeGCost < neighbor.gCost) {
        // Found a cheaper path to this neighbor
        isBetterPath = true;
      }

      if (isBetterPath) {
        neighbor.parent = current;
        neighbor.gCost = tentativeGCost;
        neighbor.fCost = neighbor.gCost + neighbor.hCost;

        nodeDetails.set(pointKey({ x: nx, y: ny }), {
          g: neighbor.gCost,
          h: neighbor.hCost,
          f: neighbor.fCost,
          parent: { x: current.x, y: current.y },
        });
      }
    }

    if (recordSteps) {
      steps.push({
        currentNode: { x: current.x, y: current.y },
        openSet: openSet.map((n) => ({ x: n.x, y: n.y })),
        closedSet: Array.from(closedSet).map((k) => {
          const [cx, cy] = k.split(',').map(Number);
          return { x: cx, y: cy };
        }),
        neighborsExamined,
        description: `Examined node (${current.x}, ${current.y}) with F=${current.fCost} (G=${current.gCost}, H=${current.hCost}). Evaluated ${neighborsExamined.length} walkable neighbors.`,
      });
    }
  }

  // Reconstruct path from target back to start
  const path: Point[] = [];
  if (pathFound) {
    let curr: AStarNode | null = targetNode;
    while (curr !== null) {
      path.unshift({ x: curr.x, y: curr.y });
      curr = curr.parent;
    }
  }

  const openSetSnapshot: Point[] = openSet.map((n) => ({ x: n.x, y: n.y }));
  const closedSetSnapshot: Point[] = Array.from(closedSet).map((k) => {
    const [cx, cy] = k.split(',').map(Number);
    return { x: cx, y: cy };
  });

  return {
    path,
    pathFound,
    visitedNodesCount: closedSet.size,
    totalCost: targetNode.gCost === Infinity ? 0 : targetNode.gCost,
    openSetSnapshot,
    closedSetSnapshot,
    nodeDetails,
    steps,
  };
}
