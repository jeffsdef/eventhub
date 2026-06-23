export interface Category {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export interface Event {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  date: string;
  time: string;
  location: string;
  organizer: string;
  organizerId: number;
  price: number;
  capacity: number;
  confirmed: number;
  status: string;
  rating: number;
  reviews: number;
  featured: boolean;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar: string;
  role: string;
  bio: string;
  eventsCreated: number;
  eventsAttended: number;
  rating: number;
  interests: string[];
}

export interface PlatformStats {
  totalEvents: number;
  totalUsers: number;
  totalOrganizers: number;
  eventsThisMonth: number;
  averageRating: number;
  totalRevenue: string;
  growthRate: string;
}

export interface RegisterUserPayload {
  name: string;
  email: string;
  password: string;
  interests?: string[];
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface UpdateUserPayload {
  name?: string;
  email?: string;
  bio?: string;
}
