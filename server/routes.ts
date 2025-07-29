import type { Express } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { insertBookingSchema, insertContactSchema } from "@shared/schema";
import { z } from "zod";
import { exportAllDataToSheets, exportBookingsToSheets, exportContactsToSheets } from "./google-sheets";
import { triggerImmediateExport } from "./scheduler";

// Email notification functions
async function sendBookingNotification(booking: any) {
  // Simple email notification simulation
  console.log(`📧 New booking notification:
    Customer: ${booking.name}
    Email: ${booking.email}
    Phone: ${booking.phone}
    Service: ${booking.serviceType}
    Address: ${booking.address}
    Property Size: ${booking.propertySize} acres
    Subscription: ${booking.subscriptionType}
    Special Requests: ${booking.specialRequests || 'None'}
    Price: $${booking.price}
  `);
  
  // In a real implementation, you would integrate with:
  // - SendGrid, Mailgun, or similar email service
  // - Or direct SMTP configuration
  // - Or webhook to external service like Zapier
}

async function sendContactNotification(contact: any) {
  console.log(`📧 New contact form submission:
    Name: ${contact.name}
    Email: ${contact.email}
    Phone: ${contact.phone || 'Not provided'}
    Message: ${contact.message}
  `);
}

// Optional Stripe integration - can be configured later
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2025-06-30.basil",
    })
  : null;

export async function registerRoutes(app: Express): Promise<Server> {
  // Create booking
  app.post("/api/bookings", async (req, res) => {
    try {
      const bookingData = insertBookingSchema.parse(req.body);
      const booking = await storage.createBooking(bookingData);
      
      // Send email notification for booking
      try {
        await sendBookingNotification(booking);
      } catch (emailError) {
        console.error('Failed to send booking notification:', emailError);
      }
      
      res.json(booking);
    } catch (error: any) {
      console.error('Booking creation error:', error);
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
      if (!stripe) {
        return res.status(503).json({ 
          message: "Payment processing is not configured. Please contact support to complete your booking.",
          error: "STRIPE_NOT_CONFIGURED"
        });
      }

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
      
      // Send email notification for contact form
      try {
        await sendContactNotification(contact);
      } catch (emailError) {
        console.error('Failed to send contact notification:', emailError);
      }
      
      res.json(contact);
    } catch (error: any) {
      res.status(400).json({ message: "Invalid contact data: " + error.message });
    }
  });

  // Send booking notification email
  app.post("/api/send-booking-notification", async (req, res) => {
    try {
      const { bookingId } = req.body;
      const booking = await storage.getBooking(bookingId);
      
      if (!booking) {
        return res.status(404).json({ message: "Booking not found" });
      }

      await sendBookingNotification(booking);
      res.json({ message: "Notification sent successfully" });
    } catch (error: any) {
      console.error('Failed to send booking notification:', error);
      res.status(500).json({ message: "Failed to send notification" });
    }
  });

  // Google Sheets export endpoints
  app.post("/api/export-to-sheets", async (req, res) => {
    try {
      await exportAllDataToSheets();
      res.json({ message: "Data exported to Google Sheets successfully" });
    } catch (error: any) {
      console.error('Failed to export to Google Sheets:', error);
      res.status(500).json({ message: "Failed to export data: " + error.message });
    }
  });

  app.post("/api/export-bookings-to-sheets", async (req, res) => {
    try {
      await exportBookingsToSheets();
      res.json({ message: "Bookings exported to Google Sheets successfully" });
    } catch (error: any) {
      console.error('Failed to export bookings to Google Sheets:', error);
      res.status(500).json({ message: "Failed to export bookings: " + error.message });
    }
  });

  app.post("/api/export-contacts-to-sheets", async (req, res) => {
    try {
      await exportContactsToSheets();
      res.json({ message: "Contacts exported to Google Sheets successfully" });
    } catch (error: any) {
      console.error('Failed to export contacts to Google Sheets:', error);
      res.status(500).json({ message: "Failed to export contacts: " + error.message });
    }
  });

  // Get stored data endpoints for admin viewing
  app.get("/api/admin/bookings", async (req, res) => {
    try {
      const bookings = await storage.getAllBookings();
      res.json(bookings);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching bookings: " + error.message });
    }
  });

  app.get("/api/admin/contacts", async (req, res) => {
    try {
      const contacts = await storage.getAllContacts();
      res.json(contacts);
    } catch (error: any) {
      res.status(500).json({ message: "Error fetching contacts: " + error.message });
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
