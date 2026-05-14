import { Artist, Artwork, WipStage, HeritageStory, Inquiry } from "@shilpakala/shared";

// ─── Seed Artists ─────────────────────────────────────────────────────────────
export const artists: Artist[] = [
  {
    id: "artist-001",
    name: "Ramu Shilpi",
    location: "Shivarapatna, Karnataka",
    bio: "Master stone carver with 35 years of experience in Hoysala-style sculptures. Known for intricate deity carvings in chloritic schist.",
    specialization: "Hoysala",
    phone: "+91-9876543210",
    whatsapp: "+919876543210",
    profileImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    verified: true,
    createdAt: "2024-01-15T10:00:00.000Z",
  },
  {
    id: "artist-002",
    name: "Lakshmi Devi",
    location: "Hampi, Karnataka",
    bio: "Specializes in Chalukyan temple architecture replicas and Vijayanagara-era motifs. Third-generation sculptor.",
    specialization: "Chalukya",
    phone: "+91-9123456789",
    whatsapp: "+919123456789",
    profileImage: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400",
    verified: true,
    createdAt: "2024-02-20T10:00:00.000Z",
  },
  {
    id: "artist-003",
    name: "Venkatesh Acharya",
    location: "Mahabalipuram, Tamil Nadu",
    bio: "Award-winning wood and stone carver specialising in Dravidian Gopuram figures and Pallava-period bas-reliefs.",
    specialization: "Dravidian",
    phone: "+91-9988776655",
    whatsapp: "+919988776655",
    profileImage: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400",
    verified: true,
    createdAt: "2024-03-10T10:00:00.000Z",
  },
];

// ─── Seed Artworks ────────────────────────────────────────────────────────────
export const artworks: Artwork[] = [
  {
    id: "art-001",
    artistId: "artist-001",
    title: "Lord Ganesha – Hoysala Style",
    description: "A stunning 18-inch Ganesha carved from fine chloritic schist with the characteristic Hoysala geometric border patterns and star-shaped plinth.",
    style: "Hoysala",
    material: "Chloritic Schist",
    dimensions: "18 x 10 x 8 inches",
    price: 45000,
    currency: "INR",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800",
      "https://images.unsplash.com/photo-1580820267682-426da823b514?w=800",
      "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=800",
    ],
    thumbnailImage: "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=400",
    productId: "SKU-HOY-001",
    createdAt: "2024-04-01T10:00:00.000Z",
    updatedAt: "2024-04-01T10:00:00.000Z",
  },
  {
    id: "art-002",
    artistId: "artist-001",
    title: "Nataraja – Dancing Shiva",
    description: "Rare Hoysala interpretation of Nataraja with 64 cosmic dance poses rendered in breathtaking detail. Each feather of the aureole is individually carved.",
    style: "Hoysala",
    material: "Black Granite",
    dimensions: "24 x 16 x 10 inches",
    price: 120000,
    currency: "INR",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1604423532872-d9d9c8a7b6e7?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    ],
    thumbnailImage: "https://images.unsplash.com/photo-1604423532872-d9d9c8a7b6e7?w=400",
    productId: "SKU-HOY-002",
    createdAt: "2024-04-05T10:00:00.000Z",
    updatedAt: "2024-04-05T10:00:00.000Z",
  },
  {
    id: "art-003",
    artistId: "artist-002",
    title: "Durga Mahishasuramardini",
    description: "A dynamic 10-armed Durga slaying Mahishasura, carved in the Chalukya style. Intricate jewellery and garment folds showcase mastery of the craft.",
    style: "Chalukya",
    material: "Sandstone",
    dimensions: "30 x 18 x 12 inches",
    price: 85000,
    currency: "INR",
    status: "wip",
    images: [
      "https://images.unsplash.com/photo-1590080875897-9a4f5421bab3?w=800",
    ],
    thumbnailImage: "https://images.unsplash.com/photo-1590080875897-9a4f5421bab3?w=400",
    productId: "SKU-CHA-003",
    createdAt: "2024-04-10T10:00:00.000Z",
    updatedAt: "2024-05-01T10:00:00.000Z",
  },
  {
    id: "art-004",
    artistId: "artist-003",
    title: "Arjuna's Penance – Bas Relief Panel",
    description: "Reproduction of the iconic Arjuna's Penance bas-relief from Mahabalipuram. 120+ figures carved in the Pallava tradition.",
    style: "Dravidian",
    material: "Granite",
    dimensions: "48 x 24 x 4 inches",
    price: 350000,
    currency: "INR",
    status: "available",
    images: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
    ],
    thumbnailImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=400",
    productId: "SKU-DRA-004",
    createdAt: "2024-03-20T10:00:00.000Z",
    updatedAt: "2024-03-20T10:00:00.000Z",
  },
  {
    id: "art-005",
    artistId: "artist-001",
    title: "Lakshmi – Lotus Throne",
    description: "Goddess Lakshmi seated on a lotus, carved in the classic Hoysala style with delicate filigree work around the halo.",
    style: "Hoysala",
    material: "Chloritic Schist",
    dimensions: "14 x 9 x 6 inches",
    price: 32000,
    currency: "INR",
    status: "sold",
    images: [
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800",
    ],
    thumbnailImage: "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=400",
    productId: "SKU-HOY-005",
    createdAt: "2024-02-10T10:00:00.000Z",
    updatedAt: "2024-04-20T10:00:00.000Z",
  },
];

