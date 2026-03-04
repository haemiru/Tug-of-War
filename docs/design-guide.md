# 줄다리기 (Tug-of-War) 비주얼 디자인 가이드

> 오징어 게임 시즌 1 줄다리기를 모티브로 한 캐주얼 PC/모바일 웹 게임
> React + Tailwind CSS v4 기반

---

## 1. 디자인 컨셉

### 핵심 키워드
- **긴장감** — 생사를 건 게임의 압도적 서스펜스
- **레트로 산업시설** — 녹슨 철골, 콘크리트, 어두운 조명
- **대비** — 어둠 속 핑크, 초록 트레이닝복의 강렬한 색 대비
- **미니멀 잔혹함** — 깔끔한 도형과 기호로 표현되는 잔인한 규칙

### 비주얼 아이덴티티
| 요소 | 오징어게임 원작 | 게임 적용 |
|------|----------------|-----------|
| 참가자 | 녹색 트레이닝복, 흰 번호 | 녹색 캐릭터 블록 + 번호 |
| 진행요원 | 핑크 점프수트, 검은 마스크 | UI 강조색, 버튼 컬러 |
| 경기장 | 높은 곳의 플랫폼, 심연 | 게임 화면 하단 = 낭떠러지 |
| VIP | 골드 마스크 | 골드 색상 = 점수/보상 |
| 줄 | 굵은 밧줄, 중앙 표식 | 수평 프로그레스 바 + 중앙선 |

### 무드보드 방향
- **배경**: 깊은 남색~검정 그라데이션, 미세한 노이즈 텍스처
- **조명 효과**: 위에서 내리쬐는 스포트라이트 느낌 (CSS radial-gradient)
- **분위기**: 경기 시작 전 고요 → 경기 중 격렬 → 결과 극적 연출

---

## 2. 컬러 팔레트

### 메인 컬러

```
배경 (Dark Base)
┌──────────────────────────────────────┐
│  #0D0D1A  극심한 어둠 (최하단 배경)    │
│  #1A1A2E  기본 배경                   │
│  #16213E  카드/패널 배경               │
│  #0F3460  활성 패널/호버 배경           │
└──────────────────────────────────────┘
```

### 팀 컬러

```
플레이어 팀 (녹색 트레이닝복)
┌──────────────────────────────────────┐
│  #1B6B3A  기본 녹색                   │
│  #2D9B56  밝은 녹색 (호버/활성)        │
│  #0E4423  어두운 녹색 (그림자)         │
│  #FFFFFF  번호 텍스트                  │
└──────────────────────────────────────┘

상대 팀 (붉은 계열)
┌──────────────────────────────────────┐
│  #8B2252  기본 적색                   │
│  #B5335E  밝은 적색 (호버/활성)        │
│  #5C1636  어두운 적색 (그림자)         │
│  #FFFFFF  번호 텍스트                  │
└──────────────────────────────────────┘
```

### 강조 컬러

```
핑크 (진행요원 / CTA 버튼)
┌──────────────────────────────────────┐
│  #FF006E  시그니처 핑크               │
│  #FF3385  밝은 핑크 (호버)            │
│  #CC0058  눌림 핑크 (active)          │
└──────────────────────────────────────┘

골드 (점수 / 보상 / VIP)
┌──────────────────────────────────────┐
│  #FFD700  기본 골드                   │
│  #FFEC80  밝은 골드 (발광)            │
│  #B8960C  어두운 골드 (텍스트)         │
└──────────────────────────────────────┘

위험 (레드 / 경고)
┌──────────────────────────────────────┐
│  #E63946  경고 레드                   │
│  #FF4D5A  밝은 레드 (깜빡임)          │
│  #A31621  어두운 레드 (심각 경고)      │
└──────────────────────────────────────┘
```

### 보조 컬러

```
텍스트
┌──────────────────────────────────────┐
│  #FFFFFF  주요 텍스트                  │
│  #E0E0E0  보조 텍스트                  │
│  #8892A0  비활성 텍스트                │
│  #FF006E  강조 텍스트                  │
└──────────────────────────────────────┘

줄 (밧줄)
┌──────────────────────────────────────┐
│  #8B7355  밧줄 기본색                  │
│  #A0896A  밧줄 하이라이트              │
│  #6B5740  밧줄 그림자                  │
└──────────────────────────────────────┘
```

