import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import musicVideo from "../assets/music.mov";
import audioTrack from "../assets/audio.mp3";

const TWINKLE_COUNT = 36;

const createTwinkles = () => {
  const colors = [
    "rgba(18, 18, 18, 0.75)",
    "rgba(152, 4, 4, 0.7)",
    "rgba(255, 226, 142, 0.95)",
    "rgba(255, 255, 255, 0.92)",
  ];
  const glyphs = ["✦", "✶", "✧"];

  return Array.from({ length: TWINKLE_COUNT }, (_, index) => ({
    id: index,
    left: `${Math.round(Math.random() * 96)}%`,
    top: `${Math.round(Math.random() * 92)}%`,
    size: 10 + Math.round(Math.random() * 10),
    delay: `${(Math.random() * 3.5).toFixed(2)}s`,
    duration: `${(2.4 + Math.random() * 3.6).toFixed(2)}s`,
    color: colors[Math.floor(Math.random() * colors.length)],
    glyph: glyphs[Math.floor(Math.random() * glyphs.length)],
  }));
};

const InitialScreen = () => {
  const [showWrongChoiceOverlay, setShowWrongChoiceOverlay] = useState(false);
  const [hideNotInterestedButton, setHideNotInterestedButton] = useState(false);
  const [twinkles, setTwinkles] = useState(() => createTwinkles());
  const [hasBeenClickedOnce, setHasBeenClickedOnce] = useState(false);
  const [audioPlayed, setAudioPlayed] = useState(false);
  const [cardAnimated, setCardAnimated] = useState(false);
  const audioRef = useRef(null);
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const moveSingleTwinkle = (id) => {
    setTwinkles((prevTwinkles) =>
      prevTwinkles.map((twinkle) => {
        if (twinkle.id !== id) return twinkle;

        return {
          ...twinkle,
          left: `${Math.round(Math.random() * 96)}%`,
          top: `${Math.round(Math.random() * 92)}%`,
        };
      }),
    );
  };

  const handleCloseWrongChoiceOverlay = () => {
    setShowWrongChoiceOverlay(false);
  };

  const playAudio = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (audioRef.current) {
      audioRef.current.play().catch((err) => {
        console.error("Failed to play audio:", err);
      });
    }
    if(videoRef.current) {
      videoRef.current.play().catch((err) => {
        console.error("Failed to play video:", err);
      })
    }
    setAudioPlayed(true);
    setCardAnimated(true);
  };

  return (
    <div className="relative flex min-h-screen items-center flex-col overflow-hidden bg-[var(--color-primary)] px-[20px] pt-[50px]">
      <div
        className="pointer-events-none absolute inset-0 z-0"
        aria-hidden="true"
      >
        {twinkles.map((twinkle) => (
          <span
            key={twinkle.id}
            className="twinkle-dot"
            onAnimationIteration={() => moveSingleTwinkle(twinkle.id)}
            style={{
              left: twinkle.left,
              top: twinkle.top,
              fontSize: `${twinkle.size}px`,
              color: twinkle.color,
              animationDelay: twinkle.delay,
              animationDuration: twinkle.duration,
            }}
          >
            {twinkle.glyph}
          </span>
        ))}
      </div>

     {audioPlayed && (
        <div className={`animate-card-in z-10 flex mx-auto w-[80vw] rounded-[25px] bg-[var(--color-secondary)] px-[20px] py-[40px] shadow-xl/20 transition-all duration-300 ${cardAnimated ? 'scale-105' : ''}`}>
          <h2 className="text-[48px]/[52px] font-lobster">
            Today’s a very special day.
          </h2>
        </div>
      )}

      {audioPlayed && (
        <>
          <p className="animate-text-in [animation-delay:200ms] z-10 mt-[40px] text-[32px]/[36px] font-lobster">
            Want to know why?
          </p>

          <div className="z-10 mt-[20px] flex items-center gap-4">
            <button
              className={`btn-base btn-secondary animate-cta-in [animation-delay:400ms] transition-all duration-300 ${
                hideNotInterestedButton
                  ? "!text-[32px]/[36px]"
                  : "text-[20px]/[24px]"
              }`}
              onClick={() => navigate("/memory-lane")}
            >
              Lets find out
            </button>
            {!hideNotInterestedButton && (
              <button
                className={`btn-base btn-primary animate-cta-in [animation-delay:500ms] ${
                  hasBeenClickedOnce
                    ? "!text-[10px]/[14px]"
                    : "text-[20px]/[24px]"
                }`}
                onClick={() => {
                  setShowWrongChoiceOverlay(true);
                  if (hasBeenClickedOnce) {
                    setHideNotInterestedButton(true);
                  } else {
                    setHasBeenClickedOnce(true);
                  }
                }}
              >
                Not Interested
              </button>
            )}
          </div>
        </>
      )}

      <div className={`z-10 mt-[80px] ${audioPlayed ? 'relative' : 'absolute bottom-60'} mb-6 w-full max-w-[90vw] animate-slide-in-up transition-all duration-300`}>
        <video
          src={musicVideo}
          ref={videoRef}
          loop
          muted
          autoPlay
          playsInline
          className="w-full h-[200px] object-cover rounded-xl shadow-xl"
        />
        <audio
          ref={audioRef}
          src={audioTrack}
          loop
          controls
          className="w-full mt-2 opacity-0 h-0"
        />
        {!audioPlayed && (
          <button
            onClick={playAudio}
            className="btn-base btn-secondary mt-2 w-full"
          >
            Play Audio 🎵
          </button>
        )}
      </div>

      {showWrongChoiceOverlay && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#000000e6] px-6"
          onClick={handleCloseWrongChoiceOverlay}
        >
          <div className="relative flex flex-col items-center">
            <div className="relative mt-3 max-w-[420px] top-[-15px] rounded-2xl bg-white px-5 py-4 text-center text-[20px]/[28px] font-medium text-gray-800 shadow-xl">
              Oops, you selected the wrong option. Choose again wisely.
              <span className="absolute left-1/2 top-full h-0 w-0 -translate-x-1/2 border-x-[10px] border-t-[12px] border-x-transparent border-t-white" />
            </div>
            <div className="text-[90px] leading-none">😬</div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InitialScreen;
