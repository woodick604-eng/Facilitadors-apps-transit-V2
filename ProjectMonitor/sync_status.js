import { initializeApp } from 'firebase/app';
import { 
    getFirestore, collection, onSnapshot, query, where, orderBy, 
    addDoc, doc, updateDoc, setDoc, serverTimestamp, getDocs 
} from 'firebase/firestore';
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
    { id: 'informe-atenea', path: "infofoto atenea" },
    { id: 'informe-vector', path: "infofoto urivi 3" },
    { id: 'simptomatologia', path: "simptomatologia/Actes-o-oficis" },
    { id: 'dictat-minutes', path: "dictation app/dictation-app-main" }
];

console.log("🚀 INICIANT MONITOR D'ADMINISTRACIÓ (DAEMON)...");

let isUpdating = false;

function cleanGitLock(repoPath) {
    const lockPath = path.join(repoPath, '.git', 'index.lock');
    if (fs.existsSync(lockPath)) {
        try {
            fs.unlinkSync(lockPath);
            console.log(`   🛠️  Netejat index.lock residual a ${repoPath}`);
        } catch (e) {
            console.error(`   ❌ No s'ha pogut eliminar el lock a ${repoPath}:`, e.message);
        }
    }
}

function safeExec(cmd, cwd) {
    try {
        return execSync(cmd, { cwd, encoding: 'utf8', timeout: 5000 }).trim();
    } catch (e) {
        return null;
    }
}

async function updateAllStatus() {
    if (isUpdating) return;
    isUpdating = true;
    console.log(`[${new Date().toLocaleTimeString()}] 🔄 Sincronitzant estat dels projectes...`);
    
    for (const project of projectPaths) {
        let data = { id: project.id, status: 'offline', updatedAt: serverTimestamp() };
        const fullPath = path.join(projectsDir, project.path);
        
        if (fs.existsSync(fullPath)) {
            cleanGitLock(fullPath);
            data.status = 'online';
            data.branch = safeExec(`git rev-parse --abbrev-ref HEAD`, fullPath) || 'main';
            data.lastCommit = safeExec('git log -1 --format=%cr', fullPath) || 'Recent';
            const statusStr = safeExec(`git status --porcelain`, fullPath);
            data.hasUncommited = statusStr ? statusStr.length > 0 : false;
        }

        try {
            await setDoc(doc(db, 'system_status', project.id), data, { merge: true });
        } catch (e) {
            console.error(`❌ Error actualitzant Firestore per ${project.id}:`, e.message);
        }
    }
    isUpdating = false;
}

async function listenForCommands() {
    console.log("📡 Escoltant ordres del Dashboard (remote_commands)...");
    const startTime = Date.now();
    console.log(`🛡️ MODE SEGUR: Només s'executaran ordres creades després de: ${new Date().toLocaleTimeString()}`);

    const q = query(collection(db, "remote_commands"), where("status", "==", "pending"));
    
    onSnapshot(q, async (snapshot) => {
        for (const change of snapshot.docChanges()) {
            if (change.type === "added") {
                const cmd = change.doc.data();
                const cmdTime = cmd.time ? new Date(cmd.time).getTime() : 0;
                
                if (cmdTime > startTime) {
                    console.log(`⚡ ORDRE REBUDA (@${new Date(cmdTime).toLocaleTimeString()}): ${cmd.type}`);
                    
                    try {
                        if (cmd.type === "SEGELLAR_GIT") {
                            const ref = cmd.ref || "SENSE_REF";
                            console.log(`🛡️ Segellant tots els projectes amb Ref: ${ref} (Git Commit)...`);
                            isUpdating = true;
                            for (const proj of projectPaths) {
                                const fullPath = path.join(projectsDir, proj.path);
                                if (fs.existsSync(fullPath)) {
                                    console.log(`   📦 Commitejant ${proj.id} [${ref}]...`);
                                    cleanGitLock(fullPath);
                                    safeExec(`git add . && git commit -m "Segellat Global [REF: ${ref}]: ${new Date().toISOString()}" || echo "Res"`, fullPath);
                                }
                            }
                            isUpdating = false;
                            await updateAllStatus();
                        } else if (cmd.type === "SEGELLAR_GIT_INDIVIDUAL" && cmd.projectId) {
                            const ref = cmd.ref || "SENSE_REF";
                            console.log(`🛡️ Segellant projecte individual ${cmd.projectId} amb Ref: ${ref}`);
                            const proj = projectPaths.find(p => p.id === cmd.projectId);
                            if (proj) {
                                const fullPath = path.join(projectsDir, proj.path);
                                cleanGitLock(fullPath);
                                safeExec(`git add . && git commit -m "Segellat Individual [APP: ${cmd.projectId}] [REF: ${ref}]: ${new Date().toISOString()}" || echo "Res"`, fullPath);
                            }
                            await updateAllStatus();
                        } else if (cmd.type === "OPEN_PROJECT" && cmd.projectId) {
                            console.log(`📂 Obrint carpeta del projecte: ${cmd.projectId}`);
                            const proj = projectPaths.find(p => p.id === cmd.projectId);
                            if (proj) {
                                safeExec(`open "${path.join(projectsDir, proj.path)}"`);
                            }
                        } else if (cmd.type === "CREATE_CHECKPOINT") {
                            const ref = cmd.ref || "SENSE_REF";
                            console.log(`🛡️ CREANT CHECKPOINT SEGUR [REF: ${ref}]: ${cmd.msg}`);
                            isUpdating = true;
                            const tag = `checkpoint-${new Date().toISOString().replace(/[:.]/g, '-').slice(0, 16)}`;
                            for (const proj of projectPaths) {
                                const fullPath = path.join(projectsDir, proj.path);
                                if (fs.existsSync(fullPath)) {
                                    cleanGitLock(fullPath);
                                    safeExec(`git add . && git commit -m "CHECKPOINT [REF: ${ref}]: ${cmd.msg}" && git tag ${tag}`, fullPath);
                                }
                            }
                            isUpdating = false;
                            await updateAllStatus();
                        } else if (cmd.type === "PANIC_ROLLBACK") {
                            console.log(`🚫 INTENT DE ROLLBACK BLOQUEJAT: La norma estricta impedeix la recuperació des del Hub. Destí: ${cmd.hash || cmd.date || 'HEAD'}`);
                            throw new Error("Recuperació bloquejada per política de seguretat. Contacti amb Antigravity.");
                        }

                        await updateDoc(doc(db, "remote_commands", change.doc.id), { status: 'completed', completedAt: serverTimestamp() });
                        console.log("✅ Ordre executada correctament.");
                    } catch (err) {
                        console.error("❌ Error processant ordre:", err);
                        await updateDoc(doc(db, "remote_commands", change.doc.id), { status: 'error', error: err.message });
                    }
                }
            }
        }
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