### Tailwind 설정 예시

```js
// tailwind 색상 커스텀 (CSS 변수 방식)
// app.css 또는 index.css 내 @theme 블록에 정의
@theme {
  --color-bg-deep: #0D0D1A;
  --color-bg-base: #1A1A2E;
  --color-bg-panel: #16213E;
  --color-bg-active: #0F3460;

  --color-team-player: #1B6B3A;
  --color-team-player-light: #2D9B56;
  --color-team-enemy: #8B2252;
  --color-team-enemy-light: #B5335E;

  --color-accent-pink: #FF006E;
  --color-accent-gold: #FFD700;
  --color-danger: #E63946;

  --color-rope: #8B7355;
}
```

---

## 3. 타이포그래피

### 폰트 선택

| 용도 | 폰트 | Google Fonts | 비고 |
|------|------|-------------|------|
| 제목/숫자 | **Black Han Sans** | `Black+Han+Sans` | 굵고 임팩트 있는 한글 폰트, 게임 제목에 적합 |
| 본문/UI | **Noto Sans KR** | `Noto+Sans+KR:wght@400;700` | 가독성 우수, 다양한 굵기 |
| 숫자/타이머 | **Orbitron** | `Orbitron:wght@700;900` | 디지털 느낌, 타이머/점수에 사용 |

### HTML 폰트 로드

```html
<link href="https://fonts.googleapis.com/css2?family=Black+Han+Sans&family=Noto+Sans+KR:wght@400;700&family=Orbitron:wght@700;900&display=swap" rel="stylesheet">
```

### 크기 체계 (Tailwind 클래스 기준)

```
게임 제목 (로고)       — text-5xl md:text-7xl  (Black Han Sans)
                         "줄다리기"

섹션 제목              — text-3xl md:text-4xl  (Black Han Sans)
                         "게임 준비", "결과"

카운트다운 숫자        — text-8xl md:text-9xl  (Orbitron, 900)
                         "3", "2", "1"

타이머                 — text-4xl md:text-5xl  (Orbitron, 700)
                         "01:30"

게임 내 주요 텍스트    — text-xl md:text-2xl   (Noto Sans KR, 700)
                         "힘을 모아라!"

버튼 텍스트            — text-lg md:text-xl    (Noto Sans KR, 700)
                         "게임 시작"

설명/보조 텍스트       — text-sm md:text-base  (Noto Sans KR, 400)
                         "화면을 빠르게 탭하세요"

캐릭터 번호            — text-xs               (Orbitron, 700)
                         "456", "001"
```

---

## 4. 화면별 레이아웃

### 4-1. 메인 화면 (타이틀)

```
┌─────────────────────────────────────────────┐
│                                             │
│            ◇ ○ □  (오징어게임 심볼)           │
│                                             │
│         ╔═══════════════════════╗            │
│         ║                       ║            │
│         ║     줄 다 리 기        ║            │
│         ║     TUG OF WAR        ║            │
│         ║                       ║            │
│         ╚═══════════════════════╝            │
│                                             │
│              ┌──── 밧줄 일러스트 ────┐        │
│          🟢🟢🟢═══════════════🔴🔴🔴         │
│              └───────────────────┘          │
│                                             │
│         ┌─────────────────────┐             │
│         │    ▶  게임 시작       │  ← 핑크 버튼 │
│         └─────────────────────┘             │
│                                             │
│         ┌─────────────────────┐             │
│         │    📖 게임 방법       │  ← 투명 버튼 │
│         └─────────────────────┘             │
│                                             │
│         ┌─────────────────────┐             │
│         │    🏆 랭킹 보기       │  ← 투명 버튼 │
│         └─────────────────────┘             │
│                                             │
│  ───────────────────────────────────────── │
│  하단: 사운드 ON/OFF    난이도 선택           │
└─────────────────────────────────────────────┘
```

