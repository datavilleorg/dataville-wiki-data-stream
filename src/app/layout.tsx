import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Dataville — Wikipedia Knowledge Base Tracker',
  description: 'Wikipedia edit events for competitor intelligence and knowledge base refresh, powered by the Dataville API.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
