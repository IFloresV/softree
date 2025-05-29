import React, { useRef, useEffect } from "react";

const MOLECULES = 40;
const RADIUS = 3;
const LINE_DIST = 120;

function random(min: number, max: number) {
   return Math.random() * (max - min) + min;
}

const MoleculesBg: React.FC = () => {
   const canvasRef = useRef<HTMLCanvasElement>(null);

   useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let width = window.innerWidth;
      let height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;

      const handleResize = () => {
         width = window.innerWidth;
         height = window.innerHeight;
         canvas.width = width;
         canvas.height = height;
      };
      window.addEventListener("resize", handleResize);

      const particles = Array.from({ length: MOLECULES }, () => ({
         x: random(0, width),
         y: random(0, height),
         vx: random(-0.5, 0.5),
         vy: random(-0.5, 0.5),
      }));

      function draw() {
         ctx.clearRect(0, 0, width, height);

         // Draw lines
         for (let i = 0; i < MOLECULES; i++) {
            for (let j = i + 1; j < MOLECULES; j++) {
               const dx = particles[i].x - particles[j].x;
               const dy = particles[i].y - particles[j].y;
               const dist = Math.sqrt(dx * dx + dy * dy);
               if (dist < LINE_DIST) {
                  ctx.strokeStyle = "rgba(164, 118, 255, 0.15)";
                  ctx.lineWidth = 1;
                  ctx.beginPath();
                  ctx.moveTo(particles[i].x, particles[i].y);
                  ctx.lineTo(particles[j].x, particles[j].y);
                  ctx.stroke();
               }
            }
         }

         // Draw particles
         for (const p of particles) {
            ctx.beginPath();
            ctx.arc(p.x, p.y, RADIUS, 0, Math.PI * 2);
            ctx.fillStyle = "#1b5e20";
            ctx.shadowColor = "#0d2818";
            ctx.shadowBlur = 8;
            ctx.fill();
            ctx.shadowBlur = 0;
         }
      }

      function animate() {
         for (const p of particles) {
            p.x += p.vx;
            p.y += p.vy;
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
         }
         draw();
         requestAnimationFrame(animate);
      }

      animate();

      return () => {
         window.removeEventListener("resize", handleResize);
      };
   }, []);

   return (
      <canvas
         ref={canvasRef}
         style={{
            position: "fixed",
            top: 0,
            left: 0,
            zIndex: 0,
            width: "100vw",
            height: "100vh",
            pointerEvents: "none",
         }}
      />
   );
};

export default MoleculesBg;
