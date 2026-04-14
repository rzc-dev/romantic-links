import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Heart, Calendar, Stars, Moon, Flower2, Gift, Snowflake, Music, Pause, Play } from 'lucide-react';
import confetti from 'canvas-confetti';
import YouTube from 'react-youtube';

// 1. CONFIGURACIÓN DE LOS 5 TEMAS
const themes = {
  romantic: {
    bg: "bg-love-50",
    card: "bg-white border-love-200",
    text: "text-slate-800",
    secondaryText: "text-slate-500",
    accent: "text-love-500",
    font: "font-romantic",
    icon: Heart,
    confetti: ['#f43f5e', '#ffffff']
  },
  midnight: {
    bg: "bg-midnight-900",
    card: "bg-midnight-700/50 border-gold-400/30 backdrop-blur-md",
    text: "text-white",
    secondaryText: "text-slate-400",
    accent: "text-gold-400",
    font: "font-serif",
    icon: Moon,
    confetti: ['#fbbf24', '#ffffff']
  },
  sunset: {
    bg: "bg-gradient-to-br from-orange-400 via-rose-400 to-purple-500 animate-gradient-slow",
    card: "bg-white/70 border-white/30 backdrop-blur-sm",
    text: "text-orange-950",
    secondaryText: "text-rose-900/70",
    accent: "text-purple-700",
    font: "font-sans",
    icon: Stars,
    confetti: ['#f97316', '#e11d48', '#a855f7']
  },
  flowers: {
    bg: "bg-sunflower-100",
    card: "bg-white border-sunflower-200 shadow-xl border-t-8 border-t-sunflower-400",
    text: "text-sunflower-700",
    secondaryText: "text-sunflower-500",
    accent: "text-sunflower-500",
    font: "font-romantic",
    icon: Flower2,
    confetti: ['#facc15', '#fefce8', '#eab308']
  },
  christmas: {
    bg: "bg-xmas-100",
    card: "bg-white border-xmas-600 shadow-xmas",
    text: "text-xmas-700",
    secondaryText: "text-slate-500",
    accent: "text-xmas-600",
    font: "font-xmas",
    icon: Gift,
    confetti: ['#16a34a', '#ffffff', '#ef4444']
  }
};