**핵심 요소:**
- 배경: `#0D0D1A` → `#1A1A2E` 수직 그라데이션
- 스포트라이트 효과: 타이틀 주변 `radial-gradient(circle at 50% 30%, rgba(255,0,110,0.15), transparent 60%)`
- 제목은 `text-shadow: 0 0 20px rgba(255,0,110,0.5)` 글로우 효과
- 밧줄 일러스트는 CSS로 구현 (수평선 + 양쪽 캐릭터 블록)

### 4-2. 게임 화면 (핵심)

```
┌─────────────────────────────────────────────┐
│  ⏱ 01:30              ROUND 1/3    ♪ 🔊    │
│─────────────────────────────────────────────│
│                                             │
│               ↓ 낭떠러지 위치 표시             │
│  ┌───────────────────────────────────────┐  │
│  │            ▽ 낭떠러지 ▽                │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌───────────────────────────────────────┐  │
│  │  🟢🟢🟢 ════╤════════════ 🔴🔴🔴     │  │
│  │  플레이어    │중앙선       상대팀      │  │
│  │             ▼                         │  │
│  │         [줄 위치 바]                   │  │
│  └───────────────────────────────────────┘  │
│                                             │
│  ┌─── 줄 위치 표시 바 (상세) ───────────┐   │
│  │ ◀ ████████████│████░░░░░░░░░░░░░ ▶  │   │
│  │   플레이어 쪽  │중앙   상대 쪽        │   │
│  │               ▲                      │   │
│  │          현재 줄 위치                  │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌─── 파워 게이지 ──────────────────────┐   │
│  │  💪 파워: ████████████░░░░ 78%        │   │
│  │  ───────────────────────────────────  │   │
│  │  🔥 연속 탭: 12회   최고: 24회         │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ┌──────────────────────────────────────┐   │
│  │                                      │   │
│  │     ┌────────────────────┐           │   │
│  │     │                    │           │   │
│  │     │   👆 TAP! TAP!     │  ← 탭 영역│   │
│  │     │   (빠르게 탭하세요)  │           │   │
│  │     │                    │           │   │
│  │     └────────────────────┘           │   │
│  │                                      │   │
│  └──────────────────────────────────────┘   │
│                                             │
│  ───────────────────────────────────────── │
│  "힘을 모아라!" / "밀리고 있다!" (상태 메시지) │
└─────────────────────────────────────────────┘
```

**줄 위치 표시 바 상세 구현:**

```
전체 너비: w-full (화면 폭의 90%)
구조: 수평 프로그레스 바

        패배 영역        안전 영역         패배 영역
  ┌──────────┬─────────────────────┬──────────┐
  │ ██ DANGER │░░░░░░░░│░░░░░░░░░│ DANGER ██ │
  │  (적색)   │ 플레이어│  상대   │  (적색)   │
  └──────────┴────────┼──────────┴──────────┘
                      │
                   중앙 표식
                   (핑크 라인)

  - 중앙: 핑크(#FF006E) 세로선, 2px, 글로우 효과
  - 현재 위치: 골드(#FFD700) 마커, 위아래로 삼각형
  - 양쪽 끝 20%: 빨간색 위험 구역 (반투명 #E63946)
  - 표시 바 높이: h-4 md:h-6
  - 테두리: border border-white/20 rounded-full
```

### 4-3. 결과 화면

