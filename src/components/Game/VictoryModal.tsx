import React, { useEffect } from 'react';
import { Trophy, RotateCcw, Home, Award, Shield, Coins, Target } from 'lucide-react';
import confetti from 'canvas-confetti';
import { GameStats } from '../../data/gameTypes';

interface VictoryModalProps {
  stats: GameStats;
  onPlayAgain: () => void;
  onHome: () => void;
}

export const VictoryModal: React.FC<VictoryModalProps> = ({
  stats,
  onPlayAgain,
  onHome,
}) => {
  useEffect(() => {
    // Launch celebratory confetti burst
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  return (
    <div className="modal-overlay">
      <div className="glass-panel" style={{
        maxWidth: 520,
        width: '100%',
        padding: '38px 32px',
        textAlign: 'center',
        border: '1px solid rgba(16, 185, 129, 0.5)',
        boxShadow: '0 0 50px rgba(16, 185, 129, 0.3)',
      }}>
        <div style={{
          width: 68,
          height: 68,
          borderRadius: 18,
          background: 'rgba(16, 185, 129, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          color: '#10b981',
          boxShadow: '0 0 25px rgba(16, 185, 129, 0.35)',
        }}>
          <Trophy size={38} />
        </div>

        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: '#10b981', marginBottom: 8, letterSpacing: '-0.5px' }}>
          VICTORY ACHIEVED!
        </h2>
        <p style={{ color: '#cbd5e1', fontSize: '0.98rem', marginBottom: 26 }}>
          Outstanding tactical command! All 10 hostile waves repelled and Headquarters secured!
        </p>

        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 12,
          marginBottom: 30,
          textAlign: 'left',
        }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px 16px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Award size={14} color="#fbbf24" /> Final Score
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#f8fafc' }}>
              {stats.score}
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.8)', padding: '12px 16px', borderRadius: 8 }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: 6 }}>
              <Shield size={14} color="#10b981" /> Waves Cleared
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#10b981' }}>
              10 / 10
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

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 12 }}>
          <button
            onClick={onPlayAgain}
            className="btn-success"
            style={{ flex: 1, padding: '12px' }}
          >
            <RotateCcw size={18} />
            <span>PLAY AGAIN</span>
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
