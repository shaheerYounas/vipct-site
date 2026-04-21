import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const SITE = "https://vipct.org";
const WA_NUMBER = "420775091730";
const EMAIL = "info@vipct.org";
const PHONE = "+420 775 091 730";
const ADDRESS = "Moulikova 2240/5, 150 00 Praha";
const COMPANY = "VIP Coach Transfers s.r.o.";
const ICO = "23693592";
const VAT = "CZ23693592";

const languages = {
  en: { label: "EN", html: "en", dir: "ltr", folder: "en" },
  cs: { label: "CS", html: "cs", dir: "ltr", folder: "cs" },
  ar: { label: "AR", html: "ar", dir: "rtl", folder: "ar" }
};

const copy = {
  en: {
    brandMeta: "Prague - 24/7",
    nav: ["Home", "Services", "Fleet", "Programs", "Quote", "Contact"],
    ctaQuote: "Get fixed price",
    ctaWhatsApp: "Book on WhatsApp",
    heroEyebrow: "VIP transfers in Prague and Europe",
    homeTitle: "Private Prague airport and Europe transfers",
    homeLead: "Premium sedans, Mercedes V-Class vans, minibuses and coaches for airport pickups, private chauffeur service, city-to-city routes and VIP programs.",
    trust: [
      ["Licensed company", `IČO ${ICO}, DIČ ${VAT}`],
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
      airportText: "Share flight details, luggage and passenger count. We confirm the right vehicle, pickup timing and fixed price before you travel.",
      fleetTitle: "Premium fleet for every group size",
      fleetText: "Choose the vehicle by passengers, luggage and occasion.",
      servicesTitle: "VIP transfer services",
      servicesText: "Airport transfers, chauffeur service, Europe routes and private programs from Prague.",
      programsTitle: "Private programs from Prague",
      programsText: "Day trips and seasonal activities with flexible timing and professional drivers.",
      faqTitle: "Booking questions",
      finalTitle: "Ready for a fixed transfer quote?",
      finalText: "Send the trip details and we will confirm the right vehicle and price."
    },
    quote: {
      title: "Get a fixed transfer quote",
      lead: "Tell us the route, timing, passengers and luggage. You can send by email form or open the same request in WhatsApp.",
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
      name: "Name",
      phone: "Phone",
      email: "Email",
      notesLabel: "Notes",
      send: "Send request",
      whatsapp: "Preview WhatsApp",
      response: "No payment now. We confirm availability, vehicle and fixed price before booking.",
      modalTitle: "Confirm WhatsApp request",
      modalLead: "Review the message before opening WhatsApp.",
      cancel: "Cancel",
      sendWa: "Send via WhatsApp"
    },
    contactTitle: "Contact VIP Coach Transfers",
    contactLead: "For the fastest reply, send your route and travel time on WhatsApp.",
    thankTitle: "Thank you",
    thankLead: "Your request details are ready. If WhatsApp did not open, use the button below.",
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
    heroEyebrow: "VIP transfery v Praze a Evrope",
    homeTitle: "Soukrome transfery z letiste Praha a po Evrope",
    homeLead: "Premiove sedany, Mercedes V-Class, minibusy a autobusy pro letistni transfery, soukromeho ridice, mezimestske trasy a VIP programy.",
    trust: [
      ["Licencovana spolecnost", `ICO ${ICO}, DIC ${VAT}`],
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
      finalTitle: "Chcete pevnou cenu transferu?",
      finalText: "Poslete detaily cesty a potvrdime vhodne vozidlo i cenu."
    },
    quote: {
      title: "Ziskat pevnou cenu transferu",
      lead: "Zadejte trasu, cas, pocet cestujicich a zavazadla. Poptavku muzete poslat emailem nebo pres WhatsApp.",
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
      name: "Jmeno",
      phone: "Telefon",
      email: "Email",
      notesLabel: "Poznamky",
      send: "Odeslat poptavku",
      whatsapp: "Nahled WhatsApp",
      response: "Zadna platba predem. Potvrdime dostupnost, vozidlo a pevnou cenu.",
      modalTitle: "Potvrdit WhatsApp poptavku",
      modalLead: "Zkontrolujte zpravu pred otevrenim WhatsApp.",
      cancel: "Zrusit",
      sendWa: "Odeslat pres WhatsApp"
    },
    contactTitle: "Kontakt VIP Coach Transfers",
    contactLead: "Nejrychlejsi odpoved ziskate pres WhatsApp s trasou a casem cesty.",
    thankTitle: "Dekujeme",
    thankLead: "Detaily poptavky jsou pripravene. Pokud se WhatsApp neotevrel, pouzijte tlacitko nize.",
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
    heroEyebrow: "تنقلات VIP في براغ وأوروبا",
    homeTitle: "تنقلات خاصة من مطار براغ وإلى مدن أوروبا",
    homeLead: "سيارات سيدان فاخرة، مرسيدس V-Class، ميني باص وحافلات للرحلات من المطار، السائق الخاص، التنقل بين المدن والبرامج السياحية.",
    trust: [
      ["شركة مسجلة", `IČO ${ICO}, DIČ ${VAT}`],
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
      finalTitle: "هل تريد سعر نقل ثابت؟",
      finalText: "أرسل تفاصيل الرحلة وسنؤكد السيارة المناسبة والسعر."
    },
    quote: {
      title: "احصل على سعر نقل ثابت",
      lead: "أرسل المسار، الوقت، عدد الركاب والحقائب. يمكنك إرسال الطلب بالبريد أو فتح نفس الطلب في واتساب.",
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
      name: "الاسم",
      phone: "الهاتف",
      email: "البريد الإلكتروني",
      notesLabel: "ملاحظات",
      send: "إرسال الطلب",
      whatsapp: "معاينة واتساب",
      response: "لا يوجد دفع الآن. نؤكد التوفر والسيارة والسعر الثابت قبل الحجز.",
      modalTitle: "تأكيد طلب واتساب",
      modalLead: "راجع الرسالة قبل فتح واتساب.",
      cancel: "إلغاء",
      sendWa: "إرسال عبر واتساب"
    },
    contactTitle: "تواصل مع VIP Coach Transfers",
    contactLead: "لأسرع رد، أرسل المسار ووقت الرحلة عبر واتساب.",
    thankTitle: "شكراً لك",
    thankLead: "تفاصيل طلبك جاهزة. إذا لم يفتح واتساب، استخدم الزر أدناه.",
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

const navPages = [
  ["home", "index.html"],
  ["services", "services.html"],
  ["fleet", "fleet.html"],
  ["programs", "programs.html"],
  ["quote", "quote.html"],
  ["contact", "contact.html"]
];

const images = {
  logo: "assets/optimized/logo-gold.webp",
  hero: "assets/optimized/hero.webp",
  serviceAirport: "assets/optimized/Services/airport-pickup.webp",
  serviceDrop: "assets/optimized/Services/airport-dropoff.webp",
  serviceDriver: "assets/optimized/Services/private-driver.webp",
  serviceEurope: "assets/optimized/Services/europe.webp",
  serviceTours: "assets/optimized/Services/daily-tours.webp",
  servicePrograms: "assets/optimized/Services/events-programs.webp",
  serviceRental: "assets/optimized/Services/car-rental.webp",
  sedan: "assets/optimized/fleet-sedan.webp",
  vclass: "assets/optimized/fleet-vclass.webp",
  minibus: "assets/optimized/fleet-minibus.webp",
  coach: "assets/optimized/fleet-coach.webp",
  prague: "assets/optimized/programs/Prague.webp",
  cesky: "assets/optimized/programs/Cesky-krumlov.webp",
  dresden: "assets/optimized/programs/Dresden.webp",
  karlovy: "assets/optimized/programs/Karlovy-Vary.webp",
  spindl: "assets/optimized/programs/Spinderluv-Mlyn.webp",
  dolni: "assets/optimized/programs/Dolni-Morava.webp",
  action: "assets/optimized/programs/Action-PRG.webp",
  adventure: "assets/optimized/programs/Adventure Wintter.webp",
  special: "assets/optimized/programs/Special-PRG.webp"
};

const fleet = {
  en: [
    ["Luxury Sedan", "1-3", "2-3 bags", "Airport transfers, executives and private city rides", "Wi-Fi, water, comfortable cabin", images.sedan],
    ["Mercedes V-Class", "4-7", "5-7 bags", "Families, VIP guests and small groups", "Spacious cabin, climate, luggage room", images.vclass],
    ["Luxury Minibus", "8-20", "10-20 bags", "Tours, corporate groups and events", "A/C, extra space, group logistics", images.minibus],
    ["Executive Coach", "21-60+", "Large luggage", "Conferences, delegations and large groups", "A/C, microphone, long-distance comfort", images.coach]
  ],
  cs: [
    ["Luxusni sedan", "1-3", "2-3 zavazadla", "Letistni transfery, business a soukrome jizdy", "Wi-Fi, voda, pohodlna kabina", images.sedan],
    ["Mercedes V-Class", "4-7", "5-7 zavazadel", "Rodiny, VIP hoste a male skupiny", "Prostorna kabina, klima, prostor pro zavazadla", images.vclass],
    ["Luxusni minibus", "8-20", "10-20 zavazadel", "Vylety, firmy a udalosti", "Klimatizace, vice prostoru, skupinova logistika", images.minibus],
    ["Executive autobus", "21-60+", "Velka zavazadla", "Konference, delegace a velke skupiny", "Klimatizace, mikrofon, pohodli na dlouhe trasy", images.coach]
  ],
  ar: [
    ["سيدان فاخرة", "1-3", "2-3 حقائب", "نقل المطار، رجال الأعمال والتنقل داخل المدينة", "واي فاي، ماء، مقصورة مريحة", images.sedan],
    ["مرسيدس V-Class", "4-7", "5-7 حقائب", "العائلات، ضيوف VIP والمجموعات الصغيرة", "مساحة واسعة، تكييف، مكان للحقائب", images.vclass],
    ["ميني باص فاخر", "8-20", "10-20 حقيبة", "الجولات، الشركات والفعاليات", "تكييف، مساحة إضافية، تنظيم مجموعات", images.minibus],
    ["حافلة Executive", "21-60+", "حقائب كبيرة", "مؤتمرات، وفود ومجموعات كبيرة", "تكييف، ميكروفون، راحة للمسافات الطويلة", images.coach]
  ]
};

const services = {
  en: [
    ["Airport pickup", "Meet and greet, flight tracking, luggage help and direct transfer to your hotel.", images.serviceAirport],
    ["Airport drop-off", "Door-to-door pickup with timing planned around your departure.", images.serviceDrop],
    ["Private chauffeur", "Driver on disposal for business, shopping, events or full-stay support.", images.serviceDriver],
    ["Europe transfers", "Private routes from Prague to Vienna, Dresden, Munich, Berlin, Budapest and more.", images.serviceEurope],
    ["Daily tours", "Flexible private day trips from Prague with a professional driver.", images.serviceTours],
    ["Programs and events", "Seasonal activities, VIP programs and group logistics.", images.servicePrograms]
  ],
  cs: [
    ["Vyzvednuti na letisti", "Meet and greet, sledovani letu, pomoc se zavazadly a transfer do hotelu.", images.serviceAirport],
    ["Odvoz na letiste", "Vyzvednuti ode dveri s casem podle vaseho odletu.", images.serviceDrop],
    ["Soukromy ridic", "Ridic k dispozici pro business, nakupy, udalosti nebo cely pobyt.", images.serviceDriver],
    ["Transfery po Evrope", "Soukrome trasy z Prahy do Vidne, Drazdan, Mnichova, Berlina, Budapesti a dalsich mest.", images.serviceEurope],
    ["Denni vylety", "Flexibilni soukrome vylety z Prahy s profesionalnim ridicem.", images.serviceTours],
    ["Programy a akce", "Sezonni aktivity, VIP programy a skupinova logistika.", images.servicePrograms]
  ],
  ar: [
    ["استقبال من المطار", "استقبال، متابعة الرحلة، مساعدة بالحقائب ونقل مباشر إلى الفندق.", images.serviceAirport],
    ["توديع إلى المطار", "نقل من الباب إلى المطار مع توقيت مناسب لرحلة المغادرة.", images.serviceDrop],
    ["سائق خاص", "سائق مرافق للأعمال، التسوق، الفعاليات أو طوال مدة الإقامة.", images.serviceDriver],
    ["نقل داخل أوروبا", "رحلات خاصة من براغ إلى فيينا، دريسدن، ميونخ، برلين، بودابست والمزيد.", images.serviceEurope],
    ["رحلات يومية", "رحلات خاصة مرنة من براغ مع سائق محترف.", images.serviceTours],
    ["برامج وفعاليات", "أنشطة موسمية، برامج VIP وتنظيم نقل المجموعات.", images.servicePrograms]
  ]
};

const routeData = {
  "airport-transfer-prague.html": {
    key: "airport",
    image: images.serviceAirport,
    en: ["Prague Airport Transfer", "Private airport pickup and drop-off in Prague with flight tracking, luggage help and fixed quote before booking.", "Airport to Prague center", "Usually 30-45 minutes depending on traffic"],
    cs: ["Transfer z letiste Praha", "Soukrome vyzvednuti a odvoz na letiste v Praze se sledovanim letu, pomoci se zavazadly a pevnou cenou.", "Letiste do centra Prahy", "Obvykle 30-45 minut podle provozu"],
    ar: ["نقل من مطار براغ", "استقبال وتوديع خاص في مطار براغ مع متابعة الرحلة، مساعدة بالحقائب وسعر ثابت قبل الحجز.", "من المطار إلى وسط براغ", "عادة 30-45 دقيقة حسب الطريق"]
  },
  "private-chauffeur-prague.html": {
    key: "chauffeur",
    image: images.serviceDriver,
    en: ["Private Chauffeur in Prague", "Driver on disposal for business meetings, shopping, city programs, events and full-stay VIP support.", "Hourly or full-day service", "Flexible stops and waiting time"],
    cs: ["Soukromy ridic v Praze", "Ridic k dispozici pro obchodni schuzky, nakupy, program ve meste, udalosti a VIP podporu behem pobytu.", "Hodinova nebo celodenni sluzba", "Flexibilni zastavky a cekani"],
    ar: ["سائق خاص في براغ", "سائق مرافق لاجتماعات العمل، التسوق، برامج المدينة، الفعاليات ودعم VIP طوال الإقامة.", "بالساعة أو يوم كامل", "توقفات مرنة وانتظار"]
  },
  "europe-transfers.html": {
    key: "europe",
    image: images.serviceEurope,
    en: ["Private Europe Transfers from Prague", "Door-to-door long-distance transfers from Prague to cities across Central Europe.", "Vienna, Dresden, Munich, Berlin, Budapest", "Sedans, vans, minibuses and coaches"],
    cs: ["Soukrome transfery z Prahy po Evrope", "Dalkove transfery ode dveri z Prahy do mest ve stredni Evrope.", "Viden, Drazdany, Mnichov, Berlin, Budapest", "Sedany, vany, minibusy a autobusy"],
    ar: ["نقل خاص من براغ إلى أوروبا", "تنقلات طويلة من الباب إلى الباب من براغ إلى مدن أوروبا الوسطى.", "فيينا، دريسدن، ميونخ، برلين، بودابست", "سيدان، فان، ميني باص وحافلات"]
  },
  "prague-to-vienna-transfer.html": {
    key: "vienna",
    image: images.serviceEurope,
    en: ["Prague to Vienna Private Transfer", "Comfortable private transfer between Prague and Vienna with fixed quote and vehicle matched to passengers and luggage.", "Prague to Vienna", "Approx. 4 hours"],
    cs: ["Soukromy transfer Praha - Viden", "Pohodlny soukromy transfer mezi Prahou a Vidni s pevnou cenou a vhodnym vozidlem.", "Praha - Viden", "Priblizne 4 hodiny"],
    ar: ["نقل خاص من براغ إلى فيينا", "تنقل مريح وخاص بين براغ وفيينا مع سعر ثابت وسيارة مناسبة للركاب والحقائب.", "براغ إلى فيينا", "حوالي 4 ساعات"]
  },
  "prague-to-dresden-transfer.html": {
    key: "dresden",
    image: images.dresden,
    en: ["Prague to Dresden Private Transfer", "Private transfer or day trip from Prague to Dresden with flexible pickup, stops and return timing.", "Prague to Dresden", "Approx. 2 hours"],
    cs: ["Soukromy transfer Praha - Drazdany", "Soukromy transfer nebo vylet z Prahy do Drazdan s flexibilnim vyzvednutim, zastavkami a navratem.", "Praha - Drazdany", "Priblizne 2 hodiny"],
    ar: ["نقل خاص من براغ إلى دريسدن", "نقل خاص أو رحلة يومية من براغ إلى دريسدن مع توقيت مرن وتوقفات وعودة.", "براغ إلى دريسدن", "حوالي ساعتين"]
  },
  "prague-to-cesky-krumlov-transfer.html": {
    key: "cesky",
    image: images.cesky,
    en: ["Prague to Cesky Krumlov Private Transfer", "Private transfer or day trip to Cesky Krumlov with professional driver and comfortable vehicle.", "Prague to Cesky Krumlov", "Approx. 2.5-3 hours"],
    cs: ["Soukromy transfer Praha - Cesky Krumlov", "Soukromy transfer nebo vylet do Ceskeho Krumlova s profesionalnim ridicem a pohodlnym vozidlem.", "Praha - Cesky Krumlov", "Priblizne 2.5-3 hodiny"],
    ar: ["نقل خاص من براغ إلى تشيسكي كروملوف", "نقل خاص أو رحلة يومية إلى تشيسكي كروملوف مع سائق محترف وسيارة مريحة.", "براغ إلى تشيسكي كروملوف", "حوالي 2.5-3 ساعات"]
  }
};

const faq = {
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

const programs = {
  en: [
    ["Cesky Krumlov", "Historic private day trip from Prague with flexible stops.", images.cesky],
    ["Karlovy Vary", "Spa town transfer with free time for walking, cafes and optional wellness.", images.karlovy],
    ["Dresden", "Private transfer or day trip for art, shopping and old town sightseeing.", images.dresden],
    ["Spindleruv Mlyn", "Mountain program for snow, nature and seasonal activities.", images.spindl],
    ["Dolni Morava", "Sky Bridge, mountain views and outdoor activities.", images.dolni],
    ["Adventure Prague", "Private activity program for groups and events.", images.action]
  ],
  cs: [
    ["Cesky Krumlov", "Historicky soukromy vylet z Prahy s flexibilnimi zastavkami.", images.cesky],
    ["Karlovy Vary", "Transfer do lazni s volnym casem na prochazku, kavarny a wellness.", images.karlovy],
    ["Drazdany", "Soukromy transfer nebo vylet za umenim, nakupy a historickym centrem.", images.dresden],
    ["Spindleruv Mlyn", "Horsky program pro snih, prirodu a sezonni aktivity.", images.spindl],
    ["Dolni Morava", "Sky Bridge, horske vyhledy a venkovni aktivity.", images.dolni],
    ["Adventure Prague", "Soukromy program aktivit pro skupiny a udalosti.", images.action]
  ],
  ar: [
    ["تشيسكي كروملوف", "رحلة يومية تاريخية من براغ مع توقفات مرنة.", images.cesky],
    ["كارلوفي فاري", "نقل إلى مدينة السبا مع وقت حر للمشي والمقاهي والسبا.", images.karlovy],
    ["دريسدن", "نقل خاص أو رحلة يومية للفن والتسوق والمدينة القديمة.", images.dresden],
    ["شبيندلروف ملين", "برنامج جبلي للثلج والطبيعة والأنشطة الموسمية.", images.spindl],
    ["دولني مورافا", "Sky Bridge وإطلالات جبلية وأنشطة خارجية.", images.dolni],
    ["مغامرات براغ", "برنامج أنشطة خاص للمجموعات والفعاليات.", images.action]
  ]
};

function esc(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function asset(lang, p) {
  const prefix = lang === "root" ? "" : "../";
  return prefix + p.replaceAll(" ", "%20");
}

function cssAsset(p) {
  return `/${p.replaceAll(" ", "%20")}`;
}

function pageHref(lang, file) {
  if (lang === "root") return file;
  return file;
}

function langHref(currentLang, targetLang, file) {
  if (currentLang === "root") return `${targetLang}/${file}`;
  return `../${targetLang}/${file}`;
}

function canonical(lang, file) {
  const folder = lang === "root" ? "en" : lang;
  return `${SITE}/${folder}/${file}`;
}

function rootAsset(file) {
  return file === "index.html" ? file : file;
}

function metaAlternates(file) {
  return Object.keys(languages)
    .map((lang) => `<link rel="alternate" hreflang="${languages[lang].html}" href="${SITE}/${lang}/${file}">`)
    .join("\n  ") + `\n  <link rel="alternate" hreflang="x-default" href="${SITE}/en/${file}">`;
}

function seoJson(lang, type = "TaxiService", pageTitle = COMPANY, description = "") {
  const data = {
    "@context": "https://schema.org",
    "@type": type,
    name: COMPANY,
    url: `${SITE}/${lang === "root" ? "en" : lang}/`,
    telephone: PHONE,
    email: EMAIL,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Moulikova 2240/5",
      postalCode: "150 00",
      addressLocality: "Praha",
      addressCountry: "CZ"
    },
    areaServed: ["Prague", "Czechia", "Central Europe"],
    openingHours: "Mo-Su 00:00-23:59",
    description: description || pageTitle
  };
  return JSON.stringify(data);
}

function serviceJson(lang, title, description, file) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description,
    provider: {
      "@type": "LocalBusiness",
      name: COMPANY,
      telephone: PHONE,
      url: SITE
    },
    areaServed: ["Prague", "Czechia", "Central Europe"],
    url: canonical(lang, file)
  });
}

