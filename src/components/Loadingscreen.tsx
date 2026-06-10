import { useEffect, useState, useRef } from 'react';

const BOOT_LINES = [
  'INICIALIZANDO SISTEMAS...',
  'CARREGANDO AMBIENTES DIGITAIS...',
  'CONECTANDO MARCA PESSOAL...',
  'PRONTO.',
];

interface LoadingScreenProps {
  /** Called when the exit animation finishes and the screen can be unmounted */
  onDone: () => void;
  /** Total visible duration before exit begins (ms). Default 2400 */
  duration?: number;
}

export default function LoadingScreen({ onDone, duration = 2400 }: LoadingScreenProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const doneRef = useRef(false);

  // Boot lines appear one by one
  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = [];
    const interval = duration * 0.18; // spread lines across ~72% of duration

    BOOT_LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines(prev => [...prev, line]);
        }, 300 + i * interval)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, [duration]);

  // Progress bar
  useEffect(() => {
    const start = performance.now();
    let raf: number;

    const tick = (now: number) => {
      const elapsed = now - start;
      const raw = elapsed / duration;
      // ease-out curve
      const eased = 1 - Math.pow(1 - Math.min(raw, 1), 3);
      setProgress(eased * 100);
      if (raw < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [duration]);

  // Trigger exit
  useEffect(() => {
    const t = setTimeout(() => {
      setExiting(true);
    }, duration);
    return () => clearTimeout(t);
  }, [duration]);

  // After exit animation completes (600ms), call onDone
  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onDone();
      }
    }, 600);
    return () => clearTimeout(t);
  }, [exiting, onDone]);

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: '#020202',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        transition: exiting ? 'opacity 600ms ease, transform 600ms ease' : 'none',
        opacity: exiting ? 0 : 1,
        transform: exiting ? 'scale(1.015)' : 'scale(1)',
        pointerEvents: exiting ? 'none' : 'all',
      }}
    >
      {/* Subtle grid overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
          backgroundSize: '40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Top-left badge */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          left: '1.5rem',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.3)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        NO-G01 // BOOT SEQUENCE
      </div>

      {/* Top-right version */}
      <div
        style={{
          position: 'absolute',
          top: '1.5rem',
          right: '1.5rem',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: 'rgba(255,115,0,0.5)',
          letterSpacing: '0.1em',
        }}
      >
        v2.0
      </div>

      {/* Center content */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '2rem',
          width: '100%',
          maxWidth: '480px',
          padding: '0 2rem',
        }}
      >
        {/* Name — the one bold moment */}
        <div style={{ textAlign: 'center', lineHeight: 1 }}>
          <div
            style={{
              fontFamily: 'sans-serif',
              fontWeight: 900,
              fontSize: 'clamp(3.5rem, 12vw, 7rem)',
              color: '#ffffff',
              letterSpacing: '-0.04em',
              textTransform: 'uppercase',
              userSelect: 'none',
            }}
          >
            NOGUEIRA
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              fontSize: '10px',
              color: 'rgba(255,255,255,0.3)',
              letterSpacing: '0.25em',
              textTransform: 'uppercase',
              marginTop: '0.5rem',
            }}
          >
            MARCA PESSOAL DIGITAL
          </div>
        </div>

        {/* Progress bar */}
        <div
          style={{
            width: '100%',
            height: '1px',
            background: 'rgba(255,255,255,0.08)',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              height: '100%',
              width: `${progress}%`,
              background: 'linear-gradient(90deg, #ff7300, #facc15)',
              transition: 'width 80ms linear',
            }}
          />
          {/* Glow on the leading edge */}
          <div
            style={{
              position: 'absolute',
              top: '-2px',
              left: `calc(${progress}% - 6px)`,
              width: '12px',
              height: '5px',
              background: '#ff7300',
              filter: 'blur(4px)',
              opacity: progress > 2 ? 1 : 0,
              transition: 'left 80ms linear',
              borderRadius: '50%',
            }}
          />
        </div>

        {/* Boot log lines */}
        <div
          style={{
            width: '100%',
            fontFamily: 'monospace',
            fontSize: '11px',
            color: 'rgba(255,255,255,0.4)',
            letterSpacing: '0.05em',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.35rem',
            minHeight: '80px',
          }}
        >
          {visibleLines.map((line, i) => {
            const isLast = i === visibleLines.length - 1;
            const isDone = line === 'PRONTO.';
            return (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: isLast ? 1 : 0.5,
                  color: isDone ? '#ff7300' : undefined,
                  fontWeight: isDone ? 700 : undefined,
                  animation: 'ng-fadein 0.3s ease both',
                }}
              >
                <span style={{ color: '#ff7300', opacity: 0.6 }}>&gt;&gt;</span>
                {line}
                {/* blinking cursor on last line if not done */}
                {isLast && !isDone && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '12px',
                      background: '#ff7300',
                      animation: 'ng-blink 0.8s step-end infinite',
                      verticalAlign: 'middle',
                    }}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom-left location */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          left: '1.5rem',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: 'rgba(255,255,255,0.2)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}
      >
        SÃO PAULO, BRASIL
      </div>

      {/* Bottom-right percent */}
      <div
        style={{
          position: 'absolute',
          bottom: '1.5rem',
          right: '1.5rem',
          fontFamily: 'monospace',
          fontSize: '10px',
          color: 'rgba(255,115,0,0.6)',
          letterSpacing: '0.1em',
        }}
      >
        {Math.round(progress)}%
      </div>

      {/* Keyframe injection */}
      <style>{`
        @keyframes ng-fadein {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes ng-blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0; }
        }
      `}</style>
    </div>
  );
}