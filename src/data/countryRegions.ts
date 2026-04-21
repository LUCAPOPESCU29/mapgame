export interface CountryData {
  flag: string;
  regions: string[];
}

export const COUNTRY_REGIONS: Record<string, CountryData> = {

  // ── Western Europe ────────────────────────────────────────────
  Italy: {
    flag: "🇮🇹",
    regions: ["Rome & Lazio", "Tuscany (Florence)", "Venice & the Adriatic", "Sicily", "Naples & Campania", "Milan & Lombardy", "Genoa & Liguria", "Sardinia", "Ravenna", "Palermo", "Turin & Piedmont", "Bologna & Emilia"],
  },
  France: {
    flag: "🇫🇷",
    regions: ["Paris & Île-de-France", "Normandy", "Brittany", "Provence & Marseille", "Burgundy", "Alsace & Lorraine", "Gascony & Bordeaux", "Languedoc", "Lyon & Rhône Valley", "Champagne", "Aquitaine", "Picardy"],
  },
  "United Kingdom": {
    flag: "🇬🇧",
    regions: ["London & the Thames", "York & the North", "Winchester & Wessex", "Canterbury & Kent", "Wales & the Marches", "Cornwall & the Southwest", "East Anglia", "Northumbria", "Mercia & the Midlands"],
  },
  Germany: {
    flag: "🇩🇪",
    regions: ["Berlin & Brandenburg (Prussia)", "Bavaria & Munich", "Rhineland & Cologne", "Saxony", "Hamburg & the North Sea", "Trier & the Moselle", "Nuremberg & Franconia", "Pomerania", "Westphalia", "Baden & the Black Forest"],
  },
  Spain: {
    flag: "🇪🇸",
    regions: ["Castile & Madrid", "Aragon & Zaragoza", "Andalusia & Seville", "Catalonia & Barcelona", "Galicia & Santiago", "Navarre", "Granada & the Moors", "Toledo", "Valencia", "Extremadura"],
  },
  Portugal: {
    flag: "🇵🇹",
    regions: ["Lisbon & the Tagus", "Porto & the Douro", "Algarve", "Évora & Alentejo", "Coimbra & Beira", "Braga & the Minho"],
  },
  Netherlands: {
    flag: "🇳🇱",
    regions: ["Amsterdam & Holland", "Utrecht", "Leiden", "Groningen & the North", "Zeeland & the Delta", "Flanders (South)", "The Hague", "Maastricht & Limburg"],
  },
  Belgium: {
    flag: "🇧🇪",
    regions: ["Brussels & Brabant", "Bruges & Flanders", "Ghent", "Liège & the Meuse", "Antwerp", "Namur & Wallonia", "Mons & Hainaut"],
  },
  Switzerland: {
    flag: "🇨🇭",
    regions: ["Geneva & the Western Cantons", "Bern", "Zurich", "Basel & the Rhine", "St. Gallen & the East", "Ticino & the Italian Lakes", "Lucerne & Central Switzerland"],
  },
  Austria: {
    flag: "🇦🇹",
    regions: ["Vienna & the Habsburg Court", "Salzburg", "Innsbruck & Tyrol", "Graz & Styria", "Linz & Upper Austria", "Klagenfurt & Carinthia"],
  },
  Luxembourg: {
    flag: "🇱🇺",
    regions: ["Luxembourg City & the Alzette", "Echternach & the Moselle", "Vianden & the Ardennes", "Esch-sur-Alzette & the South"],
  },
  Ireland: {
    flag: "🇮🇪",
    regions: ["Dublin & the Pale", "Cork & Munster", "Galway & Connacht", "Ulster (North)", "Limerick & the Shannon", "Kilkenny & Leinster", "Wexford & the Southeast"],
  },
  Scotland: {
    flag: "🏴󠁧󠁢󠁳󠁣󠁴󠁿",
    regions: ["Edinburgh & the Lothians", "Glasgow & the Clyde", "The Highlands", "Orkney & Shetland", "St Andrews & Fife", "Stirling & the Central Belt", "Aberdeen & the Northeast"],
  },
  Iceland: {
    flag: "🇮🇸",
    regions: ["Reykjavik & the Southwest", "The Golden Circle", "Akureyri & the North", "Westfjords", "East Fjords", "Vestmannaeyjar Islands"],
  },
  Malta: {
    flag: "🇲🇹",
    regions: ["Valletta & the Grand Harbour", "Mdina (The Silent City)", "Gozo & Calypso's Isle", "Marsaxlokk & the South", "St. Paul's Bay & the North"],
  },
  Andorra: {
    flag: "🇦🇩",
    regions: ["Andorra la Vella", "Canillo & the East", "Encamp & the Valleys", "Ordino & the North"],
  },
  Monaco: {
    flag: "🇲🇨",
    regions: ["Monaco-Ville (The Rock)", "Monte Carlo", "La Condamine & the Port"],
  },

  // ── Northern Europe ───────────────────────────────────────────
  Sweden: {
    flag: "🇸🇪",
    regions: ["Stockholm & Lake Mälaren", "Uppsala", "Gothenburg & the West", "Visby & Gotland", "Skåne & the South", "Lapland & the North", "Kalmar & the Baltic Coast"],
  },
  Norway: {
    flag: "🇳🇴",
    regions: ["Oslo & the Oslofjord", "Bergen & the Fjords", "Trondheim", "Tromsø & the Arctic North", "Stavanger & Rogaland", "Lofoten Islands", "Svalbard"],
  },
  Denmark: {
    flag: "🇩🇰",
    regions: ["Copenhagen & Zealand", "Aarhus & Jutland", "Roskilde (Viking Capital)", "Odense & Funen", "Bornholm Island", "Southern Jutland", "Greenland (Realm)"],
  },
  Finland: {
    flag: "🇫🇮",
    regions: ["Helsinki & the South Coast", "Turku & Southwest Finland", "Tampere & the Lakeland", "Oulu & Northern Ostrobothnia", "Lapland", "Åland Islands"],
  },
  Estonia: {
    flag: "🇪🇪",
    regions: ["Tallinn & the Northern Coast", "Tartu & the South", "Saaremaa Island", "Hiiumaa Island", "Narva & the Eastern Border", "Pärnu & the West"],
  },
  Latvia: {
    flag: "🇱🇻",
    regions: ["Riga & the Daugava", "Jūrmala & the Coast", "Sigulda & the Gauja Valley", "Daugavpils & the East", "Kurzeme & the West", "Vidzeme Highlands"],
  },
  Lithuania: {
    flag: "🇱🇹",
    regions: ["Vilnius & the Southeast", "Kaunas & the Center", "Klaipėda & the Baltic Coast", "Trakai & the Lakes", "Šiauliai & the North", "Curonian Spit"],
  },

  // ── Eastern Europe ────────────────────────────────────────────
  Poland: {
    flag: "🇵🇱",
    regions: ["Warsaw & Masovia", "Kraków & Lesser Poland", "Gdańsk & the Baltic Coast", "Wrocław & Silesia", "Poznań & Greater Poland", "Lwów / Galicia", "Toruń & the Teutonic Order"],
  },
  "Czech Republic": {
    flag: "🇨🇿",
    regions: ["Prague & Bohemia", "Brno & Moravia", "Olomouc", "Plzeň & Western Bohemia", "Kutná Hora (Silver Mines)", "Silesia (North)", "Český Krumlov"],
  },
  Slovakia: {
    flag: "🇸🇰",
    regions: ["Bratislava & the Danube", "Košice & the East", "Banská Bystrica & the Center", "Trenčín & the Northwest", "Nitra (First Capital)", "Tatra Mountains"],
  },
  Hungary: {
    flag: "🇭🇺",
    regions: ["Budapest & the Danube Bend", "Eger & the Northern Hills", "Debrecen & the Great Plain", "Transylvania (shared with Romania)", "Lake Balaton", "Pécs & Baranya", "Győr & the West"],
  },
  Romania: {
    flag: "🇷🇴",
    regions: ["Bucharest & Wallachia", "Transylvania & the Carpathians", "Moldavia & Iași", "Dobrogea & the Black Sea", "Maramureș", "Brașov & the Saxon Towns", "Sighișoara (Dracula's Birthplace)"],
  },
  Bulgaria: {
    flag: "🇧🇬",
    regions: ["Sofia & the Western Plain", "Plovdiv & Thrace", "Varna & the Black Sea Coast", "Tarnovo & the Balkan Range", "Ruse & the Danube", "Blagoevgrad & the South"],
  },
  Ukraine: {
    flag: "🇺🇦",
    regions: ["Kyiv & the Dnieper", "Lviv & Galicia", "Odessa & the Black Sea", "Kharkiv & the Northeast", "Crimea", "Chernihiv & the North", "Zaporizhzhia & the Sich"],
  },
  Belarus: {
    flag: "🇧🇾",
    regions: ["Minsk & the Center", "Brest & the Southwest", "Grodno & the West", "Vitebsk & the North", "Polotsk (Ancient Capital)", "Pinsk & the Marshes"],
  },
  Moldova: {
    flag: "🇲🇩",
    regions: ["Chișinău & the Center", "Transnistria (East Bank)", "Orheiul Vechi (Cave Monastery)", "Cahul & the South", "Soroca & the North"],
  },
  Russia: {
    flag: "🇷🇺",
    regions: ["Moscow & the Golden Ring", "St. Petersburg & Ingria", "Novgorod the Great", "Kazan & the Volga", "Tver & the Upper Volga", "Pskov & the Northwest", "Siberia (Tobolsk)", "Vladivostok & the Far East", "Rostov-on-Don & the South"],
  },

  // ── Balkans ───────────────────────────────────────────────────
  Serbia: {
    flag: "🇷🇸",
    regions: ["Belgrade & the Confluence", "Novi Sad & Vojvodina", "Niš & the South", "Kosovo & Old Serbia", "Timok Valley", "Smederevo & the Danube"],
  },
  Croatia: {
    flag: "🇭🇷",
    regions: ["Zagreb & Pannonia", "Dubrovnik (Ragusa)", "Split & Dalmatia", "Istria & the Adriatic", "Slavonia", "Zadar & Northern Dalmatia"],
  },
  Bosnia: {
    flag: "🇧🇦",
    regions: ["Sarajevo & the Miljacka", "Mostar & Herzegovina", "Banja Luka & the North", "Jajce (Medieval Capital)", "Tuzla & the Northeast", "Travnik & the Center"],
  },
  Slovenia: {
    flag: "🇸🇮",
    regions: ["Ljubljana & the Center", "Bled & the Alpine Lakes", "Piran & the Adriatic Coast", "Maribor & Styria", "Celje & the Southeast", "Postojna & the Karst"],
  },
  "North Macedonia": {
    flag: "🇲🇰",
    regions: ["Skopje & the Vardar Valley", "Ohrid & the Lake", "Bitola (Ancient Heraclea)", "Tetovo & the West", "Štip & the East", "Gevgelija & the South"],
  },
  Montenegro: {
    flag: "🇲🇪",
    regions: ["Podgorica & the Center", "Cetinje (Old Royal Capital)", "Kotor & the Bay", "Budva & the Riviera", "Nikšić & the Highlands", "Ulcinj & the South"],
  },
  Albania: {
    flag: "🇦🇱",
    regions: ["Tirana & the Center", "Durrës & the Coast (Dyrrachium)", "Gjirokastër & the South", "Shkodër & the North", "Berat (City of a Thousand Windows)", "Butrint (Ancient Greek Colony)"],
  },
  Greece: {
    flag: "🇬🇷",
    regions: ["Athens & Attica", "Sparta & Laconia", "Thessaloniki & Macedonia", "Crete", "Corinth & the Peloponnese", "Delphi & Phocis", "Thebes & Boeotia", "Rhodes & the Dodecanese", "Olympia & Elis", "Santorini & the Cyclades"],
  },
  Cyprus: {
    flag: "🇨🇾",
    regions: ["Nicosia (Lefkosia)", "Limassol & the South", "Paphos & the West (Aphrodite's Birthplace)", "Famagusta & the East", "Larnaca & the Salt Lake", "Troodos Mountains"],
  },
  Turkey: {
    flag: "🇹🇷",
    regions: ["Istanbul / Constantinople", "Ankara & Central Anatolia", "Ephesus & the Aegean Coast", "Trebizond & the Black Sea", "Antioch & the Southeast", "Cappadocia", "Izmir / Smyrna", "Konya (Seljuk Capital)", "Bursa (Early Ottoman)"],
  },

  // ── Caucasus ──────────────────────────────────────────────────
  Georgia: {
    flag: "🇬🇪",
    regions: ["Tbilisi & the Kura River", "Mtskheta (Ancient Capital)", "Kutaisi & Western Georgia", "Batumi & Adjara", "Telavi & Kakheti (Wine Region)", "Gori & Kartli", "Svaneti & the High Caucasus"],
  },
  Armenia: {
    flag: "🇦🇲",
    regions: ["Yerevan & the Ararat Plain", "Garni & the Gegham Mountains", "Sevan & the Lake", "Gyumri & the Northwest", "Vagharshapat / Etchmiadzin (Holy City)", "Goris & the South"],
  },
  Azerbaijan: {
    flag: "🇦🇿",
    regions: ["Baku & the Caspian Shore", "Ganja & the West", "Sheki & the North", "Lankaran & the Southeast", "Nakhchivan (Exclave)", "Shamakhi & the Shirvan Plain"],
  },

  // ── Central Asia ──────────────────────────────────────────────
  Kazakhstan: {
    flag: "🇰🇿",
    regions: ["Nur-Sultan (Astana) & the Steppe", "Almaty & the Tian Shan", "Turkestan (Silk Road City)", "Shymkent & the South", "Semey & the East", "Aktau & the Caspian"],
  },
  Uzbekistan: {
    flag: "🇺🇿",
    regions: ["Samarkand (Heart of the Silk Road)", "Bukhara (City of Scholars)", "Tashkent & the Modern Capital", "Khiva & Khwarezm", "Fergana Valley", "Termez & the South"],
  },
  Tajikistan: {
    flag: "🇹🇯",
    regions: ["Dushanbe & the Center", "Khujand & the North (Sogdia)", "Penjikent (Ancient Sogdian City)", "Murghab & the Pamir Plateau", "Kulob & the South"],
  },
  Turkmenistan: {
    flag: "🇹🇲",
    regions: ["Ashgabat & the Center", "Merv (Ancient Silk Road Oasis)", "Köneürgench (Old Urgench)", "Türkmenbaşy & the Caspian", "Mary & the Murghab River"],
  },
  Kyrgyzstan: {
    flag: "🇰🇬",
    regions: ["Bishkek & the Chuy Valley", "Osh & the Fergana Valley", "Issyk-Kul Lake & the East", "Talas & the Northwest", "Karakol & the Tian Shan"],
  },
  Afghanistan: {
    flag: "🇦🇫",
    regions: ["Kabul & the Hindu Kush", "Kandahar (Ancient Arachosia)", "Herat & the West (Silk Road)", "Balkh (Ancient Bactria)", "Bamiyan & the Buddha Caves", "Jalalabad & the East"],
  },

  // ── Middle East ───────────────────────────────────────────────
  Iran: {
    flag: "🇮🇷",
    regions: ["Tehran & the Alborz", "Persepolis & Shiraz", "Isfahan", "Tabriz & Azerbaijan", "Mashhad & Khorasan", "Susa & Khuzestan", "Yazd & the Desert", "Rasht & the Caspian Coast"],
  },
  Iraq: {
    flag: "🇮🇶",
    regions: ["Baghdad (Abbasid Capital)", "Babylon & Hillah", "Mosul & Nineveh", "Basra & the Persian Gulf", "Ur & the Deep South", "Erbil & Kurdistan", "Ctesiphon (Sassanid Capital)", "Samarra (Spiral Minaret)"],
  },
  Syria: {
    flag: "🇸🇾",
    regions: ["Damascus", "Aleppo", "Palmyra & the Desert", "Antioch (Antakya)", "Homs & the Orontes Valley", "Latakia & the Coast", "Bosra & the South"],
  },
  Jordan: {
    flag: "🇯🇴",
    regions: ["Petra & the Nabataean Kingdom", "Jerash (Gerasa)", "Amman (Philadelphia)", "Aqaba & the Red Sea", "The Dead Sea Shore", "Kerak & the Crusader Castles", "Madaba & the Mosaic Map"],
  },
  Lebanon: {
    flag: "🇱🇧",
    regions: ["Beirut & the Levantine Coast", "Tyre (Sour)", "Sidon (Saida)", "Byblos (Jbeil)", "Baalbek & the Bekaa Valley", "Tripoli & the North"],
  },
  Israel: {
    flag: "🇮🇱",
    regions: ["Jerusalem", "Tel Aviv & the Coast (Jaffa)", "Galilee & the North", "Negev Desert", "Haifa & Mount Carmel", "The Dead Sea & Jericho", "Masada", "Caesarea Maritima"],
  },
  Palestine: {
    flag: "🇵🇸",
    regions: ["Jerusalem", "Bethlehem & Judea", "Gaza & the Coastal Plain", "Nablus & Samaria", "Jericho & the Jordan Valley", "Hebron & the Southern Hills"],
  },
  "Saudi Arabia": {
    flag: "🇸🇦",
    regions: ["Mecca (The Holy City)", "Medina (City of the Prophet)", "Riyadh & the Najd", "Jeddah & the Hejaz Coast", "Al-Ula & Hegra (Nabataean North)", "Hofuf & the Eastern Province", "Asir & the Southwest Highlands"],
  },
  Yemen: {
    flag: "🇾🇪",
    regions: ["Sana'a (Ancient Highland Capital)", "Aden & the Gulf", "Marib (Queen of Sheba's Kingdom)", "Socotra Island", "Hadramawt Valley", "Taiz & the Southwest"],
  },
  Oman: {
    flag: "🇴🇲",
    regions: ["Muscat & the Coast", "Nizwa & the Interior (Ancient Capital)", "Sur & the Seafarers", "Salalah & Dhofar (Frankincense Land)", "Sohar & the Batinah", "Musandam Peninsula"],
  },
  "United Arab Emirates": {
    flag: "🇦🇪",
    regions: ["Dubai & the Creek", "Abu Dhabi & the Capital", "Sharjah (Cultural Capital)", "Al Ain & the Oasis", "Fujairah & the East Coast", "Ras al-Khaimah & the North"],
  },
  Qatar: {
    flag: "🇶🇦",
    regions: ["Doha & the West Bay", "Al Wakrah & the South", "Al Zubarah (UNESCO Pearl Fishery)", "Khor & the North"],
  },
  Kuwait: {
    flag: "🇰🇼",
    regions: ["Kuwait City & the Bay", "Failaka Island (Ancient Greek Colony)", "Ahmadi & the South", "Jahra & the Interior"],
  },
  Bahrain: {
    flag: "🇧🇭",
    regions: ["Manama & the Northern Coast", "Riffa & the South", "Dilmun (Ancient Civilization)", "Qal'at al-Bahrain (Portuguese Fort)", "Muharraq Island"],
  },

  // ── South Asia ────────────────────────────────────────────────
  India: {
    flag: "🇮🇳",
    regions: ["Delhi & the Gangetic Plain", "Agra & the Mughal Heartland", "Varanasi & the Sacred Ganges", "Rajasthan & the Thar Desert", "Deccan Plateau & Vijayanagara", "Bengal & the East", "Tamil Nadu & the South", "Kashmir & the Northwest", "Mumbai & the Western Coast", "Pune & the Maratha Empire", "Khajuraho & Madhya Pradesh", "Patna & Magadha (Maurya Capital)"],
  },
  Pakistan: {
    flag: "🇵🇰",
    regions: ["Lahore & the Punjab", "Karachi & the Sindh Coast", "Peshawar & the Northwest Frontier", "Mohenjo-daro (Indus Valley)", "Taxila (Ancient Gandahara)", "Multan (City of Saints)", "Islamabad & the Pothohar Plateau"],
  },
  Nepal: {
    flag: "🇳🇵",
    regions: ["Kathmandu Valley & the Three Cities", "Pokhara & the Annapurna", "Lumbini (Buddha's Birthplace)", "Bhaktapur & the Medieval Palaces", "Mustang & the Hidden Kingdom", "Janakpur & the Terai"],
  },
  "Sri Lanka": {
    flag: "🇱🇰",
    regions: ["Colombo & the West Coast", "Kandy & the Hill Country (Tooth Relic)", "Anuradhapura (Ancient Capital)", "Polonnaruwa (Medieval Capital)", "Galle & the Southern Fort", "Sigiriya (Lion's Rock)", "Jaffna & the North"],
  },
  Bangladesh: {
    flag: "🇧🇩",
    regions: ["Dhaka & the Delta", "Chittagong & the Hill Tracts", "Sylhet & the Northeast", "Rajshahi & the North", "Bagerhat (Mosque City)", "Paharpur (Buddhist Monastery)"],
  },

  // ── East Asia ─────────────────────────────────────────────────
  China: {
    flag: "🇨🇳",
    regions: ["Beijing & the Imperial North", "Xi'an & the Silk Road (Chang'an)", "Nanjing & the Lower Yangtze", "Shanghai & the Yangtze Delta", "Guangzhou & the Pearl River", "Chengdu & Sichuan", "Luoyang (Han & Tang Capital)", "Tibet & Lhasa", "Yunnan & the Southwest", "Hangzhou & the Song Dynasty", "Suzhou & the Canal Cities", "Dunhuang & the Gansu Corridor"],
  },
  Japan: {
    flag: "🇯🇵",
    regions: ["Kyoto & the Imperial Court", "Tokyo (Edo) & the Shogunate", "Nara & the Early Capitals", "Osaka & Merchant Culture", "Hiroshima & the Seto Inland Sea", "Kamakura & the Samurai", "Satsuma & the Southwest (Kagoshima)", "Hokkaido & the Ainu North", "Okinawa & the Ryukyu Kingdom", "Nikko & the Shogun's Mausoleum"],
  },
  "South Korea": {
    flag: "🇰🇷",
    regions: ["Seoul (Hanyang) & the Han River", "Gyeongju (Silla Capital)", "Kaesong (Goryeo Capital)", "Busan & the Southeast", "Jeju Island", "Jeonju & Joseon Heritage", "Incheon & the West Sea"],
  },
  "North Korea": {
    flag: "🇰🇵",
    regions: ["Pyongyang (Ancient Goguryeo)", "Kaesong (Goryeo Capital)", "Hamhung & the Northeast", "Wonsan & the East Sea", "Baekdu Mountain (Sacred)", "Rason & the Far Northeast"],
  },
  Mongolia: {
    flag: "🇲🇳",
    regions: ["Ulaanbaatar & the Center", "Karakorum (Great Khan's Capital)", "Erdenet & the North", "Gobi Desert & the South", "Khövsgöl Lake & the Far North", "Khentii & Genghis Khan's Birthplace"],
  },

  // ── Southeast Asia ────────────────────────────────────────────
  Vietnam: {
    flag: "🇻🇳",
    regions: ["Hanoi & the Red River Delta", "Hue & the Nguyen Dynasty", "Hoi An (Ancient Trading Port)", "Ho Chi Minh City (Saigon)", "Halong Bay & the Northeast", "My Son & the Cham Kingdom", "Mekong Delta"],
  },
  Cambodia: {
    flag: "🇰🇭",
    regions: ["Angkor & the Khmer Empire", "Phnom Penh & the Mekong", "Siem Reap & the Temple Complex", "Battambang & the Northwest", "Sihanoukville & the Coast", "Kampot & the South"],
  },
  Thailand: {
    flag: "🇹🇭",
    regions: ["Ayutthaya (Ancient Capital)", "Bangkok & the Chao Phraya", "Chiang Mai & the Lanna Kingdom", "Sukhothai (First Kingdom)", "Phuket & the South", "Khmer Ruins of Isan", "Lopburi & the Center"],
  },
  Myanmar: {
    flag: "🇲🇲",
    regions: ["Bagan & the Pagan Empire", "Mandalay & the Last Kingdom", "Yangon & the Delta", "Inle Lake & the Shan Hills", "Pyu Ancient Cities", "Mrauk-U & the Arakan Kingdom"],
  },
  Indonesia: {
    flag: "🇮🇩",
    regions: ["Java & the Majapahit Empire (Trowulan)", "Bali & Hindu Culture", "Sumatra & Srivijaya", "Sulawesi & the Spice Trade", "Maluku (Moluccas — Spice Islands)", "Borobudur & Central Java", "Yogyakarta & the Sultanate"],
  },
  Malaysia: {
    flag: "🇲🇾",
    regions: ["Kuala Lumpur & the Klang Valley", "Malacca (Sultanate & Colonial Port)", "Penang & Georgetown", "Sabah & North Borneo", "Sarawak & the Brooke Raj", "Kedah & Bujang Valley (Ancient Hindu-Buddhist)"],
  },
  Philippines: {
    flag: "🇵🇭",
    regions: ["Manila & Intramuros (Spanish Colonial)", "Cebu (First Spanish Settlement)", "Vigan (Colonial Hill Town)", "Mindanao & the Sultanate of Sulu", "Bohol & the Chocolate Hills", "Batanes & the Far North"],
  },

  // ── Africa — North ────────────────────────────────────────────
  Egypt: {
    flag: "🇪🇬",
    regions: ["Cairo & Memphis (Old Kingdom)", "Alexandria & the Delta", "Thebes / Luxor (Upper Egypt)", "Sinai", "Aswan & Nubia", "The Fayum", "Amarna (Akhenaten's City)", "Abydos (Earliest Pharaohs)"],
  },
  Tunisia: {
    flag: "🇹🇳",
    regions: ["Tunis & Carthage", "Kairouan (Islamic Capital)", "Sousse (Hadrumetum)", "El Djem (Thysdrus)", "Dougga", "Sfax & the South"],
  },
  Libya: {
    flag: "🇱🇾",
    regions: ["Tripoli (Oea)", "Leptis Magna", "Cyrene & the East", "Sabratha", "Ghadames & the Desert", "Benghazi & Barce"],
  },
  Algeria: {
    flag: "🇩🇿",
    regions: ["Algiers (Icosium)", "Constantine (Cirta)", "Timgad (Thamugadi)", "Tlemcen", "Annaba (Hippo Regius)", "Tipasa", "Ghardaïa & the M'Zab"],
  },
  Morocco: {
    flag: "🇲🇦",
    regions: ["Marrakech", "Fez (Fès)", "Casablanca & the Atlantic Coast", "Tangier & the Strait", "Meknès", "Volubilis (Roman City)", "Rabat (Almohad Capital)", "Agadir & the South"],
  },
  Sudan: {
    flag: "🇸🇩",
    regions: ["Khartoum & the Confluence", "Meroë (Kushite Pyramids)", "Napata & the Fourth Cataract", "Dongola & the Medieval Christian Kingdoms", "Port Sudan & the Red Sea", "Kassala & the East"],
  },
  Ethiopia: {
    flag: "🇪🇹",
    regions: ["Addis Ababa & the Center", "Aksum (Ancient Kingdom)", "Lalibela (Rock-Hewn Churches)", "Gondar (Fasilides' Castle)", "Harar & the Walled City", "Omo Valley & Ancient Peoples", "Bale Mountains"],
  },
  Eritrea: {
    flag: "🇪🇷",
    regions: ["Asmara & the Highlands", "Massawa & the Red Sea Coast", "Keren & the North", "Qohaito (Ancient Ruins)", "Dahlak Archipelago"],
  },
  Somalia: {
    flag: "🇸🇴",
    regions: ["Mogadishu (Xamar) & the Coast", "Berbera & the Gulf of Aden", "Hargeisa & Somaliland", "Kismayo & the South", "Punt Land & the Ancient Trade Routes"],
  },

  // ── Africa — West ─────────────────────────────────────────────
  Mali: {
    flag: "🇲🇱",
    regions: ["Timbuktu (City of Salt & Gold)", "Djenné & the Great Mosque", "Bamako & the Niger", "Mopti & the Inner Delta", "Gao (Songhai Empire)", "Dogon Country"],
  },
  Ghana: {
    flag: "🇬🇭",
    regions: ["Accra & the Gold Coast", "Kumasi & the Ashanti Kingdom", "Cape Coast Castle & the Slave Trade", "Tamale & the North", "Elmina (Portuguese Fort)", "Volta Basin"],
  },
  Nigeria: {
    flag: "🇳🇬",
    regions: ["Lagos & the Coast", "Benin City (Kingdom of Benin)", "Kano & the Hausa States", "Ibadan & the Yoruba", "Abuja & the Center", "Ile-Ife (Yoruba Holy City)", "Calabar & the Southeast"],
  },
  Senegal: {
    flag: "🇸🇳",
    regions: ["Dakar & the Atlantic", "Gorée Island (Slave Trade)", "Saint-Louis (Colonial Capital)", "Casamance & the South", "Touba (Holy City)", "Sine Saloum Delta"],
  },
  Niger: {
    flag: "🇳🇪",
    regions: ["Niamey & the Niger River", "Agadez (Tuareg Gateway)", "Zinder (Old Sultanate)", "Dosso & the Southwest", "Aïr Mountains & the Desert", "Lake Chad Region"],
  },
  Burkina: {
    flag: "🇧🇫",
    regions: ["Ouagadougou & the Mossi Kingdom", "Bobo-Dioulasso & the West", "Banfora & the Cascades", "Loropéni Ruins (UNESCO)", "Tiébélé & the Painted Houses"],
  },

  // ── Africa — East ─────────────────────────────────────────────
  Kenya: {
    flag: "🇰🇪",
    regions: ["Nairobi & the Rift Valley", "Mombasa & the Swahili Coast", "Lamu Island (Ancient Port)", "Kisumu & Lake Victoria", "Malindi (Portuguese Outpost)", "Amboseli & the Maasai Plains"],
  },
  Tanzania: {
    flag: "🇹🇿",
    regions: ["Dar es Salaam & the Coast", "Zanzibar (Spice Island)", "Kilimanjaro & the North", "Serengeti & the Great Migration", "Kilwa Kisiwani (Medieval Swahili)", "Olduvai Gorge (Cradle of Mankind)"],
  },
  Uganda: {
    flag: "🇺🇬",
    regions: ["Kampala & Lake Victoria", "Buganda Kingdom (Kasubi Tombs)", "Jinja & the Nile Source", "Fort Portal & the Mountains of the Moon", "Gulu & the North"],
  },

  // ── Africa — Southern ─────────────────────────────────────────
  "South Africa": {
    flag: "🇿🇦",
    regions: ["Cape Town & the Cape Colony", "Johannesburg & the Gold Fields", "Pretoria (Tshwane) & the Boer Republics", "Durban & the Zulu Kingdom", "Kimberley & the Diamond Rush", "Great Zimbabwe (Ancient Capital)"],
  },
  Zimbabwe: {
    flag: "🇿🇼",
    regions: ["Harare & the Plateau", "Great Zimbabwe (Stone City)", "Bulawayo & the Ndebele Kingdom", "Victoria Falls & the Zambezi", "Masvingo & the South"],
  },
  Mozambique: {
    flag: "🇲🇿",
    regions: ["Maputo & the South", "Mozambique Island (Portuguese Capital)", "Beira & the Center", "Sofala & the Gold Trade", "Quelimane & the Zambezi Delta", "Inhambane & the Coast"],
  },
  Madagascar: {
    flag: "🇲🇬",
    regions: ["Antananarivo & the Highlands", "Mahajanga & the Northwest", "Toamasina & the East Coast", "Toliara & the Arid South", "Ambohimanga (Royal Hill)", "Sakalava Kingdom (West)"],
  },

  // ── Americas — North ──────────────────────────────────────────
  Mexico: {
    flag: "🇲🇽",
    regions: ["Tenochtitlan / Mexico City (Aztec Capital)", "Teotihuacan (City of the Gods)", "Oaxaca & Monte Albán", "Chichen Itza & the Maya Yucatán", "Palenque & the Maya Jungle", "Veracruz & the Gulf Coast", "Guadalajara & Western Mexico", "Puebla & the Highlands", "Mitla & Zapotec Culture"],
  },
  Cuba: {
    flag: "🇨🇺",
    regions: ["Havana (La Habana) & the Bay", "Santiago de Cuba & the East", "Trinidad & the Center", "Camagüey & the Interior", "Baracoa (Columbus's Landing)", "Cienfuegos & the South"],
  },
  Haiti: {
    flag: "🇭🇹",
    regions: ["Port-au-Prince & the Bay", "Cap-Haïtien (Former Colonial Capital)", "Citadelle Laferrière (Haitian King)", "Jacmel & the South", "Gonaïves (Independence City)"],
  },
  "Dominican Republic": {
    flag: "🇩🇴",
    regions: ["Santo Domingo (First European City in Americas)", "Santiago & the Cibao Valley", "La Romana & the East", "Puerto Plata & the North Coast", "Barahona & the Southwest"],
  },
  Guatemala: {
    flag: "🇬🇹",
    regions: ["Guatemala City & the Valley", "Antigua (Colonial Capital)", "Tikal (Maya City)", "Copán (Maya Steles)", "Quetzaltenango & the Highlands", "Lake Atitlán & the Volcanoes"],
  },

  // ── Americas — South ──────────────────────────────────────────
  Brazil: {
    flag: "🇧🇷",
    regions: ["Rio de Janeiro & the Bay", "Salvador (Colonial Capital) & Bahia", "São Paulo & the Interior", "Brasília & the Cerrado", "Manaus & the Amazon", "Ouro Preto (Gold Rush Town)", "Recife & Pernambuco", "Belém & the Amazon Delta"],
  },
  Peru: {
    flag: "🇵🇪",
    regions: ["Cusco (Inca Capital)", "Machu Picchu & the Sacred Valley", "Lima & the Pacific Coast", "Arequipa & the Volcanoes", "Lake Titicaca & the Altiplano", "Chan Chan (Chimú Capital)", "Nazca & the Desert Lines", "Caral (Oldest City in the Americas)"],
  },
  Colombia: {
    flag: "🇨🇴",
    regions: ["Bogotá & the Andes", "Cartagena & the Caribbean (Walled City)", "Medellín & the Antioquian Highlands", "Santa Marta (First Spanish Colony)", "San Agustín Archaeological Park", "Cali & the Pacific Valle"],
  },
  Argentina: {
    flag: "🇦🇷",
    regions: ["Buenos Aires & the Río de la Plata", "Córdoba & the Sierras", "Mendoza & the Wine Country", "Patagonia & Tierra del Fuego", "Jujuy & the Inca North", "Rosario & the Pampas", "San Juan & the Andes"],
  },
  Chile: {
    flag: "🇨🇱",
    regions: ["Santiago & the Central Valley", "Valparaíso & the Pacific Coast", "Atacama Desert & the North", "Patagonia & Torres del Paine", "Easter Island (Rapa Nui)", "Chiloé Island & the Archipelago"],
  },
  Bolivia: {
    flag: "🇧🇴",
    regions: ["Sucre (Constitutional Capital)", "La Paz & the Altiplano", "Potosí (Silver Mountain)", "Tiwanaku (Pre-Inca Empire)", "Lake Titicaca & the Isla del Sol", "Santa Cruz & the Lowlands"],
  },
  Venezuela: {
    flag: "🇻🇪",
    regions: ["Caracas & the Caribbean Coast", "Maracaibo & the Oil Lake", "Angel Falls & the Gran Sabana", "Mérida & the Andes", "Ciudad Bolívar & the Orinoco"],
  },
  Ecuador: {
    flag: "🇪🇨",
    regions: ["Quito (Colonial Capital at the Equator)", "Guayaquil & the Gulf", "Cuenca & the Inca Trail", "Galápagos Islands", "The Amazon Basin (Oriente)"],
  },
  Paraguay: {
    flag: "🇵🇾",
    regions: ["Asunción & the Paraguay River", "Jesuit Reductions of Trinidad", "Concepción & the North", "Encarnación & the South", "Chaco & the Gran Chaco Plains"],
  },
  Uruguay: {
    flag: "🇺🇾",
    regions: ["Montevideo & the Río de la Plata", "Colonia del Sacramento (Portuguese Fort)", "Paysandú & the North", "Maldonado & the East Coast", "Salto & the Uruguay River"],
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
