import { useState, useCallback, useRef, useEffect } from 'react';
import { useGameLoop } from './hooks/useGameLoop';
import { useInput } from './hooks/useInput';
import { updatePhysics, getFatiguePenalty, calculateCPS } from './utils/physics';
import { calculateAIPower } from './utils/ai';
import { playTapSound, playHeartbeat, initAudio, playThreeStep } from './utils/audio';
import { DIFFICULTY } from './constants/difficulty';
import {
  GAME_DURATION, WIN_THRESHOLD, BASE_TAP_POWER, POWER_DECAY_RATE,
  MAX_PLAYER_POWER, TAP_SPEED_WINDOW, TAP_SPEED_BONUS_MAX, MAX_CPS,
  FATIGUE_PER_TAP, FATIGUE_RECOVERY_IDLE, FATIGUE_RECOVERY_HOLD,
  HOLD_RESISTANCE, HOLD_TEAM_FORCE, THREE_STEP_TRIGGER_THRESHOLD,
  THREE_STEP_RELEASE_AMOUNT, THREE_STEP_PULL_AMOUNT,
  THREE_STEP_DURATION, THREE_STEP_RELEASE_PHASE, THREE_STEP_MAX,
} from './constants/game';
import StartScreen from './components/screens/StartScreen';
import DifficultyScreen from './components/screens/DifficultyScreen';
import CountdownScreen from './components/screens/CountdownScreen';
import ResultScreen from './components/screens/ResultScreen';
import Timer from './components/game/Timer';
// RopeBar removed — rope position visible on GameField directly
import GameField from './components/game/GameField';
import PowerGauge from './components/game/PowerGauge';
import TapArea from './components/game/TapArea';
import HowToPlayModal from './components/ui/HowToPlayModal';

