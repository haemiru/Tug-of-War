import { memo } from 'react';
import { DIFFICULTY } from '../../constants/difficulty';

const DifficultyScreen = memo(function DifficultyScreen({ onSelect, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center h-full px-4">
      <h2 className="font-title text-3xl md:text-4xl text-text-primary mb-8">
        난이도를 선택하세요
      </h2>

      <div className="flex flex-col gap-4 w-full max-w-sm">
        {Object.entries(DIFFICULTY).map(([key, config], i) => (
          <button
            key={key}
            onClick={() => onSelect(key)}
            className="w-full p-5 bg-bg-panel hover:bg-bg-active border border-white/10
                       hover:border-accent-pink/50 rounded-xl transition-all text-left
                       animate-fade-in-up"
            style={{ animationDelay: `${i * 0.1}s` }}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-accent-gold text-lg">
                {'⭐'.repeat(config.stars)}
              </span>
              <span className="font-bold text-xl text-text-primary">{config.label}</span>
            </div>
            <p className="text-text-muted text-sm">{config.description}</p>
          </button>
        ))}
      </div>

      <button
        onClick={onBack}
        className="mt-6 text-text-muted hover:text-text-secondary transition-colors"
      >
        ← 뒤로가기
      </button>
    </div>
  );
});

export default DifficultyScreen;
