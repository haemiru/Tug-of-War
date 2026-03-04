import { useEffect, useRef, useCallback } from 'react';

/**
 * PC 키보드 + 모바일 터치 입력 통합 처리
 * @param {boolean} active - 입력 활성화 여부
 * @returns {{ tapTimestamps, isHolding, triggerThreeStep }}
 */
export function useInput(active) {
  const tapTimestampsRef = useRef([]); // 연타 타임스탬프 기록
  const isHoldingRef = useRef(false); // 버티기 중 여부
  const threeStepTriggeredRef = useRef(false); // 3걸음 트리거 플래그
  const onTapCallbackRef = useRef(null); // 탭 콜백

  // 외부에서 탭 콜백 등록
  const setOnTap = useCallback((cb) => {
    onTapCallbackRef.current = cb;
  }, []);

  useEffect(() => {
    if (!active) {
      isHoldingRef.current = false;
      return;
    }

    const handleTap = () => {
      const now = performance.now();
      tapTimestampsRef.current.push(now);
      // 최근 2초만 유지
      tapTimestampsRef.current = tapTimestampsRef.current.filter(t => now - t < 2000);
      if (onTapCallbackRef.current) onTapCallbackRef.current();
    };

    // 키보드 핸들러
    const onKeyDown = (e) => {
      if (e.repeat) return;
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        e.preventDefault();
        handleTap();
      } else if (e.code === 'Space') {
        e.preventDefault();
        isHoldingRef.current = true;
      } else if (e.code === 'KeyS' || e.code === 'ArrowDown') {
        e.preventDefault();
        threeStepTriggeredRef.current = true;
      }
    };

    const onKeyUp = (e) => {
      if (e.code === 'Space') {
        isHoldingRef.current = false;
      }
    };

    // 터치 핸들러 — 게임영역 내 터치
    const onTouchStart = (e) => {
      const target = e.target;
      // 3걸음 버튼은 별도 처리
      if (target.closest('[data-three-step]')) {
        threeStepTriggeredRef.current = true;
        return;
      }
      // 버티기 영역
      if (target.closest('[data-hold-area]')) {
        isHoldingRef.current = true;
        return;
      }
      // 기본: 탭 (당기기)
      if (target.closest('[data-tap-area]')) {
        handleTap();
      }
    };

    const onTouchEnd = (e) => {
      const target = e.target;
      if (target.closest('[data-hold-area]')) {
        isHoldingRef.current = false;
      }
    };

    // 마우스 클릭 (PC 탭 영역 클릭)
    const onMouseDown = (e) => {
      if (e.target.closest('[data-tap-area]')) {
        handleTap();
      }
      if (e.target.closest('[data-hold-area]')) {
        isHoldingRef.current = true;
      }
    };

    const onMouseUp = (e) => {
      if (e.target.closest('[data-hold-area]')) {
        isHoldingRef.current = false;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    window.addEventListener('keyup', onKeyUp);
    document.addEventListener('touchstart', onTouchStart, { passive: true });
    document.addEventListener('touchend', onTouchEnd);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('keyup', onKeyUp);
      document.removeEventListener('touchstart', onTouchStart);
      document.removeEventListener('touchend', onTouchEnd);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, [active]);

  return {
    tapTimestampsRef,
    isHoldingRef,
    threeStepTriggeredRef,
    setOnTap,
  };
}
