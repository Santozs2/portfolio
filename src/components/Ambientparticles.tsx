import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  targetAlpha: number;
  fadeSpeed: number;
  color: string; // 'orange' | 'yellow' | 'white'
}

const COLORS = {
  orange: 'rgba(255, 115, 0,',
  yellow: 'rgba(234, 179, 8,',
  white: 'rgba(255, 255, 255,',
};

const COLOR_WEIGHTS = [
  ...Array(6).fill('orange'),
  ...Array(2).fill('yellow'),
  ...Array(2).fill('white'),
];

function randomColor(): keyof typeof COLORS {
  return COLOR_WEIGHTS[Math.floor(Math.random() * COLOR_WEIGHTS.length)] as keyof typeof COLORS;
}

function createParticle(width: number, height: number): Particle {
  return {
    x: Math.random() * width,
    y: Math.random() * height,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18 - 0.04, // slight upward drift
    radius: 0.6 + Math.random() * 1.0,
    alpha: 0,
    targetAlpha: 0.04 + Math.random() * 0.10,
    fadeSpeed: 0.003 + Math.random() * 0.005,
    color: randomColor(),
  };
}

interface AmbientParticlesProps {
  /** Number of particles across the full page. Default 60. */
  count?: number;
  /** Whether to pause animation (e.g. reduced-motion). Handled internally too. */
  paused?: boolean;
}

/**
 * Full-page canvas that renders slow-drifting ambient particles.
 * Mount once at the app root, behind all sections.
 *
 * Usage:
 *   // In App.tsx or main layout, before your section components:
 *   <AmbientParticles />
 *
 * The canvas is position:fixed, pointer-events:none, z-index:0.
 * All your sections should have a relative z-index above 0.
 */
export default function AmbientParticles({ count = 60, paused = false }: AmbientParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number>();
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Respect prefers-reduced-motion
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const W = window.innerWidth;
      const H = document.documentElement.scrollHeight;
      canvas.width = W * dpr;
      canvas.height = H * dpr;
      canvas.style.width = `${W}px`;
      canvas.style.height = `${H}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    resize();
    window.addEventListener('resize', resize);

    const W = () => canvas.width / dpr;
    const H = () => canvas.height / dpr;

    // Init particles spread across the full page height
    const particles: Particle[] = Array.from({ length: count }, () =>
      createParticle(W(), H())
    );
    // Start them at random phases so they don't all fade in together
    particles.forEach(p => {
      p.alpha = Math.random() * p.targetAlpha;
    });

    let lastTime = 0;
    const animate = (now: number) => {
      const delta = Math.min(now - lastTime, 50); // cap at 50ms
      lastTime = now;

      if (!pausedRef.current) {
        ctx.clearRect(0, 0, W(), H());

        particles.forEach((p, i) => {
          // Drift
          p.x += p.vx * (delta / 16);
          p.y += p.vy * (delta / 16);

          // Fade in/out toward target
          p.alpha += (p.targetAlpha - p.alpha) * p.fadeSpeed * (delta / 16);

          // Wrap horizontally
          if (p.x < -2) p.x = W() + 2;
          if (p.x > W() + 2) p.x = -2;

          // When a particle drifts off the top, reset it at the bottom
          if (p.y < -4) {
            const fresh = createParticle(W(), H());
            fresh.y = H() + 4;
            fresh.alpha = 0;
            particles[i] = fresh;
            return;
          }
          if (p.y > H() + 4) {
            const fresh = createParticle(W(), H());
            fresh.y = -4;
            fresh.alpha = 0;
            particles[i] = fresh;
            return;
          }

          // Draw
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
          ctx.fillStyle = `${COLORS[p.color as keyof typeof COLORS]}${p.alpha})`;
          ctx.fill();
        });
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', resize);
    };
  }, [count]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        width: '100vw',
        height: '100vh',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  );
}