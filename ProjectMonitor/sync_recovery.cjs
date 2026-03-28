const { execSync } = require('child_process');
const { initializeApp } = require('firebase/app');
const { getFirestore, collection, addDoc, getDocs, deleteDoc, query } = require('firebase/firestore');

const firebaseConfig = {
    apiKey: "AIzaSyByZ75L4F1c9r_rL_C3k_vJpS7XpXpXX0",
    authDomain: "facilitadors-transit.firebaseapp.com",
    projectId: "facilitadors-transit",
    storageBucket: "facilitadors-transit.firebasestorage.app",
    messagingSenderId: "719513203160",
    appId: "1:719513203160:web:a68fc25fd89a8beaa882ad"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function syncRecoveryPoints() {
    try {
        console.log("Cercant punts de retorn estables...");
        const log = execSync('git log -n 10 --pretty=format:"%h|%ad|%s" --date=format:"%d/%m/%Y %H:%M"').toString();
        const commits = log.split('\n').filter(l => l.trim()).map(line => {
            const [hash, date, msg] = line.split('|');
            return { hash, date, msg };
        });

        const colRef = collection(db, 'recovery_points');
        const snapshot = await getDocs(colRef);
        for (const doc of snapshot.docs) {
            await deleteDoc(doc.ref);
        }

        for (const c of commits) {
            await addDoc(colRef, {
                hash: c.hash,
                date: c.date,
                msg: c.msg,
                description: traduirMissatge(c.msg)
            });
        }
        console.log("Punts de retorn actualitzat.");
        process.exit(0);
    } catch (error) {
        console.error("Error sincronitzant punts:", error);
        process.exit(1);
    }
}

function traduirMissatge(msg) {
    if (msg.includes('deploy')) return 'Publicació a la web';
    if (msg.includes('fix')) return 'Correcció d\'errors';
    if (msg.includes('feat') || msg.includes('add')) return 'Nova funció';
    return msg;
}

syncRecoveryPoints();
