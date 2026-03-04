# 줄다리기 게임 - 기술 아키텍처 문서

## 1. 기술 스택

| 분류 | 기술 | 버전 | 용도 |
|------|------|------|------|
| UI 프레임워크 | React | 19.2 | 컴포넌트 기반 UI, `React.memo()` 최적화 |
| 빌드 도구 | Vite | 7.3 | HMR 개발 서버, 프로덕션 번들링 |
| 스타일링 | Tailwind CSS | 4.2 | 유틸리티 기반 CSS, `@tailwindcss/vite` 플러그인 |
| 린터 | ESLint | 9.x | 코드 품질 검사 |
| 배포 | Netlify | - | SPA 정적 호스팅, `_redirects` 라우팅 |
| 언어 | JavaScript (JSX) | ES2024 | React 컴포넌트, 게임 로직 |

### Tailwind CSS v4 설정

별도 `tailwind.config.js` 없이 `@tailwindcss/vite` 플러그인으로 동작한다. 커스텀 유틸리티와 애니메이션은 `index.css`의 `@theme`과 `@utility` 디렉티브로 정의한다.

---

## 2. 프로젝트 구조

```
src/
├── main.jsx                    # ReactDOM 엔트리포인트
├── index.css                   # Tailwind 임포트 + 커스텀 애니메이션/유틸리티
├── App.jsx                     # 최상위 컴포넌트, 게임 상태 관리 허브
│
├── components/
│   ├── game/
│   │   ├── GameCanvas.jsx      # 메인 Canvas 렌더링 영역
│   │   ├── Rope.jsx            # 줄 + 중앙 깃발 렌더링
│   │   ├── PlayerTeam.jsx      # 왼쪽(플레이어) 팀 캐릭터
│   │   ├── AITeam.jsx          # 오른쪽(AI) 팀 캐릭터
│   │   ├── PowerGauge.jsx      # 실시간 힘 게이지 표시
│   │   └── CenterLine.jsx      # 중앙선 + 위험 구간 표시
│   ├── ui/
│   │   ├── StartScreen.jsx     # 시작 화면 (난이도 선택)
│   │   ├── GameOverModal.jsx   # 승리/패배 결과 모달
│   │   ├── Timer.jsx           # 남은 시간 표시
│   │   ├── ScoreBoard.jsx      # 점수/라운드 표시
│   │   └── InputGuide.jsx      # 입력 안내 (키보드/터치)
│   └── layout/
│       ├── Header.jsx          # 상단 바 (게임 제목, 설정)
│       └── Background.jsx      # 배경 (오징어 게임 테마)
│
├── hooks/
│   ├── useGameLoop.js          # requestAnimationFrame 게임 루프
│   ├── useInput.js             # 키보드 + 터치 입력 통합
│   ├── usePhysics.js           # 줄 위치 물리 계산
│   ├── useAI.js                # AI 행동 로직
│   └── useTimer.js             # 카운트다운 타이머
│
├── utils/
│   ├── physics.js              # 물리 엔진 순수 함수 (힘 합산, 감쇠, 관성)
│   ├── ai.js                   # AI 알고리즘 순수 함수
│   ├── renderer.js             # Canvas 드로잉 유틸리티
│   └── audio.js                # 효과음 재생 유틸리티
│
├── constants/
│   ├── game.js                 # 게임 상수 (제한시간, 승리조건, 물리 파라미터)
│   ├── difficulty.js           # 난이도별 AI 파라미터
│   └── theme.js                # 색상, 크기 등 테마 상수
│
└── assets/
    ├── images/                 # 캐릭터 스프라이트, 배경 이미지
    ├── sounds/                 # 효과음 (당기기, 승리, 패배, 카운트다운)
    └── fonts/                  # 커스텀 폰트 (필요시)

public/
├── _redirects                  # Netlify SPA 라우팅
└── favicon.svg                 # 파비콘
```

### 설계 원칙

