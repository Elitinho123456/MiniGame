import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { RandomEvent } from '../../assets/events';

interface EventBannerProps {
  activeEvent: RandomEvent | null;
  eventEndTime: number;
}

export default function EventBanner({ activeEvent, eventEndTime }: EventBannerProps) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (!activeEvent) return;
    const tick = setInterval(() => {
      const remaining = Math.max(0, eventEndTime - Date.now());
      setTimeLeft(remaining);
      if (remaining <= 0) clearInterval(tick);
    }, 1000);
    return () => clearInterval(tick);
  }, [activeEvent, eventEndTime]);

  const mins = Math.floor(timeLeft / 60000);
  const secs = Math.floor((timeLeft % 60000) / 1000);

  return (
    <AnimatePresence>
      {activeEvent && timeLeft > 0 && (
        <motion.div
          initial={{ y: -80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -80, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className="absolute top-4 left-1/2 -translate-x-1/2 z-30 w-[90%] max-w-md"
        >
          <div
            className={`relative overflow-hidden rounded-2xl border-2 ${activeEvent.borderColor}/50 backdrop-blur-xl shadow-2xl`}
          >
            {/* Gradient background */}
            <div className={`absolute inset-0 bg-linear-to-r ${activeEvent.color} opacity-15`} />
            <div className="absolute inset-0 bg-black/60" />

            {/* Animated shimmer */}
            <motion.div
              className={`absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent`}
              animate={{ x: ['-200%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
            />

            <div className="relative flex items-center gap-3 px-5 py-3">
              {/* Emoji pulsing */}
              <motion.span
                className="text-3xl"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                {activeEvent.emoji}
              </motion.span>

              <div className="flex-1 min-w-0">
                <h3 className="font-black text-white text-sm uppercase tracking-wider truncate">
                  {activeEvent.name}
                </h3>
                <p className="text-[11px] text-stone-300/80 font-medium truncate">
                  {activeEvent.description}
                </p>
              </div>

              {/* Timer */}
              <div className={`shrink-0 bg-black/40 border ${activeEvent.borderColor}/30 rounded-xl px-3 py-1.5`}>
                <span className="text-white font-black text-sm tabular-nums">
                  {mins}:{secs.toString().padStart(2, '0')}
                </span>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
