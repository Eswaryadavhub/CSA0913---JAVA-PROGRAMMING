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
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [autoWave, setAutoWave] = useState<boolean>(false);

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

  // Auto-Wave Progression
  useEffect(() => {
    if (autoWave && gameState === GameState.WAVE_COMPLETE) {
      const timer = setTimeout(() => {
        if (engine.state === GameState.WAVE_COMPLETE) {
          engine.startWave();
        }
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [autoWave, gameState, engine]);

  // Direct Keyboard Hotkeys Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is inside an input/textarea
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      const key = e.key.toLowerCase();

      if (key === 't' || key === '1') {
        e.preventDefault();
        handleSelectTowerType(TowerType.BASIC);
      } else if (key === '2') {
        e.preventDefault();
        handleSelectTowerType(TowerType.RAPID);
      } else if (key === '3') {
        e.preventDefault();
        handleSelectTowerType(TowerType.HEAVY);
      } else if (key === 'h') {
        e.preventDefault();
        engine.isHeroSelected = !engine.isHeroSelected;
        if (engine.isHeroSelected) {
          engine.selectedTower = null;
          engine.selectedTowerTypeToPlace = null;
          setSelectedTowerType(null);
        }
        setSelectionTrigger((v) => v + 1);
      } else if (e.code === 'Space') {
        e.preventDefault();
        if (gameState === GameState.PLAYING) {
          engine.pauseGame();
        } else if (gameState === GameState.PAUSED) {
          engine.resumeGame();
        } else {
          engine.startWave();
        }
        setSelectionTrigger((v) => v + 1);
      } else if (key === 'u') {
        e.preventDefault();
        if (engine.selectedTower) {
          handleUpgradeSelectedTower();
        }
      } else if (key === 's' || key === 'delete' || key === 'backspace') {
        e.preventDefault();
        if (engine.selectedTower) {
          handleSellSelectedTower();
        }
      } else if (key === 'a') {
        e.preventDefault();
        const next = !engine.showAStarVisuals;
        engine.showAStarVisuals = next;
        setShowAStar(next);
        setSelectionTrigger((v) => v + 1);
      } else if (key === 'escape') {
        e.preventDefault();
        handleDeselectTower();
        engine.isHeroSelected = false;
        setSelectionTrigger((v) => v + 1);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [engine, gameState, selectedTowerType]);

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
                    <div>Hostile Vitality: <strong>{Math.round(diff.enemyHealthMultiplier * 100)}%</strong></div>
                    <div>March Velocity: <strong>{Math.round(diff.enemySpeedMultiplier * 100)}%</strong></div>
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

      {/* Tactical Quick Instruction Banner */}
      <div className="glass-panel" style={{
        padding: '12px 20px',
        marginBottom: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 12,
        background: 'rgba(15, 23, 42, 0.85)',
        border: '1px solid rgba(56, 189, 248, 0.35)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', fontSize: '0.86rem' }}>
          <span style={{
            background: 'rgba(56, 189, 248, 0.18)',
            color: '#38bdf8',
            padding: '3px 10px',
            borderRadius: 6,
            fontWeight: 700,
            fontSize: '0.76rem',
            textTransform: 'uppercase',
          }}>
            Tactical Steps
          </span>
          <span style={{ color: '#f8fafc' }}>
            <strong>1.</strong> Choose a Turret on the right ➔ <strong>2.</strong> Click any green <strong>[+]</strong> platform on the map ➔ <strong>3.</strong> Click <strong>START NEXT WAVE</strong> to engage enemies!
          </span>
        </div>

        <button
          onClick={() => setShowTutorial(true)}
          className="btn-secondary"
          style={{
            padding: '6px 14px',
            fontSize: '0.8rem',
            borderColor: 'rgba(56, 189, 248, 0.5)',
            color: '#38bdf8',
          }}
        >
          📖 HOW TO PLAY GUIDE
        </button>
      </div>

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
            autoWave={autoWave}
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
            onToggleAutoWave={() => setAutoWave(!autoWave)}
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

      {/* How To Play Tutorial Modal */}
      {showTutorial && (
        <div className="modal-overlay" onClick={() => setShowTutorial(false)}>
          <div
            className="glass-panel"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 680,
              width: '100%',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '32px',
              position: 'relative',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              boxShadow: '0 0 50px rgba(0, 0, 0, 0.8)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff' }}>
                📖 Commander's Tactical Briefing
              </h2>
              <button
                onClick={() => setShowTutorial(false)}
                className="btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                ✕ Close
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16, fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.6 }}>
              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: 8 }}>
                <h3 style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>
                  1. The Strategic Objective
                </h3>
                <p>
                  Hostile invaders spawn from the <strong>pink Rift Portal</strong> on the left side of the map and march along the path towards your <strong>blue Crystal Headquarters (Base)</strong> on the right. If enemies reach the Base, your Base Integrity decreases. If Base Integrity reaches <strong>0 HP</strong>, the game is over!
                </p>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: 8 }}>
                <h3 style={{ color: '#10b981', fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>
                  2. How to Stop the Enemies (Tower Placement)
                </h3>
                <p>
                  Before starting a wave, you must deploy defensive turrets:
                </p>
                <ol style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <li>Click on a turret in the <strong>Defensive Arsenal</strong> on the right (e.g. <em>Gatling Sentry</em> for 100 coins).</li>
                  <li>Notice that all designated defensive platforms on the map light up in <strong>green with [+]</strong> signs.</li>
                  <li>Click on any highlighted platform (especially near road corners where towers get the most coverage) to build the turret!</li>
                  <li>Your coins will be deducted, and the turret will activate immediately.</li>
                </ol>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: 8 }}>
                <h3 style={{ color: '#f59e0b', fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>
                  3. Launching Waves & Automatic Combat
                </h3>
                <p>
                  Once you have placed 1 or 2 turrets, click the blue <strong>"START NEXT WAVE"</strong> button below the board:
                </p>
                <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <li>Your turrets will <strong>automatically detect</strong> approaching enemies in range and fire kinetic bullets, photon lasers, or plasma mortars.</li>
                  <li>Each defeated enemy awards you <strong>bonus coins</strong> (+20 to +45 coins).</li>
                  <li>Clearing an entire wave awards a <strong>Wave Completion Dividend</strong>!</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: 8 }}>
                <h3 style={{ color: '#c084fc', fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>
                  4. Upgrading Turrets & Targeting Priorities
                </h3>
                <p>
                  Click on any turret you have placed on the map to open the <strong>Turret Inspector</strong> on the right:
                </p>
                <ul style={{ paddingLeft: 20, marginTop: 8, display: 'flex', flexDirection: 'column', gap: 6 }}>
                  <li>Click <strong>UPGRADE</strong> to increase attack power, range, and fire rate (up to Rank 3).</li>
                  <li>Change <strong>Targeting Priority</strong>: <em>First on Path</em> (default), <em>Closest</em>, <em>Lowest HP</em>, or <em>Strongest</em>.</li>
                  <li>If needed, click <strong>DECOMMISSION</strong> to sell a turret and recover 70% of your coins.</li>
                </ul>
              </div>

              <div style={{ background: 'rgba(30, 41, 59, 0.6)', padding: '16px', borderRadius: 8 }}>
                <h3 style={{ color: '#38bdf8', fontWeight: 700, fontSize: '1.05rem', marginBottom: 6 }}>
                  5. A* Heuristic Pathfinding Demonstration
                </h3>
                <p>
                  Enemies do not follow a hardcoded script; they navigate dynamically using the <strong>A* algorithm</strong> ($F = G + H$). Click <strong>"SHOW A* PATH"</strong> below the board anytime to see the explored nodes and optimal route in real time!
                </p>
              </div>
            </div>

            <button
              onClick={() => setShowTutorial(false)}
              className="btn-primary"
              style={{ width: '100%', marginTop: 20, padding: '12px' }}
            >
              GOT IT, LET'S DEFEND!
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
