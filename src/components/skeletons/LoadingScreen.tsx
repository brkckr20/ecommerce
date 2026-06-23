"use client";

import { useState, useEffect } from "react";

export function LoadingScreen() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    >
      <h1 className="text-4xl md:text-5xl font-bold font-heading text-heading tracking-wider flex">
        {"Somni".split("").map((letter, i) => (
          <span
            key={i}
            className="inline-block animate-letter-pop"
            style={{ animationDelay: `${i * 0.5}s` }}
          >
            {letter}
          </span>
        ))}
      </h1>
    </div>
  );
}
