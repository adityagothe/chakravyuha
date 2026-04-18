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
  coverImage: { src: '/images/Udharo-cover.png', alt: 'Udharo app cover', width: 1200, height: 630 },
  screenshots: [
    { image: { src: '/images/u (1).jpeg', alt: 'Udharo Screenshot 1' }, gridSpan: 1, gridRowSpan: 1, caption: 'Home' },
    { image: { src: '/images/u (2).jpeg', alt: 'Udharo Screenshot 2' }, gridSpan: 1, gridRowSpan: 1, caption: 'Add Udhar' },
    { image: { src: '/images/u (3).jpeg', alt: 'Udharo Screenshot 3' }, gridSpan: 1, gridRowSpan: 1, caption: 'Balances' },
    { image: { src: '/images/u (4).jpeg', alt: 'Udharo Screenshot 4' }, gridSpan: 1, gridRowSpan: 1, caption: 'Contact' },
    { image: { src: '/images/u (5).jpeg', alt: 'Udharo Screenshot 5' }, gridSpan: 1, gridRowSpan: 1, caption: 'Transactions' },
    { image: { src: '/images/u (6).jpeg', alt: 'Udharo Screenshot 6' }, gridSpan: 1, gridRowSpan: 1, caption: 'Settings' },
    { image: { src: '/images/u (7).jpeg', alt: 'Udharo Screenshot 7' }, gridSpan: 1, gridRowSpan: 1, caption: 'History' },
    { image: { src: '/images/u (8).jpeg', alt: 'Udharo Screenshot 8' }, gridSpan: 1, gridRowSpan: 1, caption: 'Settle Up' },
    { image: { src: '/images/u (9).jpeg', alt: 'Udharo Screenshot 9' }, gridSpan: 1, gridRowSpan: 1, caption: 'Summary' },
    { image: { src: '/images/u (10).jpeg', alt: 'Udharo Screenshot 10' }, gridSpan: 1, gridRowSpan: 1, caption: 'Profile' },
  ],
  screenshotOrientation: 'portrait',
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
    apkUrl: 'https://github.com/adityagothe/chakravyuha/releases/download/Udharo-v1.1.0/application-2b43f2ce-4aab-4061-b6c5-96a58ac73b07.apk',
    githubReleaseUrl: 'https://github.com/adityagothe/chakravyuha/releases/tag/Udharo-v1.1.0',
    sourceCodeUrl: 'https://github.com/adityagothe/chakravyuha',
    version: '1.1.0',
    versionCode: 2,
    releaseDate: '2026-04-17T00:00:00Z',
    releaseNotes: '• Added contact profile pictures\n• Introduced dedicated Udharo logo icon\n• Voice recording playback\n• Transaction sound feedback',
    fileSize: undefined,
    minAndroidVersion: 'Android 8.0+',
    sha256Checksum: 'c1baab36a1c5bd3fea19755696be277793738baaa9187227fd89974ba49e4247',
  },
  techStack: ['React Native', 'Expo', 'SQLite'],
  createdAt: '2026-04-16T00:00:00Z',
  updatedAt: '2026-04-17T00:00:00Z',
  sortOrder: 3,
  metaTitle: 'Udharo — Track Udhar. No Confusion.',
  metaDescription:
    'Udharo is a simple money tracker for India. Track who owes what, split expenses, and settle up — instantly and effortlessly.',
};
