// SendGrid API configuration
const SENDGRID_API_URL = 'https://api.sendgrid.com/v3/mail/send';
const SENDGRID_API_KEY = import.meta.env.VITE_SENDGRID_API_KEY;
const TEMPLATE_ID = import.meta.env.VITE_SENDGRID_TEMPLATE_ID;

interface NewCustomerEmailData {
  businessEmail: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  numberOfDogs: number;
  serviceType: string;
  quoteTotal: number;
  businessName: string;
}

export const sendNewCustomerNotification = async (data: NewCustomerEmailData) => {
  try {
    const response = await fetch(SENDGRID_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        template_id: TEMPLATE_ID,
        personalizations: [{
          to: [{ email: data.businessEmail }],
          dynamic_template_data: {
            business_name: data.businessName,
            customer_name: data.customerName,
            customer_email: data.customerEmail,
            customer_phone: data.customerPhone,
            number_of_dogs: data.numberOfDogs,
            service_type: data.serviceType,
            quote_total: data.quoteTotal.toFixed(2),
            year: new Date().getFullYear()
          }
        }],
        from: {
          email: 'contact@tryscoopify.com',
          name: 'Scoopify✨'
        }
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('SendGrid API error:', errorData);
      throw new Error('Failed to send email notification');
    }

    console.log('New customer notification email sent successfully');
  } catch (error) {
    console.error('Error sending notification email:', error);
    throw error;
  }
};