export default function App() {
  // === 게임 흐름 상태 ===
  const [gamePhase, setGamePhase] = useState('menu');
  // 'menu' | 'difficulty' | 'countdown' | 'playing' | 'falling' | 'won' | 'lost'
  const [difficulty, setDifficulty] = useState('normal');
  const [showHowToPlay, setShowHowToPlay] = useState(false);
  const [fallingResult, setFallingResult] = useState(null); // 'won' | 'lost'

  // === 게임 상태 (ref로 관리 → 매 프레임 갱신, 60fps setState 부하 방지) ===
  const gameStateRef = useRef(getInitialGameState('normal'));

  // === 렌더링용 상태 ===
  const [renderState, setRenderState] = useState(getInitialGameState('normal'));

  // === 통계 ===
  const statsRef = useRef({ maxCPS: 0, totalTaps: 0, threeStepUsed: 0 });

  // === 입력 처리 ===
  const { tapTimestampsRef, isHoldingRef, threeStepTriggeredRef, setOnTap } = useInput(gamePhase === 'playing');

  // 탭 콜백
  setOnTap(() => {
    playTapSound();
    const gs = gameStateRef.current;
    gs.fatigue = Math.min(100, gs.fatigue + FATIGUE_PER_TAP);
    statsRef.current.totalTaps++;
  });

  // === 3걸음 타이머 ===
  const threeStepTimerRef = useRef(0);

  // === 결과 phase를 ref로 관리하여 endGame 중복 호출 방지 ===
  const endedRef = useRef(false);

  // === 게임 루프 ===
  useGameLoop(gamePhase === 'playing', (deltaTime) => {
    if (endedRef.current) return;
    const gs = gameStateRef.current;
    const aiParams = DIFFICULTY[difficulty];

    // 1. 타이머
    gs.timeLeft = Math.max(0, gs.timeLeft - deltaTime);

    // 2. 3걸음 전략
    if (gs.threeStepActive) {
      threeStepTimerRef.current += deltaTime;
      if (threeStepTimerRef.current < THREE_STEP_RELEASE_PHASE) {
        gs.ropePosition += (THREE_STEP_RELEASE_AMOUNT / THREE_STEP_RELEASE_PHASE) * deltaTime;
      } else if (threeStepTimerRef.current < THREE_STEP_DURATION) {
        const pullPhase = THREE_STEP_DURATION - THREE_STEP_RELEASE_PHASE;
        gs.ropePosition -= (THREE_STEP_PULL_AMOUNT / pullPhase) * deltaTime;
      } else {
        gs.threeStepActive = false;
        threeStepTimerRef.current = 0;
      }
    } else {
      // 3걸음 트리거
      if (threeStepTriggeredRef.current && gs.threeStepCount > 0 && gs.ropePosition >= THREE_STEP_TRIGGER_THRESHOLD) {
        gs.threeStepActive = true;
        gs.threeStepCount--;
        threeStepTimerRef.current = 0;
        statsRef.current.threeStepUsed++;
        playThreeStep();
      }
      threeStepTriggeredRef.current = false;

      // 경과 시간 추적
      gs.elapsed = (gs.elapsed || 0) + deltaTime;

      // 3. 번아웃 체크 — 피로도 95% 이상이면 강제 쉼
      if (gs.fatigue >= 95) {
        gs.burnout = (gs.burnout || 0) + deltaTime;
        gs.playerPower = Math.max(0, gs.playerPower - POWER_DECAY_RATE * 3 * deltaTime);
        // 번아웃 중 피로도 천천히 회복
        gs.fatigue = Math.max(0, gs.fatigue - 12 * deltaTime);
        if (gs.burnout >= 1.5) {
          gs.burnout = 0; // 번아웃 해제
          gs.fatigue = 60; // 60%까지 회복
        }
      } else {
        gs.burnout = 0;

        // 3. 플레이어 힘
        const now = performance.now();
        const cps = calculateCPS(tapTimestampsRef.current, now, TAP_SPEED_WINDOW);
        const clampedCPS = Math.min(cps, MAX_CPS);
        const tapBonus = 1 + (clampedCPS / MAX_CPS) * (TAP_SPEED_BONUS_MAX - 1);

        if (clampedCPS > statsRef.current.maxCPS) statsRef.current.maxCPS = clampedCPS;

        const fatiguePenalty = getFatiguePenalty(gs.fatigue);

        if (isHoldingRef.current) {
          // 버티기: 팀이 함께 버티는 힘 유지 + 피로 빠르게 회복
          gs.playerPower = Math.max(HOLD_TEAM_FORCE,
            gs.playerPower + (HOLD_TEAM_FORCE - gs.playerPower) * 3 * deltaTime);
          gs.fatigue = Math.max(0, gs.fatigue - FATIGUE_RECOVERY_HOLD * deltaTime);
        } else if (clampedCPS > 0) {
          // 연타 중: 힘 충전 (피로도 페널티 적용)
          gs.playerPower = Math.min(MAX_PLAYER_POWER,
            gs.playerPower + BASE_TAP_POWER * tapBonus * fatiguePenalty * deltaTime * 8);
          gs.playerPower = Math.max(0, gs.playerPower - POWER_DECAY_RATE * 0.4 * deltaTime);
          // 연타 중에는 피로가 회복 안됨
        } else {
          // 미조작: 힘 감쇠, 피로 느리게 회복
          gs.playerPower = Math.max(0, gs.playerPower - POWER_DECAY_RATE * deltaTime);
          gs.fatigue = Math.max(0, gs.fatigue - FATIGUE_RECOVERY_IDLE * deltaTime);
        }
      }

      // 4. AI 힘 (피로도와 경과시간 전달)
      gs.aiPower = calculateAIPower(aiParams, {
        ropePosition: gs.ropePosition,
        playerPower: gs.playerPower,
        timeLeft: gs.timeLeft,
        playerFatigue: gs.fatigue,
        elapsed: gs.elapsed,
      }, deltaTime);

      // 5. 물리 (버티기 중 AI 힘 90% 차단)
      const aiEffective = isHoldingRef.current ? gs.aiPower * HOLD_RESISTANCE : gs.aiPower;
      const physics = updatePhysics({
        ropePosition: gs.ropePosition,
        ropeVelocity: gs.ropeVelocity,
        playerForce: gs.playerPower,
        aiForce: aiEffective,
      }, deltaTime);

      gs.ropePosition = physics.ropePosition;
      gs.ropeVelocity = physics.ropeVelocity;
    }

    // 6. 승패 판정 → falling 페이즈로 전환 (추락 연출)
    if (gs.ropePosition <= -WIN_THRESHOLD) {
      endedRef.current = true;
      setFallingResult('won');
      setGamePhase('falling');
      return;
    }
    if (gs.ropePosition >= WIN_THRESHOLD) {
      endedRef.current = true;
      setFallingResult('lost');
      setGamePhase('falling');
      return;
    }
    if (gs.timeLeft <= 0) {
      endedRef.current = true;
      const result = gs.ropePosition < 0 ? 'won' : 'lost';
      setFallingResult(result);
      setGamePhase('falling');
      return;
    }

    // 7. 위험 사운드
    if (Math.abs(gs.ropePosition) > 0.5 && Math.random() < deltaTime * 2) {
      playHeartbeat();
    }

    // 8. 렌더링 동기화
    setRenderState({ ...gs });
  });

  // === 게임 시작 ===
  const startGame = useCallback((diff) => {
    initAudio();
    setDifficulty(diff);
    gameStateRef.current = getInitialGameState(diff);
    statsRef.current = { maxCPS: 0, totalTaps: 0, threeStepUsed: 0 };
    endedRef.current = false;
    setRenderState(getInitialGameState(diff));
    setGamePhase('countdown');
  }, []);

  const onCountdownComplete = useCallback(() => {
    setGamePhase('playing');
  }, []);

  // === falling → 결과 화면 전환 (2.5초 추락 연출 후) ===
  useEffect(() => {
    if (gamePhase !== 'falling') return;
    const timer = setTimeout(() => {
      setGamePhase(fallingResult === 'won' ? 'won' : 'lost');
    }, 2500);
    return () => clearTimeout(timer);
  }, [gamePhase, fallingResult]);

  // === 표현 상태 ===
  const getPlayerExpression = () => {
    if (gamePhase === 'falling') return fallingResult === 'won' ? 'victory' : 'defeat';
    if (gamePhase === 'won') return 'victory';
    if (gamePhase === 'lost') return 'defeat';
    if (renderState.ropePosition > 0.4) return 'danger';
    if (renderState.playerPower > 30) return 'pulling';
    return 'idle';
  };

  const getEnemyExpression = () => {
    if (gamePhase === 'falling') return fallingResult === 'won' ? 'defeat' : 'victory';
    if (gamePhase === 'won') return 'defeat';
    if (gamePhase === 'lost') return 'victory';
    if (renderState.ropePosition < -0.4) return 'danger';
    if (renderState.aiPower > 40) return 'pulling';
    return 'idle';
  };

  const isDanger = renderState.ropePosition > 0.4;

  const getStats = () => {
    const elapsed = (GAME_DURATION[difficulty] || 90) - renderState.timeLeft;
    const tips = [
      '피로도가 60%를 넘기 전에 버티기로 회복하세요!',
      '연타 리듬을 일정하게 유지해보세요.',
      '3걸음 전략을 적절히 활용해보세요!',
      '버티기로 피로를 관리하면 후반이 유리합니다.',
    ];
    return {
      survivalTime: elapsed,
      maxCPS: statsRef.current.maxCPS,
      totalTaps: statsRef.current.totalTaps,
      threeStepUsed: statsRef.current.threeStepUsed,
      tip: tips[Math.floor(Math.random() * tips.length)],
    };
  };

  return (
    <div className="w-full h-full bg-bg-deep relative overflow-hidden">
      {gamePhase === 'menu' && (
        <StartScreen
          onStart={() => { initAudio(); setGamePhase('difficulty'); }}
          onHowToPlay={() => setShowHowToPlay(true)}
        />
      )}

      {gamePhase === 'difficulty' && (
        <DifficultyScreen
          onSelect={startGame}
          onBack={() => setGamePhase('menu')}
        />
      )}

      {gamePhase === 'countdown' && (
        <CountdownScreen onComplete={onCountdownComplete} />
      )}

      {gamePhase === 'playing' && (
        <div className={`flex flex-col h-full ${isDanger ? 'animate-danger' : ''}`}>
          {/* 상단 바 */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="text-text-muted text-xs">⏱</span>
              <Timer timeLeft={renderState.timeLeft} />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-text-muted text-xs font-body">
                {DIFFICULTY[difficulty].label}
              </span>
              <span className="text-accent-pink text-xs font-mono">
                ⚡{renderState.threeStepCount}
              </span>
            </div>
          </div>

          {/* 게임 필드 */}
          <div className="flex-1 flex items-center">
            <div className="w-full">
              <GameField
                ropePosition={renderState.ropePosition}
                playerExpression={getPlayerExpression()}
                enemyExpression={getEnemyExpression()}
              />
            </div>
          </div>

          {/* 상태 메시지 */}
          <div className="text-center py-1">
            <span className={`text-sm font-bold
              ${renderState.burnout > 0 ? 'text-danger animate-heartbeat' :
                isDanger ? 'text-danger' :
                renderState.fatigue >= 80 ? 'text-accent-gold' :
                'text-text-muted'}`}>
              {renderState.burnout > 0 ? '🔥 번아웃! 힘을 쓸 수 없다!' :
               renderState.threeStepActive ? '⚡ 3걸음 전략 발동!' :
               renderState.fatigue >= 80 ? '⚠️ 피로 위험! 버티기로 회복하세요!' :
               isDanger ? '😰 밀리고 있다!' :
               renderState.ropePosition < -0.3 ? '💪 밀어붙여!' :
               '힘을 모아라!'}
            </span>
          </div>

          {/* 파워 게이지 */}
          <div className="py-1">
            <PowerGauge power={renderState.playerPower} fatigue={renderState.fatigue} />
          </div>

          {/* 입력 영역 */}
          <div className="pb-3">
            <TapArea
              threeStepAvailable={renderState.ropePosition >= THREE_STEP_TRIGGER_THRESHOLD && !renderState.threeStepActive}
              threeStepCount={renderState.threeStepCount}
              isHolding={isHoldingRef.current}
            />
          </div>
        </div>
      )}

      {/* 추락 연출 화면 */}
      {gamePhase === 'falling' && (
        <div className="flex flex-col h-full">
          {/* 상단: 결과 텍스트 */}
          <div className="flex items-center justify-center py-4">
            <span
              className={`font-title text-4xl md:text-5xl animate-fade-in-up
                         ${fallingResult === 'won' ? 'text-team-player-light' : 'text-danger'}`}
              style={{
                textShadow: fallingResult === 'won'
                  ? '0 0 20px rgba(45,155,86,0.5)'
                  : '0 0 20px rgba(230,57,70,0.5)',
              }}
            >
              {fallingResult === 'won' ? '승리!' : '탈락...'}
            </span>
          </div>

          {/* 게임 필드 — 추락 연출 */}
          <div className="flex-1 flex items-center">
            <div className="w-full">
              <GameField
                ropePosition={renderState.ropePosition}
                playerExpression={getPlayerExpression()}
                enemyExpression={getEnemyExpression()}
                gameResult={fallingResult}
                falling={true}
              />
            </div>
          </div>

          {/* 하단: 분위기 텍스트 */}
          <div className="text-center pb-8 animate-fade-in-up" style={{ animationDelay: '1.5s' }}>
            <p className="text-text-muted text-sm">
              {fallingResult === 'won'
                ? '상대 팀이 낭떠러지로 추락합니다...'
                : '당신의 팀이 낭떠러지로 추락합니다...'}
            </p>
          </div>
        </div>
      )}

      {(gamePhase === 'won' || gamePhase === 'lost') && (
        <ResultScreen
          won={gamePhase === 'won'}
          stats={getStats()}
          onRestart={() => startGame(difficulty)}
          onHome={() => setGamePhase('menu')}
        />
      )}

      {showHowToPlay && (
        <HowToPlayModal onClose={() => setShowHowToPlay(false)} />
      )}
    </div>
  );
}

function getInitialGameState(diff) {
  return {
    ropePosition: 0,
    ropeVelocity: 0,
    playerPower: 0,
    aiPower: 0,
    timeLeft: GAME_DURATION[diff] || 90,
    fatigue: 0,
    threeStepCount: THREE_STEP_MAX[diff] || 2,
    threeStepActive: false,
    elapsed: 0,
    burnout: 0,
  };
}
