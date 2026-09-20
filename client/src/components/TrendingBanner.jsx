import React from 'react';
import { Flame, CheckCircle, Clock } from 'lucide-react';

export default function TrendingBanner({ issues = [] }) {
  const total = issues.length;
  const resolved = issues.filter(i => i.status === 'Resolved').length;
  const inProgress = issues.filter(i => i.status === 'In Progress').length;

  return (
    <div className="stats-banner">
      <div className="stats-info">
        <h2>
          <Flame color="#ef4444" size={22} />
          Local Lens Community Overview
        </h2>
        <p>Empowering citizens to report, track, and resolve neighborhood issues together.</p>
      </div>
      <div className="stats-counters">
        <div className="stat-box">
          <div className="stat-number">{total}</div>
          <div className="stat-label">Total Reported</div>
        </div>
        <div className="stat-box">
          <div className="stat-number" style={{ color: '#d97706' }}>{inProgress}</div>
          <div className="stat-label">In Progress</div>
        </div>
        <div className="stat-box">
          <div className="stat-number" style={{ color: '#059669' }}>{resolved}</div>
          <div className="stat-label">Resolved</div>
        </div>
      </div>
    </div>
  );
}
