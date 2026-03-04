import { memo, useState, useEffect } from 'react';
import { playBeep } from '../../utils/audio';

const SEQUENCE = [
  { text: '줄을 잡으세요', duration: 1500, isNumber: false },
  { text: '3', duration: 1000, isNumber: true },
  { text: '2', duration: 1000, isNumber: true },
  { text: '1', duration: 1000, isNumber: true },
  { text: '시작!', duration: 600, isNumber: false },
];

const CountdownScreen = memo(function CountdownScreen({ onComplete }) {
  const [step, setStep] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    if (step >= SEQUENCE.length) {
      onComplete();
      return;
    }

    const { duration, isNumber, text } = SEQUENCE[step];

    // 카운트다운 숫자/시작! 일 때 비프 재생
    if (isNumber) {
      playBeep(false);
    } else if (text === '시작!') {
      playBeep(true);
    }

    const timer = setTimeout(() => {
      setStep(s => s + 1);
      setAnimKey(k => k + 1);
    }, duration);

    return () => clearTimeout(timer);
  }, [step, onComplete]);

  if (step >= SEQUENCE.length) return null;

  const current = SEQUENCE[step];

  return (
    <div className="flex flex-col items-center justify-center h-full">
      {/* 배경 어둡게 */}
      <div className="absolute inset-0 bg-bg-deep/80" />

      <div key={animKey} className="relative z-10">
        {current.isNumber ? (
          <span
            className="font-mono text-8xl md:text-9xl font-black text-accent-pink animate-countdown"
            style={{ textShadow: '0 0 40px rgba(255,0,110,0.6)' }}
          >
            {current.text}
          </span>
        ) : current.text === '시작!' ? (
          <span
            className="font-title text-6xl md:text-7xl text-accent-gold animate-start-flash"
            style={{ textShadow: '0 0 30px rgba(255,215,0,0.5)' }}
          >
            {current.text}
          </span>
        ) : (
          <span className="font-body text-2xl md:text-3xl text-text-secondary animate-fade-in-up">
            {current.text}
          </span>
        )}
      </div>
    </div>
  );
});

export default CountdownScreen;
