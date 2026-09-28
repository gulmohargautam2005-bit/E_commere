import { useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const useSmoothScroll = () => {
  useEffect(() => {
    // Enable GSAP's native scroll normalization for custom smooth-scroll scrolling
    const normalizer = ScrollTrigger.normalizeScroll({
      type: "touch",
      momentum: true,
      allowNestedScroll: true
    });

    // Make ScrollTrigger updates smooth
    ScrollTrigger.config({ 
      limitCallbacks: true,
      syncInterval: 10
    });

    return () => {
      if (normalizer) normalizer.disable();
    };
  }, []);
};
