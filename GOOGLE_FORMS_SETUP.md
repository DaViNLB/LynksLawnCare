# Google Forms Integration Setup

## Contact Form Integration

To connect your contact form to Google Forms:

1. Create a new Google Form at https://forms.google.com
2. Add these fields to your form:
   - Name (Short answer)
   - Email (Short answer) 
   - Phone (Short answer)
   - Service (Multiple choice)
   - Message (Paragraph)

3. Get the form URL and replace `YOUR_GOOGLE_FORM_ID` in `client/src/components/ui/contact.tsx`
4. Get field entry IDs by inspecting the form source and replace the entry numbers in the code

## Booking Form Integration

1. Create another Google Form for bookings with these fields:
   - Name (Short answer)
   - Email (Short answer)
   - Phone (Short answer) 
   - Address (Short answer)
   - Service Type (Multiple choice)
   - Subscription Type (Multiple choice)
   - Property Size (Number)
   - Price (Number)
   - Special Requests (Paragraph)

2. Replace `YOUR_BOOKING_GOOGLE_FORM_ID` in `client/src/components/ui/booking.tsx`
3. Update the entry field IDs in the booking form submission code

## Google Sheets Integration

Both forms will automatically save responses to Google Sheets. You can:
1. View responses in the form's response tab
2. Create a linked Google Sheet for better data management
3. Set up email notifications for new responses

## Email Notifications

The current setup sends console log notifications. For real email notifications, integrate with:
- SendGrid
- Mailgun
- NodeMailer with SMTP
- Zapier webhooks