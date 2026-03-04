import { memo } from 'react';
import { WIN_THRESHOLD } from '../../constants/game';

const RopeBar = memo(function RopeBar({ ropePosition }) {
  // ropePosition: -0.85 ~ +0.85, 0 = 중앙
  // 마커 위치를 %로 변환 (50% = 중앙)
  const markerPercent = 50 + (ropePosition / WIN_THRESHOLD) * 35;
  const clamped = Math.max(5, Math.min(95, markerPercent));

  // 위험 수준 판단
  const isDanger = Math.abs(ropePosition) > 0.5;

  return (
    <div className="w-full px-4">
      {/* 라벨 */}
      <div className="flex justify-between text-xs text-text-muted mb-1">
        <span className="text-team-player-light">◀ 플레이어</span>
        <span className="text-team-enemy-light">상대 ▶</span>
      </div>

      {/* 바 */}
      <div className="relative w-full h-5 md:h-6 bg-white/10 rounded-full border border-white/20 overflow-hidden">
        {/* 위험 영역 - 왼쪽 */}
        <div className="absolute left-0 top-0 bottom-0 w-[15%] bg-danger/20 rounded-l-full" />
        {/* 위험 영역 - 오른쪽 */}
        <div className="absolute right-0 top-0 bottom-0 w-[15%] bg-danger/20 rounded-r-full" />

        {/* 중앙선 */}
        <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-accent-pink -translate-x-1/2"
             style={{ boxShadow: '0 0 8px rgba(255,0,110,0.5)' }} />

        {/* 마커 (현재 줄 위치) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 transition-[left] duration-100 ease-out"
          style={{ left: `${clamped}%` }}
        >
          <div className={`w-4 h-4 md:w-5 md:h-5 rounded-full border-2
                          ${isDanger ? 'bg-danger border-danger-light animate-heartbeat' : 'bg-accent-gold border-accent-gold-light'}
                          shadow-lg`}
               style={{ boxShadow: isDanger ? '0 0 12px rgba(230,57,70,0.6)' : '0 0 10px rgba(255,215,0,0.5)' }}
          />
        </div>
      </div>
    </div>
  );
});

export default RopeBar;