- **App.jsx에 상태 집중**: Context API나 상태 라이브러리 없이 `App.jsx`에서 모든 게임 상태를 관리하고 props로 전달한다.
- **hooks로 로직 분리**: 게임 루프, 입력, 물리, AI 로직을 각각 독립 hook으로 분리하여 관심사를 나눈다.
- **utils는 순수 함수**: hook이 호출하는 계산 로직은 `utils/`에 순수 함수로 작성하여 테스트 가능성을 확보한다.
- **모든 자식 컴포넌트에 `React.memo()`**: 불필요한 리렌더를 방지한다.

---

## 3. 상태 관리

### 게임 상태 모델 (`App.jsx`)

```javascript
// 게임 전체 흐름 상태
const [gamePhase, setGamePhase] = useState('idle');
// 'idle' | 'countdown' | 'playing' | 'paused' | 'won' | 'lost' | 'draw'

// 줄 위치 (중앙 = 0, 음수 = 플레이어 유리, 양수 = AI 유리)
const [ropePosition, setRopePosition] = useState(0);

// 줄 이동 속도 (관성 계산용)
const [ropeVelocity, setRopeVelocity] = useState(0);

// 플레이어 현재 힘 (0 ~ MAX_PLAYER_POWER)
const [playerPower, setPlayerPower] = useState(0);

// AI 현재 힘 (AI 알고리즘이 매 프레임 결정)
const [aiPower, setAiPower] = useState(0);

// 남은 시간 (초)
const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

// 선택된 난이도
const [difficulty, setDifficulty] = useState('normal');
// 'easy' | 'normal' | 'hard'

// 라운드 정보
const [round, setRound] = useState(1);
const [score, setScore] = useState({ player: 0, ai: 0 });
```

### 상태 흐름도

```
idle → (시작 버튼) → countdown → (3초 후) → playing → (승리조건 충족) → won/lost
                                                   → (시간 초과) → draw 또는 위치 판정
                                     playing → (일시정지) → paused → (재개) → playing
won/lost/draw → (다시 하기) → idle
```

### 승리 조건

- `ropePosition <= -WIN_THRESHOLD` : 플레이어 승리 (줄을 자기 쪽으로 끌어옴)
- `ropePosition >= WIN_THRESHOLD` : AI 승리
- `timeLeft === 0` : 현재 `ropePosition` 부호로 판정, 0이면 무승부

---

## 4. 게임 루프

### `useGameLoop.js` 설계

`requestAnimationFrame` 기반 루프로 매 프레임 물리 업데이트와 렌더링을 수행한다.

```javascript
function useGameLoop(gamePhase, updateCallback) {
  const frameRef = useRef(null);
  const prevTimeRef = useRef(null);

  useEffect(() => {
    if (gamePhase !== 'playing') {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      prevTimeRef.current = null;
      return;
    }

    const loop = (timestamp) => {
      if (prevTimeRef.current === null) {
        prevTimeRef.current = timestamp;
      }

      // deltaTime: 이전 프레임과의 시간차 (초 단위, 최대 0.05초로 클램프)
      const deltaTime = Math.min((timestamp - prevTimeRef.current) / 1000, 0.05);
      prevTimeRef.current = timestamp;

      updateCallback(deltaTime);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [gamePhase, updateCallback]);
}
```

### 프레임당 업데이트 순서

1. **입력 수집** - 현재 키/터치 상태에서 플레이어 힘 계산
2. **AI 업데이트** - AI 힘 결정
3. **물리 계산** - 순 힘 → 가속도 → 속도 → 위치 업데이트
4. **타이머 감소** - `timeLeft -= deltaTime`
5. **승리 판정** - 위치/시간 체크
6. **상태 반영** - React 상태 업데이트 (배치 처리됨, React 18+ 자동 배칭)

### deltaTime 클램프