```
승리 시:
┌─────────────────────────────────────────────┐
│                                             │
│           ★ ✦ ★ ✦ ★ ✦ ★ ✦ ★               │
│                                             │
│            🏆  승  리  🏆                    │
│                                             │
│         ╔═══════════════════════╗            │
│         ║  ROUND 클리어!         ║            │
│         ║                       ║            │
│         ║  생존 시간: 01:30      ║            │
│         ║  최고 연속 탭: 48회     ║            │
│         ║  총 탭 횟수: 234회      ║            │
│         ║                       ║            │
│         ║  💰 상금: ₩45,600,000  ║            │
│         ╚═══════════════════════╝            │
│                                             │
│         ┌─────────────────────┐             │
│         │  ▶ 다음 라운드        │             │
│         └─────────────────────┘             │
│         ┌─────────────────────┐             │
│         │  🏠 메인으로          │             │
│         └─────────────────────┘             │
│                                             │
└─────────────────────────────────────────────┘

패배 시:
┌─────────────────────────────────────────────┐
│                                             │
│          (화면 전체 빨간색 플래시)              │
│                                             │
│              탈  락                          │
│                                             │
│         ╔═══════════════════════╗            │
│         ║                       ║            │
│         ║  생존 시간: 00:45      ║            │
│         ║  최고 연속 탭: 12회     ║            │
│         ║  총 탭 횟수: 89회       ║            │
│         ║                       ║            │
│         ╚═══════════════════════╝            │
│                                             │
│         ┌─────────────────────┐             │
│         │  🔄 다시 도전          │             │
│         └─────────────────────┘             │
│         ┌─────────────────────┐             │
│         │  🏠 메인으로          │             │
│         └─────────────────────┘             │
│                                             │
└─────────────────────────────────────────────┘
```

### 4-4. 게임 방법 모달

```
┌─────────────────────────────────────────────┐
│  ╔═══════════════════════════════════════╗   │
│  ║  📖 게임 방법                     ✕   ║   │
│  ║───────────────────────────────────────║   │
│  ║                                       ║   │
│  ║  1. 화면을 빠르게 탭하여 힘을 모으세요   ║   │
│  ║     👆👆👆                             ║   │
│  ║                                       ║   │
│  ║  2. 줄을 우리 쪽으로 당기면 승리!        ║   │
│  ║     🟢🟢🟢 ←══════ 🔴🔴🔴             ║   │
│  ║                                       ║   │
│  ║  3. 줄이 상대쪽으로 넘어가면 패배...     ║   │
│  ║     🟢🟢🟢 ══════→ 🔴🔴🔴             ║   │
│  ║                                       ║   │
│  ║  💡 팁: 일정한 리듬으로 탭하면           ║   │
│  ║     보너스 파워를 얻을 수 있습니다!       ║   │
│  ║                                       ║   │
│  ║  ┌─────────────────────────────┐     ║   │
│  ║  │        알겠습니다!            │     ║   │
│  ║  └─────────────────────────────┘     ║   │
│  ╚═══════════════════════════════════════╝   │
└─────────────────────────────────────────────┘
```

---

## 5. 캐릭터/오브젝트 디자인

### 5-1. 참가자 캐릭터 (CSS 기반)

캐릭터는 CSS 도형 + 텍스트 조합으로 표현한다. 3D 모델이나 복잡한 이미지 없이, 미니멀한 블록형 캐릭터를 사용한다.

```
플레이어 팀 캐릭터 (녹색 트레이닝복)

     ┌───┐
     │ 😤│  ← 머리 (원형, bg-bg-panel, 표정은 이모지)
     └─┬─┘
   ┌───┴───┐
   │  456  │  ← 몸통 (사각형, bg-team-player, 흰 번호)
   │       │
   └───┬───┘
     ┌─┴─┐
     │   │   ← 다리 (사각형, 같은 녹색)
     └───┘
```

**Tailwind 클래스 구성:**

```html
<!-- 플레이어 캐릭터 -->
<div class="flex flex-col items-center">
  <!-- 머리 -->
  <div class="w-8 h-8 rounded-full bg-[#16213E] border-2 border-white/30
              flex items-center justify-center text-sm">
    😤
  </div>
  <!-- 몸통 -->
  <div class="w-10 h-12 bg-[#1B6B3A] rounded-sm border border-[#0E4423]
              flex items-center justify-center -mt-1">
    <span class="text-white text-xs font-bold font-[Orbitron]">456</span>
  </div>
  <!-- 다리 -->
  <div class="flex gap-1 -mt-0.5">
    <div class="w-4 h-6 bg-[#1B6B3A] rounded-b-sm"></div>
    <div class="w-4 h-6 bg-[#1B6B3A] rounded-b-sm"></div>
  </div>
</div>
```

