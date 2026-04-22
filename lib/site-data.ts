import type {
  CardContent,
  CompanySettings,
  FleetItem,
  Language,
  LanguageConfig,
  LocalizedCopy,
  ProgramItem,
  PublicCmsData,
  RoutePageContent,
  ServiceItem
} from "@/lib/types";

export const languages: Record<Language, LanguageConfig> = {
  en: { label: "EN", html: "en", dir: "ltr" },
  cs: { label: "CS", html: "cs", dir: "ltr" },
  ar: { label: "AR", html: "ar", dir: "rtl" }
};

export const company: CompanySettings = {
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "https://vipct.org",
  company: "VIP Coach Transfers s.r.o.",
  email: "info@vipct.org",
  phone: "+420 775 091 730",
  whatsappNumber: "420775091730",
  address: "Moulikova 2240/5, 150 00 Praha",
  ico: "23693592",
  vat: "CZ23693592",
  mapUrl: "https://www.google.com/maps/search/?api=1&query=Moulikova%202240%2F5%2C%20150%2000%20Praha"
};

export const navPages = [
  ["home", "index.html"],
  ["services", "services.html"],
  ["fleet", "fleet.html"],
  ["programs", "programs.html"],
  ["quote", "quote.html"],
  ["contact", "contact.html"]
] as const;

export const images = {
  logo: "/assets/optimized/logo-gold.webp",
  hero: "/assets/optimized/hero.webp",
  serviceAirport: "/assets/optimized/Services/airport-pickup.webp",
  serviceDrop: "/assets/optimized/Services/airport-dropoff.webp",
  serviceDriver: "/assets/optimized/Services/private-driver.webp",
  serviceEurope: "/assets/optimized/Services/europe.webp",
  serviceTours: "/assets/optimized/Services/daily-tours.webp",
  servicePrograms: "/assets/optimized/Services/events-programs.webp",
  sedan: "/assets/optimized/fleet-sedan.webp",
  vclass: "/assets/optimized/fleet-vclass.webp",
  minibus: "/assets/optimized/fleet-minibus.webp",
  coach: "/assets/optimized/fleet-coach.webp",
  cesky: "/assets/optimized/programs/Cesky-krumlov.webp",
  dresden: "/assets/optimized/programs/Dresden.webp",
  karlovy: "/assets/optimized/programs/Karlovy-Vary.webp",
  spindl: "/assets/optimized/programs/Spinderluv-Mlyn.webp",
  dolni: "/assets/optimized/programs/Dolni-Morava.webp",
  action: "/assets/optimized/programs/Action-PRG.webp"
};

