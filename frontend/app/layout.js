// frontend/app/layout.js
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  metadataBase: new URL('https://madycloud.me'),
  title: 'Mohammed Shoaib Makandar (MaDycloud) | Full Stack & DevOps Engineer',
  description: 'Official portfolio of Mohammed Shoaib Makandar (Shoaib M). Explore my Full Stack, DevOps, AWS, Kubernetes, and Cloud Engineering projects at MaDycloud.',
  keywords: [
    'Mohammed Shoaib Makandar', 'Mohammed Shoaib M', 'Shoaib Makandar',
    'Shoaib M', 'Shoaib', 'MaDycloud', 'madycloud.me', 'teammadycloud',
    'DevOps Engineer', 'Cloud Engineer', 'AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD',
    'Software Engineer', 'Software Development Engineer', 'SWE', 'SDE', 'Backend Engineering', 'Java Developer',
    'Full-Stack Developer', 'Web Development', 'React.js', 'Next.js', 'Node.js', 'MERN Stack', 'API Development',
  ],
  authors:  [{ name: 'Mohammed Shoaib Makandar', url: 'https://madycloud.me' }],
  creator:  'Mohammed Shoaib Makandar',
  robots: {
    index: true, follow: true,
    googleBot: {
      index: true, follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: { canonical: '/' },

  // ── Icons — every platform covered ──────────────────────────────────────
  icons: {
    // Browser tab favicon
    icon: [
      { url: '/favicon.ico',       sizes: 'any' },          // legacy browsers
      { url: '/favicon.svg',       type: 'image/svg+xml' }, // modern browsers (scales perfectly)
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    // Apple devices (iOS home screen, iPad, Safari tab)
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    // Android / PWA shortcut icon
    shortcut: '/favicon-96x96.png',
  },

  // ── PWA manifest ─────────────────────────────────────────────────────────
  manifest: '/site.webmanifest',

  // ── OpenGraph (Facebook, LinkedIn, WhatsApp, Telegram previews) ──────────
  openGraph: {
    title:       'Mohammed Shoaib Makandar | Full Stack & DevOps Engineer (MaDycloud)',
    description: 'Building reliable cloud systems with MERN, AWS, Kubernetes, and modern DevOps tooling.',
    url:         'https://madycloud.me',
    siteName:    'MaDycloud',
    locale:      'en_IN',
    images: [{
      url:    '/web-app-manifest-512x512.png', // high-res for OG
      width:  512,
      height: 512,
      alt:    'Mohammed Shoaib Makandar - MaDycloud Portfolio',
    }],
    type: 'website',
  },

  // ── Twitter/X card ───────────────────────────────────────────────────────
  twitter: {
    card:        'summary_large_image',
    title:       'Mohammed Shoaib Makandar | Full Stack & DevOps Engineer',
    description: 'Full Stack & DevOps Engineering Portfolio | MaDycloud',
    creator:     '@myselfmd07',
    images:      ['/web-app-manifest-512x512.png'],
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    'name': 'Mohammed Shoaib Makandar',
    'alternateName': [
      'Mohammed Shoaib M', 'Mohammed Shoaib. Makandar', 'Shoaib Makandar', 'Shoaib M', 'Shoaib', 
      'MaDycloud', 'madycloud', 'teammadycloud',
      'myself.md', 'myselfmd07', 'myselfmd',
    ],
    'url':      'https://madycloud.me',
    'image':    'https://madycloud.me/web-app-manifest-512x512.png',
    'jobTitle': 'Full Stack & DevOps Engineer',
    'address': {
      '@type':           'PostalAddress',
      'addressLocality': 'Belagavi',
      'addressRegion':   'Karnataka',
      'addressCountry':  'IN',
    },
    'sameAs': [
      'https://www.linkedin.com/in/myselfmd/',
      'https://github.com/MaDycloud-MD',
      'https://x.com/myselfmd07',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured data for Google Knowledge Panel */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {/* Explicit favicon tags — belt AND suspenders approach */}
        <link rel="icon"             href="/favicon.ico"            sizes="any" />
        <link rel="icon"             href="/favicon.svg"            type="image/svg+xml" />
        <link rel="icon"             href="/favicon-96x96.png"      type="image/png" sizes="96x96" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png"   sizes="180x180" />
        <link rel="manifest"         href="/site.webmanifest" />
        <meta name="theme-color"     content="#facc15" />
        <meta name="msapplication-TileColor" content="#0d1117" />
        <meta name="msapplication-TileImage" content="/web-app-manifest-192x192.png" />
      </head>
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}