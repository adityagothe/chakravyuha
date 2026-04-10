'use client';

import React, { useState, useEffect, useRef } from 'react';
import { STATES_MAP, GLOBAL_CITY } from '@/data/local-growth/cities';
import { CityData } from '@/types/local-growth';
import { cn } from '@/lib/utils';

interface CityAutocompleteProps {
  onSelect: (city: CityData) => void;
  placeholder: string;
  disabled?: boolean;
  /** Called when user picks a state but before a district is chosen */
  onStateSelected?: (state: string) => void;
}

export function CityAutocomplete({ onSelect, placeholder, disabled, onStateSelected }: CityAutocompleteProps) {
  const [selectedState, setSelectedState] = useState<string>('');
  
  const [stateOpen, setStateOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  
  const stateRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) setStateOpen(false);
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) setDistrictOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const activeStateObj = STATES_MAP.find(s => s.state === selectedState);
  const districts = activeStateObj ? activeStateObj.districts : [];

  return (
    <div className="w-full flex flex-col gap-4">
      {/* State Selection */}
      <div ref={stateRef} className="relative w-full">
        <button
          type="button"
          onClick={() => !disabled && setStateOpen(!stateOpen)}
          disabled={disabled}
          className={cn(
            'w-full flex items-center justify-between gap-3 bg-surface-container-lowest border rounded px-4 py-4 transition-all duration-200 text-left',
            stateOpen ? 'border-primary/50 ring-1 ring-primary/20' : 'border-outline-variant/20',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl shrink-0">map</span>
            <span className={cn('block truncate font-body text-base', !selectedState ? 'text-on-surface-variant/40' : 'text-on-surface')}>
              {selectedState || 'Select your State / Region'}
            </span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant/60">arrow_drop_down</span>
        </button>

        {stateOpen && (
          <ul className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/20 rounded shadow-xl max-h-60 overflow-y-auto w-full">
            <li
              className="px-4 py-3 cursor-pointer text-sm font-body border-b border-surface-container transition-colors last:border-0 hover:bg-surface-container-highest text-primary font-bold"
              onClick={() => {
                onSelect(GLOBAL_CITY);
                setStateOpen(false);
              }}
            >
              {GLOBAL_CITY.name}
            </li>
            {STATES_MAP.map((st) => (
              <li
                key={st.state}
                className={cn(
                  'px-4 py-3 cursor-pointer text-sm font-body border-b border-surface-container transition-colors last:border-0 hover:bg-surface-container-highest',
                  selectedState === st.state ? 'bg-surface-container-highest text-primary' : 'text-on-surface'
                )}
                onClick={() => {
                  setSelectedState(st.state);
                  setStateOpen(false);
                  setDistrictOpen(true);
                  onStateSelected?.(st.state);
                }}
              >
                {st.state}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* District Selection */}
      <div ref={districtRef} className="relative w-full">
        <button
          type="button"
          onClick={() => !disabled && selectedState && setDistrictOpen(!districtOpen)}
          disabled={disabled || !selectedState}
          className={cn(
            'w-full flex items-center justify-between gap-3 bg-surface-container-lowest border rounded px-4 py-4 transition-all duration-200 text-left',
            districtOpen ? 'border-primary/50 ring-1 ring-primary/20' : 'border-outline-variant/20',
            (disabled || !selectedState) && 'opacity-50 cursor-not-allowed'
          )}
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary text-xl shrink-0">location_city</span>
            <span className="block truncate font-body text-on-surface-variant/40 text-base">
              {placeholder || 'Select District / City'}
            </span>
          </div>
          <span className="material-symbols-outlined text-on-surface-variant/60">arrow_drop_down</span>
        </button>

        {districtOpen && districts.length > 0 && (
          <ul className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/20 rounded shadow-xl max-h-60 overflow-y-auto w-full">
            {districts.map((city) => (
              <li
                key={city.name}
                className="px-4 py-3 cursor-pointer text-sm font-body border-b border-surface-container transition-colors last:border-0 hover:bg-surface-container-highest text-on-surface"
                onClick={() => {
                  onSelect(city);
                  setDistrictOpen(false);
                }}
              >
                {city.name}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
