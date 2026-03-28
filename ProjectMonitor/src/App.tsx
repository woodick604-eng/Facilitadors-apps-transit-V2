import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { 
  Shield, 
  RefreshCw, 
  TriangleAlert, 
  CircleCheck, 
  Activity, 
  Clock, 
  Database, 
  GitBranch, 
  ExternalLink, 
  Mic, 
  Camera, 
  FileText, 
  Images, 
  Search, 
  LayoutGrid,
  ShieldCheck,
  History,
  Lock
} from 'lucide-react';
import './index.css';

const fbConfig = {
    apiKey: 'AIzaSyByZ75L4F1c9r_rL_C3k_vJpS7XpXX0',
    authDomain: 'facilitadors-transit.firebaseapp.com',
    projectId: 'facilitadors-transit',
    storageBucket: 'facilitadors-transit.firebasestorage.app',
    messagingSenderId: '719513203160',
    appId: '1:719513203160:web:a68fc25fd89a8beaa882ad'
};

const app = initializeApp(fbConfig);
const db = getFirestore(app);

const APP_LINKS = [
  { id: 'dictat-accidents', title: 'Dictat d\'Accidents', desc: 'Eina de dictat per veu per a informes.', url: 'https://dictat-atenea-t06.web.app/', icon: Mic },
  { id: 'renombrador', title: 'Reanomenador Photos', desc: 'Reduir i organitzar fotografies de camp.', url: 'https://processador-imatges-accidents.web.app/', icon: Images },
  { id: 'informe-atenea', title: 'Informe Atenea', desc: 'Informe fotogràfic per Jutjats.', url: 'https://infofoto-vector-art.web.app/', icon: FileText },
  { id: 'informe-vector', title: 'Informe Vector', desc: 'Informe fotogràfic automàtic.', url: 'https://infofoto-urivi-3-service-177830712484.europe-west1.run.app/', icon: Camera },
  { id: 'simptomatologia', title: 'Simptomatologia', desc: 'Signes externs DGT compatibles.', url: 'https://simptomatologia.web.app/', icon: Search },
  { id: 'dictat-minutes', title: 'Dictat Minutes', desc: 'Diligència d\'Informe T-32 cronològic.', url: 'https://dictat-minutes.web.app/', icon: Clock }
];

