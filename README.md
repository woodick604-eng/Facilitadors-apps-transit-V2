# Facilitador per Patrulles i Atenea

**Versió:** 2.45.0  
**Autor:** @5085  
**Data de creació:** 26/02/2026  
**Darrera actualització:** 26/04/2026  

---

## Descripció

Plataforma centralitzada (hub facilitador) per a la gestió d'atenees i informes fotogràfics destinada a agents de patrulla. Actua com a punt d'accés unificat a un conjunt de 7 aplicacions especialitzades per al treball policial de trànsit.

Inclou sistema d'autenticació per TIP i PIN, dashboard d'administrador, gestió d'estats d'aplicacions en temps real, sistema de dictats amb IA (Google Gemini), registre d'accions i control d'accés per rol.

---

## Les 7 aplicacions

| Codi | Títol | Descripció |
|------|-------|------------|
| DAT-01 | Dictat d'Accidents de Trànsit | Eina de dictat per veu per a la redacció ràpida d'informes d'accidents. |
| RF-02 | Reanomenador de Fotografies (Manual) | Eina per reduir, reanomenar manualment i organitzar fotografies de camp per a Atenea. |
| IFA-03 | Informe Fotogràfic (Atenea i URIVI) | Generació d'informes fotogràfics per a jutjats (p.ex. T32+T06) o informes de Transports. |
| IFA-04 | Acta de Signes Externs de Drogues | Eina per a la redacció de l'acta de signes externs de drogues. |
| GC-05 | Simptomatologia, Alcoholèmia i A-21 | Simptomatologia compatible segons DGT amb integració automàtica d'observacions. |
| MIN-06 | Dictar Minutes / Diligència d'Informe T-32 | Eina de gestió i dictat a format policial cronològic i oficial. |
| VECO-07 | Interpretador de Pantalles Veco | Eina per a la interpretació de dades de pantalles Veco. *(En construcció)* |

---

## Tecnologies

- **Frontend:** React 19 + TypeScript, Vite 6, Tailwind CSS
- **Backend / Base de dades:** Firebase / Firestore (Google Cloud)
- **IA:** Google Generative AI (Gemini) — ús exclusiu via API de pagament
- **Desplegament:** Firebase Hosting

---

## Requisits previs

- Node.js (v18 o superior)
- Compte Firebase amb accés al projecte
- Clau d'API de Google Gemini

---

## Instal·lació i execució local

```bash
# 1. Instal·lar dependències
npm install

# 2. Configurar variables d'entorn
cp .env.example .env.local
# Editar .env.local i afegir les claus d'API

# 3. Executar en mode desenvolupament
npm run dev

# 4. Compilar per a producció
npm run build
```

---

## Estructura del projecte

```
LA 0/
├── src/
│   ├── App.tsx          # Component principal i hub de les 7 apps
│   ├── constants.ts     # Configuració i metadades de les apps
│   ├── firebase.ts      # Inicialització de Firebase
│   ├── users.ts         # Gestió d'usuaris i autenticació
│   └── index.css        # Estils globals
├── ProjectMonitor/      # Eina de monitoratge de l'estat del projecte
├── AUTHOR.md            # Fitxer d'autoria (propietat intel·lectual)
├── LICENSE              # Llicència propietària — tots els drets reservats
└── PRIVACY.md           # Política de privacitat i protecció de dades (RGPD)
```

---

## Nota legal

**Tots els drets reservats.** Aquest programari és obra original de l'autor i es troba protegit per la Llei de Propietat Intel·lectual (Reial Decret Legislatiu 1/1996). Queda prohibida la reproducció, distribució o modificació sense autorització expressa i per escrit de l'autor.

Per a qualsevol consulta: aadsuarg@gmail.com