탭 전환 등으로 프레임 간격이 급격히 벌어지면 물리 계산이 폭주한다. `deltaTime`을 `0.05초(20fps 상당)`로 클램프하여 시뮬레이션 안정성을 보장한다.

---

## 5. 입력 처리

### `useInput.js` 설계

PC 키보드와 모바일 터치를 하나의 인터페이스로 통합한다.

```javascript
function useInput(gamePhase) {
  const isPressingRef = useRef(false);    // 현재 입력 중 여부
  const tapCountRef = useRef(0);          // 연타 카운트 (힘 충전용)
  const lastTapTimeRef = useRef(0);       // 마지막 탭 시각

  useEffect(() => {
    if (gamePhase !== 'playing') return;

    // --- 키보드: 스페이스바 ---
    const onKeyDown = (e) => {
      if (e.code === 'Space' && !e.repeat) {
        e.preventDefault();
        isPressingRef.current = true;
        tapCountRef.current++;
        lastTapTimeRef.current = performance.now();
      }
    };
    const onKeyUp = (e) => {
      if (e.code === 'Space') {
        isPressingRef.current = false;
      }
    };

    // --- 터치: 화면 아무 곳이나 탭 ---
    const onTouchStart = (e) => {
      e.preventDefault();
      isPressingRef.current = true;
      tapCountRef.current++;
      lastTapTimeRef.current = performance.now();
    };
    const onTouchEnd = () => {
      isPressingRef.current = false;
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    window.addEventListener('touchstart', onTouchStart, { passive: false });
    window.addEventListener('touchend', onTouchEnd);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      window.removeEventListener('touchstart', onTouchStart);
      window.removeEventListener('touchend', onTouchEnd);
    };
  }, [gamePhase]);

  return { isPressingRef, tapCountRef, lastTapTimeRef };
}
```

### 힘 충전 메커니즘

| 입력 방식 | 동작 | 힘 계산 |
|-----------|------|---------|
| 꾹 누르기 (스페이스 / 터치 홀드) | `isPressing = true` 동안 지속적으로 힘 충전 | `power += BASE_POWER * deltaTime` |
| 연타 (스페이스 빠르게 / 반복 탭) | `tapCount` 누적, 일정 시간 내 연타 시 보너스 | `power += TAP_POWER * tapSpeedMultiplier` |

연타 속도(`tapSpeedMultiplier`)는 최근 500ms 내 탭 횟수에 비례하여 1.0 ~ 2.0 사이 값을 가진다. 입력이 없으면 힘이 `POWER_DECAY_RATE`로 자연 감쇠한다.

### 모바일 고려사항

- `touchstart`에 `{ passive: false }`로 등록하여 `e.preventDefault()`를 호출, 스크롤 방지
- iOS Safari의 더블 탭 확대 방지를 위해 `<meta name="viewport">` 에 `user-scalable=no` 추가
- 터치 영역은 화면 전체로 설정 (별도 버튼 불필요)

---

## 6. AI 로직

### `useAI.js` / `utils/ai.js` 설계

AI는 매 프레임 상황을 판단하여 힘을 결정한다. 난이도에 따라 반응 속도, 힘 범위, 전략 패턴이 달라진다.

### 난이도별 파라미터 (`constants/difficulty.js`)

```javascript
export const DIFFICULTY = {
  easy: {
    basePower: 30,          // 기본 힘 (0~100 스케일)
    powerVariance: 15,      // 힘 변동 폭 (±)
    reactionDelay: 0.8,     // 상황 변화 감지 후 반응까지 지연 (초)
    surgeChance: 0.05,      // 프레임당 돌발 힘 급증 확률
    surgePower: 20,         // 돌발 힘 급증 크기
    adaptRate: 0.3,         // 플레이어 힘에 대한 적응 속도 (0~1)
    mistakeChance: 0.1,     // 프레임당 실수 확률 (힘 급감)
  },
  normal: {
    basePower: 45,
    powerVariance: 10,
    reactionDelay: 0.4,
    surgeChance: 0.08,
    surgePower: 30,
    adaptRate: 0.6,
    mistakeChance: 0.03,
  },
  hard: {
    basePower: 60,
    powerVariance: 8,
    reactionDelay: 0.15,
    surgeChance: 0.12,
    surgePower: 40,
    adaptRate: 0.9,
    mistakeChance: 0.005,
  },
};
```

