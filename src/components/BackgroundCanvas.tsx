import React, { useEffect, useRef } from 'react';

interface FloatingDisc {
  x: number;
  y: number;
  z: number;
  radius: number;
  tiltAngle: number;
  rotationSpeed: number;
  vx: number;
  vy: number;
  color: string;
  glowColor: string;
  opacity: number;
}

interface VolumetricStone {
  x: number;
  y: number;
  z: number;
  size: number;
  sides: number;
  angle: number;
  angularVelocity: number;
  vx: number;
  vy: number;
  points: { r: number; angle: number }[];
  shade: number;
}

export const BackgroundCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // 1. Generate 3D Luminous Discs (Pristine, no static grid)
    const discCount = width < 768 ? 10 : 18;
    const discs: FloatingDisc[] = [];
    const discPalette = [
      { color: 'rgba(90, 59, 140, ', glow: 'rgba(139, 124, 199, 0.45)' },
      { color: 'rgba(139, 124, 199, ', glow: 'rgba(201, 194, 227, 0.55)' },
      { color: 'rgba(42, 30, 77, ', glow: 'rgba(139, 124, 199, 0.3)' },
      { color: 'rgba(201, 194, 227, ', glow: 'rgba(255, 255, 255, 0.6)' },
    ];

    for (let i = 0; i < discCount; i++) {
      const p = discPalette[Math.floor(Math.random() * discPalette.length)];
      discs.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.7 + 0.3,
        radius: Math.random() * 45 + 20,
        tiltAngle: Math.random() * Math.PI,
        rotationSpeed: (Math.random() - 0.5) * 0.008,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        color: p.color,
        glowColor: p.glow,
        opacity: Math.random() * 0.4 + 0.15
      });
    }

    // 2. Generate Volumetric Floating Stones
    const stoneCount = width < 768 ? 8 : 16;
    const stones: VolumetricStone[] = [];

    for (let i = 0; i < stoneCount; i++) {
      const sides = Math.floor(Math.random() * 3) + 5; // 5 to 7 vertices for crystal/stone shape
      const baseSize = Math.random() * 26 + 12;
      const points: { r: number; angle: number }[] = [];
      for (let s = 0; s < sides; s++) {
        const a = (s / sides) * Math.PI * 2;
        const rVariation = baseSize * (0.75 + Math.random() * 0.5);
        points.push({ r: rVariation, angle: a });
      }

      stones.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: Math.random() * 0.8 + 0.4,
        size: baseSize,
        sides,
        angle: Math.random() * Math.PI * 2,
        angularVelocity: (Math.random() - 0.5) * 0.006,
        vx: (Math.random() - 0.5) * 0.25,
        vy: (Math.random() - 0.5) * 0.25,
        points,
        shade: Math.random() * 30 + 15
      });
    }

    // Mouse Interaction Physics
    const mouse = { x: -2000, y: -2000, radius: 180 };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    const handleMouseLeave = () => {
      mouse.x = -2000;
      mouse.y = -2000;
    };

    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });
    window.addEventListener('resize', handleResize, { passive: true });

    // Main 60FPS Render Pipeline
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Deep Luxury Cyber-Purple Gradient: #0E0B1D -> #2A1E4D -> #3A3A52
      const bgGrad = ctx.createRadialGradient(
        width * 0.5,
        height * 0.25,
        40,
        width * 0.5,
        height * 0.5,
        Math.max(width, height) * 0.85
      );
      bgGrad.addColorStop(0, '#2A1E4D');
      bgGrad.addColorStop(0.45, '#1A1435');
      bgGrad.addColorStop(0.8, '#0E0B1D');
      bgGrad.addColorStop(1, '#07050F');

      ctx.fillStyle = bgGrad;
      ctx.fillRect(0, 0, width, height);

      // Render Floating 3D Luminous Discs (Volumetric Ellipses)
      for (const disc of discs) {
        disc.x += disc.vx;
        disc.y += disc.vy;
        disc.tiltAngle += disc.rotationSpeed;

        if (disc.x < -disc.radius) disc.x = width + disc.radius;
        if (disc.x > width + disc.radius) disc.x = -disc.radius;
        if (disc.y < -disc.radius) disc.y = height + disc.radius;
        if (disc.y > height + disc.radius) disc.y = -disc.radius;

        // Subtle interactive mouse repulsion
        const dx = disc.x - mouse.x;
        const dy = disc.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius && dist > 1) {
          const force = ((mouse.radius - dist) / mouse.radius) * 1.2;
          disc.x += (dx / dist) * force;
          disc.y += (dy / dist) * force;
        }

        // Draw 3D tilted disc
        ctx.save();
        ctx.translate(disc.x, disc.y);
        ctx.rotate(disc.tiltAngle);

        const rx = disc.radius * disc.z;
        const ry = disc.radius * 0.38 * disc.z;

        // Glowing outer aura
        ctx.beginPath();
        ctx.ellipse(0, 0, rx * 1.2, ry * 1.2, 0, 0, Math.PI * 2);
        ctx.fillStyle = disc.glowColor;
        ctx.filter = 'blur(10px)';
        ctx.fill();
        ctx.filter = 'none';

        // Disc Core
        ctx.beginPath();
        ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
        const discGradient = ctx.createLinearGradient(-rx, -ry, rx, ry);
        discGradient.addColorStop(0, `${disc.color}${disc.opacity * 1.5})`);
        discGradient.addColorStop(0.5, `${disc.color}${disc.opacity * 0.7})`);
        discGradient.addColorStop(1, 'rgba(14, 11, 29, 0.2)');
        ctx.fillStyle = discGradient;
        ctx.fill();

        // Rim Specular Highlight
        ctx.lineWidth = 1.2;
        ctx.strokeStyle = `rgba(201, 194, 227, ${disc.opacity * 0.9})`;
        ctx.stroke();

        ctx.restore();
      }

      // Render Volumetric Drifting Stones (Faceted 3D Rocks)
      for (const stone of stones) {
        stone.x += stone.vx;
        stone.y += stone.vy;
        stone.angle += stone.angularVelocity;

        if (stone.x < -stone.size * 2) stone.x = width + stone.size * 2;
        if (stone.x > width + stone.size * 2) stone.x = -stone.size * 2;
        if (stone.y < -stone.size * 2) stone.y = height + stone.size * 2;
        if (stone.y > height + stone.size * 2) stone.y = -stone.size * 2;

        const dx = stone.x - mouse.x;
        const dy = stone.y - mouse.y;
        const dist = Math.hypot(dx, dy);
        if (dist < mouse.radius && dist > 1) {
          const force = ((mouse.radius - dist) / mouse.radius) * 1.5;
          stone.x += (dx / dist) * force;
          stone.y += (dy / dist) * force;
        }

        ctx.save();
        ctx.translate(stone.x, stone.y);
        ctx.rotate(stone.angle);
        ctx.scale(stone.z, stone.z);

        // Stone Base Silhouette
        ctx.beginPath();
        for (let i = 0; i < stone.points.length; i++) {
          const pt = stone.points[i];
          const px = Math.cos(pt.angle) * pt.r;
          const py = Math.sin(pt.angle) * pt.r;
          if (i === 0) ctx.moveTo(px, py);
          else ctx.lineTo(px, py);
        }
        ctx.closePath();

        // Volumetric shaded face
        const stoneGrad = ctx.createLinearGradient(
          -stone.size,
          -stone.size,
          stone.size,
          stone.size
        );
        stoneGrad.addColorStop(0, `rgba(139, 124, 199, 0.35)`);
        stoneGrad.addColorStop(0.5, `rgba(58, 58, 82, 0.45)`);
        stoneGrad.addColorStop(1, `rgba(14, 11, 29, 0.75)`);
        ctx.fillStyle = stoneGrad;
        ctx.fill();

        // Facet lines connecting to a faux 3D center apex
        ctx.strokeStyle = 'rgba(201, 194, 227, 0.2)';
        ctx.lineWidth = 0.8;
        const apexX = -stone.size * 0.2;
        const apexY = -stone.size * 0.2;

        for (const pt of stone.points) {
          const px = Math.cos(pt.angle) * pt.r;
          const py = Math.sin(pt.angle) * pt.r;
          ctx.beginPath();
          ctx.moveTo(apexX, apexY);
          ctx.lineTo(px, py);
          ctx.stroke();
        }

        // Specular highlight on top apex
        ctx.beginPath();
        ctx.arc(apexX, apexY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.shadowColor = 'rgba(201, 194, 227, 0.8)';
        ctx.shadowBlur = 6;
        ctx.fill();
        ctx.shadowBlur = 0;

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0"
      style={{ width: '100vw', height: '100vh' }}
    />
  );
};
