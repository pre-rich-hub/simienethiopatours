import { EthiopiaHub, ethiopiaHubMetadata } from '@/components/EthiopiaDestinations';
export async function generateMetadata({params}: {params: Promise<{locale:string}>}) {
  return ethiopiaHubMetadata((await params).locale, 'southern');
}
export default function Page() { return <EthiopiaHub area="southern"/>; }
