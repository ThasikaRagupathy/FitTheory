import confetti from "canvas-confetti";

export const triggerEditorialCelebration = () => {
  try {
    // Luxury color palette confetti: gold, sand, sage, ivory, charcoal
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.65 },
      colors: ["#D4AF37", "#B8A895", "#89917A", "#E7DED2", "#282724"],
      ticks: 200,
      gravity: 1.1,
      scalar: 0.9,
      disableForReducedMotion: true,
    });
  } catch (err) {
    // Graceful fallback if canvas-confetti is unavailable
    console.debug("Confetti disabled or failed", err);
  }
};
