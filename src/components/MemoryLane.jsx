import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import Memmory1 from "../assets/1.png";
import Memmory2 from "../assets/2.jpg";
import Memmory3 from "../assets/3.jpg";
import Memmory4 from "../assets/4.jpg";
import Memmory5 from "../assets/5.png";
import Memmory6 from "../assets/6.png";
import Memmory7 from "../assets/7.jpg";

const memories = [
  {
    id: 1,
    src: Memmory1,
    caption: "Cuteness at its peak",
  },
  {
    id: 2,
    src: Memmory2,
    caption: "That first passport size photo",
  },
  {
    id: 3,
    src: Memmory3,
    caption: "Good old School Days",
  },
  {
    id: 4,
    src: Memmory4,
    caption: "Soon hitting Puberty",
  },
  {
    id: 5,
    src: Memmory5,
    caption: "The Lockdown Mode",
  },
  {
    id: 6,
    src: Memmory6,
    caption: "That Memorable Graduation Day",
  },
  {
    id: 7,
    src: Memmory7,
    caption: "The Handsome Hunk",
  },
  {
    id: 8,
    src: "https://placehold.co/400x300/f0e1c8/333?text=Memory+8",
    caption: "",
  },
];

const POSITIONS = ["right", "center", "left", "center"];
const X_MAP = { right: 78, center: 50, left: 22 };

const buildPath = () => {
  const sectionCount = memories.length + 1;
  const svgH = sectionCount * 100;
  let d = "M 50 50";

  memories.forEach((_, i) => {
    const x = X_MAP[POSITIONS[i % 4]];
    const y = (i + 1) * 100 + 50;
    const prevX = i === 0 ? 50 : X_MAP[POSITIONS[(i - 1) % 4]];
    const prevY = i === 0 ? 50 : i * 100 + 50;
    d += ` C ${prevX} ${prevY + 35}, ${x} ${y - 35}, ${x} ${y}`;
  });

  return { d, svgH, sectionCount };
};

const TITLE_TEXT = "Let's go back in the memory lane.";

const MemoryLane = () => {
  const cardsRef = useRef([]);
  const scrollRef = useRef(null);
  const hasNavigatedRef = useRef(false);
  const navigate = useNavigate();
  const { d: pathD, svgH, sectionCount } = buildPath();
  const [displayedText, setDisplayedText] = useState("");
  const [typingDone, setTypingDone] = useState(false);

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setDisplayedText(TITLE_TEXT.slice(0, i));
      if (i >= TITLE_TEXT.length) {
        clearInterval(interval);
        setTypingDone(true);
      }
    }, 70);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    let rafId = null;

    const updateCardsOnScroll = () => {
      const containerRect = container.getBoundingClientRect();

      cardsRef.current.forEach((card) => {
        if (!card) return;

        const cardRect = card.getBoundingClientRect();
        const isPartiallyVisible =
          cardRect.bottom > containerRect.top &&
          cardRect.top < containerRect.bottom;
        const isFullyVisible =
          cardRect.top >= containerRect.top &&
          cardRect.bottom <= containerRect.bottom;

        card.classList.toggle("memory-revealed", isPartiallyVisible);
        card.classList.toggle("isblurred", !isFullyVisible);
      });

      const lastCard = cardsRef.current[memories.length - 1];
      if (!lastCard) return;

      const lastCardRect = lastCard.getBoundingClientRect();
      const visibleTop = Math.max(lastCardRect.top, containerRect.top);
      const visibleBottom = Math.min(lastCardRect.bottom, containerRect.bottom);
      const visibleHeight = Math.max(0, visibleBottom - visibleTop);
      const visibleRatio = visibleHeight / lastCardRect.height;
      const isAtBottom =
        container.scrollTop + container.clientHeight >=
        container.scrollHeight - 300;

      console.log(visibleRatio, isAtBottom);

      if (visibleRatio >= 0.8 && isAtBottom && !hasNavigatedRef.current) {
        hasNavigatedRef.current = true;
        navigate("/reveal");
      }
    };

    const onScroll = () => {
      if (rafId) return;

      rafId = requestAnimationFrame(() => {
        updateCardsOnScroll();
        rafId = null;
      });
    };

    container.addEventListener("scroll", onScroll, { passive: true });
    updateCardsOnScroll();

    return () => {
      container.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [typingDone, navigate]);

  return (
    <div
      ref={scrollRef}
      className="memory-lane-page h-screen overflow-y-auto py-[100px] overflow-x-hidden snap-y snap-mandatory bg-[var(--color-primary)] relative"
    >
      {/* Title section */}
      <section className="h-auto snap-center flex items-center justify-center px-6 pb-[100px] shrink-0">
        <h1 className="memory-lane-title font-lobster text-[42px]/[48px] text-center">
          {displayedText}
          <span className="typewriter-cursor">|</span>
        </h1>
      </section>

      {/* Connecting road path */}
      <svg
        className="absolute top-0 left-0 w-full pointer-events-none z-0"
        style={{ height: `calc(100vh + ${memories.length * 45}vh)` }}
        viewBox={`0 11 100 ${svgH + 100}`}
        preserveAspectRatio="none"
      >
        <path
          d={pathD}
          stroke="rgba(0,0,0,0.13)"
          fill="none"
          strokeWidth="2"
          strokeDasharray="8 6"
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      {/* Card sections */}
      {typingDone &&
        memories.map((memory, index) => {
          const posClass = `memory-card-${POSITIONS[index % 4]}`;
          return (
            <section
              key={memory.id}
              className="h-[50vh] sm:h-[45vh] snap-center flex items-center px-6"
            >
              <div className="mx-auto max-w-[900px] w-full flex flex-col">
                <div
                  ref={(el) => (cardsRef.current[index] = el)}
                  className={`memory-card ${posClass} z-10`}
                  style={index === 7 ? { opacity: 0 } : {}}
                >
                  <div className="memory-card-inner rounded-2xl overflow-hidden shadow-xl bg-white">
                    <img
                      src={memory.src}
                      alt={memory.caption}
                      className="memory-card-img w-full h-[220px] sm:h-[260px] object-cover object-top"
                    />
                    <p className="font-poppins text-[18px]/[26px] font-medium text-gray-700 px-5 py-4 text-center">
                      {memory.caption}
                    </p>
                  </div>
                </div>
              </div>
            </section>
          );
        })}
    </div>
  );
};

export default MemoryLane;
