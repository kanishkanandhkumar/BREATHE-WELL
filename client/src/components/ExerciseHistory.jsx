import React, { useState, useEffect } from 'react';
import { History, Calendar, Clock, CheckCircle, XCircle } from 'lucide-react';

const ExerciseHistory = () => {
  const [sessions, setSessions] = useState([]);

  useEffect(() => {
    // Load from localStorage
    const saved = JSON.parse(localStorage.getItem('exerciseSessions') || '[]');
    setSessions(saved.reverse());
  }, []);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusIcon = (completed) => {
    return completed ? 
      <CheckCircle className="w-5 h-5 text-green-500" /> : 
      <XCircle className="w-5 h-5 text-red-500" />;
  };

  return (
    <div className="card p-6">
      <div className="flex items-center gap-3 mb-6">
        <History className="w-8 h-8 text-primary-600" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          Exercise History
        </h3>
        <span className="ml-auto badge badge-beginner">
          {sessions.length} sessions
        </span>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No exercise sessions yet</p>
          <p className="text-sm">Start your first breathing exercise!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sessions.map((session, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-2xl">{session.emoji || '🫁'}</span>
                <div>
                  <p className="font-medium text-gray-900 dark:text-white">
                    {session.name}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(session.date)}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {session.duration} min
                </span>
                {getStatusIcon(session.completed)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ExerciseHistory;
