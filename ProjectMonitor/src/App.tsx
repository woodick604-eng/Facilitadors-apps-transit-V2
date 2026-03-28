import React, { useState, useEffect } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, onSnapshot, query, orderBy, addDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Shield, RefreshCw, TriangleAlert, CircleCheck, Activity, Clock, Database, GitBranch, ExternalLink } from 'lucide-react';
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

function App() {
  const [projs, setProjs] = useState<any[]>([]);
  const [recs, setRecs] = useState<any[]>([]);
  const [monitorStatus, setMonitorStatus] = useState<'online' | 'offline'>('offline');
  const [lastHeartbeat, setLastHeartbeat] = useState<Date | null>(null);

  useEffect(() => {
    // Sincronització de l'estat dels projectes
    const q1 = collection(db, 'system_status');
    const u1 = onSnapshot(q1, (s) => {
        const projects = s.docs.map(d => ({id: d.id, ...d.data()})) as any[];
        setProjs(projects);
        
        // Comprovar si el monitor està viu
        const newest = projects.reduce((prev: Date, curr: any) => {
            let currTime = new Date(0);
            if (curr.updatedAt) {
                if (typeof curr.updatedAt.toDate === 'function') {
                    currTime = curr.updatedAt.toDate();
                } else if (curr.updatedAt instanceof Date) {
                    currTime = curr.updatedAt;
                }
            }
            return currTime > prev ? currTime : prev;
        }, new Date(0));
        
        const now = new Date();
        setMonitorStatus(now.getTime() - newest.getTime() < 180000 ? 'online' : 'offline');
        setLastHeartbeat(newest);
    }, (err) => {
        console.error("Firebase Sync Error (Status):", err);
    });

    // Punts de restauració
    const q2 = collection(db, 'recovery_points');
    const u2 = onSnapshot(q2, (s) => {
        setRecs(s.docs.map(d => ({id: d.id, ...d.data()})));
    }, (err) => {
        console.error("Firebase Sync Error (Recovery):", err);
    });
    
    return () => { u1(); u2(); };
  }, []);

  const sendCommand = async (type: string, data: any = {}) => {
    const cmd = {
      type,
      status: 'pending',
      time: new Date().toISOString(),
      ...data
    };
    await addDoc(collection(db, 'remote_commands'), cmd);
    alert(`Ordre ${type} enviada correctament!`);
  };

  const segellarTot = () => {
    if(!confirm('Segellar tots els projectes ara? Es farà un commit automàtic a cada repo.')) return;
    sendCommand('SEGELLAR_GIT');
  };

  const segellarProjecte = (id: string) => {
    if(!confirm(`Segellar només el projecte ${id.toUpperCase()}?`)) return;
    sendCommand('SEGELLAR_GIT_INDIVIDUAL', { projectId: id });
  };

  const restaurarSistema = (date: string) => {
    const d = date.split(' ')[0]; // Agafar només YYYY-MM-DD
    if(!confirm(`⚠️ ATENCIÓ: Vols restaurar TOT EL SISTEMA a la data ${d}? Es perdran els canvis no commitejats.`)) return;
    sendCommand('PANIC_ROLLBACK', { date: d });
  };

  return (
    <div className="monitor-app">
      <aside className="sidebar">
        <div className="sidebar-header">
           <div className="logo-box">A</div>
           <h1>ALEX HUB MONITOR</h1>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-item active"><Activity size={18} /> Dashboard</div>
          <div className="nav-item"><Clock size={18} /> Historial</div>
          <div className="nav-item"><Database size={18} /> Backups</div>
        </nav>
        
        <div className="monitor-health">
            <div className={`health-dot ${monitorStatus}`}></div>
            <div className="health-info">
                <div className="health-label">Monitor de Sistema</div>
                <div className="health-value">{monitorStatus === 'online' ? 'ACTIU' : 'DESCONNECTAT'}</div>
            </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="header">
          <div className="header-info">
            <h2>Estat de les Aplicacions</h2>
            <p>Control centralitzat dels entorns de treball</p>
          </div>
          <div className="header-actions">
            <button onClick={segellarTot} className="btn-primary">
              <Shield size={18} /> SEGELLAR TOT (GIT)
            </button>
          </div>
        </header>

        <div className="project-grid">
          {projs.map(p => (
            <div key={p.id} className="project-card">
              <div className="card-header">
                <div className="project-icon-ring"><GitBranch size={22} /></div>
                <span className={`project-status-badge ${p.status === 'online' ? 'online' : 'offline'}`}>
                  {p.status?.toUpperCase()}
                </span>
              </div>
              <div className="project-body">
                <h3>{p.id?.toUpperCase()}</h3>
                <div className="status-indicator">
                    {p.hasUncommited ? (
                        <span className="warn"><TriangleAlert size={12} /> Canvis pendents</span>
                    ) : (
                        <span className="success"><CircleCheck size={12} /> Tot al dia</span>
                    )}
                </div>
              </div>
              
              <div className="project-meta-grid">
                <div className="meta-box">
                  <span className="label">BRANCA</span>
                  <span className="value">{p.branch || 'main'}</span>
                </div>
                <div className="meta-box">
                  <span className="label">ACTIVITAT</span>
                  <span className="value">{p.lastCommit || 'Recent'}</span>
                </div>
              </div>

              <div className="card-buttons">
                <button onClick={() => segellarProjecte(p.id)} className="btn-card-action">Segellar</button>
                <button title="Obrir Projecte" className="btn-card-action secondary"><ExternalLink size={14} /></button>
              </div>
            </div>
          ))}
        </div>

        <section className="recovery-section">
          <div className="section-title">
             <TriangleAlert size={20} color="var(--accent)" />
             <h2>Punts de Restauració</h2>
          </div>
          <div className="recovery-list">
            {recs.length === 0 && <div className="empty-state">No hi ha punts de restauració disponibles.</div>}
            {recs.map(r => (
              <div key={r.id} className="recovery-card">
                <div className="recovery-main">
                  <div className="recovery-tag">{r.projectName?.toUpperCase() || 'ROOT'}</div>
                  <div className="recovery-msg">{r.description || r.msg}</div>
                  <div className="recovery-details">{r.date || 'S/D'} • {r.hash?.substring(0,8) || 'no-hash'}</div>
                </div>
                <button 
                    className="btn-restore-action" 
                    onClick={() => restaurarSistema(r.date)}
                >
                    <RefreshCw size={14} /> Restaurar
                </button>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

