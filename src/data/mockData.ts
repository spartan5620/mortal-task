import { Canteen, MenuItem, User, SpecialOffer, ShiftTime, Schedule } from '../lib/types';

// Mock Users
export const users: User[] = [
  {
    id: 'admin1',
    username: 'admin',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: 'owner1',
    username: 'nilachal_owner',
    password: 'nilachal123',
    name: 'NILACHAL Canteen Owner',
    role: 'owner',
    canteenId: 'canteen1',
  },
  {
    id: 'owner2',
    username: 'charaideu_owner',
    password: 'charaideu123',
    name: 'CHARAIDEU Canteen Owner',
    role: 'owner',
    canteenId: 'canteen2',
  },
  {
    id: 'owner3',
    username: 'patkai_owner',
    password: 'patkai123',
    name: 'PATKAI Canteen Owner',
    role: 'owner',
    canteenId: 'canteen3',
  },
  {
    id: 'owner4',
    username: 'kanchanjanga_owner',
    password: 'kanchanjanga123',
    name: 'KANCHANJANGA Canteen Owner',
    role: 'owner',
    canteenId: 'canteen4',
  },
  {
    id: 'owner5',
    username: 'bhrahmaputra_owner',
    password: 'bhrahmaputra123',
    name: 'BHRAHMAPUTRA Canteen Owner',
    role: 'owner',
    canteenId: 'canteen5',
  },
  {
    id: 'guest1',
    username: 'guest',
    password: 'guest123',
    name: 'Guest User',
    role: 'guest',
  },
];

// Default shifts
const defaultShifts: ShiftTime[] = [
  {
    id: 'shift1',
    day: 'monday',
    shifts: [
      { id: 'morning1', start: '09:00', end: '13:00' },
      { id: 'afternoon1', start: '16:00', end: '20:00' },
      { id: 'night1', start: '22:00', end: '02:00' },
    ],
  },
  {
    id: 'shift2',
    day: 'tuesday',
    shifts: [
      { id: 'morning2', start: '09:00', end: '13:00' },
      { id: 'afternoon2', start: '16:00', end: '20:00' },
      { id: 'night2', start: '22:00', end: '02:00' },
    ],
  },
  {
    id: 'shift3',
    day: 'wednesday',
    shifts: [
      { id: 'morning3', start: '09:00', end: '13:00' },
      { id: 'afternoon3', start: '16:00', end: '20:00' },
      { id: 'night3', start: '22:00', end: '02:00' },
    ],
  },
  {
    id: 'shift4',
    day: 'thursday',
    shifts: [
      { id: 'morning4', start: '09:00', end: '13:00' },
      { id: 'afternoon4', start: '16:00', end: '20:00' },
      { id: 'night4', start: '22:00', end: '02:00' },
    ],
  },
  {
    id: 'shift5',
    day: 'friday',
    shifts: [
      { id: 'morning5', start: '09:00', end: '13:00' },
      { id: 'afternoon5', start: '16:00', end: '20:00' },
      { id: 'night5', start: '22:00', end: '02:00' },
    ],
  },
  {
    id: 'shift6',
    day: 'saturday',
    shifts: [
      { id: 'morning6', start: '09:00', end: '13:00' },
      { id: 'afternoon6', start: '16:00', end: '20:00' },
      { id: 'night6', start: '22:00', end: '02:00' },
    ],
  },
  {
    id: 'shift7',
    day: 'sunday',
    shifts: [
      { id: 'morning7', start: '09:00', end: '13:00' },
      { id: 'afternoon7', start: '16:00', end: '20:00' },
      { id: 'night7', start: '22:00', end: '02:00' },
    ],
  },
];

// Default schedule for each canteen
const createDefaultSchedule = (canteenId: string): Schedule => ({
  canteenId,
  regularHours: [...defaultShifts],
  closedDates: [],
});

