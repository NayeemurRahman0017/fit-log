import Link from "next/link";
export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050505]">
        <div className="container mx-auto">
      <div className="container-fit flex min-h-35 flex-col justify-between gap-6 py-8 sm:flex-row sm:items-end">
        <Link
          href="/"
          className="flex items-center gap-2"
        >
          <span className="grid size-8 place-items-center rounded-full bg-acid text-ink">
            <svg
              aria-hidden="true"
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              color="#C2F800"
            >
              <path d="M6.5 6.5v11M17.5 6.5v11M3 9v6M21 9v6M6.5 12h11" />
            </svg>
          </span>

          <span className="display text-lg font-bold text-white/40">
            FITLOG
          </span>
        </Link>

        <p className="m-0 text-xs text-white/40">
          © 2026 FitLog — Workout Library. Train hard,
          log honest.
        </p>
      </div>
      </div>
    </footer>
  );
}