import { memo, useState, useCallback } from 'react';

const TapArea = memo(function TapArea({ threeStepAvailable, threeStepCount, isHolding }) {
  const [ripples, setRipples] = useState([]);
  const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

  const addRipple = useCallback((e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX || e.touches?.[0]?.clientX || rect.width / 2) - rect.left;
    const y = (e.clientY || e.touches?.[0]?.clientY || rect.height / 2) - rect.top;
    const id = Date.now();
    setRipples(prev => [...prev.slice(-5), { id, x, y }]);
    setTimeout(() => {
      setRipples(prev => prev.filter(r => r.id !== id));
    }, 400);
  }, []);

  return (
    <div className="w-full px-4 space-y-2">
      {/* 모바일: 당기기 + 버티기 영역 분할 / PC: 통합 */}
      <div className="flex gap-2">
        {/* 당기기 영역 */}
        <button
          data-tap-area
          onPointerDown={addRipple}
          className={`relative flex-1 h-28 md:h-32 bg-bg-panel border-2 rounded-2xl
                     transition-colors duration-75 overflow-hidden
                     ${isHolding ? 'border-white/10' : 'border-accent-pink/30 active:bg-accent-pink/20'}`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-3xl mb-1">👆</span>
            <span className="text-text-muted text-sm">
              {isTouchDevice ? '탭! 탭! 탭!' : 'A키 또는 ← 연타'}
            </span>
          </div>
          {/* 리플 효과 */}
          {ripples.map(r => (
            <div
              key={r.id}
              className="absolute w-8 h-8 rounded-full bg-accent-pink/30 animate-ripple pointer-events-none"
              style={{ left: r.x - 16, top: r.y - 16 }}
            />
          ))}
        </button>

        {/* 버티기 영역 */}
        <button
          data-hold-area
          className={`relative w-24 md:w-28 h-28 md:h-32 rounded-2xl border-2 transition-all duration-100
                     ${isHolding
                       ? 'bg-accent-gold/20 border-accent-gold scale-95'
                       : 'bg-bg-panel border-white/20 hover:border-accent-gold/50'}`}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-2xl mb-1">🛡️</span>
            <span className="text-text-muted text-xs">
              {isTouchDevice ? '꾹 누르기' : 'Space'}
            </span>
            <span className="text-text-muted text-[10px] mt-0.5">버티기</span>
          </div>
        </button>
      </div>

      {/* 3걸음 전략 버튼 */}
      <button
        data-three-step
        disabled={!threeStepAvailable || threeStepCount <= 0}
        className={`w-full py-3 rounded-xl text-sm font-bold transition-all
                   ${threeStepAvailable && threeStepCount > 0
                     ? 'bg-accent-pink/20 border border-accent-pink text-accent-pink hover:bg-accent-pink/30 animate-pulse-glow'
                     : 'bg-white/5 border border-white/10 text-text-muted cursor-not-allowed'}`}
      >
        ⚡ 3걸음 전략 ({threeStepCount}회 남음)
        {!threeStepAvailable && threeStepCount > 0 && (
          <span className="text-xs ml-1">(밀릴 때 사용 가능)</span>
        )}
      </button>
    </div>
  );
});

export default TapArea;
