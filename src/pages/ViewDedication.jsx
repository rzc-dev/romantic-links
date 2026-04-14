import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { motion } from 'framer-motion';
import { Heart, Calendar, Stars, Moon, Flower2, Gift, Snowflake } from 'lucide-react';
import confetti from 'canvas-confetti';

// 1. CONFIGURACIÓN DE LOS 5 TEMAS
const themes = {
  romantic: {
    bg: "bg-love-50",
    card: "bg-white border-love-200",
    text: "text-slate-800",
    secondaryText: "text-slate-500",
    accent: "text-love-500",
    font: "font-romantic",
    icon: Heart
  },
  midnight: {
    bg: "bg-midnight-900",
    card: "bg-midnight-700/50 border-gold-400/30 backdrop-blur-md",
    text: "text-white",
    secondaryText: "text-slate-400",
    accent: "text-gold-400",
    font: "font-serif",
    icon: Moon
  },
  sunset: {
    bg: "bg-gradient-to-br from-orange-400 via-rose-400 to-purple-500",
    card: "bg-white/70 border-white/30 backdrop-blur-sm",
    text: "text-orange-950",
    secondaryText: "text-rose-900/70",
    accent: "text-purple-700",
    font: "font-sans",
    icon: Stars
  },
  flowers: {
    bg: "bg-sunflower-100",
    card: "bg-white border-sunflower-200 shadow-xl",
    text: "text-sunflower-700",
    secondaryText: "text-sunflower-500",
    accent: "text-sunflower-500",
    font: "font-romantic",
    icon: Flower2
  },
  christmas: {
    bg: "bg-xmas-100",
    card: "bg-white border-xmas-600 shadow-xmas",
    text: "text-xmas-700",
    secondaryText: "text-slate-500",
    accent: "text-xmas-600",
    font: "font-xmas",
    icon: Gift
  }
};

const ViewDedication = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('dedicatorias')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setData(data);
        
        // Efecto especial según el tema
        if (data.tema === 'christmas') {
            // Efecto de nieve para Navidad
            const duration = 5 * 1000;
            const animationEnd = Date.now() + duration;
            const interval = setInterval(function() {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);
                confetti({ particleCount: 40, startVelocity: 0, ticks: 200, origin: { x: Math.random(), y: Math.random() - 0.2 }, colors: ['#ffffff'], shapes: ['circle'], gravity: 0.5 });
            }, 250);
        } else {
            // Confeti normal
            confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        }
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }}>
        <Heart className="text-love-500" size={40} />
      </motion.div>
    </div>
  );

  if (!data) return <div className="min-h-screen flex items-center justify-center">No se encontró la dedicatoria.</div>;

  const currentTheme = themes[data.tema] || themes.romantic;
  const ThemeIcon = currentTheme.icon;

  return (
    <div className={`min-h-screen ${currentTheme.bg} py-12 px-4 transition-all duration-1000 flex flex-col items-center overflow-hidden relative`}>
      
      {/* Decoración extra para Navidad */}
      {data.tema === 'christmas' && <Snowflake className="absolute top-5 right-5 text-white/40 animate-spin-slow" size={80} />}

      {/* Cabecera */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }} 
        animate={{ opacity: 1, y: 0 }} 
        className="text-center mb-12 z-10"
      >
        <ThemeIcon className={`mx-auto ${currentTheme.accent} mb-4 animate-pulse`} size={64} fill="currentColor" />
        <h1 className={`text-5xl md:text-7xl ${currentTheme.font} ${currentTheme.text} mb-2`}>
          Para: {data.nombre_destinatario}
        </h1>
        <p className={`${currentTheme.secondaryText} text-lg font-medium tracking-widest italic`}>
          De: {data.nombre_remitente}
        </p>
      </motion.div>

      {/* Fotos Estilo Polaroid */}
      {data.imagenes?.length > 0 && (
        <div className="flex flex-wrap justify-center gap-6 mb-16 max-w-6xl z-10 px-4">
          {data.imagenes.map((url, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8, rotate: index % 2 === 0 ? -3 : 3 }}
              whileInView={{ opacity: 1, scale: 1, rotate: index % 2 === 0 ? -2 : 2 }}
              viewport={{ once: true }}
              className="bg-white p-3 pb-12 shadow-2xl rounded-sm border border-slate-100"
            >
              <img src={url} className="w-64 h-64 object-cover" alt="Recuerdo" />
            </motion.div>
          ))}
        </div>
      )}

      {/* Mensaje */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }} 
        whileInView={{ y: 0, opacity: 1 }} 
        viewport={{ once: true }}
        className={`max-w-3xl w-full ${currentTheme.card} p-10 md:p-16 rounded-[2rem] shadow-2xl text-center mb-12 border-b-8 z-10`}
      >
        <p className={`text-2xl md:text-3xl ${currentTheme.text} ${currentTheme.font} leading-relaxed`}>
          "{data.mensaje}"
        </p>
      </motion.div>

      {/* Fecha Especial */}
      {data.fecha_especial && (
        <motion.div 
          initial={{ opacity: 0 }} 
          whileInView={{ opacity: 1 }} 
          className={`flex items-center gap-4 px-8 py-4 rounded-full bg-white/50 backdrop-blur-md shadow-lg z-10`}
        >
          <Calendar className={currentTheme.accent} />
          <div className="text-left">
            <p className="text-[10px] uppercase font-black text-slate-400">Nuestra fecha</p>
            <p className={`text-xl ${currentTheme.font} ${currentTheme.text}`}>
              {new Date(data.fecha_especial).toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>
        </motion.div>
      )}

      <footer className={`mt-20 opacity-40 text-[10px] uppercase tracking-[0.3em] ${currentTheme.text}`}>
        Hecho con amor • RomanticLinks {new Date().getFullYear()}
      </footer>
    </div>
  );
};

export default ViewDedication;