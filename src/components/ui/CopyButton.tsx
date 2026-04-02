'use client';

import { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';

interface CopyButtonProps {
  value: string;
}

export function CopyButton({ value }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 hover:bg-primary/10 rounded transition-colors"
      title="Copy to clipboard"
      aria-label="Copy to clipboard"
    >
      <MaterialIcon 
        name={copied ? 'check' : 'content_copy'} 
        size="sm" 
        className={copied ? 'text-green-500' : 'text-primary'}
      />
    </button>
  );
}
