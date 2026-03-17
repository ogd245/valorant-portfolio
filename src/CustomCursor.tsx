import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLImageElement>(null);
  const slashRef = useRef<HTMLDivElement>(null);

  const [isHover, setIsHover] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      const x = e.clientX;
      const y = e.clientY;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x}px, ${y}px)`;
      }

      const el = document.elementFromPoint(x, y);

      if (
        el &&
        (
          el.closest("a, button") ||
          el.closest("[role='button']") ||
          (el as HTMLElement).onclick ||
          window.getComputedStyle(el).cursor === "pointer"
        )
      ) {
        setIsHover(true);
      } else {
        setIsHover(false);
      }
    };

    const down = (e: MouseEvent) => {
      if (slashRef.current) {
        const x = e.clientX;
        const y = e.clientY;

        slashRef.current.style.left = `${x}px`;
        slashRef.current.style.top = `${y}px`;
        slashRef.current.style.opacity = "1";

        slashRef.current.animate(
          [
            { transform: "translate(-30px, -2px) rotate(-25deg) scaleX(0.5)", opacity: 1 },
            { transform: "translate(-30px, -2px) rotate(-25deg) scaleX(1.5)", opacity: 0 }
          ],
          { duration: 200, easing: "ease-out" }
        );
      }
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mousedown", down);

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mousedown", down);
    };
  }, []);

  return (
    <>
      {/* Cursor */}
      <img
        ref={cursorRef}
        src="/jett-knife.png"
        alt=""
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isHover ? "42px" : "32px",
          height: isHover ? "42px" : "32px",
          pointerEvents: "none",
          transform: "translate(-100px, -100px)",
          transition: "width 0.15s ease, height 0.15s ease, filter 0.15s ease",
          filter: isHover
            ? "drop-shadow(0 0 8px #00f0ff) drop-shadow(0 0 20px #00f0ff)"
            : "none",
          zIndex: 9999,
        }}
      />

      {/* Slash */}
      <div
        ref={slashRef}
        style={{
          position: "fixed",
          width: "60px",
          height: "4px",
          background: "linear-gradient(90deg, transparent, #00f0ff, transparent)",
          transform: "translate(-30px, -2px) rotate(-25deg)",
          pointerEvents: "none",
          opacity: 0,
          zIndex: 9998,
        }}
      />
    </>
  );
}