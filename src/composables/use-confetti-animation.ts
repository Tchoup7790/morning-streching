import confetti from 'canvas-confetti'

// Fires a confetti burst with customizable parameters.
export function useConfetti({
  count = 120,
  spread = 180,
  velocity = 45,
  gravity = 0.7,
  scalar = 1,
} = {}) {
  confetti({
    particleCount: count,
    spread,
    startVelocity: velocity,
    origin: { y: 1.1 },
    gravity,
    scalar,
  })
}

