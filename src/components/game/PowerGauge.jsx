import { memo } from 'react';

const PowerGauge = memo(function PowerGauge({ power, fatigue }) {
  // 파워 게이지 색상
  const getPowerColor = (p) => {
    if (p >= 70) return 'bg-team-player-light';
    if (p >= 40) return 'bg-accent-gold';
    return 'bg-danger';
  };

  // 피로도 게이지 색상
  const getFatigueColor = (f) => {
    if (f >= 90) return 'bg-danger';
    if (f >= 60) return 'bg-accent-gold';
    return 'bg-team-player-light';
  };

  return (
    <div className="w-full px-4 space-y-2">
      {/* 파워 */}
      <div>
        <div className="flex justify-between text-xs mb-0.5">
          <span className="text-text-muted">💪 파워</span>
          <span className="font-mono text-text-secondary">{Math.round(power)}%</span>
        </div>
        <div className="h-3 bg-white/10 rounded-full border border-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-100 ${getPowerColor(power)}`}
            style={{ width: `${Math.min(100, power)}%` }}
          />
        </div>
      </div>

      {/* 피로도 */}
      <div>
        <div className="flex justify-between text-xs mb-0.5">
          <span className="text-text-muted">🔥 피로도</span>
          <span className={`font-mono ${fatigue >= 60 ? 'text-danger' : 'text-text-secondary'}`}>
            {Math.round(fatigue)}%
          </span>
        </div>
        <div className="h-2 bg-white/10 rounded-full border border-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-150 ${getFatigueColor(fatigue)}`}
            style={{ width: `${Math.min(100, fatigue)}%` }}
          />
        </div>
      </div>
    </div>
  );
});

export default PowerGauge;