### AI 결정 알고리즘

```javascript
function calculateAIPower(params, gameState, deltaTime) {
  const { basePower, powerVariance, reactionDelay, surgeChance,
          surgePower, adaptRate, mistakeChance } = params;

  // 1. 기본 힘 + 노이즈
  let power = basePower + (Math.random() * 2 - 1) * powerVariance;

  // 2. 적응: 플레이어가 강하면 AI도 힘을 올림 (지연 적용)
  //    delayedPlayerPower는 reactionDelay만큼 과거의 플레이어 힘
  const delayedPlayerPower = getDelayedValue(
    gameState.playerPowerHistory, reactionDelay
  );
  power += (delayedPlayerPower - power) * adaptRate * deltaTime;

  // 3. 위기 대응: 줄이 많이 밀리면 힘 급증
  if (gameState.ropePosition < -0.5) {  // AI가 밀리는 중
    power *= 1.3;
  }

  // 4. 돌발 급증 (서지)
  if (Math.random() < surgeChance * deltaTime * 60) {
    power += surgePower;
  }

  // 5. 실수 (힘 급감)
  if (Math.random() < mistakeChance * deltaTime * 60) {
    power *= 0.2;
  }

  return Math.max(0, Math.min(100, power));
}
```

### 플레이어 힘 히스토리

AI 반응 지연을 구현하기 위해 플레이어 힘을 타임스탬프와 함께 링 버퍼에 기록한다. `getDelayedValue(history, delay)`는 현재 시각에서 `delay`초 전의 값을 보간하여 반환한다.

---

## 7. 물리 모델

### 핵심 변수

| 변수 | 의미 | 범위 |
|------|------|------|
| `ropePosition` | 줄 중앙 위치 | -1.0 (플레이어 완승) ~ +1.0 (AI 완승) |
| `ropeVelocity` | 줄 이동 속도 | 실수 |
| `playerForce` | 플레이어 쪽 힘 (음방향) | 0 ~ 100 |
| `aiForce` | AI 쪽 힘 (양방향) | 0 ~ 100 |

### 물리 계산 (`utils/physics.js`)

```javascript
// 상수
const MASS = 10;            // 줄(팀) 의 질량 (관성 크기 결정)
const DAMPING = 3.0;        // 감쇠 계수 (속도에 비례하는 마찰)
const FORCE_SCALE = 0.01;   // 힘 → 가속도 변환 스케일
const WIN_THRESHOLD = 1.0;  // 이 위치에 도달하면 승리

function updatePhysics(state, deltaTime) {
  const { ropePosition, ropeVelocity, playerForce, aiForce } = state;

  // 순 힘 = AI힘(+방향) - 플레이어힘(-방향)
  const netForce = (aiForce - playerForce) * FORCE_SCALE;

  // 가속도 = (순 힘 - 감쇠력) / 질량
  const acceleration = (netForce - DAMPING * ropeVelocity) / MASS;

  // 속도 업데이트 (반-암묵적 오일러)
  const newVelocity = ropeVelocity + acceleration * deltaTime;

  // 위치 업데이트
  const newPosition = ropePosition + newVelocity * deltaTime;

  return {
    ropePosition: Math.max(-1.2, Math.min(1.2, newPosition)),
    ropeVelocity: newVelocity,
  };
}
```

### 물리 파라미터 선택 근거