function App() {
  const [projs, setProjs] = useState<any[]>([]);
  const [recs, setRecs] = useState<any[]>([]);
  const [cmds, setCmds] = useState<any[]>([]);
  const [monitorStatus, setMonitorStatus] = useState<'online' | 'offline'>('offline');
  const [activeTab, setActiveTab] = useState<'apps' | 'dashboard' | 'history' | 'backups'>('apps');
  const [auth, setAuth] = useState({ user: '', pass: '', ok: false });

  useEffect(() => {
    const q1 = collection(db, 'system_status');
    const u1 = onSnapshot(q1, (s) => {
        const projects = s.docs.map(d => ({id: d.id, ...d.data()})) as any[];
        setProjs(projects);
        const newest = projects.reduce((prev: Date, curr: any) => {
            let currTime = new Date(0);
            if (curr.updatedAt && typeof curr.updatedAt.toDate === 'function') currTime = curr.updatedAt.toDate();
            return currTime > prev ? currTime : prev;
        }, new Date(0));
        const now = new Date();
        setMonitorStatus(now.getTime() - newest.getTime() < 180000 ? 'online' : 'offline');
    });

    const q2 = query(collection(db, 'recovery_points'), orderBy('date', 'desc'));
    const u2 = onSnapshot(q2, (s) => setRecs(s.docs.map(d => ({id: d.id, ...d.data()}))));

    const q3 = query(collection(db, 'remote_commands'), orderBy('time', 'desc'));
    const u3 = onSnapshot(q3, (s) => setCmds(s.docs.map(d => ({id: d.id, ...d.data()}))));
    
    return () => { u1(); u2(); u3(); };
  }, []);

  const handleLogin = (e: any) => {
    e.preventDefault();
    if (auth.user === '5085' && auth.pass === '0852') setAuth({...auth, ok: true});
    else alert('❌ Credencials incorrectes');
  };

  const sendCommand = async (type: string, data: any = {}) => {
    const cmd = { type, status: 'pending', time: new Date().toISOString(), ...data };
    await addDoc(collection(db, 'remote_commands'), cmd);
    alert(`Ordre ${type} enviada correctament!`);
  };

  const createCheckpoint = () => {
    const msg = prompt('Descripció del PUNT DE CONTROL (Checkpoint):', 'Versió estable ' + new Date().toLocaleDateString());
    if(!msg) return;
    sendCommand('CREATE_CHECKPOINT', { msg });
  };

  const openApp = (url: string) => {
    window.open(url, '_blank');
  };

  if (!auth.ok) {
    return (
      <div className="login-screen" style={{minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg, #0f172a 0%, #020617 100%)', color: 'white', textAlign: 'center', padding: '2rem'}}>
        <div style={{width: '120px', height: '160px', marginBottom: '2rem', borderRadius: '1.5rem', overflow: 'hidden', border: '2px solid rgba(255,255,255,0.1)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)'}}>
          <img src="https://facilitadors-transit.web.app/escud-transit-v2.png" style={{width:'100%', height:'100%', objectFit:'cover'}} alt="Escut Mossos" />
        </div>
        <h1 style={{fontSize: '2rem', fontWeight: '900', letterSpacing: '-0.02em', marginBottom: '0.5rem'}}>ATENEA HUB MONITOR</h1>
        <p style={{color: 'rgba(255,255,255,0.5)', maxWidth: '400px', fontSize: '1rem', lineHeight: '1.6'}}>Esperant validació del Facilitador Principal...</p>
        
        <form onSubmit={handleLogin} style={{marginTop: '2rem', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.1)', width: '300px', display: 'flex', flexDirection: 'column', gap: '1rem'}}>
          <input 
            type="text" 
            placeholder="Usuari TIP" 
            value={auth.user} 
            onChange={e => setAuth({...auth, user: e.target.value})}
            style={{background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '0.8rem', color: 'white', textAlign: 'center'}}
          />
          <input 
            type="password" 
            placeholder="PIN de Monitor" 
            value={auth.pass} 
            onChange={e => setAuth({...auth, pass: e.target.value})}
            style={{background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.1)', padding: '0.8rem', borderRadius: '0.8rem', color: 'white', textAlign: 'center'}}
          />
          <button type="submit" style={{background: '#3b82f6', color: 'white', padding: '0.8rem', borderRadius: '0.8rem', fontWeight: 'bold', border: 'none', cursor: 'pointer'}}>ACCEDIR AL MONITOR</button>
        </form>

        <div style={{marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
           <div className="loading-dots" style={{display:'flex', gap:'8px'}}>
              <div style={{width:'10px', height:'10px', backgroundColor:'#3b82f6', borderRadius:'50%', animation:'pulse 1.5s infinite'}}></div>
              <div style={{width:'10px', height:'10px', backgroundColor:'#3b82f6', borderRadius:'50%', animation:'pulse 1.5s infinite 0.2s'}}></div>
              <div style={{width:'10px', height:'10px', backgroundColor:'#3b82f6', borderRadius:'50%', animation:'pulse 1.5s infinite 0.4s'}}></div>
           </div>
        </div>
        <style>{`@keyframes pulse { 0%, 100% { transform: scale(0.8); opacity: 0.3; } 50% { transform: scale(1.2); opacity: 1; } }`}</style>
      </div>
    );
  }

  return (
    <div className="monitor-app">
      <aside className="sidebar">
        <div className="sidebar-header">
           <div className="logo-box">A</div>
           <h1>HUB ATENEA</h1>
        </div>
        <nav className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'apps' ? 'active' : ''}`} onClick={() => setActiveTab('apps')}><LayoutGrid size={18} /> Aplicacions</div>
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><Activity size={18} /> Monitor Server</div>
          <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}><History size={18} /> Historial</div>
          <div className={`nav-item ${activeTab === 'backups' ? 'active' : ''}`} onClick={() => setActiveTab('backups')}><Database size={18} /> Punts Control</div>
        </nav>
        
        <div className="monitor-health">
            <div className={`health-dot ${monitorStatus}`}></div>
            <div className="health-info">
                <div className="health-label">Mac Daemon</div>
                <div className="health-value">{monitorStatus === 'online' ? 'SÍ (ONLINE)' : 'SENSE ACCÉS'}</div>
            </div>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'apps' && (
          <>
            <header className="header">
              <div className="header-info">
                <h2>Llançador d'Aplicacions</h2>
                <p>Accés directe a totes les eines facilitadores de Trànsit</p>
              </div>
            </header>
            <div className="project-grid">
              {APP_LINKS.map(app => (
                <div key={app.id} className="project-card app-launcher-card" onClick={() => openApp(app.url)}>
                   <div className="card-header">
                      <div className="project-icon-ring"><app.icon size={22} /></div>
                      <span className="project-status-badge online">ACTIVA</span>
                   </div>
                   <div className="project-body">
                      <h3>{app.title}</h3>
                      <p className="app-desc" style={{fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem'}}>{app.desc}</p>
                   </div>
                   <div className="card-buttons" style={{marginTop: 'auto'}}>
                      <button className="btn-card-action">Obrir App <ExternalLink size={12} /></button>
                   </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'dashboard' && (
          <>
            <header className="header">
              <div className="header-info">
                <h2>Infraestructura i Git</h2>
                <p>Monitorització i operacions Git en temps real</p>
              </div>
              <div className="header-actions" style={{display: 'flex', gap: '1rem'}}>
                <button onClick={createCheckpoint} className="btn-primary" style={{background: 'var(--accent)'}}>
                  <Shield size={18} /> CHECKPOINT DE SEGURETAT
                </button>
                <button onClick={() => sendCommand('SEGELLAR_GIT')} className="btn-primary">
                  <Shield size={18} /> SEGELLAR TOT (GIT)
                </button>
              </div>
            </header>

            <div className="project-grid">
              {projs.map(p => {
                const projectRecs = recs.filter((r: any) => r.projectName === p.id).slice(0, 3);
                return (
                  <div key={p.id} className="project-card">
                    <div className="card-header">
                      <div className="project-icon-ring"><GitBranch size={22} /></div>
                      <span className={`project-status-badge ${p.status === 'online' ? 'online' : 'offline'}`}>{p.status?.toUpperCase()}</span>
                    </div>
                    <div className="project-body">
                      <h3>{p.id?.toUpperCase()}</h3>
                      <div className="status-indicator">
                          {p.hasUncommited ? <span className="warn"><TriangleAlert size={12} /> Pendent</span> : <span className="success"><CircleCheck size={12} /> Net</span>}
                      </div>

                      <div className="stable-points-list" style={{marginTop: '1rem', background: 'rgba(0,0,0,0.2)', padding: '0.8rem', borderRadius: '1rem'}}>
                        <p style={{fontSize: '0.6rem', fontWeight: 900, color: 'var(--accent)', marginBottom: '0.5rem', letterSpacing: '1px'}}>ÚLTIMS PUNTS ESTABLES</p>
                        {projectRecs.length > 0 ? projectRecs.map((r: any) => (
                            <div key={r.id} className="mini-recovery-row" style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', marginBottom: '0.4rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.3rem'}}>
                               <span style={{opacity: 0.8}}>{r.date?.split(' ')[0]}</span>
                               <span style={{opacity: 0.5, fontStyle: 'italic'}}>Protegit</span>
                            </div>
                        )) : <p style={{fontSize: '0.6rem', opacity: 0.5}}>Sense historial</p>}
                      </div>
                    </div>
                    <div className="project-meta-grid">
                      <div className="meta-box"><span className="label">BRANCA</span><span className="value">{p.branch || 'main'}</span></div>
                      <div className="meta-box"><span className="label">ACTIVITAT</span><span className="value">{p.lastCommit || 'Recent'}</span></div>
                    </div>
                    <div className="card-buttons">
                      <button onClick={(e) => { e.stopPropagation(); sendCommand('SEGELLAR_GIT_INDIVIDUAL', { projectId: p.id }); }} className="btn-card-action">Segellar</button>
                      <button 
                        title="Obrir carpeta" 
                        className="btn-card-action secondary"
                        onClick={(e) => { e.stopPropagation(); sendCommand('OPEN_PROJECT', { projectId: p.id }); }}
                      >
                        <ExternalLink size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="history-tab" style={{padding: '2rem'}}>
             <h2>📜 Historial d'Ordres Remotes</h2>
             <div className="history-list" style={{marginTop: '2rem'}}>
                {cmds.slice(0, 20).map(c => (
                   <div key={c.id} className="history-row" style={{background: 'rgba(255,255,255,0.05)', padding: '1rem', marginBottom: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between'}}>
                      <div>
                         <span style={{color: '#3b82f6', fontWeight: 800}}>{c.type}</span>
                         <span style={{color: 'rgba(255,255,255,0.5)', marginLeft: '1rem'}}>{new Date(c.time).toLocaleString()}</span>
                      </div>
                      <span className={`status-badge ${c.status}`} style={{fontSize: '0.6rem'}}>{c.status?.toUpperCase()}</span>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'backups' && (
          <section className="recovery-section" style={{padding: '2rem'}}>
            <div className="section-title" style={{display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem'}}>
               <Database size={24} color="#3b82f6" />
               <h2 style={{fontSize: '1.5rem', fontWeight: 'bold'}}>Punts de Restauració de Sistema</h2>
            </div>
            <div className="recovery-list" style={{display: 'flex', flexDirection: 'column', gap: '1rem'}}>
              {recs.map(r => (
                <div key={r.id} className="recovery-card" style={{background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                  <div className="recovery-main">
                    <span className="recovery-tag" style={{background: '#3b82f6', color: 'white', padding: '0.2rem 0.6rem', borderRadius: '0.4rem', fontSize: '0.7rem', fontWeight: 'bold', marginRight: '1rem'}}>{r.projectName?.toUpperCase() || 'SISTEMA'}</span>
                    <span className="recovery-msg" style={{fontWeight: 'bold'}}>{r.msg}</span>
                    <div className="recovery-details" style={{color: '#3b82f6', fontWeight: 'bold', marginTop: '0.5rem', fontSize: '0.8rem'}}>Recuperació només via Antigravity</div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;
