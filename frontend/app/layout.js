// frontend/app/layout.js
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  metadataBase: new URL('https://madycloud.me'),

  title: {
    default: 'Mohammed Shoaib Makandar | Full Stack & DevOps Engineer',
    // template: '%s | MaDycloud',
  },

  description:
    'Official portfolio of Mohammed Shoaib Makandar (MaDycloud) — Full Stack & DevOps Engineer specialising in AWS, Kubernetes, Docker, Terraform, CI/CD, React.js, Next.js, Node.js, and Java. Based in Belagavi, Karnataka.',

  keywords: [
    // Identity
    'Mohammed Shoaib Makandar', 'Mohammed Shoaib M', 'Shoaib Makandar',
    'Shoaib M', 'MaDycloud', 'madycloud.me', 'teammadycloud', 'myselfmd', 'myselfmd07',
    // Roles
    'Full Stack Developer', 'DevOps Engineer', 'Cloud Engineer',
    'Software Engineer', 'Backend Engineer', 'SDE', 'SWE',
    // Tech
    'AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD',
    'React.js', 'Next.js', 'Node.js', 'Java', 'MERN Stack', 'REST API',
    // Location
    'Developer Belagavi', 'Developer Karnataka', 'Indian Software Engineer',
  ],

  authors:  [{ name: 'Mohammed Shoaib Makandar', url: 'https://madycloud.me' }],
  creator:  'Mohammed Shoaib Makandar',
  publisher: 'MaDycloud',

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },

  alternates: {
    canonical: 'https://madycloud.me',
  },

  // ── Icons (Next.js handles <link> injection — no duplicate <head> tags needed) ──
  icons: {
    icon: [
      { url: '/favicon.ico',       sizes: 'any' },
      { url: '/favicon.svg',       type: 'image/svg+xml' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
    ],
    apple:   [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    shortcut: '/favicon-96x96.png',
  },

  // ── PWA manifest ─────────────────────────────────────────────────────────────
  manifest: '/site.webmanifest',

  // ── OpenGraph ─────────────────────────────────────────────────────────────────
  openGraph: {
    title:       'Mohammed Shoaib Makandar | Full Stack & DevOps Engineer',
    description: 'Official portfolio of Mohammed Shoaib Makandar (MaDycloud) — Full Stack & DevOps Engineer specialising in AWS, Kubernetes, Docker, Terraform, CI/CD, React.js, Next.js, Node.js, and Java. Based in Belagavi, Karnataka.',
    url:         'https://madycloud.me',
    siteName:    'MaDycloud',
    locale:      'en_IN',
    type:        'website',
    images: [{
      url:    'https://madycloud.me/web-app-manifest-512x512.png',
      width:  512,
      height: 512,
      alt:    'Mohammed Shoaib Makandar — MaDycloud Portfolio',
    }],
  },

  // ── Twitter / X ───────────────────────────────────────────────────────────────
  twitter: {
    card:        'summary_large_image',
    title:       'Mohammed Shoaib Makandar | Full Stack & DevOps Engineer',
    description: 'Full Stack & DevOps Engineering Portfolio — MaDycloud',
    creator:     '@myselfmd07',
    images:      ['https://madycloud.me/web-app-manifest-512x512.png'],
  },

  // ── Verification ───────────────────────────────────────────────────────────────
  verification: {
    google: 'TO2jrHbyn3fi0nV1HJsY6o1P8e28t9gOg1bVA_x149Y', 
    // <meta name="google-site-verification" content="TO2jrHbyn3fi0nV1HJsY6o1P8e28t9gOg1bVA_x149Y" />
  },
};

export default function RootLayout({ children }) {
  const orgJsonLd = {
    '@context': 'https://schema.org',
    '@type':    'Organization',
    name:       'MaDycloud',
    url:        'https://madycloud.me',
    logo:       'https://madycloud.me/web-app-manifest-512x512.png',
    sameAs: [
      'https://www.linkedin.com/in/myselfmd/',
      'https://github.com/MaDycloud-MD',
      'https://x.com/myselfmd07',
    ],
  };

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type':    'Person',
    name:       'Mohammed Shoaib Makandar',
    alternateName: [
      'Mohammed Shoaib M', 'Shoaib Makandar', 'Shoaib M',
      'MaDycloud', 'madycloud.me', 'teammadycloud',
      'myself.md', 'myselfmd07', 'myselfmd',
    ],
    url:      'https://madycloud.me',
    image:    'https://madycloud.me/web-app-manifest-512x512.png',
    jobTitle: 'Full Stack & DevOps Engineer',
    worksFor: {
      '@type': 'Organization',
      name:    'MaDycloud',
      url:     'https://madycloud.me',
    },
    knowsAbout: [
      'Full Stack Development', 'DevOps', 'Cloud Engineering',
      'AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD',
      'React.js', 'Next.js', 'Node.js', 'Java', 'MERN Stack',
    ],
    address: {
      '@type':           'PostalAddress',
      addressLocality:   'Belagavi',
      addressRegion:     'Karnataka',
      addressCountry:    'IN',
    },
    sameAs: [
      'https://www.linkedin.com/in/myselfmd/',
      'https://github.com/MaDycloud-MD',
      'https://x.com/myselfmd07',
    ],
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <meta name="theme-color"              content="#facc15" />
        <meta name="msapplication-TileColor"  content="#0d1117" />
        <meta name="msapplication-TileImage"  content="/web-app-manifest-192x192.png" />
      </head>
      <body suppressHydrationWarning>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}