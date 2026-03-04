import { useEffect, useRef } from 'react';

/**
 * requestAnimationFrame 기반 게임 루프
 * @param {boolean} active - 루프 활성화 여부
 * @param {Function} callback - 매 프레임 호출되는 콜백 (deltaTime: 초)
 */
export function useGameLoop(active, callback) {
  const frameRef = useRef(null);
  const prevTimeRef = useRef(null);
  const callbackRef = useRef(callback);

  // 콜백 참조 최신화 (리렌더 시 새 클로저 반영)
  callbackRef.current = callback;

  useEffect(() => {
    if (!active) {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      prevTimeRef.current = null;
      return;
    }

    const loop = (timestamp) => {
      if (prevTimeRef.current === null) {
        prevTimeRef.current = timestamp;
      }

      // deltaTime: 초 단위, 최대 0.05초(20fps)로 클램프
      const deltaTime = Math.min((timestamp - prevTimeRef.current) / 1000, 0.05);
      prevTimeRef.current = timestamp;

      callbackRef.current(deltaTime);

      frameRef.current = requestAnimationFrame(loop);
    };

    frameRef.current = requestAnimationFrame(loop);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [active]);
}
