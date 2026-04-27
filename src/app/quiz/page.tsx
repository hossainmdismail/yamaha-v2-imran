'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './quiz.module.css';

const QUESTIONS = [
  {
    id: 'riding_style',
    title: 'How would you describe your ideal weekend ride?',
    options: [
      { id: 'Speed Enthusiast', title: 'Speed & Thrills', desc: 'Hitting the track or carving canyons.' },
      { id: 'Weekend Explorer', title: 'Exploration', desc: 'Long journeys discovering new places.' },
      { id: 'Daily Commuter', title: 'City Cruising', desc: 'Navigating urban landscapes with style.' },
    ]
  },
  {
    id: 'environment',
    title: 'Where do you feel most alive?',
    options: [
      { id: 'Urban Nightscapes', title: 'Neon City Lights', desc: 'The pulse of the city at night.' },
      { id: 'Mountain Trails', title: 'Rugged Outdoors', desc: 'Off the beaten path in nature.' },
      { id: 'Urban', title: 'Daylight Concrete', desc: 'Everyday urban environments.' },
    ]
  }
];

export default function Quiz() {
  const router = useRouter();
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSelect = async (optionId: string) => {
    const newAnswers = [...answers, optionId];
    setAnswers(newAnswers);

    if (currentQ < QUESTIONS.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    } else {
      setLoading(true);
      try {
        const res = await fetch('/api/quiz/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ traits: newAnswers })
        });
        const data = await res.json();
        
        if (res.ok && data.bike) {
          // Store result in sessionStorage to use in upload step
          sessionStorage.setItem('quizResult', JSON.stringify({
            persona: data.persona,
            bikeId: data.bike.assigned_bike_id || data.bike.id,
            bikeModel: data.bike.model_name
          }));
          router.push('/upload');
        } else {
          alert('Failed to calculate persona. Please try again.');
          setLoading(false);
        }
      } catch (err) {
        alert('Network error. Please try again.');
        setLoading(false);
      }
    }
  };

  const question = QUESTIONS[currentQ];
  const progress = ((currentQ + 1) / QUESTIONS.length) * 100;

  if (loading) {
    return (
      <main className="page-container">
        <div style={{ textAlign: 'center' }} className="fade-in">
          <h2 className={styles.questionTitle}>Analyzing your traits...</h2>
          <div className="spinner"></div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className={`${styles.container} fade-in`} key={currentQ}>
        <div className={styles.header}>
          <div className={styles.progress}>Question {currentQ + 1} of {QUESTIONS.length}</div>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
          </div>
          <h1 className={styles.questionTitle}>{question.title}</h1>
        </div>

        <div className={styles.optionsGrid}>
          {question.options.map(opt => (
            <button 
              key={opt.id} 
              className={styles.optionCard}
              onClick={() => handleSelect(opt.id)}
            >
              <div className={styles.optionTitle}>{opt.title}</div>
              <div className={styles.optionDesc}>{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>
    </main>
  );
}