- **`MASS = 10`** : 너무 낮으면 줄이 과민 반응하고, 너무 높으면 입력 반응이 둔하다. 10은 0.5초 정도의 관성감을 준다.
- **`DAMPING = 3.0`** : 입력을 멈추면 약 1초 내에 줄이 정지한다. 줄다리기의 "버티기" 느낌을 만든다.
- **`FORCE_SCALE = 0.01`** : 플레이어와 AI의 힘 값(0~100)을 물리적으로 의미있는 크기로 변환한다.
- **위치 클램프 `[-1.2, 1.2]`** : `WIN_THRESHOLD(1.0)`을 초과하는 약간의 오버슈트를 허용하여 끌려가는 시각적 효과를 만든다.

### 반-암묵적 오일러(Semi-Implicit Euler)

명시적 오일러(`위치 += 속도 * dt` 후 `속도 += 가속도 * dt`)보다 안정적이다. 속도를 먼저 업데이트한 후 새 속도로 위치를 계산한다. 이 방식은 에너지가 발산하지 않아 게임 물리에 적합하다.

---

## 8. 애니메이션

### Canvas vs CSS 선택

| 요소 | 방식 | 근거 |
|------|------|------|
| 줄(로프) | **Canvas** | 곡선, 장력 표현 등 동적 형태 변형이 필요 |
| 캐릭터 | **Canvas** | 위치가 물리 엔진에 의해 매 프레임 변경됨 |
| 중앙선/깃발 | **Canvas** | 줄과 동기화된 위치 업데이트 필요 |
| 힘 게이지 | **CSS + Tailwind** | 단순 바 형태, CSS width/transform으로 충분 |
| UI (모달, 버튼, 타이머) | **CSS + Tailwind** | DOM 기반이 접근성/반응형에 유리 |
| 배경 효과 | **CSS** | 그라데이션, 패턴 등 정적 요소 |
| 승리/패배 이펙트 | **CSS @keyframes** | 흔들기, 페이드, 스케일 등 단발성 애니메이션 |

### Canvas 구현 방식

`GameCanvas.jsx`에서 단일 `<canvas>` 엘리먼트를 사용한다. `useRef`로 canvas 참조를 잡고, 게임 루프에서 매 프레임 `clearRect` 후 전체를 다시 그린다.

```javascript
// GameCanvas.jsx 핵심 구조
const canvasRef = useRef(null);

const draw = useCallback((ctx, state) => {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);

  drawBackground(ctx, width, height);
  drawCenterLine(ctx, width, height);
  drawRope(ctx, width, height, state.ropePosition);
  drawPlayerTeam(ctx, width, height, state.ropePosition, state.playerPower);
  drawAITeam(ctx, width, height, state.ropePosition, state.aiPower);
  drawFlag(ctx, width, height, state.ropePosition);
}, []);
```

### 줄(로프) 렌더링

줄은 직선이 아닌 2차 베지어 곡선으로 그린다. 장력(양팀 힘의 합)이 클수록 직선에 가까워지고, 힘의 차이가 클수록 한쪽으로 처진다.

```javascript
function drawRope(ctx, width, height, ropePosition) {
  const centerY = height * 0.5;
  const startX = width * 0.15;
  const endX = width * 0.85;
  const offsetX = ropePosition * (width * 0.35); // 위치에 따른 수평 이동

  // 장력에 따른 처짐 정도
  const sag = 20 * (1 - tension);  // tension이 높을수록 처짐 감소

  ctx.beginPath();
  ctx.moveTo(startX + offsetX, centerY);
  ctx.quadraticCurveTo(
    (startX + endX) / 2 + offsetX, centerY + sag,
    endX + offsetX, centerY
  );
  ctx.lineWidth = 6;
  ctx.strokeStyle = '#8B6914';
  ctx.stroke();
}
```

### 캐릭터 애니메이션

캐릭터는 줄다리기 자세의 스프라이트 시트를 사용한다. 힘을 주는 중(`isPressing`)이면 "당기기" 프레임, 아니면 "대기" 프레임을 표시한다. 캐릭터의 x 좌표는 `ropePosition`에 연동되어 줄과 함께 이동한다.