function faqJson(lang) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faq[lang === "root" ? "en" : lang].map(([q, a]) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a }
    }))
  });
}

function head({ lang, file, title, description, image = images.hero, noindex = false, schema = "" }) {
  const htmlLang = lang === "root" ? "en" : languages[lang].html;
  const can = canonical(lang, file);
  return `<!doctype html>
<html lang="${htmlLang}" dir="${lang === "ar" ? "rtl" : "ltr"}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  ${noindex ? '<meta name="robots" content="noindex,follow">' : ""}
  <title>${esc(title)}</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${can}">
  ${metaAlternates(file)}
  <meta property="og:type" content="website">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:url" content="${can}">
  <meta property="og:image" content="${SITE}/${image}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(title)}">
  <meta name="twitter:description" content="${esc(description)}">
  <meta name="twitter:image" content="${SITE}/${image}">
  <link rel="stylesheet" href="${asset(lang, "assets/style.css")}">
  <script type="application/ld+json">${schema || seoJson(lang, "TaxiService", title, description)}</script>
</head>`;
}

function header(lang, active, file) {
  const c = copy[lang === "root" ? "en" : lang];
  const prefix = lang === "root" ? "" : "../";
  const links = navPages.map(([key, href], index) => {
    const url = lang === "root" ? href : href;
    return `<a href="${url}" data-nav="${key}">${esc(c.nav[index])}</a>`;
  }).join("");
  const langLinks = Object.keys(languages).map((target) => {
    const cls = (lang === target || (lang === "root" && target === "en")) ? " class=\"active\"" : "";
    return `<a${cls} href="${langHref(lang, target, file)}" hreflang="${languages[target].html}">${languages[target].label}</a>`;
  }).join("");

  return `<body class="${lang === "ar" ? "rtl" : ""}" data-page="${active}">
<a class="skip-link" href="#main">Skip to content</a>
<header class="site-header">
  <div class="container nav">
    <a class="brand" href="${pageHref(lang, "index.html")}" aria-label="${esc(COMPANY)}">
      <span class="brand-mark"><img src="${asset(lang, images.logo)}" width="46" height="46" alt=""></span>
      <span><span class="brand-name">${esc(COMPANY)}</span><span class="brand-meta">${esc(c.brandMeta)}</span></span>
    </a>
    <nav class="nav-links" aria-label="Primary">${links}</nav>
    <nav class="language-links" aria-label="Language">${langLinks}</nav>
  </div>
</header>`;
}

