export type Photograph = {
  src: string;
  title: string;
  location: string;
  category: string;
  alt: string;
  story: string;
  href: string;
  link: string;
};

export const galleryImageBase = "https://res.cloudinary.com/ps4gvvqu/image/upload/v1789473232";
export const galleryImageUrl = (number: number) => `${galleryImageBase}/gallery${number}.jpg`;

const themes = {
  landscapes: { category: "Landscapes", story: "Layers of mountain country unfold beyond the escarpment. These are moments to pause and take in the view.", href: "/simien-mountains", link: "Discover the Simien" },
  trail: { category: "On the trail", story: "Shared paths, mountain air and time to stop along the way. Find a journey shaped around your pace.", href: "/treks", link: "Explore the journeys" },
  wildlife: { category: "Wildlife", story: "A glimpse of wildlife in the Ethiopian highlands. Observe quietly, keep a respectful distance and let the animals set the pace.", href: "/explore-ethiopia", link: "Explore Ethiopia" },
  culture: { category: "Culture & life", story: "People, heritage and everyday encounters are part of the journey. Make time for conversation and ask permission before photographing people.", href: "/explore-ethiopia", link: "Explore Ethiopia" },
} as const;

const collection: readonly [theme: keyof typeof themes, title: string, alt: string, location: string][] = [
  ["culture","A shared welcome","Travellers standing together in matching green and yellow shirts","Ethiopia"],
  ["landscapes","Above the valleys","A traveller with raised arms overlooking layered mountain valleys","Simien Mountains"],
  ["culture","At the doorway","Visitors and local hosts gathered at the doorway of a house","Ethiopia"],
  ["culture","Inside a place of history","Two visitors standing inside an earthen room with painted wall symbols","Ethiopia"],
  ["landscapes","Mountains all around","A traveller with outstretched arms above the Simien escarpment","Simien Mountains"],
  ["trail","Between the rocks","A hiker standing with open arms between tall rock formations","Ethiopian highlands"],
  ["landscapes","Open horizons","A traveller looking out over mountain ridges and a deep valley","Simien Mountains"],
  ["trail","A moment on the ridge","Two hikers standing together on a rocky mountain viewpoint","Simien Mountains"],
  ["wildlife","Across the high moorland","An Ethiopian wolf walking across rocky highland ground","Ethiopian highlands"],
  ["wildlife","The next generation","Ethiopian wolf pups gathered among rocks and highland plants","Ethiopian highlands"],
  ["culture","Stone and green","Weathered stone ruins surrounded by grass and trees","Gondar"],
  ["culture","Royal walls","A stone castle with rounded towers beneath a cloudy sky","Gondar"],
  ["culture","Roots and history","Large tree roots spreading over an old stone wall","Gondar"],
  ["culture","A portrait along the way","A person in a patterned wrap holding a rifle outdoors","Ethiopia"],
  ["culture","In the circle","Participants gathered in a circle holding long wooden sticks","Ethiopia"],
  ["culture","Among the gathering","A visitor wearing a white scarf among people dressed in white","Ethiopia"],
  ["culture","Time for coffee","A host and visitor with coffee beans, cups and a traditional coffee pot","Ethiopia"],
  ["trail","Along the cliff","A hiker standing on a narrow path beside a sandstone cliff","Ethiopian highlands"],
  ["culture","Craft in the details","A person with braided hair and bracelets holding a decorated gourd","Ethiopia"],
  ["culture","A city comes together","A visitor overlooking a large gathering in an urban square","Ethiopia"],
  ["culture","Patterns and adornment","Portrait of a person with painted facial patterns and a decorated lip plate","Ethiopia"],
  ["culture","Highland homes","Visitors beside tall woven houses with thatched roofs","Ethiopia"],
  ["culture","Carved from the rock","The rock-hewn church of Bete Giyorgis within its deep stone trench","Lalibela"],
  ["trail","Walking together","Two hikers with walking sticks resting at a mountain viewpoint","Simien Mountains"],
  ["trail","Room to breathe","A traveller sitting cross-legged with open arms above a mountain valley","Simien Mountains"],
  ["trail","A day to remember","Three travellers taking a photograph together in the mountains","Simien Mountains"],
  ["trail","Beside the escarpment","Two hikers posing on rocky ground above the Simien valleys","Simien Mountains"],
  ["culture","Beads and colour","Portrait of a person wearing a dark head covering and layered colourful beads","Ethiopia"],
  ["culture","Together in the landscape","Four people standing together in an open landscape beneath a blue sky","Ethiopia"],
  ["culture","A portrait in the light","Portrait of a person with painted facial patterns and red and white bead necklaces","Ethiopia"],
  ["culture","An afternoon gathering","A group of adults and children standing together outdoors","Ethiopia"],
  ["culture","Colour and tradition","Portrait of a person with braided hair, beaded necklaces and a decorated headband","Ethiopia"],
  ["trail","Shared mountain light","Four hikers resting together with mountain ridges behind them","Simien Mountains"],
];

/** Client-selected collection in the supplied gallery1–gallery33 order. */
export const photographs: readonly Photograph[] = collection.map(([theme, title, alt, location], index) => ({
  ...themes[theme],
  src: galleryImageUrl(index + 1),
  title,
  alt,
  location,
  ...(location === "Gondar" ? { href: "/gondar", link: "Explore Gondar" } : {}),
  ...(location === "Lalibela" ? { href: "/explore-ethiopia/lalibela", link: "Explore Lalibela" } : {}),
}));
