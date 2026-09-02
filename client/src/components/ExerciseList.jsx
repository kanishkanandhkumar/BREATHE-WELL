import React, { useState } from 'react';
import ExerciseCard from './ExerciseCard';
import BreathingTimer from './BreathingTimer';

const exercises = [
  {
    id: 1,
    name: 'Diaphragmatic Breathing',
    description: 'Deep belly breathing to strengthen lungs and improve oxygen flow',
    difficulty: 'Beginner',
    duration: '5 min',
    emoji: '🫁',
    color: '#48bb78'
  },
  {
    id: 2,
    name: 'Pursed-Lip Breathing',
    description: 'Slow breathing technique to keep airways open longer',
    difficulty: 'Beginner',
    duration: '5 min',
    emoji: '💨',
    color: '#4299e1'
  },
  {
    id: 3,
    name: 'Box Breathing',
    description: '4-4-4-4 breathing pattern for relaxation and stress reduction',
    difficulty: 'Intermediate',
    duration: '8 min',
    emoji: '📦',
    color: '#ed8936'
  },
  {
    id: 4,
    name: '4-7-8 Breathing',
    description: 'Deep relaxation technique to reduce anxiety and improve sleep',
    difficulty: 'Advanced',
    duration: '10 min',
    emoji: '😌',
    color: '#9f7aea'
  },
  {
    id: 5,
    name: 'Pranayama (Alternate Nostril)',
    description: 'Traditional yogic breathing to balance energy and calm the mind',
    difficulty: 'Intermediate',
    duration: '8 min',
    emoji: '🧘',
    color: '#f6ad55'
  },
  {
    id: 6,
    name: 'Belly Breathing with Resistance',
    description: 'Advanced breathing with resistance to strengthen respiratory muscles',
    difficulty: 'Advanced',
    duration: '10 min',
    emoji: '💪',
    color: '#fc8181'
  }
];

const ExerciseList = () => {
  const [selectedExercise, setSelectedExercise] = useState(null);

  const handleStart = (exercise) => {
    setSelectedExercise(exercise);
  };

  const handleCloseTimer = () => {
    setSelectedExercise(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exercises.map(exercise => (
          <ExerciseCard
            key={exercise.id}
            exercise={exercise}
            onStart={handleStart}
          />
        ))}
      </div>

      {/* Timer Modal */}
      {selectedExercise && (
        <BreathingTimer
          exercise={selectedExercise}
          onClose={handleCloseTimer}
        />
      )}
    </>
  );
};

export default ExerciseList;
