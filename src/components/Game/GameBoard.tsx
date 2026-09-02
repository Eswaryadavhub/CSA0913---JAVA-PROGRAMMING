import React, { useEffect, useRef } from 'react';
import { GameEngine } from '../../game/GameEngine';
import { CANVAS_HEIGHT, CANVAS_WIDTH, pixelToGrid } from '../../data/mapData';

interface GameBoardProps {
  engine: GameEngine;
  onSelectTower: () => void;
}

export const GameBoard: React.FC<GameBoardProps> = ({ engine, onSelectTower }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const render = () => {
      engine.draw(ctx);
      animId = requestAnimationFrame(render);
    };
    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [engine]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;

    const gridPoint = pixelToGrid(mouseX, mouseY);
    engine.hoveredGridNode = gridPoint;
  };

  const handleMouseLeave = () => {
    engine.hoveredGridNode = null;
  };

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const mouseX = (e.clientX - rect.left) * scaleX;
    const mouseY = (e.clientY - rect.top) * scaleY;
    const gridPoint = pixelToGrid(mouseX, mouseY);

    // If in placement mode
    if (engine.selectedTowerTypeToPlace) {
      const placed = engine.placeTower(gridPoint.x, gridPoint.y, engine.selectedTowerTypeToPlace);
      if (placed) {
        onSelectTower();
      }
      return;
    }

    // Otherwise check if selecting an existing tower
    const clickedTower = engine.towers.find(
      (t) => t.gridX === gridPoint.x && t.gridY === gridPoint.y
    );

    if (clickedTower) {
      engine.selectedTower = clickedTower;
      onSelectTower();
    } else {
      engine.selectedTower = null;
      onSelectTower();
    }
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (engine.selectedTowerTypeToPlace) {
      engine.selectedTowerTypeToPlace = null;
      engine.selectedTower = null;
      onSelectTower();
    }
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      overflowX: 'auto',
      padding: '4px 0',
    }}>
      <div className="canvas-wrapper">
        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          style={{
            width: CANVAS_WIDTH,
            height: CANVAS_HEIGHT,
            cursor: engine.selectedTowerTypeToPlace ? 'crosshair' : 'default',
          }}
        />
      </div>
      <div style={{
        marginTop: 8,
        fontSize: '0.8rem',
        color: '#64748b',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
      }}>
        <span>💡 <strong>Left-Click</strong> to select / deploy tower</span>
        <span>🖱️ <strong>Right-Click</strong> to cancel placement mode</span>
        <span>🎯 Select placed tower to upgrade or decommission</span>
      </div>
    </div>
  );
};