function footer(lang) {
  const c = copy[lang === "root" ? "en" : lang];
  return `<div class="whatsapp-float"><a data-wa href="#">WhatsApp - ${PHONE}</a></div>
<div class="mobile-cta">
  <a class="btn whatsapp" data-wa href="#">WhatsApp</a>
  <a class="btn primary" href="${pageHref(lang, "quote.html")}">${esc(c.ctaQuote)}</a>
</div>
<footer class="footer">
  <div class="container footer-grid">
    <div><strong>${esc(COMPANY)}</strong><p>${esc(c.footerText)}</p></div>
    <div><strong>${esc(ADDRESS)}</strong><p>IČO ${ICO}<br>DIČ ${VAT}</p></div>
    <div><strong>${PHONE}</strong><p><a href="mailto:${EMAIL}">${EMAIL}</a></p></div>
  </div>
</footer>
<script src="${asset(lang, "assets/data.js")}" defer></script>
<script src="${asset(lang, "assets/app.js")}" defer></script>
</body>
</html>`;
}

function trust(lang) {
  const c = copy[lang === "root" ? "en" : lang];
  return `<section class="container trust-strip" aria-label="Trust signals">
    ${c.trust.map(([a, b]) => `<div class="trust-item"><strong>${esc(a)}</strong><span>${esc(b)}</span></div>`).join("")}
  </section>`;
}

