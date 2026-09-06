import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut, Radar } from 'react-chartjs-2';
import { TrendingUp, Activity, Calendar, Award, Clock, Heart } from 'lucide-react';
import apiRequest from '../lib/api';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  Filler
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalSessions: 0,
    totalMinutes: 0,
    streak: 0,
    improvement: 0
  });
  const [logs, setLogs] = useState([]);
  const [sessions, setSessions] = useState([]);

  // Get data from localStorage
  useEffect(() => {
    Promise.all([apiRequest('/symptoms'), apiRequest('/exercise-sessions')])
      .then(([nextLogs, nextSessions]) => {
        setLogs(nextLogs);
        setSessions(nextSessions);
        setStats({
          totalSessions: nextSessions.length,
          totalMinutes: nextSessions.reduce((acc, s) => acc + (s.duration || 0), 0),
          streak: calculateStreak(nextSessions),
          improvement: calculateImprovement(nextLogs)
        });
      })
      .catch((error) => console.error('Could not load dashboard data:', error.message));
  }, []);

  const calculateStreak = (sessions) => {
    if (!sessions.length) return 0;
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < sessions.length; i++) {
      const sessionDate = new Date(sessions[i].date);
      const diffDays = Math.floor((today - sessionDate) / (1000 * 60 * 60 * 24));
      if (diffDays === streak) {
        streak++;
      } else {
        break;
      }
    }
    return streak;
  };

  const calculateImprovement = (logs) => {
    if (logs.length < 2) return 0;
    const recent = logs.slice(-7);
    const avgSeverity = recent.reduce((acc, l) => 
      acc + (l.breathlessness + l.coughing + l.wheezing + l.chestTightness) / 4, 0) / recent.length;
    return Math.max(0, Math.round((5 - avgSeverity) * 20));
  };

  // Data for charts
  const recentLogs = [...logs].slice(0, 7).reverse();
  const symptomData = {
    labels: recentLogs.map((log) => new Date(log.date).toLocaleDateString('en-US', { weekday: 'short' })),
    datasets: [
      {
        label: 'Breathlessness',
        data: recentLogs.map((log) => log.breathlessness),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Coughing',
        data: recentLogs.map((log) => log.coughing),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.2)',
        tension: 0.4,
        fill: true,
      },
      {
        label: 'Wheezing',
        data: recentLogs.map((log) => log.wheezing),
        borderColor: 'rgb(234, 179, 8)',
        backgroundColor: 'rgba(234, 179, 8, 0.2)',
        tension: 0.4,
        fill: true,
      }
    ]
  };

  const exerciseCounts = sessions.reduce((counts, session) => {
    counts[session.name] = (counts[session.name] || 0) + 1;
    return counts;
  }, {});
  const exerciseData = {
    labels: Object.keys(exerciseCounts).length ? Object.keys(exerciseCounts) : ['No sessions yet'],
    datasets: [{
      label: 'Sessions Completed',
      data: Object.keys(exerciseCounts).length ? Object.values(exerciseCounts) : [0],
      backgroundColor: [
        'rgba(34, 197, 94, 0.8)',
        'rgba(59, 130, 246, 0.8)',
        'rgba(234, 179, 8, 0.8)',
        'rgba(168, 85, 247, 0.8)',
        'rgba(236, 72, 153, 0.8)'
      ],
      borderWidth: 0
    }]
  };

  const radarData = {
    labels: ['Lung Capacity', 'Breath Control', 'Relaxation', 'Endurance', 'Focus'],
    datasets: [{
      label: 'Current Level',
      data: [85, 70, 90, 65, 80],
      backgroundColor: 'rgba(34, 197, 94, 0.2)',
      borderColor: 'rgb(34, 197, 94)',
      borderWidth: 2,
      pointBackgroundColor: 'rgb(34, 197, 94)',
    }]
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-8 h-8 text-primary-600" />
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Your Progress Dashboard
        </h2>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card p-4 text-center">
          <Activity className="w-6 h-6 text-primary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalSessions}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Total Sessions</div>
        </div>
        <div className="card p-4 text-center">
          <Clock className="w-6 h-6 text-secondary-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.totalMinutes}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Minutes Exercised</div>
        </div>
        <div className="card p-4 text-center">
          <Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.streak}
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Day Streak</div>
        </div>
        <div className="card p-4 text-center">
          <Heart className="w-6 h-6 text-red-500 mx-auto mb-2" />
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {stats.improvement}%
          </div>
          <div className="text-sm text-gray-500 dark:text-gray-400">Improvement</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Symptom Trends */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            📈 Symptom Trends
          </h3>
          <Line 
            data={symptomData}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  labels: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' }
                }
              },
              scales: {
                y: { 
                  min: 0,
                  max: 5,
                  ticks: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' }
                },
                x: { ticks: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' } }
              }
            }}
          />
        </div>

        {/* Exercise Distribution */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🏋️ Exercise Distribution
          </h3>
          <Bar 
            data={exerciseData}
            options={{
              responsive: true,
              plugins: {
                legend: { display: false }
              },
              scales: {
                y: { 
                  beginAtZero: true,
                  ticks: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' }
                },
                x: { ticks: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' } }
              }
            }}
          />
        </div>

        {/* Radar Chart */}
        <div className="card p-6 md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            🎯 Skill Assessment
          </h3>
          <div className="max-w-md mx-auto">
            <Radar 
              data={radarData}
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    labels: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' }
                  }
                },
                scales: {
                  r: {
                    min: 0,
                    max: 100,
                    ticks: { color: document.documentElement.classList.contains('dark') ? '#fff' : '#000' }
                  }
                }
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
