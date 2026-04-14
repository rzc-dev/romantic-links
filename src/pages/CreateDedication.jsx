import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  Heart, Upload, Send, Loader2, CheckCircle2, 
  Copy, Share2, Moon, Stars, Flower2, Gift 
} from 'lucide-react';
import confetti from 'canvas-confetti';

const CreateDedication = () => {
  const [loading, setLoading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [files, setFiles] = useState([]);
  const [formData, setFormData] = useState({
    nombre_remitente: '',
    nombre_destinatario: '',
    mensaje: '',
    fecha_especial: '',
    tema: 'romantic'
  });

  const themeOptions = [
    { id: 'romantic', label: 'San Valentín', icon: Heart, desc: 'Clásico Rosa' },
    { id: 'midnight', label: 'Elegante', icon: Moon, desc: 'Noche y Oro' },
    { id: 'sunset', label: 'Aniversario', icon: Stars, desc: 'Cálido Gradiente' },
    { id: 'flowers', label: 'Flores Amarillas', icon: Flower2, desc: 'Alegre y Brillante' },
    { id: 'christmas', label: 'Navidad', icon: Gift, desc: 'Festivo Mágico' },
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = [];

      // 1. Subir imágenes al Bucket 'fotos-amor'
      for (const file of files) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const { error: uploadError } = await supabase.storage
          .from('fotos-amor')
          .upload(fileName, file);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('fotos-amor')
          .getPublicUrl(fileName);

        imageUrls.push(publicUrl);
      }

      // 2. Insertar datos en la tabla 'dedicatorias'
      const { data, error: dbError } = await supabase
        .from('dedicatorias')
        .insert([{
          nombre_remitente: formData.nombre_remitente,
          nombre_destinatario: formData.nombre_destinatario,
          mensaje: formData.mensaje,
          fecha_especial: formData.fecha_especial || null,
          imagenes: imageUrls,
          tema: formData.tema
        }])
        .select();

      if (dbError) throw dbError;

      // 3. Éxito y Confeti
      if (data && data[0]) {
        const link = `https://romantic-links-rzc-dev.vercel.app/love/${data[0].id}`;
        setGeneratedLink(link);
        
        const colors = formData.tema === 'midnight' ? ['#fbbf24', '#ffffff'] : ['#f43f5e', '#ffffff'];
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 }, colors });
      }

    } catch (error) {
      console.error(error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-love-50 py-12 px-4 flex items-center justify-center font-sans">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-3xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative overflow-hidden"
      >
        <div className="flex items-center gap-4 mb-10">
          <div className="bg-love-100 p-3 rounded-2xl">
            <Heart className="text-love-500" fill="currentColor" size={32} />
          </div>
          <div>
            <h2 className="text-3xl font-romantic text-slate-800 leading-none">Romantic Links</h2>
            <p className="text-slate-400 text-sm mt-1 uppercase tracking-widest font-bold">Crea un momento eterno</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Nombres */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Tu nombre</label>
              <input 
                required
                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-love-300 focus:bg-white outline-none transition-all"
                placeholder="Ej. Roberto"
                onChange={(e) => setFormData({...formData, nombre_remitente: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Su nombre</label>
              <input 
                required
                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-love-300 focus:bg-white outline-none transition-all"
                placeholder="Ej. Elizabeth"
                onChange={(e) => setFormData({...formData, nombre_destinatario: e.target.value})}
              />
            </div>
          </div>

          {/* Mensaje */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Tu dedicatoria</label>
            <textarea 
              required
              rows="4"
              className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-love-300 focus:bg-white outline-none transition-all resize-none"
              placeholder="Escribe aquí lo que dicta tu corazón..."
              onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
            ></textarea>
          </div>

          {/* Selector de Temas Visual */}
          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Elige el ambiente</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {themeOptions.map((theme) => {
                const Icon = theme.icon;
                const isSelected = formData.tema === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setFormData({...formData, tema: theme.id})}
                    className={`flex flex-col items-center p-4 rounded-2xl border-2 transition-all ${
                      isSelected 
                        ? 'border-love-500 bg-love-50 text-love-600 shadow-md scale-105' 
                        : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-slate-200'
                    }`}
                  >
                    <Icon size={24} className="mb-2" />
                    <span className="text-[10px] font-black uppercase tracking-tight leading-none mb-1">{theme.label}</span>
                    <span className="text-[8px] opacity-60 text-center leading-tight">{theme.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
            {/* Fecha */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Fecha especial (Opcional)</label>
              <input 
                type="date"
                className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-love-300 focus:bg-white outline-none transition-all text-slate-500"
                onChange={(e) => setFormData({...formData, fecha_especial: e.target.value})}
              />
            </div>

            {/* Fotos */}
            <div className="relative group">
              <input 
                type="file" multiple accept="image/*"
                className="absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))}
              />
              <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-dashed border-love-200 group-hover:bg-love-50 transition-colors">
                <Upload className="text-love-400" size={20} />
                <span className="text-sm font-bold text-slate-400">
                  {files.length > 0 ? `${files.length} fotos listas` : "Subir recuerdos"}
                </span>
              </div>
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-5 rounded-[1.5rem] font-bold text-lg shadow-xl hover:bg-black transition-all flex items-center justify-center gap-3 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Send size={20} /> Generar Mi Página Mágica</>}
          </button>
        </form>

        {/* Modal de Éxito */}
        {generatedLink && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/98 backdrop-blur-md flex items-center justify-center p-8 z-50"
          >
            <div className="text-center max-w-sm w-full">
              <div className="bg-green-100 text-green-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                <CheckCircle2 size={40} />
              </div>
              <h3 className="text-4xl font-romantic text-slate-800 mb-2">¡Todo listo!</h3>
              <p className="text-slate-400 text-sm mb-8">El link de tu sorpresa ya está disponible.</p>
              
              <div className="bg-slate-50 p-4 rounded-2xl mb-6 break-all font-mono text-xs border-2 border-slate-100 text-slate-600 select-all">
                {generatedLink}
              </div>

              <div className="flex flex-col gap-3">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    alert("¡Copiado al portapapeles!");
                  }}
                  className="flex items-center justify-center gap-2 bg-slate-900 text-white py-4 rounded-2xl font-bold hover:shadow-lg transition-all"
                >
                  <Copy size={18} /> Copiar Link
                </button>
                <a 
                  href={`https://wa.me/?text=He creado algo especial para ti, míralo aquí: ${generatedLink}`}
                  target="_blank" rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#25D366] text-white py-4 rounded-2xl font-bold hover:opacity-90 transition-all"
                >
                  <Share2 size={18} /> Enviar a WhatsApp
                </a>
                <button onClick={() => setGeneratedLink('')} className="text-slate-300 text-xs mt-4 hover:text-love-400 font-bold uppercase tracking-widest">
                  Crear otra dedicatoria
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CreateDedication;