'use client';

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { STATES_MAP, GLOBAL_CITY } from '@/data/local-growth/cities';
import { CityData } from '@/types/local-growth';
import { cn } from '@/lib/utils';

interface CityAutocompleteProps {
  onSelect: (city: CityData) => void;
  placeholder: string;
  disabled?: boolean;
  onStateSelected?: (state: string) => void;
}

export function CityAutocomplete({ onSelect, placeholder, disabled, onStateSelected }: CityAutocompleteProps) {
  const [selectedState, setSelectedState] = useState<string>('');
  const [stateOpen, setStateOpen] = useState(false);
  const [districtOpen, setDistrictOpen] = useState(false);
  const [stateFilter, setStateFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const stateRef = useRef<HTMLDivElement>(null);
  const districtRef = useRef<HTMLDivElement>(null);
  const stateInputRef = useRef<HTMLInputElement>(null);
  const districtInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stateRef.current && !stateRef.current.contains(event.target as Node)) {
        setStateOpen(false);
        setStateFilter('');
      }
      if (districtRef.current && !districtRef.current.contains(event.target as Node)) {
        setDistrictOpen(false);
        setDistrictFilter('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (stateOpen) setTimeout(() => stateInputRef.current?.focus(), 30);
  }, [stateOpen]);

  useEffect(() => {
    if (districtOpen) setTimeout(() => districtInputRef.current?.focus(), 30);
  }, [districtOpen]);

  const activeStateObj = useMemo(() => STATES_MAP.find(s => s.state === selectedState), [selectedState]);
  const districts = useMemo(() => activeStateObj ? activeStateObj.districts : [], [activeStateObj]);

  const filteredStates = useMemo(() => {
    if (!stateFilter.trim()) return STATES_MAP;
    const q = stateFilter.toLowerCase();
    return STATES_MAP.filter(s => s.state.toLowerCase().includes(q));
  }, [stateFilter]);

  const filteredDistricts = useMemo(() => {
    if (!districtFilter.trim()) return districts;
    const q = districtFilter.toLowerCase();
    return districts.filter(c => c.name.toLowerCase().includes(q));
  }, [districtFilter, districts]);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* ── State Selection ── */}
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
              {selectedState || 'Select your State / UT'}
            </span>
          </div>
          <div className="flex items-center gap-1">
            {selectedState && (
              <span className="text-[10px] font-label text-on-surface-variant/40 uppercase tracking-wider mr-1">
                {activeStateObj?.districts.length} districts
              </span>
            )}
            <span className={cn(
              'material-symbols-outlined text-on-surface-variant/60 transition-transform duration-200',
              stateOpen && 'rotate-180'
            )}>arrow_drop_down</span>
          </div>
        </button>

        {stateOpen && (
          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/20 rounded-lg shadow-2xl overflow-hidden">
            {/* Search box inside dropdown */}
            <div className="px-3 py-2 border-b border-outline-variant/10 sticky top-0 bg-surface-container-high">
              <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 rounded px-3 py-2">
                <span className="material-symbols-outlined text-on-surface-variant/40 text-base">search</span>
                <input
                  ref={stateInputRef}
                  type="text"
                  value={stateFilter}
                  onChange={e => setStateFilter(e.target.value)}
                  placeholder="Search state or UT..."
                  className="flex-1 bg-transparent font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none"
                />
              </div>
            </div>
            <ul className="max-h-52 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              {/* Global option */}
              <li
                className="px-4 py-3 cursor-pointer text-sm font-body border-b border-surface-container transition-colors hover:bg-surface-container-highest text-primary font-bold flex items-center justify-between"
                onClick={() => { onSelect(GLOBAL_CITY); setStateOpen(false); setStateFilter(''); }}
              >
                <span>{GLOBAL_CITY.name}</span>
                <span className="text-[10px] text-on-surface-variant/40">Worldwide</span>
              </li>
              {filteredStates.length === 0 ? (
                <li className="px-4 py-3 text-sm text-on-surface-variant/50 italic">No states found</li>
              ) : filteredStates.map(st => (
                <li
                  key={st.state}
                  className={cn(
                    'px-4 py-3 cursor-pointer text-sm font-body border-b border-surface-container transition-colors last:border-0 hover:bg-surface-container-highest flex items-center justify-between',
                    selectedState === st.state ? 'bg-surface-container-highest text-primary' : 'text-on-surface'
                  )}
                  onClick={() => {
                    setSelectedState(st.state);
                    setStateOpen(false);
                    setStateFilter('');
                    setDistrictFilter('');
                    setDistrictOpen(true);
                    onStateSelected?.(st.state);
                  }}
                >
                  <span>{st.state}</span>
                  <span className="text-[10px] text-on-surface-variant/40 shrink-0 ml-2">{st.districts.length}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* ── District Selection ── */}
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
          <span className={cn(
            'material-symbols-outlined text-on-surface-variant/60 transition-transform duration-200',
            districtOpen && 'rotate-180'
          )}>arrow_drop_down</span>
        </button>

        {districtOpen && filteredDistricts.length > 0 && (
          <div className="absolute z-50 top-full left-0 right-0 mt-2 bg-surface-container-high border border-outline-variant/20 rounded-lg shadow-2xl overflow-hidden">
            <div className="px-3 py-2 border-b border-outline-variant/10 sticky top-0 bg-surface-container-high">
              <div className="flex items-center gap-2 bg-surface-container-lowest border border-outline-variant/20 rounded px-3 py-2">
                <span className="material-symbols-outlined text-on-surface-variant/40 text-base">search</span>
                <input
                  ref={districtInputRef}
                  type="text"
                  value={districtFilter}
                  onChange={e => setDistrictFilter(e.target.value)}
                  placeholder={`Search in ${selectedState}...`}
                  className="flex-1 bg-transparent font-body text-sm text-on-surface placeholder:text-on-surface-variant/40 outline-none"
                />
              </div>
            </div>
            <ul className="max-h-52 overflow-y-auto" style={{ scrollbarWidth: 'thin' }}>
              {filteredDistricts.length === 0 ? (
                <li className="px-4 py-3 text-sm text-on-surface-variant/50 italic">No districts found</li>
              ) : filteredDistricts.map(city => (
                <li
                  key={city.name}
                  className="px-4 py-3 cursor-pointer text-sm font-body border-b border-surface-container transition-colors last:border-0 hover:bg-surface-container-highest text-on-surface"
                  onClick={() => {
                    onSelect(city);
                    setDistrictOpen(false);
                    setDistrictFilter('');
                  }}
                >
                  {city.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}
