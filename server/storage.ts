import { type User, type InsertUser, type Booking, type InsertBooking, type Contact, type InsertContact } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  getBooking(id: string): Promise<Booking | undefined>;
  createBooking(booking: InsertBooking): Promise<Booking>;
  updateBookingPayment(id: string, paymentId: string): Promise<Booking>;
  
  createContact(contact: InsertContact): Promise<Contact>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private bookings: Map<string, Booking>;
  private contacts: Map<string, Contact>;

  constructor() {
    this.users = new Map();
    this.bookings = new Map();
    this.contacts = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    return this.bookings.get(id);
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const id = randomUUID();
    const booking: Booking = {
      ...insertBooking,
      id,
      createdAt: new Date(),
      paymentId: null,
      paid: false,
    };
    this.bookings.set(id, booking);
    return booking;
  }

  async updateBookingPayment(id: string, paymentId: string): Promise<Booking> {
    const booking = this.bookings.get(id);
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    const updatedBooking = { ...booking, paymentId, paid: true };
    this.bookings.set(id, updatedBooking);
    return updatedBooking;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const id = randomUUID();
    const contact: Contact = {
      ...insertContact,
      id,
      createdAt: new Date(),
      address: insertContact.address || null,
      phone: insertContact.phone || null,
      service: insertContact.service || null,
    };
    this.contacts.set(id, contact);
    return contact;
  }
}

export const storage = new MemStorage();
