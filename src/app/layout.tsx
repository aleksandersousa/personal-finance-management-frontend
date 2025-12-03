import type { Metadata } from 'next';
import { Poppins } from 'next/font/google';
import { Toaster } from 'sonner';
import './globals.css';

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

export const metadata: Metadata = {
  title: 'Gestão Financeira',
  description: 'Sistema de gestão financeira pessoal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='pt-BR'>
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <Toaster
          position='bottom-right'
          toastOptions={{
            classNames: {
              success: 'toast-success',
              error: 'toast-error',
            },
          }}
        />
      </body>
    </html>
  );
}
