'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

export default function Home() {
  const router = useRouter();
  const [step, setStep] = useState<'lead' | 'otp'>('lead');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !phone) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone }),
      });
      const data = await res.json();

      if (res.ok) {
        setStep('otp');
      } else {
        setError(data.error || 'Failed to send OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length !== 4) {
      setError('OTP must be 4 digits');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, phone, otp }),
      });
      const data = await res.json();

      if (res.ok) {
        // Redirect to quiz page
        router.push('/quiz');
      } else {
        setError(data.error || 'Invalid OTP');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="page-container">
      <div className={`${styles.card} fade-in`}>
        <img src="/yamaha-logo.png" alt="Yamaha" className={styles.logo} onError={(e) => e.currentTarget.style.display = 'none'} />
        
        {step === 'lead' ? (
          <>
            <h1 className={styles.title}>Discover Your Ride Persona</h1>
            <p className={styles.subtitle}>Let AI analyze your personality and match you with the perfect Yamaha.</p>
            
            {error && <div className={styles.error}>{error}</div>}
            
            <form onSubmit={handleSendOtp}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input 
                  type="text" 
                  value={name} 
                  onChange={(e) => setName(e.target.value)} 
                  placeholder="Enter your name" 
                  required 
                />
              </div>
              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)} 
                  placeholder="e.g. 017XXXXXXXX" 
                  required 
                />
              </div>
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Sending OTP...' : 'Start Experience'}
              </button>
            </form>
          </>
        ) : (
          <div className={styles.otpContainer}>
            <h1 className={styles.title}>Verify Your Number</h1>
            <p className={styles.subtitle}>Enter the 4-digit code sent to {phone}</p>
            
            {error && <div className={styles.error}>{error}</div>}
            
            <form onSubmit={handleVerifyOtp}>
              <div className={styles.formGroup}>
                <input 
                  type="text" 
                  maxLength={4} 
                  value={otp} 
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, ''))} 
                  placeholder="••••" 
                  style={{ textAlign: 'center', letterSpacing: '8px', fontSize: '24px' }}
                  required 
                />
              </div>
              <button type="submit" className="primary-button" disabled={loading}>
                {loading ? 'Verifying...' : 'Verify & Continue'}
              </button>
            </form>
            <button className={styles.resendBtn} onClick={() => setStep('lead')} disabled={loading}>
              Change Phone Number
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
