'use client';

import React, { useState, useEffect, useRef } from 'react';
import { INDIAN_CITIES } from '@/data/local-growth/cities';
import { CityData } from '@/types/local-growth';
import { cn } from '@/lib/utils';

interface CityAutocompleteProps {
  onSelect: (city: CityData) => void;
  placeholder: string;
  disabled?: boolean;
}

export function CityAutocomplete({ onSelect, placeholder, disabled }: CityAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(0);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const filtered = INDIAN_CITIES.filter(city => 
    city.name.toLowerCase().includes(query.toLowerCase()) || 
    city.state.toLowerCase().includes(query.toLowerCase())
  ).slice(0, 8); // Show max 8 suggestions

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'ArrowDown' || e.key === 'Enter') setIsOpen(true);
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filtered[activeIdx]) {
        onSelect(filtered[activeIdx]);
        setQuery(filtered[activeIdx].name);
        setIsOpen(false);
      }
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    }
  };

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className={cn(
        'flex items-center gap-3 bg-surface-container-lowest border rounded px-4 py-4 transition-all duration-200',
        'focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/20',
        'border-outline-variant/20'
      )}>
        <span className="material-symbols-outlined text-primary text-xl shrink-0">location_on</span>
        <input
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setActiveIdx(0);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          className="flex-1 bg-transparent font-body text-on-surface placeholder:text-on-surface-variant/40 outline-none text-base disabled:opacity-50"
          aria-label="Search city"
        />
        {query && !disabled && (
          <button onClick={() => { setQuery(''); setIsOpen(true); }} className="text-on-surface-variant/40 hover:text-on-surface-variant transition-colors">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        )}
      </div>

      {isOpen && filtered.length > 0 && !disabled && (
        <ul className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/20 rounded shadow-xl max-h-60 overflow-y-auto w-full">
          {filtered.map((city, idx) => (
            <li
              key={city.name}
              className={cn(
                'px-4 py-3 cursor-pointer text-sm font-body border-b border-surface-container transition-colors last:border-0 hover:bg-surface-container-highest',
                idx === activeIdx ? 'bg-surface-container-highest text-primary' : 'text-on-surface'
              )}
              onMouseEnter={() => setActiveIdx(idx)}
              onClick={() => {
                onSelect(city);
                setQuery(city.name);
                setIsOpen(false);
              }}
            >
              <div className="font-medium">{city.name}</div>
              <div className="text-xs text-on-surface-variant/60">{city.state}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
