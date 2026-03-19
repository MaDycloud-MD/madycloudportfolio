import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata = {
  title:       'Mohammed Shoaib Makandar | DevOps & Cloud Engineer',
  description: 'Portfolio of Mohammed Shoaib Makandar — DevOps Engineer specializing in AWS, Kubernetes, Docker, Terraform, and CI/CD pipelines.',
  keywords:    ['DevOps', 'Cloud Engineer', 'AWS', 'Kubernetes', 'Docker', 'Terraform', 'CI/CD', 'MaDycloud'],
  authors:     [{ name: 'Mohammed Shoaib Makandar' }],
  openGraph: {
    title:       'Mohammed Shoaib Makandar | DevOps & Cloud Engineer',
    description: 'Building reliable cloud systems with AWS, Kubernetes, and modern DevOps tooling.',
    url:         'https://madycloud.me',
    siteName:    'MaDycloud',
    images: [{
      url:    '/og-image.png',
      width:  1200,
      height: 630,
      alt:    'MaDycloud Portfolio',
    }],
    type: 'website',
  },
  twitter: {
    card:  'summary_large_image',
    title: 'Mohammed Shoaib Makandar | DevOps & Cloud Engineer',
    images: ['/og-image.png'],
  },
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
