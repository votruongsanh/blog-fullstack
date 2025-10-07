import { useEffect, useState } from 'react';

interface UseCountUpOptions {
  duration?: number;
  startValue?: number;
  runOnce?: boolean;
}

export const useCountUp = (endValue: number, options: UseCountUpOptions = {}) => {
  const { duration = 2000, startValue = 0, runOnce = true } = options;
  const [count, setCount] = useState(startValue);
  const [isAnimating, setIsAnimating] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (runOnce && hasAnimated) return;
    if (isAnimating) return;

    setIsAnimating(true);
    setHasAnimated(true);
    const startTime = Date.now();
    const startCount = startValue;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4);

      const currentCount = Math.floor(startCount + (endValue - startCount) * easeOutQuart);
      setCount(currentCount);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCount(endValue);
        setIsAnimating(false);
      }
    };

    requestAnimationFrame(animate);
  }, [endValue, duration, startValue, isAnimating, runOnce, hasAnimated]);

  return { count, isAnimating, hasAnimated };
};
