export default function CyberSecurityCallout() {
  return (
    <div className="relative col-span-1 overflow-hidden rounded-2xl p-6 text-primary-foreground md:col-span-3" style={{ background: 'var(--gradient-hero)' }}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="lucide lucide-shield absolute -right-6 -top-6 h-32 w-32 text-white/5"
        aria-hidden="true"
      >
        <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
      </svg>
      <div className="text-xs uppercase tracking-[0.2em] text-white/60">If you've been targeted</div>
      <div className="mt-4 font-serif text-3xl font-bold leading-tight">
        Call <span className="text-accent-foreground">1930</span>
      </div>
      <p className="mt-2 text-sm text-white/70">
        Indias national cybercrime helpline 347. Report online at{' '}
        <a
          className="underline underline-offset-2"
          href="https://cybercrime.gov.in"
          target="_blank"
          rel="noreferrer"
        >
          cybercrime.gov.in
        </a>
        .
      </p>
      
    </div>
  );
}

