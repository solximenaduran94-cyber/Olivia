import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, ChevronDown, Calendar, MapPin, Clock, Compass, Copy, Check, 
  Smile, Trash2, Users, Download, Shield, Save, MessageCircle, Heart 
} from 'lucide-react';
import { RSVP, InvitationConfig } from './types';
import Countdown from './components/Countdown';
import MusicPlayer from './components/MusicPlayer';
import RsvpWhatsapp from './components/RsvpWhatsapp';
import AdminDashboard from './components/AdminDashboard';

// Custom images
import oliviaUno from './assets/images/olivia_uno.jpg';
import oliviaPastel from './assets/images/olivia_pastel.jpg';
import oliviaBurbujas from './assets/images/olivia_burbujas.jpg';
import oliviaEscalera from './assets/images/olivia_escalera.jpg';
import uploadedImage from './assets/images/uploaded_image.jpg';
import bgInvitation from './assets/images/olivia_invitation_bg_1782971766317.jpg';
import dateDivider from './assets/images/date_divider.png';
import envelopeCover from './assets/images/envelope_cover.jpg';

// Cute animal pngs
import animal1 from './assets/images/animal1.png';
import animal2 from './assets/images/animal2.png';
import animal3 from './assets/images/animal3.png';
import animal4 from './assets/images/animal4.png';

const BG_IMAGE = bgInvitation;

const CHARACTERS = [
  {
    id: "uno",
    name: "Olivia Cumple 1",
    image: oliviaUno,
    emoji: "👑",
    description: "¡Sosteniendo mi cartel de un añito!"
  },
  {
    id: "pastel",
    name: "Olivia y su Torta",
    image: oliviaPastel,
    emoji: "🎂",
    description: "¡Probando mi pastel de cumpleaños, riquísimo!"
  },
  {
    id: "burbujas",
    name: "Olivia y las Burbujas",
    image: oliviaBurbujas,
    emoji: "🫧",
    description: "¡Jugando en mi baño de burbujas!"
  },
  {
    id: "escalera",
    name: "Olivia Sonriente",
    image: oliviaEscalera,
    emoji: "⭐",
    description: "¡Posando muy coqueta y feliz para mi cumple!"
  }
];

const DEFAULT_CONFIG: InvitationConfig = {
  name: "Olivia",
  age: 1,
  date: "2026-08-08",
  displayDate: "Sábado, 8 de Agosto de 2026",
  timeFrom: "15:00",
  timeTo: "19:00",
  venue: "SALON MUNDO MAGICO",
  address: "Av. Croacia 1905, José C. Paz",
  mapsUrl: "https://maps.app.goo.gl/sDfP8XHSB3Qc9sCi6",
  dressCodeTitle: "Código de Vestimenta",
  dressCodeDesc: "Vení lindo para divertirte ✨",
  whatsappPhone: "5491176249734",
  rsvpDeadline: "25 de Julio"
};

const DEFAULT_RSVPS: RSVP[] = [
  {
    id: "1",
    name: "Tía Romina",
    attending: "yes",
    dietary: "Ninguna",
    message: "¡Feliz cumple Olivia hermosa! Qué emoción ver tu primer añito. ❤️",
    guestsCount: 2,
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString()
  },
  {
    id: "2",
    name: "Tío Tomás",
    attending: "yes",
    dietary: "Celíaco",
    message: "¡Ahí estaremos listos para jugar un montón en los peloteros! 🎠✨",
    guestsCount: 1,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString()
  }
];

