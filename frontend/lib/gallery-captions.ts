import { photographs, type Photograph } from "@/lib/gallery-data";

export type GalleryCaption = Pick<Photograph, "title" | "location" | "category" | "alt" | "story" | "link">;
type CaptionLocale = "es" | "de" | "fr";

/** Titles and alt text follow the supplied gallery1–gallery33 order. */
const translatedPhotos: Record<CaptionLocale, readonly (readonly [title: string, alt: string])[]> = {
  es: [
    ["Una bienvenida compartida","Viajeros juntos con camisetas verdes y amarillas a juego"],
    ["Sobre los valles","Un viajero con los brazos alzados contempla sucesivos valles de montaña"],
    ["En la puerta","Visitantes y anfitriones locales reunidos en la puerta de una casa"],
    ["Dentro de la historia","Dos visitantes en una habitación de tierra con símbolos pintados en las paredes"],
    ["Montañas alrededor","Un viajero con los brazos abiertos sobre el escarpe del Simien"],
    ["Entre las rocas","Un caminante con los brazos abiertos entre altas formaciones rocosas"],
    ["Horizontes abiertos","Un viajero contempla crestas montañosas y un valle profundo"],
    ["Un momento en la cresta","Dos caminantes juntos en un mirador rocoso de montaña"],
    ["Por el páramo de altura","Un lobo etíope camina por un terreno rocoso de altura"],
    ["La siguiente generación","Cachorros de lobo etíope entre rocas y plantas de las tierras altas"],
    ["Piedra y verde","Ruinas de piedra rodeadas de hierba y árboles"],
    ["Muros reales","Un castillo de piedra con torres redondeadas bajo un cielo nublado"],
    ["Raíces e historia","Grandes raíces de árbol se extienden sobre un antiguo muro de piedra"],
    ["Un retrato en el camino","Una persona con una tela estampada sostiene un rifle al aire libre"],
    ["En el círculo","Participantes reunidos en círculo sosteniendo largos palos de madera"],
    ["Entre la multitud","Un visitante con bufanda blanca entre personas vestidas de blanco"],
    ["Tiempo para el café","Una anfitriona y un visitante con granos de café, tazas y una cafetera tradicional"],
    ["Junto al acantilado","Un caminante en un sendero estrecho junto a un acantilado de arenisca"],
    ["El arte del detalle","Una persona con el pelo trenzado y pulseras sostiene una calabaza decorada"],
    ["La ciudad se reúne","Un visitante contempla una gran concentración en una plaza urbana"],
    ["Dibujos y adornos","Retrato de una persona con dibujos faciales pintados y un plato labial decorado"],
    ["Hogares de las tierras altas","Visitantes junto a altas casas tejidas con tejados de paja"],
    ["Tallada en la roca","La iglesia excavada en la roca de Bete Giyorgis dentro de su profundo foso de piedra"],
    ["Caminando juntos","Dos caminantes con bastones descansan en un mirador de montaña"],
    ["Espacio para respirar","Un viajero sentado con las piernas cruzadas y los brazos abiertos sobre un valle"],
    ["Un día para recordar","Tres viajeros se fotografían juntos en las montañas"],
    ["Junto al escarpe","Dos caminantes posan sobre terreno rocoso por encima de los valles del Simien"],
    ["Cuentas y color","Retrato de una persona con un tocado oscuro y varias capas de cuentas de colores"],
    ["Juntos en el paisaje","Cuatro personas juntas en un paisaje abierto bajo un cielo azul"],
    ["Un retrato a la luz","Retrato de una persona con dibujos faciales pintados y collares de cuentas rojas y blancas"],
    ["Un encuentro por la tarde","Un grupo de adultos y niños reunidos al aire libre"],
    ["Color y tradición","Retrato de una persona con pelo trenzado, collares de cuentas y una cinta decorada en la cabeza"],
    ["Luz de montaña compartida","Cuatro caminantes descansan juntos con crestas montañosas al fondo"],
  ],
  de: [
    ["Ein gemeinsamer Empfang","Reisende stehen in passenden grünen und gelben Trikots zusammen"],
    ["Über den Tälern","Ein Reisender blickt mit erhobenen Armen über gestaffelte Bergtäler"],
    ["An der Tür","Besucher und örtliche Gastgeber stehen vor der Tür eines Hauses"],
    ["Inmitten der Geschichte","Zwei Besucher in einem Lehmraum mit gemalten Symbolen an den Wänden"],
    ["Von Bergen umgeben","Ein Reisender mit ausgebreiteten Armen über dem Simien-Steilhang"],
    ["Zwischen den Felsen","Ein Wanderer steht mit offenen Armen zwischen hohen Felsformationen"],
    ["Offene Horizonte","Ein Reisender blickt über Bergkämme und ein tiefes Tal"],
    ["Ein Moment auf dem Grat","Zwei Wanderer stehen gemeinsam an einem felsigen Aussichtspunkt"],
    ["Im Hochlandmoor","Ein Äthiopischer Wolf läuft über felsigen Hochlandboden"],
    ["Die nächste Generation","Junge Äthiopische Wölfe zwischen Felsen und Hochlandpflanzen"],
    ["Stein und Grün","Verwitterte Steinruinen zwischen Gras und Bäumen"],
    ["Königliche Mauern","Eine steinerne Burg mit runden Türmen unter bewölktem Himmel"],
    ["Wurzeln und Geschichte","Große Baumwurzeln breiten sich über eine alte Steinmauer aus"],
    ["Ein Porträt unterwegs","Eine Person in einem gemusterten Tuch hält im Freien ein Gewehr"],
    ["Im Kreis","Teilnehmer stehen mit langen Holzstöcken in einem Kreis"],
    ["Inmitten der Menschen","Ein Besucher mit weißem Schal unter weiß gekleideten Menschen"],
    ["Zeit für Kaffee","Eine Gastgeberin und ein Besucher mit Kaffeebohnen, Tassen und einer traditionellen Kaffeekanne"],
    ["Am Fels entlang","Ein Wanderer auf einem schmalen Pfad neben einer Sandsteinwand"],
    ["Kunst im Detail","Eine Person mit geflochtenem Haar und Armreifen hält eine verzierte Kalebasse"],
    ["Eine Stadt kommt zusammen","Ein Besucher blickt auf eine große Versammlung auf einem städtischen Platz"],
    ["Muster und Schmuck","Porträt einer Person mit Gesichtsbemalung und verziertem Lippenteller"],
    ["Häuser im Hochland","Besucher neben hohen geflochtenen Häusern mit Strohdächern"],
    ["Aus dem Fels gehauen","Die Felsenkirche Bete Giyorgis in ihrem tiefen Steingraben"],
    ["Gemeinsam unterwegs","Zwei Wanderer mit Stöcken rasten an einem Aussichtspunkt"],
    ["Raum zum Durchatmen","Ein Reisender sitzt mit gekreuzten Beinen und offenen Armen über einem Bergtal"],
    ["Ein unvergesslicher Tag","Drei Reisende fotografieren sich gemeinsam in den Bergen"],
    ["Am Rand der Steilwand","Zwei Wanderer stehen auf felsigem Boden über den Simien-Tälern"],
    ["Perlen und Farbe","Porträt einer Person mit dunkler Kopfbedeckung und bunten Perlenketten"],
    ["Gemeinsam in der Landschaft","Vier Menschen stehen in einer offenen Landschaft unter blauem Himmel"],
    ["Ein Porträt im Licht","Porträt einer Person mit Gesichtsbemalung sowie roten und weißen Perlenketten"],
    ["Ein Treffen am Nachmittag","Eine Gruppe von Erwachsenen und Kindern steht im Freien zusammen"],
    ["Farbe und Tradition","Porträt einer Person mit geflochtenem Haar, Perlenketten und verziertem Stirnband"],
    ["Gemeinsames Berglicht","Vier Wanderer rasten gemeinsam vor Bergkämmen"],
  ],
  fr: [
    ["Un accueil partagé","Des voyageurs réunis en maillots verts et jaunes assortis"],
    ["Au-dessus des vallées","Un voyageur lève les bras face à une succession de vallées montagneuses"],
    ["Sur le pas de la porte","Des visiteurs et des hôtes locaux réunis à la porte d’une maison"],
    ["Au cœur de l’histoire","Deux visiteurs dans une pièce en terre aux murs ornés de symboles peints"],
    ["Entouré de montagnes","Un voyageur ouvre les bras au-dessus de l’escarpement du Simien"],
    ["Entre les rochers","Un randonneur ouvre les bras entre de hautes formations rocheuses"],
    ["Horizons ouverts","Un voyageur contemple des crêtes montagneuses et une vallée profonde"],
    ["Un moment sur la crête","Deux randonneurs réunis sur un belvédère rocheux"],
    ["À travers la lande d’altitude","Un loup d’Éthiopie marche sur un terrain rocheux des hauts plateaux"],
    ["La nouvelle génération","Des louveteaux d’Éthiopie parmi les rochers et les plantes des hauts plateaux"],
    ["Pierre et verdure","Des ruines de pierre entourées d’herbe et d’arbres"],
    ["Murailles royales","Un château de pierre aux tours arrondies sous un ciel nuageux"],
    ["Racines et histoire","De grandes racines d’arbre s’étendent sur un vieux mur de pierre"],
    ["Un portrait en chemin","Une personne drapée d’un tissu à motifs tient un fusil en plein air"],
    ["Dans le cercle","Des participants réunis en cercle tiennent de longs bâtons en bois"],
    ["Au milieu du rassemblement","Un visiteur portant une écharpe blanche parmi des personnes vêtues de blanc"],
    ["Le temps d’un café","Une hôte et un visiteur avec des grains de café, des tasses et une cafetière traditionnelle"],
    ["Le long de la falaise","Un randonneur sur un sentier étroit au bord d’une falaise de grès"],
    ["L’art du détail","Une personne aux cheveux tressés et aux bracelets tient une calebasse décorée"],
    ["Une ville se rassemble","Un visiteur contemple un grand rassemblement sur une place urbaine"],
    ["Motifs et parures","Portrait d’une personne au visage peint portant un plateau labial décoré"],
    ["Maisons des hauts plateaux","Des visiteurs près de hautes maisons tressées aux toits de chaume"],
    ["Taillée dans la roche","L’église rupestre de Bete Giyorgis dans sa profonde tranchée de pierre"],
    ["Marcher ensemble","Deux randonneurs avec des bâtons se reposent à un belvédère"],
    ["De l’espace pour respirer","Un voyageur assis en tailleur ouvre les bras au-dessus d’une vallée"],
    ["Une journée à retenir","Trois voyageurs se photographient ensemble dans les montagnes"],
    ["Au bord de l’escarpement","Deux randonneurs posent sur un sol rocheux au-dessus des vallées du Simien"],
    ["Perles et couleurs","Portrait d’une personne portant un couvre-chef sombre et plusieurs colliers de perles colorées"],
    ["Ensemble dans le paysage","Quatre personnes réunies dans un paysage ouvert sous un ciel bleu"],
    ["Un portrait dans la lumière","Portrait d’une personne au visage peint portant des colliers de perles rouges et blanches"],
    ["Une rencontre l’après-midi","Un groupe d’adultes et d’enfants réunis en plein air"],
    ["Couleur et tradition","Portrait d’une personne aux cheveux tressés portant des colliers de perles et un bandeau décoré"],
    ["La lumière des montagnes en partage","Quatre randonneurs se reposent ensemble devant des crêtes montagneuses"],
  ],
};

