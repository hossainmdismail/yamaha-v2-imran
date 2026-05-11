'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './upload.module.css';

const LOADING_MESSAGES = [
  "Analyzing facial features...",
  "Mapping your ride personality...",
  "Matching with Yamaha R15M...",
  "Crafting cinematic landscape...",
  "Blending persona with environment...",
  "Finalizing your cinematic portrait..."
];

const PENDING_GENERATION_KEY = 'pendingGeneration';
const UPLOAD_DB_NAME = 'yamaha-upload-state';
const UPLOAD_STORE_NAME = 'files';
const UPLOAD_FILE_KEY = 'pending-upload';

type PendingGeneration = {
  requestId: string;
  startedAt: number;
};

type GenerationStatusResponse = {
  generationId?: string;
  status?: 'not_found' | 'processing' | 'completed' | 'failed';
};

function createRequestId() {
  return crypto.randomUUID().replace(/-/g, '');
}

function openUploadDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(UPLOAD_DB_NAME, 1);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(UPLOAD_STORE_NAME)) {
        db.createObjectStore(UPLOAD_STORE_NAME);
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

async function savePendingFile(blob: Blob) {
  const db = await openUploadDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(UPLOAD_STORE_NAME, 'readwrite');
    tx.objectStore(UPLOAD_STORE_NAME).put(blob, UPLOAD_FILE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

async function loadPendingFile() {
  const db = await openUploadDb();
  const blob = await new Promise<Blob | null>((resolve, reject) => {
    const tx = db.transaction(UPLOAD_STORE_NAME, 'readonly');
    const request = tx.objectStore(UPLOAD_STORE_NAME).get(UPLOAD_FILE_KEY);
    request.onsuccess = () => resolve((request.result as Blob | undefined) || null);
    request.onerror = () => reject(request.error);
  });
  db.close();
  return blob;
}

async function clearPendingFile() {
  const db = await openUploadDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction(UPLOAD_STORE_NAME, 'readwrite');
    tx.objectStore(UPLOAD_STORE_NAME).delete(UPLOAD_FILE_KEY);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  db.close();
}

function readPendingGeneration(): PendingGeneration | null {
  const raw = localStorage.getItem(PENDING_GENERATION_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as Partial<PendingGeneration>;
    if (typeof parsed.requestId === 'string' && typeof parsed.startedAt === 'number') {
      return {
        requestId: parsed.requestId,
        startedAt: parsed.startedAt,
      };
    }
  } catch {
    return null;
  }

  return null;
}

function writePendingGeneration(value: PendingGeneration) {
  localStorage.setItem(PENDING_GENERATION_KEY, JSON.stringify(value));
}

async function clearPendingGeneration() {
  localStorage.removeItem(PENDING_GENERATION_KEY);
  await clearPendingFile();
}

export default function Upload() {
  const router = useRouter();
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(0);
  const [error, setError] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [quizData, setQuizData] = useState<any>(null);
  const resumeAttemptedRef = useRef(false);
  const previewUrlRef = useRef<string | null>(null);

  const restoreSavedFile = async () => {
    const savedBlob = await loadPendingFile();
    if (!savedBlob) return null;

    const restoredFile = new File([savedBlob], 'upload.jpg', {
      type: savedBlob.type || 'image/jpeg',
    });

    setFile(restoredFile);
    if (previewUrlRef.current) {
      URL.revokeObjectURL(previewUrlRef.current);
    }
    const objectUrl = URL.createObjectURL(restoredFile);
    previewUrlRef.current = objectUrl;
    setPreview(objectUrl);

    return restoredFile;
  };

  const finalizeGeneration = async (data: { generationId: string }) => {
    await clearPendingGeneration();
    localStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('quizState');
    sessionStorage.removeItem('quizResult');
    router.push(`/ai-persona/result/${data.generationId}`);
  };

  const checkExistingGeneration = async (requestId: string) => {
    const res = await fetch(`/api/generate?requestId=${requestId}`, {
      cache: 'no-store',
    });

    if (!res.ok) {
      return null;
    }

    const data = await res.json();
    return data as GenerationStatusResponse;
  };

  const waitForGenerationCompletion = async (requestId: string) => {
    for (let attempt = 0; attempt < 60; attempt++) {
      const status = await checkExistingGeneration(requestId);
      if (!status) {
        await new Promise((resolve) => setTimeout(resolve, 1500));
        continue;
      }

      if (status.status === 'completed' && status.generationId) {
        return status;
      }

      if (status.status === 'failed') {
        return status;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    return null;
  };

  useEffect(() => {
    const data = sessionStorage.getItem('quizResult');
    if (data) {
      setQuizData(JSON.parse(data));
    }

    const pendingGeneration = readPendingGeneration();
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';

    if (!isAuthenticated && !pendingGeneration) {
      router.push('/ai-persona');
      return;
    }

    if (!data && !pendingGeneration) {
      router.push('/ai-persona/quiz');
    }
  }, [router]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (loading) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    if (loading) {
      window.history.pushState({ generationLocked: true }, '', window.location.href);
      window.addEventListener('beforeunload', handleBeforeUnload);
      const handlePopState = () => {
        window.history.pushState({ generationLocked: true }, '', window.location.href);
      };
      window.addEventListener('popstate', handlePopState);
      interval = setInterval(() => {
        setLoadingStep((prev) => (prev + 1) % LOADING_MESSAGES.length);
      }, 3000);

      return () => {
        clearInterval(interval);
        window.removeEventListener('beforeunload', handleBeforeUnload);
        window.removeEventListener('popstate', handlePopState);
      };
    }
    
    return undefined;
  }, [loading]);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
    };
  }, []);

  const submitGeneration = async (currentFile: File, currentQuizData: any, requestId: string) => {
    setLoading(true);
    setError('');
    writePendingGeneration({ requestId, startedAt: Date.now() });

    try {
      const existingGeneration = await checkExistingGeneration(requestId);
      if (existingGeneration?.status === 'completed' && existingGeneration.generationId) {
        await finalizeGeneration({ generationId: existingGeneration.generationId });
        return;
      }
      if (existingGeneration?.status === 'processing') {
        const completedGeneration = await waitForGenerationCompletion(requestId);
        if (completedGeneration?.status === 'completed' && completedGeneration.generationId) {
          await finalizeGeneration({ generationId: completedGeneration.generationId });
          return;
        }
        if (completedGeneration?.status === 'failed') {
          setError('Generation failed. Please try again.');
          setLoading(false);
          await clearPendingGeneration();
          return;
        }
        setError('Generation is still processing. Please wait a little longer.');
        setLoading(false);
        return;
      }

      const resizedBlob = await resizeImage(currentFile);
      const formData = new FormData();
      formData.append('photo', resizedBlob, 'upload.jpg');
      formData.append('persona', currentQuizData.persona);
      formData.append('requestId', requestId);

      const res = await fetch('/api/generate', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (res.ok && data.success && data.status === 'completed') {
        await finalizeGeneration({ generationId: data.generationId });
      } else if (res.ok && data.success && data.status === 'processing') {
        const completedGeneration = await waitForGenerationCompletion(requestId);
        if (completedGeneration?.status === 'completed' && completedGeneration.generationId) {
          await finalizeGeneration({ generationId: completedGeneration.generationId });
          return;
        }

        if (completedGeneration?.status === 'failed') {
          setError('Generation failed. Please try again.');
          setLoading(false);
          await clearPendingGeneration();
          return;
        }
        setError('Generation is still processing. Please wait a little longer.');
        setLoading(false);
        return;
      } else {
        const recoveredGeneration = await checkExistingGeneration(requestId);
        if (recoveredGeneration?.status === 'completed' && recoveredGeneration.generationId) {
          await finalizeGeneration({ generationId: recoveredGeneration.generationId });
          return;
        }

        setError(data.error || 'Generation failed');
        setLoading(false);
        await clearPendingGeneration();
      }
    } catch (err) {
      const recoveredGeneration = await checkExistingGeneration(requestId);
      if (recoveredGeneration?.status === 'completed' && recoveredGeneration.generationId) {
        await finalizeGeneration({ generationId: recoveredGeneration.generationId });
        return;
      }

      setError('Generation was interrupted. Your image is still here, so you can retry immediately.');
      setLoading(false);
    }
  };

  useEffect(() => {
    const resumePendingGeneration = async () => {
      if (resumeAttemptedRef.current) return;
      if (quizData === null) return;

      const pendingGeneration = readPendingGeneration();
      if (!pendingGeneration) return;

      resumeAttemptedRef.current = true;
      setLoading(true);
      setError('');

      const recoveredGeneration = await checkExistingGeneration(pendingGeneration.requestId);
      if (recoveredGeneration?.status === 'completed' && recoveredGeneration.generationId) {
        await finalizeGeneration({ generationId: recoveredGeneration.generationId });
        return;
      }
      if (recoveredGeneration?.status === 'processing') {
        const completedGeneration = await waitForGenerationCompletion(pendingGeneration.requestId);
        if (completedGeneration?.status === 'completed' && completedGeneration.generationId) {
          await finalizeGeneration({ generationId: completedGeneration.generationId });
          return;
        }
        if (completedGeneration?.status === 'failed') {
          setLoading(false);
          setError('Previous generation failed. Please try again.');
          await clearPendingGeneration();
          return;
        }
        setLoading(false);
        setError('Generation is still processing. Please wait a little longer.');
        return;
      }

      const restoredFile = await restoreSavedFile();
      if (!restoredFile || !quizData) {
        setLoading(false);
        setError('Previous generation was interrupted. Please upload the image again.');
        await clearPendingGeneration();
        return;
      }

      await submitGeneration(restoredFile, quizData, pendingGeneration.requestId);
    };

    void resumePendingGeneration();
  }, [quizData]);

  const resizeImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxDim = 1080;

          if (width > height) {
            if (width > maxDim) {
              height *= maxDim / width;
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width *= maxDim / height;
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Canvas to Blob failed'));
          }, 'image/jpeg', 0.9);
        };
      };
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      if (selected.size > 6 * 1024 * 1024) {
        setError('File size must be less than 6MB');
        return;
      }

      void savePendingFile(selected);
      setFile(selected);
      if (previewUrlRef.current) {
        URL.revokeObjectURL(previewUrlRef.current);
      }
      const objectUrl = URL.createObjectURL(selected);
      previewUrlRef.current = objectUrl;
      setPreview(objectUrl);
      setError('');
    }
  };

  const handleGenerate = async () => {
    if (!file || !quizData) return;

    await submitGeneration(file, quizData, createRequestId());
  };

  if (loading) {
    return (
      <main className="page-container">
        <div className={styles.loadingContainer}>
          <div className={styles.skeleton}></div>
          <div className={styles.loadingMessage}>
            <p className={styles.fadeText}>{LOADING_MESSAGES[loadingStep]}</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="page-container">
      <div className={`${styles.container} fade-in`}>
        <h1 style={{ fontSize: '28px', marginBottom: '8px', fontFamily: 'Outfit' }}>Upload Your Portrait</h1>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '32px', fontSize: '14px' }}>
          For the best cinematic match, upload a clear front-facing photo.
        </p>

        {error && <div style={{ color: '#ff4d4d', marginBottom: '16px', fontSize: '13px', background: 'rgba(255,77,77,0.1)', padding: '8px', borderRadius: '4px' }}>{error}</div>}

        <div 
          className={styles.uploadBox} 
          onClick={() => fileInputRef.current?.click()}
          style={{ borderColor: preview ? 'transparent' : 'rgba(255,255,255,0.2)' }}
        >
          {preview ? (
            <img src={preview} alt="Preview" className={styles.preview} />
          ) : (
            <div className={styles.uploadText}>
              <span className={styles.icon}>👤</span>
              <h3 style={{ fontSize: '18px', fontWeight: '500' }}>Tap to select photo</h3>
              <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '8px' }}>Max 6MB (JPG, PNG)</p>
            </div>
          )}
          {preview && (
            <div className={styles.uploadText} style={{ background: 'rgba(0,0,0,0.5)', padding: '12px', borderRadius: '8px', backdropFilter: 'blur(4px)' }}>
              <p style={{ fontSize: '14px' }}>Tap to change</p>
            </div>
          )}
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
          style={{ marginTop: '16px' }}
        >
          Generate My Persona
        </button>
      </div>
    </main>
  );
}
