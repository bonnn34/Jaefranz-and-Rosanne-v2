import React from 'react';
import './sunrise-sky.css';

// Watercolor sunrise behind the loader + envelope hero. The painting
// (public/backgrounds/sunrise-watercolor.webp) is the base; the sunlight on top
// is animated: dawn brightening, a breathing glow, slow rays, light glinting
// along the horizon and soft mist drifting through the valleys.
// Colors + sun position: components/loader/sunrise-sky.css (--sr-*).
type SunriseSkyProps = {
  /** Use fixed positioning (envelope hero covers the viewport). */
  fixed?: boolean;
  /** Tall scrolling sections: the painting is a screen-high band at the top
   *  that fades into the section's own sunrise wash below. */
  band?: boolean;
};

export function SunriseSky({ fixed = false, band = false }: SunriseSkyProps) {
  return (
    <div
      className={`sunrise-sky${fixed ? ' sunrise-sky--fixed' : ''}${band ? ' sunrise-sky--band' : ''}`}
      aria-hidden="true"
    >
      <div className="sunrise-sky__painting" />
      <div className="sunrise-sky__rays" />
      <div className="sunrise-sky__glow" />
      <div className="sunrise-sky__core" />
      <div className="sunrise-sky__glints" />
      <div className="sunrise-sky__mist" />
      <div className="sunrise-sky__dawn" />
    </div>
  );
}
