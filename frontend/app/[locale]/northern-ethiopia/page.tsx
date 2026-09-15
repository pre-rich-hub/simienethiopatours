import { permanentRedirect } from 'next/navigation';
export default async function Page({params}: {params: Promise<{locale:string}>}) {
  permanentRedirect(`/${(await params).locale}/explore-ethiopia`);
}
