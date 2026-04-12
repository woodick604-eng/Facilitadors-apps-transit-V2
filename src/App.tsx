import { motion, AnimatePresence } from 'motion/react';
import {
  ExternalLink,
  Info,
  KeyRound,
  ChevronRight,
  AlertCircle,
  Clock,
  ShieldCheck,
  LogOut,
  X,
  Maximize2,
  Users,
  Settings,
  Activity,
  UserPlus,
  RefreshCw,
  Search,
  Monitor,
  LayoutGrid,
  Home,
  Mail,
  Edit2,
  Check,
  Scale,
  Sparkles
} from 'lucide-react';
import { useState, FormEvent, useEffect, useMemo } from 'react';
import { APP_LINKS, AppLink } from './constants';
import { db, dictatDb } from './firebase';
import { doc, getDoc, updateDoc, setDoc, collection, addDoc, query, orderBy, limit, onSnapshot, serverTimestamp, where } from 'firebase/firestore';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [tipInput, setTipInput] = useState('');
  const [pin, setPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [currentUser, setCurrentUser] = useState<{ tip: string, name: string, isAdmin?: boolean } | null>(null);
  const [error, setError] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeApp, setActiveApp] = useState<AppLink | null>(null);
  const [showLegalModal, setShowLegalModal] = useState(false);
  const [showAdmin, setShowAdmin] = useState(false);
  const [logs, setLogs] = useState<any[]>([]);
  const [costLogs, setCostLogs] = useState<any[]>([]);
  const [rankLogs, setRankLogs] = useState<any[]>([]);
  const [usersList, setUsersList] = useState<any[]>([]);
  const [dictatLogs, setDictatLogs] = useState<any[]>([]);
  const [appStatuses, setAppStatuses] = useState<Record<string, string>>({});

  useEffect(() => {
    const hasAccepted = localStorage.getItem('legal_accepted_v_global');
    if (!hasAccepted) {
      setShowLegalModal(true);
    }
  }, []);

  // Real-time validation states
  const [isTipValidated, setIsTipValidated] = useState(false);
  const [tempUserData, setTempUserData] = useState<any>(null);
  const [iframeKey, setIframeKey] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-omplir TIP des de localStorage despres de veure l'animacio de la moto
  useEffect(() => {
    const saved = localStorage.getItem('agentTIP');
    if (saved) {
      const t = setTimeout(() => setTipInput(saved), 1800);
      return () => clearTimeout(t);
    }
  }, []);

  // Scroll al camp PIN quan el TIP es valida (util al mobil)
  useEffect(() => {
    if (isTipValidated) {
      const t = setTimeout(() => {
        const pinInput = document.querySelector<HTMLElement>('input[type="password"]');
        if (pinInput) pinInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 450);
      return () => clearTimeout(t);
    }
  }, [isTipValidated]);

  // Real-time TIP validation logic
  useEffect(() => {
    const validateTip = async () => {
      let input = tipInput.toUpperCase().trim();
      if (!input) {
        setIsTipValidated(false);
        setTempUserData(null);
        setError('');
        return;
      }

      // Extract only digits from input
      const digits = input.replace(/\D/g, '');

      let searchTip = '';
      if (digits.length > 0 && digits.length <= 6) {
        // Handle numeric-only or PG+number by padding the numbers
        searchTip = 'PG' + digits.padStart(6, '0');
      } else if (input.startsWith('PG') && input.length === 8) {
        // Already formatted
        searchTip = input;
      }

      if (searchTip && searchTip.length === 8) {
        try {
          const userDoc = await getDoc(doc(db, 'users', searchTip));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.status === 'off') {
              setIsTipValidated(false);
              setTempUserData(null);
              setError('AGENT DONAT DE BAIXA DEL SISTEMA.');
              return;
            }
            setIsTipValidated(true);
            setTempUserData(userData);
            setError('');
          } else {
            setIsTipValidated(false);
            setTempUserData(null);
            // Show error if they entered something that looks like it's done
            if (input.length >= 4) {
              setError('Agent no registrat.');
            }
          }
        } catch (err) {
          console.error(err);
        }
      } else {
        setIsTipValidated(false);
        setTempUserData(null);
        setError('');
      }
    };
    validateTip();
  }, [tipInput]);

  useEffect(() => {
    if (currentUser?.isAdmin && showAdmin) {
      const q = query(collection(db, 'logs'), orderBy('timestamp', 'desc'), limit(300));
      const unsubscribe1 = onSnapshot(q, (snapshot) => {
        setLogs(snapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() }))
        );
      });

      const qu = collection(db, 'users');
      const unsubscribe2 = onSnapshot(qu, (snapshot) => {
        setUsersList(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const q3 = query(collection(dictatDb, 'dictat_accidents_t06'), orderBy('timestamp', 'desc'), limit(100));
      const unsubscribe3 = onSnapshot(q3, (snapshot) => {
        const uniqueDictat: any[] = [];
        const seenNats = new Set<string>();
        
        snapshot.docs.forEach((doc) => {
          const data = doc.data();
          const logNat = data.nat || 'SENSE NAT';
          
          if (logNat === 'SENSE NAT' || !seenNats.has(logNat)) {
            if (logNat !== 'SENSE NAT') {
              seenNats.add(logNat);
            }
            uniqueDictat.push({ id: doc.id, ...data });
          }
        });
        
        setDictatLogs(uniqueDictat);
      });

      const q4 = query(collection(db, 'logs'), where('action', '==', 'Cost de servei'));
      const unsubscribe4 = onSnapshot(q4, (snapshot) => {
        setCostLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const q5 = query(collection(db, 'logs'), where('action', '==', 'Obertura App'));
      const unsubscribe5 = onSnapshot(q5, (snapshot) => {
        setRankLogs(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      });

      const q6 = collection(db, 'app_status');
      const unsubscribe6 = onSnapshot(q6, (snapshot) => {
        const statuses: Record<string, string> = {};
        snapshot.docs.forEach(doc => {
          statuses[doc.id] = doc.data().status;
        });
        setAppStatuses(statuses);
      });

      return () => {
        unsubscribe1();
        unsubscribe2();
        unsubscribe3();
        unsubscribe4();
        unsubscribe5();
        unsubscribe6();
      };
    }
  }, [currentUser, showAdmin]);

  useEffect(() => {
    const handleChildReady = (event: MessageEvent) => {
      // Quan una app filla diu que està a punt, li enviem el TIP de l'agent
      if (event.data?.type === 'APP_READY' && currentUser?.tip) {
        const displayTip = currentUser.tip.startsWith('PG') ? currentUser.tip.slice(2).replace(/^0+/, '') : currentUser.tip;
        console.log("App filla preparada. Re-enviant TIP per sincronització:", displayTip);
        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
          if (iframe.contentWindow) {
            iframe.contentWindow.postMessage(
              { type: 'AGENT_TIP', tip: displayTip },
              '*'
            );
          }
        });
      }
    };
    window.addEventListener('message', handleChildReady);
    return () => window.removeEventListener('message', handleChildReady);
  }, [currentUser]);

  const logActivity = async (action: string, metadata: any = {}) => {
    if (!currentUser || currentUser.isAdmin) return;

    try {
      await addDoc(collection(db, 'logs'), {
        tip: currentUser.tip,
        name: currentUser.name,
        action,
        timestamp: serverTimestamp(),
        ...metadata
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Computar agents actius (logs en els últims 30 minuts)
  const activeAgents = useMemo(() => {
    const now = new Date();
    const threshold = 30 * 60 * 1000; // 30 minuts
    const active = new Map();

    logs.forEach(log => {
      const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
      if (now.getTime() - logDate.getTime() < threshold && !log.isAdmin) {
        if (!active.has(log.tip)) {
          active.set(log.tip, { tip: log.tip, name: log.name, lastSeen: logDate });
        }
      }
    });

    return Array.from(active.values());
  }, [logs]);

  const handleAuth = async (e: FormEvent) => {
    e.preventDefault();
    if (!isTipValidated || !tempUserData) return;

    if (tempUserData.firstLogin) {
      if (pin.length !== 4) {
        setError('El PIN ha de tenir 4 dígits.');
        return;
      }
      if (pin !== confirmPin) {
        setError('Els PINs no coincideixen.');
        return;
      }

      try {
        await updateDoc(doc(db, 'users', tempUserData.tip), {
          pin: pin,
          firstLogin: false
        });
        const finalUser = { tip: tempUserData.tip, name: tempUserData.name, isAdmin: false };
        setCurrentUser(finalUser);
        setIsAuthenticated(true);
        localStorage.setItem('agentTIP', tipInput);
        logActivity('Configuració inicial PIN');
      } catch (err) {
        setError('Error guardant el PIN.');
      }
    } else {
      if (pin === tempUserData.pin) {
        setCurrentUser({ tip: tempUserData.tip, name: tempUserData.name, isAdmin: tempUserData.isAdmin });
        setIsAuthenticated(true);
        localStorage.setItem('agentTIP', tipInput);
        logActivity('Inici de sessió');
      } else {
        setError('PIN incorrecte.');
        setPin('');
      }
    }
  };

  const handleAdminPinReset = async (userTip: string) => {
    try {
      await updateDoc(doc(db, 'users', userTip), {
        pin: '5085', // Default for reset, will trigger registration flow
        firstLogin: true
      });
      logActivity('Restabliment PIN (Admin)', { target: userTip });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleUserStatus = async (userTip: string, currentStatus: string) => {
    try {
      await updateDoc(doc(db, 'users', userTip), {
        status: currentStatus === 'off' ? 'on' : 'off'
      });
      logActivity('Canvi estat agent (Admin)', { target: userTip, status: currentStatus === 'off' ? 'on' : 'off' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateUser = async (tip: string, name: string) => {
    try {
      // Format tip
      const digits = tip.replace(/\D/g, '');
      const searchTip = 'PG' + digits.padStart(6, '0');

      await setDoc(doc(db, 'users', searchTip), {
        tip: searchTip,
        name: name.toUpperCase(),
        pin: '5085',
        firstLogin: true,
        status: 'on'
      });
      logActivity('Alta nou agent (Admin)', { target: searchTip });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateUserName = async (userTip: string, newName: string) => {
    try {
      await updateDoc(doc(db, 'users', userTip), {
        name: newName.toUpperCase()
      });
      logActivity('Canvi nom agent (Admin)', { target: userTip, name: newName.toUpperCase() });
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleAppStatus = async (appId: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'online' ? 'maintenance' : 'online';
      await setDoc(doc(db, 'app_status', appId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      }, { merge: true });
      logActivity('Canvi estat app (Admin)', { target: appId, status: newStatus });
    } catch (err) {
      console.error(err);
    }
  };

  const iframeUrl = useMemo(() => {
    if (!activeApp) return '';
    return `${activeApp.url}${activeApp.url.includes('?') ? '&' : '?'}v=${Date.now()}`;
  }, [activeApp?.id, iframeKey]);

  // Sol·licitar permís de micròfon quan s'obre qualsevol app
  useEffect(() => {
    if (activeApp) {
      navigator.mediaDevices?.getUserMedia({ audio: true })
        .then(stream => stream.getTracks().forEach(t => t.stop()))
        .catch(() => { }); // Silenciar errors si l'usuari deneega
    }
  }, [activeApp?.id]);

  // Receptor de costos i èxits de les apps filles
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'COST_UPDATE' && event.data?.cost) {
        logActivity('Cost de servei', {
          cost: parseFloat(event.data.cost),
          app: event.data.app || activeApp?.title || 'Desconeguda',
          service: event.data.service || 'Servei IA'
        });
      }

      // Nou listener per a descàrregues o èxits
      if (event.data?.type === 'DOWNLOAD_REPORT' || event.data?.type === 'REPORT_SUCCESS' || event.data?.type === 'DOWNLOAD_ZIP') {
        logActivity('DESCÀRREGA / ÈXIT', {
          app: event.data.app || activeApp?.title || 'Desconeguda',
          filename: event.data.filename || event.data.file || 'Informe Generat',
          status: 'success'
        });
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [activeApp]);

  if (activeApp) {
    return (
      <div className="fixed inset-0 z-[1000] bg-black flex flex-col">
        <div className="bg-[#0f172a] border-b border-white/10 p-2 flex items-center justify-between px-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-mossos-blue rounded-lg flex items-center justify-center">
              <activeApp.icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white text-xs font-black uppercase tracking-wider">{activeApp.title}</h3>
              <p className="text-slate-500 text-[8px] font-mono">TÚNEL SEGUR ACTIU</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {currentUser?.isAdmin && (
              <button
                onClick={() => { logActivity('Obertura Dashboard (Iframe)'); setShowAdmin(!showAdmin); setActiveApp(null); }}
                className={`p-2 rounded-lg border transition-all ${showAdmin ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}
              >
                <Users className="w-4 h-4" />
                {activeAgents.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center border-2 border-[#0f172a] animate-pulse">
                    {activeAgents.length}
                  </span>
                )}
              </button>
            )}
            {currentUser && (
              <>
                <div className="hidden sm:flex items-center bg-black/30 border border-white/10 rounded-lg px-2 py-1 mr-4 ml-8">
                  <AgentBadge tip={currentUser.tip} className="text-[14px] px-3 py-1 flex-shrink-0" />
                </div>
                <div className="w-px h-4 bg-white/10 mx-1 hidden sm:block" />
              </>
            )}
            <button
              title="Anar a la Pàgina Principal"
              onClick={() => { logActivity('Tornar a Pàgina Principal', { app: activeApp.title }); setActiveApp(null); }}
              className="flex items-center gap-2 p-2 px-3 bg-white/5 hover:bg-white/10 rounded-lg text-white text-[10px] font-black uppercase tracking-wider transition-colors"
            >
              <Home className="w-4 h-4" /> Pàgina Principal
            </button>
            <div className="w-px h-4 bg-white/10 mx-2" />
            <button title="Forçar recàrrega d'última versió" onClick={() => setIframeKey(k => k + 1)} className="flex items-center gap-2 p-2 px-3 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 rounded-lg text-[10px] font-black uppercase tracking-wider transition-colors"><RefreshCw className="w-4 h-4" /> Recarregar</button>
          </div>
        </div>
        <div className="flex-1 w-full h-full bg-white relative">
          <iframe
            key={iframeKey}
            src={iframeUrl}
            className="w-full h-full border-none"
            title={activeApp.title}
            allow="microphone; camera"
            onLoad={(e) => {
              // Enviem el TIP de l'agent a l'app filla un cop carregada
              const iframe = e.currentTarget as HTMLIFrameElement;
              if (currentUser?.tip && iframe.contentWindow) {
                const displayTip = currentUser.tip.startsWith('PG') ? currentUser.tip.slice(2).replace(/^0+/, '') : currentUser.tip;
                iframe.contentWindow.postMessage(
                  { type: 'AGENT_TIP', tip: displayTip },
                  '*'
                );
              }
            }}
          />
        </div>

        {showLegalModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-[#0b1624] border-2 border-slate-800 w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)] flex flex-col relative">
              
              {/* CAPÇALERA DE SEGURETAT */}
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-indigo-950/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
                     <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Avís Legal i Propietat Intel·lectual</h2>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">© @5085 - Atenea Hub System</p>
                  </div>
                </div>
              </div>
              
              {/* CONTINGUT JURÍDIC CLAU */}
              <div className="p-10 overflow-y-auto custom-scrollbar space-y-10 text-slate-300">
                
                <section className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                     <ShieldCheck className="w-4 h-4" /> 1. Criteris d'Ús Professional (Facilitadors Trànsit)
                  </h3>
                  <p className="text-[13px] leading-relaxed font-medium">
                     Aquesta aplicació ha estat dissenyada per a ús exclusiu de les Forces i Cossos de Seguretat. Les narratives, càlculs i automatitzacions proporcionades són una **eina de suport** i no substitueixen la responsabilitat de l'agent instructor en la formalització del document oficial.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                     <Scale className="w-4 h-4" /> 2. Propietat Intel·lectual i © Copyright
                  </h3>
                  <p className="text-[13px] leading-relaxed font-medium">
                     L'arquitectura de programari, els algoritmes lògics i els motors de generació de continguts digitals **de totes les apps contingudes en aquest facilitador** són propietat intel·lectual protegida de **© @5085 - Atenea Hub System**. Queda prohibida la reproducció, explotació comercial o qualsevol forma d'enginyeria inversa sense autorització expressa.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.15em] flex items-center gap-3">
                     <AlertCircle className="w-4 h-4" /> 3. ADVERTÈNCIA PROTECCIÓ DE DADES (RGPD)
                  </h3>
                  <p className="text-[12px] font-black leading-relaxed bg-red-500/10 border-2 border-red-500/20 p-8 rounded-[2rem] text-red-100 uppercase tracking-tighter shadow-xl">
                     "PER SEGURETAT JURÍDICA I COMPLIMENT DEL RGPD, QUEDA TERMINANTMENT PROHIBIT INTRODUIR DADES DE CARÀCTER PERSONAL (NOMS, COGNOMS, DNI O CONTACTE) DINS DE L'APLICATIU. ELS CAMPS HAN DE SER OMPLERTS NOMÉS AMB DADES TÈCNIQUES I PROFESSIONALS."
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                     <Sparkles className="w-4 h-4" /> 4. Disclaimer de IA (Gemini 2.0)
                  </h3>
                  <p className="text-[13px] leading-relaxed bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl italic font-medium">
                     "L'usuari té l'obligació inexcusable de revisar tots els relats, càlculs i dades generades abans de la seva signatura oficial o tramesa. Els models de IA poden presentar errors puntuals basats en les dades d'entrada."
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                     <KeyRound className="w-4 h-4" /> 5. Seguretat de Credencials
                  </h3>
                  <p className="text-[13px] leading-relaxed font-medium italic">
                     "L'usuari és el responsable exclusiu de protegir les seves claus d'accés i no facilitar-les a tercers. L'incompliment d'aquesta norma de seguretat pot comportar la revocació immediata de l'accés al sistema."
                  </p>
                </section>

                <div className="pt-8 border-t border-slate-800 text-center">
                  <p className="text-[11px] font-mono text-slate-600 uppercase tracking-[0.4em]">v3.47.8-SYSTEM-LOG-AUTH-OK</p>
                </div>
              </div>

              {/* FOOTER D'ACCEPTACIÓ */}
              <div className="p-8 bg-slate-950/50 border-t border-slate-800 flex justify-center">
                <button 
                  onClick={() => {
                    localStorage.setItem('legal_accepted_v_global', 'true');
                    setShowLegalModal(false);
                  }}
                  className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all border border-indigo-400/30 active:scale-95"
                >
                  Accepto els termes i condicions de seguretat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4 font-sans text-white">
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl relative overflow-hidden">
          {isTipValidated && (
            <div className="absolute top-0 right-0 p-4">
              <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-widest border border-emerald-500/20 animate-pulse">Agent Validat</div>
            </div>
          )}

          <div className="text-center mb-6 lg:mb-8">
            <div className={`inline-flex items-center justify-center w-60 h-80 lg:w-[312px] lg:h-[416px] mb-6 lg:mb-8 transition-all duration-500 rounded-[3.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl mx-auto border-4 border-white/5 animate-pulse-fast relative`}>
              <img src="/escud-transit-v2.png" className="w-full h-full object-cover" alt="Escut Trànsit" />
              {/* Pilot blau Davanter (dreta, al costat de la roda far davanter) */}
              <div className="absolute w-[2.5%] h-[1.8%] bg-blue-400 rounded-full animate-police-strobe mix-blend-screen" style={{ top: '38.5%', right: '29.5%' }} />
              {/* Pilot blau Posterior (esquerra, seient posterior) */}
              <div className="absolute w-[2.5%] h-[1.8%] bg-blue-400 rounded-full animate-police-strobe-delayed mix-blend-screen" style={{ top: '36.5%', left: '38.5%' }} />
            </div>
            <h1 className="text-2xl lg:text-3xl font-black uppercase tracking-tight">
              ACCÈS APPS FACILITADORES TRÀNSIT
            </h1>
            <p className="text-slate-400 text-[10px] font-bold uppercase tracking-[0.2em] mt-2 mb-3">Personal Autoritzat • UNITAT DE TRÀNSIT</p>
            <div className="flex items-center justify-center gap-2 opacity-50">
              <AgentBadge tip="@5085" className="text-[10px] px-1.5 py-0.5" /> 
              <span className="text-slate-400 text-[8px] tracking-widest font-black uppercase">• Versió 2.50</span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-6">
            <div className={`transition-all ${tipInput.length > 0 ? 'flex flex-col items-center' : ''}`}>
              <label className={`block text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 ${tipInput.length > 0 ? 'text-center pl-0' : 'pl-1'}`}>Número TIP</label>
              <div className={`relative flex items-center transition-all ${tipInput.length > 0 ? 'justify-center w-fit' : 'w-full'}`}>
                <input
                  type="text" placeholder="Ex: 2941"
                  className={`border py-3 outline-none transition-all ${
                    tipInput.length > 0
                      ? 'w-[140px] px-2 text-center text-2xl tracking-[0.2em] font-mono font-black rounded-xl border-amber-500 bg-[#0a0f1a] text-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.15)]'
                      : 'w-full pl-6 pr-6 py-4 text-xl rounded-2xl bg-white/5 border-white/10 focus:border-mossos-blue text-white'
                  }`}
                  value={tipInput} onChange={(e) => setTipInput(e.target.value.replace(/\D/g, ''))} maxLength={5}
                  autoFocus={!isTipValidated}
                />
                {isTipValidated && <ShieldCheck className="absolute -right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-emerald-500" />}
              </div>
            </div>

            <AnimatePresence>
              {isTipValidated && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-6 overflow-hidden">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-xl text-center">
                    <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">AGENT VALIDAT: {tempUserData?.name}</p>
                    {tempUserData?.firstLogin && <p className="text-[8px] text-slate-400 uppercase mt-1">Si us plau, crea el teu PIN personal de 4 xifres</p>}
                  </div>

                  {tempUserData?.firstLogin ? (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pl-1">Crea el teu PIN</label>
                        <div className="relative">
                          <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input type="password" maxLength={4} placeholder="••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-2xl tracking-[1em] text-center text-white outline-none focus:ring-2 focus:ring-emerald-500" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} />
                        </div>
                      </div>
                      <div>
                        <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pl-1">Confirma el teu PIN</label>
                        <div className="relative">
                          <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                          <input type="password" maxLength={4} placeholder="••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-2xl tracking-[1em] text-center text-white outline-none focus:ring-2 focus:ring-emerald-500" value={confirmPin} onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))} />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block text-slate-500 text-[10px] font-bold uppercase tracking-[0.2em] mb-2 pl-1">Entra el teu PIN personal</label>
                      <div className="relative">
                        <KeyRound className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                        <input type="password" maxLength={4} placeholder="••••" className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-14 pr-4 text-2xl tracking-[1em] text-center text-white outline-none focus:ring-2 focus:ring-mossos-blue" value={pin} onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))} autoFocus />
                      </div>
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {error && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2 justify-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">
                <AlertCircle className="w-4 h-4 text-red-500" />
                <p className="text-red-500 text-[10px] font-black uppercase tracking-widest">{error}</p>
              </motion.div>
            )}

            <button
              type="submit" disabled={!isTipValidated}
              className={`w-full py-5 rounded-2xl font-black uppercase tracking-widest text-sm shadow-xl transition-all active:scale-95 ${isTipValidated ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-slate-700 cursor-not-allowed opacity-50'}`}
            >
              {tempUserData?.firstLogin ? 'Registrar PIN i Accedir' : 'Validar Credencials'}
            </button>
          </form>

          {/* Botó de contacte discret */}
          <ContactButton />

          <div className="mt-8 pt-6 border-t border-white/5 flex flex-col items-center gap-1 opacity-30">
            <p className="text-[7px] font-medium uppercase tracking-widest text-slate-500">SISTEMA FACILITADOR TRÀNSIT • AES-256</p>
          </div>
        </div>

        {showLegalModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-500">
            <div className="bg-[#0b1624] border-2 border-slate-800 w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)] flex flex-col relative">
              
              {/* CAPÇALERA DE SEGURETAT */}
              <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-indigo-950/30">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
                     <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Avís Legal i Propietat Intel·lectual</h2>
                    <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">© @5085 - Atenea Hub System</p>
                  </div>
                </div>
              </div>
              
              {/* CONTINGUT JURÍDIC CLAU */}
              <div className="p-10 overflow-y-auto custom-scrollbar space-y-10 text-slate-300">
                
                <section className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                     <ShieldCheck className="w-4 h-4" /> 1. Criteris d'Ús Professional (Facilitadors Trànsit)
                  </h3>
                  <p className="text-[13px] leading-relaxed font-medium">
                     Aquesta aplicació ha estat dissenyada per a ús exclusiu de les Forces i Cossos de Seguretat. Les narratives, càlculs i automatitzacions proporcionades són una **eina de suport** i no substitueixen la responsabilitat de l'agent instructor en la formalització del document oficial.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                     <Scale className="w-4 h-4" /> 2. Propietat Intel·lectual i © Copyright
                  </h3>
                  <p className="text-[13px] leading-relaxed font-medium">
                     L'arquitectura de programari, els algoritmes lògics i els motors de generació de continguts digitals **de totes les apps contingudes en aquest facilitador** són propietat intel·lectual protegida de **© @5085 - Atenea Hub System**. Queda prohibida la reproducció, explotació comercial o qualsevol forma d'enginyeria inversa sense autorització expressa.
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.15em] flex items-center gap-3">
                     <AlertCircle className="w-4 h-4" /> 3. ADVERTÈNCIA PROTECCIÓ DE DADES (RGPD)
                  </h3>
                  <p className="text-[12px] font-black leading-relaxed bg-red-500/10 border-2 border-red-500/20 p-8 rounded-[2rem] text-red-100 uppercase tracking-tighter shadow-xl">
                     "PER SEGURETAT JURÍDICA I COMPLIMENT DEL RGPD, QUEDA TERMINANTMENT PROHIBIT INTRODUIR DADES DE CARÀCTER PERSONAL (NOMS, COGNOMS, DNI O CONTACTE) DINS DE L'APLICATIU. ELS CAMPS HAN DE SER OMPLERTS NOMÉS AMB DADES TÈCNIQUES I PROFESSIONALS."
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                     <Sparkles className="w-4 h-4" /> 4. Disclaimer de IA (Gemini 2.0)
                  </h3>
                  <p className="text-[13px] leading-relaxed bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl italic font-medium">
                     "L'usuari té l'obligació inexcusable de revisar tots els relats, càlculs i dades generades abans de la seva signatura oficial o tramesa. Els models de IA poden presentar errors puntuals basats en les dades d'entrada."
                  </p>
                </section>

                <section className="space-y-4">
                  <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                     <KeyRound className="w-4 h-4" /> 5. Seguretat de Credencials
                  </h3>
                  <p className="text-[13px] leading-relaxed font-medium italic">
                     "L'usuari és el responsable exclusiu de protegir les seves claus d'accés i no facilitar-les a tercers. L'incompliment d'aquesta norma de seguretat pot comportar la revocació immediata de l'accés al sistema."
                  </p>
                </section>

                <div className="pt-8 border-t border-slate-800 text-center">
                  <p className="text-[11px] font-mono text-slate-600 uppercase tracking-[0.4em]">v3.47.8-SYSTEM-LOG-AUTH-OK</p>
                </div>
              </div>

              {/* FOOTER D'ACCEPTACIÓ */}
              <div className="p-8 bg-slate-950/50 border-t border-slate-800 flex justify-center">
                <button 
                  onClick={() => {
                    localStorage.setItem('legal_accepted_v_global', 'true');
                    setShowLegalModal(false);
                  }}
                  className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all border border-indigo-400/30 active:scale-95"
                >
                  Accepto els termes i condicions de seguretat
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen bg-[#0a0f1a] text-slate-200 font-sans flex flex-col overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

      <header className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 px-8 py-6 flex justify-between items-center shadow-2xl shrink-0">
        <div className="flex items-center gap-6">
          <div className="w-[100px] h-[100px] flex items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-white/10 animate-pulse-fast">
            <img src="/escud-transit-v2.png" className="w-full h-full object-cover" alt="Escut Trànsit" />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tighter uppercase">MOSSOS D'ESQUADRA</h1>
            <div className="flex items-center gap-3">
              <span className="text-blue-400 text-sm font-black uppercase tracking-widest">Unitat de Trànsit</span>
              <span className="text-slate-600 text-[8px] font-black uppercase tracking-widest flex items-center gap-3"><AgentBadge tip="@5085" className="text-[12px] px-2 py-1" /> • VERSIÓ 2.50</span>
              {currentUser?.isAdmin && <span className="text-[8px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black">ADMIN</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right flex items-center gap-6">
            {currentUser?.isAdmin && (
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => {
                    logActivity('Obertura Project Monitor');
                    setActiveApp({
                      id: 'project-monitor',
                      title: 'INFRASTRUCTURE MONITOR',
                      description: 'Control de desplegament i salut del sistema.',
                      url: 'https://atenea-hub-monitor.web.app', // En prod usem el nou domini dedicat
                      icon: Monitor,
                      category: 'gestio',
                      status: 'online',
                      code: 'SYS-MON'
                    });
                  }}
                  className="flex items-center gap-2 p-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 font-black text-[10px] uppercase tracking-widest border border-white/20"
                >
                  <Monitor className="w-5 h-5" /> MOSTRAR MONITOR
                </button>
                <div className="w-px h-8 bg-white/10 mx-2" />
                <button onClick={() => setShowAdmin(!showAdmin)} className={`relative p-4 rounded-xl border transition-all ${showAdmin ? 'bg-amber-500 text-black border-amber-500' : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'}`}>
                  <Users className="w-6 h-6" />
                  {activeAgents.length > 0 && (
                    <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-[10px] w-6 h-6 rounded-full flex items-center justify-center border-2 border-[#0f172a] animate-pulse font-black">
                      {activeAgents.length}
                    </span>
                  )}
                </button>
              </div>
            )}
            <div className="hidden lg:block text-right">
              <span className="block text-4xl font-mono font-black text-white tracking-tighter tabular-nums leading-none">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="block text-[14px] font-black text-slate-400 uppercase tracking-widest mt-2 mb-3">
                {currentTime.toLocaleDateString('ca-ES', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
              <span className="text-[14px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-3">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <AgentBadge tip={currentUser?.tip || ''} className="text-[20px] px-4 py-1.5 ml-2 mr-4" /> • {currentUser?.name}
              </span>
            </div>
            <button 
              onClick={() => {
                logActivity('Obertura Disclaimer Legal');
                setShowLegalModal(true);
              }}
              className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest group"
              title="Consultar Avís Legal i Seguretat"
            >
              <ShieldCheck className="w-6 h-6" /> 
              <span className="hidden xl:block">AVÍS LEGAL</span>
            </button>
            <button 
              onClick={() => { logActivity('Tancament de sessió'); setIsAuthenticated(false); setCurrentUser(null); setShowAdmin(false); setPin(''); setConfirmPin(''); }} 
              className="p-4 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:bg-mossos-red hover:text-white transition-all"
              title="Tancar sessió segura"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-10 overflow-y-auto">
        <div className="max-w-7xl mx-auto h-full">
          {showAdmin && currentUser?.isAdmin ? (
            <AdminDashboard 
              logs={logs} 
              costLogs={costLogs} 
              rankLogs={rankLogs} 
              users={usersList} 
              dictatLogs={dictatLogs} 
              appStatuses={appStatuses}
              onResetPin={handleAdminPinReset} 
              onToggleStatus={handleToggleUserStatus} 
              onCreateUser={handleCreateUser} 
              onUpdateName={handleUpdateUserName}
              onToggleAppStatus={handleToggleAppStatus}
            />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-10">
              {APP_LINKS.map((link, index) => {
                const dynamicStatus = appStatuses[link.id] || link.status;
                return (
                  <AppCard 
                    key={link.id} 
                    link={{ ...link, status: dynamicStatus as any }} 
                    index={index} 
                    onClick={() => { logActivity('Obertura App', { app: link.title }); setActiveApp({ ...link, status: dynamicStatus as any }); }} 
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>
      <footer className="shrink-0 p-4 border-t border-white/5 bg-[#0f172a]/50 flex justify-center items-center px-10">
        <p className="text-slate-600 text-[8px] font-black uppercase tracking-widest">v2.50 • AES-256 ENCRYPTION ACTIVE</p>
      </footer>

      {/* Botó Flotant d'Agents Actius (Sempre Visible per Admins) */}
      {isAuthenticated && currentUser?.isAdmin && (
        <div className="fixed bottom-6 right-6 z-[2000] flex flex-col items-end gap-3 pointer-events-none">
          <AnimatePresence>
            {activeAgents.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 20 }}
                className="bg-[#0f172a]/95 backdrop-blur-xl border border-white/10 p-4 rounded-2xl shadow-2xl w-64 pointer-events-auto mb-2"
              >
                <div className="flex items-center justify-between mb-3 pb-2 border-b border-white/10">
                  <span className="text-[10px] font-black uppercase text-amber-500 tracking-widest">Agents en Actiu</span>
                  <span className="bg-emerald-500/20 text-emerald-500 text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">{activeAgents.length}</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {activeAgents.map(a => (
                    <div key={a.tip} className="flex items-center justify-between bg-white/5 p-2 rounded-lg border border-white/5">
                      <div>
                        <p className="text-[10px] font-black text-white truncate w-32 uppercase">{a.name}</p>
                        <AgentBadge tip={a.tip} className="scale-75 origin-left" />
                      </div>
                      <span className="text-[8px] font-mono text-slate-500">
                        {a.lastSeen.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setShowAdmin(!showAdmin)}
            className="pointer-events-auto group relative w-16 h-16 bg-amber-500 rounded-full flex items-center justify-center shadow-2xl shadow-amber-500/20 hover:scale-110 active:scale-95 transition-all"
          >
            <Users className="w-8 h-8 text-black" />
            <div className="absolute inset-0 rounded-full bg-amber-500/20 animate-ping" />
            {activeAgents.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-black w-7 h-7 rounded-full flex items-center justify-center border-4 border-[#0f172a]">
                {activeAgents.length}
              </span>
            )}
          </button>
        </div>
      )}

      {showLegalModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-500">
          <div className="bg-[#0b1624] border-2 border-slate-800 w-full max-w-2xl max-h-[90vh] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(79,70,229,0.2)] flex flex-col relative">
            
            {/* CAPÇALERA DE SEGURETAT */}
            <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-indigo-950/30">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
                   <ShieldCheck className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Avís Legal i Propietat Intel·lectual</h2>
                  <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">© @5085 - Atenea Hub System</p>
                </div>
              </div>
            </div>
            
            {/* CONTINGUT JURÍDIC CLAU */}
            <div className="p-10 overflow-y-auto custom-scrollbar space-y-10 text-slate-300">
              
              <section className="space-y-4">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                   <ShieldCheck className="w-4 h-4" /> 1. Criteris d'Ús Professional (Facilitadors Trànsit)
                </h3>
                <p className="text-[13px] leading-relaxed font-medium">
                   Aquesta aplicació ha estat dissenyada per a ús exclusiu de l'usuari autoritzat. Les narratives, càlculs i automatitzacions proporcionades són una **eina de suport** i no substitueixen la responsabilitat de l'agent instructor en la formalització del document oficial.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                   <Scale className="w-4 h-4" /> 2. Propietat Intel·lectual i © Copyright
                </h3>
                <p className="text-[13px] leading-relaxed font-medium">
                   L'arquitectura de programari, els algoritmes lògics i els motors de generació de continguts digitals **de totes les apps contingudes en aquest facilitador** són propietat intel·lectual protegida de **© @5085 - Atenea Hub System**. Queda prohibida la reproducció, explotació comercial o qualsevol forma d'enginyeria inversa sense autorització expressa.
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black text-red-500 uppercase tracking-[0.15em] flex items-center gap-3">
                   <AlertCircle className="w-4 h-4" /> 3. ADVERTÈNCIA PROTECCIÓ DE DADES (RGPD)
                </h3>
                <p className="text-[12px] font-black leading-relaxed bg-red-500/10 border-2 border-red-500/20 p-8 rounded-[2rem] text-red-100 uppercase tracking-tighter shadow-xl">
                   "PER SEGURETAT JURÍDICA I COMPLIMENT DEL RGPD, QUEDA TERMINANTMENT PROHIBIT INTRODUIR DADES DE CARÀCTER PERSONAL (NOMS, COGNOMS, DNI O CONTACTE) DINS DE L'APLICATIU. ELS CAMPS HAN DE SER OMPLERTS NOMÉS AMB DADES TÈCNIQUES I PROFESSIONALS."
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                   <Sparkles className="w-4 h-4" /> 4. Disclaimer de IA (Gemini 2.0)
                </h3>
                <p className="text-[13px] leading-relaxed bg-indigo-500/5 border border-indigo-500/10 p-5 rounded-2xl italic font-medium">
                   "L'usuari té l'obligació inexcusable de revisar tots els relats, càlculs i dades generades abans de la seva signatura oficial o tramesa. Els models de IA poden presentar errors puntuals basats en les dades d'entrada."
                </p>
              </section>

              <section className="space-y-4">
                <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
                   <KeyRound className="w-4 h-4" /> 5. Seguretat de Credencials
                </h3>
                <p className="text-[13px] leading-relaxed font-medium italic">
                   "L'usuari és el responsable exclusiu de protegir les seves claus d'accés i no facilitar-les a tercers. L'incompliment d'aquesta norma de seguretat pot comportar la revocació immediata de l'accés al sistema."
                </p>
              </section>

              <div className="pt-8 border-t border-slate-800 text-center">
                <p className="text-[11px] font-mono text-slate-600 uppercase tracking-[0.4em]">v3.47.8-SYSTEM-LOG-AUTH-OK</p>
              </div>
            </div>

            {/* FOOTER D'ACCEPTACIÓ */}
            <div className="p-8 bg-slate-950/50 border-t border-slate-800 flex justify-center">
              <button 
                onClick={() => {
                  localStorage.setItem('legal_accepted_v_global', 'true');
                  setShowLegalModal(false);
                }}
                className="w-full md:w-auto px-12 py-5 bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all border border-indigo-400/30 active:scale-95"
              >
                Accepto els termes i condicions de seguretat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminDashboard({ logs, costLogs, rankLogs, users, dictatLogs, appStatuses, onResetPin, onToggleStatus, onCreateUser, onUpdateName, onToggleAppStatus }: { logs: any[], costLogs: any[], rankLogs: any[], users: any[], dictatLogs: any[], appStatuses: Record<string, string>, onResetPin: (tip: string) => void, onToggleStatus: (tip: string, current: string) => void, onCreateUser: (tip: string, name: string) => void, onUpdateName: (tip: string, name: string) => void, onToggleAppStatus: (appId: string, current: string) => void }) {
  const [activeTab, setActiveTab] = useState<'activity' | 'users' | 'ranking' | 'costos' | 'dictat' | 'apps'>('activity');
  const [searchTerm, setSearchTerm] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingTip, setEditingTip] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [newTip, setNewTip] = useState('');
  const [newName, setNewName] = useState('');
  const filteredUsers = users.filter(u => u.tip.includes(searchTerm.toUpperCase()) || u.name.includes(searchTerm.toUpperCase()));

  const usageRanking = useMemo(() => {
    const counts: Record<string, { name: string, count: number, tip: string, totalCost: number, appCounts: Record<string, number> }> = {};
    
    // Combine logs that matter for ranking (costs and app opens)
    const combinedLogs = [...costLogs, ...rankLogs];
    
    combinedLogs.forEach(log => {
      if (!log.tip || log.isAdmin) return;
      if (!counts[log.tip]) {
        counts[log.tip] = { name: log.name, tip: log.tip, count: 0, totalCost: 0, appCounts: {} };
      }
      
      // We only count "Obertura App" towards the count to avoid double counting with Cost de servei
      if (log.action === 'Obertura App') {
        counts[log.tip].count++;
        const appName = log.app;
        if (appName) {
          counts[log.tip].appCounts[appName] = (counts[log.tip].appCounts[appName] || 0) + 1;
        }
      }
      
      if (log.cost) {
        counts[log.tip].totalCost += parseFloat(log.cost);
      }
    });
    return Object.values(counts).sort((a, b) => b.count - a.count);
  }, [costLogs, rankLogs]);

  const costsByYear = useMemo(() => {
    const years: Record<string, { total: number, count: number, months: Record<string, { total: number, agents: Record<string, { name: string, cost: number, count: number }> }> }> = {};

    costLogs.forEach(log => {
      if (!log.cost || !log.timestamp) return;
      const date = log.timestamp.toDate ? log.timestamp.toDate() : new Date(log.timestamp);
      const yearKey = date.getFullYear().toString();
      const monthKey = `${yearKey}-${String(date.getMonth() + 1).padStart(2, '0')}`;

      if (!years[yearKey]) years[yearKey] = { total: 0, count: 0, months: {} };
      if (!years[yearKey].months[monthKey]) years[yearKey].months[monthKey] = { total: 0, agents: {} };

      const costParsed = parseFloat(log.cost);
      years[yearKey].total += costParsed;
      years[yearKey].count++;
      years[yearKey].months[monthKey].total += costParsed;

      if (!years[yearKey].months[monthKey].agents[log.tip]) {
        years[yearKey].months[monthKey].agents[log.tip] = { name: log.name || log.tip, cost: 0, count: 0 };
      }
      years[yearKey].months[monthKey].agents[log.tip].cost += costParsed;
      years[yearKey].months[monthKey].agents[log.tip].count++;
    });

    return Object.keys(years).sort((a, b) => b.localeCompare(a)).map(yearKey => {
      const sortedMonths = Object.keys(years[yearKey].months).sort((a, b) => b.localeCompare(a)).map(monthKey => {
        const [y, m] = monthKey.split('-');
        const date = new Date(parseInt(y), parseInt(m) - 1, 1);
        return {
          key: monthKey,
          name: date.toLocaleDateString('ca-ES', { month: 'long', year: 'numeric' }).toUpperCase(),
          total: years[yearKey].months[monthKey].total,
          agents: Object.entries(years[yearKey].months[monthKey].agents)
            .map(([tip, data]) => ({ tip, ...data }))
            .sort((a, b) => b.cost - a.cost)
        };
      });

      return {
        year: yearKey,
        total: years[yearKey].total,
        count: years[yearKey].count,
        months: sortedMonths
      };
    });
  }, [costLogs]);

  const visibleActivityLogs = useMemo(() => {
    const groupedLogs: any[] = [];
    const openSessions = new Map<string, any>(); // tip -> current active app session

    // Filter out admin logs and sort chronologically to process sequences
    const sortedLogs = [...logs].filter(log => !log.isAdmin).sort((a, b) => {
      const da = a.timestamp?.toDate ? a.timestamp.toDate() : new Date(a.timestamp);
      const db = b.timestamp?.toDate ? b.timestamp.toDate() : new Date(b.timestamp);
      return da.getTime() - db.getTime();
    });

    sortedLogs.forEach(log => {
      const logDate = log.timestamp?.toDate ? log.timestamp.toDate() : new Date(log.timestamp);

      // Identify if this is an app-usage related action
      const appName = log.app || (log.action === 'Obertura App' ? log.app : null) || (log.action === 'DESCÀRREGA / ÈXIT' ? (log.app || 'App') : null) || (log.action === 'Cost de servei' ? log.app : null);

      if (appName) {
        let session = openSessions.get(log.tip);

        // Check if existing session for this agent is for the same app and recent (within 3 hours)
        if (session) {
          const sessionDate = session.timestamp?.toDate ? session.timestamp.toDate() : new Date(session.timestamp);
          if (session.app !== appName || (logDate.getTime() - sessionDate.getTime() > 3 * 60 * 60 * 1000)) {
            openSessions.delete(log.tip);
            session = null;
          }
        }

        if (!session) {
          // Create new grouped usage entry
          session = {
            ...log,
            app: appName,
            type: 'session',
            action: 'ÚS DE L\'APP',
            totalCost: 0,
            success: false,
            details: [],
            count: 0,
            children: []
          };
          groupedLogs.push(session);
          openSessions.set(log.tip, session);
        }

        // Update grouped session data
        session.count++;
        if (log.action === 'Cost de servei' && log.cost) {
          session.totalCost += parseFloat(log.cost);
        }
        if (log.action === 'DESCÀRREGA / ÈXIT') {
          session.success = true;
          const detail = log.filename || log.file || 'Informe Generat';
          if (!session.details.includes(detail)) {
            session.details.push(detail);
          }
        }
        if (log.action === 'Tornar a Pàgina Principal') {
          session.endTime = log.timestamp;
          openSessions.delete(log.tip);
        }
        session.children.push(log);
      } else {
        // Non-app action (Login, PIN reset, etc.)
        // Optional deduplication for very recent identical actions by same agent
        const lastLog = groupedLogs[groupedLogs.length - 1];
        const lastLogDate = lastLog?.timestamp?.toDate ? lastLog.timestamp.toDate() : (lastLog?.timestamp ? new Date(lastLog.timestamp) : null);
        const isDuplicate = lastLog && lastLog.type === 'item' && lastLog.tip === log.tip && lastLog.action === log.action &&
          (lastLogDate && (logDate.getTime() - lastLogDate.getTime() < 30000));

        if (!isDuplicate) {
          groupedLogs.push({ ...log, type: 'item' });
        }
      }
    });

    // Return in reverse order (most recent first)
    return groupedLogs.reverse();
  }, [logs]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-6 h-full">
      <div className="flex gap-4 p-2 bg-white/5 rounded-2xl border border-white/10 w-fit flex-wrap">
        <button onClick={() => setActiveTab('activity')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'activity' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}>Activitat Recent</button>
        <button onClick={() => setActiveTab('users')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'users' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}>Gestió Agents</button>
        <button onClick={() => setActiveTab('ranking')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'ranking' ? 'bg-amber-500 text-black' : 'text-slate-400 hover:text-white'}`}>Rànquing d'Ús</button>
        <button onClick={() => setActiveTab('costos')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'costos' ? 'bg-emerald-500 text-black' : 'text-slate-400 hover:text-white'}`}>Despesa Mensual</button>
        <button onClick={() => setActiveTab('dictat')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'dictat' ? 'bg-blue-500 text-white' : 'text-slate-400 hover:text-white'}`}>Informes Dictat</button>
        <button onClick={() => setActiveTab('apps')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'apps' ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}>Gestió Apps</button>
      </div>

      {activeTab === 'users' && isAdding && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-amber-500/10 border border-amber-500/20 rounded-3xl flex flex-wrap items-end gap-6 shadow-xl">
          <div className="flex-1 min-w-[200px]">
            <label className="block text-[8px] font-black uppercase text-amber-500 mb-2">Número TIP</label>
            <input type="text" placeholder="Ex: 1234" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:ring-1 focus:ring-amber-500" value={newTip} onChange={(e) => setNewTip(e.target.value)} />
          </div>
          <div className="flex-[2] min-w-[200px]">
            <label className="block text-[8px] font-black uppercase text-amber-500 mb-2">Nom de l'Agent</label>
            <input type="text" placeholder="Ex: JOAN PUIG" className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm text-white outline-none focus:ring-1 focus:ring-amber-500" value={newName} onChange={(e) => setNewName(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { onCreateUser(newTip, newName); setIsAdding(false); setNewTip(''); setNewName(''); }} className="bg-amber-500 text-black px-8 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-amber-400 transition-all active:scale-95">Donar d'Alta</button>
            <button onClick={() => setIsAdding(false)} className="bg-white/5 text-slate-400 px-6 py-3 rounded-xl text-[10px] font-black uppercase hover:bg-white/10 transition-all">Cancel·lar</button>
          </div>
        </motion.div>
      )}

      <div className="flex-1 bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col">
        <div className="p-6 border-b border-white/10 bg-black/20 flex justify-between items-center">
          <div className="flex items-center gap-3"><Activity className={`w-5 h-5 ${activeTab === 'costos' ? 'text-emerald-500' : activeTab === 'dictat' ? 'text-blue-500' : 'text-amber-500'}`} /><span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{activeTab === 'activity' ? 'Registre d\'Operacions' : activeTab === 'users' ? 'Base de dades d\'Agents' : activeTab === 'costos' ? 'Informe de Costos mensuals' : activeTab === 'dictat' ? 'Informes Eina Dictat' : 'Estadístic de Rànquing'}</span></div>
          <div className="flex items-center gap-4">
            {activeTab === 'users' && (
              <>
                <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-[9px] font-black uppercase hover:bg-emerald-500/20 transition-all active:scale-95">
                  <UserPlus className="w-4 h-4" /> Nou Agent
                </button>
                <input type="text" placeholder="Cercar agent..." className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs text-white outline-none focus:ring-1 focus:ring-amber-500 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === 'activity' ? (
            visibleActivityLogs.map((log, i) => (
              <div key={i} className={`flex justify-between p-4 bg-black/20 border rounded-2xl transition-all ${log.success ? 'border-emerald-500/30' : 'border-white/5'}`}>
                <div className="flex items-center gap-4">
                  <AgentBadge tip={log.tip} className="scale-125 mx-2" />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-[10px] font-black text-white uppercase">{log.name}</p>
                      {log.success && <span className="text-[8px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-black flex items-center gap-1 shadow-lg shadow-emerald-500/20"><Check className="w-2 h-2" /> ÈXIT / ACABAT</span>}
                    </div>
                    <p className="text-[8px] font-bold text-amber-500 uppercase mt-1">
                      {log.type === 'session' ? (
                        <span className="flex items-center gap-2">
                          <Activity className="w-3 h-3" /> ÚS DE: <span className="text-white bg-white/10 px-2 rounded">{log.app}</span> {log.count > 1 && `(x${log.count} ops)`}
                        </span>
                      ) : (
                        log.action
                      )}
                      {log.totalCost > 0 && <span className="ml-2 text-emerald-500 bg-emerald-500/10 px-2 rounded">[{log.totalCost.toFixed(4)} €]</span>}
                    </p>
                    {log.details && log.details.length > 0 && (
                      <p className="text-[7px] font-mono text-slate-400 mt-1 uppercase flex gap-2">
                        {log.details.map((d: any, idx: number) => <span key={idx} className="bg-black/40 px-1 border border-white/5 rounded">↳ {d}</span>)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-[9px] font-mono text-slate-500">{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : new Date(log.timestamp).toLocaleString()}</p>
                  {log.endTime && (
                    <p className="text-[7px] font-mono text-slate-600 mt-1 uppercase">Sessió Finalitzada</p>
                  )}
                </div>
              </div>
            ))
          ) : activeTab === 'costos' ? (
            <div className="space-y-8">
              {costsByYear.map((yearGroup) => (
                <div key={yearGroup.year} className="bg-black/30 border border-emerald-500/20 rounded-[2.5rem] p-8 space-y-6 shadow-2xl overflow-hidden">
                  <div className="flex flex-col md:flex-row md:justify-between md:items-end border-b border-white/10 pb-6 gap-4">
                     <div>
                       <h2 className="text-3xl font-black text-white">ANY GLOBAL {yearGroup.year}</h2>
                       <p className="text-[10px] font-bold text-slate-500 mt-1 uppercase tracking-widest">{yearGroup.count} moviments processats</p>
                     </div>
                     <div className="md:text-right bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-2xl">
                       <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500/80 mb-1">Despesa Acumulada Anual</p>
                       <p className="text-4xl font-black text-emerald-400 leading-none">{yearGroup.total.toFixed(6)} €</p>
                     </div>
                  </div>

                  <div className="space-y-6">
                    {yearGroup.months.map((month) => (
                      <div key={month.key} className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden p-6 space-y-4">
                        <div className="flex justify-between items-end border-b border-white/10 pb-4">
                          <h3 className="text-xl font-black text-amber-500">{month.name}</h3>
                          <div className="text-right">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Despesa Mensual</p>
                            <p className="text-2xl font-black text-emerald-500">{month.total.toFixed(6)} €</p>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {month.agents.map((agent) => (
                            <div key={agent.tip} className="bg-black/40 border border-white/5 rounded-2xl p-4 flex justify-between items-center group transition-all hover:bg-black/60">
                              <div>
                                <p className="text-[10px] font-black text-white uppercase truncate max-w-[120px]">{agent.name}</p>
                                <AgentBadge tip={agent.tip} />
                              </div>
                              <div className="text-right flex flex-col items-end">
                                <p className="text-sm font-black text-emerald-500 group-hover:text-emerald-400 transition-colors">{agent.cost.toFixed(6)} €</p>
                                <p className="text-[8px] font-bold text-slate-500">{agent.count} ops</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {costsByYear.length === 0 && <p className="text-center py-10 text-slate-500 text-[10px] uppercase font-black">No hi ha costos registrats per mostrar</p>}
            </div>
          ) : activeTab === 'ranking' ? (
            <div className="space-y-2">
              {usageRanking.map((rank, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center font-black text-[12px]">{i + 1}</div>
                    <div><p className="text-[10px] font-black text-white uppercase">{rank.name}</p><AgentBadge tip={rank.tip} /></div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-4 items-center">
                      <div className="flex flex-wrap gap-1.5 justify-end max-w-[200px] sm:max-w-md">
                        {Object.entries(rank.appCounts).map(([app, c]) => (
                          <span key={app} className="text-[7px] bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-400 font-bold uppercase whitespace-nowrap">
                            {app}: <span className="text-amber-500">{c}</span>
                          </span>
                        ))}
                      </div>
                      <div className="text-right min-w-[60px]">
                        <span className="text-xl font-black text-amber-500 leading-none block">{rank.count}</span>
                        <span className="text-[7px] font-black uppercase text-slate-500">TOTAL OPS</span>
                      </div>
                    </div>
                    {rank.totalCost > 0 && (
                      <span className="text-[10px] font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">{rank.totalCost.toFixed(3)} €</span>
                    )}
                  </div>
                </div>
              ))}
              {usageRanking.length === 0 && <p className="text-center py-10 text-slate-500 text-[10px] uppercase font-black">No hi ha prou dades per generar el rànquing</p>}
            </div>
          ) : activeTab === 'dictat' ? (
            <div className="space-y-4">
              {dictatLogs.map((log) => (
                <div key={log.id} className="p-5 bg-black/20 border border-white/5 rounded-2xl flex flex-col gap-4">
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-3">
                      <AgentBadge tip={log.agentTip || '???'} />
                      <span className="text-[16px] font-black text-amber-500">{log.nat || 'SENSE NAT'}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-black tracking-widest ${log.mode === 'TECNIC' ? 'bg-purple-500 text-white' : log.mode === 'SIMPLE' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>{log.mode}</span>
                    </div>
                    <span className="text-[10px] text-slate-500 font-mono font-black">{log.timestamp ? new Date(log.timestamp).toLocaleString() : 'Sense data'}</span>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="bg-white/5 border border-white/5 p-5 rounded-2xl flex flex-col h-full">
                      <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black mb-3">Relat Capturat de l'Agent</p>
                      <p className="text-sm text-slate-300 font-medium whitespace-pre-wrap leading-relaxed flex-1">{log.input}</p>
                    </div>
                    <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-2xl flex flex-col h-full">
                      <p className="text-[10px] text-blue-400 uppercase tracking-widest font-black mb-3">Informe Generat</p>
                      <p className="text-sm text-blue-100 font-medium whitespace-pre-wrap leading-relaxed flex-1">{log.report}</p>
                    </div>
                  </div>
                </div>
              ))}
              {dictatLogs.length === 0 && <p className="text-center py-10 text-slate-500 text-[10px] uppercase font-black">No hi ha informes recents</p>}
            </div>
          ) : activeTab === 'apps' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {APP_LINKS.map((app) => {
                const status = appStatuses[app.id] || app.status;
                const Icon = app.icon;
                return (
                  <div key={app.id} className={`p-6 bg-black/20 border rounded-[2rem] flex flex-col gap-4 transition-all ${status === 'maintenance' ? 'border-amber-500/30' : 'border-white/5'}`}>
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 ${status === 'maintenance' ? 'text-amber-500' : 'text-blue-400'}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="text-[12px] font-black text-white uppercase leading-tight">{app.title}</h4>
                          <span className="text-[8px] font-mono text-slate-500">{app.code}</span>
                        </div>
                      </div>
                      <span className={`text-[8px] px-2 py-0.5 rounded font-black uppercase ${status === 'online' ? 'bg-emerald-500 text-black' : 'bg-amber-500 text-black'}`}>
                        {status === 'online' ? 'ACTIVA' : 'OFFLINE'}
                      </span>
                    </div>
                    <button
                      onClick={() => onToggleAppStatus(app.id, status)}
                      className={`w-full py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all active:scale-95 ${status === 'online' ? 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'}`}
                    >
                      {status === 'online' ? 'TURNOFF / MANTENIMENT' : 'ACTIVA L\'APP'}
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredUsers.map((user) => (
                <div key={user.tip} className={`p-5 bg-black/20 border rounded-2xl flex flex-col gap-4 transition-all ${user.status === 'off' ? 'border-red-500/30' : 'border-white/5'}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {editingTip === user.tip ? (
                        <div className="flex items-center gap-2 mb-1">
                          <input
                            type="text"
                            title="Editar nom de l'agent"
                            placeholder="Nom de l'agent"
                            className="bg-black/40 border border-amber-500/50 rounded px-2 py-1 text-xs text-white uppercase outline-none w-full"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            autoFocus
                          />
                          <button title="Guardar nom" onClick={() => { onUpdateName(user.tip, editingName); setEditingTip(null); }} className="p-1 bg-emerald-500 text-black rounded hover:bg-emerald-400"><Check className="w-3 h-3" /></button>
                          <button title="Cancel·lar edició" onClick={() => setEditingTip(null)} className="p-1 bg-white/10 text-slate-400 rounded hover:bg-white/20"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/name">
                          <h4 className={`text-sm font-black ${user.status === 'off' ? 'text-slate-500 line-through' : 'text-white'}`}>{user.name}</h4>
                          <button title="Editar nom" onClick={() => { setEditingTip(user.tip); setEditingName(user.name); }} className="opacity-0 group-hover/name:opacity-100 p-1 text-slate-500 hover:text-amber-500 transition-all"><Edit2 className="w-3 h-3" /></button>
                        </div>
                      )}
                      <AgentBadge tip={user.tip} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[7px] px-1.5 py-0.5 rounded font-black uppercase ${user.isAdmin ? 'bg-red-500' : user.status === 'off' ? 'bg-red-900 text-red-100' : user.firstLogin ? 'bg-amber-500 text-black' : 'bg-emerald-500'}`}>{user.isAdmin ? 'ADMIN' : user.status === 'off' ? 'BAIXA' : user.firstLogin ? 'Pendent' : 'Actiu'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!user.isAdmin && (
                      <>
                        <button onClick={() => onResetPin(user.tip)} className="flex-1 bg-white/5 border border-white/10 py-2 rounded-xl text-[8px] font-black uppercase flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all"><RefreshCw className="w-3 h-3" /> Reset</button>
                        <button
                          onClick={() => onToggleStatus(user.tip, user.status || 'on')}
                          className={`flex-1 border py-2 rounded-xl text-[8px] font-black uppercase flex items-center justify-center gap-2 active:scale-95 transition-all ${user.status === 'off' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20' : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'}`}
                        >
                          {user.status === 'off' ? 'DONAR D\'ALTA' : 'DONAR DE BAIXA'}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function AppCard({ link, index, onClick }: { link: AppLink, index: number, onClick: () => void, key?: string | number }) {
  const Icon = link.icon;
  const isMobileOperative = link.id === 'dictat-accidents' || link.id === 'gestor-casos' || link.id === 'minutes';

  return (
    <motion.button
      onClick={() => link.status !== 'maintenance' && onClick()}
      disabled={link.status === 'maintenance'}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className={`group relative bg-mossos-blue/60 backdrop-blur-sm rounded-3xl p-6 lg:p-8 border border-white/10 ${isMobileOperative ? 'flex' : 'hidden md:flex'} flex-col justify-between text-left overflow-hidden min-h-[180px] lg:min-h-[280px] ${link.status === 'maintenance' ? 'opacity-60 grayscale cursor-not-allowed' : 'hover:border-mossos-blue hover:bg-mossos-blue/80 transition-all duration-500 shadow-xl'}`}
    >
      {link.status === 'maintenance' && (
        <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-amber-500 text-black px-8 py-2 -rotate-12 font-black text-xl tracking-widest uppercase shadow-2xl border-y-2 border-dashed border-black/50 overflow-hidden w-[120%] text-center">
            {link.maintenanceMsg || 'En Construcció'}
          </div>
        </div>
      )}
      <div className={`flex justify-between items-start z-10 ${link.status === 'maintenance' ? 'opacity-50' : ''}`}>
        <div className={`w-14 h-14 lg:w-18 lg:h-18 rounded-2xl flex items-center justify-center shadow-2xl border border-white/10 ${link.category === 'dictat' ? 'bg-blue-600/20 text-blue-400' : link.category === 'imatges' ? 'bg-emerald-600/20 text-emerald-400' : 'bg-purple-600/20 text-purple-400'} group-hover:bg-mossos-blue group-hover:text-white transition-all`}><Icon className="w-7 h-7 lg:w-9 lg:h-9" /></div>
        <span className="text-[8px] lg:text-xs font-mono text-slate-600">{link.code}</span>
      </div>
      <div className={`mt-6 z-10 ${link.status === 'maintenance' ? 'opacity-50' : ''}`}><h3 className="text-xl lg:text-2xl font-black text-white group-hover:text-amber-500 transition-colors uppercase leading-tight mb-2 lg:mb-3 whitespace-pre-line">{link.title}</h3><p className="text-slate-400 text-xs lg:text-sm font-medium lg:leading-relaxed line-clamp-3">{link.description}</p></div>
      <div className={`flex items-center justify-between pt-6 border-t border-white/5 mt-6 relative z-10 ${link.status === 'maintenance' ? 'opacity-50' : ''}`}>
        <div className="flex items-center gap-2">
          <div className={`w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full ${link.category === 'dictat' ? 'bg-blue-500' : link.category === 'imatges' ? 'bg-emerald-500' : 'bg-purple-500'}`} />
          <span className="text-[10px] lg:text-xs font-black uppercase text-slate-500">{link.category}</span>
        </div>
        <div className="flex items-center gap-3">
          {link.category === 'imatges' && (
            <div className="flex items-center gap-1.5 bg-emerald-500/15 border border-emerald-500/30 px-3 py-1 rounded-full">
              <Monitor className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">Versió Escriptori</span>
            </div>
          )}
          {link.status !== 'maintenance' && (
            <ExternalLink className="w-5 h-5 text-mossos-blue translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
          )}
        </div>
      </div>
    </motion.button>
  );
}

function ContactButton() {
  const [shown, setShown] = useState(false);
  return (
    <div className="mt-8 text-center">
      <button
        type="button"
        onClick={() => setShown(s => !s)}
        className="text-slate-500 hover:text-white text-[11px] font-black uppercase tracking-[0.15em] transition-all flex items-center gap-3 mx-auto active:scale-95"
      >
        <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center border border-white/10 group-hover:border-white/20">
          <Mail className="w-4 h-4" />
        </div>
        Contacte amb Administrador
      </button>
      <AnimatePresence>
        {shown && (
          <motion.a
            href="mailto:aadsuarg@gmail.com"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="inline-block mt-4 px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[10px] font-mono text-slate-400 hover:text-white hover:border-white/20 transition-all"
          >
            aadsuarg@gmail.com
          </motion.a>
        )}
      </AnimatePresence>
    </div>
  );
}
function AgentBadge({ tip, className = "" }: { tip: string, className?: string }) {
  const displayTip = tip.startsWith('PG') ? tip.slice(2).replace(/^0+/, '') : tip;
  const hasTextSize = className.includes('text-');
  const baseClasses = hasTextSize ? '' : 'text-[10px] px-2 py-0.5';
  
  return (
    <span className={`inline-flex items-center justify-center bg-black border border-amber-500 text-amber-500 font-black rounded-md leading-none shadow-sm ${baseClasses} ${className}`} style={{ minWidth: '3.5rem' }}>
      {displayTip}
    </span>
  );
}
