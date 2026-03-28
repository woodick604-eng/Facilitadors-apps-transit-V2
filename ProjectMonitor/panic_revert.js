const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectsDir = "/Users/alex/Documents/";
const projectPaths = [
    "Facilitador apps transit/Facilitadors-apps-transit",
    "Dictat Atenea App/Dictat-Atenea",
    "Reducto reanomenador i classificador de fotos/processador-d-imatges-d-informes-d-accidents",
    "urivi-analitzador-de-fotos-d'accidents-forense-vector-5085",
    "simptomatologia/Actes-o-oficis",
    "dictation app/dictation-app-main"
];

const targetDate = process.argv[2]; // Esperat: YYYY-MM-DD

if (!targetDate) {
    console.error("❌ Has d'especificar una data. Exemple: node panic_revert.js 2026-03-25");
    process.exit(1);
}

console.log(`🚨 INICIANT BOTÓ DEL PÀNIC: REVERTINT TOTES LES APPS A LA DATA: ${targetDate}`);

projectPaths.forEach(relPath => {
    const fullPath = path.join(projectsDir, relPath);
    if (!fs.existsSync(fullPath)) {
        console.log(`⚠️ Saltant ${relPath} (no trobat)`);
        return;
    }

    try {
        console.log(`📦 Processant ${relPath}...`);
        
        // 1. Trobar el commit més proper a la data abans de les 23:59:59 d'aquell dia
        const commitHash = execSync(`git -C "${fullPath}" rev-list -n 1 --before="${targetDate} 23:59:59" master || git -C "${fullPath}" rev-list -n 1 --before="${targetDate} 23:59:59" main`, { encoding: 'utf8' }).trim();
        
        if (!commitHash) {
            console.log(`❓ No s'han trobat commits abans de ${targetDate} per a aquest projecte.`);
            return;
        }

        console.log(`🔄 Revertint a commit: ${commitHash}`);
        
        // 2. Fer el reset hard (atenció: es perd tot el que no s'ha commitejat!)
        execSync(`git -C "${fullPath}" reset --hard ${commitHash}`, { stdio: 'inherit' });
        
        // 3. Netejar fitxers brossa
        execSync(`git -C "${fullPath}" clean -fd`, { stdio: 'inherit' });

        console.log(`✅ ${relPath} restaurat correctament.`);
    } catch (e) {
        console.error(`❌ Error restaurant ${relPath}: ${e.message}`);
    }
});

console.log("\n✨ OPERACIÓ DE RESCAT FINALITZADA.");
console.log("Recorda fer un 'npm install' si cal en les carpetes que hagin canviat dependències.");
