package pathfinding;

/**
 * Represents a single coordinate node on the 18x12 tactical grid map.
 * Implements Comparable for priority queue ordering within the A* algorithm.
 * Demonstrates Object-Oriented Encapsulation and custom sorting.
 */
public class Node implements Comparable<Node> {
    private final int x;
    private final int y;
    private boolean isObstacle;

    // A* Heuristic cost values: F = G + H
    private int gCost; // Exact distance from start node
    private int hCost; // Estimated Manhattan heuristic distance to target
    private int fCost; // Total evaluation cost
    private Node parent; // Pointer for reconstructing optimal path

    public Node(int x, int y, boolean isObstacle) {
        this.x = x;
        this.y = y;
        this.isObstacle = isObstacle;
        this.gCost = Integer.MAX_VALUE;
        this.hCost = 0;
        this.fCost = Integer.MAX_VALUE;
        this.parent = null;
    }

    public void calculateFCost() {
        this.fCost = this.gCost + this.hCost;
    }

    // Getters and Setters demonstrating encapsulation
    public int getX() { return x; }
    public int getY() { return y; }
    public boolean isObstacle() { return isObstacle; }
    public void setObstacle(boolean obstacle) { this.isObstacle = obstacle; }

    public int getGCost() { return gCost; }
    public void setGCost(int gCost) { 
        this.gCost = gCost; 
        calculateFCost();
    }

    public int getHCost() { return hCost; }
    public void setHCost(int hCost) { 
        this.hCost = hCost; 
        calculateFCost();
    }

    public int getFCost() { return fCost; }

    public Node getParent() { return parent; }
    public void setParent(Node parent) { this.parent = parent; }

    @Override
    public int compareTo(Node other) {
        if (this.fCost != other.fCost) {
            return Integer.compare(this.fCost, other.fCost);
        }
        // Tie-breaker: prefer node closer to target (lower H cost)
        return Integer.compare(this.hCost, other.hCost);
    }

    @Override
    public boolean equals(Object obj) {
        if (this == obj) return true;
        if (!(obj instanceof Node)) return false;
        Node other = (Node) obj;
        return this.x == other.x && this.y == other.y;
    }

    @Override
    public int hashCode() {
        return 31 * x + y;
    }

    @Override
    public String toString() {
        return "Node(" + x + "," + y + ", F=" + fCost + ")";
    }
}
