import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Հաճախ Տրվող Հարցեր (FAQ) | Arakelians Drive',
  description:
    'Հաճախ տրվող հարցեր վարորդական իրավունքի, ավտոդպրոցի, դասերի, քննությունների և վճարումների մասին: Գտեք պատասխաններ ձեր բոլոր հարցերին:',
  keywords:
    'FAQ, հաճախ տրվող հարցեր, վարորդական իրավունք հարցեր, ավտոդպրոց հարցեր, վարորդական քննություն հարցեր, վարորդական դասեր հարցեր, վարորդական իրավունք FAQ',
  openGraph: {
    title: 'Հաճախ Տրվող Հարցեր (FAQ) | Arakelians Drive',
    description:
      'Հաճախ տրվող հարցեր վարորդական իրավունքի, ավտոդպրոցի, դասերի և քննությունների մասին:',
    type: 'website',
    siteName: 'Arakelians Drive',
  },
  twitter: {
    card: 'summary',
    title: 'Հաճախ Տրվող Հարցեր (FAQ) | Arakelians Drive',
    description:
      'Հաճախ տրվող հարցեր վարորդական իրավունքի, ավտոդպրոցի, դասերի և քննությունների մասին:',
  },
};

export default function FaqLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