export const copy: Record<Language, LocalizedCopy> = {
  en: {
    brandMeta: "Prague - 24/7",
    nav: ["Home", "Services", "Fleet", "Programs", "Quote", "Contact"],
    ctaQuote: "Get fixed price",
    ctaWhatsApp: "Book on WhatsApp",
    responseTime: "Usually replies within minutes on WhatsApp.",
    heroEyebrow: "VIP transfers in Prague and Europe",
    homeTitle: "Private Prague airport and Europe transfers",
    homeLead:
      "Premium sedans, Mercedes V-Class vans, minibuses and coaches for airport pickups, private chauffeur service, city-to-city routes and VIP programs.",
    trust: [
      ["Licensed company", `IČO ${company.ico}, DIČ ${company.vat}`],
      ["24/7 support", "WhatsApp, phone and email"],
      ["Flight tracking", "Arrival pickup timing"],
      ["Professional drivers", "Discreet, punctual service"],
      ["Fixed price quote", "Confirm price before booking"],
      ["Multilingual service", "English, Czech and Arabic"]
    ],
    sections: {
      routesTitle: "Popular private transfer routes",
      routesText: "Fast quote requests for the routes VIP travelers ask for most.",
      airportTitle: "Airport pickup without stress",
      airportText:
        "Share flight details, luggage and passenger count. We confirm the right vehicle, pickup timing and fixed price before you travel.",
      fleetTitle: "Premium fleet for every group size",
      fleetText: "Choose the vehicle by passengers, luggage and occasion.",
      servicesTitle: "VIP transfer services",
      servicesText: "Airport transfers, chauffeur service, Europe routes and private programs from Prague.",
      programsTitle: "Private programs from Prague",
      programsText: "Day trips and seasonal activities with flexible timing and professional drivers.",
      faqTitle: "Booking questions",
      proofTitle: "Trusted for airport arrivals, routes and VIP groups",
      proofText:
        "Every request is reviewed manually so the vehicle, luggage space, pickup timing and fixed price are clear before travel.",
      proofQuote: "Flight tracking, clear quotes and the right vehicle before pickup.",
      finalTitle: "Ready for a fixed transfer quote?",
      finalText: "Send the trip details and we will confirm the right vehicle and price."
    },
    quote: {
      title: "Get a fixed transfer quote",
      lead: "Tell us the route, timing, passengers and luggage. You can send the request and we will confirm availability manually.",
      trip: "Trip details",
      contact: "Contact details",
      notes: "Notes and preferences",
      type: "Trip type",
      oneWay: "One-way",
      roundTrip: "Round trip",
      pickupDate: "Pickup date",
      pickupTime: "Pickup time",
      returnDate: "Return date",
      returnTime: "Return time",
      pickup: "Pickup location",
      dropoff: "Drop-off location",
      passengers: "Passengers",
      luggage: "Luggage",
      vehicle: "Vehicle preference",
      flightNumber: "Flight number",
      childSeats: "Child seats",
      name: "Name",
      phone: "Phone",
      email: "Email",
      notesLabel: "Notes",
      send: "Send request",
      whatsapp: "Open WhatsApp",
      response: "No payment now. We confirm availability, vehicle and fixed price before booking.",
      presetsTitle: "Fast route presets",
      presetsText: "Choose a common route to prefill the quote form.",
      liveTitle: "Live request summary",
      liveRoute: "Route",
      liveTiming: "Timing",
      liveVehicle: "Vehicle",
      liveContact: "Contact"
    },
    contactTitle: "Contact VIP Coach Transfers",
    contactLead: "For the fastest reply, send your route and travel time on WhatsApp.",
    mapOpen: "Open in Google Maps",
    thankTitle: "Thank you",
    thankLead: "Your request has been received. We will confirm availability, vehicle and fixed price manually.",
    newQuote: "New quote",
    backHome: "Back to home",
    openWhatsApp: "Open WhatsApp",
    fleetBest: "Best for",
    capacity: "Capacity",
    luggage: "Luggage",
    amenities: "Amenities",
    routeCta: "Request this route",
    learnMore: "Learn more",
    footerText: "Luxury airport transfers, chauffeur service and group transport in Prague and Europe."
  },
  cs: {
    brandMeta: "Praha - 24/7",
    nav: ["Domu", "Sluzby", "Vozovy park", "Programy", "Poptavka", "Kontakt"],
    ctaQuote: "Ziskat pevnou cenu",
    ctaWhatsApp: "Rezervovat pres WhatsApp",
    responseTime: "Na WhatsAppu obvykle odpovidame behem nekolika minut.",
    heroEyebrow: "VIP transfery v Praze a Evrope",
    homeTitle: "Soukrome transfery z letiste Praha a po Evrope",
    homeLead:
      "Premiove sedany, Mercedes V-Class, minibusy a autobusy pro letistni transfery, soukromeho ridice, mezimestske trasy a VIP programy.",
    trust: [
      ["Licencovana spolecnost", `ICO ${company.ico}, DIC ${company.vat}`],
      ["Podpora 24/7", "WhatsApp, telefon a email"],
      ["Sledovani letu", "Spravne nacasovani priletu"],
      ["Profesionalni ridici", "Diskretni a presna sluzba"],
      ["Pevna cenova nabidka", "Cena pred potvrzenim"],
      ["Vicejazycna sluzba", "Anglicky, cesky a arabsky"]
    ],
    sections: {
      routesTitle: "Oblibene soukrome trasy",
      routesText: "Rychla poptavka pro trasy, ktere klienti zadavaji nejcasteji.",
      airportTitle: "Vyzvednuti na letisti bez stresu",
      airportText: "Poslete let, zavazadla a pocet cestujicich. Potvrdime vozidlo, cas vyzvednuti a pevnou cenu.",
      fleetTitle: "Premiovy vozovy park pro kazdou skupinu",
      fleetText: "Vyberte vozidlo podle poctu cestujicich, zavazadel a prilezitosti.",
      servicesTitle: "VIP transferove sluzby",
      servicesText: "Letistni transfery, soukromy ridic, trasy po Evrope a programy z Prahy.",
      programsTitle: "Soukrome programy z Prahy",
      programsText: "Vylety a sezonni aktivity s flexibilnim casem a profesionalnimi ridici.",
      faqTitle: "Dotazy k rezervaci",
      proofTitle: "Duvera pro letistni prijezdy, trasy a VIP skupiny",
      proofText:
        "Kazdou poptavku kontrolujeme rucne, aby bylo jasne vozidlo, zavazadla, cas vyzvednuti a pevna cena pred cestou.",
      proofQuote: "Sledovani letu, jasna cena a spravne vozidlo pred vyzvednutim.",
      finalTitle: "Chcete pevnou cenu transferu?",
      finalText: "Poslete detaily cesty a potvrdime vhodne vozidlo i cenu."
    },
    quote: {
      title: "Ziskat pevnou cenu transferu",
      lead: "Zadejte trasu, cas, pocet cestujicich a zavazadla. Dostupnost a cenu potvrdime rucne.",
      trip: "Detaily cesty",
      contact: "Kontakt",
      notes: "Poznamky a preference",
      type: "Typ cesty",
      oneWay: "Jednosmerne",
      roundTrip: "Zpatecni",
      pickupDate: "Datum vyzvednuti",
      pickupTime: "Cas vyzvednuti",
      returnDate: "Datum navratu",
      returnTime: "Cas navratu",
      pickup: "Misto vyzvednuti",
      dropoff: "Cil",
      passengers: "Cestujici",
      luggage: "Zavazadla",
      vehicle: "Preferovane vozidlo",
      flightNumber: "Cislo letu",
      childSeats: "Detske sedacky",
      name: "Jmeno",
      phone: "Telefon",
      email: "Email",
      notesLabel: "Poznamky",
      send: "Odeslat poptavku",
      whatsapp: "Otevrit WhatsApp",
      response: "Zadna platba predem. Potvrdime dostupnost, vozidlo a pevnou cenu.",
      presetsTitle: "Rychle predvolby tras",
      presetsText: "Vyberte oblibenou trasu a formular se predvyplni.",
      liveTitle: "Souhrn poptavky",
      liveRoute: "Trasa",
      liveTiming: "Cas",
      liveVehicle: "Vozidlo",
      liveContact: "Kontakt"
    },
    contactTitle: "Kontakt VIP Coach Transfers",
    contactLead: "Nejrychlejsi odpoved ziskate pres WhatsApp s trasou a casem cesty.",
    mapOpen: "Otevrit v Google Maps",
    thankTitle: "Dekujeme",
    thankLead: "Poptavku jsme prijali. Dostupnost, vozidlo a pevnou cenu potvrdime rucne.",
    newQuote: "Nova poptavka",
    backHome: "Zpet domu",
    openWhatsApp: "Otevrit WhatsApp",
    fleetBest: "Vhodne pro",
    capacity: "Kapacita",
    luggage: "Zavazadla",
    amenities: "Vybava",
    routeCta: "Poptat tuto trasu",
    learnMore: "Vice informaci",
    footerText: "Luxusni letistni transfery, soukromy ridic a skupinova doprava v Praze a Evrope."
  },
  ar: {
    brandMeta: "براغ - 24/7",
    nav: ["الرئيسية", "الخدمات", "الأسطول", "البرامج", "عرض سعر", "تواصل"],
    ctaQuote: "احصل على سعر ثابت",
    ctaWhatsApp: "احجز عبر واتساب",
    responseTime: "نرد غالباً خلال دقائق عبر واتساب.",
    heroEyebrow: "تنقلات VIP في براغ وأوروبا",
    homeTitle: "تنقلات خاصة من مطار براغ وإلى مدن أوروبا",
    homeLead:
      "سيارات سيدان فاخرة، مرسيدس V-Class، ميني باص وحافلات للرحلات من المطار، السائق الخاص، التنقل بين المدن والبرامج السياحية.",
    trust: [
      ["شركة مسجلة", `IČO ${company.ico}, DIČ ${company.vat}`],
      ["دعم 24/7", "واتساب، هاتف وبريد إلكتروني"],
      ["متابعة الرحلات", "تنظيم وقت الاستقبال"],
      ["سائقون محترفون", "خدمة دقيقة وخاصة"],
      ["سعر ثابت", "تأكيد السعر قبل الحجز"],
      ["خدمة متعددة اللغات", "إنجليزي، تشيكي وعربي"]
    ],
    sections: {
      routesTitle: "أشهر مسارات النقل الخاص",
      routesText: "طلبات سريعة للمسارات الأكثر طلباً من عملاء VIP.",
      airportTitle: "استقبال من المطار بدون توتر",
      airportText: "أرسل تفاصيل الرحلة وعدد الركاب والحقائب. نؤكد السيارة المناسبة ووقت الاستقبال والسعر الثابت قبل السفر.",
      fleetTitle: "أسطول فاخر لكل حجم مجموعة",
      fleetText: "اختر السيارة حسب عدد الركاب والحقائب ونوع المناسبة.",
      servicesTitle: "خدمات النقل VIP",
      servicesText: "نقل من المطار، سائق خاص، رحلات داخل أوروبا وبرامج خاصة من براغ.",
      programsTitle: "برامج خاصة من براغ",
      programsText: "رحلات يومية وأنشطة موسمية مع توقيت مرن وسائقين محترفين.",
      faqTitle: "أسئلة الحجز",
      proofTitle: "ثقة لرحلات المطار والمسارات ومجموعات VIP",
      proofText: "نراجع كل طلب يدوياً لتأكيد السيارة، مساحة الحقائب، وقت الاستقبال والسعر الثابت قبل السفر.",
      proofQuote: "متابعة الرحلات، أسعار واضحة والسيارة المناسبة قبل الاستقبال.",
      finalTitle: "هل تريد سعر نقل ثابت؟",
      finalText: "أرسل تفاصيل الرحلة وسنؤكد السيارة المناسبة والسعر."
    },
    quote: {
      title: "احصل على سعر نقل ثابت",
      lead: "أرسل المسار، الوقت، عدد الركاب والحقائب. نؤكد التوفر والسعر يدوياً.",
      trip: "تفاصيل الرحلة",
      contact: "بيانات التواصل",
      notes: "ملاحظات وتفضيلات",
      type: "نوع الرحلة",
      oneWay: "ذهاب فقط",
      roundTrip: "ذهاب وعودة",
      pickupDate: "تاريخ الانطلاق",
      pickupTime: "وقت الانطلاق",
      returnDate: "تاريخ العودة",
      returnTime: "وقت العودة",
      pickup: "مكان الانطلاق",
      dropoff: "الوجهة",
      passengers: "عدد الركاب",
      luggage: "الأمتعة",
      vehicle: "السيارة المفضلة",
      flightNumber: "رقم الرحلة",
      childSeats: "مقاعد أطفال",
      name: "الاسم",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      notesLabel: "ملاحظات",
      send: "إرسال الطلب",
      whatsapp: "فتح واتساب",
      response: "لا يوجد دفع الآن. نؤكد التوفر والسيارة والسعر الثابت قبل الحجز.",
      presetsTitle: "مسارات سريعة",
      presetsText: "اختر مساراً شائعاً لتعبئة نموذج السعر تلقائياً.",
      liveTitle: "ملخص الطلب",
      liveRoute: "المسار",
      liveTiming: "الوقت",
      liveVehicle: "السيارة",
      liveContact: "التواصل"
    },
    contactTitle: "تواصل مع VIP Coach Transfers",
    contactLead: "لأسرع رد، أرسل المسار ووقت الرحلة عبر واتساب.",
    mapOpen: "افتح في خرائط Google",
    thankTitle: "شكراً لك",
    thankLead: "تم استلام طلبك. سنؤكد التوفر والسيارة والسعر الثابت يدوياً.",
    newQuote: "طلب جديد",
    backHome: "العودة للرئيسية",
    openWhatsApp: "فتح واتساب",
    fleetBest: "مناسب لـ",
    capacity: "السعة",
    luggage: "الأمتعة",
    amenities: "المزايا",
    routeCta: "اطلب هذا المسار",
    learnMore: "المزيد",
    footerText: "نقل فاخر من المطار، سائق خاص ونقل مجموعات في براغ وأوروبا."
  }
};

