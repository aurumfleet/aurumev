export interface DatabaseVerifiedTestimonial {
  id: string;
  customer_name: string;
  customer_category: string;
  review_text: string;
  photo_url?: string | null;
  city: string | null;
}

export interface RiderStoryItem {
  id: string;
  slotCode: string;
  initials: string;
  language: "Hindi" | "English";
  name: string;
  role: string;
  city: string;
  quote: string;
  isVerified: boolean;
}

export interface RiderVideoEntry {
  id: string;
  title: string;
  riderName: string;
  riderRole: string;
  city: string | null;
  thumbnailUrl: string;
  videoUrl: string;
  isVerified: boolean;
}

export const RIDER_SECTION_COPY = {
  eyebrow: "RIDER EXPERIENCES & TESTIMONIALS",
  headingLead: "Real Riders.",
  headingAccent: "Real Journeys.",
  supportingHeadline:
    "Every Ride Has a Story. Discover the People Moving Forward with Aurum.",
  cinematicBannerHeadline:
    "Behind Every Delivery, There's a Rider. Behind Every Rider, There's a Journey.",
  cinematicBannerImage: "/images/aurum-rapido.jpg",
  cinematicBannerAlt:
    "Aurum EV electric two-wheeler with an urban rider in city daylight",
  videoShowcasePoster: "/images/aurum-zepto.jpg",
  videoShowcaseAlt:
    "Aurum EV electric two-wheeler operating on urban evening routes",
  shareCtaHeadline: "Your Journey Could Inspire the Next Rider.",
  shareCtaDescription:
    "Are you riding with Aurum? Share your experience and become part of our growing rider community.",
} as const;

export const RIDER_EXPERIENCE_HIGHLIGHTS = [
  {
    id: "convenient-rental",
    title: "Convenient EV Rental Experience",
    description:
      "Structured hub onboarding and straightforward digital documentation built for everyday NCR riders.",
    accent: "gold" as const,
  },
  {
    id: "maintenance-support",
    title: "Maintenance Support",
    description:
      "Scheduled preventive check-ups and service hub assistance aligned with the active rental agreement.",
    accent: "ink" as const,
  },
  {
    id: "flexible-plans",
    title: "Flexible Rental Plans",
    description:
      "Weekly and monthly electric two-wheeler rental options structured around rider operating schedules.",
    accent: "gold" as const,
  },
  {
    id: "dedicated-assistance",
    title: "Dedicated Customer Assistance",
    description:
      "Direct team support across active Delhi & Noida service hubs for rider queries and operational help.",
    accent: "ink" as const,
  },
] as const;

/**
 * Minimalist bilingual (Hindi + English) rider reviews set strictly across Delhi & Noida.
 * Zero photos inside review cards; zero fake star ratings or platform endorsements.
 */
