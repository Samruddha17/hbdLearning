import React, { useState, useEffect, useCallback, useRef } from "react";
import Confetti from "react-confetti";
import cakeImg from "../assets/cake.png";
import hbdBackground from "../assets/hbd1.webp";
import tableImg from "../assets/table.png";
import hbdAudio from "../assets/hbd.mp3";

// Single Candle SVG - with optional flame
const CandleSVG = ({ showFlame = true }) => (
  <svg
    width="40"
    height="70"
    viewBox="0 0 40 70"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Candle body */}
    <rect x="12" y="32" width="16" height="38" rx="3" fill="#FFD700" />
    <rect x="12" y="32" width="5" height="38" fill="#FFC700" rx="2" />
    {/* Wick */}
    <rect x="18" y="22" width="3" height="12" fill="#4A4A4A" />
    {/* Flame - with flicker animation */}
    {showFlame && (
      <g
        className="animate-flame-flicker"
        style={{ transformOrigin: "20px 14px" }}
      >
        <ellipse cx="20" cy="12" rx="8" ry="14" fill="#FF6B35" />
        <ellipse cx="20" cy="9" rx="5" ry="10" fill="#FFD700" />
        <ellipse cx="20" cy="7" rx="3" ry="6" fill="#FFF8DC" />
      </g>
    )}
  </svg>
);

// Generate random position within safe bounds
const getRandomPosition = () => {
  // Keep buttons away from edges and table area
  const minX = 10;
  const maxX = 70;
  const minY = 10;
  const maxY = 50;

  const x = Math.floor(Math.random() * (maxX - minX) + minX);
  const y = Math.floor(Math.random() * (maxY - minY) + minY);

  return { x, y };
};

