export interface Region {
  id: string;
  name: string;
  historicalName: string;
  lat: number;
  lng: number;
  emoji: string;
  description: string;
  category: "western-europe" | "eastern-europe" | "mediterranean" | "middle-east" | "north-africa" | "scandinavia";
}

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export interface ConversationEntry {
  query: string;
  era: string;
  response: string;
  timestamp: number;
}

export interface HistorySession {
  region: Region;
  messages: Message[];
  entries: ConversationEntry[];
}

export const ERA_SUGGESTIONS = [
  { label: "Ancient Greece",     years: "800 – 146 BC" },
  { label: "Roman Empire",       years: "27 BC – 476 AD" },
  { label: "Viking Age",         years: "793 – 1066 AD" },
  { label: "Medieval",           years: "500 – 1400 AD" },
  { label: "Byzantine",          years: "330 – 1453 AD" },
  { label: "Crusades",           years: "1095 – 1291 AD" },
  { label: "Renaissance",        years: "1300 – 1600 AD" },
  { label: "Ottoman Empire",     years: "1299 – 1922 AD" },
  { label: "Age of Exploration", years: "1400 – 1600 AD" },
  { label: "Thirty Years War",   years: "1618 – 1648" },
  { label: "Napoleonic Era",     years: "1799 – 1815" },
  { label: "World War I",        years: "1914 – 1918" },
  { label: "World War II",       years: "1939 – 1945" },
  { label: "Cold War",           years: "1947 – 1991" },
];

export const CATEGORY_LABELS: Record<Region["category"], string> = {
  "western-europe":  "Western Europe",
  "eastern-europe":  "Eastern Europe",
  "mediterranean":   "Mediterranean",
  "middle-east":     "Middle East",
  "north-africa":    "North Africa",
  "scandinavia":     "Scandinavia",
};

