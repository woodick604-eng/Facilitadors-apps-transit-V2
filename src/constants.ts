import {
  MicVocal,
  Images,
  Camera,
  FileImage,
  FolderSearch,
  FileAudio
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
    title: '3. Informe fotogràfic (NOMÉS PER ATENEA)',
    description: 'Per enviar a Jutjats (p.ex. T32+T06) o informes de Transports. (Triga una mica a obrir-se)',
    url: 'https://infofoto-vector-art.web.app/',
    icon: FileImage,
    category: 'imatges',
    status: 'online',
    code: 'IFA-03'
  },
  {
    id: 'informe-vector',
    title: '4. Informe fotogràfic automàtic (NOMÉS PER A VECTOR)',
    description: 'Per adjuntar a Atestats. (Triga una mica a obrir-se)',
    url: 'https://infofoto-urivi-3-service-177830712484.europe-west1.run.app/',
    icon: FileImage,
    category: 'imatges',
    status: 'online',
    code: 'IFA-04'
  },
  {
    id: 'gestor-casos',
    title: '5. Simptomatologia\n(SIGNES EXTERNS) DGT',
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
  }
];
