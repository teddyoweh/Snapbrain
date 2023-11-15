import Head from 'next/head';
import { Inter } from 'next/font/google';
import { AuthProvider } from './context/AuthContext';
 

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'SnapBrain - The Next-Gen Quiz Platform',
  description: 'Engage, Learn, and Have Fun with SnapBrain, the latest version of the popular quiz app.',
  image: './assets/logo.png', 
  url: 'https://www.snapbrain.vercel.app.',
};

export default function RootLayout({ children }) {
  return (
    <AuthProvider>
      <html lang="en">
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>{metadata.title}</title>

 
          <meta name="description" content={metadata.description} />
          <meta name="image" content={metadata.image} />

 
          <meta property="og:title" content={metadata.title} />
          <meta property="og:description" content={metadata.description} />
          <meta property="og:image" content={metadata.image} />
          <meta property="og:url" content={metadata.url} />
          <meta property="og:type" content="website" />

 
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content={metadata.title} />
          <meta name="twitter:description" content={metadata.description} />
          <meta name="twitter:image" content={metadata.image} />
        </Head>
        <body className={inter.className}>{children}</body>
      </html>
    </AuthProvider>
  );
}
