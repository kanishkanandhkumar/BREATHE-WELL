import React from 'react';
import { Clock, ChevronRight, Play } from 'lucide-react';

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
    <div className="card p-6 hover:transform hover:-translate-y-1 cursor-pointer group">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {exercise.name}
          </h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {exercise.description}
          </p>
        </div>
        <span className={`badge ${getDifficultyColor(exercise.difficulty)}`}>
          {exercise.difficulty}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{exercise.duration}</span>
          </div>
          <div className="flex items-center space-x-1 text-sm text-gray-500 dark:text-gray-400">
            <span className="text-lg">{exercise.emoji || '🫁'}</span>
          </div>
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onStart(exercise);
          }}
          className="flex items-center gap-2 bg-gradient-to-r from-primary-500 to-secondary-500 text-white px-4 py-2 rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
        >
          <Play className="w-4 h-4" />
          <span>Start</span>
        </button>
      </div>
    </div>
  );
};

export default ExerciseCard;
