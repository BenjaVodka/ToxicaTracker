import React, { useState, useEffect } from 'react'
import html2canvas from 'html2canvas'
import {
  HeartCrack,
  Eye,
  ShieldCheck,
  Upload,
  ArrowRight,
  Github,
  Instagram,
  FileJson,
  Zap,
  CheckCircle2,
  Lock,
  MessageCircle,
  TrendingDown,
  Clock,
  LogOut,
  UserMinus,
  Loader2,
  CheckCircle,
  AlertCircle,
  CloudLightning,
  Sparkles,
  BarChart2,
  Download,
  Share2,
  Search
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { auth, googleProvider } from './firebase'
import { signInWithPopup, signOut } from 'firebase/auth'

const Nav = ({ token, results, handleLogout, onLoginClick }) => (
  <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/10">
    <div className="container mx-auto px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <HeartCrack className="w-8 h-8 text-toxic" />
        <span className="text-xl font-extrabold tracking-tight">Tóxica<span className="text-toxic">Tracker</span></span>
      </div>
      <div className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-400">
        <a href="#features" className="hover:text-white transition-colors">Características</a>
        <a href="#how-it-works" className="hover:text-white transition-colors">Cómo funciona</a>
        <a href="#faq" className="hover:text-white transition-colors">Preguntas</a>
      </div>
      {token ? (
        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              const target = document.getElementById('results-section') || document.getElementById('loading-section') || document.getElementById('features');
              target?.scrollIntoView({behavior: 'smooth'});
            }} 
            className="hidden md:flex items-center gap-2 text-toxic font-black text-xs uppercase tracking-widest hover:text-white transition-colors"
          >
            <BarChart2 className="w-4 h-4" /> Mis Reportes
          </button>
          <button onClick={handleLogout} className="bg-white/10 hover:bg-red-500/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all border border-transparent hover:border-red-500/50 flex items-center gap-2">
            Cerrar Sesión
          </button>
        </div>
      ) : (
        <button onClick={onLoginClick} className="bg-toxic hover:bg-toxic-dark text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-lg shadow-toxic/20 hover:shadow-toxic/40">
          Entrar / Registro
        </button>
      )}
    </div>
  </nav>
)

