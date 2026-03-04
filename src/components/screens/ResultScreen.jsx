import { memo, useEffect } from 'react';
import { playVictory, playDefeat } from '../../utils/audio';

const ResultScreen = memo(function ResultScreen({ won, stats, onRestart, onHome }) {
  useEffect(() => {
    if (won) playVictory();
    else playDefeat();
  }, [won]);

  return (
    <div className={`flex flex-col items-center justify-center h-full px-4 relative ${!won ? 'animate-defeat-flash' : ''}`}>
      {/* 배경 효과 */}
      {won && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(255,215,0,0.1), transparent 60%)',
          }}
        />
      )}

      {/* 결과 타이틀 */}
      {won ? (
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="text-4xl mb-2">🏆</div>
          <h1
            className="font-title text-6xl md:text-7xl text-team-player-light"
            style={{ textShadow: '0 0 30px rgba(45,155,86,0.5)' }}
          >
            생 존
          </h1>
          <p className="font-mono text-xl text-accent-gold mt-2">SURVIVED</p>
        </div>
      ) : (
        <div className="text-center mb-8 animate-fade-in-up">
          <h1
            className="font-title text-6xl md:text-7xl text-danger"
            style={{ textShadow: '0 0 30px rgba(230,57,70,0.5)' }}
          >
            탈 락
          </h1>
          <p className="font-mono text-xl text-danger-light mt-2">ELIMINATED</p>
        </div>
      )}

      {/* 통계 */}
      <div className="bg-bg-panel border border-white/10 rounded-xl p-5 w-full max-w-xs mb-8 animate-fade-in-up"
           style={{ animationDelay: '0.2s' }}>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="text-text-muted">{won ? '클리어 시간' : '생존 시간'}</span>
            <span className="font-mono text-text-primary">{formatTime(stats.survivalTime)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">최대 연타 속도</span>
            <span className="font-mono text-text-primary">{stats.maxCPS} CPS</span>
          </div>
          <div className="flex justify-between">
            <span className="text-text-muted">총 탭 횟수</span>
            <span className="font-mono text-text-primary">{stats.totalTaps}회</span>
          </div>
          {stats.threeStepUsed > 0 && (
            <div className="flex justify-between">
              <span className="text-text-muted">3걸음 전략</span>
              <span className="font-mono text-text-primary">{stats.threeStepUsed}회 사용</span>
            </div>
          )}
        </div>
      </div>

      {/* 팁 (패배 시) */}
      {!won && stats.tip && (
        <p className="text-text-muted text-sm mb-6 text-center max-w-xs animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
          💡 TIP: {stats.tip}
        </p>
      )}

      {/* 버튼 */}
      <div className="flex flex-col gap-3 w-full max-w-xs animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <button
          onClick={onRestart}
          className="w-full py-3 bg-accent-pink hover:bg-accent-pink-light text-white text-lg font-bold rounded-xl transition-colors"
        >
          {won ? '▶ 다시 도전' : '🔄 다시 도전'}
        </button>
        <button
          onClick={onHome}
          className="w-full py-3 bg-transparent border border-white/20 hover:border-white/40 text-text-secondary rounded-xl transition-colors"
        >
          🏠 메인으로
        </button>
      </div>
    </div>
  );
});

function formatTime(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default ResultScreen;
