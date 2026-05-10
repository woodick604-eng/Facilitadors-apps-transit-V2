import {
  MicVocal,
  Images,
  Camera,
  FileImage,
  FolderSearch,
  FileAudio,
  Monitor,
  Scale,
  Database
} from 'lucide-react';

export const MOSSOS_THEME = {
  primary: '#003366', // Blau fosc Mossos
  secondary: '#005599', // Blau clar Mossos
  accent: '#CC0000', // Vermell Mossos
  background: '#F8FAFC',
  text: '#1E293B'
};

export interface AppLink {
  id: string;
  title: string;
  description: string;
  url: string;
  icon: any;
  category: 'dictat' | 'imatges' | 'gestio' | 'admin';
  status: 'online' | 'offline' | 'maintenance';
  code: string;
  maintenanceMsg?: string;
  adminOnly?: boolean; // Si true, només es mostra a usuaris amb isAdmin
}

export const APP_LINKS: AppLink[] = [
  {
    id: 'dictat-accidents',
    title: '1. Dictat d\'Accidents de Trànsit',
    description: 'Eina de dictat per veu per a la redacció ràpida d\'informes d\'accidents.',
    url: 'https://dictat-atenea-t06.web.app/',
    icon: MicVocal,
    category: 'dictat',
    status: 'online',
    code: 'DAT-01'
  },
  {
    id: 'renombrador-manual',
    title: '2. Reanomenador de Fotografies (Manual) (PER ATENEA)',
    description: 'Eina per reduir, reanomenar manualment i organitzar fotografies de camp.',
    url: 'https://processador-imatges-accidents.web.app/',
    icon: Images,
    category: 'imatges',
    status: 'online',
    code: 'RF-02'
  },
  {
    id: 'informe-atenea',
    title: '3. Informe fotogràfic (ATENEA i URIVI)',
    description: 'Per enviar a Jutjats (p.ex. T32+T06) o informes de Transports. (Triga una mica a obrir-se)',
    url: 'https://infofoto-vector-art.web.app/',
    icon: FileImage,
    category: 'imatges',
    status: 'online',
    code: 'IFA-03'
  },
  {
    id: 'informe-vector',
    title: '4. Acta de Signes Externs de Drogues',
    description: 'Eina de nova generació per a la redacció de l\'acta de signes externs de drogues.',
    url: 'https://la4-sintomatologia-actes.web.app/',
    icon: FileImage,
    category: 'imatges',
    status: 'online',
    code: 'IFA-04'
  },
  {
    id: 'gestor-casos',
    title: '5. Simptomatologia, Alcoholemia i A-21\n(SIGNES EXTERNS) DGT',
    description: 'Simptomatologia compatible segons DGT. Permet dictar o escriure les observacions i el sistema integra tota la informació automàticament.',
    url: 'https://simptomatologia.web.app/',
    icon: FolderSearch,
    category: 'gestio',
    status: 'online',
    code: 'GC-05'
  },
  {
    id: 'minutes',
    title: '6. Dictar Minutes / Diligència d\'Informe T-32',
    description: 'Eina de gestió i dictat, a format policial cronològic i oficial.',
    url: 'https://dictat-minutes.web.app/',
    icon: FileAudio,
    category: 'gestio',
    status: 'online',
    code: 'MIN-06'
  },
  {
    id: 'interpretador-veco',
    title: '7. Interpretador de Pantalles Veco',
    description: 'Eina per a la interpretació de dades de pantalles Veco.',
    url: 'https://atenea-veco-001.web.app',
    icon: Monitor,
    category: 'gestio',
    status: 'maintenance',
    code: 'VECO-07',
    maintenanceMsg: 'Aquesta eina està actualment en fase de construcció.'
  },
  {
    id: 'a76-penal-administrativa',
    title: '8. A-76 Penal o Administrativa',
    description: 'Diagrama de flux interactiu de 5 passos per qualificar com a penal o administrativa una conducta de drogues al volant.',
    url: 'https://a76-qualificacio.web.app/',
    icon: Scale,
    category: 'gestio',
    status: 'online',
    code: 'PEN-08'
  },
  {
    id: 'la19-backup-admin',
    title: '19. Backup Intel·ligent (ADMIN)',
    description: 'Snapshots automàtics i restauració selectiva del Firestore (RAG + minutes). Eina exclusiva de manteniment per a @5085.',
    url: 'https://la19-backup-admin.web.app/',
    icon: Database,
    category: 'admin',
    status: 'online',
    code: 'ADM-19',
    adminOnly: true
  }
];
