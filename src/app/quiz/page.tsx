'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './quiz.module.css';

const QUESTIONS = [
  {
    id: 'riding_behavior',
    title: 'How would you describe your riding behavior?',
    options: [
      { id: 'Weekend Explorer', title: 'Weekend Explorer', desc: 'Long journeys discovering new horizons.' },
      { id: 'Daily Commuter', title: 'Daily Commuter', desc: 'Navigating the city with efficiency and style.' },
      { id: 'Speed Enthusiast', title: 'Speed Enthusiast', desc: 'Thrilling performance and high-speed control.' },
    ]
  },
  {
    id: 'destination',
    title: 'Choose your favorite riding destination',
    options: [
      { id: 'Urban Nightscapes', title: 'Urban Nightscapes', desc: 'Neon lights and city vibes.' },
      { id: 'Coastal Highways', title: 'Coastal Highways', desc: 'Salty breeze and endless horizons.' },
      { id: 'Mountain Trails', title: 'Mountain Trails', desc: 'Rugged terrain and breathtaking peaks.' },
    ]
  },
  {
    id: 'aspiration',
    title: 'What is your ultimate riding aspiration?',
    options: [
      { id: 'Iconic Blue', title: 'Racing Blue', desc: 'The signature Yamaha racing spirit.' },
      { id: 'Dark Side', title: 'Dark Side of Japan', desc: 'Aggressive styling and urban edge.' },
      { id: 'Dream Bike', title: 'Dream Bike', desc: 'Uncompromising power and ultimate prestige.' },
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
