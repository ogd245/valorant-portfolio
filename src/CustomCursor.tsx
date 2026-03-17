import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLImageElement>(null);
  const [isHover, setIsHover] = useState(false);

  // 👇 detect touch device
  const isTouch =
    typeof window !== "undefined" &&
    window.matchMedia("(hover: none) and (pointer: coarse)").matches;

  // 👇 STOP rendering on mobile
  if (isTouch) return null;

  useEffect(() => {
    let x = -100;
    let y = -100;

    const move = (e: MouseEvent) => {
      x = e.clientX;
      y = e.clientY;

      const el = document.elementFromPoint(x, y);

      if (
        el &&
        (el.closest("a, button") ||
          el.closest("[role='button']") ||
          (el as HTMLElement).onclick ||
          window.getComputedStyle(el).cursor === "pointer")
      ) {
        setIsHover(true);
      } else {
        setIsHover(false);
      }
    };

    const animate = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
      requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", move);
    animate();

    return () => {
      window.removeEventListener("mousemove", move);
    };
  }, []);

  return (
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
        transition:
          "width 0.15s ease, height 0.15s ease, filter 0.15s ease",
        filter: isHover
          ? "drop-shadow(0 0 8px #00f0ff) drop-shadow(0 0 20px #00f0ff)"
          : "none",
        zIndex: 9999,
        willChange: "transform",
      }}
    />
  );
}