const ViewDedication = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('dedicatorias')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setData(data);
        const currentTheme = themes[data.tema] || themes.romantic;
        
        if (data.tema === 'christmas') {
          const duration = 10 * 1000;
          const animationEnd = Date.now() + duration;
          const interval = setInterval(() => {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) return clearInterval(interval);
            confetti({ 
              particleCount: 1, startVelocity: 0, ticks: 200, 
              origin: { x: Math.random(), y: Math.random() - 0.2 }, 
              colors: ['#ffffff'], shapes: ['circle'], gravity: 0.3, scalar: 0.8
            });
          }, 50);
        } 
        else if (data.tema === 'flowers') {
          const end = Date.now() + (7 * 1000);
          (function frame() {
            confetti({ particleCount: 2, angle: 60, spread: 55, origin: { x: 0 }, colors: currentTheme.confetti });
            confetti({ particleCount: 2, angle: 120, spread: 55, origin: { x: 1 }, colors: currentTheme.confetti });
            if (Date.now() < end) requestAnimationFrame(frame);
          }());
        } 
        else {
          confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors: currentTheme.confetti });
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  // Función para extraer ID de YouTube
  const getVideoId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const togglePlay = () => {
    if (!player) return;
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
    setIsPlaying(!isPlaying);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white font-romantic text-2xl text-love-500">
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}>
        Cargando tu sorpresa...
      </motion.div>
    </div>
  );

  if (!data) return <div className="min-h-screen flex items-center justify-center text-slate-400 italic font-sans">Dedicatoria no encontrada.</div>;

  const currentTheme = themes[data.tema] || themes.romantic;
  const ThemeIcon = currentTheme.icon;
  const videoId = getVideoId(data.youtube_url);

  return (
    <div className={`min-h-screen ${currentTheme.bg} py-12 px-4 transition-all duration-1000 flex flex-col items-center overflow-hidden relative`}>
      
      {/* Reproductor de YouTube Invisible */}
      {videoId && (
        <div className="hidden">
          <YouTube 
            videoId={videoId} 
            opts={{ height: '0', width: '0', playerVars: { autoplay: 0 } }} 
            onReady={(e) => setPlayer(e.target)}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
        </div>
      )}

      {/* Botón Flotante de Música */}
      {videoId && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          onClick={togglePlay}
          className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl flex items-center justify-center gap-2 border transition-all ${
            isPlaying ? 'bg-white text-love-500 border-love-100' : 'bg-love-500 text-white border-transparent'
          }`}
        >
          {isPlaying ? <Pause size={20} fill="currentColor" /> : <Play size={20} fill="currentColor" />}
          <span className="text-[10px] font-black uppercase tracking-tighter pr-1">
            {isPlaying ? "Pausar" : "Reproducir Música"}
          </span>
        </motion.button>
      )}

      {/* Decoración extra */}
      {data.tema === 'christmas' && <Snowflake className="absolute top-5 right-5 text-white/40 animate-spin-slow" size={80} />}
      {data.tema === 'flowers' && <Flower2 className="absolute -bottom-10 -left-10 text-sunflower-500/20" size={200} />}

      {/* Cabecera */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12 z-10">
        <ThemeIcon className={`mx-auto ${currentTheme.accent} mb-4 animate-pulse`} size={64} fill="currentColor" />
        <h1 className={`text-5xl md:text-7xl ${currentTheme.font} ${currentTheme.text} mb-2 px-2`}>
          Para: {data.nombre_destinatario}
        </h1>
        <p className={`${currentTheme.secondaryText} text-lg font-medium tracking-widest italic`}>
          De: {data.nombre_remitente}
        </p>
      </motion.div>

      {/* Fotos Estilo Polaroid */}
      {data.imagenes?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-8 mb-16 max-w-6xl z-10 px-4">
          {data.imagenes.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? -5 : 5 }}
              whileInView={{ opacity: 1, scale: 1, rotate: index % 2 === 0 ? -2 : 2 }}
              viewport={{ once: true }}
              whileHover={{ scale: 1.05, rotate: 0, zIndex: 20 }}
              className="bg-white p-3 pb-12 shadow-2xl rounded-sm border border-slate-100 transition-all cursor-pointer"
            >
              <img src={url} className="w-64 h-64 object-cover" alt="Recuerdo" loading="lazy" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Mensaje Principal */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        whileInView={{ y: 0, opacity: 1 }} 
        viewport={{ once: true }}
        className={`max-w-3xl w-full ${currentTheme.card} p-10 md:p-16 rounded-[2.5rem] shadow-2xl text-center mb-12 border-b-8 z-10 mx-auto`}
      >
        <p className={`text-2xl md:text-4xl ${currentTheme.text} ${currentTheme.font} leading-relaxed`}>
          "{data.mensaje}"
        </p>
      </motion.div>

      {/* Fecha Especial */}
      {data.fecha_especial && (
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          className="flex items-center gap-4 px-8 py-4 rounded-full bg-white/60 backdrop-blur-md shadow-lg z-10 border border-white/40"
        >
          <Calendar className={currentTheme.accent} size={24} />
          <div className="text-left">
            <p className="text-[10px] uppercase font-black text-slate-400 tracking-tighter">Nuestra fecha especial</p>
            <p className={`text-xl ${currentTheme.font} ${currentTheme.text}`}>
              {new Date(data.fecha_especial).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </motion.div>
      )}

      <footer className={`mt-24 opacity-40 text-[10px] uppercase tracking-[0.4em] ${currentTheme.text} font-bold`}>
        RomanticLinks &bull; {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default ViewDedication;