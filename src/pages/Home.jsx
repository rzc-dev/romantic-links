import { motion } from 'framer-motion';
import { Heart, Stars, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-gradient-to-br from-love-50 to-red-100">
      
      {/* Elementos flotantes de fondo */}
      <motion.div 
        animate={{ y: [0, -20, 0], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 5, repeat: Infinity }}
        className="absolute top-10 left-10 text-love-300"
      >
        <Heart size={48} fill="currentColor" />
      </motion.div>

      <motion.div 
        animate={{ y: [0, 20, 0], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 7, repeat: Infinity, delay: 1 }}
        className="absolute bottom-20 right-10 text-love-200"
      >
        <Heart size={64} fill="currentColor" />
      </motion.div>

      {/* Contenido Principal */}
      <main className="z-10 text-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="flex justify-center mb-6">
            <div className="bg-white p-4 rounded-full shadow-lg text-love-500">
              <Stars size={40} />
            </div>
          </div>

          <h1 className="text-5xl md:text-7xl font-romantic text-slate-900 mb-6">
            Escribe tu propia <span className="text-love-500">historia de amor</span>
          </h1>
          
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed">
            Crea una página web personalizada para tu persona favorita. 
            Sube fotos, añade música y cuenta cuánto tiempo llevan juntos.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/create">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-love-500 hover:bg-love-600 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-love-200 flex items-center justify-center gap-2 transition-colors"
              >
                Crear dedicatoria gratis
                <ArrowRight size={20} />
              </motion.button>
            </Link>
          </div>
        </motion.div>
      </main>

      {/* Footer sencillo */}
      <footer className="absolute bottom-8 text-slate-400 text-sm">
        Hecho con ❤️ para momentos especiales
      </footer>
    </div>
  );
};

export default Home;