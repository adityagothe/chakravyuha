'use client';

import React from 'react';
import { LGContent } from '@/types/local-growth';
import { SectionWrapper } from '../ui/SectionWrapper';
import { Container } from '../ui/Container';
import { FadeIn } from '../ui/FadeIn';
import { GradientButton } from '../ui/GradientButton';
import { InputField } from '../ui/InputField';
import { TextArea } from '../ui/TextArea';
import { useContactForm } from '@/hooks/useContactForm';
import { cn } from '@/lib/utils';

interface Props { content: LGContent['contact']; }

const WHATSAPP_NUMBER = '917869281508';

export function LGContactSection({ content }: Props) {
  const { formData, errors, status, handleChange, handleBlur, handleSubmit, reset } = useContactForm();

  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(`Hello! I found you through Vajravyuha Local Growth and I'd like to know more about growing my business.`)}`;

  return (
    <SectionWrapper id="contact">
      <Container>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          {/* Left: Heading + WhatsApp */}
          <div className="lg:col-span-4">
            <FadeIn delay={0}>
              <span className="font-label text-primary text-xs font-bold uppercase tracking-[0.3em] mb-4 block">{content.label}</span>
            </FadeIn>
            <FadeIn delay={150}>
              <h2 className="font-headline text-4xl sm:text-5xl leading-tight mb-6">{content.title}</h2>
            </FadeIn>
            <FadeIn delay={300}>
              <p className="font-body text-on-surface-variant text-lg leading-relaxed mb-10">{content.subtitle}</p>
            </FadeIn>
            <FadeIn delay={450}>
              <div className="flex flex-col gap-4">
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-3 px-6 py-3.5 bg-[#25D366]/10 border border-[#25D366]/30 text-[#25D366] rounded font-label font-bold text-sm uppercase tracking-widest hover:bg-[#25D366]/20 hover:border-[#25D366]/60 transition-all duration-200 active:scale-95"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                  </svg>
                  {content.whatsappText}
                </a>
                <div className="flex items-center gap-4">
                  <div className="flex-1 h-px bg-outline-variant/20" />
                  <span className="font-label text-xs text-on-surface-variant/50 uppercase tracking-widest">{content.orText}</span>
                  <div className="flex-1 h-px bg-outline-variant/20" />
                </div>
              </div>
            </FadeIn>
          </div>

          {/* Right: Form */}
          <FadeIn delay={200} direction="left" className="lg:col-span-8">
            {/* Success state */}
            {status === 'success' ? (
              <div className="p-10 md:p-12 bg-surface-container-low border border-primary/20 rounded-xl text-center space-y-4">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
                  <span className="material-symbols-outlined text-primary text-3xl" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
                </div>
                <h3 className="font-headline text-2xl text-primary">{content.successTitle}</h3>
                <p className="font-body text-on-surface-variant leading-relaxed max-w-md mx-auto">{content.successMessage}</p>
                <button
                  onClick={reset}
                  className="font-label text-xs uppercase tracking-widest text-on-surface-variant hover:text-primary transition-colors mt-4 inline-flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">refresh</span>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate className="space-y-6 bg-surface-container-low border border-outline-variant/10 rounded-xl p-8 md:p-10">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <InputField
                    label={content.fields.name}
                    placeholder={content.placeholders.name}
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    onBlur={() => handleBlur('name')}
                    error={errors.name}
                    required
                    disabled={status === 'submitting'}
                  />
                  <InputField
                    label={content.fields.email}
                    type="email"
                    placeholder={content.placeholders.email}
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    onBlur={() => handleBlur('email')}
                    error={errors.email}
                    required
                    disabled={status === 'submitting'}
                  />
                </div>
                <InputField
                  label={content.fields.phone}
                  type="tel"
                  placeholder={content.placeholders.phone}
                  value={formData.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  onBlur={() => handleBlur('phone')}
                  error={errors.phone}
                  required
                  disabled={status === 'submitting'}
                />
                <TextArea
                  label={content.fields.message}
                  placeholder={content.placeholders.message}
                  value={formData.message}
                  onChange={(e) => handleChange('message', e.target.value)}
                  onBlur={() => handleBlur('message')}
                  error={errors.message}
                  required
                  rows={5}
                  disabled={status === 'submitting'}
                />

                {status === 'error' && (
                  <p className="font-body text-sm text-error flex items-center gap-2">
                    <span className="material-symbols-outlined text-base">error</span>
                    {content.errorMessage}
                  </p>
                )}

                <GradientButton
                  label={status === 'submitting' ? content.submittingText : content.submitText}
                  type="submit"
                  disabled={status === 'submitting'}
                  className={cn(
                    'w-full sm:w-auto flex items-center justify-center gap-2',
                    status === 'submitting' && 'opacity-70 cursor-not-allowed'
                  )}
                />
              </form>
            )}
          </FadeIn>
        </div>
      </Container>
    </SectionWrapper>
  );
}
