import React, { useRef, useEffect } from 'react';

interface LogoCanvasEffectProps {
  isHovering: boolean;
  mousePosition: { x: number; y: number };
  logoWidth: number;
  logoHeight: number;
}

type Particle = {
  baseX: number;
  baseY: number;
  x: number;
  y: number;
  radius: number;
  phase: number;
  speed: number;
  alpha: number;
};

const LogoCanvasEffect: React.FC<LogoCanvasEffectProps> = ({
  isHovering,
  mousePosition,
  logoWidth,
  logoHeight,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>();
  const hoverRef = useRef(isHovering);
  const mouseRef = useRef(mousePosition);
  const phaseRef = useRef(0);

  useEffect(() => {
    hoverRef.current = isHovering;
    mouseRef.current = mousePosition;
  }, [isHovering, mousePosition]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || logoWidth === 0 || logoHeight === 0) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = Math.max(1, logoWidth * dpr);
    canvas.height = Math.max(1, logoHeight * dpr);
    canvas.style.width = `${logoWidth}px`;
    canvas.style.height = `${logoHeight}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const particleCount = 52;
    const particles: Particle[] = Array.from({ length: particleCount }, () => ({
      baseX: Math.random() * logoWidth,
      baseY: Math.random() * logoHeight,
      x: 0,
      y: 0,
      radius: 0.9 + Math.random() * 2.2,
      phase: Math.random() * Math.PI * 2,
      speed: 0.007 + Math.random() * 0.01,
      alpha: 0.18 + Math.random() * 0.26,
    }));

    const gradient = ctx.createLinearGradient(0, logoHeight * 0.62, 0, logoHeight);
    gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
    gradient.addColorStop(1, 'rgba(0, 0, 0, 0.45)');

    const animate = () => {
      phaseRef.current += hoverRef.current ? 0.024 : 0.012;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, logoWidth, logoHeight);

      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, logoWidth, logoHeight);

      const mx = Math.max(0, Math.min(logoWidth, mouseRef.current.x));
      const my = Math.max(0, Math.min(logoHeight, mouseRef.current.y));
      const offsetX = ((mx / logoWidth) - 0.5) * 24;
      const offsetY = ((my / logoHeight) - 0.5) * 18;
      const speedFactor = hoverRef.current ? 1.4 : 0.9;

      particles.forEach((particle) => {
        particle.phase += particle.speed * speedFactor;
        particle.x = particle.baseX + Math.cos(particle.phase * 1.45) * 16 + offsetX * 0.9;
        particle.y = particle.baseY + Math.sin(particle.phase * 1.12) * 11 + offsetY * 0.9;
        const opacity = Math.min(1, particle.alpha + (hoverRef.current ? 0.14 : 0));

        ctx.beginPath();
        ctx.fillStyle = `rgba(255, 230, 170, ${opacity})`;
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.fillStyle = gradient;
      ctx.fillRect(0, logoHeight * 0.62, logoWidth, logoHeight * 0.38);

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animationFrameId.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameId.current) cancelAnimationFrame(animationFrameId.current);
    };
  }, [logoWidth, logoHeight]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-30 pointer-events-none"
      style={{ width: logoWidth, height: logoHeight }}
    />
  );
};

export default LogoCanvasEffect;
