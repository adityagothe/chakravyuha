'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MaterialIcon } from '@/components/ui/MaterialIcon';
import { cn } from '@/lib/utils';

interface ImageViewerProps {
  src: string;
  alt: string;
  isOpen: boolean;
  onClose: () => void;
}

const MIN_ZOOM = 0.5;
const MAX_ZOOM = 5;
const ZOOM_STEP = 0.3;

export function ImageViewer({ src, alt, isOpen, onClose }: ImageViewerProps) {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [loaded, setLoaded] = useState(false);

  const dragStart = useRef<{ x: number; y: number } | null>(null);
  const panStart = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Pinch-to-zoom state
  const lastPinchDist = useRef<number | null>(null);

  // Reset on open/close
  useEffect(() => {
    if (isOpen) {
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setLoaded(false);
    }
  }, [isOpen]);

  // Keyboard shortcuts
  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === '=' || e.key === '+') zoomIn();
      if (e.key === '-') zoomOut();
      if (e.key === '0') reset();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, onClose]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

  const zoomIn = useCallback(() => setZoom(z => clampZoom(z + ZOOM_STEP)), []);
  const zoomOut = useCallback(() => setZoom(z => clampZoom(z - ZOOM_STEP)), []);
  const reset = useCallback(() => { setZoom(1); setPan({ x: 0, y: 0 }); }, []);

  // Mouse scroll to zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? ZOOM_STEP : -ZOOM_STEP;
    setZoom(z => clampZoom(z + delta));
  }, []);

  // Mouse drag to pan
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX, y: e.clientY };
    panStart.current = pan;
  }, [zoom, pan]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging || !dragStart.current) return;
    const dx = e.clientX - dragStart.current.x;
    const dy = e.clientY - dragStart.current.y;
    setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
  }, [isDragging]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  // Double-click to toggle 2x zoom
  const handleDoubleClick = useCallback(() => {
    if (zoom > 1) {
      reset();
    } else {
      setZoom(2);
    }
  }, [zoom, reset]);

  // Touch pinch-to-zoom
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastPinchDist.current = Math.hypot(dx, dy);
    } else if (e.touches.length === 1 && zoom > 1) {
      setIsDragging(true);
      dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      panStart.current = pan;
    }
  }, [zoom, pan]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 2 && lastPinchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const delta = (dist - lastPinchDist.current) * 0.01;
      setZoom(z => clampZoom(z + delta));
      lastPinchDist.current = dist;
    } else if (e.touches.length === 1 && isDragging && dragStart.current) {
      const dx = e.touches[0].clientX - dragStart.current.x;
      const dy = e.touches[0].clientY - dragStart.current.y;
      setPan({ x: panStart.current.x + dx, y: panStart.current.y + dy });
    }
  }, [isDragging]);

  const handleTouchEnd = useCallback(() => {
    lastPinchDist.current = null;
    setIsDragging(false);
    dragStart.current = null;
  }, []);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Full screen view of ${alt}`}
      className="fixed inset-0 z-[600] flex items-center justify-center bg-black/95 backdrop-blur-sm"
      onWheel={handleWheel}
    >
      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent pointer-events-none">
        <span className="font-label text-[9px] uppercase tracking-widest text-neutral-500">
          {alt}
        </span>
        <div className="flex items-center gap-3 pointer-events-auto">
          {/* Zoom level */}
          <span className="font-label text-[10px] text-neutral-400 tabular-nums">
            {Math.round(zoom * 100)}%
          </span>
          {/* Close */}
          <button
            id="image-viewer-close"
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center text-neutral-400 hover:text-white transition-colors"
            aria-label="Close image viewer"
          >
            <MaterialIcon name="close" size="md" />
          </button>
        </div>
      </div>

      {/* Main image area */}
      <div
        className={cn(
          'w-full h-full flex items-center justify-center overflow-hidden',
          isDragging ? 'cursor-grabbing' : zoom > 1 ? 'cursor-grab' : 'cursor-zoom-in'
        )}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onDoubleClick={handleDoubleClick}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          </div>
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          draggable={false}
          style={{
            transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
            transition: isDragging ? 'none' : 'transform 0.2s ease',
            maxWidth: '95vw',
            maxHeight: '90vh',
            objectFit: 'contain',
            userSelect: 'none',
            opacity: loaded ? 1 : 0,
          }}
        />
      </div>

      {/* Bottom controls */}
      <div className="absolute bottom-0 left-0 right-0 z-10 flex items-center justify-center gap-3 pb-5 bg-gradient-to-t from-black/70 to-transparent pt-8">
        <button
          id="image-viewer-zoom-out"
          onClick={zoomOut}
          disabled={zoom <= MIN_ZOOM}
          className="w-10 h-10 flex items-center justify-center border border-white/10 text-neutral-300 hover:text-white hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Zoom out"
        >
          <MaterialIcon name="remove" size="sm" />
        </button>
        <button
          id="image-viewer-reset"
          onClick={reset}
          className="px-4 h-10 flex items-center justify-center border border-white/10 font-label text-[9px] uppercase tracking-widest text-neutral-400 hover:text-white hover:border-white/30 transition-all"
          aria-label="Reset zoom"
        >
          Reset
        </button>
        <button
          id="image-viewer-zoom-in"
          onClick={zoomIn}
          disabled={zoom >= MAX_ZOOM}
          className="w-10 h-10 flex items-center justify-center border border-white/10 text-neutral-300 hover:text-white hover:border-white/30 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
          aria-label="Zoom in"
        >
          <MaterialIcon name="add" size="sm" />
        </button>
      </div>

      {/* Hint — only when at 1x */}
      {zoom === 1 && loaded && (
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 pointer-events-none">
          <p className="font-label text-[9px] uppercase tracking-widest text-neutral-600 text-center whitespace-nowrap">
            Scroll or pinch to zoom · Double-tap to zoom in
          </p>
        </div>
      )}
    </div>
  );
}
