import {
  Mic,
  Image,
  NotebookPen,
  ClipboardList,
  Zap,
  FolderSearch,
  ExternalLink
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
  category: 'dictat' | 'imatges' | 'gestio';
  status: 'online' | 'offline' | 'maintenance';
  code: string;
}

export const APP_LINKS: AppLink[] = [
  {
    id: 'dictat-accidents',
    title: '1. Dictat d\'Accidents de Trànsit',
    description: 'Eina de dictat per veu per a la redacció ràpida d\'informes d\'accidents.',
    url: 'https://dictat-atenea-t06.web.app/',
    icon: Mic,
    category: 'dictat',
    status: 'online',
    code: 'DAT-01'
  },
  {
    id: 'renombrador-manual',
    title: '2. Reanomenador de Fotografies (Manual) (PER ATENEA)',
    description: 'Eina per reduir, reanomenar manualment i organitzar fotografies de camp.',
    url: 'https://processador-imatges-accidents.web.app/',
    icon: Image,
    category: 'imatges',
    status: 'online',
    code: 'RF-02'
  },
  {
    id: 'renombrador-auto',
    title: '3. Reanomenador de Fotografies (Auto) (PER ATENEA)',
    description: 'Plataforma per reduir i reanomenar fotos de forma totalment automàtica.',
    url: 'https://atenea-fotos.web.app/',
    icon: Image,
    category: 'imatges',
    status: 'online',
    code: 'RFA-03'
  },
  {
    id: 'informe-auto',
    title: '4. Informe Fotogràfic Automàtic (PER JUTJATS o D\'ALTRES)',
    description: 'Generador automàtic d\'informes fotogràfics tècnics. (Triga una mica a obrir-se)',
    url: 'https://infofoto-vector-art.web.app/',
    icon: NotebookPen,
    category: 'imatges',
    status: 'online',
    code: 'IFA-04'
  },
  {
    id: 'gestor-casos',
    title: '5. Simptomatologia DGT',
    description: 'Simptomatologia compatible segons DGT. Permet dictar o escriure les observacions i el sistema integra tota la informació automàticament.',
    url: 'https://simptomatologia.web.app/',
    icon: ClipboardList,
    category: 'gestio',
    status: 'online',
    code: 'GC-05'
  },
  {
    id: 'minutes',
    title: '6. Dictar Minutes / Diligència d\'Informe T-32',
    description: 'Eina de gestió i dictat, a format policial cronològic i oficial.',
    url: 'https://dictat-minutes.web.app/',
    icon: Mic,
    category: 'gestio',
    status: 'online',
    code: 'MIN-06'
  }
];
