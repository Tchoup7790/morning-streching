import confetti from 'canvas-confetti'

// Launches a customizable confetti burst.
export function useConfettiAnimation(spread: number = 180, velocity: number = 45) {
  // Fire confetti burst with preset visual parameters
  confetti({
    particleCount: 120, // Number of particles
    spread: spread, // Horizontal scattering angle
    origin: { y: 1.1 }, // Start slightly below the viewport
    startVelocity: velocity, // Initial launch velocity
    gravity: 0.7, // Downward pull for realism
    scalar: 1, // Particle size scaling
  })
}
