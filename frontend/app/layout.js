import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  metadataBase: new URL('https://madycloud.me'),
  
  title: 'Mohammed Shoaib Makandar (MaDycloud) | DevOps & Cloud Engineer',
  
  description: 'Official portfolio of Mohammed Shoaib Makandar (Shoaib M). Explore my DevOps, AWS, Kubernetes, and Cloud Engineering projects at MaDycloud.',
  
  keywords: [
    'Mohammed Shoaib Makandar', 'Mohammed Shoaib M', 'Shoaib Makandar', 
    'Shoaib M', 'Shoaib', 'MaDycloud', 'madycloud.me',
    'DevOps', 'Cloud Engineer', 'AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD'
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
    title: 'Mohammed Shoaib Makandar | DevOps & Cloud Engineer (MaDycloud)',
    description: 'Building reliable cloud systems with AWS, Kubernetes, and modern DevOps tooling.',
    url: 'https://madycloud.me',
    siteName: 'MaDycloud',
    locale: 'en_US', // Helps with regional SEO
    images: [{
      url: '/madycloud1.png',
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
    images: ['/madycloud1.png'],
    creator: '@myselfmd07', 
  },
  icons: {
    icon: '/madycloud1.png',
    apple: '/madycloud1.png', // Good for iOS home screen bookmarks
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning={true}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}