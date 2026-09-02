import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, X, Volume2, VolumeX } from 'lucide-react';

const BreathingTimer = ({ exercise, onClose }) => {
  const [phase, setPhase] = useState('inhale'); // inhale, hold, exhale, hold
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
      1: { inhale: 4, hold: 2, exhale: 4, hold: 2 }, // Diaphragmatic
      2: { inhale: 2, hold: 1, exhale: 4, hold: 1 }, // Pursed-Lip
      3: { inhale: 4, hold: 4, exhale: 4, hold: 4 }, // Box Breathing
      4: { inhale: 4, hold: 7, exhale: 8, hold: 2 }, // 4-7-8
      5: { inhale: 4, hold: 2, exhale: 4, hold: 2 }, // Pranayama
      6: { inhale: 6, hold: 3, exhale: 6, hold: 3 }, // Belly Breathing
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
            if (nextPhase === 'inhale' && phase === 'hold') {
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
    const phases = ['inhale', 'hold', 'exhale', 'hold'];
    const currentIndex = phases.indexOf(currentPhase);
    return phases[(currentIndex + 1) % phases.length];
  };

  const getPhaseDuration = (phaseName) => {
    switch(phaseName) {
      case 'inhale': return pattern.inhale;
      case 'exhale': return pattern.exhale;
      case 'hold': return pattern.hold;
      default: return 4;
    }
  };

  const getPhaseLabel = () => {
    const labels = {
      'inhale': '🌬️ Breathe In',
      'exhale': '😮‍💨 Breathe Out',
      'hold': '⏸️ Hold'
    };
    return labels[phase] || 'Breathe';
  };

  const getPhaseColor = () => {
    const colors = {
      'inhale': 'from-blue-400 to-blue-600',
      'exhale': 'from-green-400 to-green-600',
      'hold': 'from-yellow-400 to-yellow-600'
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Progress calculation
  const progress = () => {
    const total = pattern.inhale + pattern.hold + pattern.exhale + pattern.hold;
    const current = getPhaseDuration(phase);
    return ((total - timeLeft) / total) * 100;
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
      <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-md w-full shadow-2xl transform transition-all">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
              {exercise.emoji} {exercise.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {cycleCount} cycles completed
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
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
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            Pattern: Inhale {pattern.inhale}s → Hold {pattern.hold}s → Exhale {pattern.exhale}s → Hold {pattern.hold}s
          </p>
        </div>
      </div>
    </div>
  );
};

export default BreathingTimer;
