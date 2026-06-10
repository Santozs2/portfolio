import { useEffect, useState, useRef } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [coords, setCoords] = useState({ clientX: 0, clientY: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setCoords({ clientX: e.clientX, clientY: e.clientY });
      setIsVisible(true);
      
      // Select interactive tags to adjust cursor size
      const target = e.target as HTMLElement;
      const isInteractive = target && (
        target.closest('a') || 
        target.closest('button') || 
        target.closest('[role="button"]') ||
        target.closest('.interactive-node') ||
        target.classList.contains('interactive')
      );
      setIsHovered(!!isInteractive);
    };

    const handleMouseDown = () => setIsClicking(true);
    const handleMouseUp = () => setIsClicking(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mouseup', handleMouseUp);
    document.body.addEventListener('mouseleave', handleMouseLeave);
    document.body.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.body.removeEventListener('mouseleave', handleMouseLeave);
      document.body.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, []);

  // Use a smooth follow
  const coordsRef = useRef(coords);

  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

  useEffect(() => {
    let animationFrameId: number;

    const updatePosition = () => {
      setPosition(prev => {
        const dx = coordsRef.current.clientX - prev.x;
        const dy = coordsRef.current.clientY - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationFrameId = requestAnimationFrame(updatePosition);
    };

    animationFrameId = requestAnimationFrame(updatePosition);
    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="hidden lg:block pointer-events-none fixed inset-0 z-50">
      {/* Target Dot */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 rounded-full bg-orange-500 transition-transform duration-200"
        style={{
          left: `${coords.clientX}px`,
          top: `${coords.clientY}px`,
          width: isClicking ? '4px' : '6px',
          height: isClicking ? '4px' : '6px',
        }}
      />

      {/* Lagging Ring with crosshairs */}
      <div
        className="fixed -translate-x-1/2 -translate-y-1/2 transition-colors duration-300 flex items-center justify-center"
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        <div 
          className={`relative border rounded-full transition-all duration-300 flex items-center justify-center ${
            isHovered 
              ? 'border-orange-500 bg-orange-500/5 w-12 h-12 rotate-45 scale-110' 
              : 'border-white/20 w-8 h-8 rotate-0 scale-100'
          }`}
        >
          {/* Subtle crosshair notches */}
          <span className={`absolute bg-white/40 transition-colors duration-300 ${isHovered ? 'bg-orange-500' : ''}`} style={{ width: '4px', height: '1px', left: '-2px' }} />
          <span className={`absolute bg-white/40 transition-colors duration-300 ${isHovered ? 'bg-orange-500' : ''}`} style={{ width: '4px', height: '1px', right: '-2px' }} />
          <span className={`absolute bg-white/40 transition-colors duration-300 ${isHovered ? 'bg-orange-500' : ''}`} style={{ height: '4px', width: '1px', top: '-2px' }} />
          <span className={`absolute bg-white/40 transition-colors duration-300 ${isHovered ? 'bg-orange-500' : ''}`} style={{ height: '4px', width: '1px', bottom: '-2px' }} />
        </div>
      </div>
    </div>
  );
}
