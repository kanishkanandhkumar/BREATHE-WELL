import React, { useState } from 'react';
import { Calendar, Activity, Wind, Droplets, Pill, AlertCircle, Check } from 'lucide-react';

const SymptomTracker = () => {
  const [symptoms, setSymptoms] = useState({
    date: new Date().toISOString().split('T')[0],
    breathlessness: 3,
    coughing: 3,
    wheezing: 3,
    chestTightness: 3,
    peakFlow: '',
    triggers: [],
    medications: [],
    notes: '',
    feeling: 'neutral'
  });

  const [submitted, setSubmitted] = useState(false);

  const triggerOptions = [
    'Pollen', 'Dust', 'Cold Air', 'Exercise', 'Stress', 
    'Smoke', 'Pet Dander', 'Mold', 'Strong Odors', 'Weather Change'
  ];

  const medicationOptions = [
    'Rescue Inhaler', 'Controller Inhaler', 'Oral Steroids', 
    'Antihistamines', 'Nebulizer Treatment', 'None'
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === 'checkbox') {
      if (checked) {
        setSymptoms(prev => ({
          ...prev,
          triggers: [...prev.triggers, value]
        }));
      } else {
        setSymptoms(prev => ({
          ...prev,
          triggers: prev.triggers.filter(t => t !== value)
        }));
      }
    } else if (name === 'medication') {
      if (checked) {
        setSymptoms(prev => ({
          ...prev,
          medications: [...prev.medications, value]
        }));
      } else {
        setSymptoms(prev => ({
          ...prev,
          medications: prev.medications.filter(m => m !== value)
        }));
      }
    } else {
      setSymptoms(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Symptom Log:', symptoms);
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    
    // Store in localStorage for demo
    const logs = JSON.parse(localStorage.getItem('symptomLogs') || '[]');
    logs.push({ ...symptoms, timestamp: new Date().toISOString() });
    localStorage.setItem('symptomLogs', JSON.stringify(logs));
  };

  const getFeelingEmoji = () => {
    const emojis = {
      'great': '😊',
      'good': '🙂',
      'neutral': '😐',
      'bad': '😟',
      'terrible': '😰'
    };
    return emojis[symptoms.feeling] || '😐';
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="card p-8">
        <div className="flex items-center gap-3 mb-6">
          <Activity className="w-8 h-8 text-primary-600" />
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Daily Symptom Tracker
          </h2>
        </div>

        {submitted ? (
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-xl p-6 text-center animate-fadeIn">
            <Check className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-green-600 dark:text-green-400">
              Logged Successfully! 🎉
            </h3>
            <p className="text-green-500 dark:text-green-300">
              Keep up the great work tracking your health!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📅 Date
              </label>
              <input
                type="date"
                name="date"
                value={symptoms.date}
                onChange={handleChange}
                className="input-field"
                max={new Date().toISOString().split('T')[0]}
              />
            </div>

            {/* How are you feeling? */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                😊 How are you feeling today?
              </label>
              <div className="flex gap-2">
                {['great', 'good', 'neutral', 'bad', 'terrible'].map(level => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setSymptoms(prev => ({ ...prev, feeling: level }))}
                    className={`flex-1 p-3 rounded-xl text-2xl transition-all ${
                      symptoms.feeling === level 
                        ? 'bg-primary-100 dark:bg-primary-900/30 ring-2 ring-primary-500 scale-105' 
                        : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }`}
                  >
                    {level === 'great' && '😊'}
                    {level === 'good' && '🙂'}
                    {level === 'neutral' && '😐'}
                    {level === 'bad' && '😟'}
                    {level === 'terrible' && '😰'}
                  </button>
                ))}
              </div>
            </div>

            {/* Symptoms Scale */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Breathlessness
                </label>
                <input
                  type="range"
                  name="breathlessness"
                  min="0"
                  max="5"
                  value={symptoms.breathlessness}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>None</span>
                  <span className="font-bold text-primary-600">{symptoms.breathlessness}/5</span>
                  <span>Severe</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Coughing
                </label>
                <input
                  type="range"
                  name="coughing"
                  min="0"
                  max="5"
                  value={symptoms.coughing}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>None</span>
                  <span className="font-bold text-primary-600">{symptoms.coughing}/5</span>
                  <span>Severe</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Wheezing
                </label>
                <input
                  type="range"
                  name="wheezing"
                  min="0"
                  max="5"
                  value={symptoms.wheezing}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>None</span>
                  <span className="font-bold text-primary-600">{symptoms.wheezing}/5</span>
                  <span>Severe</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Chest Tightness
                </label>
                <input
                  type="range"
                  name="chestTightness"
                  min="0"
                  max="5"
                  value={symptoms.chestTightness}
                  onChange={handleChange}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500">
                  <span>None</span>
                  <span className="font-bold text-primary-600">{symptoms.chestTightness}/5</span>
                  <span>Severe</span>
                </div>
              </div>
            </div>

            {/* Peak Flow */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                🌬️ Peak Flow Reading (L/min)
              </label>
              <input
                type="number"
                name="peakFlow"
                value={symptoms.peakFlow}
                onChange={handleChange}
                placeholder="e.g., 450"
                className="input-field"
              />
            </div>

            {/* Triggers */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                ⚠️ Today's Triggers
              </label>
              <div className="grid grid-cols-2 gap-2">
                {triggerOptions.map(trigger => (
                  <label key={trigger} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="triggers"
                      value={trigger}
                      checked={symptoms.triggers.includes(trigger)}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    {trigger}
                  </label>
                ))}
              </div>
            </div>

            {/* Medications */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                💊 Medications Used Today
              </label>
              <div className="grid grid-cols-2 gap-2">
                {medicationOptions.map(med => (
                  <label key={med} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      name="medication"
                      value={med}
                      checked={symptoms.medications.includes(med)}
                      onChange={handleChange}
                      className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                    />
                    {med}
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                📝 Notes
              </label>
              <textarea
                name="notes"
                value={symptoms.notes}
                onChange={handleChange}
                placeholder="Any additional notes about your symptoms or asthma today..."
                rows="3"
                className="input-field"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              <Activity className="w-5 h-5" />
              Log Symptoms
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SymptomTracker;
