import { useRef } from 'react';
import gsap from 'gsap';

// Returns a ref to attach to an element and a shake() function that
// wiggles it, used to signal a failed login or signup
const useShake = () => {
  const ref = useRef(null);

  const shake = () => {
    if (!ref.current) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    gsap.fromTo(
      ref.current,
      { x: -10 },
      { x: 0, duration: 0.6, ease: 'elastic.out(1.2, 0.3)', clearProps: 'x' }
    );
  };

  return [ref, shake];
};

export default useShake;
