import { images } from "./images";

export const categories = [
  {
    id: 1,
    name: "cardiology",
    image: images.cardiology,
  },
  {
    id: 2,
    name: "dentistry",
    image: images.dentistry,
  },
  {
    id: 3,
    name: "gastroenterology",
    image: images.gastroenterology,
  },
  {
    id: 8,
    name: "general",
    image: images.general,
  },
  {
    id: 4,
    name: "laboratory",
    image: images.laboratory,
  },
  {
    id: 5,
    name: "neurology",
    image: images.neurology,
  },
  {
    id: 6,
    name: "pulmono",
    image: images.pulmono,
  },
  {
    id: 7,
    name: "vaccine",
    image: images.vaccine,
  },
];

export interface CarouselIDate {
  id: number;
  image: any;
  title: string;
  subtitle: string;
}

export const carouselData: CarouselIDate[] = [
  {
    id: 1,
    image: images.carousel_1,
    title: "Looking for Specialist Doctors?",
    subtitle: "Schedule an appointment with our top doctors.",
  },
  {
    id: 2,
    image: images.carousel_1,
    title: "Need Emergency Care?",
    subtitle: "Our emergency department is open 24/7.",
  },
  {
    id: 3,
    image: images.carousel_1,
    title: "Quality Healthcare",
    subtitle: "Experience world-class medical services.",
  },
];

export const DemoDoctors: IDoctors[] = [
  {
    id: 1,
    name: "Dr. David Patel",
    specialization: "Cardiologist",
    location: "Cardiology Center, USA",
    rating: 5,
    reviews: 1872,
    image: images.miniimage1,
  },
  {
    id: 2,
    name: "Dr. Jessica Turner",
    specialization: "Gynecologist",
    location: "Women's Clinic, Seattle, USA",
    rating: 4.9,
    reviews: 127,
    image: images.miniimage2,
  },
  {
    id: 3,
    name: "Dr. Michael Johnson",
    specialization: "Orthopedic Surgery",
    location: "Maple Associates, NY, USA",
    rating: 4.7,
    reviews: 5223,
    image: images.miniimage3,
  },
  {
    id: 4,
    name: "Dr. Emily Walker",
    specialization: "Pediatrics",
    location: "Serenity Pediatrics Clinic",
    rating: 5,
    reviews: 405,
    image: images.miniimage4,
  },
  {
    id: 5,
    name: "Dr. Robert Chen",
    specialization: "Neurologist",
    location: "Brain Health Institute, CA",
    rating: 4.8,
    reviews: 932,
    image: images.miniimage2,
  },
  {
    id: 6,

    name: "Dr. Sarah Williams",
    specialization: "Dermatologist",
    location: "Skin Care Center, FL",
    rating: 4.9,
    reviews: 1567,
    image: images.miniimage4,
  },
  {
    id: 7,
    name: "Dr. James Wilson",
    specialization: "General Surgeon",
    location: "City General Hospital, TX",
    rating: 4.6,
    reviews: 2874,
    image: images.miniimage1,
  },
  {
    id: 8,

    name: "Dr. Olivia Martinez",
    specialization: "Psychiatrist",
    location: "Mental Wellness Center, CO",
    rating: 4.7,
    reviews: 643,
    image: images.miniimage2,
  },
  {
    id: 9,
    name: "Dr. Daniel Kim",
    specialization: "Ophthalmologist",
    location: "Vision Care Clinic, IL",
    rating: 5,
    reviews: 1123,
    image: images.miniimage3,
  },
  {
    id: 10,
    name: "Dr. Sophia Lee",
    specialization: "Endocrinologist",
    location: "Diabetes & Hormone Center, MA",
    rating: 4.8,
    reviews: 756,
    image: images.miniimage1,
  },
  {
    id: 11,
    name: "Dr. William Brown",
    specialization: "Urologist",
    location: "Men's Health Clinic, AZ",
    rating: 4.5,
    reviews: 892,
    image: images.miniimage4,
  },
  {
    id: 12,
    name: "Dr. Ava Garcia",
    specialization: "Allergist",
    location: "Allergy & Asthma Center, WA",
    rating: 4.9,
    reviews: 534,
    image: images.miniimage2,
  },
  {
    id: 13,
    name: "Dr. Ethan Taylor",
    specialization: "Rheumatologist",
    location: "Arthritis Care, OR",
    rating: 4.7,
    reviews: 321,
    image: images.miniimage1,
  },
  {
    id: 14,
    name: "Dr. Mia Anderson",
    specialization: "Pulmonologist",
    location: "Lung Health Institute, MI",
    rating: 4.8,
    reviews: 678,
    image: images.miniimage2,
  },
  {
    id: 15,
    name: "Dr. Noah Thomas",
    specialization: "Gastroenterologist",
    location: "Digestive Health Center, OH",
    rating: 4.6,
    reviews: 1245,
    image: images.miniimage4,
  },
];

export const demoReviews: IReviews[] = [
  {
    client_name: "John S.",
    rating: 5,
    review:
      "Dr. Patel was incredibly thorough and took the time to explain everything clearly. The Cardiology Center has excellent facilities.",
    date: "2025-07-15",
  },
  {
    client_name: "Maria G.",
    rating: 4,
    review:
      "Dr. Turner is very professional, though the wait time was longer than expected. Overall a good experience at Women's Clinic.",
    date: "2025-06-22",
  },
  {
    client_name: "Robert T.",
    rating: 5,
    review:
      "Dr. Johnson performed my knee surgery and the results have been life-changing. Highly recommend Maple Associates!",
    date: "2025-08-01",
  },
  {
    client_name: "Lisa M.",
    rating: 5,
    review:
      "Dr. Walker is amazing with children. My daughter actually looks forward to her pediatric visits at Serenity Pediatrics.",
    date: "2025-07-30",
  },
  {
    client_name: "David K.",
    rating: 4,
    review:
      "Good experience overall, though the billing process could be more transparent. Medical care itself was excellent.",
    date: "2025-06-10",
  },
  {
    client_name: "Sarah L.",
    rating: 5,
    review:
      "The entire staff was welcoming and professional. I felt well-cared for throughout my treatment.",
    date: "2025-05-18",
  },
  {
    client_name: "James P.",
    rating: 3,
    review:
      "Competent medical care but the office seemed understaffed. Had to wait nearly an hour past my appointment time.",
    date: "2025-04-05",
  },
  {
    client_name: "Emily R.",
    rating: 5,
    review:
      "Exceptional care from start to finish. The doctor listened to all my concerns and developed a comprehensive treatment plan.",
    date: "2025-07-12",
  },
];
