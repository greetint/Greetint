'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface LogoProps {
  variant?: 'horizontal' | 'vertical' | 'icon-only' | 'text-only';
  className?: string;
  height?: number;
}

export default function Logo({ variant = 'horizontal', className = '', height = 36 }: LogoProps) {
  const [imageError, setImageError] = useState(false);

  const logos = {
    'horizontal': { src: '/images/logo/logo-horizontal.png', alt: 'Greetint Logo', aspect: 2.2 },
    'vertical': { src: '/images/logo/logo-vertical.png', alt: 'Greetint Vertical Logo', aspect: 1 },
    'icon-only': { src: '/images/logo/logo-g.png', alt: 'Greetint G Monogram', aspect: 1 },
    'text-only': { src: '/images/logo/logo-text.png', alt: 'Greetint Text', aspect: 2.5 },
  };

  const selected = logos[variant] || logos['horizontal'];

  if (imageError) {
    return (
      <span className={`font-serif tracking-widest font-bold text-[#1F1A17] uppercase ${className}`} style={{ fontSize: `${height * 0.5}px` }}>
        GREETINT
      </span>
    );
  }

  return (
    <div className={`inline-flex items-center justify-center ${className}`}>
      <Image
        src={selected.src}
        alt={selected.alt}
        width={Math.round(height * selected.aspect)}
        height={height}
        priority
        onError={() => setImageError(true)}
        className="object-contain"
      />
    </div>
  );
}