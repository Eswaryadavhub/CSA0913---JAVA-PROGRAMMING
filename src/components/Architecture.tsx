import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Compass,
  Target,
  Coins,
  Shield,
  Monitor,
  Activity,
  Eye,
  User,
  Gamepad2,
  ArrowDown,
  Code2,
} from 'lucide-react';

export const Architecture: React.FC = () => {
  const [showAsciiView, setShowAsciiView] = useState<boolean>(false);

  // 7 Core Architectural Components aligned with Project Block Diagram (STEP 3)
  const modules = [
    {
      name: '1. User Interface & Game Initialization',
      swingEquivalent: 'JFrame, JPanel, KeyListener, MouseListener',
      webEquivalent: 'React 19 Functional Components, Canvas Event Handlers',
      description:
        'Handles player interaction, game initialization, configuration setup, and user event dispatching through interactive controls and mouse/keyboard listeners.',
      features: [
        'Java Swing Interface & Layouts',
        'Player interaction & input binding',
        'Game initialization & reset routines',
        'Difficulty and game setup parameters',
      ],
      icon: <Monitor size={22} color="#38bdf8" />,
    },
    {
      name: '2. Enemy & Wave Management',
      swingEquivalent: 'WaveManager.java, Enemy.java, javax.swing.Timer',
      webEquivalent: 'WaveManager.ts, Enemy.ts, wavesData.ts',
      description:
        'Schedules sequential enemy cohorts across 10 progressive waves with scalable HP, speeds, and bounty rewards, regulating real-time creep movement along waypoints.',
      features: [
        'Enemy spawning & timing queues',
        'Wave generation & progression scaling',
        'Multi-class enemy attributes (HP, speed, armor)',
        'Real-time enemy movement along grid paths',
      ],
      icon: <Layers size={22} color="#10b981" />,
    },
    {
      name: '3. A* Pathfinding',
      swingEquivalent: 'AStar.java, Node.java, PriorityQueue',
      webEquivalent: 'AStar.ts with Min-Heap heuristic search',
      description:
        'Computes mathematically shortest path from Spawn portal to Base using Manhattan distance heuristic F(n) = G(n) + H(n), dynamically routing around environmental obstacles.',
      features: [
        'Intelligent autonomous enemy navigation',
        'Optimal shortest path calculation (Open/Closed sets)',
        'Obstacle-aware movement and real-time rerouting',
        'Dynamic heuristic cost evaluation',
      ],
      icon: <Compass size={22} color="#a855f7" />,
    },
    {
      name: '4. Tower Placement & Combat',
      swingEquivalent: 'Tower.java, Projectile.java, CombatEngine.java',
      webEquivalent: 'Tower.ts, Projectile.ts, VisualEffects.ts',
      description:
        'Coordinates tactical tower placement on valid grid coordinates, attack range circle detection, targeting heuristics, ballistic physics, and damage calculation.',
      features: [
        'Strategic tower placement validation',
        'Attack range detection circles',
        'Target selection (First, Closest, Lowest HP)',
        'Different tower behaviours (Gatling, Pulse, Plasma)',
        'Damage and area-of-effect splash calculations',
      ],
      icon: <Target size={22} color="#f59e0b" />,
    },
    {
      name: '5. Upgrade & Resource Management',
      swingEquivalent: 'Economy.java, BankAccount.java',
      webEquivalent: 'Economy.ts transaction manager',
      description:
        'Enforces transaction rules: starting capital, deployment expenditures, multi-tier turret upgrades, enemy bounty collection, and defensive salvage refunds.',
      features: [
        'Coin and resource collection from fallen creeps',
        'Tower purchasing transactions',
        'Tier-based tower upgrades (Rank 1 to Rank 3)',
        'Damage, range and attack speed improvements',
      ],
      icon: <Coins size={22} color="#facc15" />,
    },
    {
      name: '6. Game State Management',
      swingEquivalent: 'GameState.java, GameEngine.java, Observer/ChangeListener',
      webEquivalent: 'GameEngine.ts state controller & telemetry',
      description:
        'Central coordinator orchestrating global simulation state (START, PLAYING, PAUSED, GAME_OVER, VICTORY), tracking base integrity, active creep populations, and wave milestones.',
      features: [
        'Player health & base status tracking',
        'Real-time enemy health management',
        'Wave progress & remaining creep counter',
        'Game lifecycle & win/loss evaluation',
      ],
      icon: <Activity size={22} color="#ef4444" />,
    },
    {
      name: '7. Visual Game Output',
      swingEquivalent: 'Graphics2D.paintComponent(), SwingUtilities.invokeLater',
      webEquivalent: 'HTML5 2D Canvas Context API, GameHUD.tsx, VisualEffects.ts',
      description:
        'Renders high-fidelity visual output at 60 FPS: 3D-shaded defensive bastions, rotating barrels, projectile tracer beams, particle explosions, enemy health bars, and HUD stats.',
      features: [
        'Interactive game interface & grid rendering',
        'Smooth enemy movement visualization',
        'Tower attacks, tracer lines, and particle bursts',
        'Real-time resource, wave, and health HUD display',
      ],
      icon: <Eye size={22} color="#06b6d4" />,
    },
  ];

  return (
    <div style={{ padding: '40px 24px 80px', maxWidth: 1150, margin: '0 auto', width: '100%' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span className="badge badge-purple" style={{ marginBottom: 12 }}>System Architecture</span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>
          Modular Architecture & System Design
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 740, margin: '0 auto' }}>
          Structural decomposition of the Tower Defence application illustrating the correspondence
          between Java Swing desktop abstractions and the browser implementation.
        </p>
      </div>

      {/* Project Architecture Block Diagram (STEP 5) */}
      <div className="glass-panel-glow" style={{ padding: '36px 28px', marginBottom: 48, textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 24 }}>
          <div style={{ textAlign: 'left' }}>
            <span className="badge badge-cyan" style={{ marginBottom: 6 }}>Architecture Flowchart</span>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#f8fafc' }}>
              Tower Defence Game System Architecture
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.88rem', margin: 0 }}>
              End-to-end dataflow from player input to visual game output
            </p>
          </div>

          <button
            onClick={() => setShowAsciiView(!showAsciiView)}
            className="btn-secondary"
            style={{
              padding: '8px 16px',
              fontSize: '0.82rem',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Code2 size={15} />
            <span>{showAsciiView ? 'Show Visual Diagram' : 'Show Monospace ASCII Diagram'}</span>
          </button>
        </div>

        {/* Visual Diagram Representation matching existing style */}
        {!showAsciiView ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 12,
            maxWidth: 720,
            margin: '0 auto',
          }}>
            {/* 1. PLAYER INPUT */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.25), rgba(56, 189, 248, 0.15))',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              borderRadius: 10,
              padding: '12px 28px',
              color: '#f8fafc',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 4px 16px rgba(56, 189, 248, 0.1)',
            }}>
              <User size={18} color="#38bdf8" />
              <span>PLAYER INPUT</span>
            </div>

            <ArrowDown size={20} color="#38bdf8" />

            {/* 2. GAME INITIALIZATION */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.85)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 10,
              padding: '12px 28px',
              color: '#f8fafc',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <Gamepad2 size={18} color="#a855f7" />
              <span>GAME INITIALIZATION</span>
            </div>

            <ArrowDown size={20} color="#a855f7" />

            {/* 3. GAME CONTROL SYSTEM */}
            <div style={{
              background: 'rgba(30, 41, 59, 0.95)',
              border: '1px solid rgba(168, 85, 247, 0.4)',
              borderRadius: 10,
              padding: '12px 32px',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 4px 16px rgba(168, 85, 247, 0.15)',
            }}>
              <Cpu size={18} color="#c084fc" />
              <span>GAME CONTROL SYSTEM</span>
            </div>

            <ArrowDown size={20} color="#c084fc" />

            {/* Parallel Split Container */}
            <div style={{
              width: '100%',
              background: 'rgba(15, 23, 42, 0.75)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 14,
              padding: '24px 20px',
              position: 'relative',
            }}>
              <div style={{
                position: 'absolute',
                top: -11,
                left: '50%',
                transform: 'translateX(-50%)',
                background: 'rgba(15, 23, 42, 1)',
                padding: '2px 14px',
                borderRadius: 20,
                fontSize: '0.72rem',
                color: '#94a3b8',
                letterSpacing: '0.5px',
                border: '1px solid var(--border-subtle)',
              }}>
                PARALLEL SUBSYSTEM PROCESSING
              </div>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                gap: 20,
                alignItems: 'start',
              }}>
                {/* Left Branch: Enemy Pipeline */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <div style={{
                    width: '100%',
                    background: 'rgba(244, 63, 94, 0.12)',
                    border: '1px solid rgba(244, 63, 94, 0.35)',
                    borderRadius: 8,
                    padding: '11px 16px',
                    color: '#f8fafc',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}>
                    <Layers size={16} color="#f43f5e" />
                    <span>ENEMY & WAVE MANAGEMENT</span>
                  </div>

                  <ArrowDown size={18} color="#f43f5e" />

                  <div style={{
                    width: '100%',
                    background: 'rgba(168, 85, 247, 0.12)',
                    border: '1px solid rgba(168, 85, 247, 0.35)',
                    borderRadius: 8,
                    padding: '11px 16px',
                    color: '#f8fafc',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}>
                    <Compass size={16} color="#c084fc" />
                    <span>A* PATHFINDING</span>
                  </div>

                  <ArrowDown size={18} color="#c084fc" />

                  <div style={{
                    width: '100%',
                    background: 'rgba(244, 63, 94, 0.15)',
                    border: '1px solid rgba(244, 63, 94, 0.4)',
                    borderRadius: 8,
                    padding: '11px 16px',
                    color: '#f8fafc',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}>
                    <Shield size={16} color="#f43f5e" />
                    <span>ENEMY MOVEMENT</span>
                  </div>
                </div>

                {/* Right Branch: Tower Pipeline */}
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 10,
                }}>
                  <div style={{
                    width: '100%',
                    background: 'rgba(56, 189, 248, 0.12)',
                    border: '1px solid rgba(56, 189, 248, 0.35)',
                    borderRadius: 8,
                    padding: '11px 16px',
                    color: '#f8fafc',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}>
                    <Monitor size={16} color="#38bdf8" />
                    <span>TOWER MANAGEMENT</span>
                  </div>

                  <ArrowDown size={18} color="#38bdf8" />

                  <div style={{
                    width: '100%',
                    background: 'rgba(16, 185, 129, 0.12)',
                    border: '1px solid rgba(16, 185, 129, 0.35)',
                    borderRadius: 8,
                    padding: '11px 16px',
                    color: '#f8fafc',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}>
                    <Target size={16} color="#10b981" />
                    <span>TOWER PLACEMENT</span>
                  </div>

                  <ArrowDown size={18} color="#10b981" />

                  <div style={{
                    width: '100%',
                    background: 'rgba(245, 158, 11, 0.15)',
                    border: '1px solid rgba(245, 158, 11, 0.4)',
                    borderRadius: 8,
                    padding: '11px 16px',
                    color: '#f8fafc',
                    fontWeight: 700,
                    fontSize: '0.86rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                  }}>
                    <Target size={16} color="#f59e0b" />
                    <span>COMBAT SYSTEM</span>
                  </div>
                </div>
              </div>
            </div>

            <ArrowDown size={20} color="#ef4444" />

            {/* 4. GAME STATE */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(244, 63, 94, 0.15))',
              border: '1px solid rgba(239, 68, 68, 0.45)',
              borderRadius: 10,
              padding: '12px 36px',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 4px 18px rgba(239, 68, 68, 0.2)',
            }}>
              <Activity size={18} color="#ef4444" />
              <span>GAME STATE</span>
            </div>

            <ArrowDown size={20} color="#facc15" />

            {/* 5. RESOURCE & UPGRADE SYSTEM */}
            <div style={{
              background: 'rgba(245, 158, 11, 0.15)',
              border: '1px solid rgba(245, 158, 11, 0.4)',
              borderRadius: 10,
              padding: '12px 30px',
              color: '#f8fafc',
              fontWeight: 700,
              fontSize: '0.95rem',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}>
              <Coins size={18} color="#facc15" />
              <span>RESOURCE & UPGRADE SYSTEM</span>
            </div>

            <ArrowDown size={20} color="#06b6d4" />

            {/* 6. VISUAL GAME OUTPUT */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.25), rgba(56, 189, 248, 0.2))',
              border: '1px solid rgba(6, 182, 212, 0.45)',
              borderRadius: 10,
              padding: '12px 36px',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1rem',
              letterSpacing: '0.5px',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              boxShadow: '0 4px 18px rgba(6, 182, 212, 0.2)',
            }}>
              <Eye size={18} color="#06b6d4" />
              <span>VISUAL GAME OUTPUT</span>
            </div>
          </div>
        ) : (
          /* STEP 5 Exact Monospace ASCII Block Diagram */
          <div style={{
            fontFamily: 'monospace',
            fontSize: '0.85rem',
            lineHeight: 1.45,
            color: '#e2e8f0',
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '24px 20px',
            borderRadius: 8,
            border: '1px solid var(--border-subtle)',
            overflowX: 'auto',
            display: 'inline-block',
            textAlign: 'left',
            width: '100%',
            maxWidth: 680,
          }}>
            <pre style={{ margin: 0 }}>
{`PLAYER INPUT
     ↓
GAME INITIALIZATION
     ↓
GAME CONTROL SYSTEM
     ↓
 ┌───────────────────────────────────────┐
 │                                       │
 ↓                                       ↓
ENEMY & WAVE MANAGEMENT          TOWER MANAGEMENT
 │                                       │
 ↓                                       ↓
A* PATHFINDING                    TOWER PLACEMENT
 │                                       │
 ↓                                       ↓
ENEMY MOVEMENT                    COMBAT SYSTEM
 │                                       │
 └───────────────→ GAME STATE ←──────────┘
                        ↓
              RESOURCE & UPGRADE SYSTEM
                        ↓
                 VISUAL GAME OUTPUT`}
            </pre>
          </div>
        )}
      </div>

      {/* Detailed Module Breakdown (STEP 3) */}
      <div style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: 20 }}>
          Core Module Specification & Cross-Platform Mapping
        </h2>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: 20,
        }}>
          {modules.map((mod, index) => (
            <div key={index} className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                <div style={{
                  width: 40,
                  height: 40,
                  borderRadius: 8,
                  background: 'rgba(30, 41, 59, 0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  {mod.icon}
                </div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                  {mod.name}
                </h3>
              </div>

              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: 14 }}>
                {mod.description}
              </p>

              {/* Specific features from block diagram */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.5px', color: '#38bdf8', fontWeight: 700, marginBottom: 6 }}>
                  Architectural Capabilities:
                </div>
                <ul style={{ margin: 0, paddingLeft: 18, color: '#cbd5e1', fontSize: '0.82rem', lineHeight: 1.5 }}>
                  {mod.features.map((feat, fIdx) => (
                    <li key={fIdx}>{feat}</li>
                  ))}
                </ul>
              </div>

              <div style={{
                background: 'rgba(15, 23, 42, 0.6)',
                padding: '10px 12px',
                borderRadius: 6,
                fontSize: '0.76rem',
                display: 'flex',
                flexDirection: 'column',
                gap: 6,
              }}>
                <div>
                  <span style={{ color: '#f59e0b', fontWeight: 600 }}>Java Swing: </span>
                  <code style={{ color: '#cbd5e1' }}>{mod.swingEquivalent}</code>
                </div>
                <div>
                  <span style={{ color: '#10b981', fontWeight: 600 }}>Web React: </span>
                  <code style={{ color: '#cbd5e1' }}>{mod.webEquivalent}</code>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
