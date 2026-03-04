import { memo, useMemo } from 'react';

const HowToPlayModal = memo(function HowToPlayModal({ onClose }) {
  const isTouchDevice = useMemo(
    () => 'ontouchstart' in window || navigator.maxTouchPoints > 0,
    []
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* 백드롭 */}
      <div className="absolute inset-0 bg-black/70" onClick={onClose} />

      {/* 모달 */}
      <div className="relative bg-bg-panel border border-white/10 rounded-2xl p-6 max-w-sm w-full max-h-[80vh] overflow-y-auto animate-fade-in-up">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-title text-2xl text-text-primary">📖 게임 방법</h2>
          <button onClick={onClose} className="text-text-muted hover:text-text-primary text-2xl">✕</button>
        </div>

        {/* 내용 */}
        <div className="space-y-5 text-text-secondary text-sm leading-relaxed">
          <div>
            <p className="font-bold text-text-primary mb-2">1. 당기기 (연타)</p>
            {isTouchDevice ? (
              <p>왼쪽 <span className="text-accent-pink font-bold">👆 TAP!</span> 영역을 빠르게 연타하여 줄을 당기세요!</p>
            ) : (
              <p><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-accent-pink font-mono text-xs">A</kbd> 키 또는 <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-accent-pink font-mono text-xs">←</kbd> 키를 빠르게 연타하여 줄을 당기세요!</p>
            )}
            <div className="text-2xl mt-1">👆👆👆</div>
          </div>

          <div>
            <p className="font-bold text-text-primary mb-2">2. 버티기 (수비)</p>
            {isTouchDevice ? (
              <p>오른쪽 <span className="text-accent-gold font-bold">🛡️ 버티기</span> 영역을 꾹 누르면 밀리는 속도가 줄고 피로도가 회복됩니다.</p>
            ) : (
              <p><kbd className="px-1.5 py-0.5 bg-white/10 rounded text-accent-gold font-mono text-xs">Space</kbd> 키를 꾹 누르면 밀리는 속도가 줄고 피로도가 회복됩니다.</p>
            )}
            <div className="text-2xl mt-1">🛡️</div>
          </div>

          <div>
            <p className="font-bold text-text-primary mb-2">3. 3걸음 전략 (필살기)</p>
            {isTouchDevice ? (
              <p>밀리고 있을 때 하단의 <span className="text-accent-pink font-bold">⚡ 3걸음 전략</span> 버튼을 탭! 일부러 밀려났다가 강하게 역전합니다.</p>
            ) : (
              <p>밀리고 있을 때 <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-accent-pink font-mono text-xs">S</kbd> 키 또는 <kbd className="px-1.5 py-0.5 bg-white/10 rounded text-accent-pink font-mono text-xs">↓</kbd> 키로 발동! 일부러 밀려났다가 강하게 역전합니다.</p>
            )}
            <p className="text-danger text-xs mt-1">⚠️ 실패하면 즉시 패배!</p>
            <div className="text-2xl mt-1">⚡</div>
          </div>

          <div>
            <p className="font-bold text-text-primary mb-2">4. 피로도 관리</p>
            <p>연타하면 피로도가 쌓이고 힘이 약해집니다. 버티기로 쉬면 피로도가 빠르게 회복됩니다.</p>
          </div>

          {/* 조작 요약 표 */}
          <div className="bg-bg-active/50 rounded-lg p-3">
            <p className="font-bold text-text-primary mb-2 text-xs">
              {isTouchDevice ? '📱 터치 조작 요약' : '⌨️ 키보드 조작 요약'}
            </p>
            <table className="w-full text-xs">
              <tbody className="divide-y divide-white/10">
                {isTouchDevice ? (
                  <>
                    <tr><td className="py-1.5 text-text-muted">당기기</td><td className="py-1.5 text-text-primary">왼쪽 영역 연타</td></tr>
                    <tr><td className="py-1.5 text-text-muted">버티기</td><td className="py-1.5 text-text-primary">오른쪽 영역 꾹 누르기</td></tr>
                    <tr><td className="py-1.5 text-text-muted">3걸음</td><td className="py-1.5 text-text-primary">하단 ⚡ 버튼 탭</td></tr>
                  </>
                ) : (
                  <>
                    <tr><td className="py-1.5 text-text-muted">당기기</td><td className="py-1.5 text-text-primary font-mono">A / ←  연타</td></tr>
                    <tr><td className="py-1.5 text-text-muted">버티기</td><td className="py-1.5 text-text-primary font-mono">Space  꾹 누르기</td></tr>
                    <tr><td className="py-1.5 text-text-muted">3걸음</td><td className="py-1.5 text-text-primary font-mono">S / ↓</td></tr>
                  </>
                )}
              </tbody>
            </table>
          </div>

          <div className="bg-accent-pink/10 border border-accent-pink/20 rounded-lg p-3">
            <p className="text-accent-pink font-bold">💡 TIP</p>
            <p className="mt-1">일정한 리듬으로 연타하고, 피로도 60% 이상이면 버티기로 회복하세요!</p>
          </div>
        </div>

        {/* 닫기 버튼 */}
        <button
          onClick={onClose}
          className="w-full mt-5 py-3 bg-accent-pink hover:bg-accent-pink-light text-white rounded-xl font-bold transition-colors"
        >
          알겠습니다!
        </button>
      </div>
    </div>
  );
});

export default HowToPlayModal;
