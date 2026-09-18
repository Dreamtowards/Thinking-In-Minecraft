import { RootProvider } from 'fumadocs-ui/provider/next';
import 'katex/dist/katex.css';
import './global.css';
import { appDescription, appName } from '@/lib/shared';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  metadataBase: new URL('https://elytra.dev/thinking-in-minecraft'),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
  openGraph: {
    images: ['/og.png'],
  },
  icons: {
    icon: '/favicon.png',
  },
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
