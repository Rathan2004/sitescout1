"use client";
import { useEffect, useRef } from "react";

interface Ball {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
}

interface BouncingBallsProps {
  ballCount?: number;
  colors?: string[];
  minRadius?: number;
  maxRadius?: number;
  gravity?: number;
  friction?: number;
  mouseInteraction?: boolean;
  className?: string;
}

export function BouncingBalls({
  ballCount = 20,
  colors = ["#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"],
  minRadius = 10,
  maxRadius = 30,
  gravity = 0.5,
  friction = 0.99,
  mouseInteraction = true,
  className = "",
}: BouncingBallsProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const ballsRef = useRef<Ball[]>([]);
  const mouseRef = useRef({ x: 0, y: 0, radius: 100 });
  const animationFrameRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
      // Initialize balls
      ballsRef.current = [];
      for (let i = 0; i < ballCount; i++) {
        const radius = Math.random() * (maxRadius - minRadius) + minRadius;
        ballsRef.current.push({
          x: Math.random() * (canvas.width - radius * 2) + radius,
          y: Math.random() * (canvas.height - radius * 2) + radius,
          vx: (Math.random() - 0.5) * 4,
          vy: (Math.random() - 0.5) * 4,
          radius,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    };
    
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
    };

    if (mouseInteraction) {
      canvas.addEventListener("mousemove", handleMouseMove);
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      ballsRef.current.forEach((ball) => {
        // Apply gravity
        ball.vy += gravity;

        // Apply friction
        ball.vx *= friction;
        ball.vy *= friction;

        // Mouse interaction
        if (mouseInteraction) {
          const dx = mouseRef.current.x - ball.x;
          const dy = mouseRef.current.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < mouseRef.current.radius + ball.radius) {
            const angle = Math.atan2(dy, dx);
            const force = (mouseRef.current.radius + ball.radius - distance) / 10;
            ball.vx -= Math.cos(angle) * force;
            ball.vy -= Math.sin(angle) * force;
          }
        }

        // Update position
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Bounce off walls
        if (ball.x + ball.radius > canvas.width) {
          ball.x = canvas.width - ball.radius;
          ball.vx *= -0.8;
        } else if (ball.x - ball.radius < 0) {
          ball.x = ball.radius;
          ball.vx *= -0.8;
        }

        if (ball.y + ball.radius > canvas.height) {
          ball.y = canvas.height - ball.radius;
          ball.vy *= -0.8;
        } else if (ball.y - ball.radius < 0) {
          ball.y = ball.radius;
          ball.vy *= -0.8;
        }

        // Draw ball
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fillStyle = ball.color;
        ctx.fill();
        ctx.strokeStyle = "rgba(255, 255, 255, 0.3)";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas);
      if (mouseInteraction) {
        canvas.removeEventListener("mousemove", handleMouseMove);
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [ballCount, colors, minRadius, maxRadius, gravity, friction, mouseInteraction]);

  return (
    <canvas
      ref={canvasRef}
      className={`w-full h-full ${className}`}
      style={{ display: "block" }}
    />
  );
}