# Google Sheets Integration Setup Guide

This guide will help you set up automatic data export from your booking and contact forms to Google Sheets.

## Prerequisites

1. **Google Cloud Console Account**: You'll need access to Google Cloud Console
2. **Google Sheets**: A Google Sheets document where you want to store the data

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click "Enable"

## Step 2: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the service account details:
   - Name: `sheets-export-service`
   - Description: `Service account for exporting lawn care data to Google Sheets`
4. Click "Create and Continue"
5. Skip the optional role assignment (click "Continue")
6. Click "Done"

## Step 3: Generate Service Account Key

1. In the Credentials page, find your newly created service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create New Key"
5. Select "JSON" format
6. Click "Create"
7. Save the downloaded JSON file securely

## Step 4: Create Google Sheets Document

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Lynks Lawn Care Data" (or your preferred name)
4. Create two sheets:
   - Rename "Sheet1" to "Bookings"
   - Add a new sheet named "Contacts"
5. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - The SPREADSHEET_ID is the long string between `/d/` and `/edit`

## Step 5: Share Sheets with Service Account

1. In your Google Sheets document, click "Share"
2. Add the service account email address (found in the JSON file, field: `client_email`)
3. Give it "Editor" permissions
4. Click "Send"

## Step 6: Configure Environment Variables

Add these environment variables to your Replit secrets:

```bash
# Google Sheets Configuration
GOOGLE_SPREADSHEET_ID=your_spreadsheet_id_here
GOOGLE_SERVICE_ACCOUNT_KEY_FILE=/path/to/service-account-key.json

# Alternative: Instead of a file, you can use the JSON content directly
GOOGLE_SERVICE_ACCOUNT_JSON={"type":"service_account","project_id":"..."}
```

## Step 7: Upload Service Account Key (Replit)

1. In Replit, upload your service account JSON file to the project
2. Place it in a secure location (e.g., `secrets/google-service-account.json`)
3. Update the `GOOGLE_SERVICE_ACCOUNT_KEY_FILE` environment variable with the correct path

## Available API Endpoints

Once configured, you can use these endpoints:

### Manual Export Triggers
- `POST /api/export-to-sheets` - Export all data (bookings + contacts)
- `POST /api/export-bookings-to-sheets` - Export only bookings
- `POST /api/export-contacts-to-sheets` - Export only contacts

### Data Viewing (Admin)
- `GET /api/admin/bookings` - View all stored bookings
- `GET /api/admin/contacts` - View all stored contacts

## Automatic Scheduling

The system automatically exports data:
- **Daily**: Every day at 2:00 AM
- **Weekly**: Every Monday at 9:00 AM

## Data Structure

### Bookings Sheet Columns
- ID, Date Created, Customer Name, Email, Phone
- Address, Service Type, Subscription, Property Size (acres)
- Special Requests, Price, Status, Payment ID, Paid

### Contacts Sheet Columns
- ID, Date Created, Name, Email, Phone
- Service Interest, Address, Message

## Testing the Integration

1. Fill out a booking form on your website
2. Check your database: `GET /api/admin/bookings`
3. Manually trigger export: `POST /api/export-to-sheets`
4. Verify data appears in your Google Sheets

## Troubleshooting

### Common Issues

1. **403 Forbidden Error**
   - Check that you've shared the sheet with the service account email
   - Verify the service account has Editor permissions

2. **404 Not Found Error**
   - Verify the GOOGLE_SPREADSHEET_ID is correct
   - Check that the sheet names match exactly ("Bookings" and "Contacts")

3. **Authentication Errors**
   - Ensure the service account JSON file is correctly formatted
   - Verify the file path in GOOGLE_SERVICE_ACCOUNT_KEY_FILE

4. **Empty Exports**
   - Check that you have data in your database
   - Test with `GET /api/admin/bookings` and `GET /api/admin/contacts`

### Logs

Monitor the console logs for export status:
- ✅ Success: "Exported X bookings to Google Sheets"
- ❌ Error: "Error exporting to Google Sheets: [error message]"

## Security Notes

- Keep your service account JSON file secure and never commit it to version control
- Use environment variables for all sensitive configuration
- Regularly review and rotate service account keys
- Consider restricting service account permissions to only the necessary Google Sheets API scope