export const EUROPEAN_REGIONS: Region[] = [
  // ── Western Europe ────────────────────────────────────────────
  {
    id: "rome", name: "Rome / Italian Peninsula", historicalName: "Roma Aeterna",
    lat: 41.9028, lng: 12.4964, emoji: "🏛️",
    description: "Heart of the Roman Empire and Renaissance",
    category: "mediterranean",
  },
  {
    id: "venice", name: "Venice / Adriatic Coast", historicalName: "Serenissima",
    lat: 45.4408, lng: 12.3155, emoji: "🚢",
    description: "Merchant republic and gateway to the East",
    category: "mediterranean",
  },
  {
    id: "florence", name: "Florence / Tuscany", historicalName: "Florentia",
    lat: 43.7696, lng: 11.2558, emoji: "🎨",
    description: "Birthplace of the Renaissance and Medici power",
    category: "mediterranean",
  },
  {
    id: "paris", name: "Gaul / France", historicalName: "Gallia / Frankia",
    lat: 48.8566, lng: 2.3522, emoji: "⚜️",
    description: "From Celtic tribes to the French Revolution",
    category: "western-europe",
  },
  {
    id: "london", name: "Britannia / England", historicalName: "Albion",
    lat: 51.5074, lng: -0.1278, emoji: "🗡️",
    description: "Roman province to global empire",
    category: "western-europe",
  },
  {
    id: "edinburgh", name: "Scotland / Caledonia", historicalName: "Caledonia",
    lat: 55.9533, lng: -3.1883, emoji: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    description: "Fierce Pictish resistance and Highland clans",
    category: "western-europe",
  },
  {
    id: "dublin", name: "Ireland / Hibernia", historicalName: "Hibernia",
    lat: 53.3498, lng: -6.2603, emoji: "🍀",
    description: "Celtic monks, Viking raids, and Gaelic kings",
    category: "western-europe",
  },
  {
    id: "madrid", name: "Iberia / Spain", historicalName: "Hispania / Al-Andalus",
    lat: 40.4168, lng: -3.7038, emoji: "🏰",
    description: "Moorish Andalusia to the Spanish Empire",
    category: "western-europe",
  },
  {
    id: "lisbon", name: "Portugal / Atlantic Coast", historicalName: "Lusitania",
    lat: 38.7223, lng: -9.1393, emoji: "⛵",
    description: "Vanguard of the Age of Exploration",
    category: "western-europe",
  },
  {
    id: "amsterdam", name: "Low Countries / Netherlands", historicalName: "Belgica / Holland",
    lat: 52.3676, lng: 4.9041, emoji: "🌷",
    description: "Merchant republic and Golden Age of trade",
    category: "western-europe",
  },
  {
    id: "berlin", name: "Germania / Prussia", historicalName: "Germania Magna",
    lat: 52.5200, lng: 13.4050, emoji: "🦅",
    description: "Tribal lands to Prussian military might",
    category: "western-europe",
  },
  {
    id: "vienna", name: "Austria / Danube", historicalName: "Vindobona / Habsburg",
    lat: 48.2082, lng: 16.3738, emoji: "👑",
    description: "Gateway between East and West Europe",
    category: "western-europe",
  },
  {
    id: "prague", name: "Bohemia / Czech Lands", historicalName: "Bohemia / Praha",
    lat: 50.0755, lng: 14.4378, emoji: "🏯",
    description: "Kingdom of Bohemia and Hussite reformation",
    category: "western-europe",
  },

  // ── Scandinavia ───────────────────────────────────────────────
  {
    id: "stockholm", name: "Scandinavia / Sweden", historicalName: "Norden / Svea",
    lat: 59.3293, lng: 18.0686, emoji: "⚓",
    description: "Norse seafarers who shaped medieval Europe",
    category: "scandinavia",
  },
  {
    id: "oslo", name: "Norway / Norse Lands", historicalName: "Norðrvegr",
    lat: 59.9139, lng: 10.7522, emoji: "🪓",
    description: "Viking homeland and longship culture",
    category: "scandinavia",
  },
  {
    id: "copenhagen", name: "Denmark / Jutland", historicalName: "Dania",
    lat: 55.6761, lng: 12.5683, emoji: "🐉",
    description: "Viking raiders who became North Sea kings",
    category: "scandinavia",
  },

  // ── Eastern Europe ────────────────────────────────────────────
  {
    id: "warsaw", name: "Poland / Commonwealth", historicalName: "Polonia / Rzeczpospolita",
    lat: 52.2297, lng: 21.0122, emoji: "🦁",
    description: "The Polish-Lithuanian Commonwealth and partitions",
    category: "eastern-europe",
  },
  {
    id: "budapest", name: "Hungary / Pannonia", historicalName: "Pannonia / Magyar",
    lat: 47.4979, lng: 19.0402, emoji: "🏔️",
    description: "Magyar kingdom and bulwark against invasion",
    category: "eastern-europe",
  },
  {
    id: "belgrade", name: "Serbia / Balkans", historicalName: "Singidunum / Raska",
    lat: 44.8176, lng: 20.4569, emoji: "⚔️",
    description: "Crossroads of empires from Rome to Ottomans",
    category: "eastern-europe",
  },
  {
    id: "kyiv", name: "Ukraine / Kievan Rus", historicalName: "Kyiv / Rus",
    lat: 50.4501, lng: 30.5234, emoji: "🌾",
    description: "Cradle of East Slavic civilisation",
    category: "eastern-europe",
  },
  {
    id: "moscow", name: "Russia / Muscovy", historicalName: "Moskovia / Rus",
    lat: 55.7558, lng: 37.6173, emoji: "🌲",
    description: "Kievan Rus to the Russian Empire",
    category: "eastern-europe",
  },
  {
    id: "novgorod", name: "Novgorod Republic", historicalName: "Господин Великий Новгород",
    lat: 58.5260, lng: 31.2750, emoji: "🏘️",
    description: "The great medieval merchant republic of the North",
    category: "eastern-europe",
  },
  {
    id: "bucharest", name: "Wallachia / Romania", historicalName: "Valahia / Dacia",
    lat: 44.4268, lng: 26.1025, emoji: "🧛",
    description: "Vlad the Impaler's domain and Dacian legacy",
    category: "eastern-europe",
  },

  // ── Mediterranean ─────────────────────────────────────────────
  {
    id: "athens", name: "Greece / Athens", historicalName: "Hellas",
    lat: 37.9838, lng: 23.7275, emoji: "🏺",
    description: "Birthplace of democracy and philosophy",
    category: "mediterranean",
  },
  {
    id: "sparta", name: "Sparta / Laconia", historicalName: "Lacedaemon",
    lat: 37.0756, lng: 22.4274, emoji: "🛡️",
    description: "Warrior city-state and rival of Athens",
    category: "mediterranean",
  },
  {
    id: "istanbul", name: "Constantinople / Byzantium", historicalName: "Byzantium / Kostantiniyye",
    lat: 41.0082, lng: 28.9784, emoji: "🕌",
    description: "Crossroads of empires for two millennia",
    category: "mediterranean",
  },
  {
    id: "marseille", name: "Provence / Massalia", historicalName: "Massalia / Provincia",
    lat: 43.2965, lng: 5.3698, emoji: "🪔",
    description: "Ancient Greek colony turned Roman province",
    category: "mediterranean",
  },
  {
    id: "barcelona", name: "Catalonia / Aragon", historicalName: "Barcino / Cathalonia",
    lat: 41.3851, lng: 2.1734, emoji: "🌹",
    description: "Crown of Aragon and Mediterranean sea power",
    category: "mediterranean",
  },

  // ── Middle East ───────────────────────────────────────────────
  {
    id: "jerusalem", name: "Jerusalem / Holy Land", historicalName: "Hierosolyma / Al-Quds",
    lat: 31.7683, lng: 35.2137, emoji: "✡️",
    description: "Sacred city of three Abrahamic faiths",
    category: "middle-east",
  },
  {
    id: "baghdad", name: "Mesopotamia / Baghdad", historicalName: "Babel / Madinat al-Salam",
    lat: 33.3152, lng: 44.3661, emoji: "📜",
    description: "Cradle of civilisation and Abbasid Caliphate",
    category: "middle-east",
  },
  {
    id: "damascus", name: "Syria / Damascus", historicalName: "Dimashq / Aram",
    lat: 33.5138, lng: 36.2765, emoji: "🌙",
    description: "World's oldest continuously inhabited city",
    category: "middle-east",
  },
  {
    id: "antioch", name: "Anatolia / Antioch", historicalName: "Antiocheia / Antakya",
    lat: 36.2021, lng: 36.1606, emoji: "🕊️",
    description: "Seleucid capital and early Christian hub",
    category: "middle-east",
  },

  // ── North Africa ─────────────────────────────────────────────
  {
    id: "carthage", name: "Carthage / Tunisia", historicalName: "Carthago",
    lat: 36.8528, lng: 10.3233, emoji: "🐘",
    description: "Great rival of Rome and Hannibal's homeland",
    category: "north-africa",
  },
  {
    id: "alexandria", name: "Alexandria / Egypt", historicalName: "Alexandria ad Aegyptum",
    lat: 31.2001, lng: 29.9187, emoji: "📚",
    description: "Greatest library and lighthouse of the ancient world",
    category: "north-africa",
  },
  {
    id: "cairo", name: "Egypt / Cairo", historicalName: "Memphis / Al-Qahira",
    lat: 30.0444, lng: 31.2357, emoji: "🏺",
    description: "Land of pharaohs, pyramids, and Nile floods",
    category: "north-africa",
  },
];