function serviceCards(lang) {
  const c = copy[lang === "root" ? "en" : lang];
  return services[lang === "root" ? "en" : lang].map(([title, text, img]) => `
    <article class="card span-4">
      <div class="media"><img src="${asset(lang, img)}" width="800" height="500" loading="lazy" decoding="async" alt="${esc(title)}"></div>
      <div class="card-body"><h3>${esc(title)}</h3><p>${esc(text)}</p><div class="actions"><a class="btn" href="${pageHref(lang, "services.html")}">${esc(c.learnMore)}</a></div></div>
    </article>`).join("");
}

function fleetCards(lang) {
  const c = copy[lang === "root" ? "en" : lang];
  return fleet[lang === "root" ? "en" : lang].map(([name, seats, bags, best, amenity, img]) => `
    <article class="card span-6">
      <div class="media"><img src="${asset(lang, img)}" width="900" height="560" loading="lazy" decoding="async" alt="${esc(name)}"></div>
      <div class="card-body">
        <h3>${esc(name)}</h3>
        <p>${esc(best)}</p>
        <div class="pill-list">
          <span class="pill">${esc(c.capacity)}: ${esc(seats)}</span>
          <span class="pill">${esc(c.luggage)}: ${esc(bags)}</span>
          <span class="pill">${esc(amenity)}</span>
        </div>
      </div>
    </article>`).join("");
}

