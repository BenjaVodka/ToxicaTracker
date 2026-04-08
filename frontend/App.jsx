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
  Search,
  Link2,
  Check,
  X
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { auth, googleProvider } from './firebase'
import { signInWithPopup, signOut } from 'firebase/auth'


const ShareOption = ({ icon, label, onClick, disabled = false, highlight = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`flex flex-col items-center gap-2 group transition-all ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}`}
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
      highlight ? 'bg-toxic border-toxic shadow-[0_0_15px_rgba(74,222,128,0.3)]' : 'bg-white/5 border-white/10 group-hover:bg-white/10 group-hover:border-white/20'
    }`}>
      {React.cloneElement(icon, { className: `w-6 h-6 ${highlight ? 'text-stone-950' : 'text-white'}` })}
    </div>
    <span className="text-[10px] font-bold uppercase tracking-widest text-stone-500 group-hover:text-stone-300">
      {label}
    </span>
  </button>
);

const ShareCard = ({ results }) => {
  const score = results.toxicScore;
  
  const getTheme = (s) => {
    if (s >= 70) return { 
      primary: "text-red-500", 
      border: "border-red-500/20", 
      bg: "bg-red-500/10", 
      mesh: "from-red-600/40 via-stone-950 to-purple-900/40",
      accent: "from-red-500 to-rose-600"
    };
    if (s >= 40) return { 
      primary: "text-amber-500", 
      border: "border-amber-500/20", 
      bg: "bg-amber-500/10", 
      mesh: "from-amber-600/40 via-stone-950 to-orange-900/40",
      accent: "from-amber-500 to-yellow-600"
    };
    return { 
      primary: "text-emerald-500", 
      border: "border-emerald-500/20", 
      bg: "bg-emerald-500/10", 
      mesh: "from-emerald-600/40 via-stone-950 to-teal-900/40",
      accent: "from-emerald-400 to-cyan-500"
    };
  };

  const theme = getTheme(score);

  const getToxicityDiagnosis = (res) => {
    if (!res) return { text: "No hay datos", emoji: "❓", color: "text-stone-500" };
    const country = (res.country || 'global').toLowerCase();
    
    const localizedQuotes = {
      chile: {
        ultra: "Tu cuenta es terrible penca po. Está llena de weones fomes que no te siguen. 🚩",
        high: "Vives al 3 y al 4. Hay pura traición en tu Insta, po. Duerme con un ojo abierto. 💣",
        mid: "Ni tan santo, ni tan tóxico. Tienes un círculo de amigos... sospechoso, po. 👀",
        low: "Todo tranqui, po. Pocos traidores, mucha paz. Sigue así, campeón. ✨"
      },
      mexico: {
        ultra: "¡No mames! Tu cuenta es un desmadre total. Pura gente tóxica te rodea, wey. 🚩",
        high: "Te traen de bajada. Hay pura traición aquí. ¡Ponte pilas! 💣",
        mid: "Ni muy muy, ni tan tan. Tienes unos compas... de dudosa procedencia. 👀",
        low: "Todo bien, carnal. Pura gente leal por aquí. ¡Échale ganas! ✨"
      },
      global: {
        ultra: "Tu cuenta es Chernobyl. Tienes traidores infiltrados hasta en la sopa. 🚩",
        high: "Vives al límite. Hay traición en cada esquina. Duerme con un ojo abierto. 💣",
        mid: "Ni tan santo, ni tan tóxico. Tienes un círculo de amigos... sospechoso. 👀",
        low: "Todo tranqui. Pocos traidores, mucha paz. Sigue así, campeón. ✨"
      }
    };

    const quotes = localizedQuotes[country] || localizedQuotes.global;

    if (score >= 90) return { emoji: "☢️", text: quotes.ultra };
    if (score >= 70) return { emoji: "🕵️‍♂️", text: quotes.high };
    if (score >= 40) return { emoji: "🧐", text: quotes.mid };
    return { emoji: "🌱", text: quotes.low };
  };

  const diag = getToxicityDiagnosis(results);
  
  return (
    <div 
      id="toxic-share-card"
      className="w-[360px] h-[640px] bg-stone-950 flex flex-col relative overflow-hidden"
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${theme.mesh} opacity-80`} />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-white/5 blur-[100px] rounded-full" />
      
      {/* Header Container */}
      <div className="relative z-10 px-8 pt-10 mb-8">
        <div className="flex items-center gap-2 mb-1">
          <div className={`p-1.5 rounded-lg bg-gradient-to-tr ${theme.accent} shadow-lg`}>
             <Zap className="w-5 h-5 text-stone-950 fill-current" />
          </div>
          <div>
            <h1 className="text-xl font-black italic tracking-tighter text-white">TOXIC TRACKER</h1>
            <p className="text-[7px] font-black text-stone-400 uppercase tracking-[0.4em]">Personal Social Audit</p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="relative z-10 flex flex-col items-center mb-8 px-8">
        <div className="relative p-0.5 rounded-[1.5rem] bg-gradient-to-tr transition-all" style={{ backgroundImage: `linear-gradient(to top right, transparent, rgba(255,255,255,0.1))` }}>
           <UserAvatar name={results.username} size="w-20 h-20" />
           <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-lg bg-gradient-to-tr ${theme.accent} shadow-xl border-2 border-stone-900`}>
              <CheckCircle2 className="w-3 h-3 text-stone-950" />
           </div>
        </div>
        <h2 className="text-3xl font-black text-white mt-4 italic tracking-tighter">@{results.username}</h2>
        <div className={`mt-2 px-4 py-1 rounded-full bg-white/10 backdrop-blur-xl border border-white/20 text-white text-[8px] font-black uppercase tracking-[0.2em]`}>
           Informe de Salud Social 🔒
        </div>
      </div>

      {/* Metrics Section */}
      <div className="relative z-10 grid grid-cols-2 gap-4 px-8 mb-8">
        <div className="glass-premium p-5 rounded-3xl border-white/5 bg-white/[0.03] backdrop-blur-3xl">
          <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Toxic Score</p>
          <div className="flex items-end gap-1">
            <span className={`text-5xl leading-none font-black ${theme.primary} tracking-tight`}>{results.toxicScore}</span>
            <span className={`text-[12px] font-black ${theme.primary} mb-1`}>%</span>
          </div>
        </div>
        <div className="glass-premium p-5 rounded-3xl border-white/5 bg-white/[0.03] backdrop-blur-3xl">
          <p className="text-[8px] font-black text-stone-400 uppercase tracking-widest mb-1.5">Traidores</p>
          <div className="flex items-end gap-1">
            <span className="text-5xl leading-none font-black text-white tracking-tight">{results.notFollowingBack.length}</span>
            <UserMinus className="w-6 h-6 text-stone-500 mb-1" />
          </div>
        </div>
      </div>

      {/* Diagnosis Section */}
      <div className="relative z-10 px-8 mt-auto pb-12">
        <div className={`p-6 rounded-[2rem] border ${theme.border} bg-white/[0.02] backdrop-blur-3xl relative overflow-hidden group shadow-2xl`}>
          <div className="absolute top-0 right-0 p-4 opacity-[0.05]">
             <span className="text-7xl leading-none">{diag.emoji}</span>
          </div>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-3">
               <div className={`w-6 h-0.5 bg-gradient-to-r ${theme.accent} rounded-full`} />
               <span className="text-[9px] font-black uppercase tracking-[0.2em] text-stone-500">Diagnóstico IA</span>
            </div>
            <p className="text-xl font-bold text-white leading-[1.3] italic">
               "{diag.text}"
            </p>
          </div>
        </div>
        
        <div className="mt-6 text-center">
           <p className="text-[8px] font-bold text-stone-500 tracking-widest uppercase opacity-40">ToxicTracker.app • Sin contraseñas</p>
        </div>
      </div>
    </div>
  );
};


const ShareDialog = ({ results, onClose }) => {
  const [sharing, setSharing] = useState(false);
  const [status, setStatus] = useState("");

  const handleDownload = async () => {
    setSharing(true);
    setStatus("Generando tarjeta 4K...");
    try {
      const element = document.querySelector("#toxic-share-card-capture");
      if (!element) throw new Error("Element not found");
      
      const canvas = await html2canvas(element, { 
        useCORS: true, 
        allowTaint: false, 
        backgroundColor: "#0c0a09", 
        scale: 3, // Resolución Ultra-HD
        logging: false
      });
      
      const link = document.createElement('a');
      link.download = `toxic-tracker-${results.username}.png`;
      link.href = canvas.toDataURL("image/png", 1.0);
      link.click();
      setStatus("¡Guardado en HD!");
      setTimeout(() => setStatus(""), 2000);
    } catch (err) {
      console.error(err);
      setStatus("Error de captura");
    } finally {
      setSharing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-stone-950/80 backdrop-blur-sm" />
      <motion.div initial={{ y: 200, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 200, opacity: 0 }} className="relative w-full max-w-sm bg-stone-900 border border-white/10 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="p-8">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">Compartir</h3>
            <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-stone-500"><X className="w-5 h-5" /></button>
          </div>
          
          <div className="flex justify-center mb-8">
            <div className="w-full max-w-[280px] aspect-[9/16] bg-stone-950 rounded-2xl border border-white/5 overflow-hidden relative shadow-inner">
              <div className="scale-[0.24] sm:scale-[0.3] origin-top absolute top-0 left-1/2 -translate-x-1/2">
                 <ShareCard results={results} />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent" />
            </div>
          </div>

          <div className="space-y-4">
            {status && (
              <div className="text-center py-2 bg-toxic/10 rounded-xl text-[10px] font-black text-toxic uppercase tracking-widest animate-pulse">{status}</div>
            )}
            
            <button 
              onClick={handleDownload}
              disabled={sharing}
              className="w-full py-5 rounded-2xl bg-toxic text-stone-950 font-black text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3 shadow-[0_20px_40px_rgba(74,222,128,0.2)]"
            >
              {sharing ? <Loader2 className="w-5 h-5 animate-spin" /> : <Download className="w-5 h-5" />}
              {sharing ? "Generando..." : "Descargar Imagen"}
            </button>
          </div>
        </div>
      </motion.div>
      <div className="fixed -left-[2000px] top-0 pointer-events-none" id="toxic-share-card-capture"><ShareCard results={results} /></div>
    </div>
  );
};

const Nav = ({ token, results, handleLogout, onLoginClick, checkingHistory }) => (
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
            {checkingHistory ? <Loader2 className="w-4 h-4 animate-spin" /> : <BarChart2 className="w-4 h-4" />} 
            {checkingHistory ? 'Cargando...' : 'Mis Reportes'}
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

const UserAvatar = ({ name, size = "w-12 h-12" }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  // Fallback Moderno de Cristal si Instagram falla
  const initials = name ? name.substring(0, 1).toUpperCase() : '?';
  
  const primaryUrl = `https://unavatar.io/instagram/${name}`;

  return (
    <div className={`${size} rounded-2xl overflow-hidden glass border border-white/10 flex-shrink-0 bg-stone-900 flex items-center justify-center relative group`}>
      {/* 1. Capa de Inicial de Cristal (Fallback Premium) */}
      {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-white/10 to-transparent backdrop-blur-md">
           <span className="text-[40%] font-black text-white opacity-40">{initials}</span>
        </div>
      )}

      {/* 2. Capa de Imagen Real */}
      {!error && (
        <img 
          src={primaryUrl} 
          alt={name}
          className={`w-full h-full object-cover relative z-10 transition-all duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}
          loading="lazy"
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
        />
      )}
      
      {/* 3. Brillo de Cristal */}
      <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-tr from-white/5 via-transparent to-white/10" />
    </div>
  );
};

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
                <p className="text-[10px] font-black uppercase tracking-widest text-white">Modo Limpieza Turbo (Auto-Unfollow)</p>
                <p className="text-[9px] text-stone-500 font-bold leading-relaxed max-w-[180px]">
                  La extensión dará unfollow automáticamente abriendo pestañas breves con pausas de seguridad.
                </p>
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
                <UserAvatar name={u} />
                <div>
                  <p className="font-bold text-sm text-white transition-colors group-hover/item:text-toxic">@{u}</p>
                  <p className="text-[10px] text-stone-500 font-bold uppercase tracking-widest flex items-center gap-1.5 mt-0.5">
                    <span className={`w-1.5 h-1.5 rounded-full ${isDanger ? 'bg-red-500' : 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]'}`} />
                    {isDanger ? 'TE IGNORA' : 'ES LEAL'}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={() => onUnfollow ? onUnfollow(u) : window.open(`https://www.instagram.com/${u}/`, '_blank')}
                className={`p-3 rounded-xl transition-all ${
                  isDanger 
                    ? (turboMode ? 'bg-rose-500 text-white shadow-lg scale-110 shadow-rose-500/20' : 'bg-white/5 text-stone-400 hover:bg-red-500 hover:text-white') 
                    : 'bg-white/5 text-stone-400 hover:bg-toxic hover:text-white'
                }`}
                title={isDanger ? (turboMode ? 'Auto-Unfollow' : 'Ver Perfil') : 'Ver Perfil'}
              >
                {isDanger && turboMode ? <Zap className="w-4 h-4 fill-current" /> : <Instagram className="w-4 h-4" />}
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
  const [showShareDialog, setShowShareDialog] = useState(false);


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

    const phrases = {
      nuclear: [
        `Tienes un ${score}% de toxicidad. Básicamente eres un red flag con patas. Tu cuenta es Chernobyl. 🚩`,
        `Si la toxicidad fuera oro, serías el hombre más rico del mundo. Tienes ${count} traidores infiltrados. ☢️`,
        `¿Seguro que no eres un villano de película? Tu círculo social es una zona de desastre. 💀`,
        `Nivel de radioactividad crítico. Tu perfil brilla en la oscuridad de tanto veneno. 🧨`
      ],
      minas: [
        "Vives al límite. Hay traición en cada esquina. Duerme con un ojo abierto. 💣",
        "Tienes más drama en tu IG que una novela turca de las 3 de la tarde. 👀",
        "Ese círculo social parece un juego de Minesweeper. Un paso en falso y... ¡PUM! 💣",
        "La lealtad en tu cuenta es un mito urbano. Prepárate para el impacto. 🕵️‍♂️"
      ],
      sospechas: [
        "Ni tan santo, ni tan tóxico. Tienes un círculo de amigos... 'interesante'. 👀",
        "Vigila a los que no te dan like pero ven todas tus historias. Hay espías. 🧐",
        "Estás en la 'zona gris'. Un poco de drama por aquí, un poco de falsa amistad por allá. ✨",
        "Tu score dice 40%, pero tu intuición dice que alguien te tiene ganas (y no de las buenas). 🧐"
      ],
      jardin: [
        "Todo tranqui por aquí. Un par de deslices, pero tienes gente leal. ✨",
        "Eres casi un santo. Solo te falta la aureola y dejar de stalkear a tu ex. 🌱",
        "Un jardín bien cuidado. Poca maleza, mucha flor. Sigue así, campeón. 🌸",
        "Tienes pocos traidores, pero asegúrate de que esos pocos no quemen el jardín. 🌱"
      ],
      santo: [
        "Eres un ángel. Te aman más que a la pizza fría. O borraste a todos antes. 😇",
        "Demasiado perfecto para ser verdad. ¿Seguro que no eres un bot de bondad? ✨",
        "Nivel de toxicidad 0. Eres la persona más aburrida (o sana) de Internet. 😇",
        "Si todos fueran como tú, esta app no existiría. Gracias por arruinar el chisme. 💖"
      ]
    };

    const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

    if (score >= 90) return { 
      emoji: "☢️", 
      text: getRandom(phrases.nuclear),
      color: "text-red-500",
      bg: "bg-red-500/10",
      border: "border-red-500/20"
    };
    if (score >= 70) return { 
      emoji: "🕵️‍♂️", 
      text: getRandom(phrases.minas),
      color: "text-rose-500",
      bg: "bg-rose-500/10",
      border: "border-rose-500/20"
    };
    if (score >= 40) return { 
      emoji: "🧐", 
      text: getRandom(phrases.sospechas),
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20"
    };
    if (score >= 10) return { 
      emoji: "🌱", 
      text: getRandom(phrases.jardin),
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20"
    };
    return { 
      emoji: "😇", 
      text: getRandom(phrases.santo),
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
          const jwtToken = await user.getIdToken(true); 
          setToken(jwtToken);
          localStorage.setItem('toxic_session', jwtToken);
          // Notificamos a la extensión en tiempo real
          window.postMessage({ type: 'TOXIC_SESSION_UPDATE', token: jwtToken }, '*');
          setLoading(false);
        } catch (err) {
          console.error("Error renovando token:", err);
          setLoading(false);
        }
      } else {
        setToken(null);
        localStorage.removeItem('toxic_session');
        window.postMessage({ type: 'TOXIC_SESSION_UPDATE', token: null }, '*');
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
    if (showShareDialog) {
      fetch(`${API_BASE_URL}/api/activity/log-share`, { method: 'POST' }).catch(() => {});
    }
  }, [showShareDialog]);

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
        checkingHistory={checkingHistory}
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
                    onClick={() => setShowShareDialog(true)}
                    className="glass px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 bg-toxic/10 border-toxic/20 text-toxic hover:bg-toxic/20 transition-all"
                  >
                    <Sparkles className="w-4 h-4" /> Compartir en IG
                  </button>
                  <button onClick={() => setResults(null)} className="glass px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                    <ArrowRight className="w-4 h-4 rotate-180" /> Nuevo reporte
                  </button>
                </div>
              </div>



              <AnimatePresence>
                {showShareDialog && (
                  <ShareDialog 
                    results={results} 
                    onClose={() => setShowShareDialog(false)} 
                  />
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

              {/* Lists and Feed Grid - Optimized for Mobile First Ordering */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 items-start">
                <div className="lg:col-span-4 order-2 lg:order-1">
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
                <div className="lg:col-span-4 order-3 lg:order-2">
                  <UserList 
                    title="Fans Leales" 
                    users={results.fans} 
                    count={results.fans.length} 
                    variantSet="success" 
                    onUnfollow={handleUnfollowAction}
                  />
                </div>
                <div className="lg:col-span-4 space-y-6 md:space-y-8 order-1 lg:order-3">
                  {/* AI Analyst Block (Moved to sidebar) */}
                  {(() => {
                    const diag = getToxicityDiagnosis(results);
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`mb-8 p-6 rounded-[2rem] border ${diag.border} ${diag.bg} relative overflow-hidden group shadow-2xl`}
                      >
                        <div className="absolute -top-2 -right-2 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                          <span className="text-6xl">{diag.emoji}</span>
                        </div>
                        <div className="relative z-10">
                          <div className="flex items-center gap-2 mb-3">
                            <Zap className={`w-3.5 h-3.5 ${diag.color} fill-current`} />
                            <span className="text-[10px] font-black uppercase tracking-widest text-stone-400">ANÁLISIS DE TU CUENTA</span>
                          </div>
                          <p className="text-sm font-bold text-white leading-relaxed">
                            "{diag.text}"
                          </p>
                        </div>
                      </motion.div>
                    );
                  })()}

                  {globalActivity && globalActivity.length > 0 && (
                    <div className="glass p-8 rounded-[2rem] border-white/5 bg-white/[0.01] mb-8">
                      <GlobalFeed activity={globalActivity} />
                    </div>
                  )}
                  
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
