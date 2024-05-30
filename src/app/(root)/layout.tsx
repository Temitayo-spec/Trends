import type { Metadata } from 'next';
import '../globals.css';
import { ClerkProvider } from '@clerk/nextjs';
import { Bottombar, LeftSidebar, RightSidebar, Topbar } from '@/components';

export const metadata: Metadata = {
  title: 'Trends',
  description: 'A Trends app like X, powered by Nextjs',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <Topbar />
          <main className='flex'>
            <LeftSidebar />

            <section className="main-container">
              <div className="w-full max-w-4xl">{children}</div>
            </section>

            <RightSidebar />
          </main>
          <Bottombar />
        </body>
      </html>
    </ClerkProvider>
  );
}
