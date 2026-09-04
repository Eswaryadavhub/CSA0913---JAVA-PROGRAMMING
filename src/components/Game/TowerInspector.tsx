import React from 'react';
import { Tower } from '../../game/Tower';
import { TargetingMode } from '../../data/gameTypes';
import { ArrowUpCircle, Trash2, Crosshair, X, Shield, Sparkles } from 'lucide-react';

interface TowerInspectorProps {
  tower: Tower;
  coins: number;
  onUpgrade: () => void;
  onSell: () => void;
  onClose: () => void;
  onTargetingModeChange: (mode: TargetingMode) => void;
}

export const TowerInspector: React.FC<TowerInspectorProps> = ({
  tower,
  coins,
  onUpgrade,
  onSell,
  onClose,
  onTargetingModeChange,
}) => {
  const upgradeCost = tower.getUpgradeCost();
  const isMaxLevel = tower.level >= tower.maxLevel;
  const canAffordUpgrade = coins >= upgradeCost && !isMaxLevel;
  const sellValue = tower.getSellValue();

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
        paddingBottom: 12,
        borderBottom: '1px solid var(--border-subtle)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32,
            height: 32,
            borderRadius: 6,
            background: 'rgba(16, 185, 129, 0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#34d399',
          }}>
            <Shield size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>
              {tower.type} Turret
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', fontWeight: 600 }}>
              Rank {tower.level} of {tower.maxLevel}
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            color: '#94a3b8',
            cursor: 'pointer',
            padding: 4,
          }}
          title="Deselect"
        >
          <X size={18} />
        </button>
      </div>

      {/* Current Stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: 10,
        marginBottom: 18,
      }}>
        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: 6 }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Attack Power</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
            {tower.damage} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>HP</span>
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: 6 }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Effective Range</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
            {tower.range} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>PX</span>
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: 6 }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Cadence Rate</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
            {tower.fireRate} <span style={{ fontSize: '0.75rem', color: '#64748b' }}>/SEC</span>
          </div>
        </div>

        <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '10px 12px', borderRadius: 6 }}>
          <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>Emplacement</div>
          <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#f8fafc' }}>
            ({tower.gridX}, {tower.gridY})
          </div>
        </div>
      </div>

      {/* Targeting Strategy Selector */}
      <div style={{ marginBottom: 20 }}>
        <label style={{
          display: 'flex',
          alignItems: 'center',
          gap: 6,
          fontSize: '0.8rem',
          fontWeight: 600,
          color: '#cbd5e1',
          marginBottom: 8,
        }}>
          <Crosshair size={14} color="#34d399" />
          Targeting Priority
        </label>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: 6,
        }}>
          {[
            { mode: TargetingMode.FIRST, label: 'First on Path' },
            { mode: TargetingMode.CLOSEST, label: 'Closest' },
            { mode: TargetingMode.LOWEST_HP, label: 'Lowest HP' },
            { mode: TargetingMode.STRONGEST, label: 'Strongest' },
          ].map(({ mode, label }) => {
            const isSelected = tower.targetingMode === mode;
            return (
              <button
                key={mode}
                onClick={() => onTargetingModeChange(mode)}
                style={{
                  padding: '6px 8px',
                  borderRadius: 6,
                  border: isSelected ? '1px solid #10b981' : '1px solid var(--border-subtle)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.2)' : 'rgba(30, 41, 59, 0.5)',
                  color: isSelected ? '#34d399' : '#94a3b8',
                  fontSize: '0.75rem',
                  fontWeight: isSelected ? 700 : 500,
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                }}
              >
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Upgrade & Sell Actions */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {/* Upgrade Button */}
        <button
          onClick={onUpgrade}
          disabled={!canAffordUpgrade}
          className="btn-success"
          style={{
            width: '100%',
            padding: '12px',
            fontSize: '0.9rem',
            opacity: canAffordUpgrade ? 1 : 0.5,
            cursor: canAffordUpgrade ? 'pointer' : 'not-allowed',
          }}
        >
          <ArrowUpCircle size={18} />
          {isMaxLevel ? (
            <span>MAXIMUM RANK REACHED</span>
          ) : (
            <span>UPGRADE ( {upgradeCost} COINS )</span>
          )}
        </button>

        {/* Sell / Decommission Button */}
        <button
          onClick={onSell}
          className="btn-secondary"
          style={{
            width: '100%',
            padding: '10px',
            fontSize: '0.85rem',
            borderColor: 'rgba(239, 68, 68, 0.3)',
            color: '#f87171',
          }}
        >
          <Trash2 size={16} />
          <span>DECOMMISSION ( RECOVER {sellValue} 🪙 )</span>
        </button>
      </div>
    </div>
  );
};
