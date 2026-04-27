'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './upload.module.css';

export default function Upload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [quizData, setQuizData] = useState<any>(null);

  useEffect(() => {
    const data = sessionStorage.getItem('quizResult');
    if (data) {
      setQuizData(JSON.parse(data));
    } else {
      router.push('/quiz');
    }
  }, [router]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      setFile(selected);
      setPreview(URL.createObjectURL(selected));
    }
  };

  const handleGenerate = async () => {
    if (!file || !quizData) return;
    
    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('photo', file);
    formData.append('persona', quizData.persona);
    formData.append('bikeId', quizData.bikeId);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success) {
        router.push(`/result/${data.generationId}`);
      } else {
        setError(data.error || 'Generation failed');
        setLoading(false);
      }
    } catch (err) {
      setError('Network error during generation');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <main className="page-container">
        <div className={styles.loadingContainer}>
          <div className={styles.spinner}></div>
          <h2 className={styles.loadingText}>Crafting your cinematic AI persona...</h2>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className={`${styles.container} fade-in`}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px' }}>Upload Your Photo</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px' }}>
          For the best result, upload a clear front-facing portrait.
        </p>

        {error && <div style={{ color: '#ff4d4d', marginBottom: '16px' }}>{error}</div>}

        <div 
          className={styles.uploadBox} 
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <img src={preview} alt="Preview" className={styles.preview} />
          ) : null}
          <div className={styles.uploadText} style={{ background: preview ? 'rgba(0,0,0,0.6)' : 'none', padding: '16px', borderRadius: '8px' }}>
            <span className={styles.icon}>📸</span>
            <h3>{preview ? 'Tap to change photo' : 'Tap to select photo'}</h3>
          </div>
        </div>

        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          style={{ display: 'none' }} 
        />

        <button 
          className="primary-button" 
          disabled={!file}
          onClick={handleGenerate}
        >
          Generate My Persona
        </button>
      </div>
    </main>
  );
}
