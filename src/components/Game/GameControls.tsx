import React from 'react';
import { Play, Pause, RotateCcw, FastForward, Save, FolderOpen, Eye, EyeOff, Volume2, VolumeX } from 'lucide-react';
import { GameState } from '../../data/gameTypes';
import { WaveStatus } from '../../game/WaveManager';

interface GameControlsProps {
  gameState: GameState;
  waveStatus: WaveStatus;
  gameSpeed: number;
  showAStar: boolean;
  soundEnabled: boolean;
  autoWave: boolean;
  onStartWave: () => void;
  onPause: () => void;
  onResume: () => void;
  onRestart: () => void;
  onSetSpeed: (speed: number) => void;
  onToggleAStar: () => void;
  onToggleSound: () => void;
  onToggleAutoWave: () => void;
  onSave: () => void;
  onLoad: () => void;
}

export const GameControls: React.FC<GameControlsProps> = ({
  gameState,
  waveStatus,
  gameSpeed,
  showAStar,
  soundEnabled,
  autoWave,
  onStartWave,
  onPause,
  onResume,
  onRestart,
  onSetSpeed,
  onToggleAStar,
  onToggleSound,
  onToggleAutoWave,
  onSave,
  onLoad,
}) => {
  const isPlaying = gameState === GameState.PLAYING;
  const isPaused = gameState === GameState.PAUSED;
  const canStartWave =
    (waveStatus === WaveStatus.READY || waveStatus === WaveStatus.COMPLETED) &&
    gameState !== GameState.GAME_OVER &&
    gameState !== GameState.VICTORY;

  return (
    <div className="glass-panel" style={{
      padding: '14px 20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 14,
    }}>
      {/* Wave & Pause Core Operations */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
        {/* Start Wave Button */}
        <button
          onClick={onStartWave}
          disabled={!canStartWave}
          className="btn-primary"
          style={{
            padding: '9px 18px',
            fontSize: '0.9rem',
            display: 'flex',
            alignItems: 'center',
            gap: 8,
          }}
        >
          <Play size={16} fill="#ffffff" />
          <span>START WAVE</span>
          <span style={{
            background: 'rgba(255, 255, 255, 0.25)',
            padding: '1px 6px',
            borderRadius: 4,
            fontSize: '0.72rem',
            fontWeight: 800,
          }}>
            [Space]
          </span>
        </button>

        {/* Auto Wave Toggle Button */}
        <button
          onClick={onToggleAutoWave}
          className="btn-secondary"
          style={{
            padding: '9px 14px',
            fontSize: '0.82rem',
            color: autoWave ? '#38bdf8' : '#94a3b8',
            borderColor: autoWave ? '#38bdf8' : 'rgba(255, 255, 255, 0.1)',
            background: autoWave ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
          }}
          title="Automatically launch next wave when current wave is cleared"
        >
          <span>⚡ AUTO-WAVE: {autoWave ? 'ON' : 'OFF'}</span>
        </button>

        {/* Pause / Resume Button */}
        {isPlaying ? (
          <button
            onClick={onPause}
            className="btn-secondary"
            style={{ padding: '9px 14px' }}
          >
            <Pause size={16} />
            <span>PAUSE</span>
          </button>
        ) : (
          <button
            onClick={onResume}
            disabled={!isPaused}
            className="btn-secondary"
            style={{ padding: '9px 14px', color: '#10b981', borderColor: 'rgba(16, 185, 129, 0.4)' }}
          >
            <Play size={16} />
            <span>RESUME</span>
          </button>
        )}

        {/* Restart Button */}
        <button
          onClick={onRestart}
          className="btn-secondary"
          style={{ padding: '9px 14px', color: '#f87171', borderColor: 'rgba(239, 68, 68, 0.3)' }}
          title="Restart active session"
        >
          <RotateCcw size={16} />
          <span>RESTART</span>
        </button>
      </div>

      {/* Speed Multiplier (0.5x, 1x, 2x) */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 6,
        background: 'rgba(30, 41, 59, 0.6)',
        padding: '4px',
        borderRadius: 8,
        border: '1px solid var(--border-subtle)',
      }}>
        <div style={{ fontSize: '0.75rem', color: '#94a3b8', padding: '0 6px', fontWeight: 600 }}>
          SPEED
        </div>
        {[0.5, 1.0, 2.0].map((rate) => {
          const isActive = gameSpeed === rate;
          return (
            <button
              key={rate}
              onClick={() => onSetSpeed(rate)}
              style={{
                background: isActive ? '#0284c7' : 'transparent',
                color: isActive ? '#ffffff' : '#94a3b8',
                border: 'none',
                borderRadius: 6,
                padding: '4px 10px',
                fontSize: '0.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
            >
              {rate}x
            </button>
          );
        })}
      </div>

      {/* Auxiliary Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        {/* Toggle A* Visualizer Overlay */}
        <button
          onClick={onToggleAStar}
          className="btn-secondary"
          style={{
            padding: '9px 12px',
            color: showAStar ? '#38bdf8' : '#94a3b8',
            borderColor: showAStar ? '#38bdf8' : 'var(--border-subtle)',
          }}
          title="Toggle real-time A* path & cost visualization [Key: A]"
        >
          {showAStar ? <Eye size={16} /> : <EyeOff size={16} />}
          <span style={{ fontSize: '0.82rem' }}>A* PATH [A]</span>
        </button>

        {/* Audio Mute/Unmute */}
        <button
          onClick={onToggleSound}
          className="btn-secondary"
          style={{ padding: '9px 12px' }}
          title={soundEnabled ? 'Mute SFX' : 'Unmute SFX'}
        >
          {soundEnabled ? <Volume2 size={16} color="#38bdf8" /> : <VolumeX size={16} color="#64748b" />}
        </button>

        {/* Save Session */}
        <button
          onClick={onSave}
          className="btn-secondary"
          style={{ padding: '9px 12px' }}
          title="Save deployment to browser storage"
        >
          <Save size={16} />
          <span style={{ fontSize: '0.82rem' }}>SAVE</span>
        </button>

        {/* Load Session */}
        <button
          onClick={onLoad}
          className="btn-secondary"
          style={{ padding: '9px 12px' }}
          title="Load deployment from browser storage"
        >
          <FolderOpen size={16} />
          <span style={{ fontSize: '0.82rem' }}>LOAD</span>
        </button>
      </div>

      {/* Keyboard Shortcuts Command Ribbon */}
      <div style={{
        width: '100%',
        paddingTop: 8,
        marginTop: 4,
        borderTop: '1px solid rgba(255, 255, 255, 0.08)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 8,
        fontSize: '0.76rem',
        color: '#94a3b8',
      }}>
        <div>
          <strong style={{ color: '#38bdf8' }}>⌨️ Hotkeys:</strong>{' '}
          <span style={{ color: '#ffffff' }}>[T / 1]</span> Gatling |{' '}
          <span style={{ color: '#ffffff' }}>[2]</span> Laser |{' '}
          <span style={{ color: '#ffffff' }}>[3]</span> Mortar |{' '}
          <span style={{ color: '#ffffff' }}>[H]</span> Hero |{' '}
          <span style={{ color: '#ffffff' }}>[Space]</span> Wave / Pause |{' '}
          <span style={{ color: '#ffffff' }}>[U]</span> Upgrade |{' '}
          <span style={{ color: '#ffffff' }}>[S]</span> Sell |{' '}
          <span style={{ color: '#ffffff' }}>[Esc]</span> Deselect
        </div>
        <div style={{ color: '#38bdf8', fontWeight: 600 }}>
          🖱️ Right-Click map to instantly rally Hero Soldier!
        </div>
      </div>
    </div>
  );
};
