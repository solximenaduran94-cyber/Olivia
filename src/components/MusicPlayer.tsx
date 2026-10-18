import { useState, useEffect } from 'react';
import { musicBox } from '../utils/audio';
import { Music, VolumeX, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showTooltip, setShowTooltip] = useState(true);

  useEffect(() => {
    // Hide tooltip after 5 seconds
    const timer = setTimeout(() => {
      setShowTooltip(false);
    }, 5000);
    return () => clearTimeout(timer);
  }, []);

  const handleToggle = () => {
    const nextState = musicBox.toggle();
    setIsPlaying(nextState);
    setShowTooltip(false);
  };

  return (
    <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
      <AnimatePresence>
        {showTooltip && (
          <motion.div
            initial={{ opacity: 0, x: 20, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 20, scale: 0.9 }}
            className="bg-white/95 backdrop-blur-xs px-3 py-1.5 rounded-full shadow-md border border-invite-pink/30 text-[11px] font-sans text-invite-text font-medium flex items-center gap-1.5"
          >
            <Music className="w-3.5 h-3.5 text-invite-pink-dark animate-bounce" />
            ¿Música de fondo?
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        id="btn-toggle-music"
        onClick={handleToggle}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        className={`w-11 h-11 rounded-full flex items-center justify-center shadow-md border-2 cursor-pointer transition-all ${
          isPlaying
            ? 'bg-invite-pink-dark text-white border-invite-pink-dark'
            : 'bg-white/80 backdrop-blur-xs text-invite-pink-dark border-invite-pink-dark/80 hover:bg-white'
        }`}
      >
        {isPlaying ? (
          <Volume2 className="w-5 h-5 animate-pulse" />
        ) : (
          <Music className="w-5 h-5" />
        )}
      </motion.button>
    </div>
  );
}