const fleetBase = [
  { key: "sedan", image: images.sedan, vehicleKey: "sedan" as const },
  { key: "v-class", image: images.vclass, vehicleKey: "v-class" as const },
  { key: "minibus", image: images.minibus, vehicleKey: "minibus" as const },
  { key: "coach", image: images.coach, vehicleKey: "coach" as const }
];

export const fleet: Record<Language, FleetItem[]> = {
  en: [
    ["Luxury Sedan", "1-3", "2-3 bags", "Airport transfers, executives and private city rides", "Wi-Fi, water, comfortable cabin"],
    ["Mercedes V-Class", "4-7", "5-7 bags", "Families, VIP guests and small groups", "Spacious cabin, climate, luggage room"],
    ["Luxury Minibus", "8-20", "10-20 bags", "Tours, corporate groups and events", "A/C, extra space, group logistics"],
    ["Executive Coach", "21-60+", "Large luggage", "Conferences, delegations and large groups", "A/C, microphone, long-distance comfort"]
  ].map(([title, capacity, luggage, bestFor, amenities], index) => ({
    ...fleetBase[index],
    title,
    capacity,
    luggage,
    bestFor,
    amenities,
    text: bestFor
  })),
  cs: [
    ["Luxusni sedan", "1-3", "2-3 zavazadla", "Letistni transfery, business a soukrome jizdy", "Wi-Fi, voda, pohodlna kabina"],
    ["Mercedes V-Class", "4-7", "5-7 zavazadel", "Rodiny, VIP hoste a male skupiny", "Prostorna kabina, klima, prostor pro zavazadla"],
    ["Luxusni minibus", "8-20", "10-20 zavazadel", "Vylety, firmy a udalosti", "Klimatizace, vice prostoru, skupinova logistika"],
    ["Executive autobus", "21-60+", "Velka zavazadla", "Konference, delegace a velke skupiny", "Klimatizace, mikrofon, pohodli na dlouhe trasy"]
  ].map(([title, capacity, luggage, bestFor, amenities], index) => ({
    ...fleetBase[index],
    title,
    capacity,
    luggage,
    bestFor,
    amenities,
    text: bestFor
  })),
  ar: [
    ["سيدان فاخرة", "1-3", "2-3 حقائب", "نقل المطار، رجال الأعمال والتنقل داخل المدينة", "واي فاي، ماء، مقصورة مريحة"],
    ["مرسيدس V-Class", "4-7", "5-7 حقائب", "العائلات، ضيوف VIP والمجموعات الصغيرة", "مساحة واسعة، تكييف، مكان للحقائب"],
    ["ميني باص فاخر", "8-20", "10-20 حقيبة", "الجولات، الشركات والفعاليات", "تكييف، مساحة إضافية، تنظيم مجموعات"],
    ["حافلة Executive", "21-60+", "حقائب كبيرة", "مؤتمرات، وفود ومجموعات كبيرة", "تكييف، ميكروفون، راحة للمسافات الطويلة"]
  ].map(([title, capacity, luggage, bestFor, amenities], index) => ({
    ...fleetBase[index],
    title,
    capacity,
    luggage,
    bestFor,
    amenities,
    text: bestFor
  }))
};

