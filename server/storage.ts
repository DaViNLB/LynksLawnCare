import { type User, type InsertUser, type Booking, type InsertBooking, type Contact, type InsertContact } from "@shared/schema";
import { users, bookings, contacts } from "@shared/schema";
import { randomUUID } from "crypto";
import { db } from "./db";
import { eq } from "drizzle-orm";

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
      notes: insertBooking.notes || null,
      status: insertBooking.status || "pending",
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

// Database Storage Implementation
export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(insertUser)
      .returning();
    return user;
  }

  async getBooking(id: string): Promise<Booking | undefined> {
    const [booking] = await db.select().from(bookings).where(eq(bookings.id, id));
    return booking || undefined;
  }

  async createBooking(insertBooking: InsertBooking): Promise<Booking> {
    const [booking] = await db
      .insert(bookings)
      .values({
        ...insertBooking,
        notes: insertBooking.notes || null,
        status: insertBooking.status || "pending",
      })
      .returning();
    return booking;
  }

  async updateBookingPayment(id: string, paymentId: string): Promise<Booking> {
    const [booking] = await db
      .update(bookings)
      .set({ paymentId, paid: true })
      .where(eq(bookings.id, id))
      .returning();
    
    if (!booking) {
      throw new Error("Booking not found");
    }
    
    return booking;
  }

  async createContact(insertContact: InsertContact): Promise<Contact> {
    const [contact] = await db
      .insert(contacts)
      .values({
        ...insertContact,
        address: insertContact.address || null,
        phone: insertContact.phone || null,
        service: insertContact.service || null,
      })
      .returning();
    return contact;
  }
}

export const storage = new DatabaseStorage();
