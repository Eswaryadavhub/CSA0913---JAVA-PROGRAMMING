import React from 'react';
import { User, Award, BookOpen, GraduationCap, Shield } from 'lucide-react';

export const Team: React.FC = () => {
  const teamMembers = [
    {
      name: 'G. Shiva Dhanasekhar',
      regNo: '192311318',
      role: 'Project Developer',
    },
    {
      name: 'G. Venu Gopal Reddy',
      regNo: '192311303',
      role: 'Project Developer',
    },
    {
      name: 'K. Omkar Eswar',
      regNo: '192311431',
      role: 'Project Developer',
    },
  ];

  return (
    <div style={{ padding: '40px 24px 80px', maxWidth: 1000, margin: '0 auto', width: '100%' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: 44 }}>
        <span className="badge badge-cyan" style={{ marginBottom: 12 }}>Academic Capstone</span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 800, color: '#ffffff', marginBottom: 12 }}>
          Project Team & Faculty Guidance
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: 640, margin: '0 auto' }}>
          Course: <strong>CSA0913 – Programming in Java</strong>
        </p>
      </div>

      {/* Faculty Supervisor Card */}
      <div className="glass-panel-glow" style={{
        padding: '32px',
        marginBottom: 40,
        display: 'flex',
        alignItems: 'center',
        gap: 24,
        flexWrap: 'wrap',
      }}>
        <div style={{
          width: 64,
          height: 64,
          borderRadius: 16,
          background: 'rgba(56, 189, 248, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#38bdf8',
          flexShrink: 0,
        }}>
          <GraduationCap size={36} />
        </div>
        <div>
          <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px', color: '#38bdf8', fontWeight: 700, marginBottom: 4 }}>
            Faculty Supervisor
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#ffffff', marginBottom: 4 }}>
            Dr. MADHUMITHA K
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            Academic project guidance, evaluation, and algorithmic supervision.
          </p>
        </div>
      </div>

      {/* Student Team Grid */}
      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff', marginBottom: 20 }}>
        Student Project Investigators
      </h3>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: 20,
      }}>
        {teamMembers.map((member, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '28px' }}>
            <div style={{
              width: 50,
              height: 50,
              borderRadius: 12,
              background: 'rgba(30, 41, 59, 0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#38bdf8',
              marginBottom: 16,
            }}>
              <User size={26} />
            </div>

            <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: 6 }}>
              {member.name}
            </h4>

            <div style={{
              fontSize: '0.85rem',
              color: '#38bdf8',
              fontFamily: 'monospace',
              fontWeight: 600,
              marginBottom: 12,
            }}>
              Register No: {member.regNo}
            </div>

            <div style={{
              fontSize: '0.8rem',
              color: '#94a3b8',
              background: 'rgba(15, 23, 42, 0.6)',
              padding: '6px 10px',
              borderRadius: 6,
              display: 'inline-block',
            }}>
              {member.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