const serviceBase: Array<Pick<ServiceItem, "key" | "image" | "detailsHref" | "quoteParams">> = [
  { key: "airport-pickup", image: images.serviceAirport, detailsHref: "airport-transfer-prague.html", quoteParams: { service: "airport-pickup", route: "airport" } },
  { key: "airport-dropoff", image: images.serviceDrop, detailsHref: "airport-transfer-prague.html", quoteParams: { service: "airport-dropoff", route: "airport" } },
  { key: "chauffeur", image: images.serviceDriver, detailsHref: "private-chauffeur-prague.html", quoteParams: { service: "chauffeur", route: "chauffeur" } },
  { key: "europe-transfer", image: images.serviceEurope, detailsHref: "europe-transfers.html", quoteParams: { service: "europe-transfer", route: "europe" } },
  { key: "daily-tour", image: images.serviceTours, detailsHref: "programs.html", quoteParams: { service: "daily-tour" } },
  { key: "programs-events", image: images.servicePrograms, detailsHref: "programs.html", quoteParams: { service: "program" } }
];

export const services: Record<Language, ServiceItem[]> = {
  en: [
    ["Airport pickup", "Meet and greet, flight tracking, luggage help and direct transfer to your hotel."],
    ["Airport drop-off", "Door-to-door pickup with timing planned around your departure."],
    ["Private chauffeur", "Driver on disposal for business, shopping, events or full-stay support."],
    ["Europe transfers", "Private routes from Prague to Vienna, Dresden, Munich, Berlin, Budapest and more."],
    ["Daily tours", "Flexible private day trips from Prague with a professional driver."],
    ["Programs and events", "Seasonal activities, VIP programs and group logistics."]
  ].map(serviceMapper),
  cs: [
    ["Vyzvednuti na letisti", "Meet and greet, sledovani letu, pomoc se zavazadly a transfer do hotelu."],
    ["Odvoz na letiste", "Vyzvednuti ode dveri s casem podle vaseho odletu."],
    ["Soukromy ridic", "Ridic k dispozici pro business, nakupy, udalosti nebo cely pobyt."],
    ["Transfery po Evrope", "Soukrome trasy z Prahy do Vidne, Drazdan, Mnichova, Berlina, Budapesti a dalsich mest."],
    ["Denni vylety", "Flexibilni soukrome vylety z Prahy s profesionalnim ridicem."],
    ["Programy a akce", "Sezonni aktivity, VIP programy a skupinova logistika."]
  ].map(serviceMapper),
  ar: [
    ["استقبال من المطار", "استقبال، متابعة الرحلة، مساعدة بالحقائب ونقل مباشر إلى الفندق."],
    ["توديع إلى المطار", "نقل من الباب إلى المطار مع توقيت مناسب لرحلة المغادرة."],
    ["سائق خاص", "سائق مرافق للأعمال، التسوق، الفعاليات أو طوال مدة الإقامة."],
    ["نقل داخل أوروبا", "رحلات خاصة من براغ إلى فيينا، دريسدن، ميونخ، برلين، بودابست والمزيد."],
    ["رحلات يومية", "رحلات خاصة مرنة من براغ مع سائق محترف."],
    ["برامج وفعاليات", "أنشطة موسمية، برامج VIP وتنظيم نقل المجموعات."]
  ].map(serviceMapper)
};

