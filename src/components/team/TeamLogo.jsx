export default function TeamLogo({ logo, size = 48, className = '' }) {
  const isImage = typeof logo === 'string' && logo.startsWith('data:');
  return (
    <div
      className={`rounded-2xl glass flex items-center justify-center overflow-hidden shrink-0 ${className}`}
      style={{ width: size, height: size, fontSize: size * 0.5 }}
    >
      {isImage ? (
        <img src={logo} alt="Team logo" className="w-full h-full object-cover" />
      ) : (
        <span>{logo}</span>
      )}
    </div>
  );
}