### 5-2. 캐릭터 표정 상태

| 상태 | 이모지 | 사용 시점 |
|------|--------|----------|
| 대기 | 😐 | 게임 시작 전 |
| 힘쓰기 | 😤 | 탭 중, 유리할 때 |
| 위기 | 😰 | 밀리고 있을 때 |
| 승리 | 🎉 | 라운드 승리 |
| 패배 | 😱 | 라운드 패배 |

### 5-3. 밧줄 디자인

```html
<!-- 밧줄 본체 -->
<div class="relative w-full h-3 mx-4">
  <!-- 밧줄 기본 (갈색 그라데이션) -->
  <div class="absolute inset-0 rounded-full"
       style="background: linear-gradient(to bottom,
              #A0896A 0%, #8B7355 40%, #6B5740 100%);
              box-shadow: 0 2px 4px rgba(0,0,0,0.5);">
  </div>
  <!-- 밧줄 꼬임 패턴 (반복 대각선) -->
  <div class="absolute inset-0 rounded-full opacity-30"
       style="background: repeating-linear-gradient(
              45deg, transparent, transparent 4px,
              rgba(255,255,255,0.2) 4px, rgba(255,255,255,0.2) 6px);">
  </div>
  <!-- 중앙 표식 (핑크 리본) -->
  <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
              w-1.5 h-6 bg-[#FF006E] rounded-sm
              shadow-[0_0_10px_rgba(255,0,110,0.6)]">
  </div>
</div>
```

### 5-4. 낭떠러지 표현

```html
<!-- 낭떠러지 (게임 화면 하단) -->
<div class="relative w-full h-16 overflow-hidden">
  <!-- 플랫폼 가장자리 -->
  <div class="absolute top-0 w-full h-2 bg-[#2a2a3a]
              border-t-2 border-[#FF006E]/30"></div>
  <!-- 심연 그라데이션 -->
  <div class="absolute top-2 w-full h-14"
       style="background: linear-gradient(to bottom,
              #0D0D1A 0%, #000000 100%);">
  </div>
  <!-- 안개 효과 -->
  <div class="absolute top-4 w-full h-8 opacity-20"
       style="background: radial-gradient(ellipse at center,
              rgba(255,0,110,0.3), transparent 70%);">
  </div>
</div>
```

### 5-5. 파워 게이지

```
┌────────────────────────────────────┐
│  💪  ████████████████░░░░░░  78%   │
│      ← 녹색→노랑→빨강 그라데이션 →   │
└────────────────────────────────────┘

- 0~40%:  bg-[#E63946] (위험, 빨간색)
- 40~70%: bg-[#FFD700] (보통, 노란색)
- 70~100%: bg-[#2D9B56] (좋음, 녹색)
- 게이지 테두리: border border-white/20
- 배경: bg-white/10
- 높이: h-4 rounded-full
```

---

## 6. 애니메이션 가이드

### 6-1. 줄 움직임

```css
/* 줄 위치 이동 — 부드럽고 물리적인 느낌 */
.rope-position {
  transition: transform 0.15s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

/* 줄 흔들림 — 힘을 줄 때마다 미세한 떨림 */
@keyframes rope-shake {
  0%, 100% { transform: translateY(0); }
  25% { transform: translateY(-2px) rotate(0.5deg); }
  75% { transform: translateY(1px) rotate(-0.3deg); }
}

/* 줄 팽팽함 — 긴장 상태에서 줄이 떨리는 효과 */
@keyframes rope-tension {
  0%, 100% { transform: scaleY(1); }
  50% { transform: scaleY(0.97); }
}
```

**Tailwind @utility 정의:**

```css
@utility animate-rope-shake {
  animation: rope-shake 0.2s ease-in-out;
}

@utility animate-rope-tension {
  animation: rope-tension 0.5s ease-in-out infinite;
}
```

### 6-2. 캐릭터 흔들림