// ─── Seed WIP Stages ──────────────────────────────────────────────────────────
export const wipStages: WipStage[] = [
  {
    id: "wip-001",
    artworkId: "art-003",
    artistId: "artist-002",
    title: "Selecting the Sandstone Block",
    description: "A 200-kg block of Rajastan sandstone selected for its even grain and colour. The block is blessed with a traditional puja.",
    stage: 1,
    stageLabel: "Raw Block",
    image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800",
    createdAt: "2024-04-10T08:00:00.000Z",
  },
  {
    id: "wip-002",
    artworkId: "art-003",
    artistId: "artist-002",
    title: "Rough Outline Carved",
    description: "Using steel chisels and a hammer, the rough silhouette of the 10-armed Durga is blocked out. About 40 kg of stone removed.",
    stage: 2,
    stageLabel: "Rough Carving",
    image: "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?w=800",
    createdAt: "2024-04-18T08:00:00.000Z",
  },
  {
    id: "wip-003",
    artworkId: "art-003",
    artistId: "artist-002",
    title: "Arms and Weapons Taking Shape",
    description: "The 10 arms are now defined. Each weapon — trident, sword, shield, conch — is being individually shaped using fine chisels.",
    stage: 3,
    stageLabel: "Detail Work",
    image: "https://images.unsplash.com/photo-1568667256549-094345857637?w=800",
    createdAt: "2024-04-28T08:00:00.000Z",
  },
  {
    id: "wip-004",
    artworkId: "art-003",
    artistId: "artist-002",
    title: "Finishing & Polishing Begins",
    description: "Jewellery and garland details are being carved. The face is being refined. Surface polishing with sandstone grit has started.",
    stage: 4,
    stageLabel: "Finishing",
    image: "https://images.unsplash.com/photo-1604869515882-4d10fa4b0492?w=800",
    createdAt: "2024-05-05T08:00:00.000Z",
  },
];

