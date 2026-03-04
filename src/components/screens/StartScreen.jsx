import { memo } from 'react';

const StartScreen = memo(function StartScreen({ onStart, onHowToPlay }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4 relative">
      {/* 스포트라이트 배경 효과 */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(255,0,110,0.12), transparent 60%)',
        }}
      />

      {/* 오징어게임 심볼 */}
      <div className="flex gap-3 mb-6 text-accent-pink/60 text-2xl animate-fade-in-up">
        <span>△</span>
        <span>○</span>
        <span>□</span>
      </div>

      {/* 타이틀 */}
      <div className="animate-float mb-2">
        <h1
          className="font-title text-5xl md:text-7xl text-text-primary tracking-wider"
          style={{ textShadow: '0 0 30px rgba(255,0,110,0.4)' }}
        >
          줄다리기
        </h1>
      </div>
      <p className="font-mono text-lg md:text-xl text-text-muted tracking-widest mb-10">
        TUG OF WAR
      </p>

      {/* 밧줄 일러스트 */}
      <div className="flex items-center gap-1 mb-10 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex gap-0.5">
          {[456, 123, 199].map(n => (
            <div key={n} className="w-5 h-7 md:w-6 md:h-8 bg-team-player rounded-sm flex items-center justify-center">
              <span className="text-white text-[8px] font-mono">{n}</span>
            </div>
          ))}
        </div>
        <div className="w-24 md:w-40 h-1.5 bg-gradient-to-r from-rope-dark via-rope to-rope-light rounded-full" />
        <div className="flex gap-0.5">
          {['069', '101', '218'].map(n => (
            <div key={n} className="w-5 h-7 md:w-6 md:h-8 bg-team-enemy rounded-sm flex items-center justify-center">
              <span className="text-white text-[8px] font-mono">{n}</span>
            </div>
          ))}
        </div>
      </div>

      {/* 버튼들 */}
      <div className="flex flex-col gap-3 w-full max-w-xs animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
        <button
          onClick={onStart}
          className="w-full py-4 bg-accent-pink hover:bg-accent-pink-light active:bg-accent-pink-dark
                     text-white text-xl font-bold rounded-xl transition-colors
                     animate-pulse-glow"
        >
          ▶ 게임 시작
        </button>
        <button
          onClick={onHowToPlay}
          className="w-full py-3 bg-transparent border border-white/20 hover:border-white/40
                     text-text-secondary text-base rounded-xl transition-colors"
        >
          📖 게임 방법
        </button>
      </div>
    </div>
  );
});

export default StartScreen;
