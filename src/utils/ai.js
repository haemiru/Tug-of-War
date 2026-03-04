/**
 * AI 힘 계산 — 파도 공격 패턴 포함
 * @param {Object} params - 난이도별 AI 파라미터
 * @param {Object} gameState - { ropePosition, playerPower, timeLeft, elapsed }
 * @param {number} deltaTime - 프레임 시간 (초)
 * @returns {number} AI의 힘 (0~100)
 */
export function calculateAIPower(params, gameState, deltaTime) {
  const {
    basePower, powerVariance, surgeChance,
    surgePower, adaptRate, mistakeChance,
    waveAttack, wavePeriod, wavePeakPower, waveDuration,
  } = params;

  // 1. 기본 힘 + 노이즈
  let power = basePower + (Math.random() * 2 - 1) * powerVariance;

  // 2. 파도 공격 패턴 — 주기적으로 강력한 공격 (버티기 필수)
  if (waveAttack && wavePeriod) {
    const elapsed = gameState.elapsed || 0;
    const cyclePos = elapsed % wavePeriod; // 주기 내 현재 위치
    if (cyclePos < waveDuration) {
      // 강공격 페이즈: sine 커브로 부드럽게 올라갔다 내려감
      const waveIntensity = Math.sin((cyclePos / waveDuration) * Math.PI);
      power = basePower + (wavePeakPower - basePower) * waveIntensity;
    }
  }

  // 3. 적응: 플레이어가 강하면 AI도 힘 올림 (즉각 반응, deltaTime 제거)
  const playerDiff = gameState.playerPower - power;
  if (playerDiff > 0) {
    power += playerDiff * adaptRate * 0.5;
  }

  // 4. 위기 대응: AI가 밀리고 있으면 힘 증가 (버그 수정: 중첩 적용)
  if (gameState.ropePosition < -0.5) {
    power *= 1.6;
  } else if (gameState.ropePosition < -0.3) {
    power *= 1.3;
  }

  // 5. 시간이 적으면 더 공격적
  if (gameState.timeLeft < 20) {
    power *= 1.25;
  }

  // 6. 플레이어 피로도 감지 — 피로할 때 집중 공격
  if (gameState.playerFatigue > 60) {
    power *= 1.2;
  }
  if (gameState.playerFatigue > 85) {
    power *= 1.3; // 번아웃 직전 맹공
  }

  // 7. 돌발 급증
  if (Math.random() < surgeChance * deltaTime * 60) {
    power += surgePower;
  }

  // 8. 실수 (힘 급감)
  if (Math.random() < mistakeChance * deltaTime * 60) {
    power *= 0.2;
  }

  return Math.max(0, Math.min(100, power));
}
