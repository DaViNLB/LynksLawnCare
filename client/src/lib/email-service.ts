// Free email service using EmailJS - completely free solution
// This sends emails directly from the client side to your business email

interface EmailNotification {
  to: string;
  subject: string;
  message: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  notificationType: 'booking' | 'contact';
}

export async function sendEmailNotification(data: EmailNotification): Promise<boolean> {
  try {
    // We'll use a simple webhook service like FormSubmit or EmailJS
    // For now, we'll use a direct form submission approach
    
    const emailContent = `
      ${data.subject}
      
      From: ${data.customerName} (${data.customerEmail})
      ${data.customerPhone ? `Phone: ${data.customerPhone}` : ''}
      
      ${data.message}
    `;

    console.log('📧 Email notification prepared:');
    console.log(emailContent);
    
    // Use FormSubmit.co - completely free, no signup required
    const formData = new FormData();
    formData.append('name', data.customerName);
    formData.append('email', data.customerEmail);
    formData.append('phone', data.customerPhone || '');
    formData.append('subject', data.subject);
    formData.append('message', data.message);
    
    // FormSubmit.co endpoint - replace with your business email
    const response = await fetch('https://formsubmit.co/davinlynksservices@gmail.com', {
      method: 'POST',
      body: formData
    });
    
    if (response.ok) {
      console.log('✅ Email notification sent successfully');
      return true;
    } else {
      console.error('❌ Failed to send email notification');
      return false;
    }
  } catch (error) {
    console.error('❌ Error sending email notification:', error);
    return false;
  }
}

export function createBookingEmailData(booking: any): EmailNotification {
  const message = `
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
  `.trim();

  return {
    to: 'davinlynksservices@gmail.com',
    subject: `🌱 New Booking: ${booking.name} - ${booking.serviceType}`,
    message,
    customerName: booking.name,
    customerEmail: booking.email,
    customerPhone: booking.phone,
    notificationType: 'booking'
  };
}

export function createContactEmailData(contact: any): EmailNotification {
  const message = `
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
  `.trim();

  return {
    to: 'davinlynksservices@gmail.com',
    subject: `💬 New Contact: ${contact.name} - ${contact.service || 'General Inquiry'}`,
    message,
    customerName: contact.name,
    customerEmail: contact.email,
    customerPhone: contact.phone,
    notificationType: 'contact'
  };
}