import React, { useState, useMemo } from 'react';
import { Navbar, PageId } from './components/Navbar';
import { Home } from './components/Home';
import { About } from './components/About';
import { GameView } from './components/Game/GameView';
import { AStarVisualizer } from './components/AStarVisualizer';
import { Architecture } from './components/Architecture';
import { TestingResults } from './components/TestingResults';
import { FutureScope } from './components/FutureScope';
import { Team } from './components/Team';
import { GameEngine } from './game/GameEngine';
import { soundManager } from './game/SoundManager';
import { Shield } from 'lucide-react';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageId>('home');
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Singleton game engine instance
  const engine = useMemo(() => new GameEngine(), []);

  const handleToggleSound = () => {
    const next = soundManager.toggle();
    setSoundEnabled(next);
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Navigation Bar */}
      <Navbar
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />

      {/* Main Active Page View */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentPage === 'home' && <Home onNavigate={setCurrentPage} />}
        {currentPage === 'about' && <About />}
        {currentPage === 'game' && (
          <GameView
            engine={engine}
            onNavigateHome={() => setCurrentPage('home')}
            onNavigateHowItWorks={() => setCurrentPage('how-it-works')}
          />
        )}
        {currentPage === 'how-it-works' && <AStarVisualizer />}
        {currentPage === 'architecture' && <Architecture />}
        {currentPage === 'testing' && <TestingResults />}
        {currentPage === 'future-scope' && <FutureScope />}
        {currentPage === 'team' && <Team />}
      </main>

      {/* Academic Capstone Footer */}
      <footer style={{
        background: 'rgba(9, 13, 22, 0.95)',
        borderTop: '1px solid var(--border-subtle)',
        padding: '32px 24px',
        marginTop: 'auto',
      }}>
        <div style={{
          maxWidth: 1200,
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: 20,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 32,
              height: 32,
              borderRadius: 6,
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}>
              <Shield size={18} color="#ffffff" />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#f8fafc' }}>
                Tower Defence Game Using Java Swing with Intelligent Enemy Pathfinding
              </div>
              <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                Course: CSA0913 – Programming in Java | Capstone Academic Project
              </div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'right' }}>
            <div>Developed by: G. Shiva Dhanasekhar, G. Venu Gopal Reddy, K. Omkar Eswar</div>
            <div>Supervisor: Dr. MADHUMITHA K</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default App;
