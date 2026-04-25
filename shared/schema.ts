import { z } from "zod";
import { ObjectId } from "mongodb";

// MongoDB Schema Types
export interface MenuItem {
  _id: ObjectId;
  name: string;
  description: string;
  price: number | string;  // String for bar items with multi-price format (e.g., "30ml: ₹200 / NIP: ₹400 / Bottle: ₹2000")
  category: string;
  isVeg: boolean;
  image: string;
  restaurantId: ObjectId;
  isAvailable: boolean;
  todaysSpecial: boolean;
  chefSpecial: boolean;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
  preparationTime?: string;
  nutritionalContents?: Record<string, number | string>;
  allergens?: string[];
  ingredients?: string[];
}

export interface CartItem {
  _id: ObjectId;
  menuItemId: ObjectId;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface User {
  _id: ObjectId;
  username: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer {
  _id: ObjectId;
  name: string;
  contactNumber: string;
  visitCount: number;
  lastVisitDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface WelcomeScreenUI {
  _id: ObjectId;
  logoUrl: string;
  buttonText: string;
}

export interface SocialLinks {
  _id: ObjectId;
  instagram: string;
  facebook: string;
  youtube: string;
  googleReview: string;
  locate: string;
  call: string;
  whatsapp: string;
  email: string;
  website: string;
}

export interface CarouselImage {
  _id: ObjectId;
  url: string;
  alt: string;
  order: number;
  visible: boolean;
}

export interface Coupon {
  _id: ObjectId;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  validity: string;
  tag: string;
  show: boolean;
}

export interface Logo {
  _id: ObjectId;
  url: string;
}

export interface Reservation {
  _id: ObjectId;
  name: string;
  phone: string;
  date: string;
  timeSlot: string;
  guests: string;
  occasion?: string;
  createdAt: Date;
}

export interface SmartPicksCategory {
  _id: ObjectId;
  label: string;
  key: string;
  icon: string;
  tagline: string;
  order: number;
  isVisible: boolean;
}

export interface PaymentDetails {
  _id: ObjectId;
  upiId: string;
}

export interface CallWaiter {
  _id: ObjectId;
  called: boolean;
}

export interface RestaurantInfoEntry {
  name: string;
  subtext: string;
  show: boolean;
  linkKey?: string;
}

export interface RestaurantInfo {
  _id: ObjectId;
  location: RestaurantInfoEntry;
  contact: RestaurantInfoEntry;
  hours: RestaurantInfoEntry;
  instagram: RestaurantInfoEntry;
  facebook: RestaurantInfoEntry;
  youtube: RestaurantInfoEntry;
  whatsapp: RestaurantInfoEntry;
}

export interface MenuSubCategory {
  id: string;
  title: string;
  image: string;
  visible: boolean;
  subcategories: MenuSubCategory[];
}

export interface MenuCategory {
  _id: ObjectId;
  id: string;
  title: string;
  image: string;
  order: number;
  visible: boolean;
  subcategories: MenuSubCategory[];
}

// Zod schemas for validation
export const insertMenuItemSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.union([z.number().positive(), z.string().min(1)]),  // Support both number and string prices
  category: z.string().min(1),
  isVeg: z.boolean(),
  image: z.string().url(),
  restaurantId: z.string().optional(),
  isAvailable: z.boolean().default(true),
  todaysSpecial: z.boolean().default(false),
  chefSpecial: z.boolean().default(false),
  preparationTime: z.string().optional(),
  nutritionalContents: z.record(z.string(), z.union([z.number(), z.string()])).optional(),
  allergens: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
});

export const updateMenuItemFlagsSchema = z.object({
  todaysSpecial: z.boolean().optional(),
  chefSpecial: z.boolean().optional(),
  isAvailable: z.boolean().optional(),
});

export const insertCartItemSchema = z.object({
  menuItemId: z.string(),
  quantity: z.number().positive().default(1),
});

export const insertUserSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(6),
});

export const insertCustomerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  contactNumber: z.string().regex(/^[0-9]{10}$/, "Contact number must be exactly 10 digits"),
  visitCount: z.number().optional().default(1),
  lastVisitDate: z.date().optional(),
});

export const insertReservationSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(10).max(10),
  date: z.string().min(1),
  timeSlot: z.string().min(1),
  guests: z.string().min(1),
  occasion: z.string().optional(),
});

export type InsertMenuItem = z.infer<typeof insertMenuItemSchema>;
export type InsertCartItem = z.infer<typeof insertCartItemSchema>;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertCustomer = z.infer<typeof insertCustomerSchema>;
export type InsertReservation = z.infer<typeof insertReservationSchema>;
