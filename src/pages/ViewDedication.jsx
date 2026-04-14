import { useState } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabase';
import { 
  Heart, Upload, Send, Loader2, CheckCircle2, 
  Copy, Share2, Moon, Stars, Flower2, Gift, Music 
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
    tema: 'romantic',
    youtube_url: '' 
  });

  const themeOptions = [
    { id: 'romantic', label: 'San Valentín', icon: Heart },
    { id: 'midnight', label: 'Elegante', icon: Moon },
    { id: 'sunset', label: 'Aniversario', icon: Stars },
    { id: 'flowers', label: 'Flores Amarillas', icon: Flower2 },
    { id: 'christmas', label: 'Navidad', icon: Gift },
  ];

  const handleSubmit = async (e) => {
    // 1. Evitamos que la página se recargue
    if (e) e.preventDefault();
    setLoading(true);

    try {
      const imageUrls = [];

      // 2. Subida de imágenes (solo si hay archivos) con nombres únicos
      if (files.length > 0) {
        for (const file of files) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${crypto.randomUUID()}.${fileExt}`;
          const { error: uploadError } = await supabase.storage
            .from('fotos-amor')
            .upload(fileName, file);

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('fotos-amor')
            .getPublicUrl(fileName);

          imageUrls.push(publicUrl);
        }
      }

      // 3. Inserción en la base de datos
      const { data, error: dbError } = await supabase
        .from('dedicatorias')
        .insert([{
          nombre_remitente: formData.nombre_remitente,
          nombre_destinatario: formData.nombre_destinatario,
          mensaje: formData.mensaje,
          fecha_especial: formData.fecha_especial || null,
          imagenes: imageUrls,
          tema: formData.tema,
          youtube_url: formData.youtube_url
        }])
        .select()
        .single();

      if (dbError) throw dbError;

      if (data) {
        // GENERACIÓN DEL LINK: Usamos origin para asegurar que sea dominio.com/love/id
        const baseUrl = window.location.origin; 
        const link = `${baseUrl}/love/${data.id}`;
        setGeneratedLink(link);
        
        // Efecto de éxito
        confetti({ 
            particleCount: 150, 
            spread: 70, 
            origin: { y: 0.6 },
            colors: ['#f43f5e', '#fbbf24', '#ffffff']
        });
      }

    } catch (error) {
      console.error("Error detallado:", error);
      alert("Error: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-love-50 py-12 px-4 flex items-center justify-center font-sans text-slate-900">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl w-full bg-white rounded-[2.5rem] shadow-2xl p-8 md:p-12 relative overflow-hidden border border-love-100"
      >
        <header className="flex items-center gap-4 mb-10">
          <div className="bg-love-500 p-3 rounded-2xl shadow-lg shadow-love-200">
            <Heart className="text-white" fill="currentColor" size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-romantic leading-none">Romantic Links</h2>
            <p className="text-slate-400 text-[10px] mt-1 uppercase font-black tracking-widest">Crea un momento inolvidable</p>
          </div>
        </header>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input 
              required
              className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-love-300 focus:bg-white outline-none transition-all font-medium"
              placeholder="Tu nombre"
              value={formData.nombre_remitente}
              onChange={(e) => setFormData({...formData, nombre_remitente: e.target.value})}
            />
            <input 
              required
              className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-love-300 focus:bg-white outline-none transition-all font-medium"
              placeholder="Su nombre"
              value={formData.nombre_destinatario}
              onChange={(e) => setFormData({...formData, nombre_destinatario: e.target.value})}
            />
          </div>

          <textarea 
            required
            rows="3"
            className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-love-300 focus:bg-white outline-none transition-all resize-none font-medium"
            placeholder="Escribe tu mensaje aquí..."
            value={formData.mensaje}
            onChange={(e) => setFormData({...formData, mensaje: e.target.value})}
          ></textarea>

          <div className="space-y-2">
            <div className="flex items-center gap-2 ml-1 text-love-400">
              <Music size={14} />
              <p className="text-[10px] font-black uppercase tracking-widest">Música de fondo (Link de YouTube)</p>
            </div>
            <input 
              className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-love-300 focus:bg-white outline-none transition-all text-sm font-medium"
              placeholder="https://www.youtube.com/watch?v=..."
              value={formData.youtube_url}
              onChange={(e) => setFormData({...formData, youtube_url: e.target.value})}
            />
          </div>

          <div className="space-y-3">
            <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest ml-1">Selecciona un estilo</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {themeOptions.map((theme) => {
                const Icon = theme.icon;
                const isSelected = formData.tema === theme.id;
                return (
                  <button
                    key={theme.id}
                    type="button"
                    onClick={() => setFormData({...formData, tema: theme.id})}
                    className={`flex flex-col items-center p-3 rounded-2xl border-2 transition-all ${
                      isSelected 
                        ? 'border-love-500 bg-love-50 text-love-600 shadow-sm' 
                        : 'border-slate-50 bg-slate-50 text-slate-400 hover:border-love-100'
                    }`}
                  >
                    <Icon size={20} className="mb-1" />
                    <span className="text-[9px] font-black uppercase">{theme.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
                <p className="text-[9px] font-black text-slate-300 uppercase ml-1">Fecha (Opcional)</p>
                <input 
                  type="date"
                  value={formData.fecha_especial}
                  className="w-full p-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:border-love-300 outline-none transition-all text-slate-500 text-sm"
                  onChange={(e) => setFormData({...formData, fecha_especial: e.target.value})}
                />
            </div>
            <div className="flex items-center justify-center p-4 rounded-2xl border-2 border-dashed border-love-200 relative group hover:bg-love-50 transition-colors cursor-pointer mt-4 md:mt-0">
                <Upload size={18} className="text-love-400 mr-2" />
                <span className="text-xs font-bold text-slate-400">
                    {files.length > 0 ? `${files.length} fotos listas` : "Subir fotos"}
                </span>
                <input 
                    type="file" multiple accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={(e) => setFiles(Array.from(e.target.files).slice(0, 5))}
                />
            </div>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-slate-900 text-white py-4 rounded-2xl font-bold shadow-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" /> : <><Send size={18} /> Crear Link Mágico</>}
          </button>
        </form>

        {/* Modal de éxito */}
        {generatedLink && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="absolute inset-0 bg-white/95 backdrop-blur-sm flex items-center justify-center p-6 z-50"
          >
            <div className="text-center w-full max-w-sm">
              <div className="w-16 h-16 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-3xl font-romantic text-slate-800 mb-2">¡Sorpresa creada!</h3>
              <p className="text-slate-500 text-sm mb-4">Copia el link y envíaselo por WhatsApp</p>
              <div className="bg-slate-100 p-4 rounded-xl mb-6 font-mono text-[10px] break-all text-slate-500 border border-slate-200 select-all">
                {generatedLink}
              </div>
              <div className="grid gap-2">
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(generatedLink);
                    alert("¡Copiado con éxito!");
                  }}
                  className="w-full bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2"
                >
                  <Copy size={16} /> Copiar enlace
                </button>
                <a 
                  href={`https://wa.me/?text=He hecho esto pensando en ti... míralo aquí: ${generatedLink}`}
                  target="_blank" rel="noreferrer"
                  className="w-full bg-[#25D366] text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-center"
                >
                  <Share2 size={16} /> WhatsApp
                </a>
                <button onClick={() => setGeneratedLink('')} className="text-[10px] text-slate-300 font-black uppercase mt-4 hover:text-love-500 transition-colors">
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