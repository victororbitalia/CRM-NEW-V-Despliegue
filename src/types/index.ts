// User types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  STAFF = 'STAFF',
}

// Restaurant types
export interface Restaurant {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  description?: string;
  timezone: string;
  createdAt: Date;
  updatedAt: Date;
}

// Table types
export interface Table {
  id: string;
  number: string;
  capacity: number;
  location: TableLocation;
  status: TableStatus;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export enum TableLocation {
  INTERIOR = 'INTERIOR',
  EXTERIOR = 'EXTERIOR',
  TERRACE = 'TERRACE',
  PRIVATE = 'PRIVATE',
}

export enum TableStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
}

// Reservation types
export interface Reservation {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: Date;
  time: string;
  partySize: number;
  tableId?: string;
  status: ReservationStatus;
  specialRequests?: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ReservationStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  SEATED = 'SEATED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  NO_SHOW = 'NO_SHOW',
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Auth types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  user: User;
  token: string;
  refreshToken: string;
}

// Form types
export interface CreateReservationData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  time: string;
  partySize: number;
  tableId?: string;
  specialRequests?: string;
}

export interface CreateTableData {
  number: string;
  capacity: number;
  location: TableLocation;
}

export interface UpdateRestaurantData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  description?: string;
  timezone?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  website?: string;
  logo?: string;
  currency?: string;
  isActive?: boolean;
}

// Restaurant Settings types
export interface RestaurantSettings {
  id: string;
  restaurantId: string;
  language: string;
  dateFormat: string;
  timeFormat: string;
  defaultReservationDuration: number;
  maxAdvanceBookingDays: number;
  minAdvanceBookingHours: number;
  maxPartySize: number;
  enableOnlineBookings: boolean;
  enableWaitlist: boolean;
  confirmationEmailEnabled: boolean;
  reminderEmailEnabled: boolean;
  reminderEmailHoursBefore: number;
  cancellationEmailEnabled: boolean;
  autoCancelNoShowMinutes: number;
  emailNotifications?: Record<string, any>;
  smsNotifications?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdateRestaurantSettingsData {
  language?: string;
  dateFormat?: string;
  timeFormat?: string;
  defaultReservationDuration?: number;
  maxAdvanceBookingDays?: number;
  minAdvanceBookingHours?: number;
  maxPartySize?: number;
  enableOnlineBookings?: boolean;
  enableWaitlist?: boolean;
  confirmationEmailEnabled?: boolean;
  reminderEmailEnabled?: boolean;
  reminderEmailHoursBefore?: number;
  cancellationEmailEnabled?: boolean;
  autoCancelNoShowMinutes?: number;
  emailNotifications?: Record<string, any>;
  smsNotifications?: Record<string, any>;
}

// Operating Hours types
export interface OperatingHour {
  id: string;
  restaurantId: string;
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isSpecialDay: boolean;
  specialDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOperatingHourData {
  dayOfWeek: number;
  openTime: string;
  closeTime: string;
  isClosed: boolean;
  isSpecialDay?: boolean;
  specialDate?: Date;
}

export interface UpdateOperatingHourData {
  openTime?: string;
  closeTime?: string;
  isClosed?: boolean;
  isSpecialDay?: boolean;
  specialDate?: Date;
}

// Area types
export interface Area {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  maxCapacity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAreaData {
  name: string;
  description?: string;
  maxCapacity: number;
  isActive?: boolean;
}

export interface UpdateAreaData {
  name?: string;
  description?: string;
  maxCapacity?: number;
  isActive?: boolean;
}

// Business Rules types
export interface BusinessRule {
  id: string;
  restaurantId: string;
  name: string;
  description?: string;
  ruleType: string;
  conditions: Record<string, any>;
  actions: Record<string, any>;
  isActive: boolean;
  priority: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateBusinessRuleData {
  name: string;
  description?: string;
  ruleType: string;
  conditions: Record<string, any>;
  actions: Record<string, any>;
  isActive?: boolean;
  priority?: number;
}

export interface UpdateBusinessRuleData {
  name?: string;
  description?: string;
  ruleType?: string;
  conditions?: Record<string, any>;
  actions?: Record<string, any>;
  isActive?: boolean;
  priority?: number;
}

// Form types
export interface CreateRestaurantData {
  name: string;
  address: string;
  city: string;
  phone: string;
  email: string;
  description?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  website?: string;
  timezone?: string;
  currency?: string;
}

// Restaurant with relations
export interface RestaurantWithRelations extends Restaurant {
  settings?: RestaurantSettings;
  operatingHours?: OperatingHour[];
  areas?: Area[];
  businessRules?: BusinessRule[];
}