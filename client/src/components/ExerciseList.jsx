import React, { useState } from 'react';
import ExerciseCard from './ExerciseCard';
import BreathingTimer from './BreathingTimer';
import { HeartPulse, ShieldCheck, Sparkles } from 'lucide-react';

const exercises = [
  {
    id: 1,
    name: 'Diaphragmatic Breathing',
    description: 'Use your diaphragm for calm, steady breaths.',
    why: 'Builds awareness of belly breathing and encourages a slower, more efficient rhythm.',
    bestFor: 'Resetting your breathing',
    cue: 'Let your belly rise gently as you inhale.',
    difficulty: 'Beginner',
    duration: '5 min',
    emoji: '🫁',
    color: '#48bb78'
  },
  {
    id: 2,
    name: 'Pursed-Lip Breathing',
    description: 'Inhale softly, then breathe out through relaxed, narrow lips.',
    why: 'Makes the exhale longer and more controlled when your breathing feels rushed.',
    bestFor: 'A calm, controlled exhale',
    cue: 'Breathe out as if cooling a warm drink.',
    difficulty: 'Beginner',
    duration: '5 min',
    emoji: '💨',
    color: '#4299e1'
  },
  {
    id: 3,
    name: 'Box Breathing',
    description: 'A balanced four-part rhythm: inhale, hold, exhale, hold.',
    why: 'Gives your attention a simple rhythm to follow during stressful moments.',
    bestFor: 'Focus and composure',
    cue: 'Keep every side of the “box” the same length.',
    difficulty: 'Intermediate',
    duration: '8 min',
    emoji: '📦',
    color: '#ed8936'
  },
  {
    id: 4,
    name: '4-7-8 Breathing',
    description: 'A longer exhale pattern designed for a quiet evening wind-down.',
    why: 'The extended exhale encourages a slower pace before rest or bedtime.',
    bestFor: 'Evening relaxation',
    cue: 'Keep the breath comfortable; never force the holds.',
    difficulty: 'Advanced',
    duration: '10 min',
    emoji: '😌',
    color: '#9f7aea'
  },
  {
    id: 5,
    name: 'Pranayama (Alternate Nostril)',
    description: 'A gentle alternating rhythm inspired by traditional pranayama.',
    why: 'Adds mindful coordination and helps make breathing practice feel intentional.',
    bestFor: 'Mindful concentration',
    cue: 'Move slowly and keep your shoulders relaxed.',
    difficulty: 'Intermediate',
    duration: '8 min',
    emoji: '🧘',
    color: '#f6ad55'
  },
  {
    id: 6,
    name: 'Belly Breathing with Resistance',
    description: 'A slow, steady rhythm with gentle resistance from pursed lips.',
    why: 'Challenges breath control while keeping the pace deliberate and measured.',
    bestFor: 'Building breath control',
    cue: 'Stop if you feel strain, dizziness, or discomfort.',
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
      <section className="container-custom py-10">
        <div className="max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary-100 px-4 py-2 text-sm font-semibold text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">
            <Sparkles className="h-4 w-4" />
            Practice at your pace
          </div>
          <h2 className="mt-4 text-3xl font-bold text-gray-900 dark:text-white md:text-4xl">
            Breathing exercises for everyday moments
          </h2>
          <p className="mt-3 text-gray-600 dark:text-gray-300">
            Choose a practice based on how you feel today. Each session explains its purpose
            and gives you a gentle visual rhythm to follow.
          </p>
        </div>
        <div className="mt-6 grid gap-3 text-sm text-gray-600 dark:text-gray-300 sm:grid-cols-3">
          <div className="flex items-center gap-2"><HeartPulse className="h-5 w-5 text-primary-600" /> Guided pacing</div>
          <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary-600" /> Comfortable progress</div>
          <div className="flex items-center gap-2"><Sparkles className="h-5 w-5 text-primary-600" /> Personal session history</div>
        </div>
      </section>
      <div className="container-custom grid grid-cols-1 gap-6 pb-12 md:grid-cols-2 lg:grid-cols-3">
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