function routeCards(lang) {
  const c = copy[lang === "root" ? "en" : lang];
  return Object.entries(routeData).map(([file, route]) => {
    const [title, desc, routeLabel, time] = route[lang === "root" ? "en" : lang];
    return `<a class="route-card" href="${pageHref(lang, file)}"><span>${esc(routeLabel)}</span><strong>${esc(title)}</strong><span>${esc(time)}</span></a>`;
  }).join("");
}

function faqBlock(lang) {
  return `<div class="faq">${faq[lang === "root" ? "en" : lang].map(([q, a]) => `<details><summary>${esc(q)}</summary><p>${esc(a)}</p></details>`).join("")}</div>`;
}

function homePage(lang = "en", rootCompat = false) {
  const l = rootCompat ? "root" : lang;
  const c = copy[lang];
  const file = "index.html";
  const title = lang === "en" ? "VIP Coach Transfers Prague | Luxury Airport and Europe Transfers" : lang === "cs" ? "VIP Coach Transfers Praha | Luxusni letistni a evropske transfery" : "VIP Coach Transfers براغ | نقل فاخر من المطار وإلى أوروبا";
  const description = lang === "en" ? "Private airport transfers, chauffeur service, VIP vans, sedans, minibuses and coaches in Prague. 24/7 WhatsApp booking and fixed-price quotes." : lang === "cs" ? "Soukrome letistni transfery, ridic, VIP vany, sedany, minibusy a autobusy v Praze. WhatsApp 24/7 a pevne ceny." : "نقل خاص من مطار براغ، سائق خاص، سيارات وفانات VIP ومجموعات. حجز واتساب 24/7 وأسعار ثابتة.";
  return `${head({ lang: l, file, title, description, schema: `${seoJson(l, "TaxiService", title, description)}\n  </script>\n  <script type="application/ld+json">${faqJson(l)}` })}
${header(l, "home", file)}
<main id="main">
  <section class="hero" style="--hero-image:url('${cssAsset(images.hero)}')">
    <div class="container hero-content">
      <span class="eyebrow">${esc(c.heroEyebrow)}</span>
      <h1>${esc(c.homeTitle)}</h1>
      <p class="lead">${esc(c.homeLead)}</p>
      <div class="actions">
        <a class="btn primary" href="${pageHref(l, "quote.html")}">${esc(c.ctaQuote)}</a>
        <a class="btn whatsapp" data-wa href="#">${esc(c.ctaWhatsApp)}</a>
      </div>
    </div>
  </section>
  ${trust(l)}
  <section class="section">
    <div class="container">
      <div class="section-head"><h2>${esc(c.sections.routesTitle)}</h2><p>${esc(c.sections.routesText)}</p></div>
      <div class="route-grid">${routeCards(l)}</div>
    </div>
  </section>
  <section class="section feature-band">
    <div class="container">
      <div class="section-head"><h2>${esc(c.sections.airportTitle)}</h2><p>${esc(c.sections.airportText)}</p></div>
      <div class="feature-list">
        ${c.trust.slice(2, 6).map(([a, b]) => `<article><h3>${esc(a)}</h3><p>${esc(b)}</p></article>`).join("")}
      </div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-head"><h2>${esc(c.sections.fleetTitle)}</h2><p>${esc(c.sections.fleetText)}</p></div>
      <div class="grid">${fleetCards(l)}</div>
    </div>
  </section>
  <section class="section tight">
    <div class="container">
      <div class="section-head"><h2>${esc(c.sections.servicesTitle)}</h2><p>${esc(c.sections.servicesText)}</p></div>
      <div class="grid">${serviceCards(l)}</div>
    </div>
  </section>
  <section class="section">
    <div class="container">
      <div class="section-head"><h2>${esc(c.sections.faqTitle)}</h2></div>
      ${faqBlock(l)}
    </div>
  </section>
  ${finalCta(l)}
</main>
${footer(l)}`;
}

