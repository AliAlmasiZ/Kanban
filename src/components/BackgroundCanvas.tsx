import { use, useEffect, useRef } from 'react';


interface BlobInterface {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  color: string;
  update(canvasWidth: number, canvasHeight: number): void;
  draw(ctx: CanvasRenderingContext2D): void;
}

const COLORS = ['#a955f7', '#3b82f6', '#3de073', '#d1c95e'];

class Blob implements BlobInterface {
  x: number;
  y: number;
  velocityX: number;
  velocityY: number;
  radius: number;
  color: string;

  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = Math.random() * window.innerHeight;
    this.velocityX = (Math.random() - 0.5) * 1;
    this.velocityY = (Math.random() - 0.5) * 1;
    this.radius = Math.random() * 20;
    const randColor = COLORS[Math.floor(Math.random() * COLORS.length)];
    const r = parseInt(randColor.slice(1, 3), 16);
    const g = parseInt(randColor.slice(3, 5), 16);
    const b = parseInt(randColor.slice(5, 7), 16);
    this.color = `${r},${g},${b}`;
  }

  update(canvasWidth: number, canvasHeight: number) {
    if (this.x > canvasWidth || this.x < 0) this.velocityX = -this.velocityX;
    if (this.y > canvasHeight || this.y < 0) this.velocityY = -this.velocityY;
    this.x += this.velocityX;
    this.y += this.velocityY;
  }

  draw(ctx: CanvasRenderingContext2D) {
    const gradient = ctx.createRadialGradient(
      this.x,
      this.y,
      0,
      this.x,
      this.y,
      this.radius
    );
    gradient.addColorStop(0, `rgba(${this.color}, 0.8)`);
    gradient.addColorStop(0.6, `rgba(${this.color}, 0.2)`);
    gradient.addColorStop(1, `rgba(${this.color}, 0)`);

    ctx.beginPath();
    ctx.fillStyle = gradient;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

export default function BackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const rafRef = useRef<number | null>(0);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    function initBlobs() {
      blobsRef.current.length = 0; // Clear existing blobs
      const blobsCount = Math.floor((canvas.width * canvas.height) / 15000);
      for (let i = 0; i < blobsCount; i++) {
        blobsRef.current.push(new Blob());
      }
    }

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      blobsRef.current.forEach((b) => {
        b.update(canvas.width, canvas.height);
        b.draw(ctx);
      });
      rafRef.current = requestAnimationFrame(animate);
    };

    function handleResize() {
      resizeCanvas();
      initBlobs();
    }

    window.addEventListener('resize', handleResize);

    resizeCanvas();
    initBlobs();
    animate();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <canvas ref={canvasRef} className="fixed inset-0 -z-10 bg-slate-950" />
  );
}
