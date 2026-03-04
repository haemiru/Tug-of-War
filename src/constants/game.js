// 게임 물리 상수
export const MASS = 10;
export const DAMPING = 3.0;
export const FORCE_SCALE = 0.01;
export const WIN_THRESHOLD = 0.7;
export const ROPE_CLAMP = 0.85;

// 게임 시간 (초)
export const GAME_DURATION = {
  easy: 90,
  normal: 90,
  hard: 75,
};

// 플레이어 입력
export const BASE_TAP_POWER = 6;
export const POWER_DECAY_RATE = 45;
export const MAX_PLAYER_POWER = 100;
export const TAP_SPEED_WINDOW = 1000;
export const TAP_SPEED_BONUS_MAX = 1.5;
export const MAX_CPS = 12;

// 피로도
export const FATIGUE_PER_TAP = 2.5;
export const FATIGUE_RECOVERY_IDLE = 6;
export const FATIGUE_RECOVERY_HOLD = 25;
export const FATIGUE_PENALTY_THRESHOLD = 50;
export const FATIGUE_PENALTY_MILD = 0.5;
export const FATIGUE_PENALTY_SEVERE_THRESHOLD = 80;
export const FATIGUE_PENALTY_SEVERE = 0.15;
export const FATIGUE_BURNOUT_THRESHOLD = 95;
export const FATIGUE_BURNOUT_DURATION = 1.5;

// 버티기
export const HOLD_MAX_DURATION = 3;
export const HOLD_COOLDOWN = 2;
export const HOLD_RESISTANCE = 0.1;
export const HOLD_TEAM_FORCE = 25;

// 3걸음 전략
export const THREE_STEP_TRIGGER_THRESHOLD = 0.2;
export const THREE_STEP_RELEASE_AMOUNT = 0.2;
export const THREE_STEP_PULL_AMOUNT = 0.5;
export const THREE_STEP_DURATION = 1.5;
export const THREE_STEP_RELEASE_PHASE = 1.0;

// 3걸음 횟수
export const THREE_STEP_MAX = {
  easy: 3,
  normal: 2,
  hard: 1,
};

// 카운트다운
export const COUNTDOWN_DURATION = 5;