export default function App() {
  const [envelopeOpened, setEnvelopeOpened] = useState(false);
  const [config, setConfig] = useState<InvitationConfig>(DEFAULT_CONFIG);
  const [rsvps, setRsvps] = useState<RSVP[]>(DEFAULT_RSVPS);
  const [copiedAddress, setCopiedAddress] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(CHARACTERS[0]);

  // Load from local storage on mount
  useEffect(() => {
    const savedConfig = localStorage.getItem('olivia_invitation_config');
    const savedRSVPs = localStorage.getItem('olivia_invitation_rsvps');

    if (savedConfig) {
      try {
        const parsed = JSON.parse(savedConfig);
        parsed.dressCodeDesc = "Vení lindo para divertirte ✨";
        parsed.venue = "SALON MUNDO MAGICO";
        parsed.address = "Av. Croacia 1905, José C. Paz";
        parsed.mapsUrl = "https://maps.app.goo.gl/sDfP8XHSB3Qc9sCi6";
        localStorage.setItem('olivia_invitation_config', JSON.stringify(parsed));
        setConfig(parsed);
      } catch (e) {
        console.error(e);
      }
    }
    if (savedRSVPs) {
      try { setRsvps(JSON.parse(savedRSVPs)); } catch (e) { console.error(e); }
    }
  }, []);

  const handleUpdateConfig = (newConfig: InvitationConfig) => {
    setConfig(newConfig);
    localStorage.setItem('olivia_invitation_config', JSON.stringify(newConfig));
  };

  const handleClearRSVPs = () => {
    setRsvps([]);
    localStorage.removeItem('olivia_invitation_rsvps');
  };

  const handleRemoveRSVP = (id: string) => {
    const updated = rsvps.filter(r => r.id !== id);
    setRsvps(updated);
    localStorage.setItem('olivia_invitation_rsvps', JSON.stringify(updated));
  };

  // Allow simulator to add test RSVPs
  const handleAddSimulatedRSVP = (newRsvp: RSVP) => {
    const updated = [newRsvp, ...rsvps];
    setRsvps(updated);
    localStorage.setItem('olivia_invitation_rsvps', JSON.stringify(updated));
  };

  const copyAddress = () => {
    navigator.clipboard.writeText(config.address);
    setCopiedAddress(true);
    setTimeout(() => setCopiedAddress(false), 2000);
  };

  const getGoogleCalendarUrl = () => {
    const dateFormatted = config.date.replace(/-/g, '');
    const startTime = "180000"; // 15:00 GMT-3 is 18:00 UTC
    const endTime = "220000";   // 19:00 GMT-3 is 22:00 UTC
    
    const eventTitle = encodeURIComponent(`Primer Añito de ${config.name} 🎂`);
    const eventDetails = encodeURIComponent(`¡Te espero para festejar mi primer añito en ${config.venue}! Traer medias para los peloteros.`);
    const eventLocation = encodeURIComponent(`${config.address}, ${config.venue}`);

    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${dateFormatted}T${startTime}Z/${dateFormatted}T${endTime}Z&details=${eventDetails}&location=${eventLocation}`;
  };

  return (
    <div className="relative min-h-screen bg-neutral-100 flex flex-col items-center justify-start py-0 sm:py-8 font-sans antialiased select-none">
      
      {/* Dynamic Background subtle elements for visual depth */}
      <div className="fixed inset-0 pointer-events-none opacity-20 bg-radial from-invite-pink-light to-transparent z-0"></div>

      <AnimatePresence mode="wait">
        
        {/* INTERACTIVE ENVELOPE COVER SCREEN */}
        {!envelopeOpened ? (
          <motion.div
            key="envelope-cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, y: -120 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-invite-pink-light px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="w-full max-w-sm bg-invite-beige-light rounded-3xl p-8 border border-invite-pink/20 shadow-xl text-center space-y-6 relative overflow-hidden"
            >
              {/* Cute peaking animal 1 at top-right of envelope card */}
              <div className="absolute top-2 right-2 w-16 h-16 pointer-events-none z-10 animate-float">
                <img src={animal1} alt="Cute animal 1" className="w-full h-full object-contain" />
              </div>
              {/* Cute peaking animal 2 at bottom-left of envelope card */}
              <div className="absolute bottom-2 left-2 w-16 h-16 pointer-events-none z-10 animate-float-delayed">
                <img src={animal2} alt="Cute animal 2" className="w-full h-full object-contain" />
              </div>

              {/* Top soft aesthetic decoration */}
              <div className="absolute -top-12 -left-12 w-24 h-24 bg-invite-pink-light/50 rounded-full pointer-events-none"></div>
              <div className="absolute -bottom-12 -right-12 w-24 h-24 bg-invite-pink-light/50 rounded-full pointer-events-none"></div>

              {/* Envelope seal picture */}
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center mx-auto text-invite-pink-dark border-4 border-white animate-soft-pulse shadow-md overflow-hidden">
                <img
                  src={envelopeCover}
                  alt="Olivia 1"
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-invite-pink-dark block">Invitación Especial</span>
                <h1 className="font-cursive text-5xl font-bold text-invite-pink-dark tracking-tight">{config.name}</h1>
                <p className="text-xs text-invite-text/85 leading-relaxed max-w-xs mx-auto">
                  Estás invitado/a a celebrar mi primer añito con una tarde mágica llena de risas y mucha diversión. ¡Abrí mi invitación! ✨
                </p>
              </div>

              <div className="pt-2">
                <button
                  id="btn-open-invitation"
                  onClick={() => {
                    setEnvelopeOpened(true);
                    try {
                      import('./utils/audio').then(m => m.musicBox.start());
                    } catch (err) {
                      console.error("Audio failed", err);
                    }
                  }}
                  className="w-full bg-invite-pink-dark hover:bg-invite-pink text-white font-bold py-4 px-6 rounded-2xl border border-invite-pink/15 shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 text-sm tracking-wide"
                >
                  <Sparkles className="w-4 h-4 text-white animate-pulse" />
                  ABRIR INVITACIÓN 💌
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          
          /* INVITATION DISPLAY LAYOUT (Stunning smartphone viewport mockup) */
          <motion.div
            key="invitation-main"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="relative z-10 w-full max-w-[430px] bg-invite-pink-light shadow-2xl sm:rounded-[40px] sm:border-[10px] sm:border-invite-green-dark/10 overflow-hidden flex flex-col"
          >
            {/* 1. HERO COVER SECTION (White/Cream Background) */}
            <div className="relative bg-invite-pink-light pt-14 pb-8 px-6 flex flex-col items-center text-center overflow-hidden">
              
              {/* Celebrant Name in cursive golden yellow */}
              <h1 className="font-cursive text-6xl text-invite-pink-dark font-bold leading-tight select-none">
                {config.name}
              </h1>
              
              <h2 className="font-sans text-xs font-bold uppercase tracking-widest text-invite-green-dark mt-1">
                MI PRIMER AÑITO
              </h2>

              {/* AGENDAR BUTTON with decorative flying butterfly */}
              <div className="relative mt-6 mb-4">
                {/* Dotted trailing trail path */}
                <svg className="absolute -top-10 -right-16 w-16 h-10 text-invite-pink/50" viewBox="0 0 100 50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="3 3">
                  <path d="M0,45 C20,30 40,40 60,15 C75,0 90,10 95,20" />
                </svg>
                {/* Butterfly Icon */}
                <div className="absolute -top-12 -right-16 animate-float text-lg">🦋</div>

                <a
                  id="btn-agenda-calendar-top"
                  href={getGoogleCalendarUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-invite-pink-dark hover:bg-invite-pink text-white font-bold py-2 px-8 rounded-full border border-invite-pink/20 shadow-sm hover:shadow-md transition-all text-xs tracking-wider uppercase cursor-pointer block"
                >
                  AGENDAR
                </a>
              </div>

              {/* Uploaded Hero Photo */}
              <div className="w-full mt-4 max-w-[280px] bg-white p-3 rounded-2xl shadow-md border border-invite-pink/20 -rotate-1 relative">
                {/* Cute animal 3 sitting on the top-left corner */}
                <div className="absolute -top-6 -left-6 w-14 h-14 pointer-events-none z-20 animate-float-delayed">
                  <img src={animal3} alt="Cute animal 3" className="w-full h-full object-contain" />
                </div>

                <div className="aspect-[4/5] rounded-xl overflow-hidden relative">
                  <img
                    src={uploadedImage}
                    alt="Olivia Primer Añito"
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-2.5 right-2.5 bg-white/95 backdrop-blur-xs w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-xs border border-invite-pink-light">
                    👑
                  </div>
                </div>
              </div>

              {/* Base solid divider line */}
              <div className="w-full h-1.5 bg-invite-green mt-6 rounded-full"></div>

              {/* COUNTDOWN COMPONENT inside the cream base */}
              <div className="w-full pt-4">
                <Countdown targetDateStr={`${config.date}T${config.timeFrom}:00`} />
              </div>
            </div>

            {/* 2. DATE AND PORTRAIT SECTION */}
            <div className="bg-invite-beige py-6 px-6 flex flex-col items-center">
              
              {/* Double golden dashed lines date bracket */}
              <div className="w-full max-w-xs border-t-2 border-b-2 border-dashed border-invite-pink/40 py-3.5 px-2 flex justify-between items-center text-center font-bold text-invite-pink-dark tracking-wider text-xs sm:text-sm">
                <span className="uppercase text-[11px] font-extrabold w-5/12 text-right">
                  {config.displayDate.split(',')[0] || "SÁBADO"} {config.date.split('-')[2]}
                </span>
                
                {/* Center hugging custom date divider image */}
                <div className="w-12 h-12 flex items-center justify-center shrink-0">
                  <img
                    src={dateDivider}
                    alt="Separador"
                    className="w-full h-full object-contain animate-soft-pulse"
                  />
                </div>
                
                <span className="uppercase text-[11px] font-extrabold w-5/12 text-left">
                  DE {config.displayDate.split(' de ')[1]?.toUpperCase() || "AGOSTO"}
                </span>
              </div>

              {/* Main Baby Photo (Polaroid / Framed look) */}
              <div className="w-full mt-6 bg-white p-3 rounded-2xl shadow-md border border-invite-pink/15 rotate-1 relative">
                {/* Cute animal 4 peaking from bottom-right of this card */}
                <div className="absolute -bottom-5 -right-5 w-16 h-16 pointer-events-none z-20 animate-float">
                  <img src={animal4} alt="Cute animal 4" className="w-full h-full object-contain" />
                </div>

                <div className="aspect-[4/5] rounded-xl overflow-hidden relative p-1 bg-invite-pink-light/40">
                  {/* Mosaic 2x2 grid repeating the photo in smaller tiles */}
                  <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-1.5">
                    {[1, 2, 3, 4].map((item) => (
                      <div key={item} className="relative rounded-lg overflow-hidden bg-white shadow-xs">
                        <img
                          src={oliviaUno}
                          alt={`Olivia Primer Año ${item}`}
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ))}
                  </div>
                  {/* Elegant crown overlay */}
                  <div className="absolute top-2.5 right-2.5 bg-white/90 backdrop-blur-xs w-8 h-8 rounded-full flex items-center justify-center text-sm shadow-xs border border-invite-pink-light z-10">
                    👑
                  </div>
                </div>
              </div>

              {/* Butterfly trailing underneath */}
              <div className="w-full flex justify-start pl-8 mt-2 opacity-80">
                <span className="animate-float text-base">🦋 <span className="text-[9px] font-mono text-invite-pink/40">┈┈┈┈┈┈┈┈┈┈</span></span>
              </div>
            </div>

            {/* 3. TERRACOTTA ORANGE INFO BOX (The main orange patterned section) */}
            <div className="relative bg-invite-green-dark text-white py-12 px-8 flex flex-col items-center text-center overflow-hidden">
              
              {/* White Polka dot subtle grid pattern overlay */}
              <div className="absolute inset-0 opacity-15 pointer-events-none" style={{
                backgroundImage: 'radial-gradient(circle, white 10%, transparent 10%)',
                backgroundSize: '16px 16px'
              }}></div>

              {/* Floating butterflies inside orange block */}
              <div className="absolute top-6 left-6 text-xl animate-float-delayed">🦋</div>
              <div className="absolute bottom-6 right-6 text-xl animate-float">🌸</div>

              <div className="relative z-10 space-y-6 w-full">
                
                <div className="space-y-1">
                  <h3 className="text-xs uppercase tracking-widest text-invite-pink-light font-black">Te Espero para Festejar</h3>
                  <h2 className="text-3xl font-extrabold tracking-tight font-sans drop-shadow-xs text-white">
                    MI PRIMER AÑITO
                  </h2>
                </div>

                {/* Event Details rows styled exactly like Image 3/4 */}
                <div className="space-y-4 pt-2">
                  
                  {/* FECHA */}
                  <div className="flex items-center gap-3 bg-white/15 rounded-2xl p-3.5 border border-white/20 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Calendar className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-invite-pink-light">Fecha</p>
                      <p className="text-sm font-extrabold text-white">{config.displayDate}</p>
                    </div>
                  </div>

                  {/* HORA */}
                  <div className="flex items-center gap-3 bg-white/15 rounded-2xl p-3.5 border border-white/20 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-invite-pink-light">Horario</p>
                      <p className="text-sm font-extrabold text-white">De {config.timeFrom} a {config.timeTo} hs</p>
                    </div>
                  </div>

                  {/* LUGAR */}
                  <div className="flex items-center gap-3 bg-white/15 rounded-2xl p-3.5 border border-white/20 shadow-xs">
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <MapPin className="w-5 h-5 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-invite-pink-light">Salón</p>
                      <p className="text-sm font-extrabold text-white">{config.venue}</p>
                      <p className="text-xs text-white/80">{config.address}</p>
                    </div>
                  </div>
                </div>

                {/* HOW TO GET THERE CALL TO ACTION */}
                <div className="pt-4 space-y-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-invite-pink-light leading-none">
                    HACE CLICK PARA SABER CÓMO LLEGAR
                  </p>
                  
                  <motion.a
                    id="btn-maps-lugar"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={config.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full bg-white text-invite-green-dark hover:bg-invite-green-light font-bold py-3.5 px-6 rounded-full border border-white/10 shadow-md hover:shadow-lg transition-all text-sm tracking-wider uppercase cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Compass className="w-4 h-4 text-invite-green-dark animate-spin-slow" />
                    CÓMO LLEGAR
                  </motion.a>
                </div>
              </div>
            </div>

            {/* 4. PHOTOGRAPHY COLLAGE GRID (2x2 Grid, Full width, no side margins) */}
            <div className="grid grid-cols-2 gap-1 bg-white p-1">
              
              {/* Photo 1 (Uno) */}
              <div className="aspect-square overflow-hidden bg-invite-pink-light relative group">
                <img
                  src={oliviaUno}
                  alt="Olivia Uno"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                />
              </div>

              {/* Photo 2 (Pastel) */}
              <div className="aspect-square overflow-hidden bg-invite-pink-light relative group">
                <img
                  src={oliviaPastel}
                  alt="Olivia Pastel"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                />
              </div>

              {/* Photo 3 (Burbujas) */}
              <div className="aspect-square overflow-hidden bg-invite-pink-light relative group">
                <img
                  src={oliviaBurbujas}
                  alt="Olivia Burbujas"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                />
              </div>

              {/* Photo 4 (Escalera) */}
              <div className="aspect-square overflow-hidden bg-invite-pink-light relative group">
                <img
                  src={oliviaEscalera}
                  alt="Olivia Sonriente"
                  className="w-full h-full object-cover hover:scale-105 transition-all duration-500"
                />
              </div>
            </div>

            {/* 5. RSVP SECTION (Cream background, with WhatsApp RSVPs) */}
            <div className="bg-invite-beige-light py-10 px-6 border-t border-invite-pink/15 flex flex-col items-center">
              
              <RsvpWhatsapp
                whatsappNumber={config.whatsappPhone}
                celebrantName={config.name}
                rsvpDeadline={config.rsvpDeadline}
              />


            </div>

            {/* 6. BOTTOM ROCKING HORSE IMAGE & FOOTER */}
            <div className="w-full relative">
              <div className="aspect-[4/5] overflow-hidden bg-white">
                <img
                  src={oliviaEscalera}
                  alt="Olivia Final Poses"
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Footer details styled beautifully exactly like Image 6 */}
              <div className="bg-invite-beige py-8 px-6 text-center space-y-4 relative border-t border-invite-pink/15 overflow-hidden">
                {/* Cute animal 1 and animal 2 peaking in the footer */}
                <div className="absolute -bottom-1 -right-1 w-14 h-14 pointer-events-none z-10 animate-float">
                  <img src={animal1} alt="Cute animal 1" className="w-full h-full object-contain" />
                </div>
                <div className="absolute top-1 -left-1 w-12 h-12 pointer-events-none z-10 animate-float-delayed">
                  <img src={animal2} alt="Cute animal 2" className="w-full h-full object-contain animate-float-delayed" />
                </div>
                
                {/* Cute framing butterfly vectors */}
                <div className="flex justify-center items-center gap-4 text-invite-pink-dark/80">
                  <span className="text-lg animate-float">🦋</span>
                  <h3 className="font-cursive text-4xl font-bold tracking-tight text-invite-pink-dark">
                    {config.name}
                  </h3>
                  <span className="text-lg animate-float-delayed">🌸</span>
                </div>

                <div className="space-y-1">
                  <span className="inline-block bg-invite-pink/20 text-invite-pink-dark text-xs font-bold px-3 py-1 rounded-full border border-invite-pink/30">
                    {config.date.split('-')[2]}.{config.date.split('-')[1]}.{config.date.split('-')[0].substring(2)}
                  </span>
                  <p className="text-[10px] text-invite-text/60 font-bold tracking-wider uppercase pt-1">
                    ¡TE ESPERO CON TODO MI AMOR!
                  </p>
                </div>

                {/* Thick base solid footer bar */}
                <div className="w-full h-4 bg-invite-green mt-6 rounded-b-[40px] absolute bottom-0 left-0 right-0"></div>
              </div>
            </div>

            {/* FLOATING AUDIO CONTROLLER (Always easily accessible) */}
            <MusicPlayer />

          </motion.div>
        )}

      </AnimatePresence>



    </div>
  );
}
