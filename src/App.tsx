import { motion, AnimatePresence } from 'motion/react';
import { 
  ExternalLink, 
  Info,
  KeyRound,
  ChevronRight,
  AlertCircle,
  Clock,
  ShieldCheck,
  LogOut
} from 'lucide-react';
import { useState, FormEvent, useEffect } from 'react';
import { APP_LINKS, AppLink } from './constants';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pin, setPin] = useState('');
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    if (pin === '5085') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('PIN incorrecte. Torneu-ho a provar.');
      setPin('');
    }
  };

  const filteredLinks = APP_LINKS;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans selection:bg-mossos-red selection:text-white">
        {/* Background Decorative Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-mossos-blue/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-mossos-red/10 blur-[120px] rounded-full" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] shadow-2xl overflow-hidden">
            <div className="p-10 text-center border-b border-white/5">
              <motion.div 
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="inline-flex items-center justify-center w-20 h-20 bg-mossos-blue rounded-3xl shadow-2xl mb-6 border border-white/10"
              >
                <ShieldCheck className="w-10 h-10 text-white" />
              </motion.div>
              <h1 className="text-2xl font-black text-white tracking-tight mb-2 uppercase">Terminal d'Accés</h1>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">Facilitador per patrulles i Atenea</p>
            </div>
            
            <form onSubmit={handleLogin} className="p-10">
              <div className="mb-8">
                <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-3 ml-1">Codi d'Identificació (PIN)</label>
                <div className="relative">
                  <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                  <input 
                    type="password"
                    maxLength={4}
                    placeholder="••••"
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-5 pl-14 pr-4 text-2xl tracking-[1em] text-center text-white focus:outline-none focus:ring-2 focus:ring-mossos-blue focus:bg-white/10 transition-all placeholder:text-slate-700"
                    value={pin}
                    onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                    autoFocus
                  />
                </div>
                <AnimatePresence>
                  {error && (
                    <motion.p 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="text-mossos-red text-xs font-bold mt-4 flex items-center gap-2 justify-center"
                    >
                      <AlertCircle className="w-4 h-4" /> {error}
                    </motion.p>
                  )}
                </AnimatePresence>
              </div>
              
              <button 
                type="submit"
                className="w-full bg-mossos-blue hover:bg-blue-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-blue-900/40 flex items-center justify-center gap-3 transition-all active:scale-[0.98] uppercase tracking-widest text-sm"
              >
                Validar Credencials <ChevronRight className="w-5 h-5" />
              </button>
            </form>
          </div>
          <p className="text-center mt-8 text-slate-600 text-[10px] font-mono uppercase tracking-[0.3em]">
            Ús exclusiu per a personal autoritzat
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen bg-[#0a0f1a] text-slate-200 font-sans selection:bg-mossos-red selection:text-white flex flex-col overflow-y-auto lg:overflow-hidden relative">
      {/* HUD Grid Background */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

      {/* Top Warning Bar - Critical Info */}
      <div className="bg-mossos-red/90 backdrop-blur-md text-white py-1.5 px-6 flex items-center justify-center gap-3 shadow-lg relative z-[100] border-b border-white/10 shrink-0">
        <div className="w-2 h-2 rounded-full bg-white animate-pulse shadow-[0_0_8px_#FFFFFF]" />
        <span className="text-[10px] font-black uppercase tracking-[0.2em]">
          AVÍS CRÍTIC DE PRIVADESA: Prohibit introduir dades personals o privades als informes.
        </span>
      </div>

      <div className="flex flex-1 flex-col overflow-hidden relative z-10">
        {/* Header - HUD Style */}
        <header className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 px-4 lg:px-8 py-4 lg:py-6 flex flex-col lg:flex-row justify-between items-center gap-4 lg:gap-6 shadow-2xl shrink-0">
          <div className="flex items-center gap-4 lg:gap-6 w-full lg:w-auto">
            <div className="relative shrink-0">
              <div className="absolute inset-0 bg-mossos-blue blur-xl opacity-20 animate-pulse" />
              <div className="w-12 h-12 lg:w-16 lg:h-16 bg-gradient-to-br from-mossos-blue to-blue-900 rounded-xl lg:rounded-2xl flex items-center justify-center shadow-2xl border border-white/20 relative z-10">
                <ShieldCheck className="w-8 h-8 lg:w-10 lg:h-10 text-white" />
              </div>
            </div>
            <div className="flex-1 lg:flex-none">
              <h1 className="text-xl lg:text-3xl font-black text-white tracking-tighter uppercase leading-none mb-1 flex items-center gap-2 lg:gap-3">
                MOSSOS D'ESQUADRA
                <span className="text-[8px] lg:text-[10px] bg-mossos-red px-1.5 lg:px-2 py-0.5 rounded font-bold tracking-widest">LIVE</span>
              </h1>
              <div className="flex flex-col lg:flex-row lg:items-center gap-1 lg:gap-4">
                <h2 className="text-blue-400 text-[10px] lg:text-sm font-black uppercase tracking-[0.1em] lg:tracking-[0.2em]">Unitat de Trànsit • Atenea</h2>
                <span className="hidden lg:block h-px w-8 bg-slate-700" />
                <div className="flex items-center gap-2 bg-blue-500/10 px-2 lg:px-3 py-0.5 lg:py-1 rounded-lg border border-blue-500/20 w-fit">
                  <KeyRound className="w-3 h-3 lg:w-4 lg:h-4 text-blue-400" />
                  <span className="text-[8px] lg:text-[10px] font-black text-blue-300 uppercase tracking-widest">AES-256 Activa</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between lg:justify-end gap-4 lg:gap-8 w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-4 lg:pt-0">
            <div className="flex flex-col items-start lg:items-end">
              <div className="flex items-center gap-3 lg:gap-4 mb-1">
                <div className="flex flex-col items-start lg:items-end order-2 lg:order-1">
                  <span className="text-[8px] lg:text-[9px] font-black text-slate-500 uppercase tracking-widest">Data i Hora Local</span>
                  <span className="text-2xl lg:text-4xl font-mono font-black text-white tracking-tighter tabular-nums">
                    {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                  </span>
                </div>
                <Clock className="w-6 h-6 lg:w-8 lg:h-8 text-mossos-red animate-pulse order-1 lg:order-2" />
              </div>
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-[8px] lg:text-[10px] font-black text-emerald-500 uppercase tracking-[0.2em] lg:tracking-[0.4em]">@5085 • TERMINAL OPERATIVA</span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsAuthenticated(false)}
              className="p-3 lg:p-4 rounded-xl lg:rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:bg-mossos-red hover:text-white hover:border-mossos-red transition-all shadow-lg group shrink-0"
              title="Sortir del Sistema"
            >
              <LogOut className="w-5 h-5 lg:w-7 lg:h-7 group-hover:scale-110 transition-transform" />
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 p-4 lg:p-10 flex flex-col min-h-0">
          <div className="max-w-7xl mx-auto w-full flex flex-col h-full">
            <div className="mb-4 lg:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-3 lg:gap-4">
                <div className="w-1 h-4 lg:h-6 bg-mossos-red rounded-full" />
                <h3 className="text-[10px] lg:text-xs font-black tracking-[0.2em] lg:tracking-[0.4em] text-slate-400 uppercase">
                  Mòduls Operatius Disponibles [{filteredLinks.length}]
                </h3>
              </div>
              <div className="text-[8px] lg:text-[10px] font-mono text-slate-500 uppercase tracking-widest bg-white/5 px-3 lg:px-4 py-1 rounded-full border border-white/5 w-fit">
                Status: Secure Connection Established
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-8">
              {filteredLinks.map((link, index) => (
                <AppCard key={link.id} link={link} index={index} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

function AppCard({ link, index }: { link: AppLink, index: number, key?: string | number }) {
  const Icon = link.icon;
  
  return (
    <motion.a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05, duration: 0.4 }}
      className="group relative bg-[#1e293b]/40 backdrop-blur-sm rounded-2xl lg:rounded-3xl p-5 lg:p-6 border border-white/10 hover:border-mossos-blue/50 hover:bg-[#1e293b]/60 transition-all duration-500 shadow-xl flex flex-col justify-between h-full group overflow-hidden min-h-[160px] lg:min-h-0"
    >
      {/* Tactical Corner Lines */}
      <div className="absolute top-0 left-0 w-3 lg:w-4 h-3 lg:h-4 border-t-2 border-l-2 border-white/10 group-hover:border-mossos-blue/50 transition-colors" />
      <div className="absolute top-0 right-0 w-3 lg:w-4 h-3 lg:h-4 border-t-2 border-r-2 border-white/10 group-hover:border-mossos-blue/50 transition-colors" />
      <div className="absolute bottom-0 left-0 w-3 lg:w-4 h-3 lg:h-4 border-b-2 border-l-2 border-white/10 group-hover:border-mossos-blue/50 transition-colors" />
      <div className="absolute bottom-0 right-0 w-3 lg:w-4 h-3 lg:h-4 border-b-2 border-r-2 border-white/10 group-hover:border-mossos-blue/50 transition-colors" />

      {/* Background Glow */}
      <div className="absolute -bottom-20 -right-20 w-32 lg:w-40 h-32 lg:h-40 bg-mossos-blue/5 blur-[40px] lg:blur-[60px] group-hover:bg-mossos-blue/10 transition-colors duration-500" />
      
      <div className="flex justify-between items-start relative z-10">
        <div className={`w-12 h-12 lg:w-16 lg:h-16 rounded-xl lg:rounded-2xl flex items-center justify-center transition-all duration-500 shadow-2xl border border-white/10 ${
          link.category === 'dictat' ? 'bg-blue-600/20 text-blue-400' :
          link.category === 'imatges' ? 'bg-emerald-600/20 text-emerald-400' :
          'bg-purple-600/20 text-purple-400'
        } group-hover:scale-110 group-hover:bg-mossos-blue group-hover:text-white`}>
          <Icon className="w-6 h-6 lg:w-8 lg:h-8" />
        </div>
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 bg-black/40 px-2 lg:px-3 py-0.5 lg:py-1 rounded-full border border-white/5">
            <div className="w-1 h-1 lg:w-1.5 lg:h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[8px] lg:text-[9px] font-black text-emerald-400 uppercase tracking-widest">Secure</span>
          </div>
          <span className="text-[7px] lg:text-[8px] font-mono text-slate-500 uppercase tracking-tighter">{link.code}</span>
        </div>
      </div>

      <div className="relative z-10 mt-4 lg:mt-6">
        <h3 className="text-lg lg:text-2xl font-black text-white group-hover:text-blue-400 transition-colors duration-300 uppercase tracking-tighter leading-none mb-2 lg:mb-3">
          {link.title}
        </h3>
        <p className="text-slate-400 text-[10px] lg:text-sm font-medium leading-relaxed line-clamp-2 lg:line-clamp-3 group-hover:text-slate-300 transition-colors">
          {link.description}
        </p>
      </div>
      
      <div className="flex items-center justify-between pt-4 lg:pt-6 border-t border-white/5 relative z-10 mt-4 lg:mt-6">
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 rounded-full ${
            link.category === 'dictat' ? 'bg-blue-500' :
            link.category === 'imatges' ? 'bg-emerald-500' :
            'bg-purple-500'
          }`} />
          <span className="text-[8px] lg:text-[10px] font-black uppercase tracking-[0.1em] lg:tracking-[0.2em] text-slate-500">
            {link.category}
          </span>
        </div>
        <div className="flex items-center gap-2 lg:gap-3 text-blue-400 font-black uppercase tracking-widest text-[10px] lg:text-xs opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-all translate-x-0 lg:translate-x-4 lg:group-hover:translate-x-0">
          <span className="hidden sm:inline">Executar</span>
          <div className="w-8 h-8 lg:w-10 lg:h-10 rounded-lg lg:rounded-xl bg-mossos-blue text-white flex items-center justify-center shadow-2xl transform group-hover:rotate-12 transition-transform">
            <ExternalLink className="w-4 h-4 lg:w-5 lg:h-5" />
          </div>
        </div>
      </div>
    </motion.a>
  );
}
