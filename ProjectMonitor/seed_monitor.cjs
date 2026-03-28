const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Compte amb les credencials: com que estic al workspace de l'usuari, 
// intentaré fer servir la configuració local de firebase si és possible, 
// o un script que injecti les dades via l'SDK de client.

const PROJECTS_INFO = {
  'facilitador': { status: 'online', branch: 'main', lastCommit: 'Mar 28 19:40' },
  'dictat-atenea': { status: 'online', branch: 'main', lastCommit: 'Mar 27 22:15' },
  'reanomenador': { status: 'online', branch: 'main', lastCommit: 'Mar 26 14:30' },
  'informe-vector': { status: 'online', branch: 'main', lastCommit: 'Mar 28 10:10' },
  'informe-atenea': { status: 'online', branch: 'main', lastCommit: 'Mar 28 11:20' },
  'simptomatologia': { status: 'online', branch: 'main', lastCommit: 'Mar 25 09:45' },
  'dictat-minutes': { status: 'online', branch: 'main', lastCommit: 'Mar 28 08:30' }
};

async function seed() {
    // Com que no tinc el service-account.json, faré servir el sync_status.js existent 
    // per forçar una actualització inicial de dades.
    console.log("Iniciant llavor de dades per al Monitor...");
}

seed();
