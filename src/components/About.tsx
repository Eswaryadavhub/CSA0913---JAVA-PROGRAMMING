import React from 'react';
import { UserCheck, ShieldCheck, Target, Layers, Compass, Cpu, RefreshCw, Award } from 'lucide-react';

export const About: React.FC = () => {
  const objectives = [
    {
      id: 1,
      title: 'Develop an Interactive Tower Defence Game Using OOP & Java Swing',
      description:
        'Engineer a complete strategic game architecture applying core Object-Oriented principles (Encapsulation, Inheritance, Polymorphism) with robust component structure.',
      icon: <Cpu size={24} color="#10b981" />,
    },
    {
      id: 2,
      title: 'Implement Intelligent Enemy Navigation Using the A* Pathfinding Algorithm',
      description:
        'Formulate real-time heuristic path calculation ($F = G + H$) allowing autonomous creeps to dynamically discover the optimal route from spawn portal to base while avoiding environmental crags.',
      icon: <Compass size={24} color="#f59e0b" />,
    },
    {
      id: 3,
      title: 'Design Multiple Tower Types with Unique Combat & Upgrade Behaviours',
      description:
        'Architect distinct defensive classes (Basic Gatling, Rapid Pulse Laser, Heavy Plasma Mortar) featuring customized range, firing cooldowns, targeting priorities, and multi-tier upgrade paths.',
      icon: <Target size={24} color="#10b981" />,
    },
    {
      id: 4,
      title: 'Develop an Economy System for Coins, Purchasing & Resource Management',
      description:
        'Implement an integrated financial ecosystem regulating initial budgets, turret deployment expenditures, enemy bounty rewards, and wave completion dividends.',
      icon: <ShieldCheck size={24} color="#f59e0b" />,
    },
    {
      id: 5,
      title: 'Implement Wave-Based Enemy Spawning with Balanced Difficulty Progression',
      description:
        'Design a 10-wave staged escalation engine featuring graduated enemy durability, varied movement tempos, and selectable difficulty configurations (Easy, Medium, Hard).',
      icon: <Layers size={24} color="#f43f5e" />,
    },
  ];

  return (
    <div style={{ padding: '40px 24px 80px', maxWidth: 1150, margin: '0 auto', width: '100%' }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span className="badge badge-cyan" style={{ marginBottom: 12 }}>Academic Capstone Project</span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>
          Project Overview & Academic Context
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 750, margin: '0 auto' }}>
          Final Year Engineering Capstone demonstrating practical application of data structures, graph search algorithms, and object-oriented system design.
        </p>
      </div>

      {/* Project Meta Card */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: 48 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: 28,
        }}>
          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#10b981', fontWeight: 700, marginBottom: 6 }}>
              Project Title
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', lineHeight: 1.4 }}>
              Tower Defence Game Using Java Swing with Intelligent Enemy Pathfinding
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#10b981', fontWeight: 700, marginBottom: 6 }}>
              Course
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              CSA0913 – Programming in Java
            </div>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#10b981', fontWeight: 700, marginBottom: 6 }}>
              Faculty Supervisor
            </div>
            <div style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff' }}>
              Dr. MADHUMITHA K
            </div>
          </div>
        </div>

        <div style={{
          marginTop: 24,
          paddingTop: 24,
          borderTop: '1px solid var(--border-subtle)',
        }}>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#10b981', fontWeight: 700, marginBottom: 12 }}>
            Project Team Members
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: 16,
          }}>
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontWeight: 700, color: '#f8fafc' }}>G. Shiva Dhanasekhar</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Reg: 192311318</div>
            </div>

            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontWeight: 700, color: '#f8fafc' }}>G. Venu Gopal Reddy</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Reg: 192311303</div>
            </div>

            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              padding: '12px 16px',
              borderRadius: 8,
              border: '1px solid var(--border-subtle)',
            }}>
              <div style={{ fontWeight: 700, color: '#f8fafc' }}>K. Omkar Eswar</div>
              <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>Reg: 192311431</div>
            </div>
          </div>
        </div>
      </div>

      {/* Project Objectives (Requirement #7) */}
      <div style={{ marginBottom: 56 }}>
        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: 20 }}>
          Project Objectives
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 16 }}>
          {objectives.map((obj) => (
            <div key={obj.id} className="glass-panel" style={{
              padding: '20px 24px',
              display: 'flex',
              alignItems: 'flex-start',
              gap: 20,
            }}>
              <div style={{
                width: 48,
                height: 48,
                borderRadius: 10,
                background: 'rgba(30, 41, 59, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                {obj.icon}
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                  <span className="badge badge-cyan" style={{ fontSize: '0.7rem' }}>Objective #{obj.id}</span>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc' }}>
                    {obj.title}
                  </h3>
                </div>
                <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.5 }}>
                  {obj.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Original Java Swing Project Connection (Requirement #28) */}
      <div className="glass-panel-glow" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
          <RefreshCw size={24} color="#10b981" />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
            Original Java Project Connection & Architectural Mapping
          </h2>
        </div>

        <p style={{ color: '#cbd5e1', fontSize: '0.98rem', lineHeight: 1.7, marginBottom: 24 }}>
          <strong>Important Clarification:</strong> The original academic implementation uses <strong>Java Swing</strong> and
          <strong> Object-Oriented Programming</strong>. This web application provides an interactive browser-based demonstration
          of the exact same game concepts, data structures, and system design, allowing interactive evaluation and viva review.
        </p>

        {/* Comparison Table */}
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse',
            textAlign: 'left',
            fontSize: '0.92rem',
          }}>
            <thead>
              <tr style={{ background: 'rgba(30, 41, 59, 0.7)', borderBottom: '2px solid var(--border-accent)' }}>
                <th style={{ padding: '14px 16px', color: '#34d399', fontWeight: 700 }}>Architectural Component</th>
                <th style={{ padding: '14px 16px', color: '#f8fafc', fontWeight: 700 }}>Original Project (Java Swing)</th>
                <th style={{ padding: '14px 16px', color: '#10b981', fontWeight: 700 }}>Web Demonstration (React + Canvas)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 16px', color: '#e2e8f0', fontWeight: 600 }}>GUI Framework</td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}><code>JFrame</code>, <code>JPanel</code>, Swing Layouts</td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>React 19 Components + Modern CSS</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 16px', color: '#e2e8f0', fontWeight: 600 }}>Graphics Rendering</td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}><code>Graphics2D.paintComponent()</code></td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>HTML5 2D Canvas Context API</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 16px', color: '#e2e8f0', fontWeight: 600 }}>Game Execution Loop</td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}><code>javax.swing.Timer</code> / Background Thread</td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}><code>requestAnimationFrame</code> 60 FPS Delta Loop</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 16px', color: '#e2e8f0', fontWeight: 600 }}>Pathfinding Engine</td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}><code>AStar.java</code> (PriorityQueue, Manhattan)</td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}><code>AStar.ts</code> (Identical Open/Closed sets & heuristic)</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '14px 16px', color: '#e2e8f0', fontWeight: 600 }}>OOP Entities</td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}><code>Tower.java</code>, <code>Enemy.java</code>, <code>Projectile.java</code></td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>TypeScript ES6 Classes preserving identical OOP model</td>
              </tr>
              <tr>
                <td style={{ padding: '14px 16px', color: '#e2e8f0', fontWeight: 600 }}>Audio Management</td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}><code>javax.sound.sampled.Clip</code></td>
                <td style={{ padding: '14px 16px', color: '#94a3b8' }}>Web Audio API Procedural Synthesizer</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Core Java & OOP Paradigms (STEP 7) */}
        <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border-subtle)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Cpu size={20} color="#10b981" />
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
                Java & Object-Oriented Programming (OOP) Core Pillars
              </h3>
            </div>
            <span className="badge badge-emerald" style={{ fontSize: '0.74rem' }}>
              Academic Source: /java-source/
            </span>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: 14,
          }}>
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#34d399', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                Java & Java Swing GUI
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Desktop GUI built with <code style={{ color: '#cbd5e1' }}>JFrame</code>, <code style={{ color: '#cbd5e1' }}>JPanel</code>, and custom <code style={{ color: '#cbd5e1' }}>paintComponent(Graphics2D)</code> rendering loop.
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                Classes & Objects
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Modular domain entities (<code style={{ color: '#cbd5e1' }}>Tower</code>, <code style={{ color: '#cbd5e1' }}>Enemy</code>, <code style={{ color: '#cbd5e1' }}>Projectile</code>, <code style={{ color: '#cbd5e1' }}>Economy</code>, <code style={{ color: '#cbd5e1' }}>AStarNode</code>) instantiated dynamically.
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#fbbf24', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                Encapsulation
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Internal health and currency state fields remain private, exposed solely via validated methods (<code style={{ color: '#cbd5e1' }}>takeDamage()</code>, <code style={{ color: '#cbd5e1' }}>spend()</code>).
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#f59e0b', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                Inheritance & Polymorphism
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Shared entity hierarchy with polymorphic targeting policies (<code style={{ color: '#cbd5e1' }}>TargetingMode</code>) and distinct subclass combat behaviors.
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#ef4444', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                Event Handling & Controls
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Interactive listener architecture (<code style={{ color: '#cbd5e1' }}>KeyListener</code>, <code style={{ color: '#cbd5e1' }}>MouseListener</code>) processing keyboard hotkeys and grid clicks.
              </div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px 16px', borderRadius: 8, border: '1px solid var(--border-subtle)' }}>
              <div style={{ color: '#10b981', fontWeight: 700, fontSize: '0.88rem', marginBottom: 4 }}>
                A* Pathfinding Algorithm
              </div>
              <div style={{ color: '#94a3b8', fontSize: '0.82rem', lineHeight: 1.5 }}>
                Heuristic graph search algorithm ($F = G + H$) with priority queue evaluation for real-time obstacle-aware enemy navigation.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
