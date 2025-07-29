// Static mode configuration for GitHub Pages deployment
export const isStaticMode = import.meta.env.MODE === 'production' && !import.meta.env.VITE_API_URL;

export const FORMSUBMIT_ENDPOINTS = {
  contact: 'https://formsubmit.co/davinlynksservices@gmail.com',
  booking: 'https://formsubmit.co/davinlynksservices@gmail.com'
};

// Mock API functions for static deployment
export async function staticApiRequest(method: string, endpoint: string, data?: any) {
  if (endpoint.includes('contacts')) {
    // Submit contact form via FormSubmit
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = FORMSUBMIT_ENDPOINTS.contact;
    form.style.display = 'none';
    
    // Add form data
    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });
    
    // Add FormSubmit configuration
    const configInputs = [
      { name: '_subject', value: `💬 New Contact: ${data.name} - ${data.service}` },
      { name: '_captcha', value: 'false' },
      { name: '_template', value: 'table' }
    ];
    
    configInputs.forEach(({ name, value }) => {
      const input = document.createElement('input');
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
    
    return { json: () => Promise.resolve({ id: Date.now().toString() }) };
  }
  
  if (endpoint.includes('bookings')) {
    // Submit booking form via FormSubmit
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = FORMSUBMIT_ENDPOINTS.booking;
    form.style.display = 'none';
    
    // Add form data
    Object.entries(data).forEach(([key, value]) => {
      const input = document.createElement('input');
      input.name = key;
      input.value = String(value);
      form.appendChild(input);
    });
    
    // Add FormSubmit configuration
    const configInputs = [
      { name: '_subject', value: `🏡 New Booking: ${data.name} - ${data.serviceType}` },
      { name: '_captcha', value: 'false' },
      { name: '_template', value: 'table' }
    ];
    
    configInputs.forEach(({ name, value }) => {
      const input = document.createElement('input');
      input.name = name;
      input.value = value;
      form.appendChild(input);
    });
    
    document.body.appendChild(form);
    form.submit();
    
    return { json: () => Promise.resolve({ id: Date.now().toString() }) };
  }
  
  return { json: () => Promise.resolve({}) };
}