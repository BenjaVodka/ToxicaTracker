import React, { useState } from 'react'
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
  AlertCircle
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const Nav = ({ token, handleLogout, onLoginClick }) => (
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
        <button onClick={handleLogout} className="bg-white/10 hover:bg-red-500/20 text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all border border-transparent hover:border-red-500/50 flex items-center gap-2">
          Cerrar Sesión
        </button>
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
          <a href="#upload" className="w-full sm:w-auto bg-white text-black hover:bg-stone-200 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all group">
            <Upload className="w-5 h-5 group-hover:scale-110 transition-transform" />
            Subir archivos JSON
          </a>
          <a href="#how-it-works" className="w-full sm:w-auto glass hover:bg-white/10 px-8 py-4 rounded-2xl font-bold border border-white/10 transition-all flex items-center justify-center gap-2">
            Ver Tutorial <ArrowRight className="w-5 h-5" />
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

const HowItWorks = () => (
  <section id="how-it-works" className="py-24">
    <div className="container mx-auto px-6 flex flex-col md:flex-row gap-16 items-center">
      <div className="md:w-1/2">
        <h2 className="text-4xl font-bold mb-8">Cómo funciona en solo <span className="text-toxic">3 pasos</span></h2>
        <div className="space-y-4">
          <Step
            number="1"
            title="Instala la Extensión"
            description="Agrega la extensión TóxicaTracker a tu navegador Chrome (¡Es gratis y segura!)."
          />
          <Step
            number="2"
            title="Abre Instagram Web"
            description="Inicia sesión en instagram.com normalmente en otra pestaña."
          />
          <Step
            number="3"
            title="Extrae la verdad en 10 segs"
            description="Haz click en el botón de la extensión. Extraerá las listas instantáneamente sin contraseñas y te traerá de vuelta aquí."
          />
        </div>
      </div>
      <div className="md:w-1/2 relative">
        <div className="glass rounded-3xl p-4 overflow-hidden shadow-2xl border-white/10">
          <div className="bg-stone-900 rounded-2xl p-6 aspect-video flex flex-col justify-center items-center gap-4 text-center">
            <div className="w-16 h-16 bg-toxic/20 rounded-full flex items-center justify-center animate-bounce">
              <FileJson className="w-8 h-8 text-toxic" />
            </div>
            <div className="space-y-1">
              <p className="font-bold">Procesando followers_1.json...</p>
              <p className="text-xs text-stone-500">Analizando 2,451 conexiones</p>
            </div>
            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden">
              <div className="bg-toxic h-full w-2/3" />
            </div>
          </div>
        </div>
        <div className="absolute -bottom-6 -right-6 glass p-6 rounded-2xl border-toxic/20 rotate-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <TrendingDown className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <p className="text-xs text-stone-400 uppercase font-bold tracking-wider">Unfollowed</p>
              <p className="text-2xl font-bold">-14</p>
            </div>
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
      q: '🤔 ¿Cómo descargo mi información de Instagram?',
      a: 'Ve a la app de Instagram > Configuración y privacidad > Centro de cuentas > Tu información y permisos > Descargar tu información. Solicita una copia y asegúrate de elegir el formato JSON (no HTML). Luego de unos minutos o horas, te llegará un correo. Al descargarlo, ubica los archivos "followers_1.json" y "following.json" (están en la carpeta "connections").'
    },
    {
      q: '🔒 ¿Es seguro darles mis archivos JSON?',
      a: '¡Sí! Al subir tus archivos, TóxicaTracker los envía de forma segura a nuestro backend y los procesa sin guardar contraseñas ni el acceso director a tu Instagram. De hecho, no necesitas iniciar sesión con Instagram en ninguna parte de nuestra app.'
    },
    {
      q: '👀 ¿Se enterarán si reviso quién me dejó de seguir?',
      a: '¡Para nada! Instagram no le notifica a nadie que descargaste tus datos ni que los subiste aquí. Tu investigación es 100% privada y confidencial, estilo ninja.'
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

export default function App() {
  const [files, setFiles] = useState({ followers: null, following: null });
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  
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

        setLoading(false);
        setResults({
          message: lostFollowers.length > 0 || notFollowingBack.length > 0 ? "¡Se prendió esto! Hay drama. 🔥" : "¡Todo tranqui por ahora! ✨",
          followersCount: followers.length,
          followingCount: following.length,
          notFollowingBack,
          lostFollowers,
          fans: idontFollowBack
        });
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  const [token, setToken] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/auth/${authMode}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!res.ok) throw new Error("Credenciales incorrectas o usuario ya registrado.");
      const data = await res.json();
      setToken(data.token);
      localStorage.setItem('toxic_token', data.token);
      setShowAuth(false);
      setEmail('');
      setPassword('');
      setResults(null); 
      
      // Auto-upload if files are queued
      if (files.followers && files.following) {
        handleUpload(data.token);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
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

      const response = await fetch('/api/analysis/upload', {
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
        fans: data.idontFollowBack || []
      });

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen">
      <Nav token={token} handleLogout={handleLogout} onLoginClick={() => setShowAuth(true)} />
      
      <AnimatePresence>
        {showAuth && (
          <motion.div initial={{opacity: 0}} animate={{opacity: 1}} exit={{opacity: 0}} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div initial={{scale: 0.95}} animate={{scale: 1}} exit={{scale: 0.95}} className="glass p-8 rounded-3xl max-w-sm w-full border-white/10 relative">
              <button onClick={() => setShowAuth(false)} className="absolute top-4 right-4 text-stone-500 hover:text-white">✕</button>
              <HeartCrack className="w-10 h-10 text-toxic mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-center mb-6">{authMode === 'login' ? 'Iniciar Sesión' : 'Registrarse'}</h2>
              <form onSubmit={handleAuth} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-1">Email</label>
                  <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required className="w-full bg-stone-900 border border-white/10 p-3 rounded-xl text-white focus:border-toxic outline-none transition-colors" placeholder="tu@email.com" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-400 mb-1">Contraseña</label>
                  <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required className="w-full bg-stone-900 border border-white/10 p-3 rounded-xl text-white focus:border-toxic outline-none transition-colors" placeholder="••••••••" />
                </div>
                <button type="submit" disabled={loading} className="w-full bg-toxic hover:bg-toxic-dark text-white font-bold py-3 rounded-xl transition-all flex justify-center mt-2">
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : (authMode === 'login' ? 'Entrar' : 'Crear cuenta')}
                </button>
              </form>
              <p className="text-center text-sm text-stone-400 mt-6 cursor-pointer hover:text-white" onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}>
                {authMode === 'login' ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Entra'}
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
          <section className="pt-32 pb-20 container mx-auto px-6">
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="max-w-5xl mx-auto">
              <div className="flex items-center justify-between mb-12">
                <div>
                  <h1 className="text-4xl font-black mb-2 text-gradient">{results.message}</h1>
                  <p className="text-stone-400">Análisis local completado. Tu chisme está a salvo. 🔒</p>
                </div>
                <button onClick={() => setResults(null)} className="glass px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-white/10 transition-all">
                  <LogOut className="w-4 h-4" /> Nuevo reporte
                </button>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-8">
                  <div className="glass p-8 rounded-3xl border-white/10">
                    <h3 className="text-lg font-bold mb-6 text-stone-300 flex items-center gap-2">
                      <Zap className="w-5 h-5 text-yellow-500" /> Resumen Real-time
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <p className="text-3xl font-black">{results.followersCount}</p>
                        <p className="text-xs text-stone-500 uppercase tracking-tighter mt-1 font-bold">Fans</p>
                      </div>
                      <div className="bg-white/5 p-6 rounded-2xl border border-white/5">
                        <p className="text-3xl font-black">{results.followingCount}</p>
                        <p className="text-xs text-stone-500 uppercase tracking-tighter mt-1 font-bold">Siguiendo</p>
                      </div>
                    </div>
                  </div>

                  {/* Changes compared to last time */}
                  <div className="glass p-8 rounded-3xl border-white/10">
                    <h3 className="text-lg font-bold mb-6 text-stone-300">Novedades desde la última vez</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between p-4 bg-emerald-500/5 rounded-2xl border border-emerald-500/10">
                        <span className="text-emerald-500 font-bold">Fans (tú no los sigues)</span>
                        <span className="text-xl font-black">{results.fans.length}</span>
                      </div>
                      <div className="flex items-center justify-between p-4 bg-red-500/5 rounded-2xl border border-red-500/10">
                        <span className="text-red-500 font-bold">Te dejaron de seguir</span>
                        <span className="text-xl font-black">{results.lostFollowers.length}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="glass p-8 rounded-3xl border-white/10 max-h-[600px] flex flex-col">
                  <h3 className="text-lg font-bold mb-6 text-stone-300 flex items-center justify-between">
                    <span>Traidores (No te siguen de vuelta)</span>
                    <span className="bg-toxic/20 text-toxic px-3 py-1 rounded-full text-xs">{results.notFollowingBack.length}</span>
                  </h3>
                  <div className="overflow-y-auto pr-4 space-y-3 custom-scrollbar flex-1">
                    {results.notFollowingBack.map((username, i) => (
                      <div key={i} className="bg-white/5 p-4 rounded-xl flex items-center justify-between group hover:bg-white/10 transition-all border border-transparent hover:border-white/10">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-stone-800 flex items-center justify-center text-xs font-black border border-white/5">
                            {username.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-semibold text-sm">@{username}</span>
                        </div>
                        <a href={`https://instagram.com/${username}`} target="_blank" rel="noreferrer" className="p-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <ArrowRight className="w-4 h-4 text-stone-500" />
                        </a>
                      </div>
                    ))}
                  </div>
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

