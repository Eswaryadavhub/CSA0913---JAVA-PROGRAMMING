import React, { useState, useEffect } from 'react';
import { GameEngine } from '../../game/GameEngine';
import { Difficulty, GameState, GameStats, TowerType, TargetingMode } from '../../data/gameTypes';
import { GameHUD } from './GameHUD';
import { GameBoard } from './GameBoard';
import { TowerShop } from './TowerShop';
import { TowerInspector } from './TowerInspector';
import { GameControls } from './GameControls';
import { GameOverModal } from './GameOverModal';
import { VictoryModal } from './VictoryModal';
import { DIFFICULTY_CONFIGS } from '../../data/difficultyData';
import { Shield, Play, AlertCircle, CheckCircle2, Info, Compass } from 'lucide-react';
import { WaveStatus } from '../../game/WaveManager';

interface GameViewProps {
  engine: GameEngine;
  onNavigateHome: () => void;
  onNavigateHowItWorks: () => void;
}

export const GameView: React.FC<GameViewProps> = ({
  engine,
  onNavigateHome,
  onNavigateHowItWorks,
}) => {
  // Local state synced from engine listeners
  const [gameState, setGameState] = useState<GameState>(engine.state);
  const [health, setHealth] = useState<number>(engine.baseHealth);
  const [coins, setCoins] = useState<number>(engine.economy.getBalance());
  const [currentWave, setCurrentWave] = useState<number>(engine.waveManager.getCurrentWaveNumber());
  const [totalWaves, setTotalWaves] = useState<number>(engine.waveManager.getTotalWaves());
  const [enemiesRemaining, setEnemiesRemaining] = useState<number>(engine.enemies.length);
  const [stats, setStats] = useState<GameStats>(engine.stats);
  const [selectedTowerType, setSelectedTowerType] = useState<TowerType | null>(engine.selectedTowerTypeToPlace);
  const [, setSelectionTrigger] = useState<number>(0);
  const [notification, setNotification] = useState<{ message: string; type: string } | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showAStar, setShowAStar] = useState<boolean>(engine.showAStarVisuals);
  const [gameSpeed, setGameSpeed] = useState<number>(engine.gameSpeed);

  // Difficulty selection state before play
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>(Difficulty.MEDIUM);

  useEffect(() => {
    const listener = {
      onStateChange: (st: GameState) => setGameState(st),
      onCoinsChange: (c: number) => setCoins(c),
      onHealthChange: (h: number) => setHealth(h),
      onWaveChange: (w: number, tot: number) => {
        setCurrentWave(w);
        setTotalWaves(tot);
      },
      onEnemiesChange: (rem: number) => setEnemiesRemaining(rem),
      onStatsChange: (st: GameStats) => setStats(st),
      onNotification: (message: string, type: 'info' | 'success' | 'warning' | 'error') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3800);
      },
    };

    engine.addListener(listener);

    return () => {
      engine.removeListener(listener);
    };
  }, [engine]);

  const handleStartGame = () => {
    engine.startNewGame(selectedDifficulty);
    setGameState(GameState.PLAYING);
  };

  const handleSelectTowerType = (type: TowerType | null) => {
    engine.selectedTowerTypeToPlace = type;
    if (type) {
      engine.selectedTower = null; // deselect existing tower
    }
    setSelectedTowerType(type);
    setSelectionTrigger((v) => v + 1);
  };

  const handleUpgradeSelectedTower = () => {
    engine.upgradeSelectedTower();
    setSelectionTrigger((v) => v + 1);
  };

  const handleSellSelectedTower = () => {
    engine.sellSelectedTower();
    setSelectionTrigger((v) => v + 1);
  };

  const handleDeselectTower = () => {
    engine.selectedTower = null;
    engine.selectedTowerTypeToPlace = null;
    setSelectedTowerType(null);
    setSelectionTrigger((v) => v + 1);
  };

  const handleTargetingModeChange = (mode: TargetingMode) => {
    if (engine.selectedTower) {
      engine.selectedTower.targetingMode = mode;
      setSelectionTrigger((v) => v + 1);
    }
  };

  // Difficulty Selection / Start Screen
  if (gameState === GameState.MENU || gameState === GameState.DIFFICULTY_SELECTION) {
    return (
      <div style={{ padding: '40px 24px 80px', maxWidth: 960, margin: '0 auto', width: '100%' }}>
        <div className="glass-panel-glow" style={{ padding: '40px 36px', textAlign: 'center' }}>
          <div style={{
            width: 56,
            height: 56,
            borderRadius: 14,
            background: 'rgba(56, 189, 248, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px',
            color: '#38bdf8',
          }}>
            <Shield size={32} />
          </div>

          <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>
            Tactical Deployment Setup
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 640, margin: '0 auto 36px' }}>
            Choose your combat difficulty profile. Enemy health, advance speeds, and resource reserves
            will scale accordingly.
          </p>

          {/* Difficulty Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: 20,
            marginBottom: 36,
            textAlign: 'left',
          }}>
            {Object.values(Difficulty).map((diffKey) => {
              const diff = DIFFICULTY_CONFIGS[diffKey];
              const isSelected = selectedDifficulty === diffKey;

              return (
                <div
                  key={diffKey}
                  onClick={() => setSelectedDifficulty(diffKey)}
                  style={{
                    background: isSelected
                      ? 'rgba(56, 189, 248, 0.12)'
                      : 'rgba(30, 41, 59, 0.5)',
                    border: isSelected
                      ? '2px solid #38bdf8'
                      : '1px solid var(--border-subtle)',
                    borderRadius: 10,
                    padding: '24px 20px',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                    boxShadow: isSelected ? '0 0 20px rgba(56, 189, 248, 0.25)' : 'none',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                    <div style={{ fontWeight: 800, fontSize: '1.15rem', color: '#ffffff' }}>
                      {diff.label}
                    </div>
                    {isSelected && <span className="badge badge-cyan">Selected</span>}
                  </div>

                  <p style={{ fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: 16 }}>
                    {diff.description}
                  </p>

                  <div style={{
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '10px 12px',
                    borderRadius: 6,
                    fontSize: '0.8rem',
                    color: '#cbd5e1',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                  }}>
                    <div>Initial Balance: <strong style={{ color: '#facc15' }}>{diff.startingCoins} Coins</strong></div>
                    <div>Hostile Vitality: <strong>{diff.enemyHealthMultiplier * 100}%</strong></div>
                    <div>March Velocity: <strong>{diff.enemySpeedMultiplier * 100}%</strong></div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Action Button */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16 }}>
            <button
              onClick={handleStartGame}
              className="btn-primary"
              style={{
                padding: '16px 48px',
                fontSize: '1.15rem',
                letterSpacing: '0.5px',
              }}
            >
              <Play size={20} fill="#ffffff" />
              <span>DEPLOY DEFENSES & START GAME</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Active Playable Game Screen
  return (
    <div style={{ padding: '20px 24px 60px', maxWidth: 1300, margin: '0 auto', width: '100%' }}>
      {/* Toast Notification Banner */}
      {notification && (
        <div style={{
          position: 'fixed',
          top: 80,
          right: 24,
          zIndex: 999,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          padding: '12px 18px',
          borderRadius: 8,
          background:
            notification.type === 'error'
              ? 'rgba(239, 68, 68, 0.92)'
              : notification.type === 'warning'
              ? 'rgba(245, 158, 11, 0.92)'
              : notification.type === 'success'
              ? 'rgba(16, 185, 129, 0.92)'
              : 'rgba(2, 132, 199, 0.92)',
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '0.88rem',
          boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
          backdropFilter: 'blur(8px)',
          animation: 'fadeIn 0.2s ease',
        }}>
          {notification.type === 'error' ? (
            <AlertCircle size={18} />
          ) : notification.type === 'success' ? (
            <CheckCircle2 size={18} />
          ) : (
            <Info size={18} />
          )}
          <span>{notification.message}</span>
        </div>
      )}

      {/* Top HUD */}
      <GameHUD
        health={health}
        maxHealth={engine.maxBaseHealth}
        coins={coins}
        currentWave={currentWave}
        totalWaves={totalWaves}
        enemiesRemaining={enemiesRemaining}
        score={stats.score}
        difficulty={engine.difficulty}
        gameState={gameState}
      />

      {/* Main Game Stage Layout */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 340px',
        gap: 20,
        alignItems: 'start',
      }}>
        {/* Left Column: GameBoard & Controls */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <GameBoard
            engine={engine}
            onSelectTower={() => {
              setSelectedTowerType(engine.selectedTowerTypeToPlace);
              setSelectionTrigger((v) => v + 1);
            }}
          />

          <GameControls
            gameState={gameState}
            waveStatus={engine.waveManager.getStatus()}
            gameSpeed={gameSpeed}
            showAStar={showAStar}
            soundEnabled={soundEnabled}
            onStartWave={() => engine.startWave()}
            onPause={() => engine.pauseGame()}
            onResume={() => engine.resumeGame()}
            onRestart={() => handleStartGame()}
            onSetSpeed={(speed) => {
              engine.setSpeed(speed);
              setGameSpeed(speed);
            }}
            onToggleAStar={() => {
              const next = !engine.showAStarVisuals;
              engine.showAStarVisuals = next;
              setShowAStar(next);
            }}
            onToggleSound={() => {
              const active = engine.waveManager ? !soundEnabled : true;
              setSoundEnabled(active);
            }}
            onSave={() => engine.saveGame()}
            onLoad={() => {
              const loaded = engine.loadGame();
              if (loaded) {
                setGameState(engine.state);
                setHealth(engine.baseHealth);
                setCoins(engine.economy.getBalance());
                setSelectionTrigger((v) => v + 1);
              }
            }}
          />
        </div>

        {/* Right Sidebar: Shop / Inspector / Educational Quick Link */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {engine.selectedTower ? (
            <TowerInspector
              tower={engine.selectedTower}
              coins={coins}
              onUpgrade={handleUpgradeSelectedTower}
              onSell={handleSellSelectedTower}
              onClose={handleDeselectTower}
              onTargetingModeChange={handleTargetingModeChange}
            />
          ) : (
            <TowerShop
              currentCoins={coins}
              selectedTowerType={selectedTowerType}
              onSelectTowerType={handleSelectTowerType}
            />
          )}

          {/* Educational Quick Card for Viva Presentation */}
          <div className="glass-panel" style={{ padding: '16px 20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, color: '#38bdf8' }}>
              <Compass size={18} />
              <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>A* Heuristic Inspector</div>
            </div>
            <p style={{ fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: 12 }}>
              Click <strong>"SHOW A* PATH"</strong> below the board to inspect open & closed sets live on the battlefield,
              or open the full step-by-step algorithm visualizer.
            </p>
            <button
              onClick={onNavigateHowItWorks}
              className="btn-secondary"
              style={{ width: '100%', fontSize: '0.8rem', padding: '8px' }}
            >
              Open Interactive A* Explorer
            </button>
          </div>
        </div>
      </div>

      {/* Game Over Modal */}
      {gameState === GameState.GAME_OVER && (
        <GameOverModal
          stats={stats}
          currentWave={currentWave}
          onRestart={handleStartGame}
          onHome={onNavigateHome}
        />
      )}

      {/* Victory Modal */}
      {gameState === GameState.VICTORY && (
        <VictoryModal
          stats={stats}
          onPlayAgain={handleStartGame}
          onHome={onNavigateHome}
        />
      )}
    </div>
  );
};