function serviceMapper([title, text]: string[], index: number): ServiceItem {
  return { ...serviceBase[index], title, text };
}

const routeBase = {
  "airport-transfer-prague.html": { key: "airport", image: images.serviceAirport },
  "private-chauffeur-prague.html": { key: "chauffeur", image: images.serviceDriver },
  "europe-transfers.html": { key: "europe", image: images.serviceEurope },
  "prague-to-vienna-transfer.html": { key: "vienna", image: images.serviceEurope },
  "prague-to-dresden-transfer.html": { key: "dresden", image: images.dresden },
  "prague-to-cesky-krumlov-transfer.html": { key: "cesky", image: images.cesky }
};

const routeText: Record<Language, Record<string, [string, string, string, string]>> = {
  en: {
    "airport-transfer-prague.html": ["Prague Airport Transfer", "Private airport pickup and drop-off in Prague with flight tracking, luggage help and fixed quote before booking.", "Airport to Prague center", "Usually 30-45 minutes depending on traffic"],
    "private-chauffeur-prague.html": ["Private Chauffeur in Prague", "Driver on disposal for business meetings, shopping, city programs, events and full-stay VIP support.", "Hourly or full-day service", "Flexible stops and waiting time"],
    "europe-transfers.html": ["Private Europe Transfers from Prague", "Door-to-door long-distance transfers from Prague to cities across Central Europe.", "Vienna, Dresden, Munich, Berlin, Budapest", "Sedans, vans, minibuses and coaches"],
    "prague-to-vienna-transfer.html": ["Prague to Vienna Private Transfer", "Comfortable private transfer between Prague and Vienna with fixed quote and vehicle matched to passengers and luggage.", "Prague to Vienna", "Approx. 4 hours"],
    "prague-to-dresden-transfer.html": ["Prague to Dresden Private Transfer", "Private transfer or day trip from Prague to Dresden with flexible pickup, stops and return timing.", "Prague to Dresden", "Approx. 2 hours"],
    "prague-to-cesky-krumlov-transfer.html": ["Prague to Cesky Krumlov Private Transfer", "Private transfer or day trip to Cesky Krumlov with professional driver and comfortable vehicle.", "Prague to Cesky Krumlov", "Approx. 2.5-3 hours"]
  },
  cs: {
    "airport-transfer-prague.html": ["Transfer z letiste Praha", "Soukrome vyzvednuti a odvoz na letiste v Praze se sledovanim letu, pomoci se zavazadly a pevnou cenou.", "Letiste do centra Prahy", "Obvykle 30-45 minut podle provozu"],
    "private-chauffeur-prague.html": ["Soukromy ridic v Praze", "Ridic k dispozici pro obchodni schuzky, nakupy, program ve meste, udalosti a VIP podporu behem pobytu.", "Hodinova nebo celodenni sluzba", "Flexibilni zastavky a cekani"],
    "europe-transfers.html": ["Soukrome transfery z Prahy po Evrope", "Dalkove transfery ode dveri z Prahy do mest ve stredni Evrope.", "Viden, Drazdany, Mnichov, Berlin, Budapest", "Sedany, vany, minibusy a autobusy"],
    "prague-to-vienna-transfer.html": ["Soukromy transfer Praha - Viden", "Pohodlny soukromy transfer mezi Prahou a Vidni s pevnou cenou a vhodnym vozidlem.", "Praha - Viden", "Priblizne 4 hodiny"],
    "prague-to-dresden-transfer.html": ["Soukromy transfer Praha - Drazdany", "Soukromy transfer nebo vylet z Prahy do Drazdan s flexibilnim vyzvednutim, zastavkami a navratem.", "Praha - Drazdany", "Priblizne 2 hodiny"],
    "prague-to-cesky-krumlov-transfer.html": ["Soukromy transfer Praha - Cesky Krumlov", "Soukromy transfer nebo vylet do Ceskeho Krumlova s profesionalnim ridicem a pohodlnym vozidlem.", "Praha - Cesky Krumlov", "Priblizne 2.5-3 hodiny"]
  },
  ar: {
    "airport-transfer-prague.html": ["نقل من مطار براغ", "استقبال وتوديع خاص في مطار براغ مع متابعة الرحلة، مساعدة بالحقائب وسعر ثابت قبل الحجز.", "من المطار إلى وسط براغ", "عادة 30-45 دقيقة حسب الطريق"],
    "private-chauffeur-prague.html": ["سائق خاص في براغ", "سائق مرافق لاجتماعات العمل، التسوق، برامج المدينة، الفعاليات ودعم VIP طوال الإقامة.", "بالساعة أو يوم كامل", "توقفات مرنة وانتظار"],
    "europe-transfers.html": ["نقل خاص من براغ إلى أوروبا", "تنقلات طويلة من الباب إلى الباب من براغ إلى مدن أوروبا الوسطى.", "فيينا، دريسدن، ميونخ، برلين، بودابست", "سيدان، فان، ميني باص وحافلات"],
    "prague-to-vienna-transfer.html": ["نقل خاص من براغ إلى فيينا", "تنقل مريح وخاص بين براغ وفيينا مع سعر ثابت وسيارة مناسبة للركاب والحقائب.", "براغ إلى فيينا", "حوالي 4 ساعات"],
    "prague-to-dresden-transfer.html": ["نقل خاص من براغ إلى دريسدن", "نقل خاص أو رحلة يومية من براغ إلى دريسدن مع توقيت مرن وتوقفات وعودة.", "براغ إلى دريسدن", "حوالي ساعتين"],
    "prague-to-cesky-krumlov-transfer.html": ["نقل خاص من براغ إلى تشيسكي كروملوف", "نقل خاص أو رحلة يومية إلى تشيسكي كروملوف مع سائق محترف وسيارة مريحة.", "براغ إلى تشيسكي كروملوف", "حوالي 2.5-3 ساعات"]
  }
};

