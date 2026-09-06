import React, { useState, useEffect } from 'react';
import { ArrowRight, Activity, Clock, Award, Wind, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [scale, setScale] = useState(1);
  const [isInhaling, setIsInhaling] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      setIsInhaling(prev => !prev);
      setScale(prev => prev === 1 ? 1.4 : 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-50 via-white to-secondary-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-20">
      <div className="container-custom relative">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-2 bg-primary-100 dark:bg-primary-900/30 px-4 py-2 rounded-full">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-primary-500"></span>
              </span>
              <span className="text-sm font-medium text-primary-700 dark:text-primary-300">
                <ShieldCheck className="mr-1 inline h-4 w-4" /> Built for calmer daily routines
              </span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              <span className="bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent">
                Breathe Better,
              </span>
              <br />
              <span>Live Better</span>
            </h1>

            <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
              Your personalized asthma management companion. Track symptoms, 
              practice guided breathing exercises, and take control of your respiratory health.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4">
              <div className="card p-4 text-center">
                <Activity className="w-6 h-6 text-primary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">15+</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Exercises</div>
              </div>
              <div className="card p-4 text-center">
                <Clock className="w-6 h-6 text-secondary-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">5 min</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Daily Practice</div>
              </div>
              <div className="card p-4 text-center">
                <Award className="w-6 h-6 text-yellow-600 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900 dark:text-white">92%</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">Success Rate</div>
              </div>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link to="/exercises" className="btn-primary flex items-center gap-2 group">
                Get Started
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/tracker" className="btn-outline">
                Learn More
              </Link>
            </div>
          </div>

          {/* Right Content - Breathing Animation */}
          <div className="flex justify-center items-center">
            <div className="relative">
              {/* Outer Ring */}
              <div className={`w-64 h-64 md:w-80 md:h-80 rounded-full border-4 border-primary-200 dark:border-primary-800 flex items-center justify-center transition-all duration-4000`}
                   style={{ transform: `scale(${scale})` }}>
                {/* Inner Ring */}
                <div className={`w-48 h-48 md:w-60 md:h-60 rounded-full border-4 border-secondary-200 dark:border-secondary-800 flex items-center justify-center transition-all duration-4000`}
                     style={{ transform: `scale(${scale > 1 ? 0.8 : 1.2})` }}>
                  {/* Center Icon */}
                  <div className="text-center">
                    <Wind className={`mx-auto h-16 w-16 text-primary-600 transition-transform duration-1000 ${isInhaling ? 'scale-110' : 'scale-90'}`} />
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-300 mt-2">
                      {isInhaling ? 'Breathe In' : 'Breathe Out'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {isInhaling ? '4 seconds' : '6 seconds'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Floating Particles */}
              <div className="absolute -top-4 -right-4 w-12 h-12 bg-primary-400 rounded-full opacity-30 animate-float"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-secondary-400 rounded-full opacity-30 animate-float" style={{ animationDelay: '2s' }}></div>
              <div className="absolute top-1/2 -right-8 w-8 h-8 bg-yellow-400 rounded-full opacity-30 animate-float" style={{ animationDelay: '4s' }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
