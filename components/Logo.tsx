import Link from "next/link";

const Logo = () => (
  <Link href="/" className="flex items-center gap-2 text-xl font-bold text-white">
    <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden="true">
      <rect width="28" height="28" rx="7" fill="#FDD458" />
      <path d="M6 18l5-5 4 4 7-8" stroke="#050505" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
    Signalist
  </Link>
);

export default Logo;
