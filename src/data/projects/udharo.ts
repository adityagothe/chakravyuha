import { Project } from '@/types/project';

export const udharo: Project = {
  id: '03',
  name: 'Udharo',
  slug: 'udharo',
  tagline: 'Track every rupee. No confusion. No awkwardness.',
  description:
    'Udharo is a simple, fast money tracker built for the Indian udhar culture. Track who owes what among friends, students, and small shops — no spreadsheets, no awkward chats.',
  status: 'live',
  category: 'app',
  platforms: ['android'],
  categoryLabel: 'Money Tracker',
  coverImage: null,
  screenshots: [],
  icon: null,
  colorAccent: '#22c55e',
  features: [
    {
      icon: 'bolt',
      title: 'Instant Add',
      description:
        'Record any transaction in seconds. Name, amount, done. No account setup, no login friction.',
      sortOrder: 1,
    },
    {
      icon: 'account_balance_wallet',
      title: 'Clean Ledger View',
      description:
        'See exactly who owes you and what you owe — in one clean, scrollable screen. No confusion.',
      sortOrder: 2,
    },
    {
      icon: 'handshake',
      title: 'Settle Up Easily',
      description:
        'Mark debts as settled with a single tap. Keep history clean. Stay tension-free.',
      sortOrder: 3,
    },
    {
      icon: 'offline_bolt',
      title: 'Lightweight & Fast',
      description:
        'Runs fully offline. No internet, no account. Opens instantly and gets out of your way.',
      sortOrder: 4,
    },
  ],
  downloads: {
    apkUrl: 'https://github.com/adityagothe/chakravyuha/releases/download/v1.0.0/application-4a860db4ce635157744e372ef88a745d07765c36e3b07821185fb20e0b0fd192.apk',
    githubReleaseUrl: 'https://github.com/adityagothe/chakravyuha/releases/tag/v1.0.0',
    sourceCodeUrl: 'https://github.com/adityagothe/chakravyuha',
    version: '1.0.0',
    versionCode: 1,
    releaseDate: '2026-04-16T00:00:00Z',
    releaseNotes: '• Initial release — The First Ledger\n• Instant transaction recording\n• Clean ledger view\n• Settle up with one tap',
    fileSize: undefined,
    minAndroidVersion: 'Android 8.0+',
    sha256Checksum: '4a860db4ce635157744e372ef88a745d07765c36e3b07821185fb20e0b0fd192',
  },
  techStack: ['React Native', 'Expo', 'SQLite'],
  createdAt: '2026-04-16T00:00:00Z',
  updatedAt: '2026-04-16T00:00:00Z',
  sortOrder: 3,
  metaTitle: 'Udharo — Track Udhar. No Confusion.',
  metaDescription:
    'Udharo is a simple money tracker for India. Track who owes what, split expenses, and settle up — instantly and effortlessly.',
};
