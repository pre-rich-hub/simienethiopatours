import type { Metadata } from "next";
import Link from "next/link";
import { PageShell } from "@/components/PageShell";

export const metadata: Metadata = { title: "Photography Credits", description: "Photographer, source and license information for imagery used by Gondar Simien Tours.", alternates: { canonical: "/photo-credits" } };

const credits = [
  { file: "Imet Gogo", author: "Ondřej Žváček", license: "CC BY 2.5 / CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Imet_Gogo.jpg" },
  { file: "Chennek Camp", author: "Bernard Gagnon", license: "CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Chennek_Camp.jpg" },
  { file: "Geech Camp", author: "Bernard Gagnon", license: "CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Geech_Camp.jpg" },
  { file: "Giant lobelias", author: "Bernard Gagnon", license: "CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Giant_lobelias.jpg" },
  { file: "Gelada Baboons, Simien Mountains", author: "A. Davey", license: "CC BY 2.0", href: "https://commons.wikimedia.org/wiki/File:Gelada_Baboons,_Simien_Mountains,_Ethiopia_(2457852901).jpg" },
  { file: "On the Road to Simien Mountains National Park", author: "A. Davey", license: "CC BY 2.0", href: "https://commons.wikimedia.org/wiki/File:On_The_Road_To_Simien_Mountains_National_Park,_Ethiopia_(2447619998).jpg" },
  { file: "Simien Mountains National Park 10", author: "Bernard Gagnon", license: "CC BY-SA 3.0", href: "https://commons.wikimedia.org/wiki/File:Simien_Mountains_National_Park_10.jpg" },
  { file: "Fasil Ghebbi — Iyasu's Palace", author: "A. Savin", license: "Free Art License", href: "https://commons.wikimedia.org/wiki/File:ET_Gondar_asv2018-02_img18_Fasil_Ghebbi.jpg" },
  { file: "Founder photographs", author: "Simien Ethio Tours", license: "Used from the operating company's official media library", href: "https://simienethiotours.com/about-us/" },
];

export default function PhotoCreditsPage() {
  return <PageShell><section className="page-hero"><div className="shell"><div className="breadcrumbs"><Link href="/">Home</Link><span>/</span><span>Photo credits</span></div><p className="eyebrow eyebrow--copper">Real places · real photography</p><h1 className="display">Photography <em>credits.</em></h1><p className="lead">Destination photographs are locally hosted and displayed with responsive crops. The original photographers and source files remain credited here.</p></div></section><section className="section"><div className="shell credits-list">{credits.map((credit, i) => <a key={credit.file} href={credit.href} target="_blank" rel="noreferrer"><span>{String(i+1).padStart(2,"0")}</span><strong>{credit.file}</strong><em>{credit.author}</em><small>{credit.license} ↗</small></a>)}</div><p className="shell credits-note">Where an image is cropped, resized, color-managed or compressed for responsive display, that adaptation is indicated here. The website does not imply photographer endorsement.</p></section></PageShell>;
}
