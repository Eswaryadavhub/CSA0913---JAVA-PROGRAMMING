import React from 'react';
import { Cpu, Smartphone, Sparkles, Map, Shield, Zap, Cloud, Compass } from 'lucide-react';

export const FutureScope: React.FC = () => {
  const roadmapItems = [
    {
      title: 'Machine Learning & Adaptive AI Pathfinding',
      tag: 'AI Research',
      color: '#10b981',
      icon: <Cpu size={22} color="#10b981" />,
      description:
        'Transition from static A* heuristic evaluation to Deep Q-Networks (DQN) and Reinforcement Learning, allowing enemy creeps to dynamically learn the most vulnerable tower choke points over progressive games.',
    },
    {
      title: 'Procedural Map Generation with Cellular Automata',
      tag: 'Algorithm Engine',
      color: '#059669',
      icon: <Map size={22} color="#059669" />,
      description:
        'Implement procedural dungeon-generation algorithms (Perlin noise and cellular automata) that guarantee valid connected routes from spawn to base while creating infinite replayable terrain layouts.',
    },
    {
      title: 'Advanced Defensive Arsenal Expansion',
      tag: 'Gameplay',
      color: '#f59e0b',
      icon: <Shield size={22} color="#f59e0b" />,
      description:
        'Introduce specialized tier-4 structures including Cryogenic Stasis Projectors (slowing creeps by 60%), Tesla Lightning Coils (chain-arcing across 5 targets), and Flak Batteries (anti-air).',
    },
    {
      title: 'Adaptive Enemy Classes & Swarm Mechanics',
      tag: 'Creep AI',
      color: '#f43f5e',
      icon: <Zap size={22} color="#f43f5e" />,
      description:
        'Incorporate multi-spectral aerial drones immune to ground obstacles, burrowing subterranean units, and regenerating Boss Behemoths that deploy protective kinetic shields for adjacent creeps.',
    },
    {
      title: 'Tactical Commander Super-Abilities',
      tag: 'Mechanics',
      color: '#fbbf24',
      icon: <Sparkles size={22} color="#fbbf24" />,
      description:
        'Player-triggered emergency active abilities with tactical cooldowns: Tactical Ion Cannon Strike (clearing a 100px radius), Tactical EMP Shockwave (disabling creep movement for 4s), and Field Nanite Repairs.',
    },
    {
      title: 'Native Android & iOS Cross-Platform Deployment',
      tag: 'Deployment',
      color: '#34d399',
      icon: <Smartphone size={22} color="#34d399" />,
      description:
        'Package the web application into native mobile builds for Android and iOS using Capacitor, featuring touch-optimized drag-and-drop turret emplacements, haptic feedback, and offline persistence.',
    },
  ];

  return (
    <div style={{ padding: '40px 24px 80px', maxWidth: 1150, margin: '0 auto', width: '100%' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <span className="badge badge-purple" style={{ marginBottom: 12 }}>Strategic Roadmap</span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>
          Future Scope & Technical Roadmap
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 740, margin: '0 auto' }}>
          Identified pathways for extending the Tower Defence project beyond the undergraduate capstone scope,
          incorporating modern algorithmic and cross-platform advancements.
        </p>
      </div>

      {/* Roadmap Cards Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: 24,
      }}>
        {roadmapItems.map((item, index) => (
          <div key={index} className="glass-panel" style={{ padding: '28px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 44,
                height: 44,
                borderRadius: 10,
                background: 'rgba(30, 41, 59, 0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {item.icon}
              </div>
              <span className="badge" style={{
                background: 'rgba(255, 255, 255, 0.05)',
                color: item.color,
                borderColor: `${item.color}40`,
                fontSize: '0.72rem',
              }}>
                {item.tag}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', marginBottom: 10 }}>
              {item.title}
            </h3>

            <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