export const routes: Record<Language, RoutePageContent[]> = {
  en: routeMapper("en"),
  cs: routeMapper("cs"),
  ar: routeMapper("ar")
};

function routeMapper(lang: Language): RoutePageContent[] {
  return Object.entries(routeBase).map(([slug, base]) => {
    const [title, description, label, duration] = routeText[lang][slug];
    return { ...base, slug, title, description, label, duration };
  });
}

const programBase = [
  { key: "cesky", image: images.cesky },
  { key: "karlovy", image: images.karlovy },
  { key: "dresden", image: images.dresden },
  { key: "spindl", image: images.spindl },
  { key: "dolni", image: images.dolni },
  { key: "adventure", image: images.action }
];

export const programs: Record<Language, ProgramItem[]> = {
  en: [
    ["Cesky Krumlov", "Historic private day trip from Prague with flexible stops.", "Approx. 10-11 hours", "Best in spring, summer and autumn", "Couples, families and private groups", "Sedan, V-Class or minibus"],
    ["Karlovy Vary", "Spa town transfer with free time for walking, cafes and optional wellness.", "Approx. 8-9 hours", "Year-round spa program", "Wellness trips and private sightseeing", "Sedan or V-Class"],
    ["Dresden", "Private transfer or day trip for art, shopping and old town sightseeing.", "Approx. 8-10 hours", "Year-round city trip", "Shopping, museums and old town visits", "Sedan, V-Class or minibus"],
    ["Spindleruv Mlyn", "Mountain program for snow, nature and seasonal activities.", "Full-day mountain program", "Winter snow and summer nature", "Families and active groups", "V-Class or minibus"],
    ["Dolni Morava", "Sky Bridge, mountain views and outdoor activities.", "Full-day mountain program", "Spring to autumn activities", "Outdoor and adventure groups", "V-Class or minibus"],
    ["Adventure Prague", "Private activity program for groups and events.", "Flexible timing", "Best for events and group programs", "Corporate groups, friends and VIP guests", "V-Class, minibus or coach"]
  ].map(programMapper),
  cs: [
    ["Cesky Krumlov", "Historicky soukromy vylet z Prahy s flexibilnimi zastavkami.", "Priblizne 10-11 hodin", "Jaro, leto a podzim", "Pary, rodiny a soukrome skupiny", "Sedan, V-Class nebo minibus"],
    ["Karlovy Vary", "Transfer do lazni s volnym casem na prochazku, kavarny a wellness.", "Priblizne 8-9 hodin", "Lazensky program po cely rok", "Wellness a soukrome prohlidky", "Sedan nebo V-Class"],
    ["Drazdany", "Soukromy transfer nebo vylet za umenim, nakupy a historickym centrem.", "Priblizne 8-10 hodin", "Mestsky vylet po cely rok", "Nakupy, muzea a historicke centrum", "Sedan, V-Class nebo minibus"],
    ["Spindleruv Mlyn", "Horsky program pro snih, prirodu a sezonni aktivity.", "Celodenni horsky program", "Zimni snih a letni priroda", "Rodiny a aktivni skupiny", "V-Class nebo minibus"],
    ["Dolni Morava", "Sky Bridge, horske vyhledy a venkovni aktivity.", "Celodenni horsky program", "Aktivity od jara do podzimu", "Outdoor a dobrodruzne skupiny", "V-Class nebo minibus"],
    ["Adventure Prague", "Soukromy program aktivit pro skupiny a udalosti.", "Flexibilni cas", "Vhodne pro akce a skupiny", "Firmy, pratele a VIP hoste", "V-Class, minibus nebo autobus"]
  ].map(programMapper),
  ar: [
    ["تشيسكي كروملوف", "رحلة يومية تاريخية من براغ مع توقفات مرنة.", "حوالي 10-11 ساعة", "الأفضل في الربيع والصيف والخريف", "الأزواج والعائلات والمجموعات الخاصة", "سيدان، V-Class أو ميني باص"],
    ["كارلوفي فاري", "نقل إلى مدينة السبا مع وقت حر للمشي والمقاهي والسبا.", "حوالي 8-9 ساعات", "برنامج سبا طوال العام", "رحلات wellness ومشاهدة خاصة", "سيدان أو V-Class"],
    ["دريسدن", "نقل خاص أو رحلة يومية للفن والتسوق والمدينة القديمة.", "حوالي 8-10 ساعات", "رحلة مدينة طوال العام", "تسوق، متاحف والمدينة القديمة", "سيدان، V-Class أو ميني باص"],
    ["شبيندلروف ملين", "برنامج جبلي للثلج والطبيعة والأنشطة الموسمية.", "برنامج جبلي ليوم كامل", "ثلج في الشتاء وطبيعة في الصيف", "العائلات والمجموعات النشطة", "V-Class أو ميني باص"],
    ["دولني مورافا", "Sky Bridge وإطلالات جبلية وأنشطة خارجية.", "برنامج جبلي ليوم كامل", "أنشطة من الربيع إلى الخريف", "مجموعات المغامرة والأنشطة الخارجية", "V-Class أو ميني باص"],
    ["مغامرات براغ", "برنامج أنشطة خاص للمجموعات والفعاليات.", "توقيت مرن", "مناسب للفعاليات والمجموعات", "شركات، أصدقاء وضيوف VIP", "V-Class، ميني باص أو حافلة"]
  ].map(programMapper)
};

