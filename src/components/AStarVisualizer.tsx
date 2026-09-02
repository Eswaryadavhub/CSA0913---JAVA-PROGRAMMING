import React, { useState, useEffect, useMemo } from 'react';
import {
  findAStarPath,
  Point,
  AStarResult,
  AStarStep,
  pointKey,
  manhattanDistance,
} from '../algorithms/AStar';
import { Play, Pause, RotateCcw, Compass, Info, ArrowRight, Eye, Grid } from 'lucide-react';

const DEMO_COLS = 14;
const DEMO_ROWS = 9;

export const AStarVisualizer: React.FC = () => {
  // Grid coordinates for start and target in demo
  const [startPoint] = useState<Point>({ x: 1, y: 4 });
  const [targetPoint] = useState<Point>({ x: 12, y: 4 });

  // Custom obstacle matrix for visualizer
  const [obstacles, setObstacles] = useState<Set<string>>(() => {
    const init = new Set<string>();
    // Add default obstacle wall with opening
    init.add(pointKey({ x: 5, y: 2 }));
    init.add(pointKey({ x: 5, y: 3 }));
    init.add(pointKey({ x: 5, y: 4 }));
    init.add(pointKey({ x: 5, y: 5 }));
    init.add(pointKey({ x: 8, y: 3 }));
    init.add(pointKey({ x: 8, y: 4 }));
    init.add(pointKey({ x: 8, y: 5 }));
    init.add(pointKey({ x: 8, y: 6 }));
    return init;
  });

  const [selectedNode, setSelectedNode] = useState<Point | null>({ x: 5, y: 1 });
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(300); // ms per step

  // Recalculate A* path on obstacle changes
  const astarResult: AStarResult = useMemo(() => {
    const grid: number[][] = [];
    for (let y = 0; y < DEMO_ROWS; y++) {
      const row: number[] = [];
      for (let x = 0; x < DEMO_COLS; x++) {
        row.push(obstacles.has(pointKey({ x, y })) ? 1 : 0);
      }
      grid.push(row);
    }

    return findAStarPath(
      grid,
      startPoint,
      targetPoint,
      (val) => val === 0,
      true // record steps
    );
  }, [obstacles, startPoint, targetPoint]);

  // Handle auto playback
  useEffect(() => {
    if (!isPlaying) return;
    if (astarResult.steps.length === 0) return;

    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev + 1 >= astarResult.steps.length) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, playbackSpeed);

    return () => clearInterval(timer);
  }, [isPlaying, playbackSpeed, astarResult.steps.length]);

  const currentStep: AStarStep | null =
    astarResult.steps.length > 0 && currentStepIndex < astarResult.steps.length
      ? astarResult.steps[currentStepIndex]
      : null;

  const toggleObstacle = (x: number, y: number) => {
    if ((x === startPoint.x && y === startPoint.y) || (x === targetPoint.x && y === targetPoint.y)) {
      return;
    }
    const key = pointKey({ x, y });
    const next = new Set(obstacles);
    if (next.has(key)) {
      next.delete(key);
    } else {
      next.add(key);
    }
    setObstacles(next);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const selectedNodeDetails = selectedNode
    ? astarResult.nodeDetails.get(pointKey(selectedNode))
    : null;

  const isFinalPathCell = (x: number, y: number) => {
    return astarResult.path.some((p) => p.x === x && p.y === y);
  };

  const isInClosedSetAtStep = (x: number, y: number) => {
    if (!currentStep) return false;
    return currentStep.closedSet.some((p) => p.x === x && p.y === y);
  };

  const isInOpenSetAtStep = (x: number, y: number) => {
    if (!currentStep) return false;
    return currentStep.openSet.some((p) => p.x === x && p.y === y);
  };

  const isCurrentExamined = (x: number, y: number) => {
    return currentStep?.currentNode.x === x && currentStep?.currentNode.y === y;
  };

  return (
    <div style={{ padding: '40px 24px 80px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <span className="badge badge-cyan" style={{ marginBottom: 10 }}>Intelligent Pathfinding Engine</span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: 10 }}>
          A* Pathfinding Algorithm & Live Inspector
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 780, margin: '0 auto' }}>
          Interactive academic demonstration of heuristic graph search. Click any cell to toggle obstacles,
          inspect G/H/F calculations in real time, or step through node evaluation.
        </p>
      </div>

      {/* Visual Mathematical Formula Banner */}
      <div className="glass-panel-glow" style={{ padding: '24px 32px', marginBottom: 32 }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#38bdf8', fontWeight: 700 }}>
              Primary Evaluation Function
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#ffffff', fontFamily: 'monospace' }}>
              F(n) = G(n) + H(n)
            </div>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: 16,
            flex: 1,
          }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px 14px', borderRadius: 8 }}>
              <div style={{ color: '#22c55e', fontWeight: 700, fontSize: '0.9rem' }}>G(n) : Exact Path Cost</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Cumulative steps from Spawn node to current cell n</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px 14px', borderRadius: 8 }}>
              <div style={{ color: '#38bdf8', fontWeight: 700, fontSize: '0.9rem' }}>H(n) : Heuristic Estimate</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Manhattan distance: |x - x_target| + |y - y_target|</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '10px 14px', borderRadius: 8 }}>
              <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.9rem' }}>F(n) : Total Priority Cost</div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Priority queue evaluates lowest F(n) first</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Visualizer Board & Step Controller */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 24,
        alignItems: 'start',
        marginBottom: 40,
      }}>
        {/* Left: Interactive Grid */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          {/* Controls Bar */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 12,
            marginBottom: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="btn-primary"
                style={{ padding: '8px 16px', fontSize: '0.88rem' }}
              >
                {isPlaying ? <Pause size={16} /> : <Play size={16} fill="#ffffff" />}
                <span>{isPlaying ? 'PAUSE' : 'STEP PLAY'}</span>
              </button>

              <button
                onClick={() => {
                  setIsPlaying(false);
                  setCurrentStepIndex(0);
                }}
                className="btn-secondary"
                style={{ padding: '8px 14px', fontSize: '0.88rem' }}
              >
                <RotateCcw size={16} />
                <span>RESET</span>
              </button>
            </div>

            {/* Step Slider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flex: 1, minWidth: 220 }}>
              <span style={{ fontSize: '0.8rem', color: '#94a3b8', whiteSpace: 'nowrap' }}>
                Step {currentStepIndex + 1} / {astarResult.steps.length || 1}
              </span>
              <input
                type="range"
                min="0"
                max={Math.max(0, astarResult.steps.length - 1)}
                value={currentStepIndex}
                onChange={(e) => {
                  setIsPlaying(false);
                  setCurrentStepIndex(Number(e.target.value));
                }}
                style={{ flex: 1, accentColor: '#38bdf8' }}
              />
            </div>
          </div>

          {/* Interactive Grid Representation */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: `repeat(${DEMO_COLS}, 1fr)`,
            gap: 4,
            background: '#090d16',
            padding: 12,
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
          }}>
            {Array.from({ length: DEMO_ROWS }).map((_, y) =>
              Array.from({ length: DEMO_COLS }).map((_, x) => {
                const isStart = x === startPoint.x && y === startPoint.y;
                const isTarget = x === targetPoint.x && y === targetPoint.y;
                const isObstacle = obstacles.has(pointKey({ x, y }));
                const isPath = isFinalPathCell(x, y);
                const isCurrent = isCurrentExamined(x, y);
                const inOpen = isInOpenSetAtStep(x, y);
                const inClosed = isInClosedSetAtStep(x, y);
                const isSelected = selectedNode?.x === x && selectedNode?.y === y;

                let cellBg = '#0f172a';
                let cellBorder = '1px solid rgba(255, 255, 255, 0.05)';
                let textColor = '#64748b';

                if (isObstacle) {
                  cellBg = '#334155';
                  cellBorder = '1px solid #475569';
                } else if (isStart) {
                  cellBg = '#831843';
                  cellBorder = '2px solid #f43f5e';
                  textColor = '#ffffff';
                } else if (isTarget) {
                  cellBg = '#1e3a8a';
                  cellBorder = '2px solid #38bdf8';
                  textColor = '#ffffff';
                } else if (isCurrent) {
                  cellBg = 'rgba(245, 158, 11, 0.45)';
                  cellBorder = '2px solid #f59e0b';
                } else if (isPath && currentStepIndex >= astarResult.steps.length - 1) {
                  cellBg = 'rgba(56, 189, 248, 0.35)';
                  cellBorder = '1px solid #38bdf8';
                } else if (inOpen) {
                  cellBg = 'rgba(34, 197, 94, 0.2)';
                  cellBorder = '1px solid #22c55e';
                } else if (inClosed) {
                  cellBg = 'rgba(59, 130, 246, 0.15)';
                  cellBorder = '1px solid #3b82f6';
                }

                if (isSelected) {
                  cellBorder = '2px solid #ffffff';
                }

                const details = astarResult.nodeDetails.get(pointKey({ x, y }));

                return (
                  <div
                    key={`${x}-${y}`}
                    onClick={() => {
                      setSelectedNode({ x, y });
                    }}
                    onDoubleClick={() => toggleObstacle(x, y)}
                    title={`(${x}, ${y}) - Click to inspect, double-click to toggle obstacle`}
                    style={{
                      aspectRatio: '1',
                      background: cellBg,
                      border: cellBorder,
                      borderRadius: 6,
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontSize: '0.65rem',
                      fontFamily: 'monospace',
                      fontWeight: 700,
                      color: textColor,
                      position: 'relative',
                      userSelect: 'none',
                      transition: 'background 0.1s ease',
                    }}
                  >
                    {isStart && <span>SPAWN</span>}
                    {isTarget && <span>BASE</span>}
                    {isObstacle && <span>WALL</span>}
                    {!isStart && !isTarget && !isObstacle && details && (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1.1 }}>
                        <span style={{ color: '#22c55e', fontSize: '0.6rem' }}>G:{details.g}</span>
                        <span style={{ color: '#f59e0b', fontSize: '0.68rem' }}>F:{details.f}</span>
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Current Step Commentary */}
          <div style={{
            marginTop: 16,
            padding: '12px 16px',
            background: 'rgba(30, 41, 59, 0.5)',
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
            fontSize: '0.85rem',
            color: '#cbd5e1',
          }}>
            <strong>Algorithm Log: </strong>
            {currentStep?.description || 'Optimal path resolved! Select cells or step through algorithm to inspect details.'}
          </div>

          {/* Legend */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            marginTop: 14,
            fontSize: '0.75rem',
            color: '#94a3b8',
            flexWrap: 'wrap',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, background: '#831843', border: '1px solid #f43f5e', borderRadius: 2 }} />
              <span>Spawn (Start)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, background: '#1e3a8a', border: '1px solid #38bdf8', borderRadius: 2 }} />
              <span>Base (Target)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, background: '#334155', borderRadius: 2 }} />
              <span>Obstacle (Double-click)</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, background: 'rgba(34, 197, 94, 0.25)', border: '1px solid #22c55e', borderRadius: 2 }} />
              <span>Open Set</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, background: 'rgba(59, 130, 246, 0.2)', border: '1px solid #3b82f6', borderRadius: 2 }} />
              <span>Closed Set</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 12, height: 12, background: 'rgba(56, 189, 248, 0.4)', border: '1px solid #38bdf8', borderRadius: 2 }} />
              <span>Final Optimal Path</span>
            </div>
          </div>
        </div>

        {/* Right: Selected Node Inspection Card */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: 14 }}>
              Node Cost Card
            </h3>

            {selectedNode && (
              <div>
                <div style={{
                  background: 'rgba(15, 23, 42, 0.8)',
                  padding: '12px 14px',
                  borderRadius: 8,
                  marginBottom: 16,
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Inspected Coordinate</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                    ({selectedNode.x}, {selectedNode.y})
                  </div>
                </div>

                {selectedNodeDetails ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <div style={{ background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)', padding: '10px 14px', borderRadius: 6 }}>
                      <div style={{ fontSize: '0.75rem', color: '#22c55e', fontWeight: 600 }}>G-Cost (Start → Node)</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#22c55e' }}>
                        {selectedNodeDetails.g}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(56, 189, 248, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '10px 14px', borderRadius: 6 }}>
                      <div style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>H-Cost (Manhattan → Goal)</div>
                      <div style={{ fontSize: '1.3rem', fontWeight: 800, color: '#38bdf8' }}>
                        {selectedNodeDetails.h}
                      </div>
                    </div>

                    <div style={{ background: 'rgba(245, 158, 11, 0.15)', border: '1px solid rgba(245, 158, 11, 0.4)', padding: '10px 14px', borderRadius: 6 }}>
                      <div style={{ fontSize: '0.75rem', color: '#f59e0b', fontWeight: 600 }}>F-Cost = G + H</div>
                      <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#f59e0b' }}>
                        {selectedNodeDetails.f}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.78rem', color: '#94a3b8', marginTop: 6 }}>
                      Parent Node: {selectedNodeDetails.parent ? `(${selectedNodeDetails.parent.x}, ${selectedNodeDetails.parent.y})` : 'Start Node'}
                    </div>
                  </div>
                ) : (
                  <div style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    This cell has not been evaluated by the open set, or is an impassable obstacle.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Educational Step Flow (Requirement #26) */}
          <div className="glass-panel" style={{ padding: '20px' }}>
            <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: '#f8fafc', marginBottom: 12 }}>
              A* Algorithm Execution Cycle
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: '0.78rem', color: '#cbd5e1' }}>
              <div style={{ padding: '6px 10px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 4 }}>
                1. Insert Start Node into Open Set
              </div>
              <div style={{ padding: '6px 10px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 4 }}>
                2. Calculate G(n), H(n) and F(n)
              </div>
              <div style={{ padding: '6px 10px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 4 }}>
                3. Pop node with lowest F(n)
              </div>
              <div style={{ padding: '6px 10px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 4 }}>
                4. Add node to Closed Set
              </div>
              <div style={{ padding: '6px 10px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 4 }}>
                5. Check 4 cardinal neighbors
              </div>
              <div style={{ padding: '6px 10px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 4 }}>
                6. Repeat until Target node reached
              </div>
              <div style={{ padding: '6px 10px', background: 'rgba(30, 41, 59, 0.4)', borderRadius: 4 }}>
                7. Backtrack parent pointers to build path
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