const translatedCopy = {
  "es": {
    "locations": {
      "Ethiopia": "Etiopía",
      "Simien Mountains": "Montañas Simien",
      "Ethiopian highlands": "Tierras altas de Etiopía"
    },
    "stories": {
      "landscapes": "Las montañas se suceden más allá del escarpe. Son momentos para detenerse y contemplar el paisaje.",
      "trail": "Senderos compartidos, aire de montaña y tiempo para parar. Encuentra un viaje adaptado a tu ritmo.",
      "wildlife": "Una mirada a la fauna de las tierras altas de Etiopía. Observa en silencio, mantén la distancia y deja que los animales marquen el paso.",
      "culture": "Las personas, el patrimonio y los encuentros cotidianos forman parte del viaje. Dedica tiempo a conversar y pide permiso antes de fotografiar a las personas."
    },
    "categories": {
      "landscapes": "Paisajes",
      "trail": "En el sendero",
      "wildlife": "Fauna",
      "culture": "Cultura y vida"
    },
    "links": {
      "/simien-mountains": "Descubrir el Simien",
      "/treks": "Explorar los viajes",
      "/explore-ethiopia": "Explorar Etiopía",
      "/gondar": "Explorar Gondar",
      "/explore-ethiopia/lalibela": "Explorar Lalibela"
    }
  },
  "de": {
    "locations": {
      "Ethiopia": "Äthiopien",
      "Simien Mountains": "Simien-Berge",
      "Ethiopian highlands": "Äthiopisches Hochland"
    },
    "stories": {
      "landscapes": "Bergketten entfalten sich jenseits der Steilwand. Hier lohnt es sich, innezuhalten und die Aussicht aufzunehmen.",
      "trail": "Gemeinsame Wege, Bergluft und Zeit für Pausen. Finde eine Reise in deinem eigenen Tempo.",
      "wildlife": "Ein Einblick in die Tierwelt des äthiopischen Hochlands. Beobachte ruhig, halte Abstand und lass die Tiere das Tempo bestimmen.",
      "culture": "Menschen, Kulturerbe und alltägliche Begegnungen gehören zur Reise. Nimm dir Zeit für Gespräche und frage vor dem Fotografieren von Menschen um Erlaubnis."
    },
    "categories": {
      "landscapes": "Landschaften",
      "trail": "Auf dem Weg",
      "wildlife": "Wildtiere",
      "culture": "Kultur und Leben"
    },
    "links": {
      "/simien-mountains": "Den Simien entdecken",
      "/treks": "Die Reisen erkunden",
      "/explore-ethiopia": "Äthiopien erkunden",
      "/gondar": "Gondar erkunden",
      "/explore-ethiopia/lalibela": "Lalibela erkunden"
    }
  },
  "fr": {
    "locations": {
      "Ethiopia": "Éthiopie",
      "Simien Mountains": "Montagnes du Simien",
      "Ethiopian highlands": "Hauts plateaux d’Éthiopie"
    },
    "stories": {
      "landscapes": "Les montagnes se déploient au-delà de l’escarpement. Ce sont des moments pour s’arrêter et contempler le paysage.",
      "trail": "Des sentiers partagés, l’air des montagnes et le temps de faire une pause. Trouvez un voyage à votre rythme.",
      "wildlife": "Un aperçu de la faune des hauts plateaux d’Éthiopie. Observez en silence, gardez vos distances et laissez les animaux donner le rythme.",
      "culture": "Les personnes, le patrimoine et les rencontres du quotidien font partie du voyage. Prenez le temps de discuter et demandez la permission avant de photographier des personnes."
    },
    "categories": {
      "landscapes": "Paysages",
      "trail": "Sur le sentier",
      "wildlife": "Faune",
      "culture": "Culture et vie"
    },
    "links": {
      "/simien-mountains": "Découvrir le Simien",
      "/treks": "Explorer les voyages",
      "/explore-ethiopia": "Explorer l’Éthiopie",
      "/gondar": "Explorer Gondar",
      "/explore-ethiopia/lalibela": "Explorer Lalibela"
    }
  }
} as const;

