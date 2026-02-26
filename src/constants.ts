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
    title: 'Dictat d\'Accidents de Trànsit',
    description: 'Eina de dictat per veu per a la redacció ràpida d\'informes d\'accidents.',
    url: 'https://accidents-evolucio-t-06-atenea-414823545629.us-west1.run.app/',
    icon: Mic,
    category: 'dictat',
    status: 'online',
    code: 'DAT-01'
  },
  {
    id: 'renombrador-manual',
    title: 'Reanomenador de Fotografies (Manual)',
    description: 'Eina per al reanomenament manual i organització de fotografies de camp.',
    url: 'https://processador-imatges-accidents.web.app/',
    icon: Image,
    category: 'imatges',
    status: 'online',
    code: 'RF-02'
  },
  {
    id: 'renombrador-auto',
    title: 'Reanomenador de Fotografies (Auto)',
    description: 'Plataforma per reduir i reanomenar fotos de forma totalment automàtica.',
    url: 'https://atenea-fotos.web.app/',
    icon: Image,
    category: 'imatges',
    status: 'online',
    code: 'RFA-03'
  },
  {
    id: 'informe-auto',
    title: 'Informe Fotogràfic Automàtic',
    description: 'Generador automàtic d\'informes fotogràfics tècnics.',
    url: 'https://infofoto-vector-art.web.app/',
    icon: NotebookPen,
    category: 'imatges',
    status: 'online',
    code: 'IFA-04'
  },
  {
    id: 'gestor-casos',
    title: 'Simptomatologia DGT',
    description: 'Simptomatologia compatible orientativa segons DGT. Correlació extrema de taxa d\'alcohol, pes i altura basada en estudis oficials de la DGT.',
    url: 'https://simptomatologia-compatible-amb-la-taxa-segons-la-1000896180499.us-west1.run.app',
    icon: ClipboardList,
    category: 'gestio',
    status: 'online',
    code: 'GC-05'
  },
  {
    id: 'minutes',
    title: 'Dictar Minutes',
    description: 'Gestió i redacció de minutes policials mitjançant dictat per veu.',
    url: 'https://dictat-policial-ia-1039421696609.us-west1.run.app/',
    icon: Mic,
    category: 'gestio',
    status: 'online',
    code: 'MIN-06'
  }
];
