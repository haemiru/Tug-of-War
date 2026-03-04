import { memo } from 'react';

const EXPRESSIONS = {
  idle: '😐',
  pulling: '😤',
  danger: '😰',
  victory: '🎉',
  defeat: '😱',
};

/**
 * 캐릭터 — 줄을 가슴 높이에서 잡고 있음
 * 부모가 items-center로 정렬하므로 줄은 캐릭터 세로 중앙(=가슴)에 위치
 * @param {number} lean - 기울기 (음수=뒤로 젖힘, 양수=앞으로 끌림)
 */
const Character = memo(function Character({
  number, isPlayer, expression = 'idle', lean = 0, className = '',
}) {
  const bgColor = isPlayer ? 'bg-team-player' : 'bg-team-enemy';
  const borderColor = isPlayer ? 'border-team-player-dark' : 'border-team-enemy-dark';

  // 기울기 → 회전 (최대 ±15도)
  const rotation = Math.max(-15, Math.min(15, lean * 15));
  // 당기는 중이면 약간 낮은 자세
  const squat = Math.abs(lean) > 0.3 ? 2 : 0;

  return (
    <div
      className={`flex flex-col items-center transition-transform duration-150 ${className}`}
      style={{
        transform: `rotate(${rotation}deg) translateY(${squat}px)`,
        transformOrigin: 'bottom center',
      }}
    >
      {/* 머리 */}
      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-bg-panel border-2 border-white/30
                      flex items-center justify-center text-xs md:text-sm">
        {EXPRESSIONS[expression]}
      </div>

      {/* 몸통 + 팔 */}
      <div className="relative -mt-1">
        {/* 팔 — 줄 방향으로 뻗어있음 */}
        <div
          className={`absolute top-1 md:top-1.5 ${isPlayer ? '-right-3 md:-right-4' : '-left-3 md:-left-4'}
                      w-4 md:w-5 h-1 md:h-1.5 rounded-full ${bgColor}`}
          style={{
            transform: `rotate(${isPlayer ? -15 - lean * 8 : 15 + lean * 8}deg)`,
            transformOrigin: isPlayer ? 'left center' : 'right center',
          }}
        />
        {/* 몸통 */}
        <div className={`w-7 h-9 md:w-10 md:h-12 ${bgColor} rounded-sm border ${borderColor}
                         flex items-center justify-center`}>
          <span className="text-white text-[7px] md:text-[9px] font-mono font-bold">{number}</span>
        </div>
      </div>

      {/* 다리 — 버티는 자세 */}
      <div className="flex gap-0.5 -mt-0.5">
        <div
          className={`w-3 h-4 md:w-4 md:h-5 ${bgColor} rounded-b-sm`}
          style={{ transform: `rotate(${lean > 0 ? 5 : -3}deg)` }}
        />
        <div
          className={`w-3 h-4 md:w-4 md:h-5 ${bgColor} rounded-b-sm`}
          style={{ transform: `rotate(${lean > 0 ? -2 : 5}deg)` }}
        />
      </div>
    </div>
  );
});

export default Character;