```css
/* 힘쓰기 모션 — 탭할 때마다 캐릭터가 뒤로 젖혀지는 동작 */
@keyframes pull-motion {
  0% { transform: translateX(0) rotate(0deg); }
  30% { transform: translateX(-4px) rotate(-8deg); }
  60% { transform: translateX(-2px) rotate(-4deg); }
  100% { transform: translateX(0) rotate(0deg); }
}

/* 밀림 모션 — 상대에게 밀릴 때 앞으로 끌려가는 동작 */
@keyframes pushed-motion {
  0% { transform: translateX(0); }
  50% { transform: translateX(6px) rotate(5deg); }
  100% { transform: translateX(3px) rotate(2deg); }
}

/* 승리 점프 */
@keyframes victory-jump {
  0%, 100% { transform: translateY(0); }
  40% { transform: translateY(-20px); }
  60% { transform: translateY(-15px); }
}

/* 패배 추락 */
@keyframes defeat-fall {
  0% { transform: translateY(0) rotate(0deg); opacity: 1; }
  100% { transform: translateY(200px) rotate(45deg); opacity: 0; }
}
```

**Tailwind @utility 정의:**

```css
@utility animate-pull {
  animation: pull-motion 0.3s ease-out;
}

@utility animate-pushed {
  animation: pushed-motion 0.4s ease-in-out;
}

@utility animate-victory {
  animation: victory-jump 0.6s ease-out 3;
}

@utility animate-defeat {
  animation: defeat-fall 1.2s ease-in forwards;
}
```

### 6-3. 카운트다운 연출

```css
/* 3, 2, 1 카운트다운 숫자 — 크게 나타났다 사라짐 */
@keyframes countdown-pop {
  0% { transform: scale(0.3); opacity: 0; }
  40% { transform: scale(1.3); opacity: 1; }
  70% { transform: scale(1); opacity: 1; }
  100% { transform: scale(0.8); opacity: 0; }
}

/* "시작!" 텍스트 — 가로로 퍼지며 등장 */
@keyframes start-flash {
  0% { transform: scaleX(0); opacity: 0; }
  50% { transform: scaleX(1.2); opacity: 1; }
  100% { transform: scaleX(1); opacity: 1; }
}
```

### 6-4. 화면 효과

```css
/* 위기 상황 — 화면 테두리 빨간색 펄스 */
@keyframes danger-pulse {
  0%, 100% { box-shadow: inset 0 0 30px rgba(230,57,70,0); }
  50% { box-shadow: inset 0 0 30px rgba(230,57,70,0.4); }
}

/* 승리 — 골드 파티클 효과 (배경) */
@keyframes gold-shimmer {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* 패배 — 화면 빨간 플래시 */
@keyframes defeat-flash {
  0% { background-color: transparent; }
  20% { background-color: rgba(230,57,70,0.6); }
  100% { background-color: transparent; }
}

/* 탭 피드백 — 탭 지점에서 퍼지는 원 */
@keyframes tap-ripple {
  0% { transform: scale(0); opacity: 0.5; }
  100% { transform: scale(2); opacity: 0; }
}
```

### 6-5. 전환 효과

```css
/* 화면 전환 — 핑크 커튼이 좌우에서 닫혔다 열림 */
@keyframes curtain-close {
  0% { transform: scaleX(0); }
  100% { transform: scaleX(1); }
}

@keyframes curtain-open {
  0% { transform: scaleX(1); }
  100% { transform: scaleX(0); }
}

/* 사용: 왼쪽 반 + 오른쪽 반 각각 origin-left, origin-right */
```

---

## 7. 반응형 디자인

### 브레이크포인트

| 구분 | 범위 | Tailwind | 레이아웃 |
|------|------|----------|---------|
| 모바일 (기본) | ~767px | 기본값 | 세로 중심 |
| 태블릿 | 768~1023px | `md:` | 가로 확장 |
| PC | 1024px~ | `lg:` | 최대 너비 제한 |

### 모바일 레이아웃 (세로 방향)

