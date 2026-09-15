import { EthiopiaDestination, ethiopiaDestinationMetadata } from '@/components/EthiopiaDestinations';
export async function generateMetadata({params}: {params: Promise<{locale:string;slug:string}>}) {
  const {locale,slug}=await params;
  return ethiopiaDestinationMetadata(locale,slug,'southern');
}
export default async function Page({params}: {params: Promise<{locale:string;slug:string}>}) {
  return <EthiopiaDestination {...await params} area="southern"/>;
}