// ─── Seed Heritage Stories ────────────────────────────────────────────────────
export const heritageStories: HeritageStory[] = [
  {
    id: "heritage-001",
    style: "Hoysala",
    title: "The Hoysala Legacy",
    subtitle: "Star-shaped temples & microscopic detailing from 12th-century Karnataka",
    content: `The Hoysala Empire (1000–1346 AD) produced one of India's most distinctive architectural and sculptural traditions. Centred around Belur, Halebidu and Somnathapura in modern Karnataka, Hoysala craftsmen worked primarily in soft chloritic schist (soapstone), which hardens on exposure to air.

What makes Hoysala sculptures unmistakable is the extraordinary density of decoration — no surface is left plain. Friezes of elephants, horses, scrolling foliage, epics scenes and rows of deities wrap around the star-shaped (stellate) plans of their temples. A single bracket figure can contain over 200 individually carved jewellery beads.

Shilpis from Shivarapatna continue this tradition today, hand-carving replicas and original compositions using the same chisel techniques passed down over 800 years. Their work takes weeks to months per piece and cannot be replicated by machine.`,
    period: "1000 AD – 1346 AD",
    region: "Belur, Halebidu, Somnathapura – Karnataka, India",
    keyFeatures: [
      "Star-shaped (stellate) plinth plans",
      "Chloritic schist (soapstone) material",
      "Friezes of elephants, horses & epics",
      "Lathe-turned pillars with extreme precision",
      "Dense jewellery carving on figures",
      "Bracket figures (Madanikas) of exceptional grace",
    ],
    coverImage: "https://images.unsplash.com/photo-1599420186946-7b6fb4e297f0?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1580820267682-426da823b514?w=800",
      "https://images.unsplash.com/photo-1567095761054-7a02e69e5c43?w=800",
      "https://images.unsplash.com/photo-1590080875897-9a4f5421bab3?w=800",
    ],
    createdAt: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "heritage-002",
    style: "Chalukya",
    title: "The Chalukyan Tradition",
    subtitle: "Bridging the Deccan — bold forms from 6th-century Badami",
    content: `The Chalukyas of Badami (543–757 AD) and their successors established a sculptural vocabulary that bridges North and South Indian temple styles. Working in the red sandstone of Badami and Aihole, they created cave temples and free-standing shrines whose sculptures combine the sensuousness of Gupta art with emerging Dravida forms.

Chalukyan sculpture is distinguished by powerful, three-dimensional forms, Nataraja panels with dramatic movement, and Vishnu panels of great cosmological ambition. The Durga temple at Aihole and the Virupaksha temple at Pattadakal are UNESCO-protected exemplars.

Contemporary Chalukya-style carvers in Hampi draw on this legacy, producing both temple-commission work and gallery pieces for collectors worldwide.`,
    period: "543 AD – 1189 AD",
    region: "Badami, Aihole, Pattadakal – Karnataka, India",
    keyFeatures: [
      "Red sandstone as primary medium",
      "Three-dimensional, powerful figural forms",
      "Fusion of Nagara & Dravida architectural elements",
      "Dynamic multi-armed deity compositions",
      "Decorative kirtimukha (face of glory) motifs",
    ],
    coverImage: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=800",
      "https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800",
    ],
    createdAt: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "heritage-003",
    style: "Dravidian",
    title: "Dravidian Grandeur",
    subtitle: "Towering Gopurams & epic bas-reliefs from the Pallava shore",
    content: `The Dravidian style, codified by the Pallava dynasty (275–897 AD) at Mahabalipuram, is the fountainhead of South Indian temple architecture. The shore temples and monolithic rathas of Mahabalipuram, carved directly from granite outcrops, represent the earliest stone temples of South India.

The Pallava sculptors developed the bas-relief tradition to extraordinary heights — the Arjuna's Penance panel (27 m wide, 9 m tall) remains the world's largest open-air bas-relief, with 150+ figures carved with consummate naturalism. Later, the Chola, Vijayanagara and Nayak rulers extended the Dravidian tradition, culminating in the towering Gopurams of Madurai and Srirangam.

Mahabalipuram sculptors today are internationally recognised; their workshops receive commissions from temples across Asia and museums worldwide.`,
    period: "275 AD – 1700 AD",
    region: "Mahabalipuram, Kanchipuram – Tamil Nadu, India",
    keyFeatures: [
      "Granite as primary medium",
      "Monolithic rock-cut architecture",
      "Large-scale narrative bas-reliefs",
      "Towering Gopuram gateways",
      "Bronze-casting tradition (Chola Nataraja)",
      "Vimana (shrine tower) with curved profile",
    ],
    coverImage: "https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=1200",
    gallery: [
      "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800",
      "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800",
    ],
    createdAt: "2024-01-03T00:00:00.000Z",
  },
];

// ─── Inquiries ────────────────────────────────────────────────────────────────
export const inquiries: Inquiry[] = [];

