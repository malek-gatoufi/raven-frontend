'use client';

import dynamic from 'next/dynamic';

// Import Header with SSR disabled to prevent hydration mismatches from Radix UI
const Header = dynamic(
  () => import('./Header').then(mod => ({ default: mod.Header })),
  { 
    ssr: false,
    loading: () => (
      <header className="sticky top-0 z-50 w-full header-glass">
        {/* Top bar placeholder */}
        <div className="border-b border-white/5 bg-black/30">
          <div className="container mx-auto px-4">
            <div className="h-10" />
          </div>
        </div>
        {/* Main header placeholder */}
        <div className="container mx-auto px-4">
          <div className="h-20" />
        </div>
        {/* Navigation bar placeholder */}
        <nav className="hidden lg:block border-t border-white/5 bg-black/20">
          <div className="container mx-auto px-4">
            <div className="h-14" />
          </div>
        </nav>
      </header>
    )
  }
);

export function ClientHeader() {
  return <Header />;
}
