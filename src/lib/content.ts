// Every fact here is taken from americanunderdecksystems.com (Home, Services,
// About, Colors, Gallery, Warranty, Contact) or the company's official YouTube
// channel. Nothing is invented: no names, ratings, or specs that aren't published.

export const company = {
  name: "American Underdeck Systems",
  short: "American Underdeck",
  phone: "(404) 914-6959",
  phoneHref: "tel:+14049146959",
  location: "Marietta, Georgia",
  hours: [
    { days: "Monday – Friday", time: "8:00 – 18:00" },
    { days: "Saturday", time: "8:00 – 12:00" },
    { days: "Sunday", time: "Closed" },
  ],
  social: {
    facebook: "https://www.facebook.com/americanunderdeck",
    instagram: "https://www.instagram.com/american_underdeck/",
    youtube: "https://www.youtube.com/@americanunderdecksystems6811",
  },
  website: "https://americanunderdecksystems.com/",
};

export type Photo = {
  src: string;
  width: number;
  height: number;
  alt: string;
  caption: string;
};

export const photos = {
  lakeside: {
    src: "/images/projects/lakeside-terrace.jpg",
    width: 1353,
    height: 842,
    alt: "Finished white under deck ceiling with two ceiling fans over a stone-columned patio, dining set, pool and lake beyond",
    caption: "Lakeside terrace",
  },
  timberLodge: {
    src: "/images/projects/timber-lodge.jpg",
    width: 1340,
    height: 840,
    alt: "Log home with a wraparound upper deck and a finished white ceiling beneath it, framed by cedar posts",
    caption: "Timber lodge",
  },
  brickVeranda: {
    src: "/images/projects/brick-veranda.jpg",
    width: 1353,
    height: 840,
    alt: "Curved red-brick facade under a white under deck ceiling with recessed lights, lantern fans and a downspout",
    caption: "Brick veranda",
  },
  entertainer: {
    src: "/images/projects/two-level-entertainer.jpg",
    width: 1353,
    height: 841,
    alt: "Two stacked deck levels with lit ceilings, an outdoor kitchen, wall-mounted TV, dining table and hot tub below",
    caption: "Two-level entertainer",
  },
  whiteBrick: {
    src: "/images/projects/white-brick-graphite.webp",
    width: 810,
    height: 496,
    alt: "Graphite under deck ceiling with recessed lights over a tiled patio, white-painted brick columns and built-in wood benches",
    caption: "Graphite ceiling, white brick",
  },
  eveningLounge: {
    src: "/images/projects/evening-lounge.jpg",
    width: 1623,
    height: 1257,
    alt: "Evening lounge under a deck: recessed lights, ceiling fan, TV, orange cushioned chairs and hanging flower baskets",
    caption: "Evening lounge",
  },
  stairDining: {
    src: "/images/projects/stair-dining.webp",
    width: 476,
    height: 496,
    alt: "Bright white under deck ceiling seen from below the stairs, with fans over a wooden dining table",
    caption: "Garden dining",
  },
  bayWindow: {
    src: "/images/projects/bay-window-cedar.webp",
    width: 476,
    height: 339,
    alt: "Raised deck on cedar posts with a white ceiling over a bay window and paver patio",
    caption: "Bay window porch",
  },
  brickCedar: {
    src: "/images/projects/brick-cedar-posts.webp",
    width: 476,
    height: 361,
    alt: "Brick home with stained cedar posts and a finished ceiling under a second-story deck",
    caption: "Cedar and brick",
  },
  slabPatio: {
    src: "/images/projects/slab-patio.webp",
    width: 360,
    height: 286,
    alt: "Graphite ceiling with black fans over a new concrete slab patio",
    caption: "New slab patio",
  },
  colonnade: {
    src: "/images/projects/stone-colonnade.webp",
    width: 360,
    height: 286,
    alt: "Long covered patio with white columns on stone bases under a white ceiling",
    caption: "Stone colonnade",
  },
} satisfies Record<string, Photo>;

export const galleryOrder: Photo[] = [
  photos.lakeside,
  photos.entertainer,
  photos.whiteBrick,
  photos.timberLodge,
  photos.eveningLounge,
  photos.brickVeranda,
  photos.stairDining,
  photos.colonnade,
  photos.brickCedar,
];

