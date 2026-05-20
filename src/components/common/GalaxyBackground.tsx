import React, { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  targetAlpha: number;
  speed: number;
  dx: number;
  dy: number;
  color: string;
}

interface ShootingStar {
  x: number;
  y: number;
  dx: number;
  dy: number;
  length: number;
  speed: number;
  alpha: number;
  active: boolean;
}

interface Nebula {
  x: number;
  y: number;
  radius: number;
  color: string;
  angle: number;
  speed: number;
  distance: number;
}

export const GalaxyBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: 0, y: 0, targetX: 0, targetY: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Initialize Star properties
    const stars: Star[] = [];
    const starCount = Math.floor((width * height) / 8000); // Dense but scalable count
    const starColors = [
      'rgba(255, 255, 255, ',
      'rgba(173, 216, 230, ', // Light Blue
      'rgba(216, 191, 216, ', // Thistle/Light Purple
      'rgba(255, 244, 224, ', // Soft Warm White
    ];

    for (let i = 0; i < starCount; i++) {
      stars.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 1.5 + 0.5,
        alpha: Math.random(),
        targetAlpha: Math.random() * 0.8 + 0.2,
        speed: Math.random() * 0.015 + 0.005,
        dx: (Math.random() - 0.5) * 0.08,
        dy: (Math.random() - 0.5) * 0.08,
        color: starColors[Math.floor(Math.random() * starColors.length)],
      });
    }

    // Initialize Nebulae for space clouds look
    const nebulae: Nebula[] = [
      {
        x: width * 0.3,
        y: height * 0.4,
        radius: Math.min(width, height) * 0.4,
        color: 'hsla(260, 40%, 15%, 0.35)', // Soft purple-indigo
        angle: Math.random() * Math.PI * 2,
        speed: 0.0003,
        distance: 80,
      },
      {
        x: width * 0.7,
        y: height * 0.6,
        radius: Math.min(width, height) * 0.5,
        color: 'hsla(190, 45%, 12%, 0.3)', // Soft cyan-teal
        angle: Math.random() * Math.PI * 2,
        speed: 0.00018,
        distance: 120,
      },
      {
        x: width * 0.5,
        y: height * 0.3,
        radius: Math.min(width, height) * 0.35,
        color: 'hsla(320, 35%, 14%, 0.25)', // Soft magenta-rose
        angle: Math.random() * Math.PI * 2,
        speed: 0.00025,
        distance: 90,
      },
    ];

    // Initialize Shooting Stars
    const shootingStars: ShootingStar[] = Array.from({ length: 2 }, () => ({
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      length: 0,
      speed: 0,
      alpha: 0,
      active: false,
    }));

    const launchShootingStar = (ss: ShootingStar) => {
      ss.x = Math.random() * width;
      ss.y = Math.random() * (height * 0.5);
      const angle = Math.PI / 6 + Math.random() * (Math.PI / 12); // around 30-45 degrees
      ss.speed = Math.random() * 8 + 6;
      ss.dx = Math.cos(angle) * ss.speed;
      ss.dy = Math.sin(angle) * ss.speed;
      ss.length = Math.random() * 80 + 50;
      ss.alpha = 1;
      ss.active = true;
    };

    // Resize handler
    const handleResize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      
      // Readjust star positions
      stars.forEach(star => {
        if (star.x > width) star.x = Math.random() * width;
        if (star.y > height) star.y = Math.random() * height;
      });
      
      nebulae[0].radius = Math.min(width, height) * 0.45;
      nebulae[1].radius = Math.min(width, height) * 0.5;
      nebulae[2].radius = Math.min(width, height) * 0.35;
    };

    window.addEventListener('resize', handleResize);

    // Mouse movement inside canvas for parallax
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.targetX = (e.clientX - width / 2) * 0.025;
      mouseRef.current.targetY = (e.clientY - height / 2) * 0.025;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Animation loop
    const render = () => {
      // Clear with dark space backdrop
      ctx.fillStyle = '#02020a'; // incredibly rich dark cosmos violet/gray
      ctx.fillRect(0, 0, width, height);

      // Smooth mouse movement interpolation
      const mouse = mouseRef.current;
      mouse.x += (mouse.targetX - mouse.x) * 0.06;
      mouse.y += (mouse.targetY - mouse.y) * 0.06;

      // 1. Draw Nebulae Space Clouds
      nebulae.forEach(nebula => {
        nebula.angle += nebula.speed;
        
        // Circular orbit drift
        const offsetX = Math.cos(nebula.angle) * nebula.distance;
        const offsetY = Math.sin(nebula.angle) * nebula.distance;
        const currentX = nebula.x + offsetX + mouse.x * 1.5;
        const currentY = nebula.y + offsetY + mouse.y * 1.5;

        const gradient = ctx.createRadialGradient(
          currentX,
          currentY,
          10,
          currentX,
          currentY,
          nebula.radius
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(currentX, currentY, nebula.radius, 0, Math.PI * 2);
        ctx.fill();
      });

      // 2. Draw Stars
      stars.forEach(star => {
        // Star movement drift
        star.x += star.dx;
        star.y += star.dy;

        // Apply mouse movement parallax (different multiplier for dimension or depth)
        const parallaxX = mouse.x * (star.size * 0.4);
        const parallaxY = mouse.y * (star.size * 0.4);

        let finalX = star.x + parallaxX;
        let finalY = star.y + parallaxY;

        // Wrap around boundaries
        if (finalX < 0) {
          star.x = width;
          finalX = width;
        } else if (finalX > width) {
          star.x = 0;
          finalX = 0;
        }

        if (finalY < 0) {
          star.y = height;
          finalY = height;
        } else if (finalY > height) {
          star.y = 0;
          finalY = 0;
        }

        // Twinkle effect (fade in/out smoothly)
        star.alpha += (star.targetAlpha - star.alpha) * star.speed;
        if (Math.abs(star.alpha - star.targetAlpha) < 0.05) {
          star.targetAlpha = Math.random() * 0.8 + 0.1;
        }

        // Draw star
        ctx.fillStyle = `${star.color}${star.alpha})`;
        ctx.beginPath();
        ctx.arc(finalX, finalY, star.size, 0, Math.PI * 2);
        ctx.fill();

        // Subtle glowing core for brighter stars
        if (star.size > 1.6 && star.alpha > 0.6) {
          ctx.shadowBlur = 4;
          ctx.shadowColor = '#ffffff';
          ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha * 0.6})`;
          ctx.beginPath();
          ctx.arc(finalX, finalY, star.size * 0.4, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0; // reset
        }
      });

      // 3. Draw Shooting Stars
      shootingStars.forEach(ss => {
        if (ss.active) {
          ss.x += ss.dx;
          ss.y += ss.dy;
          ss.alpha -= 0.015;

          if (ss.alpha <= 0 || ss.x > width || ss.y > height) {
            ss.active = false;
          } else {
            // Setup gradient trail
            const trailGrad = ctx.createLinearGradient(
              ss.x,
              ss.y,
              ss.x - ss.dx * 0.8,
              ss.y - ss.dy * 0.8
            );
            trailGrad.addColorStop(0, `rgba(255, 255, 255, ${ss.alpha})`);
            trailGrad.addColorStop(0.3, `rgba(147, 197, 253, ${ss.alpha * 0.6})`); // cosmic blue streak
            trailGrad.addColorStop(1, 'rgba(0, 0, 0, 0)');

            ctx.lineWidth = 1.5;
            ctx.strokeStyle = trailGrad;
            ctx.beginPath();
            ctx.moveTo(ss.x, ss.y);
            ctx.lineTo(ss.x - ss.dx * 0.8, ss.y - ss.dy * 0.8);
            ctx.stroke();
          }
        } else {
          // Launch opportunity
          if (Math.random() < 0.001) {
            launchShootingStar(ss);
          }
        }
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 transition-opacity duration-1000"
      style={{ mixBlendMode: 'screen', opacity: 0.95 }}
    />
  );
};