// Mock Menu Items
const createMenuItems = (canteenId: string): MenuItem[] => [
  {
    id: `${canteenId}-item1`,
    name: 'Breakfast Sandwich',
    description: 'Eggs, cheese, and bacon on a toasted bagel',
    price: 5.99,
    category: 'Breakfast',
    available: true,
    canteenId,
  },
  {
    id: `${canteenId}-item2`,
    name: 'Chicken Caesar Salad',
    description: 'Fresh romaine lettuce, grilled chicken, parmesan, and croutons',
    price: 8.99,
    category: 'Lunch',
    available: true,
    canteenId,
  },
  {
    id: `${canteenId}-item3`,
    name: 'Veggie Burger',
    description: 'Plant-based patty with lettuce, tomato, and special sauce',
    price: 7.99,
    category: 'Lunch',
    available: true,
    canteenId,
  },
  {
    id: `${canteenId}-item4`,
    name: 'Iced Coffee',
    description: 'Cold brewed coffee served over ice',
    price: 3.99,
    category: 'Beverages',
    available: true,
    canteenId,
  },
];

// Mock Special Offers
const createSpecialOffers = (canteenId: string): SpecialOffer[] => [
  {
    id: `${canteenId}-offer1`,
    title: 'Early Bird Discount',
    description: '15% off all breakfast items before 10am',
    discountPercentage: 15,
    startDate: new Date(),
    endDate: new Date(new Date().setDate(new Date().getDate() + 30)),
    canteenId,
  },
];

// Mock Canteens
export const canteens: Canteen[] = [
  {
    id: 'canteen1',
    name: 'NILACHAL',
    description: 'Main canteen located at the university center',
    location: 'University Center, Ground Floor',
    ownerId: 'owner1',
    profileImage: '',
    menuImages: [],
    isOpen: true,
    menu: createMenuItems('canteen1'),
    specialOffers: createSpecialOffers('canteen1'),
    schedule: createDefaultSchedule('canteen1'),
  },
  {
    id: 'canteen2',
    name: 'CHARAIDEU',
    description: 'Serving the northern academic buildings',
    location: 'North Campus, Building A',
    ownerId: 'owner2',
    profileImage: '',
    menuImages: [],
    isOpen: true,
    menu: createMenuItems('canteen2'),
    specialOffers: createSpecialOffers('canteen2'),
    schedule: createDefaultSchedule('canteen2'),
  },
  {
    id: 'canteen3',
    name: 'PATKAI',
    description: 'Located near the student dormitories',
    location: 'South Campus, Dorm Complex',
    ownerId: 'owner3',
    profileImage: '',
    menuImages: [],
    isOpen: true,
    menu: createMenuItems('canteen3'),
    specialOffers: createSpecialOffers('canteen3'),
    schedule: createDefaultSchedule('canteen3'),
  },
  {
    id: 'canteen4',
    name: 'KANCHANJANGA',
    description: 'Near the engineering buildings',
    location: 'East Campus, Engineering Complex',
    ownerId: 'owner4',
    profileImage: '',
    menuImages: [],
    isOpen: true,
    menu: createMenuItems('canteen4'),
    specialOffers: createSpecialOffers('canteen4'),
    schedule: createDefaultSchedule('canteen4'),
  },
  {
    id: 'canteen5',
    name: 'BHRAHMAPUTRA',
    description: 'Located near sports facilities',
    location: 'West Campus, Sports Center',
    ownerId: 'owner5',
    profileImage: '',
    menuImages: [],
    isOpen: true,
    menu: createMenuItems('canteen5'),
    specialOffers: createSpecialOffers('canteen5'),
    schedule: createDefaultSchedule('canteen5'),
  },
];

// Helper function to get a canteen by ID
export const getCanteenById = (id: string): Canteen | undefined => {
  return canteens.find(canteen => canteen.id === id);
};

// Helper function to get a user by username and password
export const getUserByCredentials = (username: string, password: string): User | undefined => {
  return users.find(user => user.username === username && user.password === password);
};

// Helper function to get a canteen by owner ID
export const getCanteenByOwnerId = (ownerId: string): Canteen | undefined => {
  return canteens.find(canteen => canteen.ownerId === ownerId);
};

// Local storage keys
export const STORAGE_KEYS = {
  USERS: 'university_canteen_users',
  CANTEENS: 'university_canteen_canteens',
  USER: 'university_canteen_current_user',
};

// Initialize local storage with mock data
export const initializeLocalStorage = () => {
  if (!localStorage.getItem(STORAGE_KEYS.USERS)) {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }
  
  if (!localStorage.getItem(STORAGE_KEYS.CANTEENS)) {
    localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
  }
};

