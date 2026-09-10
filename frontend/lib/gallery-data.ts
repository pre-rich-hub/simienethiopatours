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

export const photographs: readonly Photograph[] = [
  { src: "/images/imet-gogo.jpg", title: "At the edge of forever", location: "Imet Gogo", category: "Landscapes", alt: "Rocky Imet Gogo promontory above the deep Simien valleys", story: "Ridges unfold beyond the escarpment. At Imet Gogo, the scale of the mountains invites you to stop walking and simply look.", href: "/simien-mountains", link: "Discover the Simien" },
  { src: "/images/gelada-troop.jpg", title: "In wild company", location: "Simien highlands", category: "Wildlife", alt: "Wild geladas gathered in the grass of the Simien highlands", story: "A troop grazes, rests and moves through the highland grass. Keep a respectful distance and let their everyday rhythm set the pace.", href: "/simien-mountains", link: "Meet the mountains" },
  { src: "/images/fasil-ghebbi.jpg", title: "Stories set in stone", location: "Fasil Ghebbi · Gondar", category: "Culture & life", alt: "Stone vaults and royal architecture at Fasil Ghebbi in Gondar", story: "Stone passageways and royal architecture hold another side of the highlands. Gondar gives the journey a beginning long before the first trail.", href: "/gondar", link: "Explore Gondar" },
  { src: "/images/geech-camp.jpg", title: "Room to slow down", location: "Geech camp", category: "On the trail", alt: "Colourful trekking tents pitched at Geech camp in the Simien Mountains", story: "A tent, open country and time to settle in. Mountain camps bring the small moments between walking days into view.", href: "/treks", link: "Find your trek" },
  { src: "/images/road-to-simien.jpg", title: "The life between", location: "The road to Simien", category: "Culture & life", alt: "Women collecting water along the road to the Simien Mountains", story: "The road to the mountains passes through a lived-in landscape. Conversations and permission come first when photographing the people who call it home.", href: "/beyond-the-trail", link: "Go beyond the trail" },
  { src: "/images/giant-lobelia.jpg", title: "Wonder in the details", location: "Simien highlands", category: "Landscapes", alt: "Giant lobelias growing in the open Simien highlands", story: "Look away from the horizon for a moment. The sculptural forms of giant lobelias give the highland landscape a character all its own.", href: "/simien-photography-tour", link: "Explore photography journeys" },
  { src: "/images/chenek-camp.jpg", title: "Where the trail takes you", location: "Chenek camp", category: "On the trail", alt: "Mountain landscape around Chenek camp in the Simien Mountains", story: "The country around Chenek is a reason to linger. Each turn of the trail offers another perspective on the escarpment.", href: "/treks", link: "Explore the journeys" },
  { src: "/images/simien-panorama.jpg", title: "Some things need to be felt.", location: "Simien Mountains · Ethiopia", category: "Landscapes", alt: "An expansive panorama of the Simien Mountains and their layered valleys", story: "A photograph offers a glimpse. The open space, the mountain air and the feeling of standing here belong to the journey itself.", href: "/plan", link: "Plan your own moment" },
];