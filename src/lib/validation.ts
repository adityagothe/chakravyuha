import { ContactFormData, ContactFormErrors } from '@/types/local-growth';

export function validateContactForm(data: ContactFormData): ContactFormErrors {
  const errors: ContactFormErrors = {};

  if (!data.name.trim()) {
    errors.name = 'Name is required.';
  } else if (data.name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters.';
  }

  if (!data.email.trim()) {
    errors.email = 'Email is required.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.phone.trim()) {
    errors.phone = 'Phone number is required.';
  } else if (!/^[6-9]\d{9}$/.test(data.phone.replace(/[\s\-]/g, ''))) {
    errors.phone = 'Enter a valid 10-digit Indian mobile number.';
  }

  if (!data.message.trim()) {
    errors.message = 'Message is required.';
  } else if (data.message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters.';
  }

  return errors;
}

export function isFormValid(errors: ContactFormErrors): boolean {
  return Object.keys(errors).length === 0;
}

export function validateField(field: keyof ContactFormData, value: string): string | undefined {
  const partial = { name: '', email: '', phone: '', message: '', [field]: value };
  const errors = validateContactForm(partial as ContactFormData);
  return errors[field];
}
