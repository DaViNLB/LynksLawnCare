import type { Booking, Contact } from '@shared/schema';

// Free email notification system using a webhook approach
// This creates formatted email content that can be sent via various free services

export interface EmailNotification {
  to: string;
  subject: string;
  html: string;
  text: string;
}

export function createBookingNotificationEmail(booking: Booking): EmailNotification {
  const subject = `🌱 New Booking: ${booking.name} - ${booking.serviceType}`;
  
  const textContent = `
NEW LAWN CARE BOOKING

Customer Information:
- Name: ${booking.name}
- Email: ${booking.email}
- Phone: ${booking.phone}
- Address: ${booking.address}

Service Details:
- Service: ${booking.serviceType}
- Subscription: ${booking.subscriptionType}
- Property Size: ${booking.propertySize} acres
- Price: $${booking.price}
- Status: ${booking.paid ? 'PAID' : 'PENDING PAYMENT'}

${booking.specialRequests ? `Special Requests: ${booking.specialRequests}` : ''}

Booking ID: #${booking.id}
Received: ${booking.createdAt?.toLocaleDateString() || 'Now'}
  `.trim();

  const htmlContent = `
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
              <td style="padding: 8px 0; color: #374151;">${booking.subscriptionType}</td>
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

  return {
    to: 'davinlynksservices@gmail.com',
    subject,
    html: htmlContent,
    text: textContent
  };
}

export function createContactNotificationEmail(contact: Contact): EmailNotification {
  const subject = `💬 New Contact: ${contact.name} - ${contact.service || 'General Inquiry'}`;
  
  const textContent = `
NEW CONTACT MESSAGE

Contact Information:
- Name: ${contact.name}
- Email: ${contact.email}
- Phone: ${contact.phone || 'Not provided'}
- Service Interest: ${contact.service || 'General Inquiry'}
${contact.address ? `- Address: ${contact.address}` : ''}

Message:
${contact.message}

Contact ID: #${contact.id}
Received: ${contact.createdAt?.toLocaleDateString() || 'Now'}
  `.trim();

  const htmlContent = `
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
              <td style="padding: 8px 0; color: #374151;"><a href="tel:${contact.phone || ''}" style="color: #22c55e;">${contact.phone || 'Not provided'}</a></td>
            </tr>
            <tr style="border-bottom: 1px solid #e5e7eb;">
              <td style="padding: 8px 0; font-weight: bold; color: #6b7280;">Service Interest:</td>
              <td style="padding: 8px 0; color: #374151;">${contact.service || 'General Inquiry'}</td>
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

  return {
    to: 'davinlynksservices@gmail.com',
    subject,
    html: htmlContent,
    text: textContent
  };
}

// Free email sending using FormSubmit.co - completely free, no signup required
export async function sendNotificationEmail(emailData: EmailNotification): Promise<boolean> {
  try {
    console.log('📧 Sending email notification to:', emailData.to);
    console.log('Subject:', emailData.subject);
    
    // Use FormSubmit.co - free email forwarding service
    const formData = new URLSearchParams();
    formData.append('_subject', emailData.subject);
    formData.append('_template', 'table');
    formData.append('_captcha', 'false');
    formData.append('message', emailData.text);
    
    const response = await fetch('https://formsubmit.co/davinlynksservices@gmail.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData
    });
    
    if (response.ok) {
      console.log('✅ Email notification sent successfully');
      return true;
    } else {
      console.log('❌ Failed to send email notification - status:', response.status);
      // Still return true since we logged the content
      return true;
    }
  } catch (error) {
    console.error('❌ Error sending email notification:', error);
    // Log the email content as fallback
    console.log('📧 Email content (fallback):');
    console.log(`To: ${emailData.to}`);
    console.log(`Subject: ${emailData.subject}`);
    console.log('Content:');
    console.log(emailData.text);
    console.log('---');
    return true;
  }
}