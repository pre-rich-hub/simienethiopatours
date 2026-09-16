import Image from '@/components/Image';
import { Link } from '@/i18n/navigation';
import { getLocale, getTranslations } from 'next-intl/server';
import { notFound, permanentRedirect } from 'next/navigation';
import { PageShell } from '@/components/PageShell';
import { EditorialHero, SectionIntro, StorySection, PlanningCall } from '@/components/Editorial';
import { DestinationRoutes } from '@/components/JourneyPhotoCards';
import { ArrowUpRight } from '@/components/Icon';
import { getDestinations, getDestinationForRoute, getTours, requireContentLocale, tourToJourney, resolveMediaUrl, type PublicDestination } from '@/lib/catalogue';
import { localizedMetadata } from '@/lib/catalogue-seo';
import { breadcrumbJsonLd, destinationJsonLd, jsonLdScript, localeFromParam, pageMetadata } from '@/lib/seo';

type Area = 'explore' | 'southern';
const areaPath = (area: Area) => area === 'southern' ? '/southern-ethiopia' : '/explore-ethiopia';

async function DestinationCards({ places }: { places: PublicDestination[] }) {
  const t = await getTranslations('ethiopia');
  const tCta = await getTranslations('cta');
  return <div className="ethiopia-destination-grid">{places.map(place => <Link key={place.slug} href={place.path} locale={place.locale} className="ethiopia-destination-card">
    {place.imageUrl && <div className="ethiopia-destination-card__photo"><Image src={resolveMediaUrl(place.imageUrl)} alt={place.imageAlt} fill sizes="(max-width: 720px) 100vw, (max-width: 1100px) 50vw, 33vw" /></div>}
    <div className="ethiopia-destination-card__body">
      {place.type === 'extension' && <p className="eyebrow eyebrow--copper">{t('extension')}</p>}
      <h3>{place.name}</h3><p className="ethiopia-destination-card__location">{place.location}</p>
      <p>{place.overview[0]}</p>
      <div className="ethiopia-destination-card__footer">
        <span className="simien-photo-card__explore">{tCta('exploreMore')} <ArrowUpRight size={16} /></span>
      </div>
    </div>
  </Link>)}</div>;
}

export async function ethiopiaHubMetadata(locale: string, area: Area) {
  const t = await getTranslations({locale: localeFromParam(locale), namespace: 'ethiopia'});
  return pageMetadata({locale: localeFromParam(locale), title: t(area), description: t(`${area}Lead`), path: areaPath(area), image: null});
}

export async function EthiopiaHub({ area }: { area: Area }) {
  const t = await getTranslations('ethiopia');
  const places = await getDestinations(await getLocale());
  const groups = area === 'explore' ? [
    {id:'historic', title:t('historic'), places:places.filter(p=>p.area==='explore' && p.type!=='extension')},
    {id:'extensions', title:t('extensions'), places:places.filter(p=>p.area==='explore' && p.type==='extension')},
  ] : [
    {id:'southern', title:t('southern'), places:places.filter(p=>p.area==='southern' && p.type!=='extension')},
    {id:'bale', title:t('bale'), places:places.filter(p=>p.area==='southern' && p.type==='extension')},
  ];
  return <PageShell lightHeader>
    <section className="page-hero editorial-hero"><div className="shell">
      <div className="breadcrumbs"><Link href="/explore-ethiopia">{t('explore')}</Link>{area==='southern' && <><span>/</span><span>{t('southern')}</span></>}</div>
      <p className="eyebrow">{t('destinations')}</p><h1 className="display">{t(area)}</h1><p className="lead">{t(`${area}Lead`)}</p>
      <nav className="ethiopia-group-links" aria-label={t('groups')}>
        {groups.map(g=><a key={g.id} href={`#${g.id}`}>{g.title} <ArrowUpRight size={16}/></a>)}
        {area==='explore' && <Link href="/southern-ethiopia">{t('southern')} <ArrowUpRight size={16}/></Link>}
      </nav>
    </div></section>
    {groups.map(group=><section key={group.id} id={group.id} className="section ethiopia-group"><div className="shell"><SectionIntro tag={t('destinations')} title={group.title}/><DestinationCards places={group.places}/></div></section>)}
    {area==='explore' && <section className="section section--paper" id="southern"><div className="shell"><SectionIntro tag={t('destinations')} title={t('southern')}/><p className="lead">{t('southernLead')}</p><Link className="text-link" href="/southern-ethiopia">{t('discoverSouth')} <ArrowUpRight/></Link></div></section>}
  </PageShell>;
}

