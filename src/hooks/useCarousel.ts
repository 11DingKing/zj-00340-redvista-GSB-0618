import { useEffect, useCallback, useRef } from 'react';
import type { CarouselPanel } from '@/types';
import { useDashboardStore } from '@/store/dashboardStore';

const PANELS: CarouselPanel[] = ['ranking', 'guide', 'media', 'progress'];
const INTERVAL = 5000;

export function useCarousel() {
  const { activePanel, setActivePanel, selectedSchool } = useDashboardStore();
  const timeoutRef = useRef<number | null>(null);
  const isPausedRef = useRef(false);

  const goToNext = useCallback(() => {
    const currentIndex = PANELS.indexOf(activePanel);
    const nextIndex = (currentIndex + 1) % PANELS.length;
    setActivePanel(PANELS[nextIndex]);
  }, [activePanel, setActivePanel]);

  const pause = useCallback(() => {
    isPausedRef.current = true;
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, []);

  const resume = useCallback(() => {
    isPausedRef.current = false;
  }, []);

  useEffect(() => {
    if (selectedSchool || isPausedRef.current) return;

    timeoutRef.current = window.setTimeout(() => {
      goToNext();
    }, INTERVAL);

    return () => {
      if (timeoutRef.current) {
        window.clearTimeout(timeoutRef.current);
      }
    };
  }, [activePanel, selectedSchool, goToNext]);

  useEffect(() => {
    if (selectedSchool) {
      pause();
    } else {
      resume();
    }
  }, [selectedSchool, pause, resume]);

  return {
    activePanel,
    goToNext,
    pause,
    resume,
  };
}