// Gallery page "Before and After": each file is one project photographed
// before and after, side by side, in a single 1024×380 image.
export const beforeAfterPairs = [
  2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19,
].map((n) => ({
  id: n,
  src: `/images/before-after/pair-${String(n).padStart(2, "0")}.png`,
}));

export const benefits = [
  {
    title: "Doubles your outdoor living space",
    body: "As above, so below: your under deck space spans the same dimensions as the deck above it. A real ceiling replaces the underside of the deck, keeps out moisture and debris, and makes the space look complete.",
  },
  {
    title: "Enjoy the outdoors in any weather",
    body: "Rain, extreme heat or freezing temperatures don’t have to end the evening. Step below the deck and stay out of the elements — some setups even allow a fireplace for year-round use.",
  },
  {
    title: "Explore unlimited possibilities",
    body: "Outdoor dining and cooking, a bar and big screen TV, a fire pit, a pool table — or simply a swing and a hammock. Ceiling fans, lights and built-in speakers make it even more comfortable.",
  },
];

// The scroll story. Copy paraphrases the Services and Warranty pages; the
// visualization is conceptual and labelled as such on the page.
export const systemSteps = [
  {
    title: "The deck above",
    body: "Water falls through the gaps between deck boards. Left alone, it drips onto whatever — and whoever — is underneath.",
  },
  {
    title: "Flashed and sealed",
    body: "Our standard practice is to seal and flash all areas which may have the potential to leak.",
  },
  {
    title: "A professional drainage system",
    body: "Installed beneath the deck, the drainage system catches the water that passes through the cracks in your upper deck.",
  },
  {
    title: "Rerouted, not dripped",
    body: "The guttering carries the water away from the space below — protecting the ceiling and everything under it.",
  },
  {
    title: "A real ceiling overhead",
    body: "Finished, lit and dry: a space that looks like a natural extension of your home, protected from the elements.",
  },
];

export const possibilities = [
  {
    title: "Outdoor living rooms",
    body: "Seating, a big screen TV and lighting under a finished ceiling.",
    photo: photos.eveningLounge,
  },
  {
    title: "Entertainment areas",
    body: "A bar, a TV, a hot tub — room for the whole game day.",
    photo: photos.entertainer,
  },
  {
    title: "Outdoor dining",
    body: "Cook and eat outside, sheltered from sun and rain.",
    photo: photos.lakeside,
  },
  {
    title: "Covered patios",
    body: "Pour a concrete slab for easy care, or tile for a higher-end look.",
    photo: photos.whiteBrick,
  },
  {
    title: "Relaxation spaces",
    body: "Keep it simple: a swing, a hammock and a ceiling fan.",
    photo: photos.stairDining,
  },
];

// Colors page — "Traditional painted aluminum". Hex values are sampled from
// the swatch images on the site, so they approximate the real finish.
// `suspended` reflects the site's note: temporarily suspended due to
// industry-wide supply shortages.
export const finishes: { name: string; hex: string; suspended?: boolean }[] = [
  { name: "White 30°", hex: "#e9ebe8" },
  { name: "White 80°", hex: "#edeee7" },
  { name: "Herringbone", hex: "#dcd4c7" },
  { name: "Wicker", hex: "#d5c3a7" },
  { name: "Clay", hex: "#aca697" },
  { name: "Light Bronze", hex: "#7a6e68" },
  { name: "Tuxedo Grey", hex: "#55544e" },
  { name: "Dark Bronze", hex: "#444543" },
  { name: "Beaver Brown", hex: "#5e4a3b" },
  { name: "Royal Brown", hex: "#523a35" },
  { name: "Musket Brown", hex: "#3f332b" },
  { name: "Black", hex: "#121617" },
  { name: "Almond", hex: "#dfd8c9", suspended: true },
  { name: "Antique Ivory", hex: "#d9c5a7", suspended: true },
  { name: "Buckskin Brown", hex: "#947545", suspended: true },
  { name: "Classic Cream", hex: "#e7d4b6", suspended: true },
  { name: "Colonial Blue", hex: "#647e8e", suspended: true },
  { name: "Colonial Gray", hex: "#bebcbe", suspended: true },
  { name: "Colonial Red", hex: "#793b33", suspended: true },
  { name: "Copper Metallic", hex: "#ca782f", suspended: true },
  { name: "Dove Gray", hex: "#888c8e", suspended: true },
  { name: "Heritage Cream", hex: "#f5e6c5", suspended: true },
  { name: "Linen", hex: "#eeecda", suspended: true },
  { name: "Paint Grip Metallic", hex: "#7c7d7f", suspended: true },
  { name: "Raffia Beige", hex: "#d9ccb2", suspended: true },
  { name: "Sherwood Green", hex: "#3e6558", suspended: true },
];

