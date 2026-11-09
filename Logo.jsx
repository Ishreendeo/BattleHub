export default function Logo({ size = 36, animated = false }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={animated ? 'animate-pulse' : ''}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="bhGrad" x1="0" y1="0" x2="48" y2="48" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#8b5cf6" />
          <stop offset="100%" stopColor="#22d3ee" />
        </linearGradient>
      </defs>
      <path
        d="M24 2 L44 12 V28 C44 38 35 44.5 24 46 C13 44.5 4 38 4 28 V12 Z"
        fill="url(#bhGrad)"
        opacity="0.18"
        stroke="url(#bhGrad)"
        strokeWidth="1.5"
      />
      <path d="M17 14 H24.5 C28 14 30 16 30 19 C30 21.5 28.5 22.8 27 23.2 C29 23.6 31 25 31 28 C31 31.2 28.5 33 24.5 33 H17 Z M21 17.5 V21.8 H24 C25.6 21.8 26.3 21 26.3 19.6 C26.3 18.2 25.5 17.5 24 17.5 Z M21 25 V29.5 H24.5 C26.3 29.5 27.2 28.6 27.2 27.2 C27.2 25.8 26.3 25 24.5 25 Z" fill="#f1f5f9" />
    </svg>
  );
}