function programMapper([title, text, duration, season, idealFor, vehicle]: string[], index: number): ProgramItem {
  return { ...programBase[index], title, text, duration, season, idealFor, vehicle };
}

export const faqs: Record<Language, [string, string][]> = {
  en: [
    ["Do I pay before booking?", "No. Send the trip details first. We confirm the vehicle, availability and fixed price before the booking is agreed."],
    ["Can you track airport arrivals?", "Yes. Share the flight number in the notes so pickup timing can be planned around the actual arrival."],
    ["Which vehicle should I choose?", "If you are unsure, enter passenger and luggage details. We will recommend the right sedan, van, minibus or coach."]
  ],
  cs: [
    ["Platim pred rezervaci?", "Ne. Nejprve poslete detaily cesty. Potvrdime vozidlo, dostupnost a pevnou cenu."],
    ["Sledujete prilety?", "Ano. Do poznamek uvedte cislo letu, aby bylo mozne naplanovat cas vyzvednuti."],
    ["Jake vozidlo mam vybrat?", "Pokud si nejste jisti, zadejte pocet cestujicich a zavazadla. Doporucime sedan, van, minibus nebo autobus."]
  ],
  ar: [
    ["هل أدفع قبل الحجز؟", "لا. أرسل تفاصيل الرحلة أولاً. نؤكد السيارة والتوفر والسعر الثابت قبل تأكيد الحجز."],
    ["هل تتابعون رحلات الوصول؟", "نعم. أرسل رقم الرحلة في الملاحظات ليتم تنظيم وقت الاستقبال حسب الوصول الفعلي."],
    ["أي سيارة أختار؟", "إذا لم تكن متأكداً، أدخل عدد الركاب والحقائب وسنقترح السيارة المناسبة."]
  ]
};

