import React from 'react';
import { Cpu, Layers, Database, Compass, Target, Coins, Shield, Monitor } from 'lucide-react';

export const Architecture: React.FC = () => {
  const modules = [
    {
      name: 'User Interface Subsystem',
      swingEquivalent: 'JFrame, JPanel, KeyListener, MouseListener',
      webEquivalent: 'React 19 Functional Components, Canvas Event Handlers',
      description:
        'Handles rendering canvas frames, player input capture, tower selection palette, HUD updates, and control triggers.',
      icon: <Monitor size={22} color="#38bdf8" />,
    },
    {
      name: 'A* Pathfinding & AI Engine',
      swingEquivalent: 'AStar.java, Node.java, PriorityQueue',
      webEquivalent: 'AStar.ts with Min-Heap heuristic search',
      description:
        'Computes mathematically shortest path from Spawn to Base using Manhattan distance heuristic F(n) = G(n) + H(n). Recalculates routes around environmental crags.',
      icon: <Compass size={22} color="#a855f7" />,
    },
    {
      name: 'Defensive Tower & Combat Subsystem',
      swingEquivalent: 'Tower.java, Projectile.java, CombatEngine.java',
      webEquivalent: 'Tower.ts, Projectile.ts, VisualEffects.ts',
      description:
        'Coordinates targeting policies (First, Closest, Lowest HP), rotational tracking, firing intervals, hit detection, and AoE splash explosions.',
      icon: <Target size={22} color="#f59e0b" />,
    },
    {
      name: 'Enemy Navigation Subsystem',
      swingEquivalent: 'Enemy.java, WaypointNavigator.java',
      webEquivalent: 'Enemy.ts waypoint traversal loop',
      description:
        'Manages multi-class creep instances (Soldier, Scout Drone, Armored Mech) tracking health states, speed multipliers, and base breach damage.',
      icon: <Shield size={22} color="#f43f5e" />,
    },
    {
      name: 'Wave Spawner & Progression',
      swingEquivalent: 'WaveManager.java, javax.swing.Timer',
      webEquivalent: 'WaveManager.ts delta time queue',
      description:
        'Schedules sequential enemy groups across 10 progressive waves with scalable HP, speeds, and wave completion bounty bonuses.',
      icon: <Layers size={22} color="#10b981" />,
    },
    {
      name: 'Economy & Resource Management',
      swingEquivalent: 'Economy.java, BankAccount.java',
      webEquivalent: 'Economy.ts transaction manager',
      description:
        'Enforces transaction rules: starting capital, deployment expenditures, upgrade costs, kill dividends, and salvage refunds.',
      icon: <Coins size={22} color="#facc15" />,
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

      {/* System Hierarchy Block Diagram (Requirement #27) */}
      <div className="glass-panel-glow" style={{ padding: '36px', marginBottom: 48, textAlign: 'center' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#38bdf8', marginBottom: 20 }}>
          High-Level Architectural Decomposition
        </h3>

        {/* Visual ASCII / SVG Hierarchy Tree */}
        <div style={{
          fontFamily: 'monospace',
          fontSize: '0.85rem',
          lineHeight: 1.4,
          color: '#e2e8f0',
          background: 'rgba(15, 23, 42, 0.85)',
          padding: '24px 20px',
          borderRadius: 8,
          border: '1px solid var(--border-subtle)',
          overflowX: 'auto',
          display: 'inline-block',
          textAlign: 'left',
          width: '100%',
          maxWidth: 820,
        }}>
          <pre style={{ margin: 0 }}>
{`                            TOWER DEFENCE SYSTEM
                                     │
      ┌──────────────────────────────┼──────────────────────────────┐
      │                              │                              │
     GUI                         GAME LOGIC                     AI SYSTEM
      │                              │                              │
  Java Swing                    OOP Modules                  A* Pathfinding
 (Desktop App)                  ───────────                 (Manhattan Heuristic)
      │                     ┌────────┼────────┐                     │
  React Canvas              │        │        │               Enemy Navigation
  (Web Demo)              Towers  Enemies   Waves             Dynamic Recalculation
      │                     │        │        │
  User Input              Combat   Health  Progression
  (Mouse/Click)             │        │
                            └────────┴─── Economy / Coins`}
          </pre>
        </div>
      </div>

      {/* Detailed Module Breakdown */}
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

              <p style={{ color: '#94a3b8', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: 16 }}>
                {mod.description}
              </p>

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