function finalCta(lang) {
  const c = copy[lang === "root" ? "en" : lang];
  return `<section class="section feature-band"><div class="container"><div class="section-head"><div><h2>${esc(c.sections.finalTitle)}</h2><p>${esc(c.sections.finalText)}</p></div><div class="actions"><a class="btn primary" href="${pageHref(lang, "quote.html")}">${esc(c.ctaQuote)}</a><a class="btn whatsapp" data-wa href="#">${esc(c.ctaWhatsApp)}</a></div></div></div></section>`;
}

function simpleListingPage(lang, kind, rootCompat = false) {
  const l = rootCompat ? "root" : lang;
  const c = copy[lang];
  const isServices = kind === "services";
  const isFleet = kind === "fleet";
  const isPrograms = kind === "programs";
  const file = `${kind}.html`;
  const title = isServices ? `${c.sections.servicesTitle} | ${COMPANY}` : isFleet ? `${c.sections.fleetTitle} | ${COMPANY}` : `${c.sections.programsTitle} | ${COMPANY}`;
  const description = isServices ? c.sections.servicesText : isFleet ? c.sections.fleetText : c.sections.programsText;
  const cards = isServices ? serviceCards(l) : isFleet ? fleetCards(l) : programCards(l);
  const introTitle = isServices ? c.sections.servicesTitle : isFleet ? c.sections.fleetTitle : c.sections.programsTitle;
  const introText = isServices ? c.sections.servicesText : isFleet ? c.sections.fleetText : c.sections.programsText;
  const extra = isFleet ? fleetTable(l) : isServices ? serviceFeatureBand(l) : "";
  return `${head({ lang: l, file, title, description, schema: serviceJson(l, title, description, file) })}
${header(l, kind, file)}
<main id="main">
  ${subHero(l, introTitle, introText, isFleet ? images.vclass : isPrograms ? images.cesky : images.serviceAirport)}
  ${trust(l)}
  <section class="section"><div class="container"><div class="grid">${cards}</div></div></section>
  ${extra}
  ${finalCta(l)}
</main>
${footer(l)}`;
}

function programCards(lang) {
  const c = copy[lang === "root" ? "en" : lang];
  return programs[lang === "root" ? "en" : lang].map(([name, text, img]) => `
    <article class="card span-4">
      <div class="media"><img src="${asset(lang, img)}" width="900" height="600" loading="lazy" decoding="async" alt="${esc(name)}"></div>
      <div class="card-body"><h3>${esc(name)}</h3><p>${esc(text)}</p><div class="actions"><a class="btn" href="${pageHref(lang, "quote.html")}">${esc(c.routeCta)}</a></div></div>
    </article>`).join("");
}

function subHero(lang, title, text, image) {
  const c = copy[lang === "root" ? "en" : lang];
  return `<section class="hero" style="--hero-image:url('${cssAsset(image)}'); min-height:520px"><div class="container hero-content"><span class="eyebrow">${esc(c.heroEyebrow)}</span><h1>${esc(title)}</h1><p class="lead">${esc(text)}</p><div class="actions"><a class="btn primary" href="${pageHref(lang, "quote.html")}">${esc(c.ctaQuote)}</a><a class="btn whatsapp" data-wa href="#">${esc(c.ctaWhatsApp)}</a></div></div></section>`;
}

function fleetTable(lang) {
  const c = copy[lang === "root" ? "en" : lang];
  return `<section class="section"><div class="container"><table class="comparison"><thead><tr><th>${esc(c.fleetBest)}</th><th>${esc(c.capacity)}</th><th>${esc(c.luggage)}</th><th>${esc(c.amenities)}</th></tr></thead><tbody>${fleet[lang === "root" ? "en" : lang].map(([name, seats, bags, best, amenity]) => `<tr><th>${esc(name)}</th><td>${esc(seats)}</td><td>${esc(bags)}</td><td>${esc(amenity)}<br>${esc(best)}</td></tr>`).join("")}</tbody></table></div></section>`;
}

function serviceFeatureBand(lang) {
  const c = copy[lang === "root" ? "en" : lang];
  return `<section class="section feature-band"><div class="container"><div class="feature-list">${c.trust.slice(1, 5).map(([a, b]) => `<article><h3>${esc(a)}</h3><p>${esc(b)}</p></article>`).join("")}</div></div></section>`;
}

function routePage(lang, file, rootCompat = false) {
  const l = rootCompat ? "root" : lang;
  const c = copy[lang];
  const route = routeData[file];
  const [title, desc, routeLabel, time] = route[lang];
  const schema = `${serviceJson(l, title, desc, file)}\n  </script>\n  <script type="application/ld+json">${seoJson(l, "TaxiService", title, desc)}`;
  return `${head({ lang: l, file, title: `${title} | ${COMPANY}`, description: desc, image: route.image, schema })}
${header(l, "services", file)}
<main id="main">
  ${subHero(l, title, desc, route.image)}
  ${trust(l)}
  <section class="section">
    <div class="container">
      <div class="grid">
        <article class="card span-7"><div class="card-body"><h2>${esc(routeLabel)}</h2><p>${esc(desc)}</p><div class="pill-list"><span class="pill">${esc(time)}</span><span class="pill">${esc(c.sections.fleetText)}</span><span class="pill">${esc(c.trust[4][0])}</span></div></div></article>
        <article class="card span-5"><div class="card-body"><h2>${esc(c.sections.finalTitle)}</h2><p>${esc(c.sections.finalText)}</p><div class="actions"><a class="btn primary" href="${pageHref(l, "quote.html")}">${esc(c.routeCta)}</a><a class="btn whatsapp" data-wa href="#">${esc(c.ctaWhatsApp)}</a></div></div></article>
      </div>
    </div>
  </section>
  <section class="section"><div class="container"><div class="section-head"><h2>${esc(c.sections.fleetTitle)}</h2><p>${esc(c.sections.fleetText)}</p></div><div class="grid">${fleetCards(l)}</div></div></section>
  ${finalCta(l)}
</main>
${footer(l)}`;
}

