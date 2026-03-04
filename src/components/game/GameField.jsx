import { memo } from 'react';
import Character from './Character';
import { WIN_THRESHOLD } from '../../constants/game';

const PLAYER_NUMBERS = [199, 123, 456];
const ENEMY_NUMBERS = ['069', 101, 218];

const GameField = memo(function GameField({
  ropePosition, playerExpression, enemyExpression,
  gameResult = null, falling = false,
}) {
  // ropePosition: -0.85 ~ +0.85, 0 = 중앙
  // 이동량 ±30% → 실제로 끌려가는 느낌
  const movePercent = (ropePosition / WIN_THRESHOLD) * 30;

  // 캐릭터 기울기
  const playerLean = ropePosition * 1.5;
  const aiLean = -ropePosition * 1.5;

  const playerFalling = falling && gameResult === 'lost';
  const enemyFalling = falling && gameResult === 'won';

  const getDefeatClass = (index) => {
    if (!falling) return '';
    const delays = ['animate-defeat-delay-1', 'animate-defeat-delay-2', 'animate-defeat-delay-3'];
    return delays[index] || 'animate-defeat';
  };

  const getVictoryClass = () => {
    if (!falling) return '';
    return 'animate-celebrate';
  };

  // 위험도
  const playerDangerLevel = Math.max(0, ropePosition / WIN_THRESHOLD);
  const enemyDangerLevel = Math.max(0, -ropePosition / WIN_THRESHOLD);

  return (
    <div className={`relative w-full overflow-hidden
                     ${falling ? 'animate-fall-shake' : ''}`}
         style={{ height: 'clamp(200px, 40vh, 320px)' }}>

      {/* === 고정 배경: 플랫폼 + 낭떠러지 === */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 왼쪽 플랫폼 (플레이어 쪽) */}
        <div className="absolute bottom-0 left-0 w-[42%] h-16 md:h-20"
             style={{ background: 'linear-gradient(to bottom, #2a2a3e 0%, #1A1A2E 100%)' }}>
          <div className="absolute top-0 right-0 w-full h-px bg-white/10" />
          {/* 플랫폼 가장자리 */}
          <div className="absolute top-0 right-0 w-1 h-full bg-accent-pink/30" />
        </div>
        {/* 오른쪽 플랫폼 (AI 쪽) */}
        <div className="absolute bottom-0 right-0 w-[42%] h-16 md:h-20"
             style={{ background: 'linear-gradient(to bottom, #2a2a3e 0%, #1A1A2E 100%)' }}>
          <div className="absolute top-0 left-0 w-full h-px bg-white/10" />
          <div className="absolute top-0 left-0 w-1 h-full bg-accent-pink/30" />
        </div>

        {/* 중앙 낭떠러지 (심연) */}
        <div className="absolute bottom-0 left-[42%] w-[16%] h-24 md:h-28">
          <div className="w-full h-full"
               style={{
                 background: 'linear-gradient(to bottom, #0a0a15 0%, #050508 40%, #000 100%)',
               }} />
          {/* 심연 안개 */}
          <div className="absolute top-4 w-full h-12 transition-all duration-500"
               style={{
                 background: falling
                   ? 'radial-gradient(ellipse at center, rgba(230,57,70,0.5), transparent 70%)'
                   : 'radial-gradient(ellipse at center, rgba(255,0,110,0.15), transparent 70%)',
               }} />
          {/* 중앙 표식 */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-accent-pink"
               style={{ boxShadow: '0 0 8px rgba(255,0,110,0.6)' }} />
        </div>

        {/* 플랫폼 가장자리 위 경고선 */}
        <div className="absolute left-[42%] w-[16%]"
             style={{ bottom: 'clamp(64px, 8vh, 80px)' }}>
          <div className="w-full h-px bg-accent-pink/40" />
        </div>
      </div>

      {/* === 줄다리기 구성 (이동하는 부분) === */}
      <div
        className="absolute inset-0 flex items-end justify-center transition-transform duration-100 ease-out"
        style={{
          transform: `translateX(${movePercent}%)`,
          paddingBottom: 'clamp(64px, 8vh, 80px)', // 플랫폼 높이만큼 위에 배치
        }}
      >
        {/* 전체 팀+줄 배치 — 줄이 캐릭터 가슴/손 높이에 오도록 */}
        <div className="flex items-center gap-0 relative">

          {/* 플레이어 팀 */}
          <div className="flex gap-0.5 md:gap-1">
            {PLAYER_NUMBERS.map((num, i) => (
              <Character
                key={num}
                number={num}
                isPlayer
                expression={playerExpression}
                lean={falling ? 0 : playerLean}
                className={
                  playerFalling ? getDefeatClass(i) :
                  enemyFalling ? getVictoryClass() :
                  ''
                }
              />
            ))}
          </div>

          {/* 밧줄 — items-center 정렬로 캐릭터 가슴 높이 */}
          <div className={`relative h-2 md:h-3 mx-1
                           ${falling ? 'animate-rope-snap' : ''}`}
               style={{ width: 'clamp(80px, 20vw, 180px)' }}>
            {/* 밧줄 본체 */}
            <div className="absolute inset-0 rounded-full"
                 style={{
                   background: 'linear-gradient(to bottom, #A0896A 0%, #8B7355 40%, #6B5740 100%)',
                   boxShadow: '0 2px 4px rgba(0,0,0,0.5)',
                 }} />
            {/* 꼬임 패턴 */}
            <div className="absolute inset-0 rounded-full opacity-30 animate-rope-tension"
                 style={{
                   background: 'repeating-linear-gradient(45deg, transparent, transparent 3px, rgba(255,255,255,0.2) 3px, rgba(255,255,255,0.2) 5px)',
                 }} />
            {/* 중앙 리본 */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                            w-1.5 h-5 md:h-7 bg-accent-pink rounded-sm"
                 style={{ boxShadow: '0 0 10px rgba(255,0,110,0.5)' }} />
          </div>

          {/* AI 팀 */}
          <div className="flex gap-0.5 md:gap-1">
            {ENEMY_NUMBERS.map((num, i) => (
              <Character
                key={num}
                number={num}
                isPlayer={false}
                expression={enemyExpression}
                lean={falling ? 0 : aiLean}
                className={
                  enemyFalling ? getDefeatClass(i) :
                  playerFalling ? getVictoryClass() :
                  ''
                }
              />
            ))}
          </div>
        </div>
      </div>

      {/* === 위험 경고 오버레이 === */}
      {playerDangerLevel > 0.3 && !falling && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `linear-gradient(to left, rgba(230,57,70,${playerDangerLevel * 0.3}), transparent 40%)`,
          }}
        />
      )}
      {enemyDangerLevel > 0.5 && !falling && (
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `linear-gradient(to right, rgba(45,155,86,${enemyDangerLevel * 0.2}), transparent 40%)`,
          }}
        />
      )}

      {/* 추락 시 어두워짐 */}
      {falling && (
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.6) 100%)' }} />
      )}
    </div>
  );
});

export default GameField;