// Get all canteens from local storage
export const getAllCanteens = (): Canteen[] => {
  const canteens = localStorage.getItem(STORAGE_KEYS.CANTEENS);
  return canteens ? JSON.parse(canteens) : [];
};

// Update a canteen in local storage
export const updateCanteen = (updatedCanteen: Canteen): void => {
  const canteens = getAllCanteens();
  const index = canteens.findIndex(c => c.id === updatedCanteen.id);
  
  if (index !== -1) {
    canteens[index] = updatedCanteen;
    localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
  }
};

// Update a menu item in local storage
export const updateMenuItem = (canteenId: string, updatedItem: MenuItem): void => {
  const canteens = getAllCanteens();
  const canteenIndex = canteens.findIndex(c => c.id === canteenId);
  
  if (canteenIndex !== -1) {
    const itemIndex = canteens[canteenIndex].menu.findIndex(item => item.id === updatedItem.id);
    
    if (itemIndex !== -1) {
      canteens[canteenIndex].menu[itemIndex] = updatedItem;
      localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
    }
  }
};

// Add a new menu item to a canteen
export const addMenuItem = (canteenId: string, newItem: MenuItem): void => {
  const canteens = getAllCanteens();
  const canteenIndex = canteens.findIndex(c => c.id === canteenId);
  
  if (canteenIndex !== -1) {
    canteens[canteenIndex].menu.push(newItem);
    localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
  }
};

// Delete a menu item from a canteen
export const deleteMenuItem = (canteenId: string, itemId: string): void => {
  const canteens = getAllCanteens();
  const canteenIndex = canteens.findIndex(c => c.id === canteenId);
  
  if (canteenIndex !== -1) {
    canteens[canteenIndex].menu = canteens[canteenIndex].menu.filter(item => item.id !== itemId);
    localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
  }
};

// Update the schedule for a canteen
export const updateSchedule = (canteenId: string, schedule: Schedule): void => {
  const canteens = getAllCanteens();
  const canteenIndex = canteens.findIndex(c => c.id === canteenId);
  
  if (canteenIndex !== -1) {
    canteens[canteenIndex].schedule = schedule;
    localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
  }
};

// Update canteen open/closed status
export const updateCanteenStatus = (canteenId: string, isOpen: boolean): void => {
  const canteens = getAllCanteens();
  const canteenIndex = canteens.findIndex(c => c.id === canteenId);
  
  if (canteenIndex !== -1) {
    canteens[canteenIndex].isOpen = isOpen;
    localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
  }
};

// Add closed date to a canteen's schedule
export const addClosedDate = (canteenId: string, closedDate: { date: Date; reason: string }): void => {
  const canteens = getAllCanteens();
  const canteenIndex = canteens.findIndex(c => c.id === canteenId);
  
  if (canteenIndex !== -1) {
    const newClosedDate = {
      id: `closed-${Date.now()}`,
      date: closedDate.date,
      reason: closedDate.reason,
    };
    
    canteens[canteenIndex].schedule.closedDates.push(newClosedDate);
    localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
  }
};

// Update canteen profile image
export const updateCanteenProfileImage = (canteenId: string, imageUrl: string): void => {
  const canteens = getAllCanteens();
  const canteenIndex = canteens.findIndex(c => c.id === canteenId);
  
  if (canteenIndex !== -1) {
    canteens[canteenIndex].profileImage = imageUrl;
    localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
  }
};

// Add menu image to a canteen
export const addCanteenMenuImage = (canteenId: string, imageUrl: string): void => {
  const canteens = getAllCanteens();
  const canteenIndex = canteens.findIndex(c => c.id === canteenId);
  
  if (canteenIndex !== -1) {
    if (canteens[canteenIndex].menuImages.length < 5) {
      canteens[canteenIndex].menuImages.push(imageUrl);
      localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
    }
  }
};

// Remove menu image from a canteen
export const removeCanteenMenuImage = (canteenId: string, imageUrl: string): void => {
  const canteens = getAllCanteens();
  const canteenIndex = canteens.findIndex(c => c.id === canteenId);
  
  if (canteenIndex !== -1) {
    canteens[canteenIndex].menuImages = canteens[canteenIndex].menuImages.filter(img => img !== imageUrl);
    localStorage.setItem(STORAGE_KEYS.CANTEENS, JSON.stringify(canteens));
  }
};
