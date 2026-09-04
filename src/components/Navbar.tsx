import React from 'react';
import { Shield, Play, Info, Cpu, CheckSquare, Sparkles, Users, Volume2, VolumeX } from 'lucide-react';
import { soundManager } from '../game/SoundManager';

export type PageId = 'home' | 'about' | 'game' | 'how-it-works' | 'architecture' | 'testing' | 'future-scope' | 'team';

interface NavbarProps {
  currentPage: PageId;
  onNavigate: (page: PageId) => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentPage,
  onNavigate,
  soundEnabled,
  onToggleSound,
}) => {
  const navItems: { id: PageId; label: string; icon: React.ReactNode }[] = [
    { id: 'home', label: 'Home', icon: <Shield size={16} /> },
    { id: 'about', label: 'About', icon: <Info size={16} /> },
    { id: 'game', label: 'Game', icon: <Play size={16} /> },
    { id: 'how-it-works', label: 'A* Algorithm', icon: <Sparkles size={16} /> },
    { id: 'architecture', label: 'Architecture', icon: <Cpu size={16} /> },
    { id: 'testing', label: 'Testing', icon: <CheckSquare size={16} /> },
    { id: 'future-scope', label: 'Future Scope', icon: <Sparkles size={16} /> },
    { id: 'team', label: 'Team', icon: <Users size={16} /> },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(9, 13, 22, 0.88)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-subtle)',
      padding: '12px 24px',
    }}>
      <div style={{
        maxWidth: 1300,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 16,
      }}>
        {/* Brand / Logo */}
        <div
          onClick={() => onNavigate('home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 12,
            cursor: 'pointer',
          }}
        >
          <div style={{
            width: 38,
            height: 38,
            borderRadius: 8,
            background: 'linear-gradient(135deg, #059669, #10b981)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
          }}>
            <Shield size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1.05rem', letterSpacing: '0.5px', color: '#ffffff' }}>
              DEFENCE <span style={{ color: '#34d399' }}>A*</span>
            </div>
            <div style={{ fontSize: '0.7rem', color: '#94a3b8', letterSpacing: '0.3px' }}>
              Java Swing Capstone Demonstration
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          flexWrap: 'wrap',
        }}>
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '8px 14px',
                  borderRadius: 6,
                  border: 'none',
                  background: isActive ? 'rgba(16, 185, 129, 0.15)' : 'transparent',
                  color: isActive ? '#34d399' : '#94a3b8',
                  fontWeight: isActive ? 600 : 500,
                  fontSize: '0.88rem',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease',
                  boxShadow: isActive ? 'inset 0 0 0 1px rgba(16, 185, 129, 0.35)' : 'none',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#f1f5f9';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.color = '#94a3b8';
                }}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Action controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            title={soundEnabled ? 'Mute Game Audio' : 'Unmute Game Audio'}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 36,
              height: 36,
              borderRadius: 8,
              background: 'rgba(30, 41, 59, 0.7)',
              border: '1px solid var(--border-subtle)',
              color: soundEnabled ? '#34d399' : '#64748b',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
          </button>

          {/* Prominent Play Game button */}
          <button
            onClick={() => onNavigate('game')}
            className="btn-primary"
            style={{
              padding: '8px 18px',
              fontSize: '0.88rem',
              letterSpacing: '0.5px',
            }}
          >
            <Play size={16} fill="#ffffff" />
            <span>PLAY GAME</span>
          </button>
        </div>
      </div>
    </header>
  );
};
