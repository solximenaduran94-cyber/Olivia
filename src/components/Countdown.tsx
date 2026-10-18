import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

interface CountdownProps {
  targetDateStr: string; // ISO format: YYYY-MM-DDTHH:mm:ss
}

export default function Countdown({ targetDateStr }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
    isOver: false,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = new Date(targetDateStr).getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0, isOver: true });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds, isOver: false });
    };

    calculateTimeLeft();
    const interval = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(interval);
  }, [targetDateStr]);

  if (timeLeft.isOver) {
    return (
      <div className="text-center py-2 px-4 bg-invite-pink-light rounded-2xl border border-invite-pink/30 max-w-xs mx-auto shadow-xs">
        <p className="font-sans font-bold text-invite-pink-dark text-sm tracking-wide">¡LLEGÓ EL GRAN DÍA! 🎉</p>
      </div>
    );
  }

  return (
    <div className="w-full text-center py-2">
      <span className="block font-sans text-xs font-bold uppercase tracking-widest text-invite-green-dark mb-0.5">
        FALTAN:
      </span>
      <span className="font-sans text-xl sm:text-2xl font-bold text-invite-pink-dark tracking-wide animate-soft-pulse">
        {timeLeft.days} <span className="font-medium text-sm text-invite-text/75 mr-1.5">Días</span>
        {timeLeft.hours} <span className="font-medium text-sm text-invite-text/75 mr-1.5">hs</span>
        {timeLeft.minutes} <span className="font-medium text-sm text-invite-text/75 mr-1.5">m</span>
        {timeLeft.seconds} <span className="font-medium text-sm text-invite-text/75">s</span>
      </span>
    </div>
  );
}
