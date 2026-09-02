import React from 'react';
import { Skull, RotateCcw, Home, Award, Shield, Coins, Target } from 'lucide-react';
import { GameStats } from '../../data/gameTypes';

interface GameOverModalProps {
  stats: GameStats;
  currentWave: number;
  onRestart: () => void;
  onHome: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({
  stats,
  currentWave,
  onRestart,
  onHome,
}) => {
  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{
        maxWidth: 500,
        width: '100%',
        padding: '36px 32px',
        textAlign: 'center',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        boxShadow: '0 0 40px rgba(239, 68, 68, 0.25)',
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'rgba(239, 68, 68, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#ef4444',
        }}>
          <Skull size={36} />
        </div>

        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#ef4444', marginBottom: 8, letterSpacing: '-0.5px' }}>
          DEFENSE COLLAPSED
        </h2>
        <p style={{ color: '#94a3b8', fontSize: '0.95rem', marginBottom: 24 }}>
          Enemy forces overwhelmed your defensive bastions and breached Headquarters.
        </p>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 28,
          textAlign: 'left',
        }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px 16px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Award size={14} color="#c084fc" /> Final Score
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              {stats.score}
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px 16px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={14} color="#38bdf8" /> Wave Reached
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#38bdf8' }}>
              {currentWave} <span style={{ fontSize: '0.85rem', color: '#64748b' }}>/ 10</span>
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px 16px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Target size={14} color="#f43f5e" /> Enemies Defeated
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              {stats.enemiesDefeated}
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px 16px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Coins size={14} color="#f59e0b" /> Coins Earned
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#facc15' }}>
              {stats.coinsEarned}
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onRestart}
            className="btn-primary"
            style={{ flex: 1, padding: '12px' }}
          >
            <RotateCcw size={18} />
            <span>RESTART</span>
          </button>

          <button
            onClick={onHome}
            className="btn-secondary"
            style={{ flex: 1, padding: '12px' }}
          >
            <Home size={18} />
            <span>MAIN MENU</span>
          </button>
        </div>
      </div>
    </div>
  );
};
