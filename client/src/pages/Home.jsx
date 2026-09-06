import React from 'react';
import { Link } from 'react-router-dom';
import Hero from '../components/Hero';

const Home = () => (
  <>
    <Hero />
    <section className="container-custom py-12">
      <div className="grid gap-6 md:grid-cols-3">
        <Link to="/exercises" className="card p-6 hover:-translate-y-1">
          <div className="text-3xl mb-3">🫁</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Guided exercises</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Practice breathing patterns with a visual timer and optional sound cues.</p>
        </Link>
        <Link to="/tracker" className="card p-6 hover:-translate-y-1">
          <div className="text-3xl mb-3">📊</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Track symptoms</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Record daily symptoms, triggers, medications, and peak-flow readings.</p>
        </Link>
        <Link to="/dashboard" className="card p-6 hover:-translate-y-1">
          <div className="text-3xl mb-3">📈</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">See your progress</h2>
          <p className="mt-2 text-gray-600 dark:text-gray-300">Review exercise consistency and symptom trends in one place.</p>
        </Link>
      </div>
    </section>
  </>
);

export default Home;
