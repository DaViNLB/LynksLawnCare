import { google } from 'googleapis';
import type { Booking, Contact } from '@shared/schema';

// Gmail service setup
export async function initializeGmailService() {
  try {
    const credentials = process.env.GOOGLE_SERVICE_ACCOUNT_JSON 
      ? JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_JSON)
      : require(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_FILE || '');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ['https://www.googleapis.com/auth/gmail.send']
    });

    return google.gmail({ version: 'v1', auth });
  } catch (error) {
    console.error('Failed to initialize Gmail service:', error);
    throw error;
  }
}

function createEmailContent(to: string, subject: string, htmlBody: string): string {
  const email = [
    `To: ${to}`,
    `Subject: ${subject}`,
    'Content-Type: text/html; charset=utf-8',
    '',
    htmlBody
  ].join('\n');

  return Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
}

export async function sendBookingNotification(booking: Booking): Promise<boolean> {
  try {
    const gmail = await initializeGmailService();
    const businessEmail = 'davinlynksservices@gmail.com';

    const subject = `New Booking: ${booking.name} - ${booking.serviceType}`;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #22c55e; margin-bottom: 20px; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
            🌱 New Lawn Care Booking
          </h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 15px;">Customer Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280; width: 30%;">Name:</td>
                <td style="padding: 8px 0; color: #374151;">${booking.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Email:</td>
                <td style="padding: 8px 0; color: #374151;"><a href="mailto:${booking.email}" style="color: #22c55e;">${booking.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Phone:</td>
                <td style="padding: 8px 0; color: #374151;"><a href="tel:${booking.phone}" style="color: #22c55e;">${booking.phone}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Address:</td>
                <td style="padding: 8px 0; color: #374151;">${booking.address}</td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 15px;">Service Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280; width: 30%;">Service:</td>
                <td style="padding: 8px 0; color: #374151;">${booking.serviceType}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Subscription:</td>
                <td style="padding: 8px 0; color: #374151;">${booking.subscription}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Property Size:</td>
                <td style="padding: 8px 0; color: #374151;">${booking.propertySize} acres</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Price:</td>
                <td style="padding: 8px 0; color: #374151; font-size: 18px; font-weight: bold;">$${booking.price}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Status:</td>
                <td style="padding: 8px 0;">
                  <span style="background-color: ${booking.paid ? '#dcfce7' : '#fef3c7'}; color: ${booking.paid ? '#166534' : '#92400e'}; padding: 4px 8px; border-radius: 4px; font-size: 12px; font-weight: bold;">
                    ${booking.paid ? 'PAID' : 'PENDING PAYMENT'}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          ${booking.specialRequests ? `
            <div style="margin-bottom: 20px;">
              <h3 style="color: #374151; margin-bottom: 10px;">Special Requests</h3>
              <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #22c55e;">
                <p style="margin: 0; color: #374151; line-height: 1.5;">${booking.specialRequests}</p>
              </div>
            </div>
          ` : ''}

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              Booking ID: #${booking.id} | Received: ${booking.createdAt?.toLocaleDateString() || 'Now'}
            </p>
          </div>
        </div>
      </div>
    `;

    const encodedMessage = createEmailContent(businessEmail, subject, htmlBody);

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    console.log(`✅ Booking notification email sent for customer: ${booking.name}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending booking notification email:', error);
    return false;
  }
}

export async function sendContactNotification(contact: Contact): Promise<boolean> {
  try {
    const gmail = await initializeGmailService();
    const businessEmail = 'davinlynksservices@gmail.com';

    const subject = `New Contact Message: ${contact.name} - ${contact.serviceInterest}`;
    
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
        <div style="background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #22c55e; margin-bottom: 20px; border-bottom: 2px solid #22c55e; padding-bottom: 10px;">
            💬 New Contact Message
          </h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 15px;">Contact Information</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280; width: 30%;">Name:</td>
                <td style="padding: 8px 0; color: #374151;">${contact.name}</td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Email:</td>
                <td style="padding: 8px 0; color: #374151;"><a href="mailto:${contact.email}" style="color: #22c55e;">${contact.email}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Phone:</td>
                <td style="padding: 8px 0; color: #374151;"><a href="tel:${contact.phone}" style="color: #22c55e;">${contact.phone}</a></td>
              </tr>
              <tr style="border-bottom: 1px solid #e5e7eb;">
                <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Service Interest:</td>
                <td style="padding: 8px 0; color: #374151;">${contact.serviceInterest}</td>
              </tr>
              ${contact.address ? `
                <tr style="border-bottom: 1px solid #e5e7eb;">
                  <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Address:</td>
                  <td style="padding: 8px 0; color: #374151;">${contact.address}</td>
                </tr>
              ` : ''}
            </table>
          </div>

          <div style="margin-bottom: 20px;">
            <h3 style="color: #374151; margin-bottom: 10px;">Message</h3>
            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 6px; border-left: 4px solid #22c55e;">
              <p style="margin: 0; color: #374151; line-height: 1.5;">${contact.message}</p>
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center;">
            <p style="color: #6b7280; margin: 0; font-size: 14px;">
              Contact ID: #${contact.id} | Received: ${contact.createdAt?.toLocaleDateString() || 'Now'}
            </p>
          </div>
        </div>
      </div>
    `;

    const encodedMessage = createEmailContent(businessEmail, subject, htmlBody);

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage
      }
    });

    console.log(`✅ Contact notification email sent for: ${contact.name}`);
    return true;
  } catch (error) {
    console.error('❌ Error sending contact notification email:', error);
    return false;
  }
}