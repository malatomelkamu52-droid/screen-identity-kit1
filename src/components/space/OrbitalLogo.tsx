export function OrbitalLogo({ className = "size-[26px]" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 drop-shadow-[0_0_8px_rgba(245,166,35,0.4)] ${className}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="orbital-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Outer boundary ring */}
      <circle
        cx="24"
        cy="24"
        r="22"
        stroke="#F5A623"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        filter="url(#orbital-glow)"
      />

      {/* Orbital arc */}
      <ellipse
        cx="24"
        cy="24"
        rx="18"
        ry="8"
        stroke="#F5A623"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        opacity="0.55"
        transform="rotate(-20 24 24)"
      />

      {/* Stylized continent outlines */}
      <path
        d="M14 20c2-3 6-4 9-2s5 6 3 9-7 3-10 1"
        stroke="#F5A623"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M26 14c3 1 6 4 5 7s-5 4-7 2"
        stroke="#F5A623"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M18 32c2 2 6 2 9-1"
        stroke="#F5A623"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Small locator dot */}
      <circle cx="34" cy="16" r="2" fill="#F5A623" opacity="0.9" />
    </svg>
  );
}

export function OrbitalBrandHeader({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 whitespace-nowrap ${className}`}>
      <OrbitalLogo />
      <span className="font-mono text-[11px] font-medium uppercase tracking-[0.2em]">
        <span className="text-zinc-200">ORBITAL </span>
        <span className="text-[#F5A623]">INTELLIGENCE</span>
      </span>
    </div>
  );
}