const Celebration = () => {
  const [stage, setStage] = useState(0); // 0: add cake, 1: add candles, 2: add decorations, 3: complete
  const [buttonPosition, setButtonPosition] = useState(getRandomPosition());
  const [showCake, setShowCake] = useState(false);
  const [showCandle, setShowCandle] = useState(false);
  const [showDecorations, setShowDecorations] = useState(false);
  const [showWishText, setShowWishText] = useState(false);
  const [showBlowButton, setShowBlowButton] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showCakeElements, setShowCakeElements] = useState(true);
  const hbdAudioRef = useRef(null);

  useEffect(() => {
    // Handle dynamic viewport height for mobile Safari
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    setVh();
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, []);

  const playHBDMusic = useCallback(() => {
    if (hbdAudioRef.current) {
      hbdAudioRef.current.muted = false;
      hbdAudioRef.current.play().catch((err) => {
        console.error("Failed to play HBD audio:", err);
      });
    }
  }, []);

  // Update button position when stage changes
  useEffect(() => {
    if (stage < 3) {
      setButtonPosition(getRandomPosition());
    }
  }, [stage]);

  // Show wish text and blow button after decorations appear
  useEffect(() => {
    if (showDecorations && !candleBlown) {
      // Show wish text immediately after decorations
      const wishTimer = setTimeout(() => setShowWishText(true), 600);
      // Show blow button 2 seconds after wish text
      const blowTimer = setTimeout(() => setShowBlowButton(true), 2600);
      return () => {
        clearTimeout(wishTimer);
        clearTimeout(blowTimer);
      };
    }
  }, [showDecorations, candleBlown]);

  // Stop confetti after some time
  useEffect(() => {
    if (showConfetti) {
      const timer = setTimeout(() => setShowConfetti(false), 200000);
      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const handleAddCake = useCallback(() => {
    setShowCake(true);
    setTimeout(() => setStage(1), 100);
  }, []);

  const handleAddCandles = useCallback(() => {
    setShowCandle(true);
    setTimeout(() => setStage(2), 100);
  }, []);

  const handleAddDecorations = useCallback(() => {
    setShowDecorations(true);
    setStage(3);
    playHBDMusic();
  }, [playHBDMusic]);

  const handleBlowCandle = useCallback(() => {
    setCandleBlown(true);
    setShowWishText(false);
    setShowBlowButton(false);
    setShowConfetti(true);
    // Hide cake elements after 2 seconds
    setTimeout(() => {
      setShowCakeElements(false);
    }, 2000);
  }, []);

  const buttonLabels = ["Add Cake 🎂", "Add Candles 🕯️", "Add Decorations 🎈"];
  const buttonHandlers = [
    handleAddCake,
    handleAddCandles,
    handleAddDecorations,
  ];

  return (
    <section className="full-height bg-[var(--color-primary)] flex flex-col overflow-hidden relative">
      {/* Confetti celebration */}
      {showConfetti && (
        <>
          <Confetti
            width={window.innerWidth}
            height={window.innerHeight}
            numberOfPieces={400}
            recycle={false}
            gravity={0.15}
            colors={[
              "#FF6B6B",
              "#4ECDC4",
              "#FFE66D",
              "#95E1D3",
              "#F38181",
              "#AA96DA",
            ]}
            className="pointer-events-none z-50"
          />
          {/* Birthday text */}
          <div className="absolute bottom-[10%] inset-0 flex items-center justify-center z-40 pointer-events-none">
           {!showCakeElements && <h1 className="font-roboto-condensed text-[40px]/[46px] sm:text-[80px] md:text-[100px] text-[var(--color-quaternary)] text-center px-6 animate-fade-in [animation-delay:2000ms] drop-shadow-lg">
             Many Many Happy Returns of the day! 🎉
            </h1>}
          </div>
        </>
      )}

      {/* Decorations background */}
      {showDecorations && (
        <div className="absolute inset-0 z-0 animate-fade-in">
          <img
            src={hbdBackground}
            alt="Birthday decorations"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Wish text in middle */}
      {showWishText && (
        <div className="absolute top-[25%] inset-0 flex justify-center z-30 pointer-events-none">
          <h2 className="font-lobster text-[24px] sm:text-[24px] text-[var(--color-quaternary)] text-center px-6 animate-slide-fade-in">
            Make a wish and blow the candles ✨
          </h2>
        </div>
      )}

      {/* Main content area */}
      <div className="flex-1 relative z-10">
        {/* Random position button */}
        {stage < 3 && (
          <button
            className="btn-base btn-secondary absolute transition-all duration-300 animate-slide-fade-in z-20"
            style={{
              left: `${buttonPosition.x}%`,
              top: `${buttonPosition.y}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={buttonHandlers[stage]}
          >
            {buttonLabels[stage]}
          </button>
        )}
      </div>

      {/* Blow candles button at bottom */}
      {showBlowButton && (
        <div className="absolute bottom-[60px] left-0 right-0 flex justify-center z-30 animate-slide-fade-in">
          <button className="btn-base btn-secondary" onClick={handleBlowCandle}>
            Blow Candles 🌬️
          </button>
        </div>
      )}

      {/* Table area at bottom */}
      {showCakeElements && (
        <div className="relative flex justify-center items-end pb-0 z-10">
          {/* Cake on table */}
          <div className="absolute bottom-[245px] z-10">
            {showCake && (
              <div className="relative animate-slide-fade-in">
                <img
                  src={cakeImg}
                  alt="Birthday cake"
                  className="w-[160px] h-auto"
                />
                {/* Candle on cake */}
                {showCandle && (
                  <div className="absolute top-[-70px] left-1/2 -translate-x-1/2 animate-slide-fade-in">
                    <CandleSVG showFlame={!candleBlown} />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Table */}
          <img src={tableImg} alt="Table" className="w-[400px] h-auto" />
        </div>
      )}

      {/* Hidden audio element for HBD song */}
      <audio
        ref={hbdAudioRef}
        src={hbdAudio}
        muted
        className="hidden"
      />
    </section>
  );
};

export default Celebration;
