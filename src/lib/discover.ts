export interface DiscoverCollection {
  id: string;
  title: string;
  description: string;
  href: string;
  accent: string;
}

export const discoverCollections: DiscoverCollection[] = [
  {
    id: "cinematic-kling",
    title: "Cinematic Kling",
    description: "Short films and ads made with Kling",
    href: "/explore?tool=kling",
    accent: "from-brand-500/30 to-accent-500/10",
  },
  {
    id: "runway-loops",
    title: "Runway Loops",
    description: "Seamless ambient loops and motion studies",
    href: "/explore?tool=runway&genre=loop",
    accent: "from-emerald-500/20 to-cyan-500/10",
  },
  {
    id: "suno-mv",
    title: "Suno Music Videos",
    description: "AI music paired with generative visuals",
    href: "/explore?tool=suno&genre=music-video",
    accent: "from-violet-500/25 to-pink-500/10",
  },
  {
    id: "experimental",
    title: "Experimental Lab",
    description: "Strange, bold, and boundary-pushing work",
    href: "/explore?genre=experimental",
    accent: "from-amber-500/20 to-orange-500/10",
  },
  {
    id: "short-form",
    title: "Short Form Hits",
    description: "Vertical and snackable AI clips",
    href: "/explore?genre=short-form",
    accent: "from-sky-500/20 to-indigo-500/10",
  },
  {
    id: "animation",
    title: "Animation Showcase",
    description: "Character motion and stylized scenes",
    href: "/explore?genre=animation",
    accent: "from-rose-500/20 to-fuchsia-500/10",
  },
  {
    id: "trending-this-week",
    title: "Trending This Week",
    description: "This week's most-liked and saved AI videos",
    href: "/explore?sort=trending",
    accent: "from-brand-500/30 to-amber-500/15",
  },
  {
    id: "tool-starter-kit",
    title: "Tool Starter Kit",
    description: "Best beginner examples from Kling, Runway, and PixVerse",
    href: "/explore?collection=tool-starter-kit",
    accent: "from-cyan-500/25 to-violet-500/10",
  },
  {
    id: "challenge-gallery",
    title: "Challenge Gallery",
    description: "Creative submissions from the community challenges",
    href: "/explore?tag=challenge",
    accent: "from-rose-500/25 to-fuchsia-500/10",
  },
];

export function getDiscoverCollections(): DiscoverCollection[] {
  return discoverCollections;
}
