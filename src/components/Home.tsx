import React from 'react';
import { Play, BookOpen, Cpu, Shield, Zap, Target, Coins, Compass, ArrowRight } from 'lucide-react';
import { PageId } from './Navbar';

interface HomeProps {
  onNavigate: (page: PageId) => void;
}

export const Home: React.FC<HomeProps> = ({ onNavigate }) => {
  return (
    <div style={{ padding: '40px 24px 80px', maxWidth: 1200, margin: '0 auto', width: '100%' }}>
      {/* Hero Section */}
      <section style={{
        textAlign: 'center',
        padding: '50px 20px 60px',
        position: 'relative',
      }}>
        {/* Academic Course Badge */}
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
          <span className="badge badge-cyan">CSA0913 – Programming in Java</span>
          <span className="badge badge-purple">Capstone Project Demonstration</span>
        </div>

        {/* Title */}
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 900,
          letterSpacing: '-1.5px',
          lineHeight: 1.1,
          color: '#ffffff',
          marginBottom: 16,
        }}>
          Tower Defence Game
        </h1>

        {/* Subtitle */}
        <h2 style={{
          fontSize: 'clamp(1.2rem, 2.5vw, 1.8rem)',
          fontWeight: 600,
          color: '#38bdf8',
          letterSpacing: '-0.5px',
          marginBottom: 24,
        }}>
          Using Java Swing with Intelligent Enemy Pathfinding
        </h2>

        {/* Supporting Text */}
        <p style={{
          fontSize: '1.15rem',
          color: '#94a3b8',
          maxWidth: 820,
          margin: '0 auto 36px',
          lineHeight: 1.7,
        }}>
          “A strategic Tower Defence game demonstrating Object-Oriented Programming, A* pathfinding,
          tower placement, combat, upgrades, resource management and wave-based enemy progression.”
        </p>

        {/* Primary CTA Buttons */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16,
          flexWrap: 'wrap',
        }}>
          <button
            onClick={() => onNavigate('game')}
            className="btn-primary"
            style={{
              padding: '14px 32px',
              fontSize: '1.05rem',
              letterSpacing: '0.5px',
            }}
          >
            <Play size={20} fill="#ffffff" />
            <span>PLAY GAME</span>
          </button>

          <button
            onClick={() => onNavigate('about')}
            className="btn-secondary"
            style={{
              padding: '14px 28px',
              fontSize: '1.05rem',
            }}
          >
            <BookOpen size={19} />
            <span>EXPLORE PROJECT</span>
          </button>

          <button
            onClick={() => onNavigate('how-it-works')}
            className="btn-secondary"
            style={{
              padding: '14px 28px',
              fontSize: '1.05rem',
              borderColor: 'rgba(56, 189, 248, 0.4)',
              color: '#38bdf8',
            }}
          >
            <Compass size={19} />
            <span>VISUALIZE A*</span>
          </button>
        </div>
      </section>

      {/* Visual Game Elements Preview Strip */}
      <section style={{
        marginTop: 20,
        marginBottom: 60,
      }}>
        <div className="glass-panel" style={{
          padding: '28px 32px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: 24,
          alignItems: 'center',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'rgba(56, 189, 248, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
            }}>
              <Compass size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>A* Pathfinding</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Dynamic heuristic routing</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#10b981',
            }}>
              <Shield size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>Tactical Towers</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Gatling, Pulse & Plasma</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'rgba(244, 63, 94, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f43f5e',
            }}>
              <Zap size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>Enemy Waves</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>10 Progressive challenges</div>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div style={{
              width: 44,
              height: 44,
              borderRadius: 10,
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b',
            }}>
              <Coins size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, color: '#f8fafc', fontSize: '0.95rem' }}>Economy System</div>
              <div style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Resource and upgrades</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Architectural Pillars */}
      <section style={{ marginBottom: 60 }}>
        <div style={{ textAlign: 'center', marginBottom: 36 }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#ffffff', marginBottom: 8 }}>
            Core Academic Pillars
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1rem', maxWidth: 600, margin: '0 auto' }}>
            System design implementing fundamental computer science paradigms and algorithms
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: 24,
        }}>
          {/* Card 1: OOP & Java Design */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              display: 'inline-flex',
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(56, 189, 248, 0.12)',
              color: '#38bdf8',
              marginBottom: 16,
            }}>
              <Cpu size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
              Object-Oriented Architecture
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 16 }}>
              Modular class hierarchies modeling Entities, Towers, Projectiles, and the Game Loop.
              Reflects the architectural principles established in the original Java Swing desktop framework.
            </p>
            <button
              onClick={() => onNavigate('architecture')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                color: '#38bdf8',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              <span>Explore Architecture</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 2: A* Pathfinding */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              display: 'inline-flex',
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(168, 85, 247, 0.12)',
              color: '#c084fc',
              marginBottom: 16,
            }}>
              <Compass size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
              Intelligent A* Navigation
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 16 }}>
              Real graph search using Manhattan heuristic F(n) = G(n) + H(n). Explores nodes using Open and Closed priority sets
              to determine mathematically optimal routes around terrain barriers.
            </p>
            <button
              onClick={() => onNavigate('how-it-works')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                color: '#c084fc',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              <span>Inspect A* Formula</span>
              <ArrowRight size={14} />
            </button>
          </div>

          {/* Card 3: Verification & Test Rigor */}
          <div className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              display: 'inline-flex',
              padding: '10px',
              borderRadius: '8px',
              background: 'rgba(16, 185, 129, 0.12)',
              color: '#34d399',
              marginBottom: 16,
            }}>
              <Target size={26} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
              Formal Test Verification
            </h3>
            <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: 16 }}>
              18 comprehensive test cases (TC01 to TC18) verifying tower placement, targeting, economy math,
              wave progression, and path recalculation with automated execution.
            </p>
            <button
              onClick={() => onNavigate('testing')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 6,
                background: 'none',
                border: 'none',
                color: '#34d399',
                fontWeight: 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
              }}
            >
              <span>View Test Matrix</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </section>

      {/* Quick Launch Banner */}
      <section className="glass-panel-glow" style={{
        padding: '36px 40px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: 24,
      }}>
        <div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: 6 }}>
            Ready to test tactical defense strategies?
          </h3>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Select your difficulty level, place turrets along the 18x12 grid, and observe intelligent enemy routing.
          </p>
        </div>
        <button
          onClick={() => onNavigate('game')}
          className="btn-primary"
          style={{
            padding: '12px 28px',
            fontSize: '1rem',
          }}
        >
          <Play size={18} fill="#ffffff" />
          <span>START PLAYING NOW</span>
        </button>
      </section>
    </div>
  );
};
