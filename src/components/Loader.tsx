import { useEffect, useRef } from "react";

export default function Loader() {
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let start: number | null = null;
    const duration = 2000;

    const animate = (timestamp: number) => {
      if (!start) start = timestamp;

      const progress = Math.min((timestamp - start) / duration, 1);

      const eased = 1 - Math.pow(1 - progress, 2.7);
      const radius = eased * 150;

      if (loaderRef.current) {
        loaderRef.current.style.setProperty("--progress", `${radius}%`);
        loaderRef.current.style.setProperty("--distort", `${1 - progress}`);
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
      {/* SVG DISTORTION FILTER */}
      <svg className="distortion-svg">
        <filter id="distortion">
          <feTurbulence
            type="turbulence"
            baseFrequency="0.01"
            numOctaves="2"
            result="turbulence"
          />
          <feDisplacementMap
            in="SourceGraphic"
            in2="turbulence"
            scale="40"
            xChannelSelector="R"
            yChannelSelector="G"
          />
        </filter>
      </svg>

      <div className="ring" />
      <div className="ring secondary" />
    </div>
  );
}
