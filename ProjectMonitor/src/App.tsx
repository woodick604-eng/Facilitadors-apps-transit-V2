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
  const [cmds, setCmds] = useState<any[]>([]);
  const [monitorStatus, setMonitorStatus] = useState<'online' | 'offline'>('offline');
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'backups'>('dashboard');

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

  const sendCommand = async (type: string, data: any = {}) => {
    const cmd = { type, status: 'pending', time: new Date().toISOString(), ...data };
    await addDoc(collection(db, 'remote_commands'), cmd);
    alert(`Ordre ${type} enviada correctament!`);
  };

  const restaurarSistema = (date: string, projectName: string) => {
    const d = date.split(' ')[0];
    if(!confirm(`⚠️ ATENCIÓ: Vols restaurar ${projectName.toUpperCase()} a la data ${d}? Es perdran els canvis no commitejats.`)) return;
    sendCommand('PANIC_ROLLBACK', { date: d, projectId: projectName });
  };

  return (
    <div className="monitor-app">
      <aside className="sidebar">
        <div className="sidebar-header">
           <div className="logo-box">A</div>
           <h1>ALEX HUB MONITOR</h1>
        </div>
        <nav className="sidebar-nav">
          <div className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}><Activity size={18} /> Dashboard</div>
          <div className={`nav-item ${activeTab === 'history' ? 'active' : ''}`} onClick={() => setActiveTab('history')}><Clock size={18} /> Historial</div>
          <div className={`nav-item ${activeTab === 'backups' ? 'active' : ''}`} onClick={() => setActiveTab('backups')}><Database size={18} /> Backups</div>
        </nav>
        
        <div className="monitor-health">
            <div className={`health-dot ${monitorStatus}`}></div>
            <div className="health-info">
                <div className="health-label">Monitor Actiu</div>
                <div className="health-value">{monitorStatus === 'online' ? 'SÍ (ONLINE)' : 'NO (OFFLINE)'}</div>
            </div>
        </div>
      </aside>

      <main className="main-content">
        {activeTab === 'dashboard' && (
          <>
            <header className="header">
              <div className="header-info">
                <h2>Control de Projectes</h2>
                <p>Monitorització i operacions Git en temps real</p>
              </div>
              <button onClick={() => sendCommand('SEGELLAR_GIT')} className="btn-primary">
                <Shield size={18} /> SEGELLAR TOT (GIT)
              </button>
            </header>

            <div className="project-grid">
              {projs.map(p => (
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
                  </div>
                  <div className="project-meta-grid">
                    <div className="meta-box"><span className="label">BRANCA</span><span className="value">{p.branch || 'main'}</span></div>
                    <div className="meta-box"><span className="label">ACTIVITAT</span><span className="value">{p.lastCommit || 'Recent'}</span></div>
                  </div>
                  <div className="card-buttons">
                    <button onClick={() => sendCommand('SEGELLAR_GIT_INDIVIDUAL', { projectId: p.id })} className="btn-card-action">Segellar</button>
                    <button 
                      title="Obrir carpeta" 
                      className="btn-card-action secondary"
                      onClick={() => sendCommand('OPEN_PROJECT', { projectId: p.id })}
                    >
                      <ExternalLink size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="history-tab">
             <h2>📜 Historial d'Ordres</h2>
             <div className="history-list" style={{marginTop: '2rem'}}>
                {cmds.slice(0, 20).map(c => (
                   <div key={c.id} className="history-row" style={{background: 'var(--bg-card)', padding: '1rem', marginBottom: '0.5rem', borderRadius: '8px', border: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between'}}>
                      <div>
                         <span style={{color: 'var(--accent)', fontWeight: 800}}>{c.type}</span>
                         <span style={{color: 'var(--text-secondary)', marginLeft: '1rem'}}>{new Date(c.time).toLocaleString()}</span>
                      </div>
                      <span className={`status-badge ${c.status}`} style={{fontSize: '0.6rem'}}>{c.status?.toUpperCase()}</span>
                   </div>
                ))}
             </div>
          </div>
        )}

        {activeTab === 'backups' && (
          <section className="recovery-section">
            <div className="section-title">
               <Database size={20} color="var(--accent)" />
               <h2>Punts de Restauració (Backups)</h2>
            </div>
            <div className="recovery-list">
              {recs.map(r => (
                <div key={r.id} className="recovery-card">
                  <div className="recovery-main">
                    <span className="recovery-tag" style={{background: 'var(--primary)', color: 'white'}}>{r.projectName?.toUpperCase() || 'SISTEMA'}</span>
                    <span className="recovery-msg">{r.msg}</span>
                    <div className="recovery-details">{r.date} • {r.hash?.substring(0,8)}</div>
                  </div>
                  <button className="btn-restore-action" onClick={() => restaurarSistema(r.date, r.projectName || 'sistema')}>
                      <RefreshCw size={14} /> Restaurar
                  </button>
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