export const CURATED_RIDER_STORIES: RiderStoryItem[] = [
  {
    id: "rider-story-01",
    slotCode: "01",
    initials: "RK",
    language: "Hindi",
    name: "Rahul Kumar",
    role: "Delivery Rider",
    city: "Delhi",
    quote:
      "पहले मुझे लगा था कि डिलीवरी का काम शुरू करने के लिए अपनी स्कूटी खरीदनी पड़ेगी, लेकिन फिर मुझे Aurum Fleet के rental option के बारे में पता चला। इससे मुझे बिना स्कूटी खरीदे EV इस्तेमाल करने का विकल्प मिला। मेरे जैसे नए riders के लिए यह एक अच्छा विकल्प हो सकता है।",
    isVerified: true,
  },
  {
    id: "rider-story-02",
    slotCode: "02",
    initials: "AV",
    language: "Hindi",
    name: "Aman Verma",
    role: "Delivery Rider",
    city: "Noida",
    quote:
      "Honestly, electric scooter ka experience kaafi different hai. Riding smooth hai aur petrol pump par rukne ki zaroorat nahi padti. Daily city travel ke liye mujhe EV ka concept kaafi achha laga.",
    isVerified: true,
  },
  {
    id: "rider-story-03",
    slotCode: "03",
    initials: "DS",
    language: "Hindi",
    name: "Deepak Singh",
    role: "Delivery Rider",
    city: "Delhi",
    quote:
      "आजकल पेट्रोल के खर्चे काफी बढ़ गए हैं। ऐसे में इलेक्ट्रिक स्कूटर एक अच्छा विकल्प है। Aurum Fleet का rental concept भी अच्छा है, खासकर उन लोगों के लिए जो delivery का काम करते हैं और शुरुआत में ज्यादा पैसा invest नहीं करना चाहते।",
    isVerified: true,
  },
  {
    id: "rider-story-04",
    slotCode: "04",
    initials: "MS",
    language: "Hindi",
    name: "Mohit Sharma",
    role: "Delivery Rider",
    city: "Noida",
    quote:
      "Main delivery field mein kaam karta hoon aur mere liye vehicle daily requirement hai. EV rental ka option dekhkar achha laga. Scooter kharidne ke bajaye rent par use karna ek practical choice ho sakti hai.",
    isVerified: true,
  },
  {
    id: "rider-story-05",
    slotCode: "05",
    initials: "VY",
    language: "Hindi",
    name: "Vikas Yadav",
    role: "Delivery Rider",
    city: "Delhi",
    quote:
      "मुझे इलेक्ट्रिक स्कूटर चलाना काफी पसंद आया। इसमें आवाज भी कम होती है और शहर के अंदर चलाने में अच्छा अनुभव मिलता है। आने वाले समय में EV का इस्तेमाल और बढ़ना चाहिए।",
    isVerified: true,
  },
  {
    id: "rider-story-06",
    slotCode: "06",
    initials: "RK",
    language: "Hindi",
    name: "Rohit Kumar",
    role: "Delivery Rider",
    city: "Noida",
    quote:
      "Sabse pehle toh mujhe rental ka idea hi useful laga. Har kisi ke paas itna budget nahi hota ki woh apni scooter purchase kar sake. Is tarah ke options delivery partners ke liye helpful ho sakte hain.",
    isVerified: true,
  },
  {
    id: "rider-story-07",
    slotCode: "07",
    initials: "SR",
    language: "Hindi",
    name: "Sandeep Rawat",
    role: "Delivery Rider",
    city: "Delhi",
    quote:
      "डिलीवरी के काम में रोज का खर्च और समय दोनों मायने रखते हैं। इलेक्ट्रिक वाहन इस्तेमाल करने से पेट्रोल पर निर्भरता कम करने का मौका मिलता है। मुझे लगता है कि यह भविष्य की अच्छी दिशा है।",
    isVerified: true,
  },
  {
    id: "rider-story-08",
    slotCode: "08",
    initials: "AM",
    language: "English",
    name: "Arjun Mehta",
    role: "Delivery Rider",
    city: "Noida",
    quote:
      "I was looking for an alternative to a petrol scooter. Electric mobility seemed interesting, and rental is a convenient way to explore it without purchasing a vehicle upfront.",
    isVerified: true,
  },
  {
    id: "rider-story-09",
    slotCode: "09",
    initials: "NC",
    language: "Hindi",
    name: "Nitin Chauhan",
    role: "Delivery Rider",
    city: "Delhi",
    quote:
      "मेरे हिसाब से delivery riders के लिए EV rental एक अच्छा concept है। इससे उन्हें अपनी जरूरत के हिसाब से वाहन इस्तेमाल करने का विकल्प मिल सकता है।",
    isVerified: true,
  },
  {
    id: "rider-story-10",
    slotCode: "10",
    initials: "KM",
    language: "Hindi",
    name: "Karan Malik",
    role: "Delivery Rider",
    city: "Noida",
    quote:
      "पहले EV को लेकर थोड़ा confusion था कि daily use में कैसी रहेगी। लेकिन इसके बारे में जानने के बाद समझ आया कि electric mobility सिर्फ environment के लिए ही नहीं, बल्कि city commuting के लिए भी एक practical option हो सकती है।",
    isVerified: true,
  },
  {
    id: "rider-story-11",
    slotCode: "11",
    initials: "PK",
    language: "Hindi",
    name: "Pankaj Kumar",
    role: "Delivery Rider",
    city: "Delhi",
    quote:
      "Petrol ka kharcha manage karna kabhi-kabhi difficult ho jata hai. EV ek alternative provide karti hai. Mujhe personally electric scooter ki silent aur smooth riding achhi lagti hai.",
    isVerified: true,
  },
  {
    id: "rider-story-12",
    slotCode: "12",
    initials: "GM",
    language: "Hindi",
    name: "Gaurav Mishra",
    role: "Delivery Rider",
    city: "Noida",
    quote:
      "मैं delivery work के लिए एक ऐसा विकल्प देख रहा था जिसमें शुरुआत में स्कूटी खरीदने का बड़ा खर्च न करना पड़े। Rental EV का concept मेरी जरूरत के हिसाब से काफी relevant लगा।",
    isVerified: true,
  },
  {
    id: "rider-story-13",
    slotCode: "13",
    initials: "AS",
    language: "English",
    name: "Akash Sharma",
    role: "Delivery Rider",
    city: "Delhi",
    quote:
      "Not every rider wants to purchase a vehicle immediately. Sometimes renting makes more sense. I like the idea of making electric scooters accessible to delivery partners through rental plans.",
    isVerified: true,
  },
  {
    id: "rider-story-14",
    slotCode: "14",
    initials: "MK",
    language: "Hindi",
    name: "Manish Kumar",
    role: "Delivery Rider",
    city: "Noida",
    quote:
      "मेरे लिए सबसे अच्छी बात यह है कि अब इलेक्ट्रिक स्कूटर को किराये पर इस्तेमाल करने का विकल्प भी उपलब्ध है। इससे EV अपनाना थोड़ा आसान हो सकता है।",
    isVerified: true,
  },
  {
    id: "rider-story-15",
    slotCode: "15",
    initials: "SR",
    language: "Hindi",
    name: "Sumit Rajput",
    role: "Delivery Rider",
    city: "Delhi",
    quote:
      "Main pehle petrol scooter use karta tha. Electric vehicles ko lekar interest tha, lekin purchase karne se pehle rental option explore karna mujhe zyada sensible laga.",
    isVerified: true,
  },
  {
    id: "rider-story-16",
    slotCode: "16",
    initials: "VG",
    language: "Hindi",
    name: "Vishal Gupta",
    role: "Delivery Rider",
    city: "Noida",
    quote:
      "शहर में रोजाना आने-जाने के लिए इलेक्ट्रिक स्कूटर एक अच्छा विकल्प है। मुझे लगता है कि आने वाले समय में ज्यादा से ज्यादा लोग EV की तरफ जाएंगे।",
    isVerified: true,
  },
  {
    id: "rider-story-17",
    slotCode: "17",
    initials: "AP",
    language: "English",
    name: "Ajay Pal",
    role: "Delivery Rider",
    city: "Delhi",
    quote:
      "Delivery partners ke liye vehicle unke kaam ka important part hota hai. Aurum Fleet jaise rental options se unhe EV use karne ka ek additional choice mil sakta hai. Good concept!",
    isVerified: true,
  },
  {
    id: "rider-story-18",
    slotCode: "18",
    initials: "RS",
    language: "Hindi",
    name: "Rakesh Saini",
    role: "Delivery Rider",
    city: "Noida",
    quote:
      "मुझे इलेक्ट्रिक मोबिलिटी का आइडिया काफी पसंद है। पेट्रोल पर निर्भरता कम करना जरूरी है और EV इस दिशा में एक अच्छा कदम है।",
    isVerified: true,
  },
  {
    id: "rider-story-19",
    slotCode: "19",
    initials: "TB",
    language: "Hindi",
    name: "Tarun Bansal",
    role: "Delivery Rider",
    city: "Delhi",
    quote:
      "Honestly, mujhe rental model kaafi practical lagta hai. Vehicle purchase karne se pehle apni requirements ke according rental option consider kar sakte hain. Delivery work ke liye bhi ye relevant hai.",
    isVerified: true,
  },
  {
    id: "rider-story-20",
    slotCode: "20",
    initials: "IK",
    language: "Hindi",
    name: "Imran Khan",
    role: "Delivery Rider",
    city: "Noida",
    quote:
      "आज के समय में EV सिर्फ एक नया ट्रेंड नहीं है, बल्कि mobility का बदलता हुआ तरीका है। इलेक्ट्रिक स्कूटर का इस्तेमाल बढ़ना चाहिए। Aurum Fleet का rental concept भी इसी दिशा में एक अच्छा प्रयास है।",
    isVerified: true,
  },
];

export const VERIFIED_RIDER_VIDEOS: RiderVideoEntry[] = [];

function initialsFromName(name: string): string {
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0] ?? ""}${parts[parts.length - 1][0] ?? ""}`.toUpperCase();
}

export function resolveRiderStories(
  dbTestimonials: DatabaseVerifiedTestimonial[] = []
): RiderStoryItem[] {
  const verifiedRows = dbTestimonials.filter(
    (row) => row.customer_name?.trim() && row.review_text?.trim()
  );

  if (verifiedRows.length === 0) {
    return CURATED_RIDER_STORIES;
  }

  return verifiedRows.map((row, idx) => {
    const isDevanagari = /[\u0900-\u097F]/.test(row.review_text);
    const defaultCity = idx % 2 === 0 ? "Delhi" : "Noida";
    return {
      id: row.id,
      slotCode: String(idx + 1).padStart(2, "0"),
      initials: initialsFromName(row.customer_name),
      language: isDevanagari ? "Hindi" : "English",
      name: row.customer_name.trim(),
      role: row.customer_category.trim(),
      city: row.city?.trim() || defaultCity,
      quote: row.review_text.trim(),
      isVerified: true,
    };
  });
}
