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
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleNext = async () => {
    if (!selectedOption) return;

    const newAnswers = [...answers, selectedOption];
    
    if (currentQ < QUESTIONS.length - 1) {
      setAnswers(newAnswers);
      setSelectedOption(null);
      setCurrentQ(currentQ + 1);
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
      <main className={styles.container}>
        <div style={{ textAlign: 'center', marginTop: '100px' }} className="fade-in">
          <h2 className={styles.questionTitle}>Analyzing your traits...</h2>
          <div className="spinner" style={{ margin: '0 auto' }}></div>
        </div>
      </main>
    );
  }

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.questionTitle}>{question.title}</h1>
        <p className={styles.subtitle}>Select an option to continue</p>
        
        <div className={styles.stepIndicator}>
          Step {currentQ + 1} <span className={styles.stepMuted}>of {QUESTIONS.length}</span>
        </div>
        
        <div className={styles.progressBarContainer}>
          <div className={styles.progressFill} style={{ width: `${progress}%` }}></div>
        </div>
      </div>

      <div className={styles.questionWrapper} key={currentQ}>
        <div className={styles.optionsList}>
          {question.options.map(opt => {
            const isSelected = selectedOption === opt.id;
            return (
              <button 
                key={opt.id} 
                className={`${styles.optionCard} ${isSelected ? styles.selected : ''}`}
                onClick={() => setSelectedOption(opt.id)}
              >
                <div className={styles.iconWrapper}>
                  {/* Generic icon shape */}
                  <svg className={styles.optionIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="8" fill={isSelected ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" opacity={isSelected ? "1" : "0.5"} />
                    {isSelected && <circle cx="12" cy="12" r="4" fill="var(--bg-dark)" />}
                  </svg>
                </div>
                <div className={styles.optionTextContent}>
                  <div className={styles.optionTitle}>{opt.title}</div>
                  <div className={styles.optionDesc}>{opt.desc}</div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className={styles.bottomAction}>
        <button 
          className={`${styles.nextButton} ${selectedOption ? styles.active : ''}`}
          onClick={handleNext}
          disabled={!selectedOption}
        >
          {currentQ < QUESTIONS.length - 1 ? 'Next' : 'Calculate Persona'}
        </button>
      </div>
    </main>
  );
}
