import { useEffect, useRef } from "react";

export default function ShockwaveLoader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let start: number | null = null;
    const duration = 3000; // clean 3× slower

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;

      const progress = Math.min((timestamp - start) / duration, 1);

      // slightly smoother than cubic, but not heavy
      const eased = 1 - Math.pow(1 - progress, 2.7);

      // MUST stay high to avoid skipping
      const radius = eased * 150;

      if (loaderRef.current) {
        loaderRef.current.style.setProperty("--progress", `${radius}%`);
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (loaderRef.current) {
          loaderRef.current.style.transition = "opacity 0.6s ease";
          loaderRef.current.style.opacity = "0";

          setTimeout(() => {
            loaderRef.current?.remove();
          }, 600);
        }
      }
    };

    requestAnimationFrame(animate);
  }, []);

  return (
    <div ref={loaderRef} className="loader">
      <div className="ring" />
    </div>
  );
}