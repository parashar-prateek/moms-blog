import './globals.css';

export const metadata = {
  metadataBase: new URL('https://ritatude.in'),
  title: {
    default: "Rita's Blog — Thoughts, Stories & a Cup of Chai",
    template: "%s | Rita's Blog",
  },
  description: "A warm corner of the internet where Rita shares her thoughts on life, family, food, spirituality, and everything in between.",
  openGraph: {
    title: "Rita's Blog",
    description: "Thoughts, stories & a cup of chai ☕",
    url: 'https://ritatude.in',
    siteName: "Rita's Blog",
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Rita's Blog",
    description: "Thoughts, stories & a cup of chai ☕",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          <div className="site-header-inner">
            <div className="site-logo">🪷</div>
            <h1 className="site-title">
              <a href="/">Rita&apos;s Blog</a>
            </h1>
            <p className="site-tagline">Thoughts, stories &amp; a cup of chai ☕</p>
          </div>
        </header>

        <main className="main-content fade-in">
          {children}
        </main>

        <footer className="site-footer">
          Made with 💕 for Rita
        </footer>
      </body>
    </html>
  );
}
