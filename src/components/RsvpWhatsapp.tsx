import React from 'react';
import { motion } from 'motion/react';
import { MessageCircle } from 'lucide-react';

interface RsvpWhatsappProps {
  whatsappNumber: string;
  celebrantName: string;
  rsvpDeadline: string;
}

export default function RsvpWhatsapp({ whatsappNumber, celebrantName, rsvpDeadline }: RsvpWhatsappProps) {
  
  // Format the message to send on WhatsApp
  const handleConfirm = () => {
    const text = encodeURIComponent(`¡Hola! Te confirmo mi asistencia al primer añito de ${celebrantName} 🎂✨`);
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${cleanNumber}?text=${text}`, '_blank');
  };

  return (
    <div className="w-full max-w-md mx-auto bg-invite-pink-light/30 rounded-3xl p-8 border border-invite-pink/20 shadow-xs text-center space-y-6 relative overflow-hidden">
      {/* Hand-drawn style decorative balloon SVG */}
      <div className="flex justify-center">
        <svg className="w-16 h-16 text-invite-pink-dark animate-float" viewBox="0 0 64 64" fill="currentColor">
          {/* Balloon body */}
          <path d="M32,8 C42,8 48,16 48,26 C48,36 40,44 32,44 C24,44 16,36 16,26 C16,16 22,8 32,8 Z" />
          {/* Balloon knot */}
          <polygon points="32,44 29,48 35,48" fill="currentColor" />
          {/* Balloon string */}
          <path d="M32,48 C34,51 30,54 32,58" fill="none" stroke="#8A9E80" strokeWidth="2" strokeLinecap="round" />
        </svg>
      </div>

      <div className="space-y-4 px-2">
        <p className="font-sans text-[13px] font-bold text-invite-text/90 leading-relaxed uppercase tracking-wider">
          TU PRESENCIA ES MUY IMPORTANTE PARA MI,
        </p>
        <p className="font-sans text-[13px] font-bold text-invite-text/90 leading-relaxed uppercase tracking-wider">
          NO OLVIDES CONFIRMAR ASISTENCIA CON MIS PAPIS ANTES DEL <span className="text-invite-pink-dark font-black underline decoration-dashed decoration-2 underline-offset-4">{rsvpDeadline}</span>.
        </p>
      </div>

      <div className="pt-2">
        <motion.button
          id="btn-confirm-whatsapp"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleConfirm}
          className="w-full bg-[#25D366] hover:bg-[#20ba5a] text-white font-bold py-3.5 px-6 rounded-2xl border border-green-600/10 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-sm tracking-wide"
        >
          <MessageCircle className="w-5 h-5 fill-white" />
          CONFIRMAR ASISTENCIA
        </motion.button>
      </div>
    </div>
  );
}
