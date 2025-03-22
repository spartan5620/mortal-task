
export type Role = 'admin' | 'owner' | 'guest';

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  role: Role;
  canteenId?: string; // Only for owners
}

export interface Canteen {
  id: string;
  name: string;
  description: string;
  location: string;
  ownerId: string;
  profileImage: string;
  menuImages: string[];
  isOpen: boolean;
  specialOffers: SpecialOffer[];
  menu: MenuItem[];
  schedule: Schedule;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  canteenId: string;
}

export interface SpecialOffer {
  id: string;
  title: string;
  description: string;
  discountPercentage?: number;
  startDate: Date;
  endDate: Date;
  canteenId: string;
}

export interface Schedule {
  canteenId: string;
  regularHours: ShiftTime[];
  closedDates: ClosedDate[];
}

export interface ShiftTime {
  id: string;
  day: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  shifts: Shift[];
}

export interface Shift {
  id: string;
  start: string; // Format: "HH:MM"
  end: string; // Format: "HH:MM"
}

export interface ClosedDate {
  id: string;
  date: Date;
  reason: string;
}

export interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}