export const warranty = {
  installation: {
    title: "50-year no-leak installation warranty",
    body: "Covers leaking, dripping and abnormal functionality due to improper or inadequate installation procedures.",
  },
  material: {
    title: "Material and finish warranty",
    body: "For as long as you own your home, against paint, substrate or material failure. Workmanship is covered in the first year.",
  },
  exclusions: [
    "Internal support posts and cantilever posts",
    "Deck railing posts that protrude through the deck surface",
    "Non-standard construction that prevents flashing",
    "Inadequate or missing ledger board flashing",
    "Porous masonry walls, brick and stone",
    "Water that has penetrated the structural wall",
    "Ice build-up from external heat sources in snow areas",
    "Laminated beams and lapped joists we can’t flash over",
    "Leaks in abnormally heavy rains (temporary)",
    "Inaccessible areas",
    "Clogs from tree and bird feeder debris",
    "Deterioration from pet urine",
    "Downspouts protruding through, or dumping into, the system",
    "Sistered joists and beams",
  ],
  notCovered:
    "Damage, acts of God and natural disasters, cleaning and maintenance are not covered. Leaks outside the guttering/ceiling system are not the responsibility of American Underdeck Systems.",
  claimSteps: [
    "Call (404) 914-6959 as soon as you notice the problem.",
    "Share the precise location and photographs so we can pre-diagnose it.",
    "If a visit is needed, a technician inspects the installation.",
    "Covered occurrences are resolved at no cost to the homeowner.",
  ],
};

// Official channel: @americanunderdecksystems6811 — verified via YouTube oEmbed.
// All are short vertical phone videos.
export const videos = {
  beforeAfter: [
    { id: "dmK7VF5wN24", title: "Before and after 1" },
    { id: "V-2TNudQ-Os", title: "Before and after 2" },
    { id: "WvY0hzJJAgM", title: "Before and after 3" },
    { id: "0gNGtsfazy8", title: "Before and after 4" },
    { id: "NzYCczxHGXg", title: "Before and after 5" },
    { id: "j2I2NdNgm4k", title: "Before and after 6" },
    { id: "KeQ1qN33Urg", title: "Before and after 7" },
    { id: "URM5ZXwuEy0", title: "Before and after 8" },
    { id: "gQg7gcAFb-8", title: "Before and after 9" },
    { id: "uYSb1p0UQ-c", title: "Before and after 10" },
  ],
  reviews: [
    { id: "DVFVcP_CbYU", title: "Reviews 1" },
    { id: "C-ASYc5_eXI", title: "Reviews 2" },
    { id: "jXJBOWBHyYw", title: "Reviews 3" },
    { id: "iHJXhmjtSVQ", title: "Reviews 4" },
    { id: "hQqgRmBhDNI", title: "Reviews 5" },
    { id: "SG84eRf4Lzk", title: "Reviews 6" },
    { id: "1AX1csA2zbE", title: "Reviews 7" },
    { id: "BgiNTZlF3J4", title: "Reviews 8" },
    { id: "Y_bfEh9p1yE", title: "Reviews 9" },
    { id: "_M_HLIgc_XM", title: "Reviews 10" },
    { id: "IqAJr_V2EXA", title: "Reviews 11" },
    { id: "573fXaO-S0s", title: "Reviews 12" },
    { id: "Dj6VcKkvz98", title: "Reviews 13" },
    { id: "U5JKgpztWiA", title: "Reviews 14" },
    { id: "fprf_re8tdM", title: "Reviews 15" },
    { id: "OZH1jV_al-c", title: "Reviews 16" },
    { id: "WHKw0JfKwm8", title: "Reviews 17" },
  ],
};

export const nav = [
  { href: "#system", label: "The system" },
  { href: "#work", label: "Work" },
  { href: "#finishes", label: "Finishes" },
  { href: "#warranty", label: "Warranty" },
  { href: "#films", label: "Films" },
];
