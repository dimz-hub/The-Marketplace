export interface Business {
  id: string;
  name: string;
  category: 'Fashion' | 'Food' | 'Dry Foods' | 'Logistics' | 'Home Services';
  image: string;
  gallery: string[]; // Additional photos for the business
  rating: number;
  reviewCount: number;
  priceLevel: number; // 1 to 4
  location: {
    address: string;
    city: string;
    coordinates: { lat: number; lng: number }; // For map integration
  };
  contact: {
    phone: string;
    email: string;
    whatsapp: string; // Crucial for Nigerian market
    website?: string;
  };
  hours: {
    isOpen: boolean;
    closingTime: string;
    schedule: Record<string, string>; // e.g., { "Monday": "9am-5pm" }
  };
  tags: string[]; // e.g., ["Bespoke", "DBS Checked", "Next-day"]
  topComment: {
    user: string;
    text: string;
    userImage: string;
  };
  verifications: {
    isVerified: boolean;
    regulationBody?: string; // From your form: CQC, NMC, etc.
    dbsStatus?: string; // From your form
    nvqLevel?: string; // From your form
  };
  description: string;
}

export const businessData: Business[] = [
  {
    id: "1",
    name: "Classic Thread Tailors",
    category: "Fashion",
    image: "https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=800",
    gallery: [],
    rating: 4.8,
    reviewCount: 245,
    priceLevel: 3,
    location: {
      address: "12 Admiralty Way",
      city: "Lekki, Lagos",
      coordinates: { lat: 6.4474, lng: 3.4723 }
    },
    contact: {
      phone: "+234 801 234 5678",
      email: "info@classicthreads.ng",
      whatsapp: "2348012345678"
    },
    hours: {
      isOpen: true,
      closingTime: "7:00 PM",
      schedule: { "Mon-Fri": "9am-7pm", "Sat": "10am-4pm" }
    },
    tags: ["Bespoke", "Native Wear", "Male Fashion"],
    topComment: {
      user: "Chidi O.",
      text: "The fit was perfect on the first try. Best Agbada in Lagos!",
      userImage: "/avatars/user1.jpg"
    },
    verifications: {
      isVerified: true
    },
    description: "Premium bespoke tailoring specializing in traditional and corporate wear."
  },
  {
    id: "2",
    name: "Swift-Logistics Nigeria",
    category: "Logistics",
    image: "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?q=80&w=800",
    gallery: [],
    rating: 4.5,
    reviewCount: 89,
    priceLevel: 2,
    location: {
      address: "Plot 45, Industrial Estate",
      city: "Ikeja, Lagos",
      coordinates: { lat: 6.6018, lng: 3.3515 }
    },
    contact: {
      phone: "+234 902 333 4444",
      email: "deliveries@swiftlog.ng",
      whatsapp: "2349023334444"
    },
    hours: {
      isOpen: true,
      closingTime: "9:00 PM",
      schedule: { "Mon-Sat": "24 Hours", "Sun": "Closed" }
    },
    tags: ["Same Day", "Interstate", "Heavy Cargo"],
    topComment: {
      user: "Amina B.",
      text: "Used them to move my dry food stock. Very professional and timely.",
      userImage: "/avatars/user2.jpg"
    },
    verifications: {
      isVerified: true,
      regulationBody: "NITDA",
      dbsStatus: "Verified"
    },
    description: "Fast and secure delivery solutions across all 36 states."
  }
];