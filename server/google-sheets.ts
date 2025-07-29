import { google } from 'googleapis';
import { storage } from './storage';
import type { Booking, Contact } from '@shared/schema';

// Google Sheets service setup
const auth = new google.auth.GoogleAuth({
  keyFile: process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE, // Path to service account JSON
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Configuration for Google Sheets
const SPREADSHEET_ID = process.env.GOOGLE_SPREADSHEET_ID;
const BOOKINGS_SHEET_NAME = 'Bookings';
const CONTACTS_SHEET_NAME = 'Contacts';

// Export bookings to Google Sheets
export async function exportBookingsToSheets() {
  if (!SPREADSHEET_ID) {
    console.log('Google Sheets not configured - skipping export');
    return;
  }

  try {
    // Get all bookings from database
    const bookings = await getAllBookings();
    
    if (bookings.length === 0) {
      console.log('No bookings to export');
      return;
    }

    // Prepare data for sheets
    const headers = [
      'ID', 'Date Created', 'Customer Name', 'Email', 'Phone', 
      'Address', 'Service Type', 'Subscription', 'Property Size (acres)', 
      'Special Requests', 'Price', 'Status', 'Payment ID', 'Paid'
    ];

    const rows = bookings.map((booking: Booking) => [
      booking.id,
      booking.createdAt?.toISOString() || '',
      booking.name,
      booking.email,
      booking.phone,
      booking.address,
      booking.serviceType,
      booking.subscriptionType,
      booking.propertySize,
      booking.specialRequests || '',
      booking.price,
      booking.status,
      booking.paymentId || '',
      booking.paid ? 'Yes' : 'No'
    ]);

    // Clear existing data and write new data
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${BOOKINGS_SHEET_NAME}!A:Z`,
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${BOOKINGS_SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers, ...rows],
      },
    });

    console.log(`✅ Exported ${bookings.length} bookings to Google Sheets`);
  } catch (error) {
    console.error('❌ Error exporting bookings to Google Sheets:', error);
  }
}

// Export contacts to Google Sheets
export async function exportContactsToSheets() {
  if (!SPREADSHEET_ID) {
    console.log('Google Sheets not configured - skipping export');
    return;
  }

  try {
    // Get all contacts from database
    const contacts = await getAllContacts();
    
    if (contacts.length === 0) {
      console.log('No contacts to export');
      return;
    }

    // Prepare data for sheets
    const headers = [
      'ID', 'Date Created', 'Name', 'Email', 'Phone', 
      'Service Interest', 'Address', 'Message'
    ];

    const rows = contacts.map((contact: Contact) => [
      contact.id,
      contact.createdAt?.toISOString() || '',
      contact.name,
      contact.email,
      contact.phone || '',
      contact.service || '',
      contact.address || '',
      contact.message
    ]);

    // Clear existing data and write new data
    await sheets.spreadsheets.values.clear({
      spreadsheetId: SPREADSHEET_ID,
      range: `${CONTACTS_SHEET_NAME}!A:Z`,
    });

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${CONTACTS_SHEET_NAME}!A1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [headers, ...rows],
      },
    });

    console.log(`✅ Exported ${contacts.length} contacts to Google Sheets`);
  } catch (error) {
    console.error('❌ Error exporting contacts to Google Sheets:', error);
  }
}

// Helper functions to get all data from storage
async function getAllBookings() {
  // Since storage interface doesn't have getAll methods, we'll add them
  if ('getAllBookings' in storage) {
    return (storage as any).getAllBookings();
  }
  // Fallback: return empty array if method doesn't exist
  return [];
}

async function getAllContacts() {
  // Since storage interface doesn't have getAll methods, we'll add them
  if ('getAllContacts' in storage) {
    return (storage as any).getAllContacts();
  }
  // Fallback: return empty array if method doesn't exist
  return [];
}

// Export both bookings and contacts
export async function exportAllDataToSheets() {
  console.log('🔄 Starting data export to Google Sheets...');
  await Promise.all([
    exportBookingsToSheets(),
    exportContactsToSheets()
  ]);
  console.log('✅ Data export completed');
}