'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Inter, Orbitron } from 'next/font/google';
import styles from './landing.module.css';

const inter = Inter({ subsets: ['latin'], variable: '--landing-body' });
const orbitron = Orbitron({ subsets: ['latin'], variable: '--landing-heading' });

function CheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.featureIcon}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default function LandingPage() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeRevealIds, setActiveRevealIds] = useState<string[]>([]);
  const particlesRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal-id]'));
    if (!elements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const revealId = entry.target.getAttribute('data-reveal-id');
        if (revealId) {
          setActiveRevealIds((current) => (current.includes(revealId) ? current : [...current, revealId]));
        }
        observer.unobserve(entry.target);
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px',
    });

    elements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = particlesRef.current;
    if (!container) return;

    let disposed = false;
    const created: HTMLDivElement[] = [];

    const createParticle = () => {
      if (disposed || !container) return;
      const particle = document.createElement('div');
      particle.className = styles.particle;
      particle.style.width = `${Math.random() * 3 + 1}px`;
      particle.style.height = particle.style.width;
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.bottom = '-10px';
      particle.style.animationDuration = `${Math.random() * 10 + 10}s`;
      particle.style.animationDelay = `${Math.random() * 15}s`;
      particle.addEventListener('animationend', () => {
        particle.remove();
        if (!disposed) createParticle();
      }, { once: true });
      created.push(particle);
      container.appendChild(particle);
    };

    for (let i = 0; i < 50; i += 1) createParticle();
    return () => {
      disposed = true;
      created.forEach((particle) => particle.remove());
    };
  }, []);

  const revealClass = (id: string, delay?: string) =>
    [styles.reveal, delay ? styles[delay] : '', activeRevealIds.includes(id) ? styles.revealActive : ''].filter(Boolean).join(' ');

  const steps = [
    {
      id: 'step-1',
      delay: 'revealDelay1',
      number: '01',
      title: 'Verify Yourself',
      desc: 'Start your engine securely. Provide your name, phone number, and authenticate with a quick OTP.',
      features: ['Name & Phone input', 'Instant OTP Verification'],
      icon: <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
    },
    {
      id: 'step-2',
      delay: 'revealDelay2',
      number: '02',
      title: 'Discover Your Persona',
      desc: 'Answer a few quick questions to uncover your riding vibe. Your personality shapes the universe around you.',
      features: ['Interactive Quiz', 'Personality Mapping'],
      icon: <><circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><line x1="12" y1="17" x2="12.01" y2="17" /></>,
    },
    {
      id: 'step-3',
      delay: 'revealDelay3',
      number: '03',
      title: 'Upload Your Selfie',
      desc: 'Snap or upload a photo. Our advanced AI perfectly frames you to transport you seamlessly into the experience.',
      features: ['AI-Ready Upload', 'Real-time Preview'],
      icon: <><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" /><circle cx="12" cy="13" r="4" /></>,
    },
    {
      id: 'step-4',
      delay: 'revealDelay4',
      number: '04',
      title: 'Enter & Share',
      desc: 'Behold your personalized Yamaha persona! View your immersive result, download it, and share it across your network.',
      features: ['Instant Generation', 'One-click Share'],
      icon: <><circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" /><line x1="8.59" y1="13.51" x2="15.42" y2="17.49" /><line x1="15.41" y1="6.51" x2="8.59" y2="10.49" /></>,
    },
  ];

  return (
    <main className={`${styles.page} ${inter.variable} ${orbitron.variable}`}>
      <div className={styles.ambientBackground} />
      <div className={styles.gridOverlay} />
      <div ref={particlesRef} className={styles.particlesContainer} />

      <div className={styles.shell}>
        <header className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : ''}`}>
          <div className={`${styles.container} ${styles.navContainer}`}>
            <div className={styles.logo}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={styles.logoIcon}>
                <circle cx="12" cy="12" r="10" />
                <polygon points="12 2 15 10 22 12 15 14 12 22 9 14 2 12 9 10" />
              </svg>
              YAMAHA <span className={styles.logoAccent}>UNIVERSE</span>
            </div>
            <nav className={styles.navLinks}>
              <a href="#how-it-works">How It Works</a>
              <a href="#preview">Preview</a>
            </nav>
          </div>
        </header>

        <section className={styles.hero}>
          <div className={`${styles.container} ${styles.heroContainer}`}>
            <div>
              <div className={`${styles.badge} ${styles.fadeIn}`}>AI Experience</div>
              <h1 className={`${styles.heroTitle} ${styles.slideUp}`}>
                See yourself in a
                <br />
                <span className={`${styles.textGradient} ${styles.glowText}`}>Yamaha universe</span>
              </h1>
              <p className={`${styles.heroSubtitle} ${styles.slideUp}`}>
                Transform your passion into reality. Create your personalized, AI-driven Yamaha rider persona and step into a futuristic riding experience.
              </p>
              <div className={`${styles.heroActions} ${styles.slideUp}`}>
                <Link href="/ai-persona" className={`${styles.buttonLink} ${styles.btn} ${styles.btnPrimary}`}>
                  <span>Enter the Yamaha Universe</span>
                  <svg viewBox="0 0 24 24" width="20" height="20" stroke="currentColor" strokeWidth="2" fill="none">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </Link>
              </div>
            </div>

            <div className={`${styles.heroVisual} ${styles.fadeIn}`} id="preview">
              <div className={styles.hologramContainer}>
                <div className={styles.hologramRings}>
                  <div className={`${styles.ring} ${styles.ring1}`} />
                  <div className={`${styles.ring} ${styles.ring2}`} />
                  <div className={`${styles.ring} ${styles.ring3}`} />
                </div>
                <div className={`${styles.imageWrapper} ${styles.glassPanel}`}>
                  <Image
                    src="/Yamaha_Persona.jpg"
                    alt="Futuristic Yamaha Bike"
                    className={styles.heroImg}
                    fill
                    priority
                  />
                  <div className={styles.scannerLine} />
                  <div className={styles.techOverlay}>
                    <div className={`${styles.corner} ${styles.topLeft}`} />
                    <div className={`${styles.corner} ${styles.topRight}`} />
                    <div className={`${styles.corner} ${styles.bottomLeft}`} />
                    <div className={`${styles.corner} ${styles.bottomRight}`} />
                    <div className={styles.crosshair} />
                  </div>
                </div>
                <div className={`${styles.floatingCard} ${styles.style1}`}>
                  <div className={styles.iconBox}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10" />
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.label}>AI Engine</span>
                    <span className={styles.value}>Active</span>
                  </div>
                </div>
                <div className={`${styles.floatingCard} ${styles.style2}`}>
                  <div className={styles.iconBox}>
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                    </svg>
                  </div>
                  <div className={styles.statInfo}>
                    <span className={styles.label}>Style</span>
                    <span className={styles.value}>Cyberpunk</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.scrollIndicator}>
            <span className={styles.mouse}><span className={styles.wheel} /></span>
            <span className={styles.scrollText}>Scroll to explore</span>
          </div>
        </section>

        <section className={styles.workflow} id="how-it-works">
          <div className={styles.container}>
            <div data-reveal-id="header" className={`${styles.sectionHeader} ${revealClass('header')}`}>
              <h2 className={styles.sectionTitle}>How It <span className={styles.textGradient}>Works</span></h2>
              <p className={styles.sectionSubtitle}>Your journey into the Yamaha Universe in four seamless steps.</p>
            </div>

            <div className={styles.workflowGrid}>
              {steps.map((step) => (
                <div key={step.id} data-reveal-id={step.id} className={`${styles.stepCard} ${styles.glassPanel} ${revealClass(step.id, step.delay)}`}>
                  <div className={styles.stepConnector} />
                  <div className={styles.stepHeader}>
                    <div className={styles.stepNumber}>{step.number}</div>
                    <div className={styles.stepIconWrapper}>
                      <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2">
                        {step.icon}
                      </svg>
                    </div>
                  </div>
                  <h3 className={styles.stepTitle}>{step.title}</h3>
                  <p className={styles.stepDesc}>{step.desc}</p>
                  <ul className={styles.featureList}>
                    {step.features.map((feature) => (
                      <li key={feature}>
                        <CheckIcon />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div data-reveal-id="cta" className={`${styles.workflowCta} ${revealClass('cta')}`}>
              <Link href="/ai-persona" className={`${styles.buttonLink} ${styles.btn} ${styles.btnPrimary} ${styles.btnLarge}`}>
                <span>Start Your Journey Now</span>
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none">
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          </div>
        </section>

        <footer className={styles.footer}>
          <div className={styles.container}>
            <div className={styles.footerTop}>
              <div>
                <div className={styles.logo}>YAMAHA <span className={styles.logoAccent}>UNIVERSE</span></div>
                <p className={styles.footerTagline}>Rev Your Heart in the Digital Age. Discover your perfect AI persona.</p>
              </div>
              <div className={styles.footerNav}>
                <h4>Navigation</h4>
                <ul>
                  <li><a href="#how-it-works">How It Works</a></li>
                  <li><a href="#preview">Preview</a></li>
                  <li><Link href="/ai-persona">Start Experience</Link></li>
                </ul>
              </div>
              <div className={styles.footerSocial}>
                <h4>Connect</h4>
                <div className={styles.socialLinks}>
                  <a href="#" className={styles.socialIcon} aria-label="Instagram">IG</a>
                  <a href="#" className={styles.socialIcon} aria-label="Twitter">X</a>
                  <a href="#" className={styles.socialIcon} aria-label="Facebook">f</a>
                </div>
              </div>
            </div>
            <div className={styles.footerBottom}>
              <p>&copy; 2026 Yamaha AI Experience. All rights reserved.</p>
              <div className={styles.footerLegal}>
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Service</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </main>
  );
}
