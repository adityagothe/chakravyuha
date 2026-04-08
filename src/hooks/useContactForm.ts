'use client';

import { useState, useCallback } from 'react';
import { ContactFormData, ContactFormErrors, ContactFormStatus } from '@/types/local-growth';
import { validateContactForm, validateField, isFormValid } from '@/lib/validation';
import { submitContactForm } from '@/lib/contact';

const INITIAL_DATA: ContactFormData = { name: '', email: '', phone: '', message: '' };

export function useContactForm() {
  const [formData, setFormData] = useState<ContactFormData>(INITIAL_DATA);
  const [errors, setErrors] = useState<ContactFormErrors>({});
  const [status, setStatus] = useState<ContactFormStatus>('idle');

  const handleChange = useCallback((field: keyof ContactFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error on change
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }, [errors]);

  const handleBlur = useCallback((field: keyof ContactFormData) => {
    const fieldError = validateField(field, formData[field]);
    setErrors((prev) => ({ ...prev, [field]: fieldError }));
  }, [formData]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateContactForm(formData);
    setErrors(validationErrors);
    if (!isFormValid(validationErrors)) return;

    setStatus('submitting');
    const result = await submitContactForm(formData);
    if (result.success) {
      setStatus('success');
      setFormData(INITIAL_DATA);
    } else {
      setStatus('error');
    }
  }, [formData]);

  const reset = useCallback(() => {
    setFormData(INITIAL_DATA);
    setErrors({});
    setStatus('idle');
  }, []);

  return { formData, errors, status, handleChange, handleBlur, handleSubmit, reset };
}
