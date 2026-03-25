import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import ScratchCard from "react-scratchcard-v2";
import { useNavigate } from "react-router-dom";

const RevealPage = () => {
  const navigate = useNavigate();
  const [showConfetti, setShowConfetti] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  useEffect(() => {
    if (!showConfetti) return;

    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 10000);

    return () => clearTimeout(timer);
  }, [showConfetti]);

  const handleScratchComplete = () => {
    if (isRevealed) return;
    setIsRevealed(true);
    setShowConfetti(true);
  };

  return (
    <section className="reveal-page flex justify-center py-[64px] pb-[40px] px-6 relative overflow-x-hidden overflow-y-auto">
      {showConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          numberOfPieces={450}
          recycle={false}
          gravity={0.18}
          className="pointer-events-none"
        />
      )}

      <div className="max-w-2xl text-center relative w-full z-10">
        <h1 className="font-lobster text-[30px]/[36px] sm:text-[34px]/[40px] text-[var(--color-quaternary)] reveal-line reveal-line-a">
          Todays the day a gem 💎 was born.
        </h1>
        <h1 className="font-lobster text-[34px]/[40px] py-[20px] sm:text-[40px]/[46px] text-[var(--color-quaternary)] reveal-line reveal-line-b">
          A strong, handsome, loving, caring, thoughtful boy was born.
        </h1>
        <h3 className="font-lobster text-[30px]/[36px] sm:text-[34px]/[40px] text-[var(--color-quaternary)] reveal-line reveal-line-c">
          none other than
        </h3>

        <p
          className={`font-poppins pt-[25px] text-[44px]/[50px] sm:text-[54px]/[60px] mt-2 reveal-hero-name ${isRevealed ? "is-unlocked" : ""}`}
        >
          Person name
        </p>

        <div className="rounded-2xl mt-[30px] mb-[100px] overflow-hidden bg-white scratch-card-shell reveal-line reveal-line-d"
             onTouchMove={(e) => e.preventDefault()}
             onWheel={(e) => e.preventDefault()}
             style={{touchAction: !isRevealed ? 'none' : 'auto'}}>
          {!isRevealed ? (
            <ScratchCard
              width={Math.min(480, window.innerWidth - 48)}
              height={260}
              image="https://placehold.co/640x360/e0b765/4d3311?text=Scratch+Me"
              finishPercent={45}
              brushSize={30}
              onComplete={handleScratchComplete}
            >
              <img
                src="https://placehold.co/480x360/f0e1c8/333?text=Birthday+Star"
                className="w-full h-[260px] object-cover reveal-main-photo is-unlocked"
              />
            </ScratchCard>
          ) : (
            <img
              src="https://placehold.co/480x360/f0e1c8/333?text=Birthday+Star"
              alt="Birthday reveal"
              className="w-full h-[260px] object-cover reveal-main-photo is-unlocked"
            />
          )}
        </div>

        <button
          className={`btn-base w-full absolute bottom-0 left-0 mt-[40px] btn-secondary reveal-cta ${isRevealed ? "is-unlocked" : ""}`}
          onClick={() => navigate("/celebration")}
        >
          Lets start the celebration
        </button>
      </div>
    </section>
  );
};

export default RevealPage;