export async function ethiopiaDestinationMetadata(localeParam: string, slug: string, area: Area) {
  const locale = localeFromParam(localeParam);
  const record = await getDestinationForRoute(slug, locale);
  if(!record || record.area!==area) return {};
  requireContentLocale(record,locale);
  const t=await getTranslations({locale,namespace:'ethiopia'});
  return localizedMetadata({locale,title:`${record.name} — ${t(area)}`,description:record.overview[0]??'',path:record.path,image:record.imageUrl?{url:resolveMediaUrl(record.imageUrl),alt:record.imageAlt}:null},record.availableLocales);
}

export async function EthiopiaDestination({locale: localeParam,slug,area}: {locale:string;slug:string;area:Area}) {
  const locale=localeFromParam(localeParam);
  const record=await getDestinationForRoute(slug,locale);
  if(!record) notFound();
  if(record.area!==area) permanentRedirect(`/${locale}${record.path}`);
  requireContentLocale(record,locale);
  const t=await getTranslations('ethiopia');
  const d=await getTranslations('destination');
  const tCommon=await getTranslations('common');
  const routes=(await getTours(locale)).filter(tour=>record.tourSlugs.includes(tour.slug)).map(tourToJourney);
  const imageUrl=record.imageUrl?resolveMediaUrl(record.imageUrl):'';
  return <PageShell lightHeader={!record.imageUrl}>
    <script type="application/ld+json" dangerouslySetInnerHTML={{__html:jsonLdScript({"@context":"https://schema.org","@graph":[
      destinationJsonLd({name:record.name,description:record.overview[0]??'',path:record.path,locale,image:imageUrl||undefined,location:record.location,alternateName:record.alsoKnownAs}),
      breadcrumbJsonLd([{name:tCommon('home'),path:'/',locale},{name:t(area),path:areaPath(area),locale},{name:record.name,path:record.path,locale}]),
    ]})}} />
    <EditorialHero eyebrow={record.type==='extension'?`${t(area)} · ${t('extension')}`:t(area)} title={record.heroTitle} accent={record.heroAccent} lead={record.location} image={record.imageUrl?{src:resolveMediaUrl(record.imageUrl),alt:record.imageAlt}:undefined} parent={{label:t(area),href:areaPath(area)}}/>
    {record.alsoKnownAs.length>0 && <p className="shell content-note">{d('alsoKnownAs',{names:record.alsoKnownAs.join(', ')})}</p>}
    <StorySection id="about" tag={d('about')} title={record.name} paragraphs={record.overview}/>
    <section className="section section--paper"><div className="shell"><SectionIntro tag={d('highlights')} title={d('highlights')}/><div className="dest-highlights dest-highlights--2">{record.highlights.map((text,index)=><article className="dest-highlight" key={text}><span className="eyebrow eyebrow--copper">{String(index+1).padStart(2,'0')}</span><p>{text}</p></article>)}</div></div></section>
    <section className="section"><div className="shell editorial-grid"><SectionIntro tag={d('thingsToDo')} title={d('thingsToDo')}/><ul className="editorial-list dest-things">{record.thingsToDo.map(text=><li key={text}>{text}</li>)}</ul></div></section>
    {routes.length>0?<DestinationRoutes journeys={routes} paper/>:<section className="section section--paper"><div className="shell"><SectionIntro tag={t('plan')} title={t('planTitle')}/><p>{t('planLead',{name:record.name})}</p></div></section>}
    <PlanningCall title={d('callTitle',{name:record.name})} eyebrow={d('callEyebrow')} label={d('callLabel')} />
    <p className="shell dest-back"><Link className="text-link" href={areaPath(area)}>{t('back',{region:t(area)})} <ArrowUpRight/></Link></p>
  </PageShell>;
}
