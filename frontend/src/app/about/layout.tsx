import { ReactNode } from 'react';

export default function AboutLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#E3F2FD', color: '#0D47A1' }}>
      <main className="container mx-auto px-4 py-8">
        <div className="about-theme">{children}</div>
      </main>
    </div>
  );
}