package pathfinding;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.PriorityQueue;
import java.util.Set;

/**
 * Intelligent A* Pathfinding implementation for Autonomous Enemy Creep Navigation.
 * Uses the Manhattan Distance Heuristic: H(n) = |x1 - x2| + |y1 - y2|.
 * Operates on the 18x12 grid to dynamically route around environmental crags and towers.
 * Course: CSA0913 – Programming in Java.
 */
public class AStarPathfinder {
    private final int cols;
    private final int rows;
    private final Node[][] grid;

    public AStarPathfinder(int cols, int rows) {
        this.cols = cols;
        this.rows = rows;
        this.grid = new Node[cols][rows];
        resetGrid();
    }

    /**
     * Initializes the grid nodes.
     */
    public void resetGrid() {
        for (int x = 0; x < cols; x++) {
            for (int y = 0; y < rows; y++) {
                grid[x][y] = new Node(x, y, false);
            }
        }
    }

    /**
     * Toggles an obstacle at (x, y), e.g., when a tower or barrier is placed.
     */
    public void setObstacle(int x, int y, boolean isObstacle) {
        if (isValidCoordinate(x, y)) {
            grid[x][y].setObstacle(isObstacle);
        }
    }

    public boolean isObstacle(int x, int y) {
        if (isValidCoordinate(x, y)) {
            return grid[x][y].isObstacle();
        }
        return true;
    }

    /**
     * Computes the mathematically optimal shortest path from (startX, startY) to (targetX, targetY).
     * Returns an ordered List of Nodes from start to target, or an empty list if blocked.
     */
    public List<Node> findPath(int startX, int startY, int targetX, int targetY) {
        if (!isValidCoordinate(startX, startY) || !isValidCoordinate(targetX, targetY)) {
            return Collections.emptyList();
        }

        // Reset costs for fresh path calculation
        for (int x = 0; x < cols; x++) {
            for (int y = 0; y < rows; y++) {
                grid[x][y].setGCost(Integer.MAX_VALUE);
                grid[x][y].setHCost(0);
                grid[x][y].setParent(null);
            }
        }

        Node startNode = grid[startX][startY];
        Node targetNode = grid[targetX][targetY];

        PriorityQueue<Node> openSet = new PriorityQueue<>();
        Set<Node> closedSet = new HashSet<>();

        startNode.setGCost(0);
        startNode.setHCost(calculateManhattanDistance(startX, startY, targetX, targetY));
        openSet.add(startNode);

        // Cardinal directions: Up, Down, Left, Right
        int[][] directions = { {0, -1}, {0, 1}, {-1, 0}, {1, 0} };

        while (!openSet.isEmpty()) {
            Node current = openSet.poll();

            // Goal reached: reconstruct shortest path
            if (current.getX() == targetNode.getX() && current.getY() == targetNode.getY()) {
                return reconstructPath(current);
            }

            closedSet.add(current);

            for (int[] dir : directions) {
                int neighborX = current.getX() + dir[0];
                int neighborY = current.getY() + dir[1];

                if (!isValidCoordinate(neighborX, neighborY)) continue;

                Node neighbor = grid[neighborX][neighborY];

                if (neighbor.isObstacle() || closedSet.contains(neighbor)) {
                    continue;
                }

                int tentativeGCost = current.getGCost() + 1; // Uniform orthogonal step cost = 1

                if (tentativeGCost < neighbor.getGCost()) {
                    neighbor.setParent(current);
                    neighbor.setGCost(tentativeGCost);
                    neighbor.setHCost(calculateManhattanDistance(neighborX, neighborY, targetX, targetY));

                    if (!openSet.contains(neighbor)) {
                        openSet.add(neighbor);
                    }
                }
            }
        }

        // No valid path exists (e.g. maze completely barricaded)
        return Collections.emptyList();
    }

    /**
     * Manhattan heuristic: |x1 - x2| + |y1 - y2|
     */
    public int calculateManhattanDistance(int x1, int y1, int x2, int y2) {
        return Math.abs(x1 - x2) + Math.abs(y1 - y2);
    }

    private List<Node> reconstructPath(Node targetNode) {
        List<Node> path = new ArrayList<>();
        Node current = targetNode;
        while (current != null) {
            path.add(current);
            current = current.getParent();
        }
        Collections.reverse(path);
        return path;
    }

    public boolean isValidCoordinate(int x, int y) {
        return x >= 0 && x < cols && y >= 0 && y < rows;
    }

    public int getCols() { return cols; }
    public int getRows() { return rows; }
}
