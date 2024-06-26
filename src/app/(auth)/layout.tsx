import { ClerkProvider } from '@clerk/nextjs';
import { Inter } from 'next/font/google';
import '../globals.css';

export const metadata = {
  title: 'Trends',
  description: 'A Trends app like X, powered by Nextjs',
};

const inter = Inter({ subsets: ['latin'] });

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-dark-1`}>
          <div className="w-full min-h-screen flex items-center justify-center">
            {children}
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
};

export default AuthLayout;
