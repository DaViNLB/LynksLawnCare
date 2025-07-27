import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertBookingSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2025-06-30.basil",
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      res.json(booking);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid booking data: " + error.message });
    }
  });

  // Get booking
  app.get("/api/bookings/:id", async (req, res) => {
    try {
      const booking = await storage.getBooking(req.params.id);
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching booking: " + error.message });
    }
  });

  // Create payment intent for booking
  app.post("/api/create-payment-intent", async (req, res) => {
    try {
      const { amount, bookingId } = req.body;
      
      if (!amount || amount <= 0) {
        return res.status(400).json({ message: "Invalid amount" });
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: "usd",
        metadata: bookingId ? { bookingId } : {},
      });

      res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ message: "Error creating payment intent: " + error.message });
    }
  });

  // Update booking payment status
  app.post("/api/bookings/:id/payment", async (req, res) => {
    try {
      const { paymentId } = req.body;
      const booking = await storage.updateBookingPayment(req.params.id, paymentId);
      res.json(booking);
    } catch (error: any) {
      res.status(500).json({ message: "Error updating payment: " + error.message });
    }
  });

  // Create contact
  app.post("/api/contacts", async (req, res) => {
    try {
      const contactData = insertContactSchema.parse(req.body);
      const contact = await storage.createContact(contactData);
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid contact data: " + error.message });
    }
  });

  // Calculate pricing
  app.post("/api/calculate-price", async (req, res) => {
    try {
      const { serviceType, acres } = req.body;
      
      const pricing = {
        mowing: { base: 45, perAcre: 25 },
        cleanup: { base: 125, perAcre: 75 }
      };

      if (!pricing[serviceType as keyof typeof pricing]) {
        return res.status(400).json({ message: "Invalid service type" });
      }

      const service = pricing[serviceType as keyof typeof pricing];
      const additional = acres > 0.5 ? (acres - 0.5) * service.perAcre : 0;
      const total = service.base + additional;

      res.json({
        basePrice: service.base,
        additionalPrice: additional,
        totalPrice: total,
        acres: acres
      });
    } catch (error: any) {
      res.status(400).json({ message: "Error calculating price: " + error.message });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
