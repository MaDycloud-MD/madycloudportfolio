import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  metadataBase: new URL('https://madycloud.me'),
  title: 'Mohammed Shoaib Makandar (MaDycloud) | Full Stack & DevOps Engineer',
  description: 'Official portfolio of Mohammed Shoaib Makandar (Shoaib M). Explore my Full Stack, DevOps, AWS, Kubernetes, and Cloud Engineering projects at MaDycloud.',
  keywords: [
    // Identity & Brand
    'Mohammed Shoaib Makandar', 'Mohammed Shoaib M', 'Shoaib Makandar', 
    'Shoaib M', 'Shoaib', 'MaDycloud', 'madycloud.me', 'teammadycloud',
    
    // Cloud & DevOps (Core)
    'DevOps Engineer', 'Cloud Engineer', 'AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD',
    
    // SWE & SDE (Engineering & Architecture)
    'Software Engineer', 'Software Development Engineer', 'SWE', 'SDE', 'Backend Engineering', 'Java Developer',
    
    // Web Development (Full-Stack & Frameworks)
    'Full-Stack Developer', 'Web Development', 'React.js', 'Next.js', 'Node.js', 'MERN Stack', 'API Development'
  ],

  authors: [{ name: 'Mohammed Shoaib Makandar', url: 'https://madycloud.me' }],
  creator: 'Mohammed Shoaib Makandar',
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
    canonical: '/',
  },
  openGraph: {
    title: 'Mohammed Shoaib Makandar | Full Stack & DevOps Engineer (MaDycloud)',
    description: 'Building reliable cloud systems with AWS, Kubernetes, and modern DevOps tooling.',
    url: 'https://madycloud.me',
    siteName: 'MaDycloud',
    locale: 'en_IN', // Updated to India locale
    images: [{
      url: '/madycloud.png',
      width: 1200,
      height: 630,
      alt: 'Mohammed Shoaib Makandar - MaDycloud Portfolio',
    }],
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Mohammed Shoaib Makandar | DevOps Engineer',
    description: 'DevOps & Cloud Engineering Portfolio | MaDycloud',
    creator: '@myselfmd07', // Added X handle
    images: ['/madycloud.png'],
  },
};

export default function RootLayout({ children }) {
  // THE SCHEMA MARKUP: The ultimate SEO cheat code for personal branding
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    "name": "Mohammed Shoaib Makandar",
    // This tells Google: "If someone searches any of these, show MY site."
    "alternateName": [
      "Mohammed Shoaib M",
      "Shoaib Makandar",
      "Shoaib M",
      "Shoaib",
      "MaDycloud",
      "myself.md",
      "myselfmd07",
      "myselfmd",
    ],
    "url": "https://madycloud.me",
    "jobTitle": "DevOps & Cloud Engineer",
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Belagavi",
      "addressRegion": "Karnataka",
      "addressCountry": "IN"
    },
    // This connects portfolio authority to social authority
    "sameAs": [
      "https://www.linkedin.com/in/myselfmd/",
      "https://github.com/MaDycloud-MD",
      "https://x.com/myselfmd07"
    ]
  };

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Injecting the JSON-LD script */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}