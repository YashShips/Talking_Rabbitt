import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Talking Rabbitt | Conversational BI",
  description: "Talk to your business data with Talking Rabbitt.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased min-h-screen flex flex-col font-sans">
        {/* Top Navigation Bar */}
        <header className="sticky top-0 z-50 w-full border-b border-white/10 glass-card bg-background/50">
          <div className="container flex h-16 items-center px-4 md:px-6">
            <div className="mr-4 flex items-center space-x-2">
              <div className="h-8 w-8 rounded-full bg-primary glow-cyan flex items-center justify-center">
                <span className="text-black font-bold text-xl leading-none">R</span>
              </div>
              <span className="hidden font-bold sm:inline-block text-xl tracking-tight text-white text-glow">
                Talking Rabbitt
              </span>
            </div>
            <div className="flex flex-1 items-center justify-end space-x-4">
              <nav className="flex items-center space-x-1">
                <span className="text-sm font-medium text-muted-foreground mr-4 hidden md:inline-block">
                  Conversational Business Intelligence
                </span>
                <div className="h-2 w-2 rounded-full bg-primary glow-cyan"></div>
                <span className="text-xs text-primary font-mono uppercase tracking-widest">System Online</span>
              </nav>
            </div>
          </div>
        </header>

        <main className="flex-1 flex overflow-hidden relative">
          {/* subtle background scanlines */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: 'linear-gradient(transparent 50%, rgba(0, 0, 0, 0.25) 50%)', backgroundSize: '100% 4px' }} />
          {children}
        </main>
      </body>
    </html>
  );
}
