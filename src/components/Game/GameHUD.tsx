import React from 'react';
import { Heart, Coins, Shield, Skull, Award, Activity } from 'lucide-react';
import { Difficulty, GameState } from '../../data/gameTypes';

interface GameHUDProps {
  health: number;
  maxHealth: number;
  coins: number;
  currentWave: number;
  totalWaves: number;
  enemiesRemaining: number;
  score: number;
  difficulty: Difficulty;
  gameState: GameState;
}

export const GameHUD: React.FC<GameHUDProps> = ({
  health,
  maxHealth,
  coins,
  currentWave,
  totalWaves,
  enemiesRemaining,
  score,
  difficulty,
  gameState,
}) => {
  const healthPercent = Math.max(0, Math.min(100, (health / maxHealth) * 100));
  const healthBarColor =
    healthPercent > 50 ? '#10b981' : healthPercent > 25 ? '#f59e0b' : '#ef4444';

  const getDifficultyBadge = (diff: Difficulty) => {
    switch (diff) {
      case Difficulty.EASY:
        return <span className="badge badge-emerald">Cadet (Easy)</span>;
      case Difficulty.MEDIUM:
        return <span className="badge badge-cyan">Commander (Med)</span>;
      case Difficulty.HARD:
        return <span className="badge badge-amber">Veteran (Hard)</span>;
    }
  };

  const getStateBadge = (state: GameState) => {
    switch (state) {
      case GameState.PLAYING:
        return <span className="badge badge-emerald" style={{ animation: 'pulse 1.5s infinite' }}>Engaged</span>;
      case GameState.PAUSED:
        return <span className="badge badge-amber">Paused</span>;
      case GameState.WAVE_COMPLETE:
        return <span className="badge badge-cyan">Wave Cleared</span>;
      case GameState.GAME_OVER:
        return <span className="badge badge-purple" style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444' }}>Base Fallen</span>;
      case GameState.VICTORY:
        return <span className="badge badge-emerald">Victory</span>;
      default:
        return <span className="badge badge-cyan">Ready</span>;
    }
  };

  return (
    <div className="glass-panel" style={{
      padding: '16px 24px',
      marginBottom: 16,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 16,
    }}>
      {/* Player HQ Base Health */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 200 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: 'rgba(239, 68, 68, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#ef4444',
        }}>
          <Heart size={22} fill={health > 0 ? '#ef4444' : 'none'} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4 }}>
            <span>BASE INTEGRITY</span>
            <span style={{ color: '#f8fafc' }}>{health} / {maxHealth} HP</span>
          </div>
          <div style={{ width: '100%', height: 8, background: '#1e293b', borderRadius: 4, overflow: 'hidden' }}>
            <div style={{
              width: `${healthPercent}%`,
              height: '100%',
              background: healthBarColor,
              transition: 'width 0.3s ease, background 0.3s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Resource Coins */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: 'rgba(245, 158, 11, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f59e0b',
        }}>
          <Coins size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Resources</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#facc15' }}>
            {coins} <span style={{ fontSize: '0.8rem', color: '#f59e0b' }}>COINS</span>
          </div>
        </div>
      </div>

      {/* Wave Indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: 'rgba(16, 185, 129, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#34d399',
        }}>
          <Shield size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Wave Progress</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
            {currentWave} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ {totalWaves}</span>
          </div>
        </div>
      </div>

      {/* Hostile Creeps Remaining */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: 'rgba(244, 63, 94, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#f43f5e',
        }}>
          <Skull size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Enemies Active</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: enemiesRemaining > 0 ? '#f43f5e' : '#94a3b8' }}>
            {enemiesRemaining}
          </div>
        </div>
      </div>

      {/* Score */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <div style={{
          width: 40,
          height: 40,
          borderRadius: 8,
          background: 'rgba(245, 158, 11, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#fbbf24',
        }}>
          <Award size={22} />
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase' }}>Score</div>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc' }}>
            {score}
          </div>
        </div>
      </div>

      {/* Difficulty & Status Badges */}
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6 }}>
        {getDifficultyBadge(difficulty)}
        {getStateBadge(gameState)}
      </div>
    </div>
  );
};
