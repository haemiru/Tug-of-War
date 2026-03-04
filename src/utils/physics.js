import { MASS, DAMPING, FORCE_SCALE, ROPE_CLAMP } from '../constants/game';

/**
 * 줄 위치 물리 계산 (반-암묵적 오일러)
 * @param {Object} state - { ropePosition, ropeVelocity, playerForce, aiForce }
 * @param {number} deltaTime - 프레임 시간 (초)
 * @returns {{ ropePosition: number, ropeVelocity: number }}
 */
export function updatePhysics(state, deltaTime) {
  const { ropePosition, ropeVelocity, playerForce, aiForce } = state;

  // 순 힘 = AI힘(+방향) - 플레이어힘(-방향)
  const netForce = (aiForce - playerForce) * FORCE_SCALE;

  // 가속도 = (순 힘 - 감쇠력) / 질량
  const acceleration = (netForce - DAMPING * ropeVelocity) / MASS;

  // 속도 업데이트 (반-암묵적 오일러: 속도 먼저 업데이트)
  const newVelocity = ropeVelocity + acceleration * deltaTime;

  // 위치 업데이트 (새 속도 사용)
  const newPosition = ropePosition + newVelocity * deltaTime;

  return {
    ropePosition: Math.max(-ROPE_CLAMP, Math.min(ROPE_CLAMP, newPosition)),
    ropeVelocity: newVelocity,
  };
}

/**
 * 피로도에 따른 힘 보정 배율 계산
 * 50% 이상부터 페널티, 80% 이상 극심, 95% 이상 번아웃(힘 0)
 */
export function getFatiguePenalty(fatigue) {
  if (fatigue >= 95) return 0; // 번아웃: 힘을 쓸 수 없음
  if (fatigue >= 80) return 0.15;
  if (fatigue >= 50) return 0.5;
  return 1.0;
}

/**
 * CPS(Clicks Per Second) 계산
 * @param {number[]} tapTimestamps - 최근 탭 타임스탬프 배열
 * @param {number} now - 현재 시간 (ms)
 * @param {number} window - 측정 윈도우 (ms)
 * @returns {number} CPS
 */
export function calculateCPS(tapTimestamps, now, window = 1000) {
  const recentTaps = tapTimestamps.filter(t => now - t <= window);
  return recentTaps.length;
}
