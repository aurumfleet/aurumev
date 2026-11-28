import type { FaqItem } from "@/components/FaqAccordion";

export interface RiderFaqSeedItem extends FaqItem {
  sortOrder: number;
}

export const RIDER_HELP_CENTRE_FAQS: RiderFaqSeedItem[] = [
  {
    id: "rider-faq-01",
    sortOrder: 1,
    category: "Rentals",
    question: "01. Kya mujhe EV kharidni padegi ya rent par mil jayegi?",
    answer:
      "Nahi, Aurum Fleet ke through aap electric scooter rental par le sakte hain. Vehicle purchase karna zaroori nahi hai.",
  },
  {
    id: "rider-faq-02",
    sortOrder: 2,
    category: "Delivery Partners",
    question: "02. Kya main bina apni scooter ke delivery work start kar sakta hoon?",
    answer:
      "Haan, aap available rental options explore kar sakte hain. Vehicle availability aur applicable rental terms confirm karne ke liye humse contact karein.",
  },
  {
    id: "rider-faq-03",
    sortOrder: 3,
    category: "General",
    question: "03. Aurum Fleet kin cities mein available hai?",
    answer:
      "Currently, Aurum Fleet ki rental services Delhi aur Noida mein available hain.",
  },
  {
    id: "rider-faq-04",
    sortOrder: 4,
    category: "KYC & Payments",
    question: "04. Kya mujhe daily rental dena hoga ya monthly?",
    answer:
      "Rental payment frequency aur payment terms selected rental plan aur agreement ke according honge. Details booking se pehle confirm karein.",
  },
  {
    id: "rider-faq-05",
    sortOrder: 5,
    category: "KYC & Payments",
    question: "05. EV lene ke liye mujhe kitna advance payment karna padega?",
    answer:
      "Applicable rental charges, security deposit (if any) aur initial payment vehicle selection aur rental agreement ke according confirm kiye jayenge.",
  },
  {
    id: "rider-faq-06",
    sortOrder: 6,
    category: "Delivery Partners",
    question: "06. Kya delivery partners ke liye special rental plans hain?",
    answer:
      "Aurum Fleet delivery partners aur individual riders ki mobility requirements ko dhyan mein rakhkar EV rental options provide karta hai. Available plans ke liye enquiry karein.",
  },
  {
    id: "rider-faq-07",
    sortOrder: 7,
    category: "General",
    question: "07. Agar scooter mein beech raste problem aa jaye toh?",
    answer:
      "Aap Aurum Fleet support team se contact kar sakte hain. Assistance aur vehicle-related resolution applicable service arrangements ke according provide ki jayegi.",
  },
  {
    id: "rider-faq-08",
    sortOrder: 8,
    category: "General",
    question: "08. Kya electric scooter ko charge karna easy hai?",
    answer:
      "Haan, EV ko compatible charging setup ke through charge kiya ja sakta hai. Vehicle ke charger aur charging instructions handover ke samay samjhe ja sakte hain.",
  },
  {
    id: "rider-faq-09",
    sortOrder: 9,
    category: "Rentals",
    question: "09. Ek baar rental lene ke baad kya main vehicle change kar sakta hoon?",
    answer:
      "Vehicle change availability, rental plan aur applicable agreement conditions par depend karega. Iske liye support team se baat karein.",
  },
  {
    id: "rider-faq-10",
    sortOrder: 10,
    category: "KYC & Payments",
    question: "10. Kya mujhe electric scooter chalane ke liye driving licence chahiye?",
    answer:
      "Vehicle category aur applicable Indian motor vehicle rules ke according licence requirements depend karti hain. Booking se pehle vehicle ki legal classification confirm karein.",
  },
  {
    id: "rider-faq-11",
    sortOrder: 11,
    category: "Rentals",
    question: "11. Kya main personal use ke liye bhi EV rent kar sakta hoon?",
    answer:
      "Aurum Fleet ke rental options individual riders aur business mobility requirements ke liye hain. Personal-use availability confirm karne ke liye contact karein.",
  },
  {
    id: "rider-faq-12",
    sortOrder: 12,
    category: "Rentals",
    question: "12. Rental period complete hone ke baad kya karna hoga?",
    answer:
      "Aapko applicable agreement ke according vehicle return karna hoga ya renewal/extension options ke baare mein team se discuss karna hoga.",
  },
  {
    id: "rider-faq-13",
    sortOrder: 13,
    category: "General",
    question: "13. Kya EV ke saath maintenance support bhi milta hai?",
    answer:
      "Maintenance support aur coverage selected rental agreement mein defined terms ke according honge. Booking se pehle inclusions confirm karein.",
  },
  {
    id: "rider-faq-14",
    sortOrder: 14,
    category: "Rentals",
    question: "14. Main EV book kaise kar sakta hoon?",
    answer:
      "Aap website enquiry form, phone ya WhatsApp ke through Aurum Fleet team se contact kar sakte hain.",
  },
  {
    id: "rider-faq-15",
    sortOrder: 15,
    category: "Rentals",
    question: "15. Kya main pehle EV ki details dekh sakta hoon?",
    answer:
      "Bilkul! Aap available EV models, specifications aur rental details ke baare mein team se information le sakte hain.",
  },
];
