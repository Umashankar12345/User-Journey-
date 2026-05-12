import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Credex: Free AI Spend Audit',
  description: 'See how much you could save on Claude, ChatGPT, GitHub Copilot, and other AI tools.',
  openGraph: {
    title: 'Credex: Free AI Spend Audit',
    description: 'Find out if you\'re overspending on AI tools and discover hidden savings.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Credex: Free AI Spend Audit',
    description: 'Find out if you\'re overspending on AI tools.',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <main className="min-h-screen">{children}</main>
      </body>
    </html>
  );
}
