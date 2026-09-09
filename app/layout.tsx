import { RootProvider } from 'fumadocs-ui/provider/next';
import 'katex/dist/katex.css';
import './global.css';
import { Noto_Sans_SC } from 'next/font/google';
import { appDescription, appName } from '@/lib/shared';
import type { Metadata } from 'next';

const notoSansSC = Noto_Sans_SC({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://elytra.dev/thinking-in-minecraft'),
  title: {
    default: appName,
    template: `%s | ${appName}`,
  },
  description: appDescription,
};

export default function Layout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="zh-CN" className={notoSansSC.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