function captionsFor(locale: CaptionLocale): Record<string, GalleryCaption> {
  const copy = translatedCopy[locale];
  return Object.fromEntries(photographs.map((photo, index) => {
    const [title, alt] = translatedPhotos[locale][index]!;
    const category = photographCategoryKey(photo.category);
    return [photo.src, {
      title,
      alt,
      location: copy.locations[photo.location as keyof typeof copy.locations] ?? photo.location,
      category: copy.categories[category],
      story: copy.stories[category],
      link: copy.links[photo.href as keyof typeof copy.links] ?? photo.link,
    }];
  }));
}

export const galleryCaptions: Record<CaptionLocale, Record<string, GalleryCaption>> = {
  es: captionsFor("es"),
  de: captionsFor("de"),
  fr: captionsFor("fr"),
};

export function localizePhotograph(photo: Photograph, locale: string): Photograph {
  if (locale === "en") return photo;
  const captions = galleryCaptions[locale as CaptionLocale]?.[photo.src];
  return captions ? { ...photo, ...captions } : photo;
}

/** Stable filter key derived from the English source category. */
export function photographCategoryKey(category: string): "landscapes" | "wildlife" | "culture" | "trail" {
  const lower = category.toLowerCase();
  if (lower.includes("wildlife") || lower.includes("fauna") || lower.includes("wildtiere")) return "wildlife";
  if (lower.includes("culture") || lower.includes("kultur") || lower.includes("cultura")) return "culture";
  if (lower.includes("trail") || lower.includes("sendero") || lower.includes("sentier") || lower.includes("weg")) return "trail";
  return "landscapes";
}
