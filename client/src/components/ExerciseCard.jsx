import React from 'react';
import { Clock, Info, Play } from 'lucide-react';

const ExerciseCard = ({ exercise, onStart }) => {
  const getDifficultyColor = (level) => {
    const colors = {
      'Beginner': 'badge-beginner',
      'Intermediate': 'badge-intermediate',
      'Advanced': 'badge-advanced',
    };
    return colors[level] || 'badge-beginner';
  };

  return (
    <div className="card group overflow-hidden p-0 hover:-translate-y-1">
      <div className="h-2" style={{ backgroundColor: exercise.color }} />
      <div className="p-6">
        <div className="mb-4 flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl" style={{ backgroundColor: `${exercise.color}22` }}>
              <exercise.icon className="h-6 w-6" style={{ color: exercise.color }} />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {exercise.name}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {exercise.description}
              </p>
            </div>
          </div>
          <span className={`badge shrink-0 ${getDifficultyColor(exercise.difficulty)}`}>
            {exercise.difficulty}
          </span>
        </div>
        <div className="rounded-2xl bg-gray-50 p-4 dark:bg-gray-700/40">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary-600 dark:text-primary-400">
            <Info className="h-4 w-4" /> Why practice this?
          </div>
          <p className="mt-2 text-sm leading-relaxed text-gray-600 dark:text-gray-300">{exercise.why}</p>
          <p className="mt-2 text-xs font-medium text-gray-500 dark:text-gray-400">
            Best for: <span className="text-gray-700 dark:text-gray-200">{exercise.bestFor}</span>
          </p>
          <p className="mt-3 border-t border-gray-200 pt-3 text-xs italic text-gray-500 dark:border-gray-600 dark:text-gray-400">
            “{exercise.cue}”
          </p>
        </div>
        <div className="mt-5 flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-700">
          <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="h-4 w-4" />
            <span>{exercise.duration}</span>
          </div>
          <button
          onClick={(e) => {
            e.stopPropagation();
            onStart(exercise);
          }}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary-500 to-secondary-500 px-4 py-2 font-semibold text-white shadow-sm transition-all hover:scale-105 hover:shadow-lg"
        >
          <Play className="w-4 h-4" />
          <span>Start</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExerciseCard;
