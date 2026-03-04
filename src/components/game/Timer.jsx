import { memo } from 'react';

const Timer = memo(function Timer({ timeLeft }) {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = Math.floor(timeLeft % 60);
  const isUrgent = timeLeft <= 15;

  return (
    <span className={`font-mono text-2xl md:text-4xl font-bold tabular-nums
                      ${isUrgent ? 'text-danger animate-heartbeat' : 'text-text-primary'}`}>
      {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
    </span>
  );
});

export default Timer;
