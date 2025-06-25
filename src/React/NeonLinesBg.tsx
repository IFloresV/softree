import React, { useRef, useEffect } from "react";

const NeonLinesBg: React.FC = () => {
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

      // Líneas con control de movimiento
      const lines = [
         {
            phase: 0,
            color: "#00f9ff", // azul neón
            speed: 0.01,
            amplitude: 60,
            thickness: 2,
         },
         {
            phase: Math.PI,
            color: "#f500ff", // rosa neón
            speed: 0.008,
            amplitude: 80,
            thickness: 2,
         },
      ];

      function draw() {
         ctx.clearRect(0, 0, width, height);

         lines.forEach((line) => {
            ctx.beginPath();
            for (let x = 0; x < width; x++) {
               const y = height / 2 + Math.sin(x * 0.01 + line.phase) * line.amplitude;
               if (x === 0) ctx.moveTo(x, y);
               else ctx.lineTo(x, y);
            }

            ctx.strokeStyle = line.color;
            ctx.lineWidth = line.thickness;
            ctx.shadowColor = line.color;
            ctx.shadowBlur = 20;
            ctx.stroke();
            ctx.shadowBlur = 0;
         });
      }

      function animate() {
         lines.forEach((line) => {
            line.phase += line.speed;
         });
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

export default NeonLinesBg;
