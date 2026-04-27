'use client';

import styles from '../result.module.css';

interface ResultActionsProps {
  imageUrl: string;
  userName: string;
}

export default function ResultActions({ imageUrl, userName }: ResultActionsProps) {
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Yamaha Ride Persona',
          text: `Check out my Yamaha cinematic persona! Generated with AI.`,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Share failed:', err);
      }
    } else {
      // Fallback: Copy link
      try {
        await navigator.clipboard.writeText(window.location.href);
        alert('Link copied to clipboard!');
      } catch (err) {
        alert('Could not share or copy link.');
      }
    }
  };

  return (
    <div className={styles.actions}>
      <a 
        href={imageUrl} 
        download={`Yamaha_Persona_${userName}.jpg`} 
        className={styles.secondaryBtn} 
        style={{ textAlign: 'center' }}
      >
        Download Card
      </a>
      <button className="primary-button" style={{ flex: 1 }} onClick={handleShare}>
        Share Result
      </button>
      <button 
        className={styles.secondaryBtn} 
        style={{ flex: 0.5, background: 'rgba(255,255,255,0.05)' }} 
        onClick={() => window.location.href = '/'}
      >
        Home
      </button>
    </div>
  );
}
