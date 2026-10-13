import type React from 'react';

interface TintedDecoProps {
  src: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Decoration image displayed in its original colors.
 * The wrapper preserves the sizing and positioning used by existing callers.
 */
export function TintedDeco({ src, className = '', style }: TintedDecoProps) {
  if (!src) return null;
  return (
    <span
      className={`tinted-deco ${className}`}
      aria-hidden="true"
      style={style}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" className="tinted-deco__img" />
    </span>
  );
}
