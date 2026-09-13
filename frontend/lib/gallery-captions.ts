import type { Photograph } from "@/lib/gallery-data";

export type GalleryCaption = Pick<Photograph, "title" | "location" | "category" | "alt" | "story" | "link">;

/** Localized caption overlays keyed by photograph src. English stays in gallery-data. */
export const galleryCaptions: Record<"es" | "de" | "fr", Record<string, GalleryCaption>> = {
  es: {
    "/images/imet-gogo.jpg": {
      title: "Al borde del infinito",
      location: "Imet Gogo",
      category: "Paisajes",
      alt: "Promontorio rocoso de Imet Gogo sobre los profundos valles del Simien",
      story: "Las crestas se abren más allá del escarpe. En Imet Gogo, la escala de las montañas invita a dejar de caminar y simplemente mirar.",
      link: "Descubrir el Simien",
    },
    "/images/gelada-troop.jpg": {
      title: "En compañía salvaje",
      location: "Tierras altas del Simien",
      category: "Fauna",
      alt: "Geladas salvajes reunidos en la hierba de las tierras altas del Simien",
      story: "Una tropa pasta, descansa y se mueve por la hierba de altura. Mantén una distancia respetuosa y deja que su ritmo cotidiano marque el paso.",
      link: "Conocer las montañas",
    },
    "/images/fasil-ghebbi.jpg": {
      title: "Historias en piedra",
      location: "Fasil Ghebbi · Gondar",
      category: "Cultura y vida",
      alt: "Bóvedas de piedra y arquitectura real en Fasil Ghebbi, Gondar",
      story: "Pasillos de piedra y arquitectura real muestran otra cara de las tierras altas. Gondar da al viaje un comienzo mucho antes del primer sendero.",
      link: "Explorar Gondar",
    },
    "/images/geech-camp.jpg": {
      title: "Espacio para frenar",
      location: "Campamento Geech",
      category: "En el sendero",
      alt: "Tiendas de trekking coloridas en el campamento Geech de las montañas Simien",
      story: "Una tienda, campo abierto y tiempo para acomodarse. Los campamentos de montaña hacen visibles los pequeños momentos entre jornadas de marcha.",
      link: "Encontrar tu trek",
    },
    "/images/road-to-simien.jpg": {
      title: "La vida del camino",
      location: "El camino al Simien",
      category: "Cultura y vida",
      alt: "Mujeres recogiendo agua junto a la carretera hacia las montañas Simien",
      story: "El camino a las montañas atraviesa un paisaje habitado. La conversación y el permiso van primero al fotografiar a quienes lo llaman hogar.",
      link: "Explorar Gondar",
    },
    "/images/giant-lobelia.jpg": {
      title: "Asombro en el detalle",
      location: "Tierras altas del Simien",
      category: "Paisajes",
      alt: "Lobelias gigantes creciendo en las tierras altas abiertas del Simien",
      story: "Aparta la vista del horizonte un momento. Las formas escultóricas de las lobelias gigantes dan al paisaje de altura un carácter propio.",
      link: "Quedarse con las fotografías",
    },
    "/images/chenek-camp.jpg": {
      title: "Adonde lleva el sendero",
      location: "Campamento Chenek",
      category: "En el sendero",
      alt: "Paisaje de montaña alrededor del campamento Chenek en las montañas Simien",
      story: "El país alrededor de Chenek merece demorarse. Cada giro del sendero ofrece otra perspectiva del escarpe.",
      link: "Explorar los viajes",
    },
    "/images/simien-panorama.jpg": {
      title: "Hay cosas que hay que sentir.",
      location: "Montañas Simien · Etiopía",
      category: "Paisajes",
      alt: "Panorama amplio de las montañas Simien y sus valles estratificados",
      story: "Una fotografía ofrece un vistazo. El espacio abierto, el aire de montaña y la sensación de estar aquí pertenecen al viaje mismo.",
      link: "Planear tu propio momento",
    },
  },
  de: {
    "/images/imet-gogo.jpg": {
      title: "Am Rand der Unendlichkeit",
      location: "Imet Gogo",
      category: "Landschaften",
      alt: "Felsiges Imet-Gogo-Vorgebirge über den tiefen Simien-Tälern",
      story: "Kämme öffnen sich jenseits der Steilwand. Bei Imet Gogo lädt die Größe der Berge ein, stehen zu bleiben und einfach zu schauen.",
      link: "Den Simien entdecken",
    },
    "/images/gelada-troop.jpg": {
      title: "In wilder Gesellschaft",
      location: "Simien-Hochland",
      category: "Wildtiere",
      alt: "Wilde Geladas im Gras des Simien-Hochlands",
      story: "Eine Truppe weidet, ruht und zieht durch das Hochlandgras. Halte respektvollen Abstand und lass ihren Alltag das Tempo bestimmen.",
      link: "Die Berge kennenlernen",
    },
    "/images/fasil-ghebbi.jpg": {
      title: "Geschichten in Stein",
      location: "Fasil Ghebbi · Gondar",
      category: "Kultur und Leben",
      alt: "Steingewölbe und königliche Architektur in Fasil Ghebbi, Gondar",
      story: "Steinerne Gänge und königliche Architektur zeigen eine andere Seite des Hochlands. Gondar gibt der Reise einen Anfang lange vor dem ersten Pfad.",
      link: "Gondar erkunden",
    },
    "/images/geech-camp.jpg": {
      title: "Raum zum Entschleunigen",
      location: "Camp Geech",
      category: "Auf dem Weg",
      alt: "Bunte Trekkingzelte im Camp Geech in den Simien-Bergen",
      story: "Ein Zelt, offenes Land und Zeit zum Ankommen. Bergcamps machen die kleinen Momente zwischen den Wandertagen sichtbar.",
      link: "Dein Trekking finden",
    },
    "/images/road-to-simien.jpg": {
      title: "Das Leben dazwischen",
      location: "Die Straße nach Simien",
      category: "Kultur und Leben",
      alt: "Frauen holen Wasser an der Straße zu den Simien-Bergen",
      story: "Der Weg in die Berge führt durch eine bewohnte Landschaft. Gespräch und Erlaubnis kommen zuerst, wenn man die Menschen fotografiert, die hier zu Hause sind.",
      link: "Gondar erkunden",
    },
    "/images/giant-lobelia.jpg": {
      title: "Wunder im Detail",
      location: "Simien-Hochland",
      category: "Landschaften",
      alt: "Riesenlobelien im offenen Simien-Hochland",
      story: "Schau einen Moment vom Horizont weg. Die skulpturalen Formen der Riesenlobelien geben der Hochlandlandschaft einen eigenen Charakter.",
      link: "Bei den Fotografien bleiben",
    },
    "/images/chenek-camp.jpg": {
      title: "Wohin der Weg dich führt",
      location: "Camp Chenek",
      category: "Auf dem Weg",
      alt: "Berglandschaft um das Camp Chenek in den Simien-Bergen",
      story: "Das Land um Chenek lohnt das Verweilen. Jede Kurve des Pfads zeigt eine neue Perspektive auf die Steilwand.",
      link: "Die Reisen erkunden",
    },
    "/images/simien-panorama.jpg": {
      title: "Manches muss man spüren.",
      location: "Simien-Berge · Äthiopien",
      category: "Landschaften",
      alt: "Weites Panorama der Simien-Berge und ihrer geschichteten Täler",
      story: "Ein Foto gibt einen Eindruck. Der offene Raum, die Bergluft und das Gefühl, hier zu stehen, gehören zur Reise selbst.",
      link: "Deinen eigenen Moment planen",
    },
  },
  fr: {
    "/images/imet-gogo.jpg": {
      title: "Au bord de l’infini",
      location: "Imet Gogo",
      category: "Paysages",
      alt: "Promontoire rocheux d’Imet Gogo au-dessus des profondes vallées du Simien",
      story: "Les crêtes se déploient au-delà de l’escarpement. À Imet Gogo, l’échelle des montagnes invite à s’arrêter de marcher et simplement regarder.",
      link: "Découvrir le Simien",
    },
    "/images/gelada-troop.jpg": {
      title: "En compagnie sauvage",
      location: "Hauts plateaux du Simien",
      category: "Faune",
      alt: "Geladas sauvages rassemblés dans l’herbe des hauts plateaux du Simien",
      story: "Une troupe broute, se repose et se déplace dans l’herbe d’altitude. Gardez une distance respectueuse et laissez leur rythme quotidien donner le tempo.",
      link: "Rencontrer les montagnes",
    },
    "/images/fasil-ghebbi.jpg": {
      title: "Des histoires de pierre",
      location: "Fasil Ghebbi · Gondar",
      category: "Culture et vie",
      alt: "Voûtes de pierre et architecture royale à Fasil Ghebbi, Gondar",
      story: "Couloirs de pierre et architecture royale révèlent une autre face des hauts plateaux. Gondar donne au voyage un début bien avant le premier sentier.",
      link: "Explorer Gondar",
    },
    "/images/geech-camp.jpg": {
      title: "De la place pour ralentir",
      location: "Camp de Geech",
      category: "Sur le sentier",
      alt: "Tentes de trekking colorées au camp de Geech dans les montagnes du Simien",
      story: "Une tente, un pays ouvert et le temps de s’installer. Les camps de montagne font apparaître les petits moments entre les journées de marche.",
      link: "Trouver votre trek",
    },
    "/images/road-to-simien.jpg": {
      title: "La vie entre deux",
      location: "La route vers le Simien",
      category: "Culture et vie",
      alt: "Femmes puisant de l’eau le long de la route vers les montagnes du Simien",
      story: "La route vers les montagnes traverse un paysage habité. La conversation et la permission viennent d’abord pour photographier ceux qui y vivent.",
      link: "Explorer Gondar",
    },
    "/images/giant-lobelia.jpg": {
      title: "L’émerveillement dans le détail",
      location: "Hauts plateaux du Simien",
      category: "Paysages",
      alt: "Lobélies géantes poussant dans les hauts plateaux ouverts du Simien",
      story: "Détournez un instant le regard de l’horizon. Les formes sculpturales des lobélies géantes donnent au paysage d’altitude un caractère unique.",
      link: "Rester avec les photographies",
    },
    "/images/chenek-camp.jpg": {
      title: "Là où mène le sentier",
      location: "Camp de Chenek",
      category: "Sur le sentier",
      alt: "Paysage de montagne autour du camp de Chenek dans les montagnes du Simien",
      story: "Le pays autour de Chenek mérite qu’on s’y attarde. Chaque virage du sentier offre une autre perspective sur l’escarpement.",
      link: "Explorer les voyages",
    },
    "/images/simien-panorama.jpg": {
      title: "Certaines choses se sentent.",
      location: "Montagnes du Simien · Éthiopie",
      category: "Paysages",
      alt: "Panorama vaste des montagnes du Simien et de leurs vallées en strates",
      story: "Une photographie offre un aperçu. L’espace ouvert, l’air de montagne et le sentiment d’être ici appartiennent au voyage lui-même.",
      link: "Planifier votre propre moment",
    },
  },
};

export function localizePhotograph(photo: Photograph, locale: string): Photograph {
  if (locale === "en") return photo;
  const captions = galleryCaptions[locale as "es" | "de" | "fr"]?.[photo.src];
  if (!captions) return photo;
  return { ...photo, ...captions };
}

/** Stable filter key derived from the English source category. */
export function photographCategoryKey(category: string): "landscapes" | "wildlife" | "culture" | "trail" {
  const lower = category.toLowerCase();
  if (lower.includes("wildlife") || lower.includes("fauna") || lower.includes("wildtiere")) return "wildlife";
  if (lower.includes("culture") || lower.includes("kultur") || lower.includes("cultura")) return "culture";
  if (lower.includes("trail") || lower.includes("sendero") || lower.includes("sentier") || lower.includes("weg")) return "trail";
  return "landscapes";
}
