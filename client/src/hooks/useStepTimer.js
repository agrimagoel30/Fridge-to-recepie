import { useState, useEffect, useRef, useCallback } from 'react';

// Web Audio API chime synthesizer for zero-dependency sound alert
function playChimeAlert() {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();

    const playTone = (freq, start, duration) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
      gain.gain.setValueAtTime(0, ctx.currentTime + start);
      gain.gain.linearRampToValueAtTime(0.3, ctx.currentTime + start + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(ctx.currentTime + start);
      osc.stop(ctx.currentTime + start + duration);
    };

    // Pleasant two-tone chime (E5 -> A5)
    playTone(659.25, 0, 0.4);
    playTone(880, 0.25, 0.6);
  } catch (err) {
    console.warn('Audio chime could not play:', err);
  }
}

export function useStepTimer(durationMinutes = 0) {
  const totalSeconds = Math.max(0, Math.round((durationMinutes || 0) * 60));
  const [secondsRemaining, setSecondsRemaining] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const intervalRef = useRef(null);

  useEffect(() => {
    setSecondsRemaining(totalSeconds);
    setIsRunning(false);
    setIsCompleted(false);
  }, [totalSeconds]);

  useEffect(() => {
    if (isRunning && secondsRemaining > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsRemaining(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            setIsCompleted(true);
            playChimeAlert();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning, secondsRemaining]);

  const startTimer = useCallback(() => {
    if (secondsRemaining > 0) {
      setIsRunning(true);
      setIsCompleted(false);
    }
  }, [secondsRemaining]);

  const pauseTimer = useCallback(() => {
    setIsRunning(false);
  }, []);

  const resetTimer = useCallback(() => {
    setIsRunning(false);
    setSecondsRemaining(totalSeconds);
    setIsCompleted(false);
  }, [totalSeconds]);

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remSecs = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remSecs.toString().padStart(2, '0')}`;
  };

  return {
    secondsRemaining,
    totalSeconds,
    isRunning,
    isCompleted,
    startTimer,
    pauseTimer,
    resetTimer,
    formattedTime: formatTime(secondsRemaining),
    progressPercentage: totalSeconds > 0 ? ((totalSeconds - secondsRemaining) / totalSeconds) * 100 : 0
  };
}
