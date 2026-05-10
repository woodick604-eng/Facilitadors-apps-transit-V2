// Copyright (c) 2026 @5085. Tots els drets reservats.
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

// ═══════════════════════════════════════════════════════════════════════════
// LEGAL MODAL — Avís Legal, RGPD, IA i Responsabilitat
// Definit com a component independent per reutilitzar-lo als 3 estats de l'app
// ═══════════════════════════════════════════════════════════════════════════
function LegalModalContent({ onClose }: { onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-12 bg-black/85 backdrop-blur-md animate-in fade-in duration-500">
      <div className="bg-[#0b1624] border-2 border-slate-800 w-full max-w-5xl max-h-[95vh] rounded-[2.5rem] overflow-hidden shadow-[0_0_80px_rgba(79,70,229,0.3)] flex flex-col relative">

        {/* CAPÇALERA */}
        <div className="p-8 border-b border-slate-800 flex justify-between items-center bg-indigo-950/30">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-indigo-600 rounded-2xl shadow-lg shadow-indigo-500/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">Avís Legal, Protecció de Dades i Responsabilitat</h2>
              <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest mt-1">© @5085 — Inscrita al Registre PI Catalunya · Exp. 00765-03123076 · Asiento REGAGE26e00041580644 (29/04/2026)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-700 transition-all" title="Tancar avís legal">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* CONTINGUT JURÍDIC */}
        <div className="p-8 md:p-10 overflow-y-auto custom-scrollbar space-y-8 text-slate-300">

          {/* 0. NATURALESA I ESTAT DE L'EINA */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-amber-400 uppercase tracking-widest flex items-center gap-3">
              <Info className="w-4 h-4" /> 0. Naturalesa i Estat de l'Eina
            </h3>
            <div className="text-[12px] font-semibold text-amber-300 space-y-2 bg-amber-500/5 p-5 rounded-xl border border-amber-500/20">
              <p>• <strong>Eina no oficial i no normalitzada.</strong> No ha estat aprovada, homologada ni avalada per cap organisme públic ni per la Direcció General de la Policia de la Generalitat.</p>
              <p>• <strong>Prototype en proves.</strong> Pot ser modificada, interrompuda o retirada en qualsevol moment sense preavís.</p>
              <p>• <strong>Les sortides de l'eina (narratives, càlculs, actes, informes) no tenen valor legal per si mateixes.</strong> Cap document generat per aquesta aplicació pot ser presentat com a document oficial sense la prèvia revisió, correcció i signatura manual per part de l'agent responsable.</p>
              <p className="text-indigo-200/80 italic font-medium">• L'objectiu és reduir la càrrega administrativa repetitiva. Aporta coneixement de la seva base de dades, que <u>sempre ha de ser validat per un professional humà</u>. No la deixis treballar sola: la responsabilitat final és de l'agent signant.</p>
            </div>
          </section>

          {/* 1. RESPONSABILITAT PROFESSIONAL */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
              <ShieldCheck className="w-4 h-4" /> 1. Responsabilitat Professional Individual de l'Agent
            </h3>
            <div className="text-[13px] leading-relaxed space-y-2">
              <p>Aquesta aplicació ha estat dissenyada per a ús exclusiu de personal de les Forces i Cossos de Seguretat degudament autoritzat. L'ús implica l'acceptació de les condicions següents:</p>
              <ul className="list-none space-y-1 pl-3 text-[12px]">
                <li>→ <strong>Cada agent és individualment responsable</strong> de tots els documents que signi, independentment que el contingut hagi estat generat total o parcialment per aquesta eina.</li>
                <li>→ <strong>Cap agent pot transferir la seva responsabilitat professional a aquesta aplicació.</strong> La IA és un ajudant, no un agent signant.</li>
                <li>→ <strong>L'ús per part de companys (companies) és responsabilitat exclusiva de cada usuari.</strong> L'autor de l'eina no assumeix cap responsabilitat per l'ús que en facin tercers.</li>
                <li>→ L'eina és de suport a la instrucció d'atestats i redacció d'actes. No substitueix el criteri professional ni la formació de l'agent.</li>
              </ul>
            </div>
          </section>

          {/* 2. PROPIETAT INTEL·LECTUAL */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
              <Scale className="w-4 h-4" /> 2. Propietat Intel·lectual i © Copyright
            </h3>
            <p className="text-[13px] leading-relaxed">
              L'arquitectura, algorismes, motors de generació i interfícies de totes les aplicacions d'aquest facilitador <strong>són propietat intel·lectual d'@5085</strong>, protegides pel Text Refós de la LPI (RDL 1/1996). Registre de la Propietat Intel·lectual de Catalunya (expedient 00765-03123076, asiento registral REGAGE26e00041580644, data 29/04/2026). Queden terminantment prohibits: la reproducció, distribució, comunicació pública, transformació, explotació comercial i l'enginyeria inversa, sense autorització expressa i per escrit de l'autor.
            </p>
          </section>

          {/* 3. ADVERTÈNCIA RGPD — LA MÉS IMPORTANT */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-red-400 uppercase tracking-[0.15em] flex items-center gap-3">
              <AlertCircle className="w-4 h-4" /> 3. ADVERTÈNCIA CRÍTICA — PROTECCIÓ DE DADES (RGPD / LOPDGDD)
            </h3>
            <div className="bg-red-500/10 border-2 border-red-500/30 p-6 rounded-2xl space-y-4 shadow-xl">
              <p className="text-[12px] font-black text-red-100 uppercase tracking-tight">
                QUEDA TERMINANTMENT PROHIBIT INTRODUIR DADES DE CARÀCTER PERSONAL EN AQUESTA APLICACIÓ.
              </p>
              <div className="text-[12px] text-red-200/90 space-y-2">
                <p><strong>Constitueixen dades personals, entre d'altres:</strong> noms i cognoms, DNI / NIF / NIE / passaport, adreces postals, números de telèfon, correus electrònics, <strong>matrícules de vehicles</strong> (dada personal per STJUE C-582/14 i C-439/19), adreces IP, coordenades de geolocalització, dades biom&#232;triques (categoria especial — Art. 9 RGPD), dades de salut o estat psicofísic, dades relatives a condemnances penals o infraccions (Art. 10 RGPD), o qualsevol combinació de dades que permeti la identificació directa o indirecta d'una persona física.</p>
                <p className="font-bold">Els camps han de ser omplerts exclusivament amb dades tècniques, codis interns de cas, referències numèriques o identificadors anonimitzats.</p>
              </div>
              <div className="border-t border-red-500/20 pt-3 text-[11px] text-red-300/80 space-y-1">
                <p>⚖️ <strong>L'agent que introdueixi dades personals assumeix la condició de <em>responsable del tractament</em> (Art. 4.7 RGPD)</strong> i és personalment responsable davant l'Agència Espanyola de Protecció de Dades (AEPD) i, si s'escau, l'Autoritat Catalana de Protecció de Dades (APDCAT).</p>
                <p>⚖️ L'autor d'aquesta eina (l'identificat a la secció 2) <strong>no és responsable del tractament de dades que l'usuari pugui introduir</strong>.</p>
                <p>⚖️ Marc legal aplicable: Regl. (UE) 2016/679 (RGPD) · LO 3/2018 (LOPDGDD) · Directiva (UE) 2016/680 (tractament per forces de l'ordre).</p>
              </div>
            </div>
          </section>

          {/* 4. IA + EU AI ACT */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
              <Sparkles className="w-4 h-4" /> 4. Intel·ligència Artificial — Supervisió Humana Obligatòria
            </h3>
            <div className="text-[13px] leading-relaxed bg-indigo-500/5 border border-indigo-500/15 p-5 rounded-2xl space-y-2">
              <p>Aquesta eina fa ús de models d'intel·ligència artificial generativa (Google Gemini). <strong>L'usuari té l'obligació inexcusable de revisar, verificar i validar totes les narratives, càlculs, classificacions i dades generades</strong> abans de qualsevol signatura oficial o tramesa administrativa.</p>
              <p className="text-[12px] text-indigo-300/80">Reglament (UE) 2024/1689 (Llei d'IA de la UE — EU AI Act): els sistemes d'IA que presten suport a decisions en l'àmbit de les forces de l'ordre es classifiquen com a <strong>sistemes d'alt risc</strong> (Annex III). L'ús d'aquests sistemes requereix <strong>supervisió humana efectiva obligatòria</strong> (Art. 14 EU AI Act). Cap decisió o acte oficial pot fonamentar-se exclusivament en la sortida d'un sistema d'IA sense revisió humana.</p>
              <p className="text-[12px] text-slate-400 italic">Els models de IA poden generar errors, al·lucinacions o imprecisions. La qualitat de la sortida depèn directament de les dades d'entrada proporcionades per l'usuari.</p>
            </div>
          </section>

          {/* 5. LIMITACIÓ RESPONSABILITAT AUTOR */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
              <Scale className="w-4 h-4" /> 5. Limitació de Responsabilitat de l'Autor
            </h3>
            <div className="text-[12px] leading-relaxed text-slate-400 space-y-2 bg-slate-800/30 p-5 rounded-xl border border-slate-700/30">
              <p>Aquesta aplicació es proporciona <em>"tal com és"</em> (as-is), sense cap garantia expressa ni implícita de precisió, idoneïtat per a cap finalitat específica ni continuïtat del servei.</p>
              <p><strong>L'autor (@5085) declina expressament tota responsabilitat</strong> per: (a) decisions professionals adoptades sobre la base dels resultats d'aquesta eina; (b) errors, omissions o imprecisions en les sortides generades per la IA; (c) dades de caràcter personal que l'usuari pugui introduir incomplint la prohibició establerta a la secció 3; (d) interrupcions del servei per causes de manteniment, actualitzacions o forces majors; (e) qualsevol dany directe, indirecte, especial o conseqüent derivat de l'ús o la impossibilitat d'ús d'aquesta eina.</p>
              <p>L'autor no és part de cap relació laboral, jeràrquica ni de responsabilitat amb els agents que l'utilitzen. L'ús d'aquesta eina és voluntari i professional.</p>
            </div>
          </section>

          {/* 6. TRACTAMENT DE DADES / SUBPROCESSADORS */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
              <KeyRound className="w-4 h-4" /> 6. Tractament de Dades Tècniques i Subprocessadors
            </h3>
            <div className="text-[12px] leading-relaxed space-y-2">
              <p><strong>Política de retenció zero:</strong> aquesta eina no emmagatzema dades d'usuari al servidor de l'autor. L'arquitectura segueix els principis de <em>Privacitat per Disseny i per Defecte</em> (Art. 25 RGPD).</p>
              <p><strong>Subprocessadors de tercers (UE/GDPR):</strong></p>
              <ul className="list-none pl-3 space-y-1 text-slate-400">
                <li>→ <strong>Google Firebase / Firestore</strong> (infraestructura UE — europe-west1): emmagatzema exclusivament configuració tècnica i dades de sessió anonimitzades. Cobert pel Google Cloud DPA (GDPR mode).</li>
                <li>→ <strong>Google Gemini API</strong>: processa les consultes en trànsit. Per contracte, Google no utilitza les dades enviades a l'API per entrenar models. No es registren peticions (logging desactivat).</li>
              </ul>
              <p className="text-slate-500 text-[11px]">Per a consultes sobre protecció de dades: <span className="text-indigo-400">aadsuarg@gmail.com</span>. AEPD: www.aepd.es · APDCAT: apdcat.cat</p>
            </div>
          </section>

          {/* 7. SEGURETAT DE CREDENCIALS */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
              <KeyRound className="w-4 h-4" /> 7. Seguretat de Credencials i Accés
            </h3>
            <p className="text-[13px] leading-relaxed italic text-slate-400">
              L'usuari és el responsable exclusiu de protegir les seves claus d'accés, PIN i credencials. Queda expressament prohibit compartir-les amb tercers. L'incompliment pot comportar la revocació immediata de l'accés i, si hi ha accés no autoritzat a dades, l'aplicació de les responsabilitats establertes al RGPD i a la LOPDGDD.
            </p>
          </section>

          {/* 8. ACCEPTACIÓ I REGISTRE */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
              <Check className="w-4 h-4" /> 8. Acceptació i Registre
            </h3>
            <div className="text-[12px] leading-relaxed text-slate-400 space-y-2 bg-slate-800/30 p-5 rounded-xl border border-slate-700/30">
              <p>L'ús continuat d'aquesta eina <strong>implica l'acceptació íntegra i sense reserves</strong> de totes les clàusules contingudes en aquest avís legal.</p>
              <p>En clicar el botó <em>"He llegit l'avís legal — Tancar"</em>, l'usuari manifesta haver llegit, comprès i acceptat aquests termes. L'autor podrà <strong>registrar de manera traçable</strong> aquesta acceptació (TIP de l'agent, marca temporal i versió del document) com a prova davant qualsevol controvèrsia futura.</p>
              <p>L'autor pot publicar versions noves d'aquest avís legal en qualsevol moment. Els canvis substancials requeriran una nova acceptació explícita per part de l'usuari abans de continuar utilitzant l'eina.</p>
            </div>
          </section>

          {/* 9. REVOCACIÓ I DIVISIBILITAT */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
              <ShieldCheck className="w-4 h-4" /> 9. Revocació i Divisibilitat
            </h3>
            <div className="text-[12px] leading-relaxed text-slate-400 space-y-2">
              <p><strong>Revocació d'accés:</strong> l'autor es reserva el dret de revocar, suspendre o restringir l'accés de qualsevol usuari a aquesta eina, en qualsevol moment, sense necessitat de preavís ni de motivació, especialment davant qualsevol indici d'incompliment d'aquest avís legal.</p>
              <p><strong>Divisibilitat (severability):</strong> si qualsevol clàusula d'aquest avís fos declarada nul·la, contrària a dret o no executable per qualsevol autoritat competent, la resta de clàusules <strong>conservaran la seva validesa i eficàcia íntegres</strong>. Les parts s'esforçaran a substituir la clàusula afectada per una altra que mantingui, en la mesura legalment possible, la mateixa finalitat econòmica i jurídica.</p>
              <p><strong>Renúncia:</strong> el fet que l'autor no exerceixi en un moment determinat algun dels drets que li reconeix aquest avís no podrà interpretar-se en cap cas com a renúncia a aquest dret en el futur.</p>
            </div>
          </section>

          {/* 10. LLEI APLICABLE I JURISDICCIÓ */}
          <section className="space-y-3">
            <h3 className="text-xs font-black text-indigo-400 uppercase tracking-widest flex items-center gap-3">
              <Scale className="w-4 h-4" /> 10. Llei Aplicable i Jurisdicció
            </h3>
            <div className="text-[12px] leading-relaxed text-slate-400 space-y-2">
              <p>Aquest avís legal i la relació entre l'autor i l'usuari es regiran per la <strong>llei espanyola</strong>, complementada per la normativa europea aplicable (Reglament General de Protecció de Dades, EU AI Act).</p>
              <p>Per a la resolució de qualsevol controvèrsia derivada de l'ús d'aquesta eina, les parts se sotmeten expressament a la <strong>jurisdicció dels Jutjats i Tribunals de Catalunya</strong> (preferentment, partits judicials de Barcelona o Granollers segons correspongui), amb renúncia a qualsevol altre fur que els pogués correspondre.</p>
            </div>
          </section>

          <div className="pt-6 border-t border-slate-800 flex items-center justify-between">
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">RGPD · LOPDGDD · EU AI Act (UE) 2024/1689 · LPI RDL 1/1996</p>
            <p className="text-[10px] font-mono text-slate-600 uppercase tracking-[0.3em]">v4.0.0</p>
          </div>
        </div>

        {/* FOOTER */}
        <div className="p-6 bg-slate-950/50 border-t border-slate-800 flex justify-center">
          <button
            onClick={onClose}
            className="w-full md:w-auto px-12 py-4 bg-gradient-to-r from-indigo-700 to-indigo-600 hover:from-indigo-600 hover:to-indigo-500 text-white rounded-2xl font-black text-[11px] uppercase tracking-[0.2em] shadow-[0_10px_30px_rgba(79,70,229,0.3)] transition-all border border-indigo-400/30 active:scale-95"
          >
            He llegit l'avís legal — Tancar
          </button>
        </div>
      </div>
    </div>
  );
}

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
    // El disclaimer no ha de aparèixer automàticament al començar
    const hasAccepted = localStorage.getItem('legal_accepted_v_global');
    if (!hasAccepted) {
      setShowLegalModal(true);
    }
  }, []);

  // Registra de manera traçable l'acceptació de l'avís legal (per a defensa jurídica futura).
  // Es desa a localStorage sempre, i si l'usuari està autenticat es logueja també a Firestore.
  const acceptLegal = () => {
    const LEGAL_VERSION = 'v4.0.0';
    localStorage.setItem('legal_accepted_v_global', 'true');
    localStorage.setItem('legal_accepted_version', LEGAL_VERSION);
    localStorage.setItem('legal_accepted_at', new Date().toISOString());
    setShowLegalModal(false);
    // Best-effort: si tenim TIP autenticat, escrivim un registre traçable a Firestore.
    if (currentUser?.tip) {
      try {
        addDoc(collection(db, 'legal_acceptances'), {
          tip: currentUser.tip,
          name: currentUser.name || null,
          version: LEGAL_VERSION,
          timestamp: serverTimestamp(),
          userAgent: (navigator.userAgent || '').substring(0, 200),
        }).catch(() => { /* sense bloquejar UX */ });
      } catch (_) { /* idem */ }
    }
  };

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

  // Auto-submit del PIN: quan l'usuari teclegeja el 4t dígit i NO és el primer
  // login (creació de PIN), validem automàticament sense haver de pulsar el botó.
  useEffect(() => {
    if (!isTipValidated || !tempUserData) return;
    if (tempUserData.firstLogin) return;
    if (pin.length === 4 && !error) {
      const t = setTimeout(() => { doAuth(); }, 80);
      return () => clearTimeout(t);
    }
  }, [pin, isTipValidated, tempUserData, error]);

  // Scroll al camp PIN quan el TIP es valida (util al mobil)
  /* Comentat per petició de l'usuari per mantenir el scroll a dalt
  useEffect(() => {
    if (isTipValidated) {
      const t = setTimeout(() => {
        const pinInput = document.querySelector<HTMLElement>('input[type="password"]');
        if (pinInput) pinInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 450);
      return () => clearTimeout(t);
    }
  }, [isTipValidated]);
  */

  // Forçar scroll a dalt quan es tanca una app o s'entra al sistema
  useEffect(() => {
    if (!activeApp && isAuthenticated) {
      window.scrollTo(0, 0);
      const main = document.querySelector('main');
      if (main) main.scrollTo(0, 0);
    }
  }, [activeApp, isAuthenticated]);

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

  // Escoltador d'estat de les apps (Global per a tots els usuaris)
  useEffect(() => {
    const q = collection(db, 'app_status');
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const statuses: Record<string, string> = {};
      snapshot.docs.forEach(doc => {
        statuses[doc.id] = doc.data().status;
      });
      setAppStatuses(statuses);
    });
    return () => unsubscribe();
  }, []);

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

      return () => {
        unsubscribe1();
        unsubscribe2();
        unsubscribe3();
        unsubscribe4();
        unsubscribe5();
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
    return doAuth();
  };

  const doAuth = async () => {
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
          <LegalModalContent onClose={acceptLegal} />
        )}
      </div>
    );
  }


  if (!isAuthenticated) {
    return (
      <div className="min-h-[100dvh] bg-[#0f172a] flex items-center justify-center p-4 font-sans text-white">
        <div className="w-full max-w-2xl bg-white/5 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-6 lg:p-10 shadow-2xl relative overflow-hidden">
          {isTipValidated && (
            <div className="absolute top-0 right-0 p-4">
              <div className="bg-emerald-500/10 text-emerald-500 px-3 py-1 rounded-full text-[11px] lg:text-[14px] font-black uppercase tracking-widest border border-emerald-500/20 animate-pulse">Agent Validat</div>
            </div>
          )}

          <div className="text-center mb-6 lg:mb-8">
            <div className="flex items-center justify-center w-[260px] h-[350px] lg:w-[420px] lg:h-[560px] mb-6 lg:mb-8 transition-all duration-500 rounded-[3.5rem] md:rounded-[4rem] overflow-hidden shadow-2xl mx-auto border-4 border-white/5 relative pointer-events-none select-none">
              <img src="/escud-transit-v2.png" className="w-full h-full object-cover" alt="Escut Trànsit" draggable={false} />
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
              <span className="text-slate-400 text-[8px] tracking-widest font-black uppercase">• Versió 2.60</span>
            </div>
          </div>

          <form onSubmit={handleAuth} className="space-y-3">
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
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-3 overflow-hidden">
                  {tempUserData?.firstLogin && (
                    <p className="text-[10px] text-slate-400 uppercase tracking-widest text-center">Crea el teu PIN personal de 4 xifres</p>
                  )}

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
          <LegalModalContent onClose={acceptLegal} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen lg:h-screen bg-[#0a0f1a] text-slate-200 font-sans flex flex-col overflow-hidden relative">
      {/* Escut gegant de fons amb difuminació/opacitat del 24% - NOMÉS EN EL HUB D'APPS I FIXE */}
      {isAuthenticated && !showAdmin && !activeApp && (
        <>
          <div className="fixed inset-0 flex items-center justify-center pointer-events-none overflow-hidden z-0">
            <img 
              src="/escud-transit-v2.png" 
              className="w-[110%] md:w-[95%] h-auto max-w-none opacity-[0.24] blur-[10px] saturate-[1.2] brightness-125" 
              alt="Escut Background" 
            />
          </div>
          <div className="fixed inset-0 opacity-[0.05] pointer-events-none z-0" style={{ backgroundImage: 'radial-gradient(#3b82f6 1px, transparent 1px)', backgroundSize: '30px 30px' }} />
        </>
      )}

      <header className="bg-[#0f172a]/80 backdrop-blur-xl border-b border-white/10 px-8 py-6 lg:py-3 flex justify-between items-center shadow-2xl shrink-0">
        <div className="flex items-center gap-6 lg:gap-4">
          <div className="w-[100px] h-[100px] lg:w-[60px] lg:h-[60px] flex items-center justify-center rounded-2xl overflow-hidden shadow-lg border border-white/10 animate-pulse-fast">
            <img src="/escud-transit-v2.png" className="w-full h-full object-cover" alt="Escut Trànsit" />
          </div>
          <div>

            <div className="flex items-center gap-3">
              <span className="text-blue-400 text-sm font-black uppercase tracking-widest">Unitat de Trànsit</span>
              <span className="text-slate-600 text-[11px] lg:text-[14px] font-black uppercase tracking-widest flex items-center gap-3"><AgentBadge tip="@5085" className="text-[12px] px-2 py-1" /> • VERSIÓ 2.70</span>
              {currentUser?.isAdmin && <span className="text-[8px] bg-amber-500 text-black px-1.5 py-0.5 rounded font-black">ADMIN</span>}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-right flex items-center gap-6">
            {currentUser?.isAdmin && (
              <div className="flex items-center gap-2">
                {/* 
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
                */}
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
              <span className="block text-2xl xl:text-3xl font-mono font-black text-white tracking-tighter tabular-nums leading-none">
                {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </span>
              <span className="block text-[11px] xl:text-[12px] font-black text-slate-400 uppercase tracking-widest mt-1 mb-1">
                {currentTime.toLocaleDateString('ca-ES', { weekday: 'long', day: '2-digit', month: '2-digit', year: 'numeric' })}
              </span>
              <span className="text-[11px] xl:text-[12px] font-black text-emerald-500 uppercase tracking-widest flex items-center justify-end gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <AgentBadge tip={currentUser?.tip || ''} className="text-[14px] px-2.5 py-1 ml-1 mr-1" /> • {currentUser?.name}
              </span>
            </div>
            <button 
              onClick={() => {
                logActivity('Obertura Disclaimer Legal');
                setShowLegalModal(true);
              }}
              className="p-4 lg:p-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-2 font-black text-[10px] uppercase tracking-widest group"
              title="Consultar Avís Legal i Seguretat"
            >
              <ShieldCheck className="w-6 h-6" /> 
              <span>AVÍS LEGAL</span>
            </button>
            <button 
              onClick={() => { logActivity('Tancament de sessió'); setIsAuthenticated(false); setCurrentUser(null); setShowAdmin(false); setPin(''); setConfirmPin(''); }} 
              className="p-4 lg:p-2.5 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:bg-mossos-red hover:text-white transition-all"
              title="Tancar sessió segura"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 p-10 lg:p-5 lg:overflow-hidden overflow-y-auto">
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
            <div className="relative h-full">
              {/* (Avís d'actualització/F5 retirat — ja no es mostra) */}
              {/* Grid responsive: 1col mòbil → 4cols desktop sempre.
                  9 apps en 3 files (4+4+1) o totes en 2 files (4+5) segons quantitat.
                  En escriptori les caixes s'alcen amb auto-rows-fr per omplir l'altura
                  disponible sense scroll (`lg:auto-rows-fr`). */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-3 pb-6 lg:pb-0 relative z-10 lg:auto-rows-fr lg:h-[calc(100%-3rem)]">
              {APP_LINKS
                .filter(link => {
                  // Apps adminOnly: NOMÉS visibles per al TIP 5085 (no per a qualsevol admin)
                  if (!link.adminOnly) return true;
                  const tip = (currentUser?.tip || '').replace(/[^0-9]/g, '');
                  return tip === '5085';
                })
                .map((link, index) => {
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
          </div>
          )}
        </div>
      </main>
      <footer className="shrink-0 p-4 border-t border-white/5 bg-[#0f172a]/50 flex justify-center items-center px-10">
        <p className="text-slate-600 text-[11px] lg:text-[14px] font-black uppercase tracking-widest">v2.56 • AES-256 ENCRYPTION ACTIVE</p>
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
        <LegalModalContent onClose={() => { localStorage.setItem('legal_accepted_v_global', 'true'); setShowLegalModal(false); }} />
      )}

    </div>
  );
}

// Control de tamany de font per a llistats de minutes/informes al panell admin.
// Permet ajustar entre 11 i 24 px per millorar lectura còmoda (presbícia).
function FontSizeControl({ size, onChange }: { size: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-3 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 w-fit shadow-inner">
      <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Font</span>
      <button
        onClick={() => onChange(Math.max(11, size - 1))}
        disabled={size <= 11}
        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
        title="Reduir font"
      >−</button>
      <input
        type="range"
        min={11}
        max={24}
        value={size}
        onChange={(e) => onChange(parseInt(e.target.value, 10))}
        className="w-32 accent-blue-500 cursor-pointer"
      />
      <button
        onClick={() => onChange(Math.min(24, size + 1))}
        disabled={size >= 24}
        className="w-8 h-8 rounded-lg bg-slate-700 hover:bg-slate-600 text-white text-lg font-black flex items-center justify-center disabled:opacity-30 disabled:cursor-not-allowed active:scale-95 transition-all"
        title="Augmentar font"
      >+</button>
      <span className="text-xs font-mono font-black text-blue-400 min-w-[36px] text-center">{size}px</span>
      {size !== 15 && (
        <button
          onClick={() => onChange(15)}
          className="text-[10px] uppercase tracking-widest font-bold text-slate-500 hover:text-white transition-colors"
          title="Tornar al tamany per defecte"
        >Reset</button>
      )}
    </div>
  );
}

function AdminDashboard({ logs, costLogs, rankLogs, users, dictatLogs, appStatuses, onResetPin, onToggleStatus, onCreateUser, onUpdateName, onToggleAppStatus }: { logs: any[], costLogs: any[], rankLogs: any[], users: any[], dictatLogs: any[], appStatuses: Record<string, string>, onResetPin: (tip: string) => void, onToggleStatus: (tip: string, current: string) => void, onCreateUser: (tip: string, name: string) => void, onUpdateName: (tip: string, name: string) => void, onToggleAppStatus: (appId: string, current: string) => void }) {
  const [activeTab, setActiveTab] = useState<'activity' | 'users' | 'ranking' | 'costos' | 'dictat' | 'minutes' | 'apps'>('activity');
  const [minutesLogs, setMinutesLogs] = useState<any[]>([]);
  // Tamany de font ajustable per a les llistes d'informes (Dictat LA 1 + Minutes LA 6).
  // Persistent al localStorage perquè cada admin recordi la seva preferència.
  const [adminFontSize, setAdminFontSize] = useState<number>(() => {
    if (typeof window === 'undefined') return 15;
    const saved = parseInt(localStorage.getItem('admin_font_size') || '15', 10);
    return isNaN(saved) ? 15 : Math.min(24, Math.max(11, saved));
  });
  useEffect(() => {
    try { localStorage.setItem('admin_font_size', String(adminFontSize)); } catch {}
  }, [adminFontSize]);
  // Helper: el TIP de l'admin (5085) NO ha d'aparèixer als llistats — és l'administrador.
  const isAdminTip = (tip: any): boolean => {
    const s = String(tip || '').replace(/\D/g, '').replace(/^0+/, '');
    return s === '5085';
  };
  // Lectura dels documents de LA 6 (projecte Firebase: dictat-minutes) via REST.
  // Polling cada 30 s — LA 6 desa amb REST i no SDK, així que aquí també.
  // Paginem fins a esgotar nextPageToken per agafar TOTES les minutes (abans
  // limitàvem a 100, que era massa baix per a un cos amb molts agents).
  useEffect(() => {
    const fetchMinutes = async () => {
      try {
        const KEY = 'AIzaSyA7F0JZHcgRVb8tPl1oJuHSDYmxkWTktUY';
        const BASE = `https://firestore.googleapis.com/v1/projects/dictat-minutes/databases/(default)/documents/reports?pageSize=300&key=${KEY}`;
        let nextPageToken: string | undefined = undefined;
        const allDocs: any[] = [];
        // Fins a 10 pàgines (3000 docs) com a hard cap defensiu
        for (let page = 0; page < 10; page++) {
          const url = nextPageToken ? `${BASE}&pageToken=${encodeURIComponent(nextPageToken)}` : BASE;
          const r = await fetch(url);
          if (!r.ok) break;
          const data = await r.json();
          const docs = (data.documents || []).map((doc: any) => {
            const id = doc.name.split('/').pop();
            const fields = doc.fields || {};
            const result: any = { id };
            for (const k in fields) {
              const v = fields[k];
              const t = Object.keys(v)[0];
              result[k] = t === 'timestampValue' ? new Date(v[t])
                         : t === 'integerValue' ? Number(v[t])
                         : v[t];
            }
            return result;
          });
          allDocs.push(...docs);
          nextPageToken = data.nextPageToken;
          if (!nextPageToken) break;
        }
        allDocs.sort((a: any, b: any) => {
          const da = a.createdAt instanceof Date ? a.createdAt.getTime() : 0;
          const db = b.createdAt instanceof Date ? b.createdAt.getTime() : 0;
          return db - da;
        });
        setMinutesLogs(allDocs);
      } catch (err) {
        console.error('Minutes fetch error:', err);
      }
    };
    fetchMinutes();
    const interval = setInterval(fetchMinutes, 30000);
    return () => clearInterval(interval);
  }, []);
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
      if (!log.tip || log.tip.includes('5085') || log.isAdmin) return;
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
      if (!log.cost || !log.timestamp || log.tip?.includes('5085')) return;
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
    const sortedLogs = [...logs].filter(log => !log.isAdmin && !log.tip?.includes('5085')).sort((a, b) => {
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
        <button onClick={() => setActiveTab('minutes')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'minutes' ? 'bg-purple-500 text-white' : 'text-slate-400 hover:text-white'}`}>Minutes LA 6 ({minutesLogs.length})</button>
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
                <button onClick={() => setIsAdding(!isAdding)} className="flex items-center gap-2 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-4 py-2 rounded-xl text-[12px] lg:text-[15px] font-black uppercase hover:bg-emerald-500/20 transition-all active:scale-95">
                  <UserPlus className="w-4 h-4" /> Nou Agent
                </button>
                <input type="text" placeholder="Cercar agent..." className="bg-white/5 border border-white/10 rounded-xl py-2 px-4 text-xs text-white outline-none focus:ring-1 focus:ring-amber-500 w-64" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
              </>
            )}
          </div>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {activeTab === 'activity' ? (
            <>
              {/* v4.06 — Selector de mida de font també per ACTIVITAT.
                   El "qui" (nom + TIP) i "què" (ús de) eren massa petits. */}
              <FontSizeControl size={adminFontSize} onChange={setAdminFontSize} />
              {visibleActivityLogs.map((log, i) => (
              <div key={i} className={`flex justify-between p-4 bg-black/20 border rounded-2xl transition-all ${log.success ? 'border-emerald-500/30' : 'border-white/5'}`}>
                <div className="flex items-center gap-4">
                  <AgentBadge tip={log.tip} className="scale-125 mx-2" />
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-black text-white uppercase" style={{ fontSize: `${adminFontSize}px`, lineHeight: 1.3 }}>{log.name}</p>
                      {log.success && <span className="text-[8px] bg-emerald-500 text-black px-1.5 py-0.5 rounded font-black flex items-center gap-1 shadow-lg shadow-emerald-500/20"><Check className="w-2 h-2" /> ÈXIT / ACABAT</span>}
                    </div>
                    <p className="font-bold text-amber-500 uppercase mt-1" style={{ fontSize: `${Math.max(10, adminFontSize - 3)}px`, lineHeight: 1.4 }}>
                      {log.type === 'session' ? (
                        <span className="flex items-center gap-2 flex-wrap">
                          <Activity className="w-3 h-3" /> ÚS DE: <span className="text-white bg-white/10 px-2 rounded">{log.app}</span> {log.count > 1 && `(x${log.count} ops)`}
                        </span>
                      ) : (
                        log.action
                      )}
                      {log.totalCost > 0 && <span className="ml-2 text-emerald-500 bg-emerald-500/10 px-2 rounded">[{log.totalCost.toFixed(4)} €]</span>}
                    </p>
                    {log.details && log.details.length > 0 && (
                      <p className="font-mono text-slate-400 mt-1 uppercase flex gap-2 flex-wrap" style={{ fontSize: `${Math.max(10, adminFontSize - 3)}px`, lineHeight: 1.4 }}>
                        {log.details.map((d: any, idx: number) => <span key={idx} className="bg-black/40 px-1 border border-white/5 rounded">↳ {d}</span>)}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-mono text-slate-500" style={{ fontSize: `${Math.max(10, adminFontSize - 2)}px`, lineHeight: 1.3 }}>{log.timestamp?.toDate ? log.timestamp.toDate().toLocaleString() : new Date(log.timestamp).toLocaleString()}</p>
                  {log.endTime && (
                    <p className="font-mono text-slate-600 mt-1 uppercase" style={{ fontSize: `${Math.max(10, adminFontSize - 4)}px` }}>Sessió Finalitzada</p>
                  )}
                </div>
              </div>
              ))}
            </>
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
              {/* v4.06 — Selector de mida de font també per RÀNQUING.
                   Els noms d'agents i els pills d'apps eren massa petits. */}
              <FontSizeControl size={adminFontSize} onChange={setAdminFontSize} />
              {usageRanking.map((rank, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-black/20 border border-white/5 rounded-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-amber-500 text-black flex items-center justify-center font-black text-[12px]">{i + 1}</div>
                    <div>
                      <p className="font-black text-white uppercase" style={{ fontSize: `${adminFontSize}px`, lineHeight: 1.3 }}>{rank.name}</p>
                      <AgentBadge tip={rank.tip} />
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex gap-4 items-center">
                      <div className="flex flex-wrap gap-1.5 justify-end max-w-[200px] sm:max-w-md">
                        {Object.entries(rank.appCounts).map(([app, c]) => (
                          <span key={app} className="bg-white/5 border border-white/10 px-2 py-0.5 rounded text-slate-300 font-bold uppercase whitespace-nowrap" style={{ fontSize: `${Math.max(9, adminFontSize - 4)}px` }}>
                            {app}: <span className="text-amber-500">{c}</span>
                          </span>
                        ))}
                      </div>
                      <div className="text-right min-w-[60px]">
                        <span className="font-black text-amber-500 leading-none block" style={{ fontSize: `${adminFontSize + 6}px` }}>{rank.count}</span>
                        <span className="font-black uppercase text-slate-500" style={{ fontSize: `${Math.max(9, adminFontSize - 5)}px` }}>TOTAL OPS</span>
                      </div>
                    </div>
                    {rank.totalCost > 0 && (
                      <span className="font-black text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full" style={{ fontSize: `${Math.max(10, adminFontSize - 3)}px` }}>{rank.totalCost.toFixed(3)} €</span>
                    )}
                  </div>
                </div>
              ))}
              {usageRanking.length === 0 && <p className="text-center py-10 text-slate-500 text-[10px] uppercase font-black">No hi ha prou dades per generar el rànquing</p>}
            </div>
          ) : activeTab === 'dictat' ? (
            <div className="space-y-4">
                  {/* Selector de tamany de font — comú per a Dictat i Minutes */}
                  <FontSizeControl size={adminFontSize} onChange={setAdminFontSize} />
                  {Array.isArray(dictatLogs) && dictatLogs.filter((log) => {
                    const t = log?.tip || log?.agent_tip || log?.agentTip || log?.id_agent || log?.agent_id || log?.usuari || log?.usuario || log?.user || log?.tip_agent_1 || log?.instructor || log?.idAgent || log?.agent || log?.userId || log?.user_id || log?.userName || log?.author || '';
                    return !isAdminTip(t);
                  }).map((log) => {
                    let agentName = '';
                    const actualTip = log?.tip || log?.agent_tip || log?.agentTip || log?.id_agent || log?.agent_id || log?.usuari || log?.usuario || log?.user || log?.tip_agent_1 || log?.instructor || log?.idAgent || log?.agent || log?.userId || log?.user_id || log?.userName || log?.author || '';
                    try {
                      const sTip = String(actualTip || '').replace(/\D/g, '').replace(/^0+/, '');
                      if (sTip) {
                        const match = (users || []).find(u => {
                          const uTip = String(u?.id || u?.tip || '').replace(/\D/g, '').replace(/^0+/, '');
                          return uTip === sTip;
                        });
                        if (match) agentName = match.name || '';
                      }
                    } catch (e) {}

                    let dateStr = 'Sense data';
                    try {
                      if (log?.timestamp?.toDate) dateStr = log.timestamp.toDate().toLocaleString();
                      else if (log?.timestamp?.seconds) dateStr = new Date(log.timestamp.seconds * 1000).toLocaleString();
                      else if (log?.timestamp) dateStr = new Date(log.timestamp).toLocaleString();
                    } catch (e) {}

                    return (
                      <div key={log?.id || Math.random()} className="p-5 bg-black/20 border border-white/5 rounded-2xl flex flex-col gap-4">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center gap-3">
                            <AgentBadge tip={String(actualTip || '???')} />
                             <div className="flex flex-col">
                              <span className="text-[18px] lg:text-3xl font-black text-amber-500">{log?.nat || 'SENSE NAT'}</span>
                              <span className="text-[12px] lg:text-[16px] font-bold text-slate-500 uppercase">
                                {agentName ? `${agentName} • TIP: ${actualTip}` : `AGENTE TIP: ${actualTip && actualTip.toUpperCase() !== 'EXTERN' ? actualTip : 'SENSE REGISTRE'}`}
                              </span>
                            </div>
                            <span className={`text-[10px] lg:text-xs px-2 py-0.5 rounded uppercase font-black tracking-widest ${log?.mode === 'TECNIC' ? 'bg-purple-500 text-white' : log?.mode === 'SIMPLE' ? 'bg-blue-500 text-white' : 'bg-emerald-500 text-white'}`}>{log?.mode || 'STDN'}</span>
                          </div>
                          <span className="text-[11px] lg:text-[13px] text-slate-500 font-mono font-black">{dateStr}</span>
                        </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                      <div className="bg-white/5 border border-white/5 p-5 rounded-[2rem] flex flex-col h-full shadow-inner">
                        <p className="text-[10px] lg:text-[12px] text-slate-500 uppercase tracking-[0.2em] font-black mb-3">Relat Capturat de l'Agent</p>
                        <p className="text-slate-200 font-medium whitespace-pre-wrap leading-relaxed flex-1 italic opacity-90 font-sans" style={{ fontSize: `${adminFontSize}px`, lineHeight: 1.6 }}>{log?.input || ''}</p>
                      </div>
                      <div className="bg-blue-500/10 border border-blue-500/20 p-5 rounded-[2rem] flex flex-col h-full shadow-xl">
                        <p className="text-[10px] lg:text-[12px] text-blue-400 uppercase tracking-[0.2em] font-black mb-3">Informe Generat</p>
                        <p className="text-blue-50 font-medium whitespace-pre-wrap leading-relaxed flex-1 font-sans" style={{ fontSize: `${adminFontSize}px`, lineHeight: 1.6 }}>{log?.report || ''}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
              {(!dictatLogs || dictatLogs.length === 0) && <p className="text-center py-10 text-slate-500 text-[12px] lg:text-[16px] uppercase font-black">No hi ha informes recents</p>}
            </div>
          ) : activeTab === 'minutes' ? (
            <div className="space-y-4">
              <FontSizeControl size={adminFontSize} onChange={setAdminFontSize} />
              {/* v4.06 — Mostrem TOTES les minutes, incloses les del TIP admin
                   (5085). L'admin sovint testeja amb el seu propi TIP i abans
                   no veia les seves pròpies generacions; ara sí. */}
              {Array.isArray(minutesLogs) && minutesLogs.map((log) => {
                const tip = String(log?.agentTip || '???');
                let agentName = '';
                try {
                  const sTip = tip.replace(/\D/g, '').replace(/^0+/, '');
                  if (sTip) {
                    const match = (users || []).find(u => {
                      const uTip = String(u?.id || u?.tip || '').replace(/\D/g, '').replace(/^0+/, '');
                      return uTip === sTip;
                    });
                    if (match) agentName = match.name || '';
                  }
                } catch (e) {}
                let dateStr = '—';
                try {
                  if (log?.createdAt instanceof Date) dateStr = log.createdAt.toLocaleString();
                  else if (log?.createdAt) dateStr = new Date(log.createdAt).toLocaleString();
                } catch (e) {}
                const tipus = log?.type || 'Document';
                return (
                  <div key={log?.id || Math.random()} className="p-5 bg-black/20 border border-white/5 rounded-2xl flex flex-col gap-3">
                    <div className="flex justify-between items-start flex-wrap gap-3">
                      <div className="flex items-center gap-3">
                        <AgentBadge tip={tip} />
                        <div className="flex flex-col">
                          <span className="text-[14px] lg:text-[18px] font-black text-purple-400 uppercase">{tipus}</span>
                          <span className="text-[11px] lg:text-[13px] font-bold text-slate-500">
                            {agentName ? `${agentName} • TIP: ${tip}` : `TIP: ${tip}`}
                          </span>
                        </div>
                      </div>
                      <span className="text-[11px] lg:text-[13px] text-slate-500 font-mono font-black">{dateStr}</span>
                    </div>
                    <div className="bg-purple-500/10 border border-purple-500/20 p-5 rounded-[2rem] shadow-inner">
                      <p className="text-[10px] lg:text-[12px] text-purple-300 uppercase tracking-[0.2em] font-black mb-3">Minuta / Informe</p>
                      <p className="text-purple-50 font-medium whitespace-pre-wrap leading-relaxed font-sans" style={{ fontSize: `${adminFontSize}px`, lineHeight: 1.6 }}>{log?.content || ''}</p>
                    </div>
                  </div>
                );
              })}
              {(!minutesLogs || minutesLogs.length === 0) && <p className="text-center py-10 text-slate-500 text-[12px] lg:text-[16px] uppercase font-black">No hi ha minutes ni informes desats</p>}
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
                          <h4 className="text-[12px] lg:text-base font-black text-white uppercase leading-tight">{app.title}</h4>
                          <span className="text-[10px] lg:text-xs font-mono text-slate-500">{app.code}</span>
                        </div>
                      </div>
                      <span className={`text-[9px] lg:text-xs px-2 py-0.5 rounded font-black uppercase ${status === 'online' ? 'bg-emerald-500 text-black' : 'bg-amber-500 text-black'}`}>
                        {status === 'online' ? 'ACTIVA' : 'OFFLINE'}
                      </span>
                    </div>
                    <button
                      onClick={() => onToggleAppStatus(app.id, status)}
                      className={`w-full py-3 rounded-xl text-[10px] lg:text-sm font-black uppercase flex items-center justify-center gap-2 transition-all active:scale-95 ${status === 'online' ? 'bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20'}`}
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
                            className="bg-black/40 border border-amber-500/50 rounded px-2 py-1 text-sm text-white uppercase outline-none w-full"
                            value={editingName}
                            onChange={(e) => setEditingName(e.target.value)}
                            autoFocus
                          />
                          <button title="Guardar nom" onClick={() => { onUpdateName(user.tip, editingName); setEditingTip(null); }} className="p-1 bg-emerald-500 text-black rounded hover:bg-emerald-400"><Check className="w-3 h-3" /></button>
                          <button title="Cancel·lar edició" onClick={() => setEditingTip(null)} className="p-1 bg-white/10 text-slate-400 rounded hover:bg-white/20"><X className="w-3 h-3" /></button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 group/name">
                          <h4 className={`text-sm lg:text-base font-black ${user.status === 'off' ? 'text-slate-500 line-through' : 'text-white'}`}>{user.name}</h4>
                          <button title="Editar nom" onClick={() => { setEditingTip(user.tip); setEditingName(user.name); }} className="opacity-0 group-hover/name:opacity-100 p-1 text-slate-500 hover:text-amber-500 transition-all"><Edit2 className="w-3 h-3" /></button>
                        </div>
                      )}
                      <AgentBadge tip={user.tip} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className={`text-[9px] lg:text-xs px-1.5 py-0.5 rounded font-black uppercase ${user.isAdmin ? 'bg-red-500' : user.status === 'off' ? 'bg-red-900 text-red-100' : user.firstLogin ? 'bg-amber-500 text-black' : 'bg-emerald-500'}`}>{user.isAdmin ? 'ADMIN' : user.status === 'off' ? 'BAIXA' : user.firstLogin ? 'Pendent' : 'Actiu'}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {!user.isAdmin && (
                      <>
                        <button onClick={() => onResetPin(user.tip)} className="flex-1 bg-white/5 border border-white/10 py-2 rounded-xl text-[10px] lg:text-xs font-black uppercase flex items-center justify-center gap-2 hover:bg-white/10 active:scale-95 transition-all"><RefreshCw className="w-3 h-3" /> Reset</button>
                        <button
                          onClick={() => onToggleStatus(user.tip, user.status || 'on')}
                          className={`flex-1 border py-2 rounded-xl text-[10px] lg:text-xs font-black uppercase flex items-center justify-center gap-2 active:scale-95 transition-all ${user.status === 'off' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-500 hover:bg-emerald-500/20' : 'bg-red-500/10 border-red-500/20 text-red-500 hover:bg-red-500/20'}`}
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
  // Apps visibles al mòbil: LA 1, LA 5, LA 6, LA 7, LA 8, LA 19 (la resta només al desktop)
  // v2.63 — LA 4 (informe-vector / A-76 Acta de Signes Externs) retirada del
  // mòbil per coherència amb el bypass mòbil de v62.72: l'app A-76 redirigeix
  // a desktop, per tant tampoc ha d'aparèixer com a opció al mòbil.
  const isMobileOperative = link.id === 'dictat-accidents' || link.id === 'gestor-casos' || link.id === 'minutes' || link.id === 'interpretador-veco' || link.id === 'a76-penal-administrativa' || link.id === 'la19-backup-admin';

  // v2.66 — Polit: tipografia 1 nivell més petita per equilibri + detalls:
  //   · gradient diagonal amb dos accents de color per cada categoria
  //   · watermark de la icona més visible (depth)
  //   · radial-gradient decoratiu al cantó oposat
  //   · línia "shine" al top quan es hover
  //   · top accent bar més marcada
  //   · cantonada inferior dreta amb un degradat radial subtil
  // v2.68 — Paleta blaugrana: imatges (verd) → grana, gestió (violeta) → blau
  // Es manté dictat amb el blau primari i admin amb ambre (per coherència
  // amb la naturalesa del rol). Les cards de gestió porten una tonalitat
  // de blau lleugerament diferent (sky/indigo) per distingir-se de dictat.
  const catGrad: Record<string, string> = {
    dictat:  'from-blue-500/30 via-slate-900/50 to-cyan-500/15',
    imatges: 'from-rose-600/30 via-slate-900/50 to-red-800/15',
    gestio:  'from-sky-500/30 via-slate-900/50 to-indigo-600/15',
    admin:   'from-amber-500/30 via-slate-900/50 to-orange-500/15'
  };
  const catRadial: Record<string, string> = {
    dictat:  'radial-gradient(circle at 100% 0%, rgba(59,130,246,0.18), transparent 55%)',
    imatges: 'radial-gradient(circle at 100% 0%, rgba(190,18,60,0.20), transparent 55%)',
    gestio:  'radial-gradient(circle at 100% 0%, rgba(14,165,233,0.18), transparent 55%)',
    admin:   'radial-gradient(circle at 100% 0%, rgba(245,158,11,0.18), transparent 55%)'
  };
  const catGlow: Record<string, string> = {
    dictat:  'group-hover:shadow-[0_0_60px_-10px_rgba(59,130,246,0.55)]',
    imatges: 'group-hover:shadow-[0_0_60px_-10px_rgba(190,18,60,0.55)]',
    gestio:  'group-hover:shadow-[0_0_60px_-10px_rgba(14,165,233,0.55)]',
    admin:   'group-hover:shadow-[0_0_60px_-10px_rgba(245,158,11,0.55)]'
  };
  const catBar: Record<string, string> = {
    dictat:  'from-blue-400 via-cyan-400 to-blue-600',
    imatges: 'from-rose-400 via-red-500 to-rose-700',
    gestio:  'from-sky-400 via-blue-400 to-indigo-500',
    admin:   'from-amber-400 via-orange-400 to-amber-600'
  };
  const catIconBg: Record<string, string> = {
    dictat:  'bg-gradient-to-br from-blue-400/30 to-blue-700/20 text-blue-200 border-blue-300/40 shadow-blue-500/30',
    imatges: 'bg-gradient-to-br from-rose-400/30 to-red-800/20 text-rose-200 border-rose-300/40 shadow-rose-600/30',
    gestio:  'bg-gradient-to-br from-sky-400/30 to-indigo-700/20 text-sky-200 border-sky-300/40 shadow-sky-500/30',
    admin:   'bg-gradient-to-br from-amber-400/30 to-amber-700/20 text-amber-200 border-amber-300/40 shadow-amber-500/30'
  };
  const catTextHover: Record<string, string> = {
    dictat:  'group-hover:text-blue-200',
    imatges: 'group-hover:text-rose-200',
    gestio:  'group-hover:text-sky-200',
    admin:   'group-hover:text-amber-200'
  };
  const catDot: Record<string, string> = {
    dictat:  'bg-blue-400',
    imatges: 'bg-rose-500',
    gestio:  'bg-sky-400',
    admin:   'bg-amber-400'
  };
  const grad      = catGrad[link.category]      || catGrad.dictat;
  const glow      = catGlow[link.category]      || '';
  const bar       = catBar[link.category]       || catBar.dictat;
  const iconBg    = catIconBg[link.category]    || catIconBg.dictat;
  const titleHov  = catTextHover[link.category] || catTextHover.dictat;
  const dot       = catDot[link.category]       || catDot.dictat;
  const radialBg  = catRadial[link.category]    || catRadial.dictat;

  return (
        <motion.button
          onClick={() => link.status !== 'maintenance' && onClick()}
          disabled={link.status === 'maintenance'}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          style={{ backgroundImage: radialBg }}
          className={`group relative bg-gradient-to-br ${grad} bg-mossos-blue/40 backdrop-blur-sm rounded-3xl p-5 lg:p-5 xl:p-6 border border-white/10 ${isMobileOperative ? 'flex' : 'hidden md:flex'} flex-col justify-between text-left overflow-hidden min-h-[180px] lg:min-h-0 lg:h-full ${link.status === 'maintenance' ? 'opacity-60 grayscale cursor-not-allowed' : `hover:border-white/25 ${glow} transition-all duration-500 shadow-xl`}`}
        >
          {/* v2.66 — Top accent bar amb gradient del color de la categoria */}
          <div className={`absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r ${bar} opacity-80 group-hover:opacity-100 transition-opacity z-10`} />

          {/* v2.66 — Shine: línia de llum que recorre la card al hover */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            <div className="absolute -inset-y-2 -left-1/2 w-1/2 bg-gradient-to-r from-transparent via-white/[0.08] to-transparent skew-x-[-20deg] translate-x-0 group-hover:translate-x-[300%] transition-transform duration-1000 ease-out" />
          </div>

          {/* v2.67 — Watermark gegant retirat: feia massa soroll visual. */}

          {link.status === 'maintenance' && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="bg-amber-500 text-black px-6 py-1.5 -rotate-12 font-black text-base tracking-widest uppercase shadow-2xl border-y-2 border-dashed border-black/50 overflow-hidden w-[120%] text-center">
                {link.maintenanceMsg || 'En Construcció'}
              </div>
            </div>
          )}
          <div className={`flex justify-between items-start z-10 ${link.status === 'maintenance' ? 'opacity-50' : ''}`}>
            <div className={`w-14 h-14 lg:w-16 lg:h-16 xl:w-[72px] xl:h-[72px] rounded-2xl flex items-center justify-center shadow-lg border ${iconBg} group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}><Icon className="w-7 h-7 lg:w-9 lg:h-9 xl:w-10 xl:h-10" strokeWidth={1.8} /></div>
            <span className="text-[8px] lg:text-[10px] font-mono font-bold text-slate-400 px-2 py-1 rounded-md bg-black/30 border border-white/10 tracking-[0.15em] uppercase">{link.code}</span>
          </div>
          <div className={`mt-3 lg:mt-4 z-10 ${link.status === 'maintenance' ? 'opacity-50' : ''}`}>
            {/* v2.69 — títols més equilibrats: 1 step menys a tots els breakpoints
                perquè els títols llargs (REANOMENADOR DE FOTOGRAFIES, SIMPTOMATOLOGIA…)
                no desbordin la card i la descripció es vegi sencera. */}
            <h3 className={`text-base lg:text-lg xl:text-xl font-black text-white ${titleHov} transition-colors uppercase leading-[1.15] mb-2 lg:mb-3 whitespace-pre-line tracking-tight drop-shadow-[0_2px_6px_rgba(0,0,0,0.4)]`}>{link.title}</h3>
            {/* v2.66 — Línia de separació elegant amb gradient */}
            <div className={`h-[1px] w-10 bg-gradient-to-r ${bar} opacity-60 mb-3 group-hover:w-20 transition-all duration-500`} />
            {/* v2.70 — descripció sense truncament: ha de cabre tot el text de la
                descripció dins la card. Les cards s'adaptaran en alçada (totes
                igualades pel grid). */}
            <p className="text-slate-300 text-xs lg:text-sm xl:text-[14px] font-medium leading-relaxed">{link.description}</p>
          </div>
          <div className={`flex items-center justify-between pt-3 lg:pt-4 border-t border-white/10 mt-3 lg:mt-4 relative z-10 ${link.status === 'maintenance' ? 'opacity-50' : ''}`}>
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${dot} shadow-[0_0_10px_currentColor]`} />
              <span className="text-[10px] lg:text-[11px] font-black uppercase text-slate-400 tracking-wider">{link.category}</span>
            </div>
            <div className="flex items-center gap-2">
              {link.category === 'imatges' && (
                <div className="flex items-center gap-1 bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  <Monitor className="w-3 h-3 text-emerald-400" />
                  <span className="text-[8px] lg:text-[9px] font-black text-emerald-400 uppercase tracking-wider">Escriptori</span>
                </div>
              )}
              {link.status !== 'maintenance' && (
                <ExternalLink className="w-4 h-4 lg:w-5 lg:h-5 text-amber-400 translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
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