function quotePage(lang, rootCompat = false) {
  const l = rootCompat ? "root" : lang;
  const c = copy[lang];
  const q = c.quote;
  const file = "quote.html";
  const description = q.lead;
  const thankyou = "thankyou.html";
  return `${head({ lang: l, file, title: `${q.title} | ${COMPANY}`, description, schema: seoJson(l, "TaxiService", q.title, description) })}
${header(l, "quote", file)}
<main id="main">
  ${subHero(l, q.title, q.lead, images.hero)}
  <section class="section">
    <div class="container form-shell">
      <form class="form" method="POST" action="https://formsubmit.co/${EMAIL}" data-quote-form data-thankyou="${thankyou}">
        <input type="hidden" name="_subject" value="VIPCT Quote Request">
        <input type="hidden" name="_captcha" value="true">
        <section class="form-section">
          <h2>${esc(q.trip)}</h2>
          <div class="field-grid">
            ${selectField("trip_type", q.type, [[q.oneWay, "oneway"], [q.roundTrip, "roundtrip"]])}
            ${dateField("pickup_date", q.pickupDate, true)}
            ${timeField("pickup_time", q.pickupTime)}
            ${textField("pickup", q.pickup, "Airport / hotel / address", true)}
            ${textField("dropoff", q.dropoff, "City / address", true)}
            <div id="returnFields" class="field full">
              <div class="field-grid">${dateField("return_date", q.returnDate, false)}${timeField("return_time", q.returnTime, false)}</div>
            </div>
          </div>
        </section>
        <section class="form-section">
          <h2>${esc(c.sections.fleetTitle)}</h2>
          <div class="field-grid">
            ${numberField("passengers", q.passengers, true)}
            ${textField("luggage", q.luggage, "4 suitcases + 2 backpacks", false)}
            ${selectField("vehicle", q.vehicle, [["Sedan", "Sedan"], ["Mercedes V-Class", "Mercedes V-Class"], ["Luxury Minibus", "Luxury Minibus"], ["Executive Coach", "Executive Coach"]], true, "full")}
          </div>
        </section>
        <section class="form-section">
          <h2>${esc(q.contact)}</h2>
          <div class="field-grid">
            ${textField("name", q.name, "Full name", true)}
            ${telField("phone", q.phone, PHONE)}
            ${emailField("email", q.email, EMAIL)}
          </div>
        </section>
        <section class="form-section">
          <h2>${esc(q.notes)}</h2>
          ${textareaField("notes", q.notesLabel, "Flight number, child seats, stops, waiting time...")}
          <div class="actions" style="margin-top:16px"><button class="btn primary" type="submit">${esc(q.send)}</button><button class="btn whatsapp" type="button" id="whatsappBtn" disabled>${esc(q.whatsapp)}</button></div>
        </section>
      </form>
      <aside class="quote-aside">
        <h2>${esc(c.sections.finalTitle)}</h2>
        <p>${esc(q.response)}</p>
        <div class="summary-list">${c.trust.slice(0, 5).map(([a, b]) => `<div class="summary-row"><span>${esc(a)}</span><span>${esc(b)}</span></div>`).join("")}</div>
      </aside>
    </div>
  </section>
</main>
<div class="modal-overlay" id="waModalOverlay" role="dialog" aria-modal="true" aria-labelledby="waTitle">
  <div class="modal">
    <div class="modal-head"><div><h2 id="waTitle">${esc(q.modalTitle)}</h2><p class="help">${esc(q.modalLead)}</p></div><button class="icon-btn" type="button" data-wa-close aria-label="Close">x</button></div>
    <div class="modal-body"><pre class="preview" id="waPreview"></pre><div class="actions" style="margin-top:16px"><button class="btn" type="button" data-wa-close>${esc(q.cancel)}</button><button class="btn whatsapp" type="button" id="waSend">${esc(q.sendWa)}</button></div></div>
  </div>
</div>
${footer(l).replace("</body>", `<script>window.VIPCT_TEXT=${JSON.stringify({ ready: q.title })}</script>\n<script src="${asset(l, "assets/quote.js")}" defer></script>\n</body>`)}`;
}

function selectField(id, label, options, required = true, cls = "") {
  return `<div class="field ${cls}"><label for="${id}">${esc(label)}</label><select id="${id}" name="${id}" ${required ? "required" : ""}>${options.map(([text, value]) => `<option value="${esc(value)}">${esc(text)}</option>`).join("")}</select></div>`;
}
function textField(id, label, placeholder, required) {
  return `<div class="field"><label for="${id}">${esc(label)}</label><input id="${id}" name="${id}" type="text" placeholder="${esc(placeholder)}" ${required ? "required" : ""}></div>`;
}
function telField(id, label, placeholder) {
  return `<div class="field"><label for="${id}">${esc(label)}</label><input id="${id}" name="${id}" type="tel" placeholder="${esc(placeholder)}" required></div>`;
}
function emailField(id, label, placeholder) {
  return `<div class="field"><label for="${id}">${esc(label)}</label><input id="${id}" name="${id}" type="email" placeholder="${esc(placeholder)}" required></div>`;
}
function numberField(id, label, required) {
  return `<div class="field"><label for="${id}">${esc(label)}</label><input id="${id}" name="${id}" type="number" min="1" max="60" ${required ? "required" : ""}></div>`;
}
function dateField(id, label, required) {
  return `<div class="field"><label for="${id}">${esc(label)}</label><input id="${id}" name="${id}" type="date" ${required ? "required" : ""}></div>`;
}
function timeField(id, label, required = true) {
  return `<div class="field"><label for="${id}">${esc(label)}</label><input id="${id}" name="${id}" type="time" step="300" ${required ? "required" : ""}></div>`;
}
function textareaField(id, label, placeholder) {
  return `<div class="field"><label for="${id}">${esc(label)}</label><textarea id="${id}" name="${id}" placeholder="${esc(placeholder)}"></textarea></div>`;
}

