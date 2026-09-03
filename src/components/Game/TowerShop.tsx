import React from 'react';
import { TowerType } from '../../data/gameTypes';
import { TOWERS_CONFIG } from '../../data/towersData';
import { Shield, Zap, Target, Coins } from 'lucide-react';

interface TowerShopProps {
  currentCoins: number;
  selectedTowerType: TowerType | null;
  onSelectTowerType: (type: TowerType | null) => void;
}

export const TowerShop: React.FC<TowerShopProps> = ({
  currentCoins,
  selectedTowerType,
  onSelectTowerType,
}) => {
  const towers = [
    {
      type: TowerType.BASIC,
      config: TOWERS_CONFIG[TowerType.BASIC],
      icon: <Shield size={20} color="#3b82f6" />,
      tag: '3D Kinetic Sentry',
      hotkey: 'T / 1',
    },
    {
      type: TowerType.RAPID,
      config: TOWERS_CONFIG[TowerType.RAPID],
      icon: <Zap size={20} color="#10b981" />,
      tag: '3D Pulse Laser',
      hotkey: '2',
    },
    {
      type: TowerType.HEAVY,
      config: TOWERS_CONFIG[TowerType.HEAVY],
      icon: <Target size={20} color="#f59e0b" />,
      tag: '3D Plasma Mortar',
      hotkey: '3',
    },
  ];

  return (
    <div className="glass-panel" style={{ padding: '20px', height: '100%' }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
      }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
          Defensive Arsenal
        </h3>
        <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Select to Deploy</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {towers.map(({ type, config, icon, tag, hotkey }) => {
          const isSelected = selectedTowerType === type;
          const canAfford = currentCoins >= config.cost;

          return (
            <div
              key={type}
              onClick={() => {
                if (isSelected) {
                  onSelectTowerType(null);
                } else {
                  onSelectTowerType(type);
                }
              }}
              style={{
                background: isSelected
                  ? 'rgba(56, 189, 248, 0.15)'
                  : 'rgba(30, 41, 59, 0.6)',
                border: isSelected
                  ? '1px solid #38bdf8'
                  : '1px solid var(--border-subtle)',
                borderRadius: 8,
                padding: '14px',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                boxShadow: isSelected ? '0 0 15px rgba(56, 189, 248, 0.25)' : 'none',
              }}
            >
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{
                    width: 32,
                    height: 32,
                    borderRadius: 6,
                    background: 'rgba(15, 23, 42, 0.8)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    {icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#ffffff', display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span>{config.name}</span>
                      <span style={{
                        background: 'rgba(56, 189, 248, 0.2)',
                        color: '#38bdf8',
                        padding: '1px 6px',
                        borderRadius: 4,
                        fontSize: '0.72rem',
                        fontWeight: 800,
                      }}>
                        [{hotkey}]
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{tag}</div>
                  </div>
                </div>

                {/* Price tag */}
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 4,
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  color: canAfford ? '#fbbf24' : '#ef4444',
                }}>
                  <Coins size={14} />
                  <span>{config.cost}</span>
                </div>
              </div>

              {/* Stats Bar */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
                gap: 6,
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '6px 10px',
                borderRadius: 6,
                fontSize: '0.74rem',
                marginBottom: 8,
              }}>
                <div>
                  <span style={{ color: '#94a3b8' }}>Dmg: </span>
                  <strong>{config.damage}</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Rng: </span>
                  <strong>{config.range}px</strong>
                </div>
                <div>
                  <span style={{ color: '#94a3b8' }}>Rate: </span>
                  <strong>{config.fireRate}/s</strong>
                </div>
              </div>

              {/* Short description */}
              <div style={{ fontSize: '0.74rem', color: '#94a3b8', lineHeight: 1.4 }}>
                {config.description}
              </div>

              {/* Selection banner */}
              {isSelected && (
                <div style={{
                  marginTop: 10,
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  color: '#38bdf8',
                  textAlign: 'center',
                  background: 'rgba(56, 189, 248, 0.1)',
                  padding: '4px',
                  borderRadius: 4,
                }}>
                  [ CLICK GREEN [+] PLATFORM TO DEPLOY ]
                </div>
              )}
            </div>
          );
        })}

        {/* Mobile Hero Soldier Squad Controller */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.8)',
          border: '1px solid rgba(56, 189, 248, 0.4)',
          borderRadius: 8,
          padding: '14px',
          marginTop: 6,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontWeight: 700, color: '#38bdf8', fontSize: '0.9rem' }}>
              <span>🛡️ Mobile Hero Soldier</span>
              <span style={{
                background: 'rgba(56, 189, 248, 0.2)',
                color: '#38bdf8',
                padding: '1px 6px',
                borderRadius: 4,
                fontSize: '0.72rem',
                fontWeight: 800,
              }}>
                [H]
              </span>
            </div>
          </div>
          <p style={{ fontSize: '0.75rem', color: '#cbd5e1', lineHeight: 1.4, margin: '0 0 8px' }}>
            Direct your mobile soldier to intercept enemies! <strong>Right-Click anywhere on the map</strong> to order him to that position immediately.
          </p>
          <div style={{ fontSize: '0.72rem', color: '#94a3b8', background: 'rgba(30, 41, 59, 0.6)', padding: '6px 8px', borderRadius: 4 }}>
            💡 <em>Tip: Position him at choke points to block and slice mechs before they reach the base!</em>
          </div>
        </div>
      </div>
    </div>
  );
};
