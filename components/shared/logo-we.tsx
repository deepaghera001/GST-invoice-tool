import React from "react";

export const LogoWE = ({ className = "h-8 w-8" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      {/* Animated gradient border - more sophisticated colors */}
      <linearGradient id="we-anim-border" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%">
          <animate 
            attributeName="stop-color" 
            values="#6366f1;#a855f7;#ec4899;#6366f1" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </stop>
        <stop offset="50%">
          <animate 
            attributeName="stop-color" 
            values="#a855f7;#ec4899;#6366f1;#a855f7" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </stop>
        <stop offset="100%">
          <animate 
            attributeName="stop-color" 
            values="#ec4899;#6366f1;#a855f7;#ec4899" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </stop>
      </linearGradient>

      {/* Background mesh gradient animation */}
      <radialGradient id="we-bg-gradient" cx="50%" cy="50%" r="50%" gradientUnits="userSpaceOnUse">
        <stop offset="0%">
          <animate 
            attributeName="stop-color" 
            values="#1e1b4b;#312e81;#1e1b4b" 
            dur="6s" 
            repeatCount="indefinite" 
          />
        </stop>
        <stop offset="100%">
          <animate 
            attributeName="stop-color" 
            values="#0f172a;#1e1b4b;#0f172a" 
            dur="6s" 
            repeatCount="indefinite" 
          />
        </stop>
      </radialGradient>

      {/* Glassmorphism blur filter */}
      <filter id="we-glass-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
      </filter>

      {/* Soft glow filter */}
      <filter id="we-glow" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
        <feMerge>
          <feMergeNode in="coloredBlur"/>
          <feMergeNode in="SourceGraphic"/>
        </feMerge>
      </filter>

      {/* Text gradient */}
      <linearGradient id="we-text-gradient" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" />
        <stop offset="100%" stopColor="#c7d2fe" />
      </linearGradient>

      {/* Clip path for rounded corners */}
      <clipPath id="we-clip">
        <rect x="2" y="2" width="60" height="60" rx="12" />
      </clipPath>
    </defs>

    {/* Background with animated gradient */}
    <rect 
      x="2" 
      y="2" 
      width="60" 
      height="60" 
      rx="12" 
      fill="url(#we-bg-gradient)" 
    />

    {/* Animated background shapes for depth */}
    <g clipPath="url(#we-clip)" opacity="0.3">
      {/* Floating circle 1 */}
      <circle cx="10" cy="10" r="15" fill="#6366f1" filter="url(#we-glass-blur)">
        <animate 
          attributeName="cy" 
          values="10;54;10" 
          dur="8s" 
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="cx" 
          values="10;54;10" 
          dur="10s" 
          repeatCount="indefinite" 
        />
      </circle>
      
      {/* Floating circle 2 */}
      <circle cx="54" cy="54" r="12" fill="#ec4899" filter="url(#we-glass-blur)">
        <animate 
          attributeName="cy" 
          values="54;10;54" 
          dur="7s" 
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="cx" 
          values="54;10;54" 
          dur="9s" 
          repeatCount="indefinite" 
        />
      </circle>

      {/* Floating circle 3 */}
      <circle cx="32" cy="32" r="8" fill="#a855f7" filter="url(#we-glass-blur)">
        <animate 
          attributeName="r" 
          values="8;12;8" 
          dur="4s" 
          repeatCount="indefinite" 
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          from="0 32 32"
          to="360 32 32"
          dur="20s"
          repeatCount="indefinite"
        />
      </circle>
    </g>

    {/* Glass overlay */}
    <rect 
      x="2" 
      y="2" 
      width="60" 
      height="60" 
      rx="12" 
      fill="url(#we-glass-overlay)" 
      opacity="0.1"
    />
    <defs>
      <linearGradient id="we-glass-overlay" x1="0" y1="0" x2="0" y2="64" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.2" />
        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
      </linearGradient>
    </defs>

    {/* Animated gradient border */}
    <rect 
      x="2" 
      y="2" 
      width="60" 
      height="60" 
      rx="12" 
      fill="none" 
      stroke="url(#we-anim-border)" 
      strokeWidth="2.5"
      filter="url(#we-glow)"
    >
      <animate 
        attributeName="stroke-width" 
        values="2.5;3.5;2.5" 
        dur="3s" 
        repeatCount="indefinite" 
      />
    </rect>

    {/* Subtle inner border for depth */}
    <rect 
      x="5" 
      y="5" 
      width="54" 
      height="54" 
      rx="10" 
      fill="none" 
      stroke="#ffffff" 
      strokeOpacity="0.1"
      strokeWidth="1"
    />

    {/* WE Text with gradient and subtle animation */}
    <text
      x="50%"
      y="50%"
      dominantBaseline="middle"
      textAnchor="middle"
      fontFamily="Inter, system-ui, -apple-system, sans-serif"
      fontSize="26"
      fontWeight="800"
      fill="url(#we-text-gradient)"
      letterSpacing="-0.02em"
      filter="url(#we-glow)"
      dy="0.05em"
    >
      WE
      <animate 
        attributeName="opacity" 
        values="0.9;1;0.9" 
        dur="4s" 
        repeatCount="indefinite" 
      />
    </text>

    {/* Subtle shine effect overlay */}
    <rect 
      x="2" 
      y="2" 
      width="60" 
      height="60" 
      rx="12" 
      fill="url(#we-shine)" 
      opacity="0.3"
      style={{ mixBlendMode: 'overlay' }}
    >
      <defs>
        <linearGradient id="we-shine" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="45%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0.3" />
          <stop offset="55%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          <animateTransform
            attributeName="gradientTransform"
            type="translate"
            values="-64,0;64,0"
            dur="5s"
            repeatCount="indefinite"
          />
        </linearGradient>
      </defs>
    </rect>
  </svg>
);