function contactPage(lang, rootCompat = false) {
  const l = rootCompat ? "root" : lang;
  const c = copy[lang];
  const file = "contact.html";
  const description = c.contactLead;
  return `${head({ lang: l, file, title: `${c.contactTitle} | ${COMPANY}`, description, schema: seoJson(l, "LocalBusiness", c.contactTitle, description) })}
${header(l, "contact", file)}
<main id="main">
  ${subHero(l, c.contactTitle, c.contactLead, images.hero)}
  <section class="section">
    <div class="container contact-grid">
      <article class="contact-panel"><h2>${esc(c.ctaWhatsApp)}</h2><p>${esc(c.contactLead)}</p><div class="actions"><a class="btn whatsapp" data-wa href="#">WhatsApp</a><a class="btn primary" href="${pageHref(l, "quote.html")}">${esc(c.ctaQuote)}</a></div></article>
      <article class="contact-panel"><dl><div><dt>${esc(COMPANY)}</dt><dd>${esc(ADDRESS)}</dd></div><div><dt>IČO / DIČ</dt><dd>${ICO} / ${VAT}</dd></div><div><dt>Phone / WhatsApp</dt><dd><a href="tel:+420775091730">${PHONE}</a></dd></div><div><dt>Email</dt><dd><a href="mailto:${EMAIL}">${EMAIL}</a></dd></div></dl></article>
    </div>
  </section>
  <section class="section tight"><div class="container map-wrap"><iframe src="https://www.google.com/maps?q=Moulikova%202240/5,%20150%2000%20Praha&output=embed" loading="lazy" referrerpolicy="no-referrer-when-downgrade" title="VIP Coach Transfers Prague map"></iframe></div></section>
</main>
${footer(l)}`;
}

function thankyouPage(lang, rootCompat = false) {
  const l = rootCompat ? "root" : lang;
  const c = copy[lang];
  const file = "thankyou.html";
  return `${head({ lang: l, file, title: `${c.thankTitle} | ${COMPANY}`, description: c.thankLead, noindex: true, schema: seoJson(l, "TaxiService", c.thankTitle, c.thankLead) })}
${header(l, "quote", file)}
<main id="main">
  <section class="section">
    <div class="container">
      <article class="card"><div class="card-body" style="text-align:center; max-width:860px; margin:auto">
        <img src="${asset(l, images.logo)}" width="72" height="72" alt="" style="margin:0 auto 18px">
        <h1>${esc(c.thankTitle)}</h1><p class="lead" style="margin-inline:auto">${esc(c.thankLead)}</p>
        <div class="summary-list" id="summaryBox" hidden style="text-align:initial; margin:22px auto; max-width:760px">
          ${["trip_label", "pickup_date", "pickup_time", "pickup", "dropoff", "passengers", "luggage", "vehicle", "name", "phone", "email", "notes"].map((key) => `<div class="summary-row"><span>${esc(key.replaceAll("_", " "))}</span><span data-summary="${key}">-</span></div>`).join("")}
        </div>
        <div class="actions" style="justify-content:center"><a class="btn primary" href="${pageHref(l, "index.html")}">${esc(c.backHome)}</a><a class="btn" href="${pageHref(l, "quote.html")}">${esc(c.newQuote)}</a><button class="btn whatsapp" type="button" id="waFallback">${esc(c.openWhatsApp)}</button></div>
      </div></article>
    </div>
  </section>
</main>
${footer(l).replace("</body>", `<script src="${asset(l, "assets/thankyou.js")}" defer></script>\n</body>`)}`;
}

async function write(file, html) {
  await fs.mkdir(path.dirname(path.join(root, file)), { recursive: true });
  await fs.writeFile(path.join(root, file), html, "utf8");
  console.log(file);
}

function sitemapEntries() {
  const files = ["index.html", "services.html", "fleet.html", "programs.html", "quote.html", "contact.html", ...Object.keys(routeData)];
  const urls = [];
  for (const lang of Object.keys(languages)) {
    for (const file of files) urls.push(`${SITE}/${lang}/${file}`);
  }
  for (const file of ["index.html", "services.html", "fleet.html", "programs.html", "quote.html", "contact.html"]) {
    urls.push(`${SITE}/${file}`);
  }
  return urls;
}

for (const lang of Object.keys(languages)) {
  await write(`${lang}/index.html`, homePage(lang));
  await write(`${lang}/services.html`, simpleListingPage(lang, "services"));
  await write(`${lang}/fleet.html`, simpleListingPage(lang, "fleet"));
  await write(`${lang}/programs.html`, simpleListingPage(lang, "programs"));
  await write(`${lang}/quote.html`, quotePage(lang));
  await write(`${lang}/contact.html`, contactPage(lang));
  await write(`${lang}/thankyou.html`, thankyouPage(lang));
  for (const file of Object.keys(routeData)) await write(`${lang}/${file}`, routePage(lang, file));
}

await write("index.html", homePage("en", true));
await write("services.html", simpleListingPage("en", "services", true));
await write("fleet.html", simpleListingPage("en", "fleet", true));
await write("programs.html", simpleListingPage("en", "programs", true));
await write("quote.html", quotePage("en", true));
await write("contact.html", contactPage("en", true));
await write("thankyou.html", thankyouPage("en", true));
for (const file of Object.keys(routeData)) await write(file, routePage("en", file, true));

await write("sitemap.xml", `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries().map((url) => `  <url><loc>${url}</loc></url>`).join("\n")}
</urlset>
`);

await write("robots.txt", `User-agent: *
Allow: /
Sitemap: ${SITE}/sitemap.xml
`);