```
┌──────────────────┐
│ ⏱ 01:30   R1/3  │  ← 상단 바 (고정)
│──────────────────│
│                  │
│  🟢🟢🟢          │  ← 캐릭터: 세로 배치
│  ════════════    │     줄: 세로 방향
│  🔴🔴🔴          │
│                  │
│ ◀████│░░░░░░▶  │  ← 위치 바: 세로 게이지로 변환
│                  │
│ ┌──────────────┐ │
│ │ 💪 78%       │ │  ← 파워 게이지
│ └──────────────┘ │
│                  │
│ ┌──────────────┐ │
│ │              │ │
│ │  👆 TAP!     │ │  ← 탭 영역 (화면 하단 40%)
│ │              │ │
│ │              │ │
│ └──────────────┘ │
│                  │
│ "힘을 모아라!"    │  ← 상태 메시지
└──────────────────┘
```

### PC 레이아웃 (가로 방향)

```
┌────────────────────────────────────────────────────────────┐
│  ⏱ 01:30              ROUND 1/3              ♪ 🔊  ⚙️    │
│────────────────────────────────────────────────────────────│
│                                                            │
│   🟢🟢🟢 ═══════════════╤═══════════════ 🔴🔴🔴           │
│                          │                                 │
│   ◀ ████████████████████│░░░░░░░░░░░░░░░░░░░░░░░░░ ▶     │
│                                                            │
│   ┌────────────────────────────────────────────────┐       │
│   │  💪 파워: ████████████████░░░░░░ 78%            │       │
│   └────────────────────────────────────────────────┘       │
│                                                            │
│   ┌────────────────────────────────────────────────┐       │
│   │                                                │       │
│   │              👆 TAP! TAP! TAP!                 │       │
│   │           (키보드: Space 또는 클릭)              │       │
│   │                                                │       │
│   └────────────────────────────────────────────────┘       │
│                                                            │
│   "힘을 모아라!"                                            │
└────────────────────────────────────────────────────────────┘
```

### 반응형 핵심 차이점

| 요소 | 모바일 | PC |
|------|--------|-----|
| 줄 방향 | 세로 (위=아군, 아래=적) 또는 가로 축소 | 가로 (좌=아군, 우=적) |
| 탭 영역 | 화면 하단 40% 전체 | 하단 중앙 영역 |
| 입력 방식 | 터치 탭 | 클릭 또는 Space 키 |
| 캐릭터 크기 | 축소 (w-6 h-8) | 기본 (w-10 h-14) |
| 타이머 크기 | text-2xl | text-4xl |
| 최대 너비 | 100% | max-w-4xl mx-auto |
| 파워 게이지 | 화면 폭 90% | 화면 폭 60% |

### 탭 영역 반응형 처리

```html
<!-- 모바일: 넓은 터치 영역 -->
<button class="w-full h-40 md:h-48 lg:w-[60%] lg:mx-auto
               bg-[#16213E] border-2 border-[#FF006E]/30
               rounded-2xl active:bg-[#FF006E]/20
               transition-colors duration-75
               touch-action-manipulation">
  <span class="text-2xl md:text-3xl text-white/60">
    👆 TAP!
  </span>
</button>
```

---

## 8. 사운드 디자인 가이드

### 효과음 목록

| 카테고리 | 효과음 | 설명 | 추천 소스 |
|---------|--------|------|----------|
| **게임 흐름** | | | |
| | 카운트다운 비프 | "삐" 짧은 전자음, 3/2/1 각 1회 | 직접 생성 (Web Audio API) |
| | 시작 호루라기 | "삐이이!" 날카로운 호각 소리 | freesound.org |
| | 라운드 종료 | 긴 호루라기 또는 사이렌 | freesound.org |
| **조작** | | | |
| | 탭/클릭 | "톡" 짧고 묵직한 타격음 | 직접 생성 (Web Audio API) |
| | 연속 탭 보너스 | "띵" 맑은 종소리 (연속 10, 20, 30회) | freesound.org |
| | 파워 풀 차지 | "우우웅" 저음 진동 → 고음 폭발 | 합성 |
| **상황** | | | |
| | 줄 당겨짐 | "끼이익" 밧줄 마찰음 | freesound.org: "rope tension" |
| | 유리한 상황 | 점점 빨라지는 드럼 비트 | 합성 루프 |
| | 위기 상황 | 심장 박동 "두근두근" + 경고음 | freesound.org: "heartbeat" |
| | 밀리는 순간 | "끼이이익" 날카로운 슬라이드 | freesound.org: "metal scrape" |
| **결과** | | | |
| | 승리 | 팡파르 + 환호 | freesound.org: "victory fanfare" |
| | 패배 | 둔탁한 추락음 + 정적 | freesound.org: "fall impact" |
| | 탈락 사이렌 | 오징어게임 특유의 단조로운 알림 | 합성 |
| **BGM** | | | |
| | 대기 화면 | 불안한 현악기 드론, 느린 템포 | Pixabay, freesound |
| | 게임 중 | 점점 빨라지는 퍼커션, 긴장 고조 | Pixabay |
| | 결과 (승리) | 장엄한 오케스트라 짧은 스팅 | Pixabay |
| | 결과 (패배) | 피아노 단음 + 정적 | 합성 |

