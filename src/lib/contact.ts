import { ContactFormData } from '@/types/local-growth';

const WEB3FORMS_ACCESS_KEY = process.env.NEXT_PUBLIC_WEB3FORMS_KEY || '';

export async function submitContactForm(data: ContactFormData): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        access_key: WEB3FORMS_ACCESS_KEY,
        subject: `New Inquiry from ${data.name} — Chakravyuha Local Growth`,
        from_name: 'Chakravyuha Local Growth',
        name: data.name,
        email: data.email,
        phone: data.phone,
        message: data.message,
      }),
    });

    const result = await response.json();
    if (result.success) {
      return { success: true };
    }
    return { success: false, message: result.message || 'Submission failed.' };
  } catch {
    return { success: false, message: 'Network error. Please try again.' };
  }
}
