import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX, Lightbulb, ShieldAlert } from 'lucide-react';
import apiRequest from '../lib/api';

const BreathingTimer = ({ exercise, onClose }) => {
  const [phase, setPhase] = useState('inhale');
  const [timeLeft, setTimeLeft] = useState(4);
  const [isRunning, setIsRunning] = useState(false);
  const [cycleCount, setCycleCount] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [isSoundOn, setIsSoundOn] = useState(true);
  
  const timerRef = useRef(null);
  const audioContextRef = useRef(null);

  // Breathing pattern based on exercise
  const getBreathPattern = (exerciseId) => {
    const patterns = {
      1: { inhale: 4, holdIn: 2, exhale: 4, holdOut: 2 }, // Diaphragmatic
      2: { inhale: 2, holdIn: 1, exhale: 4, holdOut: 1 }, // Pursed-Lip
      3: { inhale: 4, holdIn: 4, exhale: 4, holdOut: 4 }, // Box Breathing
      4: { inhale: 4, holdIn: 7, exhale: 8, holdOut: 2 }, // 4-7-8
      5: { inhale: 4, holdIn: 2, exhale: 4, holdOut: 2 }, // Pranayama
      6: { inhale: 6, holdIn: 3, exhale: 6, holdOut: 3 }, // Belly Breathing
    };
    return patterns[exerciseId] || patterns[1];
  };

  const pattern = getBreathPattern(exercise.id);
  
  // Set initial time based on first phase
  useEffect(() => {
    setTimeLeft(pattern.inhale);
  }, []);

  // Sound effects
  const playSound = (type) => {
    if (!isSoundOn) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      
      const ctx = audioContextRef.current;
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      if (type === 'inhale') {
        oscillator.frequency.value = 440;
        gainNode.gain.value = 0.3;
        oscillator.type = 'sine';
      } else if (type === 'exhale') {
        oscillator.frequency.value = 330;
        gainNode.gain.value = 0.2;
        oscillator.type = 'sine';
      } else if (type === 'hold') {
        oscillator.frequency.value = 220;
        gainNode.gain.value = 0.1;
        oscillator.type = 'sine';
      } else if (type === 'complete') {
        oscillator.frequency.value = 880;
        gainNode.gain.value = 0.4;
        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(880, ctx.currentTime);
        oscillator.frequency.setValueAtTime(1100, ctx.currentTime + 0.1);
      }
      
      oscillator.start(ctx.currentTime);
      oscillator.stop(ctx.currentTime + 0.2);
    } catch (e) {
      // Audio not available
    }
  };

  // Timer logic
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev > 1) {
            return prev - 1;
          } else {
            // Phase complete - move to next phase
            playSound(phase === 'inhale' ? 'exhale' : 'inhale');
            
            const nextPhase = getNextPhase(phase);
            setPhase(nextPhase);
            const newTime = getPhaseDuration(nextPhase);
            
            // Check if cycle complete
            if (nextPhase === 'inhale' && phase === 'holdOut') {
              setCycleCount((prevCount) => {
                const newCount = prevCount + 1;
                if (newCount % 5 === 0) {
                  playSound('complete');
                }
                return newCount;
              });
            }
            
            setTotalTime((prev) => prev + 1);
            return newTime;
          }
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => clearInterval(timerRef.current);
  }, [isRunning, phase]);

  const getNextPhase = (currentPhase) => {
    const phases = ['inhale', 'holdIn', 'exhale', 'holdOut'];
    const currentIndex = phases.indexOf(currentPhase);
    return phases[(currentIndex + 1) % phases.length];
  };

  const getPhaseDuration = (phaseName) => {
    switch(phaseName) {
      case 'inhale': return pattern.inhale;
      case 'exhale': return pattern.exhale;
      case 'holdIn': return pattern.holdIn;
      case 'holdOut': return pattern.holdOut;
      default: return 4;
    }
  };

  const getPhaseLabel = () => {
    const labels = {
      'inhale': '🌬️ Breathe In',
      'exhale': '😮‍💨 Breathe Out',
      'holdIn': '⏸️ Hold',
      'holdOut': '⏸️ Hold'
    };
    return labels[phase] || 'Breathe';
  };

  const getPhaseColor = () => {
    const colors = {
      'inhale': 'from-blue-400 to-blue-600',
      'exhale': 'from-green-400 to-green-600',
      'holdIn': 'from-yellow-400 to-yellow-600',
      'holdOut': 'from-yellow-400 to-yellow-600'
    };
    return colors[phase] || 'from-gray-400 to-gray-600';
  };

  const toggleTimer = () => {
    if (!isRunning) {
      // Resume audio context if suspended
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        audioContextRef.current.resume();
      }
      playSound('inhale');
    }
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setPhase('inhale');
    setTimeLeft(pattern.inhale);
    setCycleCount(0);
    setTotalTime(0);
    clearInterval(timerRef.current);
  };

  const closeTimer = () => {
    if (totalTime > 0) {
      const session = {
        name: exercise.name,
        emoji: exercise.emoji,
        duration: Math.max(1, Math.ceil(totalTime / 60)),
        completed: cycleCount > 0,
        date: new Date().toISOString()
      };
      apiRequest('/exercise-sessions', { method: 'POST', body: JSON.stringify(session) })
        .catch((error) => console.error('Could not save exercise session:', error.message));
    }
    onClose();
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Progress calculation
  const progress = () => {
    const total = pattern.inhale + pattern.holdIn + pattern.exhale + pattern.holdOut;
    const current = getPhaseDuration(phase);
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="min-w-0">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {exercise.emoji} {exercise.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {cycleCount} {cycleCount === 1 ? 'cycle' : 'cycles'} completed · {exercise.bestFor}
            </p>
          </div>
          <button
            onClick={closeTimer}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-4 rounded-2xl bg-primary-50 p-4 dark:bg-primary-900/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-primary-600 dark:text-primary-400" />
            <div>
              <p className="text-sm font-semibold text-primary-800 dark:text-primary-200">Why this exercise?</p>
              <p className="mt-1 text-sm leading-relaxed text-primary-700 dark:text-primary-300">{exercise.why}</p>
            </div>
          </div>
        </div>

        {/* Main Breathing Circle */}
        <div className="flex flex-col items-center justify-center py-8">
          <div className="relative">
            {/* Progress Ring */}
            <svg className="w-56 h-56 transform -rotate-90">
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="currentColor"
                strokeWidth="8"
                fill="none"
                className="text-gray-200 dark:text-gray-700"
              />
              <circle
                cx="112"
                cy="112"
                r="100"
                stroke="url(#breathGradient)"
                strokeWidth="8"
                fill="none"
                className="transition-all duration-1000"
                strokeDasharray={`${2 * Math.PI * 100}`}
                strokeDashoffset={`${2 * Math.PI * 100 * (1 - progress() / 100)}`}
                strokeLinecap="round"
              />
              <defs>
                <linearGradient id="breathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" className="stop-color-blue-500" />
                  <stop offset="100%" className="stop-color-green-500" />
                </linearGradient>
              </defs>
            </svg>

            {/* Center Content */}
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <div className={`text-7xl mb-2 transition-all duration-1000 transform ${
                phase === 'inhale' ? 'scale-125' : 
                phase === 'exhale' ? 'scale-75' : 'scale-100'
              }`}>
                {phase === 'inhale' ? '🫁' : 
                 phase === 'exhale' ? '💨' : '⏸️'}
              </div>
              <div className="text-5xl font-bold text-gray-900 dark:text-white mb-1">
                {timeLeft}
              </div>
              <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {getPhaseLabel()}
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 w-full mt-6">
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Cycles</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{cycleCount}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Time</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white">{formatTime(totalTime)}</div>
            </div>
            <div className="text-center">
              <div className="text-sm text-gray-500 dark:text-gray-400">Phase</div>
              <div className="text-xl font-bold text-gray-900 dark:text-white capitalize">{phase}</div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mt-6">
          <button
            onClick={resetTimer}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <RotateCcw className="w-6 h-6" />
          </button>
          
          <button
            onClick={toggleTimer}
            className={`p-5 rounded-full transition-all transform hover:scale-105 ${
              isRunning 
                ? 'bg-yellow-500 hover:bg-yellow-600' 
                : 'bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600'
            } text-white shadow-lg`}
          >
            {isRunning ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8 ml-1" />}
          </button>

          <button
            onClick={() => setIsSoundOn(!isSoundOn)}
            className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            {isSoundOn ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {isRunning ? 'Focus on your breath' : 'Press play to start'}
          </p>
          <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
            Pattern: Inhale {pattern.inhale}s → Hold {pattern.holdIn}s → Exhale {pattern.exhale}s → Hold {pattern.holdOut}s
          </p>
          <p className="mt-2 text-xs italic text-gray-400 dark:text-gray-500">“{exercise.cue}”</p>
          <div className="mt-3 flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500">
            <ShieldAlert className="h-3.5 w-3.5" />
            Stop if you feel dizzy or uncomfortable.
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreathingTimer;