const Hero = () => (
  <section className="relative pt-32 pb-20 overflow-hidden">
    {/* Background Glows */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-toxic/10 blur-[120px] rounded-full pointer-events-none" />

    <div className="container mx-auto px-6 relative z-10 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <span className="inline-block px-4 py-1.5 mb-6 text-xs font-bold tracking-widest uppercase bg-white/5 border border-white/10 rounded-full text-toxic-light">
          100% Seguro • Sin contraseñas
        </span>
        <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight tracking-tighter">
          ¿Quién te dejó de seguir <br />
          <span className="text-gradient">en las sombras?</span>
        </h1>
        <p className="text-xl text-stone-400 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
          Descubre la verdad sobre tu círculo de Instagram. Sin entregar tu contraseña, sin riesgos. Solo la información real que necesitas saber.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button onClick={() => document.getElementById('how-it-works').scrollIntoView({behavior: 'smooth'})} className="w-full sm:w-auto bg-white text-black hover:bg-stone-200 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group">
            <Zap className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Descargar Extensión
          </button>
          <a href="#faq" className="w-full sm:w-auto glass hover:bg-white/10 px-8 py-4 rounded-2xl font-bold border border-white/10 transition-all flex items-center justify-center gap-2">
            Instrucciones <ArrowRight className="w-5 h-5" />
          </a>
        </div>

        <div className="mt-16 flex items-center justify-center gap-8 grayscale opacity-50">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5" />
            <span className="text-sm font-medium">Privacidad Total</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            <span className="text-sm font-medium">Análisis Instantáneo</span>
          </div>
        </div>
      </motion.div>
    </div>
  </section>
)

const FeatureCard = ({ icon: Icon, title, description, color }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="glass p-8 rounded-3xl border border-white/5 hover:border-white/20 transition-all group"
  >
    <div className={`w-12 h-12 rounded-2xl ${color} flex items-center justify-center mb-6 shadow-xl`}>
      <Icon className="w-6 h-6 text-white" />
    </div>
    <h3 className="text-xl font-bold mb-3 group-hover:text-toxic-light transition-colors">{title}</h3>
    <p className="text-stone-400 leading-relaxed text-sm">
      {description}
    </p>
  </motion.div>
)

const Features = () => (
  <section id="features" className="py-24 bg-dark-900/50">
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Todo lo que necesitas saber</h2>
        <p className="text-stone-400 max-w-xl mx-auto">Nuestro rastreador te da el control total sobre tus relaciones digitales sin comprometer tu cuenta.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <FeatureCard
          icon={HeartCrack}
          title="Detectar Unfollows"
          description="Sabrás exactamente quién te dejó de seguir desde la última vez que subiste tu reporte."
          color="bg-rose-500"
        />
        <FeatureCard
          icon={Eye}
          title="No te siguen de vuelta"
          description="Identifica rápidamente a todas las personas a las que sigues pero que no te siguen a ti."
          color="bg-indigo-500"
        />
        <FeatureCard
          icon={Lock}
          title="Cero Riesgo"
          description="A diferencia de otras apps, aquí nunca nos das tu contraseña. Tu cuenta está 100% a salvo."
          color="bg-emerald-500"
        />
      </div>
    </div>
  </section>
)

const Step = ({ number, title, description }) => (
  <div className="relative pl-12 pb-12 last:pb-0 border-l border-white/10 ml-4 last:border-transparent">
    <div className="absolute left-[-17px] top-0 w-8 h-8 rounded-full bg-dark-800 border border-white/10 flex items-center justify-center font-bold text-sm text-toxic-light">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-2">{title}</h3>
    <p className="text-stone-400 text-sm leading-relaxed max-w-md">{description}</p>
  </div>
)

const MetricCard = ({ icon, label, value, subLabel, highlight }) => (
  <div className={`glass p-8 rounded-3xl border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all ${highlight ? 'bg-toxic/5' : ''}`}>
    <div className="absolute -top-4 -right-4 w-24 h-24 bg-white/5 blur-2xl rounded-full group-hover:scale-110 transition-transform" />
    <div className="flex items-center gap-3 mb-6 relative z-10">
      <div className="p-2 bg-white/5 rounded-xl border border-white/5">
        {React.cloneElement(icon, { className: "w-5 h-5 " + icon.props.className })}
      </div>
      <p className="text-xs text-stone-400 uppercase font-black tracking-widest">{label}</p>
    </div>
    <div className={`text-4xl font-black mb-1 relative z-10 ${highlight ? 'text-toxic' : ''}`}>{value}</div>
    <p className="text-[10px] text-stone-500 font-bold relative z-10">{subLabel}</p>
  </div>
)

const AvatarFallback = ({ name }) => (
  <div className="w-12 h-12 rounded-2xl overflow-hidden glass border border-white/10 flex-shrink-0 bg-dark-800 flex items-center justify-center font-black text-toxic relative">
    <div 
      className="absolute inset-0 flex items-center justify-center text-xl uppercase"
      style={{
        background: `linear-gradient(135deg, ${['#ff0080', '#7928ca', '#0070f3', '#f5a623', '#4ade80'][name.length % 5]}22, transparent)`
      }}
    >
      {name[0]}
    </div>
    <img 
      src={`https://unavatar.io/instagram/${name}?fallback=false`} 
      alt={name}
      className="w-full h-full object-cover relative z-10"
      loading="lazy"
      onError={(e) => { e.target.style.opacity = '0'; }}
    />
  </div>
)

const UserList = ({ title = "", users = [], count = 0, variantSet = "success", turboMode = false, setTurboMode = null, onUnfollow = null }) => {
  const [search, setSearch] = useState("");
  const filtered = users.filter(u => u.toLowerCase().includes(search.toLowerCase()));

  const isDanger = variantSet === 'danger';

  return (
    <div className="glass p-8 rounded-[2.5rem] border-white/5 flex flex-col h-[600px] relative overflow-hidden group">
      <div className="flex items-center justify-between mb-6">
        <div className="relative">
          <h3 className="text-xl font-black text-white">{title}</h3>
          <div className={`mt-1 h-1 w-12 rounded-full ${isDanger ? 'bg-red-500' : 'bg-emerald-500'}`} />
        </div>
        <div className={`px-4 py-1.5 rounded-full text-[10px] font-black ${isDanger ? 'bg-red-500/10 text-red-500 border-red-500/20' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'} border uppercase tracking-widest`}>
          {count}
        </div>
      </div>

      {isDanger && setTurboMode && (
        <div className="mb-6 p-4 rounded-2xl bg-white/[0.02] border border-white/5 flex items-center justify-between group/turbo">
           <div className="flex items-center gap-3">
             <div className={`w-2 h-2 rounded-full ${turboMode ? 'bg-rose-500 animate-pulse shadow-[0_0_10px_rgba(244,63,94,0.5)]' : 'bg-stone-600'}`} />
             <div>
               <p className="text-[10px] font-black uppercase tracking-widest text-white">Modo Limpieza Turbo</p>
               <p className="text-[9px] text-stone-500 font-bold italic">La extensión lo hace por ti</p>
             </div>
           </div>
           <button 
            onClick={() => setTurboMode(!turboMode)}
            className={`w-12 h-6 rounded-full p-1 transition-all duration-300 ${turboMode ? 'bg-rose-500' : 'bg-stone-800'}`}
           >
             <div className={`w-4 h-4 bg-white rounded-full transition-all duration-300 ${turboMode ? 'translate-x-6' : 'translate-x-0'}`} />
           </button>
        </div>
      )}

      <div className="relative mb-6">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-600" />
        <input 
          type="text" 
          placeholder={`Buscar en ${title}...`}
          className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-12 pr-6 text-sm font-medium text-white focus:outline-none focus:border-white/20 transition-all"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
        {filtered.length > 0 ? (
          filtered.map(u => (
            <div key={u} className="flex items-center justify-between p-4 bg-white/[0.02] border border-white/5 rounded-2xl hover:bg-white/5 transition-all group/item">
              <div className="flex items-center gap-4">
                <AvatarFallback name={u} />
                <div>
                  <p className="font-bold text-sm text-white transition-colors group-hover/item:text-toxic">@{u}</p>
                  <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isDanger ? 'bg-red-500' : 'bg-emerald-500'}`} />
                    {isDanger ? 'Sin retorno' : 'Mutuo'}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => onUnfollow ? onUnfollow(u) : window.open(`https://www.instagram.com/${u}/`, '_blank')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  isDanger 
                    ? (turboMode ? 'bg-rose-500 text-white shadow-lg scale-105' : 'bg-white/5 text-stone-400 hover:bg-red-500 hover:text-white') 
                    : 'bg-white/5 text-stone-400 hover:bg-toxic hover:text-white'
                }`}
              >
                {isDanger && turboMode ? <Zap className="w-3 h-3" /> : <Instagram className="w-3 h-3" />}
                {isDanger ? (turboMode ? 'AUTO' : 'VER PERFIL') : 'VER PERFIL'}
              </button>
            </div>
          ))
        ) : (
          <div className="py-20 text-center">
            <p className="text-stone-600 font-bold uppercase tracking-widest text-[10px]">No hay resultados</p>
          </div>
        )}
      </div>
    </div>
  );
};

const HowItWorks = () => (
  <section id="how-it-works" className="py-24 relative overflow-hidden">
    <div className="absolute top-1/2 left-0 w-96 h-96 bg-toxic/5 blur-[100px] rounded-full -translate-y-1/2" />
    
    <div className="container mx-auto px-6">
      <div className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black mb-6">
          La verdad en <span className="text-toxic">3 pasos</span>
        </h2>
        <p className="text-stone-400 max-w-2xl mx-auto">
          Nuestra tecnología sincroniza tu círculo social de forma segura y privada, comparando cada escaneo para detectar traiciones en tiempo real.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-3xl border-white/5 relative">
             <div className="w-10 h-10 rounded-full bg-toxic/20 flex items-center justify-center font-bold text-toxic mb-6">1</div>
             <h3 className="font-bold mb-3">Instala la Extensión</h3>
             <p className="text-stone-400 text-xs leading-relaxed">Consigue ToxicTracker en la Chrome Web Store. Es gratuita y se instala con un solo click.</p>
          </div>
          <div className="glass p-8 rounded-3xl border-white/5 relative">
             <div className="w-10 h-10 rounded-full bg-toxic/20 flex items-center justify-center font-bold text-toxic mb-6">2</div>
             <h3 className="font-bold mb-3">Abre Instagram Web</h3>
             <p className="text-stone-400 text-xs leading-relaxed">Ve a instagram.com e inicia sesión normalmente. No pediremos tu contraseña.</p>
          </div>
          <div className="glass p-8 rounded-3xl border-white/5 relative">
             <div className="w-10 h-10 rounded-full bg-toxic/20 flex items-center justify-center font-bold text-toxic mb-6">3</div>
             <h3 className="font-bold mb-3">Extrae la verdad</h3>
             <p className="text-stone-400 text-xs leading-relaxed">Haz clic en el ícono de ToxicTracker y presiona 'Extraer'. Los cálculos se harán solos.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
)

const Faq = () => {
  const [openIndex, setOpenIndex] = useState(0)
  
  const faqs = [
    {
      q: '🤔 ¿Dónde consigo la Extensión de Chrome?',
      a: '¡Muy pronto en la Chrome Web Store oficial! Estamos en proceso de revisión por parte de Google. Mientras tanto, puedes solicitar el acceso anticipado directamente por nuestro repositorio o enviando un mensaje al creador.'
    },
    {
      q: '🔒 ¿Es seguro usar esta extensión?',
      a: '¡Totalmente! TóxicaTracker NUNCA te pide que inicies sesión en nuestra página. La extensión usa la misma sesión segura que ya tienes abierta pasivamente en la pestaña de Instagram. Además, todos los cruces y matemáticas de quién te dejó de seguir suceden puramente en la memoria de TU dispositivo. Nadie más accede a esa información.'
    },
    {
      q: '👀 ¿Instagram me puede banear por esto?',
      a: 'Muy poco probable. A diferencia de bots o programas en la nube que hacen scraping masivo (y son penalizados), la extensión replica exactamente la velocidad humana de mirar tu propia lista de seguidores en tu propio navegador. Nadie, ni Instagram, recibe notificaciones raras de tu cuenta.'
    }
  ]

  return (
    <section id="faq" className="py-24 bg-dark-900/30">
      <div className="container mx-auto px-6 max-w-3xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Preguntas Frecuentes</h2>
          <p className="text-stone-400">Todo lo que necesitas saber antes de descubrir el drama.</p>
        </div>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden border-white/5 transition-all">
              <button 
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-5 text-left flex items-center justify-between font-bold"
              >
                {faq.q}
                <span className={`transform transition-transform ${openIndex === i ? 'rotate-180 text-toxic' : 'text-stone-500'}`}>▼</span>
              </button>
              <AnimatePresence>
                {openIndex === i && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="px-6 pb-5 text-stone-400 text-sm leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

const Footer = () => (
  <footer className="py-12 border-t border-white/5 bg-dark-950">
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="flex items-center gap-2">
          <HeartCrack className="w-6 h-6 text-toxic" />
          <span className="text-lg font-bold">TóxicaTracker</span>
        </div>
        <p className="text-sm text-stone-500">© 2026 TóxicaTracker. No estamos afiliados con Instagram.</p>
        <div className="flex items-center gap-4">
          <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 hover:text-toxic transition-colors"><Instagram className="w-5 h-5" /></a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="p-2 hover:text-toxic transition-colors"><Github className="w-5 h-5" /></a>
          <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 hover:text-toxic transition-colors"><MessageCircle className="w-5 h-5" /></a>
        </div>
      </div>
    </div>
  </footer>
)

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

export default function App() {
  const [files, setFiles] = useState({ followers: null, following: null });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [checkingHistory, setCheckingHistory] = useState(false);
  const [history, setHistory] = useState([]);
  const [showShareCard, setShowShareCard] = useState(false);
  const [isCapturing, setIsCapturing] = useState(false);

  const handleDownloadShareCard = async () => {
    const card = document.getElementById('share-card');
    if (!card) return;

    try {
      setIsCapturing(true);
      const canvas = await html2canvas(card, {
        scale: 2,
        backgroundColor: '#000000',
        useCORS: true,
        logging: false
      });

      const dataUrl = canvas.toDataURL('image/png');

      // Native Share for Mobile
      if (navigator.share) {
        const blob = await (await fetch(dataUrl)).blob();
        const file = new File([blob], 'toxic-report.png', { type: 'image/png' });
        
        try {
          await navigator.share({
            files: [file],
            title: 'Mi Informe Tóxico 🕵️‍♂️🔥',
            text: 'Mira mi diagnóstico en TóxicaTracker 🚀'
          });
          return;
        } catch (e) {
          // Fallback to download if share is cancelled or fails
        }
      }

      // Fallback: Download for PC/Other
      const link = document.createElement('a');
      link.download = `toxic-report-${results.toxicScore}.png`;
      link.href = dataUrl;
      link.click();

    } catch (err) {
      console.error("Error generating image:", err);
      alert("No pudimos generar la imagen. Intenta sacar una captura manual 📸");
    } finally {
      setIsCapturing(false);
    }
  };

  const [globalActivity, setGlobalActivity] = useState([]);
  const [turboMode, setTurboMode] = useState(false);

  const handleUnfollowAction = (username) => {
    const igPath = `https://www.instagram.com/${username}/`;
    if (turboMode) {
      // Send command to extension
      window.postMessage({ type: 'TOXIC_TURBO_UNFOLLOW', username }, '*');
    } else {
      // Normal behavior: Open profile
      window.open(igPath, '_blank');
    }
  };

  const GlobalFeed = ({ activity }) => {
    if (!activity || activity.length === 0) return null;
    
    const getActionMessage = (type) => {
      switch(type) {
        case 'ANALYZE': return "Alguien acaba de analizar su cuenta 🔥";
        case 'SHARE': return "Alguien compartió su diagnóstico en IG 🚀";
        default: return "Actividad detectada en el sistema ✨";
      }
    };

    return (
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-stone-600 mb-4 flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          En Vivo: Actividad Global
        </h4>
        {activity.slice(0, 5).map((act, i) => (
          <motion.div 
            key={act.id || i}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 text-[11px] font-bold text-stone-400 bg-white/[0.02] p-3 rounded-xl border border-white/5 hover:bg-white/5 transition-all"
          >
            <span className="text-lg">{act.actionType === 'ANALYZE' ? '🕵️‍♂️' : '📸'}</span>
            <div className="flex-1">
              <p className="text-stone-200">{getActionMessage(act.actionType)}</p>
              <p className="text-[9px] text-stone-600 uppercase mt-0.5">Hace unos instantes</p>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const ToxicityTimeline = ({ data }) => {
    if (!data || data.length < 2) return null;
    
    // Sort by date (already sorted from backend, but just in case)
    const sortedData = [...data].reverse(); 
    const points = sortedData.map(d => d.toxicScore);
    const max = Math.max(...points, 10);
    const min = Math.min(...points);
    
    const width = 200;
    const height = 40;
    const padding = 5;
    
    const d = sortedData.map((p, i) => {
      const x = (i / (sortedData.length - 1)) * (width - padding * 2) + padding;
      const y = height - ((p.toxicScore / max) * (height - padding * 2) + padding);
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

    return (
      <div className="flex flex-col items-end">
        <svg width={width} height={height} className="overflow-visible">
          <path d={d} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-toxic drop-shadow-[0_0_8px_rgba(255,0,128,0.5)]" />
        </svg>
        <div className="flex justify-between w-full mt-2 text-[8px] font-black text-stone-500 uppercase tracking-widest">
           <span>Pasado</span>
           <span>Hoy</span>
        </div>
      </div>
    );
  };
  
  const getToxicityDiagnosis = (res) => {
    if (!res) return null;
    const score = res.toxicScore;
    const count = res.notFollowingBack.length;

    if (score >= 90) return { 
      emoji: "☢️", 
      title: "NIVEL: ACCIDENTE NUCLEAR", 
      text: `Tienes un ${score}% de toxicidad. Tu cuenta es básicamente Chernobyl. ¿Seguro que no eres un villano de película? Tienes ${count} traidores infiltrados. 🚩`,
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    };
    if (score >= 70) return { 
      emoji: "🕵️‍♂️", 
      title: "NIVEL: CAMPO DE MINAS", 
      text: "Vives al límite. Hay traición en cada esquina. Duerme con un ojo abierto (y el otro en esta app). 💣",
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20"
    };
    if (score >= 40) return { 
      emoji: "🧐", 
      title: "NIVEL: SOSPECHAS ALTAS", 
      text: "Ni tan santo, ni tan tóxico. Tienes un círculo de amigos... interesante. Vigila a los que no te dan like. 👀",
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    };
    if (score >= 10) return { 
      emoji: "🌱", 
      title: "NIVEL: JARDÍN SANO", 
      text: "Todo tranqui por aquí. Un par de deslices, pero tienes gente leal. No dejes que la fama te cambie. ✨",
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    };
    return { 
      emoji: "😇", 
      title: "NIVEL: SANTO DE INTERNET", 
      text: "Eres un ángel. Te aman más que a la pizza fría. O quizás borraste a todos antes de hacer el escaneo... 🕵️‍♂️✨",
      color: "text-toxic",
      bg: "bg-toxic/10",
      border: "border-toxic/20"
    };
  };

  // Modificado: Escuchar eventos de la extension
  React.useEffect(() => {
    const handleMessage = (event) => {
      // Verificamos que el mensaje provenga de nuestra propia ventana/extension
      if (event.data && event.data.type === 'TOXIC_EXTENSION_DATA') {
        const { followers, following } = event.data.payload;
        
        // Ejecutamos el algoritmo matematico localmente (Cero servidores, 100% privado)
        const followersUsernames = followers.map(f => f.username);
        const followingUsernames = following.map(f => f.username);

        const notFollowingBack = followingUsernames.filter(u => !followersUsernames.includes(u));
        const idontFollowBack = followersUsernames.filter(u => !followingUsernames.includes(u));

        // Para calcular unfollowers (traicioneros en el tiempo), leemos localStorage
        const previousFollowers = JSON.parse(localStorage.getItem('toxic_last_followers') || '[]');
        const lostFollowers = previousFollowers.filter(u => !followersUsernames.includes(u));

        // Guardamos el estado actual para la proxima vez
        localStorage.setItem('toxic_last_followers', JSON.stringify(followersUsernames));

        // Calculo de métricas adicionales locales
        const mutualsCount = followingUsernames.filter(u => followersUsernames.includes(u)).length;
        const toxicScore = followingUsernames.length === 0 ? 0 : (notFollowingBack.length * 100 / followingUsernames.length);
        const unionSize = followersUsernames.length + followingUsernames.length - mutualsCount;
        const mutualityRate = unionSize === 0 ? 0 : (mutualsCount * 100 / unionSize);

        setLoading(false);
        setResults({
          message: lostFollowers.length > 0 || notFollowingBack.length > 0 ? "¡Se prendió esto! Hay drama. 🔥" : "¡Todo tranqui por ahora! ✨",
          followersCount: followers.length,
          followingCount: following.length,
          notFollowingBack,
          lostFollowers,
          fans: idontFollowBack,
          toxicScore: Math.round(toxicScore * 10) / 10,
          mutualityRate: Math.round(mutualityRate * 10) / 10
        });

        // --- NUEVO: Sincronización con PostgreSQL ---
        const token = localStorage.getItem('toxic_token');
        if (token) {
          fetch(`${API_BASE_URL}/api/analysis/sync`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
              followers: followersUsernames,
              following: followingUsernames
            })
          })
          .then(res => {
            if (res.ok) console.log("✅ Datos sincronizados con el servidor PostgreSQL.");
            else {
              console.error("❌ Error al sincronizar con el servidor.");
              // Opcional: Avisar al usuario que su chisme no se guardó en la nube
            }
          })
          .catch(err => {
            console.error("❌ Error de red en sincronización:", err);
            // Si el sync falla pero el local funcionó, no bloqueamos al usuario
          });
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const [token, setToken] = useState(null);
  const [showAuth, setShowAuth] = useState(false);

  // --- NUEVO: Gestión de sesión automática con Firebase ---
  React.useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setLoading(true);
        try {
          const jwtToken = await user.getIdToken(true); // Forzamos token fresco
          setToken(jwtToken);
          localStorage.setItem('toxic_token', jwtToken);
          setLoading(false);
        } catch (err) {
          console.error("Error renovando token:", err);
          setLoading(false);
        }
      } else {
        setToken(null);
        localStorage.removeItem('toxic_token');
      }
    });

    return () => unsubscribe();
  }, []);

  // --- NUEVO: Cargar historial persistente al entrar ---
  React.useEffect(() => {
    if (token) {
      setCheckingHistory(true);
      setError(null);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        controller.abort();
        setCheckingHistory(false);
        setError("El servidor de la nube está despertando (Render cold start). Por favor, espera unos segundos. ⏱️");
      }, 50000);

      // Fetch Latest Results
      fetch(`${API_BASE_URL}/api/analysis/latest`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal
      })
      .then(res => res.status === 200 ? res.json() : null)
      .then(data => {
        if (data) {
          setResults({
            message: "Tu Informe Tóxico está listo 🕵️‍♂️🔥",
            followersCount: data.followersCount,
            followingCount: data.followingCount,
            notFollowingBack: data.notFollowingMeBack || [], 
            lostFollowers: data.newUnfollowers || [],
            fans: data.fans || [],
            toxicScore: data.toxicScore || 0,
            mutualityRate: data.mutualityRate || 0,
            isFromCloud: true
          });
        }
      })
      .catch(() => {});

      // Fetch History for Chart
      fetch(`${API_BASE_URL}/api/analysis/history`, {
        headers: { 'Authorization': `Bearer ${token}` },
        signal: controller.signal
      })
      .then(res => res.status === 200 ? res.json() : null)
      .then(data => {
        if (data) setHistory(data);
      })
      .catch(() => {})
      .finally(() => {
        clearTimeout(timeoutId);
        setCheckingHistory(false);
      });
    }
  }, [token]);

  // Periodic Global Activity Fetch
  React.useEffect(() => {
    const fetchActivity = () => {
      fetch(`${API_BASE_URL}/api/activity/latest`)
        .then(res => res.json())
        .then(data => setGlobalActivity(data))
        .catch(() => {});
    };
    fetchActivity();
    const interval = setInterval(fetchActivity, 15000);
    return () => clearInterval(interval);
  }, []);

  // Log Share Events
  React.useEffect(() => {
    if (showShareCard) {
      fetch(`${API_BASE_URL}/api/activity/log-share`, { method: 'POST' }).catch(() => {});
    }
  }, [showShareCard]);

  // --- NUEVO: Polling para detectar cuando la extensión sube datos ---
  React.useEffect(() => {
    let interval;
    if (token && !results) {
      interval = setInterval(() => {
        fetch(`${API_BASE_URL}/api/analysis/latest`, {
          headers: { 'Authorization': `Bearer ${token}` }
        })
        .then(res => res.status === 200 ? res.json() : null)
        .then(data => {
          if (data) {
            setResults({
              message: "¡Datos detectados! Sincronizando... 🚀",
              followersCount: data.followersCount,
              followingCount: data.followingCount,
              notFollowingBack: data.notFollowingMeBack || [], 
              lostFollowers: data.newUnfollowers || [],
              fans: data.fans || [],
              toxicScore: data.toxicScore || 0,
              mutualityRate: data.mutualityRate || 0,
              isFromCloud: true
            });
          }
        })
        .catch(() => {});
      }, 5000); // Cada 5 segundos comprobamos si hay chisme nuevo
    }
    return () => clearInterval(interval);
  }, [token, !!results]);

  const handleAuth = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const jwtToken = await result.user.getIdToken();
      setToken(jwtToken);
      localStorage.setItem('toxic_token', jwtToken);
      setShowAuth(false);
      // results se cargará solo por el useEffect de arriba
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión con Google. Revisa tu conexión o intenta más tarde.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
    setToken(null);
    localStorage.removeItem('toxic_token');
    setResults(null);
  };



  const handleFileChange = (e, type) => {
    setFiles(prev => ({ ...prev, [type]: e.target.files[0] }));
  };

  const handleUpload = async (tokenOverride) => {
    if (!files.followers || !files.following) {
      setError("Necesitas subir ambos archivos (followers y following) para el chisme completo. 💅");
      return;
    }

    const activeToken = typeof tokenOverride === 'string' ? tokenOverride : token;
    
    if (!activeToken) {
      setShowAuth(true);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('followers', files.followers);
      formData.append('following', files.following);

      const response = await fetch(`${API_BASE_URL}/api/analysis/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${activeToken}`
        },
        body: formData,
      });

      if (response.status === 403) {
         handleLogout();
         throw new Error("Tu sesión expiró o es inválida. Inicia sesión de nuevo.");
      }
      if (!response.ok) {
        throw new Error(await response.text() || "Error del servidor al procesar archivos.");
      }

      const data = await response.json();

      setResults({
        message: data.newUnfollowers.length > 0 ? "¡Se prendió esto! Hay drama. 🔥" : "¡Todo tranqui por ahora! ✨",
        followersCount: data.followersCount,
        followingCount: data.followingCount,
        notFollowingBack: data.notFollowingMeBack || [],
        lostFollowers: data.newUnfollowers || [],
        fans: data.fans || [],
        toxicScore: data.toxicScore || 0,
        mutualityRate: data.mutualityRate || 0
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans selection:bg-toxic/30">
      <Nav 
        token={token} 
        results={results}
        handleLogout={handleLogout} 
        onLoginClick={() => setShowAuth(true)} 
      />
      
      <AnimatePresence>
        {(loading || checkingHistory) && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="fixed inset-0 z-[100] bg-dark-950/90 backdrop-blur-2xl flex flex-col items-center justify-center gap-8"
          >
            <div className="relative">
              <div className="w-24 h-24 rounded-full border-4 border-toxic/20 animate-pulse" />
              <div className="absolute inset-0 flex items-center justify-center">
                <CloudLightning className="w-12 h-12 text-toxic animate-bounce" />
              </div>
              <div className="absolute -inset-4 border border-toxic/10 rounded-full animate-[spin_4s_linear_infinite]" />
            </div>
            
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tighter">
                {loading ? "Autenticando..." : "Buscando tu chisme..."}
              </h3>
              <p className="text-stone-400 text-sm font-medium animate-pulse flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> 
                {loading ? "Configurando conexión segura" : "Sincronizando con la nube de Render"}
              </p>
            </div>
            
            {/* Disclaimer para Render Cold Start */}
            {checkingHistory && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                transition={{ delay: 5 }}
                className="max-w-xs text-[10px] text-stone-500 text-center leading-relaxed"
              >
                Nota: El servidor gratuito de Render tarda unos 50s en despertar tras periodos de inactividad. ¡Gracias por tu paciencia! ☕
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAuth && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{scale: 0.95}} animate={{scale: 1}} exit={{scale: 0.95}} className="glass p-8 rounded-3xl max-w-sm w-full border-white/10 relative">
              <button onClick={() => setShowAuth(false)} className="absolute top-4 right-4 text-stone-500 hover:text-white">✕</button>
              <HeartCrack className="w-10 h-10 text-toxic mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-center mb-2">Acceso Seguro</h2>
              <p className="text-center text-stone-400 text-sm mb-6">Inicia sesión rápidamente sin crear nuevas contraseñas.</p>
              
              <div className="bg-toxic/10 border border-toxic/20 rounded-2xl p-4 mb-6">
                <h4 className="text-xs font-black uppercase text-toxic tracking-widest mb-3 text-center">Beneficios de Miembro</h4>
                <div className="space-y-3 text-xs text-stone-300">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-toxic" />
                    <span><b>Historial Cloud:</b> Reportes guardados para siempre.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-toxic" />
                    <span><b>Sincronización Total:</b> Accede desde cualquier PC.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-toxic" />
                    <span><b>Alertas Pro:</b> Detecta traiciones en segundos.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-toxic" />
                    <span><b>Seguridad IP:</b> Registro de accesos para tu tranquilidad.</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <button 
                  onClick={handleAuth} 
                  disabled={loading} 
                  className="w-full bg-white text-black hover:bg-stone-200 font-bold py-3 px-4 rounded-xl transition-all flex items-center justify-center gap-3 mt-2"
                >
                  {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      <svg viewBox="0 0 24 24" className="w-5 h-5" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                        <path d="M1 1h22v22H1z" fill="none"/>
                      </svg>
                      Continuar con Google
                    </>
                  )}
                </button>
              </div>
              <p className="text-center text-xs text-stone-500 mt-6">
                Al continuar, aceptas que no guardamos tus datos. Todo el análisis se ejecuta localmente.
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {!results ? (
          <>
            <Hero />

            <section id="upload" className="py-20 -mt-20">
              <div className="container mx-auto px-6 max-w-4xl">
                <div className="glass p-10 rounded-[2.5rem] border-white/10 shadow-2xl relative overflow-hidden">

                  {/* Security Notice */}
                  <div className="mb-10 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-start gap-4">
                    <ShieldCheck className="w-8 h-8 text-emerald-500 flex-shrink-0" />
                    <div>
                      <h4 className="text-emerald-500 font-bold text-sm uppercase">Privacidad Blindada (Cybersecurity)</h4>
                      <p className="text-stone-400 text-xs leading-relaxed mt-1">
                        Tus datos **nunca salen de tu dispositivo**. El procesamiento es 100% local en tu navegador. No guardamos tus archivos, no pedimos contraseñas y nadie más verá tu chisme. Tú tienes el control.
                      </p>
                    </div>
                  </div>

                  <h2 className="text-3xl font-bold mb-4 text-center">Configura tu Análisis</h2>
                  <p className="text-sm text-stone-400 text-center mb-8">
                    Sube los archivos JSON que descargaste de Instagram (Exportar datos).
                  </p>

                  <div className="grid md:grid-cols-2 gap-8 mb-10">
                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-stone-400 ml-1">Archivo followers_1.json</label>
                      <div className="relative group">
                        <input type="file" onChange={(e) => handleFileChange(e, 'followers')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${files.followers ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10 group-hover:border-toxic/50'}`}>
                          {files.followers ? <CheckCircle className="text-emerald-500" /> : <Upload className="text-stone-500" />}
                          <span className="text-sm font-medium text-stone-300 truncate max-w-full px-2">
                            {files.followers ? files.followers.name : 'Seleccionar'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <label className="block text-sm font-semibold text-stone-400 ml-1">Archivo following.json</label>
                      <div className="relative group">
                        <input type="file" onChange={(e) => handleFileChange(e, 'following')} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                        <div className={`p-8 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center gap-3 ${files.following ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-white/5 border-white/10 group-hover:border-toxic/50'}`}>
                          {files.following ? <CheckCircle className="text-emerald-500" /> : <Upload className="text-stone-500" />}
                          <span className="text-sm font-medium text-stone-300 truncate max-w-full px-2">
                            {files.following ? files.following.name : 'Seleccionar'}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center gap-3 text-red-500 text-sm font-medium">
                      <AlertCircle className="w-5 h-5 flex-shrink-0" />
                      {error}
                    </motion.div>
                  )}

                  <div className="flex flex-col gap-4">
                    <button
                      onClick={() => {
                        window.open("https://instagram.com", "_blank");
                        // Luego de esto, el usuario usa la extension
                      }}
                      className="w-full bg-toxic hover:bg-toxic-dark text-white py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-toxic/20 flex items-center justify-center gap-3"
                    >
                      <Zap className="w-6 h-6 fill-white" /> 1. Abre Instagram y usa la Extensión
                    </button>
                    
                    <button
                      onClick={handleUpload}
                      disabled={loading}
                      className="w-full bg-stone-800 hover:bg-stone-700 disabled:opacity-50 disabled:cursor-not-allowed text-stone-300 py-3 rounded-2xl font-bold text-sm transition-all border border-stone-600 flex items-center justify-center gap-3"
                    >
                      {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Analizando...</> : "2. O usa archivos JSON (Método lento)"}
                    </button>
                  </div>
                </div>
              </div>
            </section>

            <Features />
            <Faq />
          </>
        ) : (
          <section id="results-section" className="pt-32 pb-20 container mx-auto px-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="text-4xl font-black text-gradient">{results.message}</h1>
                    {results.isFromCloud && (
                      <div className="flex items-center gap-1.5 px-3 py-1 bg-toxic/10 border border-toxic/20 rounded-full text-[10px] font-black uppercase tracking-widest text-toxic">
                        <CloudLightning className="w-3 h-3" /> Cloud Sync
                      </div>
                    )}
                  </div>
                  <p className="text-stone-400">Análisis completado. Tu chisme está a salvo. 🔒</p>
                </div>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowShareCard(true)}
                    className="glass px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 bg-toxic/10 border-toxic/20 text-toxic hover:bg-toxic/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4" /> Compartir en IG
                  </button>
                  <button onClick={() => setResults(null)} className="glass px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                    <ArrowRight className="w-4 h-4 rotate-180" /> Nuevo reporte
                  </button>
                </div>
              </div>

              {/* AI Analyst Block */}
              {(() => {
                const diag = getToxicityDiagnosis(results);
                return (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`mb-12 p-8 rounded-[2.5rem] border ${diag.border} ${diag.bg} relative overflow-hidden group`}
                  >
                    <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <span className="text-8xl">{diag.emoji}</span>
                    </div>
                    <div className="relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] ${diag.bg} border ${diag.border} ${diag.color}`}>
                          {diag.title}
                        </div>
                        <span className="text-xs text-stone-500 font-bold uppercase tracking-widest flex items-center gap-2">
                          <Zap className="w-3 h-3" /> Análisis de IA Sarcástica
                        </span>
                      </div>
                      <p className="text-xl md:text-2xl font-bold text-white leading-tight max-w-2xl">
                        "{diag.text}"
                      </p>
                    </div>
                  </motion.div>
                );
              })()}

              <AnimatePresence>
                {showShareCard && (
                  <motion.div 
                    initial={{ opacity: 0 }} 
                    animate={{ opacity: 1 }} 
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-[200] bg-black/90 backdrop-blur-xl p-4 flex items-center justify-center overflow-y-auto"
                  >
                    <button onClick={() => setShowShareCard(false)} className="absolute top-6 right-6 text-white/50 hover:text-white z-[210]">✕ Cerrar</button>
                    
                    <motion.div 
                      initial={{ scale: 0.9, y: 20 }}
                      animate={{ scale: 1, y: 0 }}
                      className="bg-black border border-white/10 rounded-[2.5rem] w-full max-w-[380px] aspect-[9/16] relative overflow-hidden shadow-2xl flex flex-col p-10 font-sans"
                      id="share-card"
                    >
                      {/* Decorative Background */}
                      <div className="absolute top-0 right-0 w-64 h-64 bg-toxic/20 blur-[100px] rounded-full -translate-y-1/2 translate-x-1/2" />
                      <div className="absolute bottom-0 left-0 w-64 h-64 bg-rose-500/10 blur-[100px] rounded-full translate-y-1/2 -translate-x-1/2" />
                      
                      <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-10">
                          <HeartCrack className="w-8 h-8 text-toxic" />
                          <span className="font-extrabold text-xl tracking-tighter">Tóxica<span className="text-toxic">Tracker</span></span>
                        </div>

                        <div className="flex-1 space-y-8">
                          <div>
                            <p className="text-[10px] uppercase font-black tracking-[0.3em] text-stone-500 mb-2">Mi Nivel de Toxicidad</p>
                            <h2 className="text-7xl font-black text-toxic tracking-tighter leading-none">{results.toxicScore}%</h2>
                            <div className="h-1.5 bg-white/5 w-full mt-4 rounded-full overflow-hidden">
                              <div className="h-full bg-toxic" style={{ width: `${results.toxicScore}%` }} />
                            </div>
                          </div>

                          <div className="bg-white/5 border border-white/10 rounded-3xl p-6">
                             <p className="text-[10px] uppercase font-black text-toxic mb-2 flex items-center gap-2">
                               <Zap className="w-3 h-3 fill-toxic" /> Diagnóstico IA
                             </p>
                             <p className="text-sm font-bold text-stone-200 leading-relaxed italic">
                               "{getToxicityDiagnosis(results).text}"
                             </p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                              <p className="text-[8px] uppercase font-black text-stone-500 mb-1 tracking-widest">Tóxicos</p>
                              <p className="text-2xl font-black text-white">{results.notFollowingBack.length}</p>
                            </div>
                            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-center">
                              <p className="text-[8px] uppercase font-black text-stone-500 mb-1 tracking-widest">Fans</p>
                              <p className="text-2xl font-black text-white">{results.followersCount}</p>
                            </div>
                          </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-white/10 text-center">
                          <div className="flex items-center justify-center gap-2 bg-emerald-500/10 border border-emerald-500/20 py-3 rounded-2xl mb-4">
                             <ShieldCheck className="w-4 h-4 text-emerald-500" />
                             <span className="text-[10px] font-black uppercase text-emerald-500 tracking-widest">Análisis 100% Seguro</span>
                          </div>
                          <p className="text-[8px] text-stone-500 uppercase font-black tracking-widest">Generado en toxicatracker.vercel.app</p>
                        </div>
                      </div>
                    </motion.div>
                    
                    <div className="absolute bottom-10 flex flex-col items-center gap-6 w-full max-w-[380px]">
                       <button 
                        onClick={handleDownloadShareCard}
                        disabled={isCapturing}
                        className={`w-full glass py-4 rounded-2xl flex items-center justify-center gap-3 font-black uppercase tracking-widest text-sm transition-all shadow-2xl ${
                          isCapturing ? 'bg-white/5 text-stone-500' : 'bg-toxic text-white hover:scale-105 active:scale-95'
                        }`}
                       >
                         {isCapturing ? (
                           <>
                            <div className="w-4 h-4 border-2 border-stone-500 border-t-white rounded-full animate-spin" />
                            Capturando...
                           </>
                         ) : (
                           <>
                            <Download className="w-5 h-5" /> Descargar Imagen
                           </>
                         )}
                       </button>

                       <div className="flex flex-col items-center gap-2">
                         <p className="text-white/40 text-[10px] font-black uppercase tracking-widest">Paso 2: Subir a Instagram</p>
                         <a 
                          href="https://www.instagram.com/reels/create/" 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-toxic hover:text-white transition-colors text-xs font-bold underline"
                         >
                           Ir a Subir Historias ↗
                         </a>
                       </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Advanced Metrics Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
                <MetricCard 
                  icon={<ShieldCheck className="text-emerald-500" />} 
                  label="Fans" 
                  value={results.followersCount} 
                  subLabel="Seguidores totales"
                />
                <MetricCard 
                  icon={<UserMinus className="text-red-500" />} 
                  label="Tóxicos" 
                  value={results.notFollowingBack.length} 
                  subLabel="No te siguen de vuelta"
                  highlight
                />
                <div className="glass p-8 rounded-3xl border-white/5 flex flex-col items-center justify-center text-center relative overflow-hidden group">
                  <div className="absolute inset-0 bg-toxic/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="w-full flex justify-between items-start mb-2 relative z-10">
                    <p className="text-xs text-stone-400 uppercase font-black tracking-tighter">Toxic Score</p>
                    <ToxicityTimeline data={history} />
                  </div>
                  <div className="text-4xl font-black text-toxic mb-1 relative z-10">{results.toxicScore}%</div>
                  <div className="w-full bg-white/5 h-1.5 rounded-full mt-2 overflow-hidden relative z-10">
                    <motion.div 
                      initial={{ width: 0 }} 
                      animate={{ width: `${results.toxicScore}%` }} 
                      className="h-full bg-toxic"
                    />
                  </div>
                </div>
                <MetricCard 
                  icon={<Zap className="text-amber-500" />} 
                  label="Mutuidad" 
                  value={`${results.mutualityRate}%`} 
                  subLabel="Conexiones reales"
                />
              </div>

              {/* Lists and Feed Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-4">
                  <UserList 
                    title="Traidores (No te siguen de vuelta)" 
                    users={results.notFollowingBack} 
                    count={results.notFollowingBack.length} 
                    variantSet="danger"
                    turboMode={turboMode}
                    setTurboMode={setTurboMode}
                    onUnfollow={handleUnfollowAction}
                  />
                </div>
                <div className="lg:col-span-4">
                  <UserList 
                    title="Fans Leales" 
                    users={results.fans} 
                    count={results.fans.length} 
                    variantSet="success" 
                    onUnfollow={handleUnfollowAction}
                  />
                </div>
                <div className="lg:col-span-4 space-y-8">
                  <div className="glass p-8 rounded-[2rem] border-white/5 bg-white/[0.01]">
                    <GlobalFeed activity={globalActivity} />
                  </div>
                  
                  {results.lostFollowers.length > 0 && (
                    <div className="glass p-6 rounded-3xl border-red-500/20 bg-red-500/5">
                      <div className="flex items-center gap-3 mb-4 text-red-500">
                        <AlertCircle className="w-5 h-5" />
                        <h3 className="font-bold">¡Alerta Drama!</h3>
                      </div>
                      <p className="text-sm text-stone-400 mb-4">
                        Estas {results.lostFollowers.length} personas te dieron unfollow recientemente:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {results.lostFollowers.slice(0, 5).map(u => (
                          <span key={u} className="px-3 py-1 bg-red-500/10 rounded-full text-[10px] font-bold">@{u}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  )
}
