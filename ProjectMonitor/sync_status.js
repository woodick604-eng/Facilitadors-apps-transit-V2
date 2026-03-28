import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, serverTimestamp, collection, onSnapshot, updateDoc, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const firebaseConfig = {
    apiKey: "AIzaSyByZ75L4F1c9r_rL_C3k_vJpS7XpXpXpX0",
    authDomain: "facilitadors-transit.firebaseapp.com",
    projectId: "facilitadors-transit",
    storageBucket: "facilitadors-transit.firebasestorage.app",
    messagingSenderId: "719513203160",
    appId: "1:719513203160:web:a68fc25fd89a8beaa882ad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const projectsDir = "/Users/alex/Documents/";
const projectPaths = [
    { id: 'facilitador', path: "Facilitador apps transit/Facilitadors-apps-transit" },
    { id: 'dictat-atenea', path: "Dictat Atenea App/Dictat-Atenea" },
    { id: 'reanomenador', path: "Reducto reanomenador i classificador de fotos/processador-d-imatges-d-informes-d-accidents" },
    { id: 'informe-vector', path: "urivi-analitzador-de-fotos-d'accidents-forense-vector-5085" },
    { id: 'informe-atenea', path: "infofoto atenea" },
    { id: 'simptomatologia', path: "simptomatologia/Actes-o-oficis" },
    { id: 'dictat-minutes', path: "dictation app/dictation-app-main" }
];

console.log("🚀 INICIANT MONITOR D'ADMINISTRACIÓ (DAEMON)...");

// Funció segura per executar Git amb timeout (evita bloquejos)
function safeExec(cmd, cwd) {
    try {
        return execSync(cmd, { cwd, encoding: 'utf8', timeout: 5000 }).trim();
    } catch (e) {
        return null;
    }
}

async function updateAllStatus() {
    console.log(`[${new Date().toLocaleTimeString()}] 🔄 Sincronitzant estat dels projectes...`);
    
    for (const project of projectPaths) {
        const fullPath = path.join(projectsDir, project.path);
        let data = {
            id: project.id,
            status: 'offline',
            branch: 'N/A',
            lastCommit: 'N/A',
            hasUncommited: false
        };

        if (fs.existsSync(fullPath)) {
            data.status = 'online';
            data.branch = safeExec(`git rev-parse --abbrev-ref HEAD`, fullPath) || 'main';
            data.lastCommit = safeExec('git log -1 --format=%cr', fullPath) || 'Recent';
            const statusStr = safeExec(`git status --porcelain`, fullPath);
            data.hasUncommited = statusStr ? statusStr.length > 0 : false;
        }

        try {
            await setDoc(doc(db, 'system_status', project.id), {
                ...data,
                updatedAt: serverTimestamp()
            }, { merge: true });
        } catch (e) {
            console.error(`❌ Error sincronitzant ${project.id}:`, e.message);
        }
    }
}

const startTime = new Date();

function listenForCommands() {
    console.log("📡 Escoltant ordres del Dashboard (remote_commands)...");
    console.log("🛡️ MODE SEGUR: Només s'executaran ordres creades després de: " + startTime.toLocaleTimeString());
    
    onSnapshot(collection(db, "remote_commands"), (snapshot) => {
        snapshot.docChanges().forEach(async (change) => {
            if (change.type === "added") {
                const cmd = change.doc.data();
                
                // Ignorar ordres antigues o ja processades
                const cmdTime = cmd.time ? new Date(cmd.time) : new Date(0);
                if (cmd.status === "pending" && cmdTime > startTime) {
                    console.log(`⚡ ORDRE REBUDA (@${cmdTime.toLocaleTimeString()}): ${cmd.type}`);
                    
                    try {
                        if (cmd.type === "SEGELLAR_GIT") {
                            console.log("🛡️ Segellant tots els projectes (Git Commit)...");
                            for (const proj of projectPaths) {
                                const fullPath = path.join(projectsDir, proj.path);
                                if (fs.existsSync(fullPath)) {
                                    console.log(`   📦 Commitejant ${proj.id}...`);
                                    safeExec(`git add . && git commit -m "Segellat manual des de Dashboard (Tot): ${new Date().toISOString()}" || echo "Res a commitejar"`, fullPath);
                                }
                            }
                            await updateAllStatus(); // Forçar actualització d'estat immediata
                        } else if (cmd.type === "SEGELLAR_GIT_INDIVIDUAL" && cmd.projectId) {
                            console.log(`🛡️ Segellant projecte individual: ${cmd.projectId}`);
                            const proj = projectPaths.find(p => p.id === cmd.projectId);
                            if (proj) {
                                const fullPath = path.join(projectsDir, proj.path);
                                if (fs.existsSync(fullPath)) {
                                    safeExec(`git add . && git commit -m "Segellat manual des de Dashboard (${cmd.projectId}): ${new Date().toISOString()}" || echo "Res a commitejar"`, fullPath);
                                }
                            }
                            await updateAllStatus(); // Forçar actualització d'estat immediata
                        } else if (cmd.type === "OPEN_PROJECT" && cmd.projectId) {
                            console.log(`📂 Obrint carpeta del projecte: ${cmd.projectId}`);
                            const proj = projectPaths.find(p => p.id === cmd.projectId);
                            if (proj) {
                                const fullPath = path.join(projectsDir, proj.path);
                                safeExec(`open "${fullPath}"`); // Obrir carpeta al Finder
                            }
                        } else if (cmd.type === "PANIC_ROLLBACK") {
                            console.log(`🚨 EXECUTANT ROLLBACK A ${cmd.date || 'S/D'} per ${cmd.projectId || 'SISTEMA'}...`);
                            if (cmd.projectId) {
                                // Rollback individual
                                const proj = projectPaths.find(p => p.id === cmd.projectId);
                                if (proj) {
                                    const fullPath = path.join(projectsDir, proj.path);
                                    safeExec(`git reset --hard HEAD && git clean -fd`, fullPath);
                                }
                            } else {
                                // Rollback global
                                for (const proj of projectPaths) {
                                    const fullPath = path.join(projectsDir, proj.path);
                                    if (fs.existsSync(fullPath)) {
                                        safeExec(`git reset --hard HEAD && git clean -fd`, fullPath);
                                    }
                                }
                            }
                            await updateAllStatus(); // Forçar actualització d'estat d'emergència
                        }

                        await updateDoc(doc(db, "remote_commands", change.doc.id), { 
                            status: "completed", 
                            completedAt: serverTimestamp() 
                        });
                        console.log("✅ Ordre executada correctament.");
                    } catch (err) {
                        console.error("❌ Error processant ordre:", err);
                        await updateDoc(doc(db, "remote_commands", change.doc.id), { 
                            status: "failed", 
                            error: err.message 
                        });
                    }
                }
            }
        });
    });
}

async function syncAllRecoveryPoints() {
    console.log(`[${new Date().toLocaleTimeString()}] 🛡️ Sincronitzant punts de restauració de tots els projectes...`);
    
    for (const project of projectPaths) {
        const fullPath = path.join(projectsDir, project.path);
        if (fs.existsSync(fullPath)) {
            const log = safeExec('git log -n 3 --pretty=format:"%h|%ad|%s" --date=format:"%d/%m/%Y %H:%M"', fullPath);
            if (log) {
                const commits = log.split('\n').filter(l => l.trim()).map(line => {
                    const [hash, date, msg] = line.split('|');
                    return { hash, date, msg, projectName: project.id };
                });

                for (const c of commits) {
                    const id = `${project.id}_${c.hash}`;
                    try {
                        await setDoc(doc(db, 'recovery_points', id), {
                            ...c,
                            updatedAt: serverTimestamp()
                        }, { merge: true });
                    } catch (e) {
                        console.error(`❌ Error pujant punt de restauració per ${project.id}:`, e.message);
                    }
                }
            }
        }
    }
}

// Execució principal
async function start() {
    // 1. Primer sincronitzem tot una vegada en arrencar
    await updateAllStatus();
    await syncAllRecoveryPoints();
    
    // 2. Iniciem l'escolta en temps real d'ordres (Això SEMPRE és instantani)
    listenForCommands();
    
    // 3. Programem actualitzacions d'estat periòdiques (Cada 10 minuts: 600000ms)
    setInterval(updateAllStatus, 600000);
    
    // 4. Programem sincronització de punts de restauració (Cada 30 minuts)
    setInterval(syncAllRecoveryPoints, 1800000);
}

start().catch(console.error);