export const cmsData: Record<Language, PublicCmsData> = {
  en: { lang: "en", copy: copy.en, fleet: fleet.en, services: services.en, programs: programs.en, routes: routes.en, faqs: faqs.en },
  cs: { lang: "cs", copy: copy.cs, fleet: fleet.cs, services: services.cs, programs: programs.cs, routes: routes.cs, faqs: faqs.cs },
  ar: { lang: "ar", copy: copy.ar, fleet: fleet.ar, services: services.ar, programs: programs.ar, routes: routes.ar, faqs: faqs.ar }
};

export const publicSlugs = [
  "index.html",
  "services.html",
  "fleet.html",
  "programs.html",
  "quote.html",
  "contact.html",
  "thankyou.html",
  ...Object.keys(routeBase)
];

const cleanSlugOverrides: Record<string, string> = {
  "index.html": "",
  "services.html": "services",
  "fleet.html": "fleet",
  "programs.html": "programs",
  "quote.html": "quote",
  "contact.html": "contact",
  "thankyou.html": "thankyou"
};

export function getRouteBySlug(lang: Language, slug: string): RoutePageContent | undefined {
  return cmsData[lang].routes.find((route) => route.slug === slug);
}

export function isRouteSlug(slug: string): boolean {
  return Object.prototype.hasOwnProperty.call(routeBase, slug);
}

export function queryString(params: Record<string, string | undefined>): string {
  const search = new URLSearchParams();
  for (const [key, value] of Object.entries(params)) {
    if (value) search.set(key, value);
  }
  const serialized = search.toString();
  return serialized ? `?${serialized}` : "";
}

export function slugToPathSegment(slug: string): string {
  if (Object.prototype.hasOwnProperty.call(cleanSlugOverrides, slug)) {
    return cleanSlugOverrides[slug];
  }
  return slug.replace(/\.html$/, "");
}

export const publicSegments = publicSlugs.map((slug) => slugToPathSegment(slug)).filter(Boolean);

export function resolvePublicSlug(value?: string | null): string | null {
  const normalized = String(value || "")
    .trim()
    .replace(/^\/+|\/+$/g, "");
  if (!normalized) return "index.html";
  if (publicSlugs.includes(normalized)) return normalized;
  return publicSlugs.find((slug) => slugToPathSegment(slug) === normalized) ?? null;
}

export function pageHref(lang: Language, slug: string): string {
  const segment = slugToPathSegment(slug);
  return segment ? `/${lang}/${segment}` : `/${lang}`;
}

export function rootHref(slug: string): string {
  const segment = slugToPathSegment(slug);
  return segment ? `/${segment}` : "/";
}

export function canonicalHref(lang: Language, slug: string, rootCompat = false): string {
  if (rootCompat || lang === "en") return rootHref(slug);
  return pageHref(lang, slug);
}

export function legacyPageHref(lang: Language, slug: string): string {
  return `/${lang}/${slug}`;
}

export function legacyRootHref(slug: string): string {
  return `/${slug}`;
}

export function legacyRedirectPath(pathname: string): string | null {
  const normalizedPath = pathname === "/" ? "/" : pathname.replace(/\/+$/, "");
  if (normalizedPath === "/index.html") return "/";

  const localized = normalizedPath.match(/^\/(en|cs|ar)\/(.+)$/);
  if (localized) {
    const [, lang, rawSlug] = localized;
    if (!rawSlug.endsWith(".html")) return null;
    const slug = resolvePublicSlug(rawSlug);
    return slug ? pageHref(lang as Language, slug) : null;
  }

  const root = normalizedPath.match(/^\/(.+)$/);
  const rawSlug = root?.[1];
  if (!rawSlug || !rawSlug.endsWith(".html")) return null;
  const slug = resolvePublicSlug(rawSlug);
  return slug ? rootHref(slug) : null;
}

export function cardFromFleet(item: FleetItem): CardContent {
  return { key: item.key, title: item.title, text: item.bestFor, image: item.image };
}
