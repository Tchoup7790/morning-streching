import { gsap } from "gsap";

export function useSlideAnimation(element: Element, isIn: boolean, onComplete?: gsap.Callback, y: number = 250, duration: number = 0.7) {
  if (isIn) {
    gsap.fromTo(
      element,
      { y, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration,
        ease: "power2.out",
        onComplete,
      },
    );
  } else {
    gsap.to(element, {
      y,
      opacity: 0,
      duration,
      ease: "power2.in",
      onComplete,
    });
  }
}