### CSS 애니메이션 (`index.css`)

```css
@theme {
  --color-squid-pink: #ED1164;
  --color-squid-teal: #067C7C;
  --color-squid-dark: #1A1A2E;
  --color-rope-brown: #8B6914;
}

/* 승리 시 화면 흔들기 */
@utility shake {
  animation: shake 0.5s ease-in-out;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-10px); }
  75% { transform: translateX(10px); }
}

/* 카운트다운 숫자 팝업 */
@utility count-pop {
  animation: countPop 0.8s ease-out forwards;
}

@keyframes countPop {
  0% { transform: scale(0.3); opacity: 0; }
  50% { transform: scale(1.2); opacity: 1; }
  100% { transform: scale(1); opacity: 1; }
}

/* 힘 게이지 펄스 */
@utility gauge-pulse {
  animation: gaugePulse 0.3s ease-in-out infinite;
}

@keyframes gaugePulse {
  0%, 100% { box-shadow: 0 0 5px var(--color-squid-pink); }
  50% { box-shadow: 0 0 20px var(--color-squid-pink); }
}
```

---

## 9. 반응형 설계

### 브레이크포인트 전략

| 구간 | 너비 | 레이아웃 |
|------|------|----------|
| 모바일 (기본) | ~ 639px | 세로 배치, 터치 전체 화면 |
| 태블릿 | 640px ~ 1023px | 가로 배치, 여유 패딩 |
| 데스크탑 | 1024px ~ | 가로 배치, 최대 너비 제한 |

### Canvas 크기 조정

Canvas의 논리적 해상도와 CSS 표시 크기를 분리하여 고해상도 디스플레이를 지원한다.

```javascript
function resizeCanvas(canvas) {
  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
}
```

Canvas의 CSS 크기는 Tailwind의 `w-full`로 부모 컨테이너에 맞추고, `ResizeObserver`로 크기 변화를 감지하여 Canvas를 재설정한다.

### 모바일 레이아웃

```
┌─────────────────────────┐
│       타이머 / 점수       │  ← 상단 고정
├─────────────────────────┤
│                         │
│     [Canvas 게임 화면]    │  ← 남은 공간 전체 사용
│                         │
├─────────────────────────┤
│    [힘 게이지]  [입력안내]  │  ← 하단 고정, 터치 영역 겸용
└─────────────────────────┘
```

- 게임 화면은 `flex-1`로 남은 공간을 모두 차지
- 하단 UI는 `fixed bottom-0`으로 고정하되, 터치 이벤트는 화면 전체에 등록하여 별도 탭 영역 불필요
- `h-dvh` (dynamic viewport height) 사용으로 모바일 주소창 변화에 대응

### 데스크탑 레이아웃

```
┌──────────────────────────────────────┐
│           타이머 / 점수 / 라운드        │
├──────────────────────────────────────┤
│                                      │
│  [플레이어팀]  ===줄===깃발===  [AI팀]  │
│                                      │
├──────────────────────────────────────┤
│  [힘 게이지]        [스페이스바 안내]     │
└──────────────────────────────────────┘
```

- 최대 너비 `max-w-5xl`로 제한하여 초대형 화면에서 게임이 과도하게 넓어지지 않도록 함
- Canvas의 가로세로비를 `aspect-[16/9]`로 고정

### 입력 안내 전환

기기 종류에 따라 입력 안내를 다르게 표시한다.

```javascript
// 터치 지원 여부 감지
const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;

// 안내 메시지
// 터치: "화면을 빠르게 터치하세요!"
// PC:   "스페이스바를 연타하세요!"
```

### 전체 화면 모드

모바일에서는 게임 시작 시 전체 화면 API(`element.requestFullscreen()`)를 요청하여 브라우저 UI를 숨기고 몰입감을 높인다. 지원하지 않는 브라우저에서는 무시한다.