### Web Audio API 기반 직접 생성 효과음

개발 시 별도 파일 없이 코드로 생성할 수 있는 효과음들:

```js
// 탭 효과음 — 짧고 묵직한 클릭
function playTapSound(audioContext) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'square';
  osc.frequency.setValueAtTime(150, audioContext.currentTime);
  osc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.05);
  gain.gain.setValueAtTime(0.3, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.08);
}

// 카운트다운 비프
function playBeep(audioContext, isLast) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'sine';
  osc.frequency.value = isLast ? 880 : 440;  // 마지막(시작!)은 한 옥타브 위
  gain.gain.setValueAtTime(0.4, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.3);
}

// 위기 심장 박동
function playHeartbeat(audioContext) {
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  osc.type = 'sine';
  osc.frequency.value = 60;
  gain.gain.setValueAtTime(0.5, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start();
  osc.stop(audioContext.currentTime + 0.15);
}
```

### 무료 사운드 리소스

| 사이트 | URL | 라이선스 | 특징 |
|--------|-----|---------|------|
| Freesound | freesound.org | CC0 / CC-BY | 가장 큰 무료 효과음 DB |
| Pixabay | pixabay.com/music | 무료 상업적 사용 | BGM에 적합 |
| Mixkit | mixkit.co/free-sound-effects | 무료 | 정리 잘 된 카테고리 |
| Zapsplat | zapsplat.com | 무료 (가입 필요) | 고품질 효과음 |

### 사운드 구현 원칙

1. **기본 음소거**: 첫 화면에서 사운드 OFF 상태, 사용자가 켜도록 유도
2. **Web Audio API 우선**: 외부 파일 최소화, 간단한 효과음은 코드로 생성
3. **모바일 정책 대응**: 첫 사용자 인터랙션(탭) 후 `AudioContext` 생성/resume
4. **볼륨 조절**: 효과음과 BGM 별도 볼륨 슬라이더
5. **성능**: 효과음은 미리 버퍼에 로드, 게임 중 지연 없도록 처리

---

## 부록: 전체 화면 흐름

```
[메인 화면]
    │
    ├── [게임 방법] (모달)
    │
    ├── [랭킹] (모달 또는 별도 화면)
    │
    └── [게임 시작]
         │
         ├── [카운트다운 3-2-1]
         │
         ├── [게임 플레이] ──┬── 탭/클릭 입력
         │                   ├── 줄 위치 실시간 변화
         │                   ├── 파워 게이지
         │                   └── 타이머
         │
         ├── [라운드 종료]
         │     │
         │     ├── 승리 → [승리 연출] → [다음 라운드 / 최종 결과]
         │     │
         │     └── 패배 → [패배 연출] → [결과 화면]
         │
         └── [최종 결과]
               │
               ├── [다시 도전]
               └── [메인으로]
```

---

> 이 디자인 가이드는 개발자가 별도의 디자인 파일(Figma 등) 없이도
> React + Tailwind CSS v4 환경에서 바로 구현할 수 있도록 작성되었습니다.
> 모든 색상은 hex 코드로, 애니메이션은 CSS keyframes로, 레이아웃은 ASCII 와이어프레임으로 제공됩니다.
