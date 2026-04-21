export interface CountryData {
  flag: string;
  regions: string[];
}

export const COUNTRY_REGIONS: Record<string, CountryData> = {
  // ── Europe ────────────────────────────────────────────────────
  Italy: {
    flag: "🇮🇹",
    regions: ["Rome & Lazio", "Tuscany (Florence)", "Venice & the Adriatic", "Sicily", "Naples & Campania", "Milan & Lombardy", "Genoa & Liguria", "Sardinia", "Ravenna", "Palermo"],
  },
  France: {
    flag: "🇫🇷",
    regions: ["Paris & Île-de-France", "Normandy", "Brittany", "Provence & Marseille", "Burgundy", "Alsace & Lorraine", "Gascony & Bordeaux", "Languedoc", "Lyon & Rhône Valley", "Champagne"],
  },
  "United Kingdom": {
    flag: "🇬🇧",
    regions: ["London & the Thames", "York & the North", "Winchester & Wessex", "Canterbury & Kent", "Wales & the Marches", "Cornwall & the Southwest", "East Anglia", "Northumbria"],
  },
  Germany: {
    flag: "🇩🇪",
    regions: ["Berlin & Brandenburg (Prussia)", "Bavaria & Munich", "Rhineland & Cologne", "Saxony", "Hamburg & the North Sea", "Trier & the Moselle", "Nuremberg & Franconia", "Pomerania"],
  },
  Spain: {
    flag: "🇪🇸",
    regions: ["Castile & Madrid", "Aragon & Zaragoza", "Andalusia & Seville", "Catalonia & Barcelona", "Galicia & Santiago", "Navarre", "Granada & the Moors", "Toledo"],
  },
  Portugal: {
    flag: "🇵🇹",
    regions: ["Lisbon & the Tagus", "Porto & the Douro", "Algarve", "Évora & Alentejo", "Coimbra & Beira", "Braga & the Minho"],
  },
  Greece: {
    flag: "🇬🇷",
    regions: ["Athens & Attica", "Sparta & Laconia", "Thessaloniki & Macedonia", "Crete", "Corinth & the Peloponnese", "Delphi & Phocis", "Thebes & Boeotia", "Rhodes & the Dodecanese"],
  },
  Turkey: {
    flag: "🇹🇷",
    regions: ["Istanbul / Constantinople", "Ankara & Central Anatolia", "Ephesus & the Aegean Coast", "Trebizond & the Black Sea", "Antioch & the Southeast", "Cappadocia", "Izmir / Smyrna"],
  },
  Netherlands: {
    flag: "🇳🇱",
    regions: ["Amsterdam & Holland", "Utrecht", "Leiden", "Groningen & the North", "Zeeland & the Delta", "Flanders (South)"],
  },
  Belgium: {
    flag: "🇧🇪",
    regions: ["Brussels & Brabant", "Bruges & Flanders", "Ghent", "Liège & the Meuse", "Antwerp", "Namur & Wallonia"],
  },
  Austria: {
    flag: "🇦🇹",
    regions: ["Vienna & the Habsburg Court", "Salzburg", "Innsbruck & Tyrol", "Graz & Styria", "Linz & Upper Austria", "Klagenfurt & Carinthia"],
  },
  Switzerland: {
    flag: "🇨🇭",
    regions: ["Geneva & the Western Cantons", "Bern", "Zurich", "Basel & the Rhine", "St. Gallen & the East", "Ticino & the Italian Lakes"],
  },
  Poland: {
    flag: "🇵🇱",
    regions: ["Warsaw & Masovia", "Kraków & Lesser Poland", "Gdańsk & the Baltic Coast", "Wrocław & Silesia", "Poznań & Greater Poland", "Vilnius / Lithuanian border", "Lwów / Galicia"],
  },
  Hungary: {
    flag: "🇭🇺",
    regions: ["Budapest & the Danube Bend", "Eger & the Northern Hills", "Debrecen & the Great Plain", "Transylvania (shared with Romania)", "Lake Balaton", "Pécs & Baranya"],
  },
  "Czech Republic": {
    flag: "🇨🇿",
    regions: ["Prague & Bohemia", "Brno & Moravia", "Olomouc", "Plzeň & Western Bohemia", "Kutná Hora (Silver Mines)", "Silesia (North)"],
  },
  Romania: {
    flag: "🇷🇴",
    regions: ["Bucharest & Wallachia", "Transylvania & the Carpathians", "Moldavia & Iași", "Dobrogea & the Black Sea", "Maramureș", "Brașov & the Saxon Towns"],
  },
  Bulgaria: {
    flag: "🇧🇬",
    regions: ["Sofia & the Western Plain", "Plovdiv & Thrace", "Varna & the Black Sea Coast", "Tarnovo & the Balkan Range", "Ruse & the Danube"],
  },
  Serbia: {
    flag: "🇷🇸",
    regions: ["Belgrade & the Confluence", "Novi Sad & Vojvodina", "Niš & the South", "Kosovo & the Old Serbia", "Timok Valley"],
  },
  Croatia: {
    flag: "🇭🇷",
    regions: ["Zagreb & Pannonia", "Dubrovnik (Ragusa)", "Split & Dalmatia", "Istria & the Adriatic", "Slavonia"],
  },
  Sweden: {
    flag: "🇸🇪",
    regions: ["Stockholm & Lake Mälaren", "Uppsala", "Gothenburg & the West", "Visby & Gotland", "Skåne & the South", "Lapland & the North"],
  },
  Norway: {
    flag: "🇳🇴",
    regions: ["Oslo & the Oslofjord", "Bergen & the Fjords", "Trondheim", "Tromsø & the Arctic North", "Stavanger & Rogaland", "Lofoten Islands"],
  },
  Denmark: {
    flag: "🇩🇰",
    regions: ["Copenhagen & Zealand", "Aarhus & Jutland", "Roskilde (Viking Capital)", "Odense & Funen", "Bornholm Island", "Southern Jutland"],
  },
  Finland: {
    flag: "🇫🇮",
    regions: ["Helsinki & the South Coast", "Turku & Southwest Finland", "Tampere & the Lakeland", "Oulu & Northern Ostrobothnia", "Lapland"],
  },
  Ireland: {
    flag: "🇮🇪",
    regions: ["Dublin & the Pale", "Cork & Munster", "Galway & Connacht", "Ulster (North)", "Limerick & the Shannon", "Kilkenny & Leinster"],
  },
  Scotland: {
    flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    regions: ["Edinburgh & the Lothians", "Glasgow & the Clyde", "The Highlands", "Orkney & Shetland", "St Andrews & Fife", "Stirling & the Central Belt"],
  },
  Ukraine: {
    flag: "🇺🇦",
    regions: ["Kyiv & the Dnieper", "Lviv & Galicia", "Odessa & the Black Sea", "Kharkiv & the Northeast", "Crimea", "Chernihiv & the North"],
  },
  Russia: {
    flag: "🇷🇺",
    regions: ["Moscow & the Golden Ring", "St. Petersburg & Ingria", "Novgorod the Great", "Kazan & the Volga", "Tver & the Upper Volga", "Pskov & the Northwest"],
  },

  // ── Middle East ───────────────────────────────────────────────
  Israel: {
    flag: "🇮🇱",
    regions: ["Jerusalem", "Tel Aviv & the Coast (Jaffa)", "Galilee & the North", "Negev Desert", "Haifa & Mount Carmel", "The Dead Sea & Jericho"],
  },
  Palestine: {
    flag: "🇵🇸",
    regions: ["Jerusalem", "Bethlehem & Judea", "Gaza & the Coastal Plain", "Nablus & Samaria", "Jericho & the Jordan Valley"],
  },
  Iraq: {
    flag: "🇮🇶",
    regions: ["Baghdad (Abbasid Capital)", "Babylon & Hillah", "Mosul & Nineveh", "Basra & the Persian Gulf", "Ur & the Deep South", "Erbil & Kurdistan"],
  },
  Syria: {
    flag: "🇸🇾",
    regions: ["Damascus", "Aleppo", "Palmyra & the Desert", "Antioch (Antakya, now Turkey)", "Homs & the Orontes Valley", "Latakia & the Coast"],
  },
  Lebanon: {
    flag: "🇱🇧",
    regions: ["Beirut & the Levantine Coast", "Tyre (Sour)", "Sidon (Saida)", "Byblos (Jbeil)", "Baalbek & the Bekaa Valley", "Tripoli & the North"],
  },
  Jordan: {
    flag: "🇯🇴",
    regions: ["Petra & the Nabataean Kingdom", "Jerash (Gerasa)", "Amman (Philadelphia)", "Aqaba & the Red Sea", "The Dead Sea Shore", "Kerak & the Crusader Castles"],
  },
  Iran: {
    flag: "🇮🇷",
    regions: ["Tehran & the Alborz", "Persepolis & Shiraz", "Isfahan", "Tabriz & Azerbaijan", "Mashhad & Khorasan", "Susa & Khuzestan"],
  },

  // ── North Africa ─────────────────────────────────────────────
  Egypt: {
    flag: "🇪🇬",
    regions: ["Cairo & Memphis (Old Kingdom)", "Alexandria & the Delta", "Thebes / Luxor (Upper Egypt)", "Sinai", "Aswan & Nubia", "The Fayum"],
  },
  Tunisia: {
    flag: "🇹🇳",
    regions: ["Tunis & Carthage", "Kairouan (Islamic Capital)", "Sousse (Hadrumetum)", "El Djem (Thysdrus)", "Dougga", "Sfax & the South"],
  },
  Libya: {
    flag: "🇱🇾",
    regions: ["Tripoli (Oea)", "Leptis Magna", "Cyrene & the East", "Sabratha", "Ghadames & the Desert"],
  },
  Algeria: {
    flag: "🇩🇿",
    regions: ["Algiers (Icosium)", "Constantine (Cirta)", "Timgad (Thamugadi)", "Tlemcen", "Annaba (Hippo Regius — Augustine's city)", "Tipasa"],
  },
  Morocco: {
    flag: "🇲🇦",
    regions: ["Marrakech", "Fez (Fès)", "Casablanca & the Atlantic Coast", "Tangier & the Strait", "Meknès", "Volubilis (Roman City)"],
  },
};

export function getRegionsForCountry(country: string): string[] {
  // Try exact match
  if (COUNTRY_REGIONS[country]) return COUNTRY_REGIONS[country].regions;
  // Try partial match
  const key = Object.keys(COUNTRY_REGIONS).find((k) =>
    k.toLowerCase().includes(country.toLowerCase()) ||
    country.toLowerCase().includes(k.toLowerCase())
  );
  return key ? COUNTRY_REGIONS[key].regions : [];
}

export function getFlagForCountry(country: string): string {
  if (COUNTRY_REGIONS[country]) return COUNTRY_REGIONS[country].flag;
  const key = Object.keys(COUNTRY_REGIONS).find((k) =>
    k.toLowerCase().includes(country.toLowerCase()) ||
    country.toLowerCase().includes(k.toLowerCase())
  );
  return key ? COUNTRY_REGIONS[key].flag : "🗺️";
}
